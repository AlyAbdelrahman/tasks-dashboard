import { Component } from '@angular/core';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { TaskStatusBoardComponent } from './components/task-status-board/task-status-board.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardOverviewComponent, TaskStatusBoardComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}