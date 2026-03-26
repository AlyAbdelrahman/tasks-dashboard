import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import {
  NewTaskModalComponent,
  TaskModalData,
  TaskModalResult,
} from '../../../../modal/new-task-modal/new-task-modal.component';
import { TaskStatusBoardComponent } from '../task-status-board/task-status-board.component';
import { TaskBoardService, TaskStatus } from '../task-status-board/task-board.service';

export interface DashboardTab {
  id: DashboardTabId;
  label: string;
}
type DashboardTabId = 'all' | TaskStatus;

@Component({
  selector: 'app-dashboard-tabs',
  standalone: true,
  imports: [MatTabsModule, MatButtonModule, MatDialogModule, TaskStatusBoardComponent],
  templateUrl: './dashboard-tabs.component.html',
})
export class DashboardTabsComponent {
  private readonly dialog = inject(MatDialog);
  private readonly taskBoardService = inject(TaskBoardService);

  @Output() tabChanged = new EventEmitter<DashboardTabId>();

  readonly tabs: DashboardTab[] = [
    { id: 'all', label: 'All' },
    { id: 'todo', label: 'To Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'done', label: 'Done' },
  ];

  activeTab: DashboardTabId = this.tabs[0].id;

  setActiveTab(tabId: DashboardTabId): void {
    if (this.activeTab === tabId) {
      return;
    }

    this.activeTab = tabId;
    this.tabChanged.emit(tabId);
  }

  openNewTaskModal(): void {
    const dialogRef = this.dialog.open<NewTaskModalComponent, TaskModalData, TaskModalResult | undefined>(
      NewTaskModalComponent,
      {
        width: '560px',
        maxWidth: '95vw',
        data: {
          mode: 'create',
        },
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'create') {
        this.taskBoardService.addTask(result.payload);
      }
    });
  }
}
