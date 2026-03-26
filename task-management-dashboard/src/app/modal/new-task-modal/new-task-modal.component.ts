import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  NewTaskPayload,
  PriorityLevel,
  TaskItem,
  TaskStatus,
  UpdateTaskPayload,
} from '../../features/dashboard/components/task-status-board/task-board.service';

export interface TaskModalData {
  mode: 'create' | 'edit';
  task?: TaskItem;
}

export type TaskModalResult =
  | { action: 'create'; payload: NewTaskPayload }
  | { action: 'update'; taskId: string; payload: UpdateTaskPayload }
  | { action: 'delete'; taskId: string };

@Component({
  selector: 'app-new-task-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './new-task-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTaskModalComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<NewTaskModalComponent, TaskModalResult | undefined>>(MatDialogRef);
  private readonly dialogData = inject<TaskModalData | undefined>(MAT_DIALOG_DATA, { optional: true });

  readonly statuses: { label: string; value: TaskStatus }[] = [
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Done', value: 'done' },
  ];

  readonly priorities: { label: string; value: PriorityLevel }[] = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  readonly form = this.formBuilder.nonNullable.group({
    title: [this.dialogData?.task?.title ?? '', [Validators.required, Validators.maxLength(100)]],
    description: [this.dialogData?.task?.description ?? '', [Validators.required, Validators.maxLength(280)]],
    dueDays: [this.dialogData?.task?.dueDays ?? 0, [Validators.required]],
    category: [this.dialogData?.task?.category ?? '', [Validators.required, Validators.maxLength(60)]],
    assignee: [this.dialogData?.task?.assignee ?? '', [Validators.required, Validators.maxLength(40)]],
    assigneeInitials: [this.dialogData?.task?.assigneeInitials ?? '', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
    priority: [this.dialogData?.task?.priority ?? ('medium' as PriorityLevel), Validators.required],
    status: [this.dialogData?.task?.status ?? ('todo' as TaskStatus), Validators.required],
  });

  get isEditMode(): boolean {
    return this.dialogData?.mode === 'edit' && !!this.dialogData.task;
  }

  get dueDaysHint(): string {
    const value = this.form.controls.dueDays.value;
    if (value < 0) {
      const abs = Math.abs(value);
      return `Overdue by ${abs} ${abs === 1 ? 'day' : 'days'}`;
    }

    if (value === 0) {
      return 'Due today';
    }

    if (value === 7) {
      return 'Due in 1 week';
    }

    return `Due in ${value} ${value === 1 ? 'day' : 'days'}`;
  }

  close(): void {
    this.dialogRef.close(undefined);
  }

  deleteTask(): void {
    if (!this.isEditMode || !this.dialogData?.task) {
      return;
    }

    this.dialogRef.close({
      action: 'delete',
      taskId: this.dialogData.task.id,
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    const cleanedPayload: NewTaskPayload = {
      ...payload,
      assigneeInitials: payload.assigneeInitials.toUpperCase(),
      assignee: payload.assignee.trim(),
      title: payload.title.trim(),
      description: payload.description.trim(),
      category: payload.category.trim(),
    };

    if (this.isEditMode && this.dialogData?.task) {
      this.dialogRef.close({
        action: 'update',
        taskId: this.dialogData.task.id,
        payload: cleanedPayload,
      });
      return;
    }

    this.dialogRef.close({
      action: 'create',
      payload: cleanedPayload,
    });
  }
}
