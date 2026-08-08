'use strict';

/**
 * Standalone Socket.IO replacement for src/dashboard/processDashboard.py.
 *
 * It intentionally uses the production event names and payload envelopes so
 * the Angular dashboard can switch between the real car and this simulator
 * without component-specific mock code.
 */

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { Server } = require('socket.io');

const args = new Set(process.argv.slice(2));
if (args.has('--help')) {
  console.log(`BFMC dashboard simulator

Usage:
  npm run simulator

Environment variables:
  SIM_HOST=0.0.0.0       Listening interface
  SIM_PORT=5005          Socket.IO/HTTP port
  SIM_TELEMETRY_HZ=10    Speed, steer, pose and current update rate
  SIM_CAMERAS=1          Emit placeholder front/rear JPEG frames (0 disables)
  SIM_SEED=2027          Deterministic noise seed
`);
  process.exit(0);
}

const config = {
  host: process.env.SIM_HOST || '0.0.0.0',
  port: positiveInt(process.env.SIM_PORT, 5005),
  physicsHz: 20,
  telemetryHz: clamp(positiveInt(process.env.SIM_TELEMETRY_HZ, 10), 1, 20),
  camerasEnabled: process.env.SIM_CAMERAS !== '0',
  maxSpeed: 500,
  maxSteer: 250,
  speedUpPerSecond: 200,   // production CommandShaper: 10 units/tick at 20 Hz
  speedDownPerSecond: 700, // production CommandShaper: 35 units/tick at 20 Hz
  brakePerSecond: 1000,
  steerPerSecond: 700,     // production CommandShaper: 35 units/tick at 20 Hz
  mapWidthM: 20.67,
  mapHeightM: 13.76,
  wheelbaseM: 0.26,
};

let randomState = positiveInt(process.env.SIM_SEED, 2027) >>> 0;

const state = {
  activeSocketId: null,
  kl: '0',
  drivingMode: 'stop',
  requestedSpeed: 0,
  requestedSteer: 0,
  actualSpeed: 0,
  actualSteer: 0,
  braking: false,
  timedControlUntilMs: 0,
  autoStartedMs: Date.now(),
  autoPhase: 'idle',
  batteryPercent: 96,
  currentMilliAmps: 0,
  recording: false,
  serialConnected: true,
  enableInstant: true,
  enableBattery: true,
  enableImu: true,
  enableResourceMonitor: true,
  navigationGoal: null,
  pose: { x: 2.1, y: 2.0, yawRad: 0 },
  previousSpeed: 0,
  warningIndex: 0,
  semaphoreStep: 0,
  calibration: { left: false, right: false, test_run: false, backward: false },
};

const warningNames = [
  'crosswalk', 'intersection', 'priority', 'roundabout', 'traffic_light',
  'speed_limit_30_in', 'parking', 'stop',
];
const warningIds = [4, 8, 13, 15, 21, 18, 10, 20];

const autoPhases = [
  { seconds: 3, speed: 0, steer: 0, name: 'ready' },
  { seconds: 8, speed: 220, steer: 0, name: 'accelerating' },
  { seconds: 5, speed: 180, steer: 120, name: 'right_curve' },
  { seconds: 8, speed: 300, steer: 0, name: 'straight' },
  { seconds: 5, speed: 160, steer: -160, name: 'left_curve' },
  { seconds: 6, speed: 240, steer: 30, name: 'recovering' },
  { seconds: 4, speed: 0, steer: 0, name: 'stop_line' },
];

// Small valid JPEG. It exercises both camera subscriptions without introducing
// a native canvas/image dependency in the simulator.
const placeholderJpeg =
  '/9j/4AAQSkZJRgABAQAAAAAAAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAv/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJ8AYP/Z';

const tableStatePath = path.resolve(__dirname, '../../../utils/table_state.json');
let tableState = readJson(tableStatePath, {});

const httpServer = http.createServer((request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Content-Type', 'application/json');

  if (request.url === '/' || request.url === '/health') {
    response.writeHead(200);
    response.end(JSON.stringify({
      service: 'bfmc-dashboard-simulator',
      status: 'ok',
      clients: io.engine.clientsCount,
      mode: state.drivingMode,
      kl: state.kl,
    }));
    return;
  }

  response.writeHead(404);
  response.end(JSON.stringify({ error: 'not_found' }));
});

const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

