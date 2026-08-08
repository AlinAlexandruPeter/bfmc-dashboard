'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { io } = require('socket.io-client');

const port = 5055;
const serverPath = path.resolve(__dirname, 'dashboard-simulator.js');
const server = spawn(process.execPath, [serverPath], {
  env: { ...process.env, SIM_PORT: String(port), SIM_CAMERAS: '0' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let serverOutput = '';
server.stdout.on('data', chunk => { serverOutput += chunk.toString(); });
server.stderr.on('data', chunk => { serverOutput += chunk.toString(); });

let socket;

main()
  .catch(error => {
    console.error(error.stack || error);
    if (serverOutput) console.error(serverOutput);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (socket) socket.close();
    if (!server.killed) server.kill('SIGTERM');
    await Promise.race([onceProcessExit(server), delay(2000)]);
  });

async function main() {
  await waitFor(() => serverOutput.includes('Socket.IO server listening'), 3000);

  const speeds = [];
  const steers = [];
  let collectTelemetry = false;
  let limitsSeen = false;
  let locationSeen = false;
  let batterySeen = false;

  socket = io(`http://127.0.0.1:${port}`, {
    reconnection: false,
    timeout: 2000,
    transports: ['websocket'],
  });

  socket.on('CurrentSpeed', ({ value }) => {
    if (collectTelemetry) speeds.push(Number(value));
  });
  socket.on('CurrentSteer', ({ value }) => {
    if (collectTelemetry) steers.push(Number(value));
  });
  socket.on('SteeringLimits', () => { limitsSeen = true; });
  socket.on('Location', () => { locationSeen = true; });
  socket.on('BatteryLvl', () => { batterySeen = true; });

  await onceSocket(socket, 'connect', 2500);
  socket.emit('message', JSON.stringify({ Name: 'SessionAccess' }));
  const access = await onceSocket(socket, 'session_access', 2000);
  assert.equal(access.data, true, 'simulator should grant the first dashboard session');

  collectTelemetry = true;
  socket.emit('message', JSON.stringify({ Name: 'Klem', Value: '30' }));
  socket.emit('message', JSON.stringify({ Name: 'DrivingMode', Value: 'manual' }));
  socket.emit('message', JSON.stringify({ Name: 'SpeedMotor', Value: '200' }));
  socket.emit('message', JSON.stringify({ Name: 'SteerMotor', Value: '250' }));

  await delay(1600);

  const positiveSpeeds = speeds.filter(value => value > 0);
  const positiveSteers = steers.filter(value => value > 0);
  const speedSteps = positiveSpeeds.slice(1).map((value, index) => value - positiveSpeeds[index]);

  assert.ok(positiveSpeeds.length >= 5, 'speed telemetry should arrive repeatedly');
  assert.ok(positiveSpeeds[0] < 200, 'speed must ramp instead of jumping to its target');
  assert.ok(positiveSpeeds.at(-1) >= 190, 'speed should eventually reach its target');
  assert.ok(speedSteps.every(step => step <= 40), 'speed ramp steps should remain bounded');
  assert.ok(positiveSteers.some(value => value < 240), 'steering must ramp instead of jumping');
  assert.ok(positiveSteers.some(value => value >= 249), 'steering should eventually reach its target');
  assert.ok(limitsSeen, 'steering limits event should be emitted');
  assert.ok(locationSeen, 'location telemetry should be emitted');
  assert.ok(batterySeen, 'battery telemetry should be emitted');

  console.log(JSON.stringify({
    sessionGranted: true,
    speedSamples: speeds.slice(0, 12),
    steerSamples: steers.slice(0, 8),
    events: { limitsSeen, locationSeen, batterySeen },
  }, null, 2));
}

function onceSocket(target, eventName, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      target.off(eventName, onEvent);
      reject(new Error(`Timed out waiting for Socket.IO event: ${eventName}`));
    }, timeoutMs);

    function onEvent(payload) {
      clearTimeout(timer);
      resolve(payload);
    }

    target.once(eventName, onEvent);
  });
}

function onceProcessExit(child) {
  if (child.exitCode !== null) return Promise.resolve();
  return new Promise(resolve => child.once('exit', resolve));
}

async function waitFor(predicate, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (!predicate()) {
    if (Date.now() > deadline) throw new Error('Simulator did not start in time');
    await delay(25);
  }
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
