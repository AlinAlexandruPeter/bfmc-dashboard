import { Component, ViewChild, } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ClusterComponent } from '../../cluster/cluster.component';
import { TableComponent } from '../../table/table.component';
import { SettingsComponent } from '../../settings/settings.component';
import { BentoComponent } from './bento/bento.component';
import { HlmButton } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  consumedMahOptions, 
  speedOptions, 
  steeringAngleOptions, 
  throttleOptions 
} from './charts.options';
import { 
  tablerHandFinger, 
  tablerHourglassEmpty, 
  tablerOlympicTorch, 
  tablerSteeringWheel, 
} from '@ng-icons/tabler-icons';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  imports: [
    ClusterComponent,
    TableComponent,
    SettingsComponent,
    NgxEchartsDirective,
    BentoComponent,
    HlmButton,
    NgIcon
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  viewProviders: [provideIcons({ 
    tablerHourglassEmpty,
    tablerHandFinger,
    tablerOlympicTorch,
    tablerSteeringWheel
  })]
})
export class DashboardComponent {
  showAlert: boolean = false;
  showSettingsModal: boolean = false;

  cursorRotationSliderValue: number = 0;
  carPositionSliderValue: number = 0;
  carLeftLaneOn: boolean = false;
  carRightLaneOn: boolean = false;

  private alertInterval: any;

  speedOptions: EChartsOption = speedOptions;
  steeringAngleOptions: EChartsOption = steeringAngleOptions;
  throttleOptions: EChartsOption = throttleOptions;
  consumedMahOptions: EChartsOption = consumedMahOptions;

  @ViewChild(ClusterComponent) clusterComponent!: ClusterComponent;
  @ViewChild(TableComponent) tableComponent!: TableComponent;

  dismissAlert() {
    this.showAlert = false;

    if (this.alertInterval) {
      clearInterval(this.alertInterval);
    }

    this.alertInterval = setInterval(() => {
      this.showAlert = true;
    }, 900000);
  }

  openSettings() {
    this.showSettingsModal = true;
  }

  closeSettings() {
    this.showSettingsModal = false;
  }
}