io.on('connection', (socket) => {
  console.log(`[simulator] dashboard connected: ${socket.id}`);
  socket.emit('after connect', { data: 'Connected to BFMC simulator' });
  emitInitialState(socket);

  socket.on('message', (rawMessage) => handleDashboardMessage(socket, rawMessage));

  socket.on('save', (rawTableState) => {
    const parsed = parseJson(rawTableState);
    if (parsed && typeof parsed === 'object') {
      tableState = parsed;
      socket.emit('response', { data: 'Table state saved in simulator memory' });
    } else {
      socket.emit('response', { error: 'Invalid JSON format' });
    }
  });

  socket.on('load', () => {
    socket.emit('loadBack', { data: tableState });
  });

  socket.on('disconnect', () => {
    if (state.activeSocketId === socket.id) {
      state.activeSocketId = null;
    }
    console.log(`[simulator] dashboard disconnected: ${socket.id}`);
  });
});

function handleDashboardMessage(socket, rawMessage) {
  const message = parseJson(rawMessage);
  if (!message || typeof message !== 'object' || !message.Name) {
    socket.emit('response', { error: 'Invalid JSON format' });
    return;
  }

  const name = String(message.Name);

  if (name === 'SessionAccess') {
    const granted = !state.activeSocketId || state.activeSocketId === socket.id;
    if (granted) state.activeSocketId = socket.id;
    socket.emit('session_access', { data: granted });
    if (granted) emitInitialState(socket);
  } else if (state.activeSocketId && state.activeSocketId !== socket.id) {
    socket.emit('response', { error: 'Another dashboard owns the active session' });
    return;
  } else {
    handleCommand(socket, name, message);
  }

  socket.emit('response', { data: `Message received: ${stringifyForLog(message)}` });
}

function handleCommand(socket, name, message) {
  const value = message.Value;

  switch (name) {
    case 'Heartbeat':
      break;
    case 'SessionEnd':
      if (state.activeSocketId === socket.id) state.activeSocketId = null;
      break;
    case 'GetCurrentSerialConnectionState':
      socket.emit('current_serial_connection_state', { data: state.serialConnected });
      break;
    case 'RequestSteerLimits':
      socket.emit('SteeringLimits', steeringLimitsPayload());
      break;
    case 'Klem':
      state.kl = String(value);
      if (state.kl !== '30') stopRequestedMotion();
      console.log(`[simulator] KL -> ${state.kl}`);
      break;
    case 'DrivingMode':
      state.drivingMode = String(value).toLowerCase();
      state.autoStartedMs = Date.now();
      state.braking = state.drivingMode === 'stop';
      if (state.braking) stopRequestedMotion();
      emitEvent('StateChange', state.drivingMode.toUpperCase());
      console.log(`[simulator] driving mode -> ${state.drivingMode}`);
      break;
    case 'SpeedMotor':
      state.requestedSpeed = clampNumber(value, -config.maxSpeed, config.maxSpeed);
      state.braking = false;
      break;
    case 'SteerMotor':
      state.requestedSteer = clampNumber(value, -config.maxSteer, config.maxSteer);
      break;
    case 'Brake':
      stopRequestedMotion();
      state.braking = true;
      break;
    case 'Control':
      if (value && typeof value === 'object') {
        state.requestedSpeed = clampNumber(value.Speed, -config.maxSpeed, config.maxSpeed);
        state.requestedSteer = clampNumber(value.Steer, -config.maxSteer, config.maxSteer);
        state.timedControlUntilMs = Date.now() + Math.max(0, number(value.Time)) * 100;
        state.braking = false;
      }
      break;
    case 'ToggleInstant':
      state.enableInstant = booleanValue(value);
      break;
    case 'ToggleBatteryLvl':
      state.enableBattery = booleanValue(value);
      break;
    case 'ToggleImuData':
      state.enableImu = booleanValue(value);
      break;
    case 'ToggleResourceMonitor':
      state.enableResourceMonitor = booleanValue(value);
      break;
    case 'Record':
      state.recording = booleanValue(value);
      emitEvent('Recording', state.recording);
      break;
    case 'NavigationGoal':
      state.navigationGoal = value?.goal_node ?? null;
      emitEvent('NavigationState', {
        active: true,
        goal_node: state.navigationGoal,
        status: 'simulated_route_ready',
      });
      break;
    case 'Calibration':
      handleCalibration(socket, message);
      break;
    default:
      // Dashboard-owned configuration channels are accepted and echoed so the
      // generic table behaves like it does against the gateway-backed server.
      emitEvent(name, value);
      break;
  }
}

