import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-bento',
  imports: [NgClass],
  templateUrl: './bento.component.html',
  styleUrl: './bento.component.css',
})
export class BentoComponent {
  bentoTitle = input<string>();
  className = input<string>();
}
