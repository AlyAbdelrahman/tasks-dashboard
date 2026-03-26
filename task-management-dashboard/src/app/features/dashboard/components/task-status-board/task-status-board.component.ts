import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TaskBoardService, TaskColumn, TaskItem } from './task-board.service';
import { NewTaskModalComponent, TaskModalData, TaskModalResult } from '../../../../modal/new-task-modal/new-task-modal.component';

@Component({
  selector: 'app-task-status-board',
  standalone: true,
  imports: [DragDropModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './task-status-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskStatusBoardComponent {
  private readonly taskBoardService = inject(TaskBoardService);
  private readonly dialog = inject(MatDialog);
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

  openTaskActionsModal(task: TaskItem): void {
    const dialogRef = this.dialog.open<NewTaskModalComponent, TaskModalData, TaskModalResult | undefined>(
      NewTaskModalComponent,
      {
        width: '560px',
        maxWidth: '95vw',
        data: {
          mode: 'edit',
          task,
        },
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      if (result.action === 'update') {
        this.taskBoardService.updateTask(result.taskId, result.payload);
        return;
      }

      if (result.action === 'delete') {
        this.taskBoardService.deleteTask(result.taskId);
      }
    });
  }

  trackByColumnId(_index: number, column: TaskColumn): string {
    return column.id;
  }

  trackByTaskId(_index: number, task: TaskItem): string {
    return task.id;
  }
}
