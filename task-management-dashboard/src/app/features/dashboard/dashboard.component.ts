import { Component } from '@angular/core';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { DashboardTabsComponent } from './components/dashboard-tabs/dashboard-tabs.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardTabsComponent, DashboardOverviewComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}