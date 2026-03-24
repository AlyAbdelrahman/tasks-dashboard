import { Component } from '@angular/core';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardOverviewComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}