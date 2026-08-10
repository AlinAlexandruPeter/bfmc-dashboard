import { Component, ViewChild, } from '@angular/core';
import { ClusterComponent } from '../../cluster/cluster.component';
import { TableComponent } from '../../table/table.component';
import { SettingsComponent } from '../../settings/settings.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    ClusterComponent,
    TableComponent,
    SettingsComponent
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
