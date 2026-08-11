// charts & telemetry options
import type { EChartsOption } from 'echarts';

export const speedOptions: EChartsOption = {
  series: [
    {
      type: 'gauge',
      startAngle: 210, // Starts at bottom left
      endAngle: -30,   // Ends at bottom right (240 degree sweep)
      min: 0,
      max: 60,
      
      // Hide the traditional needle
      pointer: { show: true }, 
      
      // The blue filled line
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: { color: '#3b82f6' } 
      },
      
      // The dark gray background track
      axisLine: {
        lineStyle: { width: 12, color: [[1, '#3f3f46']] }
      },
      
      // Hide the default ticks and numbers around the edge
      splitLine: { show: true },
      axisTick: { show: true },
      
      // Turn the labels on, but strictly format them
      axisLabel: {
        show: true,
        distance: -40, // Pushes the text outward/downward from the track
        color: '#9ca3af', // Matches the Tailwind text-gray-400 color
        fontSize: 16,
        formatter: function (value: number) {
          // Only render the text if it is exactly the min (0) or max (200)
          if (value === 0 || value === 60) {
            return value.toString();
          }
          return '';
        }
      },
      
      // The text in the middle
      detail: {
        valueAnimation: true,
        formatter: '{value}\n{a|km/h}', // Stacks the value and the unit
        rich: {
          a: { fontSize: 14, color: '#9ca3af', padding: [4, 0, 0, 0] }
        },
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        offsetCenter: [0, '50%'] // Perfectly centers the text
      },
      
      // The actual speed value
      data: [{ value: 24 }]
    }
  ]
};

export const steeringAngleOptions: EChartsOption = {
  series: [
    {
      type: 'gauge',
      startAngle: 180, // Starts at bottom left
      endAngle: 0,   // Ends at bottom right (240 degree sweep)
      min: -90,
      max: 90,
      
      // Hide the traditional needle
      pointer: { show: false }, 
      
      // The blue filled line
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: true,
        itemStyle: { color: '#7e4cd8' } 
      },
      
      // The dark gray background track
      axisLine: {
        lineStyle: { width: 12, color: [[1, '#3f3f46']] }
      },
      
      // Hide the default ticks and numbers around the edge
      splitLine: { show: false },
      axisTick: { show: false },
      
      // Turn the labels on, but strictly format them
      axisLabel: {
        show: true,
        distance: -52, // Pushes the text outward/downward from the track
        color: '#9ca3af', // Matches the Tailwind text-gray-400 color
        fontSize: 16,
        formatter: function (value: number) {
          // Only render the text if it is exactly the min (0) or max (200)
          if (value === -90|| value === 90) {
            return value.toString() + "°";
          }
          return '';
        }
      },
      
      // The text in the middle
      detail: {
        valueAnimation: true,
        formatter: '{value}°', // Stacks the value and the unit
        rich: {
          a: { fontSize: 14, color: '#9ca3af', padding: [4, 0, 0, 0] }
        },
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        offsetCenter: [0, '0%'] // Perfectly centers the text
      },
      
      // The actual speed value
      data: [{ value: 24 }]
    }
  ]
};

export const throttleOptions: EChartsOption = {
  series: [
    {
      type: 'gauge',
      startAngle: 210, // Starts at bottom left
      endAngle: -30,   // Ends at bottom right (240 degree sweep)
      min: 0,
      max: 100,
      
      // Hide the traditional needle
      pointer: { show: false }, 
      
      // The blue filled line
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: true,
        itemStyle: { color: '#51c85d' } 
      },
      
      // The dark gray background track
      axisLine: {
        lineStyle: { width: 12, color: [[1, '#3f3f46']] }
      },
      
      // Hide the default ticks and numbers around the edge
      splitLine: { show: false },
      axisTick: { show: false },
      
      // Turn the labels on, but strictly format them
      axisLabel: {
        show: true,
        distance: -52, // Pushes the text outward/downward from the track
        color: '#9ca3af', // Matches the Tailwind text-gray-400 color
        fontSize: 16,
        formatter: function (value: number) {
          // Only render the text if it is exactly the min (0) or max (200)
          if (value === 0|| value === 100) {
            return value.toString() + "%";
          }
          return '';
        }
      },
      
      // The text in the middle
      detail: {
        valueAnimation: true,
        formatter: '{value}%', // Stacks the value and the unit
        rich: {
          a: { fontSize: 14, color: '#9ca3af', padding: [4, 0, 0, 0] }
        },
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        offsetCenter: [0, '0%'] // Perfectly centers the text
      },
      
      // The actual speed value
      data: [{ value: 32 }]
    }
  ]
};

