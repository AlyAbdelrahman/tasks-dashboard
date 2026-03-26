import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TaskBoardService, TaskColumn, TaskItem } from './task-board.service';

@Component({
  selector: 'app-task-status-board',
  standalone: true,
  imports: [DragDropModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './task-status-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskStatusBoardComponent {
  private readonly taskBoardService = inject(TaskBoardService);
  @Input() selectedTab: 'all' | TaskColumn['status'] = 'all';

  get columns(): TaskColumn[] {
    return this.taskBoardService.columns();
  }

  get filteredColumns(): TaskColumn[] {
    if (this.selectedTab === 'all') {
      return this.columns;
    }

    return this.columns.filter((column) => column.status === this.selectedTab);
  }

  get connectedDropListIds(): string[] {
    return this.filteredColumns.map((column) => column.id);
  }

  onTaskDrop(event: CdkDragDrop<TaskItem[]>): void {
    this.taskBoardService.moveTask(
      event.previousContainer.id,
      event.container.id,
      event.previousIndex,
      event.currentIndex,
    );
  }

  getTimelineIcon(task: TaskItem): string {
    if (task.status === 'done') {
      return '✅';
    }

    return task.timeline.includes('Overdue') ? '⚠️' : '📅';
  }

  trackByColumnId(_index: number, column: TaskColumn): string {
    return column.id;
  }

  trackByTaskId(_index: number, task: TaskItem): string {
    return task.id;
  }
}
