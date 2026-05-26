import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebSocketService } from '../../webSocket/web-socket.service';

@Component({
  selector: 'app-goal-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goal-input.component.html',
  styleUrl: './goal-input.component.css'
})
export class GoalInputComponent {
  goalControl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1),
    Validators.max(520)
  ]);

  goalSent = false;

  constructor(private webSocketService: WebSocketService) {}

  setGoal(): void {
    if (this.goalControl.invalid || this.goalControl.value === null) {
      this.goalControl.markAsTouched();
      return;
    }

    const goalNode = Number(this.goalControl.value);

    const payload = {
      Name: 'NavigationGoal',
      Value: {
        goal_node: goalNode
      }
    };

    this.webSocketService.sendMessageToFlask(JSON.stringify(payload));
    console.log('[GoalInput] sent:', payload);

    this.goalSent = true;

    setTimeout(() => {
      this.goalSent = false;
    }, 1500);
  }
}