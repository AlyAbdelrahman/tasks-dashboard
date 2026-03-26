import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NewTaskPayload, PriorityLevel, TaskStatus } from '../../features/dashboard/components/task-status-board/task-board.service';

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
  private readonly dialogRef = inject<MatDialogRef<NewTaskModalComponent, NewTaskPayload | undefined>>(MatDialogRef);

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
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(280)]],
    timeline: ['', [Validators.required, Validators.maxLength(60)]],
    category: ['', [Validators.required, Validators.maxLength(60)]],
    assignee: ['', [Validators.required, Validators.maxLength(40)]],
    assigneeInitials: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
    priority: ['medium' as PriorityLevel, Validators.required],
    status: ['todo' as TaskStatus, Validators.required],
  });

  close(): void {
    this.dialogRef.close(undefined);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    this.dialogRef.close({
      ...payload,
      assigneeInitials: payload.assigneeInitials.toUpperCase(),
      assignee: payload.assignee.trim(),
      title: payload.title.trim(),
      description: payload.description.trim(),
      timeline: payload.timeline.trim(),
      category: payload.category.trim(),
    });
  }
}
