import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerPoint, tablerSun } from '@ng-icons/tabler-icons';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    DatePipe,
    NgIcon, 
    HlmButtonImports, 
    HlmBadgeImports
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  viewProviders: [provideIcons({ tablerPoint, tablerSun })]
})
export class HeaderComponent implements OnInit, OnDestroy{
  currentTime = signal<Date>(new Date());

  private timerId: ReturnType<typeof setInterval> | undefined;

  ngOnInit(): void {
    this.timerId = setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId !== undefined) {
      clearInterval(this.timerId);
    }
  }
}
