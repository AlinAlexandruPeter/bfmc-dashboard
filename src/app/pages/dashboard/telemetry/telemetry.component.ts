import { Component } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { BentoComponent } from '../bento/bento.component';
import { 
  consumedMahOptions, 
  speedOptions, 
  steeringAngleOptions, 
  throttleOptions 
} from '../charts.options';
import { 
  tablerHandFinger, 
  tablerHourglassEmpty, 
  tablerOlympicTorch, 
  tablerSteeringWheel, 
} from '@ng-icons/tabler-icons';
import type { EChartsOption } from 'echarts';
import { HlmButton } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-telemetry',
  imports: [
    NgxEchartsDirective,
    BentoComponent,
    HlmButton,
    NgIcon,
  ],
  templateUrl: './telemetry.component.html',
  styleUrl: './telemetry.component.css',
  viewProviders: [provideIcons({ 
    tablerHourglassEmpty,
    tablerHandFinger,
    tablerOlympicTorch,
    tablerSteeringWheel
  })]
})
export class TelemetryComponent {
  speedOptions: EChartsOption = speedOptions;
  steeringAngleOptions: EChartsOption = steeringAngleOptions;
  throttleOptions: EChartsOption = throttleOptions;
  consumedMahOptions: EChartsOption = consumedMahOptions;
}
