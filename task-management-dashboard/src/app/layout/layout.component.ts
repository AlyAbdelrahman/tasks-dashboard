import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Header, Sidebar, RouterOutlet, MatButton],
  template: `
    <div class="layout-root">
      <app-header (menuToggle)="toggleSidebar()"></app-header>
      <div class="layout-content">
        <app-sidebar
          class="layout-sidebar"
          [class.layout-sidebar--open]="isSidebarOpen()"
          (navItemSelected)="closeSidebarOnSmallOrMid()"
        ></app-sidebar>
        <button
          mat-button
          type="button"
          class="layout-sidebar-backdrop"
          [class.layout-sidebar-backdrop--visible]="isSmallOrMidScreen() && isSidebarOpen()"
          aria-label="Close navigation menu"
          (click)="closeSidebarOnSmallOrMid()"
        ></button>
        <main class="layout-main">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly isSidebarOpen = signal(true);
  readonly isSmallOrMidScreen = signal(false);

  constructor() {
    this.breakpointObserver
      .observe('(max-width: 1023px)')
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => {
        this.isSmallOrMidScreen.set(matches);
        this.isSidebarOpen.set(!matches);
      });
  }

  toggleSidebar(): void {
    if (!this.isSmallOrMidScreen()) {
      return;
    }

    this.isSidebarOpen.update((isOpen) => !isOpen);
  }

  closeSidebarOnSmallOrMid(): void {
    if (!this.isSmallOrMidScreen()) {
      return;
    }

    this.isSidebarOpen.set(false);
  }
}