function handleCalibration(socket, message) {
  const action = message.Action;
  if (action === 'get_status') {
    socket.emit('Calibration', { action: 'calibration_status', ...state.calibration });
  } else if (action === 'run' || action === 'current_angle') {
    const direction = message.Direction || 'right';
    const angle = direction === 'left' ? -10 : direction === 'right' ? 10 : 0;
    socket.emit('Calibration', { action: 'current_angle', data: angle });
    setTimeout(() => socket.emit('Calibration', { action: 'calibration_run_done' }), 800);
  } else if (action === 'submit_measurements') {
    const direction = message.Direction;
    if (direction && Object.hasOwn(state.calibration, direction)) {
      state.calibration[direction] = true;
    }
    socket.emit('Calibration', { action: 'measurements_received' });
  } else if (action === 'test_run_done') {
    state.calibration.test_run = true;
    socket.emit('Calibration', { action: 'test_run_done' });
  } else if (action === 'save_calibration') {
    socket.emit('Calibration', { action: 'calibration_saved', success: true, zipData: null });
  } else if (action === 'get_polynomial_data') {
    socket.emit('Calibration', { action: 'polynomial_data', hasData: false, speedData: null, steerData: null });
  } else if (action === 'get_zero_offset_spline_data') {
    socket.emit('Calibration', { action: 'zero_offset_spline_data', zeroOffsetData: null });
  }
}

function emitInitialState(socket) {
  socket.emit('current_serial_connection_state', { data: state.serialConnected });
  socket.emit('SerialConnectionState', { value: state.serialConnected });
  socket.emit('EnableButton', { value: true });
  socket.emit('AliveSignal', { value: true });
  socket.emit('SteeringLimits', steeringLimitsPayload());
  socket.emit('BatteryLvl', { value: round(state.batteryPercent, 1) });
  socket.emit('CurrentSpeed', { value: round(state.actualSpeed, 1) });
  socket.emit('CurrentSteer', { value: round(state.actualSteer, 1) });
}

function physicsStep() {
  const dt = 1 / config.physicsHz;
  const target = requestedTargets();
  const speedRate = state.braking
    ? config.brakePerSecond
    : isSlowing(state.actualSpeed, target.speed)
      ? config.speedDownPerSecond
      : config.speedUpPerSecond;

  state.previousSpeed = state.actualSpeed;
  state.actualSpeed = moveToward(state.actualSpeed, target.speed, speedRate * dt);
  state.actualSteer = moveToward(state.actualSteer, target.steer, config.steerPerSecond * dt);

  if (Math.abs(state.actualSpeed) < 0.01 && target.speed === 0) {
    state.actualSpeed = 0;
    state.braking = false;
  }
  if (Math.abs(state.actualSteer) < 0.01 && target.steer === 0) state.actualSteer = 0;

  updateElectricalModel(dt);
  updatePose(dt);
}

function requestedTargets() {
  if (state.kl !== '30' || state.drivingMode === 'stop') {
    return { speed: 0, steer: 0 };
  }

  if (state.timedControlUntilMs > Date.now()) {
    return { speed: state.requestedSpeed, steer: state.requestedSteer };
  }
  if (state.timedControlUntilMs !== 0) {
    state.timedControlUntilMs = 0;
    stopRequestedMotion();
  }

  if (state.drivingMode === 'auto' || state.drivingMode === 'legacy') {
    return automaticTargets();
  }

  return { speed: state.requestedSpeed, steer: state.requestedSteer };
}

function automaticTargets() {
  const totalSeconds = autoPhases.reduce((sum, phase) => sum + phase.seconds, 0);
  let elapsed = ((Date.now() - state.autoStartedMs) / 1000) % totalSeconds;

  for (const phase of autoPhases) {
    if (elapsed < phase.seconds) {
      state.autoPhase = phase.name;
      return { speed: phase.speed, steer: phase.steer };
    }
    elapsed -= phase.seconds;
  }

  return { speed: 0, steer: 0 };
}

function updateElectricalModel(dt) {
  const acceleration = Math.abs(state.actualSpeed - state.previousSpeed) / dt;
  const powered = state.kl === '30' || state.kl === '15';
  const targetCurrent = powered
    ? 320
      + (Math.abs(state.actualSpeed) / config.maxSpeed) * 2700
      + Math.min(acceleration / config.speedDownPerSecond, 1) * 1300
      + (Math.abs(state.actualSteer) / config.maxSteer) * 350
    : 0;

  const alpha = 1 - Math.exp(-dt / 0.45);
  state.currentMilliAmps += (targetCurrent - state.currentMilliAmps) * alpha;

  const drainPerSecond = powered ? 0.0005 + state.currentMilliAmps * 0.0000012 : 0;
  state.batteryPercent = Math.max(0, state.batteryPercent - drainPerSecond * dt);
}