export const consumedMahOptions: EChartsOption = {
  series: [
    {
      type: 'gauge',
      startAngle: 210, // Starts at bottom left
      endAngle: -30,   // Ends at bottom right (240 degree sweep)
      min: 0,
      max: 10,
      
      // Hide the traditional needle
      pointer: { show: false }, 
      
      // The blue filled line
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: true,
        itemStyle: { color: '#f2bc1c' } 
      },
      
      // The dark gray background track
      axisLine: {
        lineStyle: { width: 12, color: [[1, '#3f3f46']] }
      },
      
      // Hide the default ticks and numbers around the edge
      splitLine: { show: false },
      axisTick: { show: false },
      
      // Turn the labels on, but strictly format them
      axisLabel: {
        show: true,
        distance: -52, // Pushes the text outward/downward from the track
        color: '#9ca3af', // Matches the Tailwind text-gray-400 color
        fontSize: 16,
        formatter: function (value: number) {
          // Only render the text if it is exactly the min (0) or max (200)
          if (value === 0|| value === 10) {
            return value.toString();
          }
          return '';
        }
      },
      
      // The text in the middle
      detail: {
        valueAnimation: true,
        formatter: '{value}\n{a|mAh}', // Stacks the value and the unit
        rich: {
          a: { fontSize: 14, color: '#9ca3af', padding: [4, 0, 0, 0] }
        },
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        offsetCenter: [0, '0%'] // Perfectly centers the text
      },
      
      // The actual speed value
      data: [{ value: 1.23 }]
    }
  ]
};

export const raspberryPiOptions: EChartsOption = {
  // 1. The Line Colors (Blue, Purple, Green)
  color: ['#3b82f6', '#a855f7', '#22c55e'],
  
  // 2. The Hover Tooltip
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#18181b', // zinc-900
    borderColor: '#27272a',     // zinc-800
    textStyle: { color: '#e4e4e7' }
  },
  
  // 3. The Legend (Top Center)
  legend: {
    data: ['Temperature (°C)', 'CPU Usage (%)', 'ROM Usage (%)'],
    icon: 'circle',
    textStyle: { color: '#9ca3af' }, // gray-400
    top: 0
  },
  
  // 4. Grid Spacing (Controls how much room the chart takes up)
  grid: {
    left: '2%',
    right: '2%',
    bottom: '0%',
    top: 40,
    containLabel: true
  },
  
  // 5. The X-Axis (Timestamps)
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['12:40:30', '12:41:30', '12:42:30', '12:43:30', '12:44:30', '12:45:30'],
    axisLabel: { color: '#9ca3af' },
    axisLine: { lineStyle: { color: '#3f3f46' } } // zinc-700
  },
  
  // 6. The Y-Axis (0 to 100)
  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
    axisLabel: { color: '#9ca3af' },
    splitLine: { 
      lineStyle: { color: '#27272a' } // Very faint horizontal grid lines
    }
  },
  
  // 7. The Actual Data Lines
  series: [
    {
      name: 'Temperature (°C)',
      type: 'line',
      smooth: false,      // Makes the line curved instead of jagged
      showSymbol: false, // Hides the dots on the line
      data: [68, 75, 72, 60, 70, 72]
    },
    {
      name: 'CPU Usage (%)',
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: [22, 28, 24, 20, 25, 22]
    },
    {
      name: 'ROM Usage (%)',
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: [45, 52, 48, 42, 50, 48]
    }
  ]
};

export const nanoOptions: EChartsOption = {
  // 1. The Line Colors (Blue, Purple, Green)
  color: ['#3b82f6', '#a855f7'],
  
  // 2. The Hover Tooltip
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#18181b', // zinc-900
    borderColor: '#27272a',     // zinc-800
    textStyle: { color: '#e4e4e7' }
  },
  
  // 3. The Legend (Top Center)
  legend: {
    data: ['Heap (%)', 'Stack (%)'],
    icon: 'circle',
    textStyle: { color: '#9ca3af' }, // gray-400
    top: 0
  },
  
  // 4. Grid Spacing (Controls how much room the chart takes up)
  grid: {
    left: '2%',
    right: '2%',
    bottom: '0%',
    top: 40,
    containLabel: true
  },
  
  // 5. The X-Axis (Timestamps)
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['12:40:30', '12:41:30', '12:42:30', '12:43:30', '12:44:30', '12:45:30'],
    axisLabel: { color: '#9ca3af' },
    axisLine: { lineStyle: { color: '#3f3f46' } } // zinc-700
  },
  
  // 6. The Y-Axis (0 to 100)
  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
    axisLabel: { color: '#9ca3af' },
    splitLine: { 
      lineStyle: { color: '#27272a' } // Very faint horizontal grid lines
    }
  },
  
  // 7. The Actual Data Lines
  series: [
    {
      name: 'Heap (%)',
      type: 'line',
      smooth: false,      // Makes the line curved instead of jagged
      showSymbol: false, // Hides the dots on the line
      data: [72, 82, 73, 60, 50, 78]
    },
    {
      name: 'Stack (%)',
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: [28, 14, 24, 20, 35, 32]
    },
  ]
};