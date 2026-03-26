import { Component } from '@angular/core';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { TaskStatusBoardComponent } from './components/task-status-board/task-status-board.component';
import { DashboardTabsComponent } from './components/dashboard-tabs/dashboard-tabs.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardOverviewComponent, TaskStatusBoardComponent, DashboardTabsComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}