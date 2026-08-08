import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerCarSuv } from '@ng-icons/tabler-icons';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIcon, HlmButtonImports],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  viewProviders: [provideIcons({ tablerCarSuv })]
})
export class NavbarComponent {

}
