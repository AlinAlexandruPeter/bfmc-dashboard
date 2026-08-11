import { Component } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { BentoComponent } from '../bento/bento.component';
import { nanoOptions, raspberryPiOptions } from '../charts.options';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-charts',
  imports: [
    NgxEchartsDirective,
    BentoComponent,
  ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css',
})
export class ChartsComponent {
  raspberryPiOptions: EChartsOption = raspberryPiOptions;
  nanoOptions: EChartsOption = nanoOptions;
}
