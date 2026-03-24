import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Header, Sidebar, RouterOutlet],
  template: `
    <div class="layout-root">
      <app-header></app-header>
      <div class="layout-content">
        <app-sidebar></app-sidebar>
        <main class="layout-main">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class LayoutComponent {}
