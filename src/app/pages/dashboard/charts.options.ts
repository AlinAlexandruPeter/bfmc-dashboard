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