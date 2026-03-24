import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Header, Sidebar, RouterOutlet],
  template: `
    <app-header></app-header>
    <app-sidebar></app-sidebar>
    <router-outlet></router-outlet>
  `,
})
export class LayoutComponent {}
