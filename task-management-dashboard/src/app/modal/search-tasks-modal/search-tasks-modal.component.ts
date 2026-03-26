import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import {
  TaskBoardService,
  TaskItem,
} from '../../features/dashboard/components/task-status-board/task-board.service';
import {
  NewTaskModalComponent,
  TaskModalData,
  TaskModalResult,
} from '../new-task-modal/new-task-modal.component';

export interface SearchTasksModalData {
  initialQuery?: string;
}

const STATUS_LABELS: Record<string, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

@Component({
  selector: 'app-search-tasks-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatChipsModule,
  ],
  templateUrl: './search-tasks-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchTasksModalComponent {
  private readonly taskBoardService = inject(TaskBoardService);
  private readonly dialogRef = inject(MatDialogRef<SearchTasksModalComponent>);
  private readonly dialog = inject(MatDialog);
  private readonly dialogData = inject<SearchTasksModalData | null>(MAT_DIALOG_DATA, { optional: true });

  readonly searchControl = new FormControl(this.dialogData?.initialQuery ?? '', { nonNullable: true });

  get results(): TaskItem[] {
    return this.taskBoardService.searchTasks(this.searchControl.value);
  }

  get hasQuery(): boolean {
    return this.searchControl.value.trim().length > 0;
  }

  getStatusLabel(status: string): string {
    return STATUS_LABELS[status] ?? status;
  }

  getTimelineText(task: TaskItem): string {
    return this.taskBoardService.formatTimeline(task);
  }

  openEditModal(task: TaskItem): void {
    const editRef = this.dialog.open<NewTaskModalComponent, TaskModalData, TaskModalResult | undefined>(
      NewTaskModalComponent,
      {
        width: '560px',
        maxWidth: '95vw',
        data: { mode: 'edit', task },
      },
    );

    editRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      if (result.action === 'update') {
        this.taskBoardService.updateTask(result.taskId, result.payload);
      }

      if (result.action === 'delete') {
        this.taskBoardService.deleteTask(result.taskId);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
