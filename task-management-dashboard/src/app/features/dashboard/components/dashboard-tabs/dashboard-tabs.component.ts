import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { TaskStatusBoardComponent } from '../task-status-board/task-status-board.component';
import { TaskStatus } from '../task-status-board/task-board.service';

export interface DashboardTab {
  id: DashboardTabId;
  label: string;
}
type DashboardTabId = 'all' | TaskStatus;

@Component({
  selector: 'app-dashboard-tabs',
  standalone: true,
  imports: [MatTabsModule, MatButtonModule, TaskStatusBoardComponent],
  templateUrl: './dashboard-tabs.component.html',
})
export class DashboardTabsComponent {
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
}