function updatePose(dt) {
  const speedMps = state.actualSpeed / 1000; // raw/10 = cm/s
  const steeringRad = (state.actualSteer / 10) * Math.PI / 180;
  const yawRate = Math.abs(steeringRad) < 1e-6
    ? 0
    : speedMps / config.wheelbaseM * Math.tan(steeringRad);

  state.pose.yawRad = normalizeRadians(state.pose.yawRad + yawRate * dt);
  state.pose.x += speedMps * Math.cos(state.pose.yawRad) * dt;
  state.pose.y += speedMps * Math.sin(state.pose.yawRad) * dt;

  // Keep the cursor inside the map during long dashboard sessions.
  state.pose.x = wrap(state.pose.x, 0.3, config.mapWidthM - 0.3);
  state.pose.y = wrap(state.pose.y, 0.3, config.mapHeightM - 0.3);
}

function emitTelemetry() {
  const speed = round(state.actualSpeed + noise(0.25), 1);
  const steer = round(state.actualSteer + noise(0.15), 1);
  const yawDeg = round(state.pose.yawRad * 180 / Math.PI, 2);
  const speedCmS = round(state.actualSpeed / 10, 2);
  const yawRateDegS = round(
    (state.actualSpeed / 1000) / config.wheelbaseM
      * Math.tan((state.actualSteer / 10) * Math.PI / 180)
      * 180 / Math.PI,
    2,
  );

  emitEvent('CurrentSpeed', speed);
  emitEvent('CurrentSteer', steer);
  emitEvent('Location', {
    x: round(state.pose.x, 3),
    y: round(state.pose.y, 3),
    timestamp: round(Date.now() / 1000, 3),
  });

  if (state.enableInstant) emitEvent('InstantConsumption', Math.round(state.currentMilliAmps));
  if (state.enableImu) {
    emitEvent('ImuData', `{\'roll\': \'0.0\', \'pitch\': \'0.0\', \'yaw\': \'${yawDeg}\', \'accelx\': \'0.0\', \'accely\': \'0.0\', \'accelz\': \'9.81\'}`);
    emitEvent('ImuRawData', {
      gyro_rads: { x: 0, y: 0, z: round(yawRateDegS * Math.PI / 180, 4) },
      euler_deg: { roll: 0, pitch: 0, yaw: yawDeg },
      accel_ms2: { x: 0, y: 0, z: 9.81 },
      device_timestamp_s: round(Date.now() / 1000, 3),
    });
  }

  emitEvent('FusedPose', {
    timestamp: round(Date.now() / 1000, 3),
    x: round(state.pose.x, 3),
    y: round(state.pose.y, 3),
    yaw_deg: yawDeg,
    yaw_rate_deg_s: yawRateDegS,
    cmd_speed_cm_s: speedCmS,
    speed_proxy_cm_s: speedCmS,
    healthy: true,
    source: 'dashboard_simulator',
  });
  emitEvent('LocalizationHealth', { healthy: true, imu_fresh: true, uwb_fresh: true });
  emitEvent('LaneKeepingNV', {
    steer: Math.round(state.actualSteer),
    confidence: 0.93,
    timestamp: round(Date.now() / 1000, 3),
  });
  emitEvent('CurveActive', Math.abs(state.actualSteer) > 80);

  if (state.navigationGoal !== null) {
    emitEvent('NavigationState', {
      active: true,
      goal_node: state.navigationGoal,
      status: 'following_simulated_route',
      phase: state.autoPhase,
    });
  }
}

function emitHardware() {
  const load = Math.abs(state.actualSpeed) / config.maxSpeed;
  const cpuUsage = clamp(24 + load * 28 + noise(3), 0, 100);
  const cpuTemp = clamp(46 + load * 13 + noise(0.8), 20, 90);
  const memory = clamp(41 + Math.sin(Date.now() / 12000) * 2 + noise(0.5), 0, 100);

  emitRaw('memory_channel', { data: round(memory, 1) });
  emitRaw('cpu_channel', { data: { usage: round(cpuUsage, 1), temp: Math.round(cpuTemp) } });
  if (state.enableResourceMonitor) {
    emitEvent('ResourceMonitor', {
      heap: round(23 + load * 4 + noise(0.3), 2).toFixed(2),
      stack: round(9 + load * 2 + noise(0.2), 2).toFixed(2),
    });
  }
  if (state.enableBattery) emitEvent('BatteryLvl', round(state.batteryPercent, 1));

  emitEvent('AliveSignal', true);
  emitEvent('EnableButton', true);
  emitEvent('SerialConnectionState', state.serialConnected);
  emitEvent('CameraStatus', { front: 'simulated', rear: 'simulated' });
}

