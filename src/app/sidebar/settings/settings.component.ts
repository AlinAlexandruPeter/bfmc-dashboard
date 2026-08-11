import { Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  tablerSettings
} from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-settings',
  imports: [NgIcon, HlmDialogImports, HlmButtonImports],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  viewProviders: [provideIcons({ 
    tablerSettings 
  })]
})
export class SettingsComponent {
  currentStep = signal(0);
  totalSteps = 3;

  nextStep(ctx: any) {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(s => s + 1);
    } else {
      this.finishCalibration(ctx);
    }
  }

  prevStep() {
    if (this.currentStep() > 0) {
      this.currentStep.update(s => s - 1);
    }
  }

  finishCalibration(ctx: any) {
    // Add your API calls or save logic here
    console.log('Calibration complete!');
    
    // Close the dialog using Spartan's context and reset the stepper
    ctx.close();
    this.currentStep.set(0); 
  }

  resetStepper() {
    this.currentStep.set(0);
  }
}
