import { Component } from '@angular/core';
import { BentoComponent } from "../bento/bento.component";
import { tablerPointFill } from '@ng-icons/tabler-icons/fill';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

interface IMUData {
  label: string;
  value: number;
  unit?: string
}

interface LocalizationData {
  label: string;
  value: string | number;
  hasDot: boolean
}

interface BatteryData {
  label: string;
  value: number | string;
  unit?: string;
  textColor?: string;
}

@Component({
  selector: 'app-additional-data',
  imports: [NgIcon, BentoComponent, HlmSeparatorImports],
  templateUrl: './additional-data.component.html',
  styleUrl: './additional-data.component.css',
  viewProviders: [provideIcons({
    tablerPointFill
  })]
})
export class AdditionalDataComponent {
  imuData: IMUData[] = [
    {
      label: 'Gyro X',
      value: 0.01,
      unit: '°/s'
    },
    {
      label: 'Gyro Y',
      value: -0.02,
      unit: '°/s'
    },
    {
      label: 'Gyro Z',
      value: 0.03,
      unit: '°/s'
    },
    {
      label: 'Roll',
      value: -0.02,
      unit: 'rad'
    },
    {
      label: 'Pitch',
      value: 0.01,
      unit: 'rad'
    },
    {
      label: 'Yaw',
      value: 1.57,
      unit: 'rad'
    },
    {
      label: 'Euler Roll',
      value: -0.02,
      unit: '°'
    },
    {
      label: 'Euler Pitch',
      value: 0.01,
      unit: '°'
    },
    {
      label: 'Euler Yaw',
      value: 89.97,
      unit: '°'
    },
    {
      label: 'Acc X',
      value: 0.05,
      unit: 'g'
    },
    {
      label: 'Acc Y',
      value: -0.02,
      unit: 'g'
    },
    {
      label: 'Acc Z',
      value: 1.01,
      unit: 'g'
    },
  ]

  localizationData: LocalizationData[] = [
    {
      label: 'Healthy',
      value: 'True',
      hasDot: true
    },
    {
      label: 'Imu Fresh',
      value: 'True',
      hasDot: true
    },
    {
      label: 'UWB Fresh',
      value: 'True',
      hasDot: true
    },
    {
      label: 'Lane Keeping',
      value: 0.93,
      hasDot: false
    },
    {
      label: 'Steer',
      value: 0.00,
      hasDot: false
    },
    {
      label: 'Confidence',
      value: 0.98,
      hasDot: false
    },
    {
      label: 'Timestamp',
      value: '12:45:30',
      hasDot: false
    },
    {
      label: 'Signal Alive',
      value: 'True',
      hasDot: true
    },
    {
      label: 'Serial Connection',
      value: 'True',
      hasDot: true
    },
    {
      label: 'Curve Active',
      value: 'False',
      hasDot: true
    },
  ]

  batteryData: BatteryData[] = [
    {
      label: 'Voltage',
      value: '34.5',
      unit: 'V',
    },
    {
      label: 'Current',
      value: '34.5',
      unit: 'A',
    },
    {
      label: 'Temperature',
      value: '55.9',
      unit: '°C',
    },
    {
      label: 'Health',
      value: 'Good',
      textColor: 'green',
    },
  ]

  batteryLevel = 78;
}
