import { Component, ViewChild, } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ClusterComponent } from '../../cluster/cluster.component';
import { TableComponent } from '../../table/table.component';
import { SettingsComponent } from '../../settings/settings.component';
import { BentoComponent } from './bento/bento.component';
import { HlmButton } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ChartsComponent } from "./charts/charts.component";
import { TelemetryComponent } from "./telemetry/telemetry.component";
import { CamerasComponent } from "./cameras/cameras.component";
import { AdditionalDataComponent } from './additional-data/additional-data.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    ClusterComponent,
    TableComponent,
    SettingsComponent,
    NgxEchartsDirective,
    BentoComponent,
    HlmButton,
    NgIcon,
    ChartsComponent,
    TelemetryComponent,
    CamerasComponent,
    AdditionalDataComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  showAlert: boolean = false;
  showSettingsModal: boolean = false;

  cursorRotationSliderValue: number = 0;
  carPositionSliderValue: number = 0;
  carLeftLaneOn: boolean = false;
  carRightLaneOn: boolean = false;

  private alertInterval: any;

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
