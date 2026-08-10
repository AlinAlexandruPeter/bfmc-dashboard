import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { 
  tablerLayoutDashboard, 
  tablerMap, 
  tablerSatellite, 
  tablerTerminal2,
  tablerSettings
} from '@ng-icons/tabler-icons';

interface NavItem {
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    NgIcon,
    RouterLink, 
    RouterLinkActive,
    HlmButtonImports
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  viewProviders: [provideIcons({ 
    tablerLayoutDashboard, 
    tablerMap, 
    tablerSatellite, 
    tablerTerminal2,
    tablerSettings 
  })]
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { route: '/', icon: 'tablerLayoutDashboard' },
    { route: '/map-2d', icon: 'tablerMap' },
    { route: '/map-3d', icon: 'tablerSatellite' },
    { route: '/terminal', icon: 'tablerTerminal2' },
  ];
}
