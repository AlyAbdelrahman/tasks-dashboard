import { Component, inject } from '@angular/core';
import { LowerCasePipe, NgClass } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { TaskBoardService, BoardStats } from '../task-status-board/task-board.service';

export interface DashboardStat {
  label: string;
  value: number;
  emoji: string;
  hintType: 'positive' | 'negative' | 'neutral';
}

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [NgClass, LowerCasePipe, MatCard, MatCardContent],
  templateUrl: './dashboard-overview.component.html',
})
export class DashboardOverviewComponent {
  private readonly taskBoardService = inject(TaskBoardService);

  get stats(): DashboardStat[] {
    const boardStats: BoardStats = this.taskBoardService.stats();

    return [
      {
        label: 'Total Tasks',
        value: boardStats.totalTasks,
        emoji: '📊',
        hintType: 'positive',
      },
      {
        label: 'Completed',
        value: boardStats.completed,
        emoji: '✅',
        hintType: 'positive',
      },
      {
        label: 'In Progress',
        value: boardStats.inProgress,
        emoji: '🔄',
        hintType: 'neutral',
      },
      {
        label: 'Overdue',
        value: boardStats.overdue,
        emoji: '⚠️',
        hintType: boardStats.overdue > 0 ? 'negative' : 'positive',
      },
    ];
  }
}
