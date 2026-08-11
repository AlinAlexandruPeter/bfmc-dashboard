import { Component } from '@angular/core';
import { BentoComponent } from '../bento/bento.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerCamera, tablerDeviceComputerCamera } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-cameras',
  imports: [
    NgIcon,
    BentoComponent,
  ],
  templateUrl: './cameras.component.html',
  styleUrl: './cameras.component.css',
  viewProviders: [provideIcons({ 
    tablerCamera,
    tablerDeviceComputerCamera
  })]
})
export class CamerasComponent {
}