function emitSemaphore() {
  const positions = [
    { id: 1, x: 4.3, y: 3.1 },
    { id: 2, x: 10.4, y: 8.2 },
    { id: 3, x: 16.8, y: 5.4 },
  ];
  const lights = ['green', 'yellow', 'red'];
  const item = positions[state.semaphoreStep % positions.length];
  const light = lights[Math.floor(state.semaphoreStep / positions.length) % lights.length];
  emitEvent('Semaphores', { ...item, state: light });
  state.semaphoreStep += 1;
}

function emitWarning() {
  if (state.kl !== '30' || Math.abs(state.actualSpeed) < 20) return;
  const index = state.warningIndex % warningIds.length;
  emitEvent('WarningSignal', {
    WarningID: warningIds[index],
    WarningName: warningNames[index],
  });
  state.warningIndex += 1;
}

function emitCameras() {
  if (!config.camerasEnabled) return;
  emitRaw('serialCamera', { value: placeholderJpeg });
}

function emitRearCamera() {
  if (!config.camerasEnabled) return;
  emitRaw('rearCamera', { value: placeholderJpeg });
}

function emitHeartbeat() {
  if (state.activeSocketId) emitRaw('heartbeat', { data: 'Heartbeat' });
}

function emitEvent(name, value) {
  emitRaw(name, { value });
}

function emitRaw(name, payload) {
  if (state.activeSocketId) {
    io.to(state.activeSocketId).emit(name, payload);
  } else {
    io.emit(name, payload);
  }
}

function steeringLimitsPayload() {
  return { value: { lowerLimit: String(-config.maxSteer), upperLimit: String(config.maxSteer) } };
}

function stopRequestedMotion() {
  state.requestedSpeed = 0;
  state.requestedSteer = 0;
  state.timedControlUntilMs = 0;
}

function parseJson(value) {
  if (value && typeof value === 'object') return value;
  if (typeof value !== 'string') return null;

  try {
    const parsed = JSON.parse(value);
    // Accept the accidental double-stringification used by a legacy
    // calibration callback in the Angular app.
    return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
  } catch {
    return null;
  }
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function booleanValue(value) {
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function positiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function clampNumber(value, min, max) {
  return clamp(number(value), min, max);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function moveToward(current, target, maxDelta) {
  const difference = target - current;
  if (Math.abs(difference) <= maxDelta) return target;
  return current + Math.sign(difference) * maxDelta;
}

function isSlowing(current, target) {
  return Math.sign(current) !== Math.sign(target) || Math.abs(target) < Math.abs(current);
}

function wrap(value, min, max) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

function normalizeRadians(value) {
  return wrap(value, -Math.PI, Math.PI);
}

function round(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function noise(amplitude) {
  randomState = (1664525 * randomState + 1013904223) >>> 0;
  return ((randomState / 0xffffffff) * 2 - 1) * amplitude;
}

function stringifyForLog(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

const timers = [
  setInterval(physicsStep, 1000 / config.physicsHz),
  setInterval(emitTelemetry, 1000 / config.telemetryHz),
  setInterval(emitHardware, 1000),
  setInterval(emitSemaphore, 2000),
  setInterval(emitWarning, 12000),
  setInterval(emitCameras, 100),  // production front camera rate: 10 Hz
  setInterval(emitRearCamera, 200), // production rear camera rate: 5 Hz
  setInterval(emitHeartbeat, 20000),
];

function shutdown(signal) {
  console.log(`\n[simulator] ${signal}; shutting down`);
  for (const timer of timers) clearInterval(timer);
  io.close(() => httpServer.close(() => process.exit(0)));
  setTimeout(() => process.exit(1), 2000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

httpServer.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`[simulator] port ${config.port} is already in use; stop the real backend or set SIM_PORT`);
  } else {
    console.error('[simulator] server error:', error);
  }
  process.exit(1);
});

httpServer.listen(config.port, config.host, () => {
  console.log(`[simulator] Socket.IO server listening on http://${config.host}:${config.port}`);
  console.log(`[simulator] physics=${config.physicsHz}Hz telemetry=${config.telemetryHz}Hz cameras=${config.camerasEnabled ? 'on' : 'off'}`);
  console.log('[simulator] use KL 30 + manual controls, or KL 30 + auto for the driving cycle');
});
