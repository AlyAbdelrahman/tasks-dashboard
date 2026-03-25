import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

export interface DashboardTab {
  id: string;
  label: string;
}

type TaskStatus = 'todo' | 'in-progress' | 'done';

interface DummyTask {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
}

@Component({
  selector: 'app-dashboard-tabs',
  standalone: true,
  imports: [MatTabsModule, MatButtonModule],
  templateUrl: './dashboard-tabs.component.html',
})
export class DashboardTabsComponent {
  @Output() tabChanged = new EventEmitter<string>();

  readonly tabs: DashboardTab[] = [
    { id: 'all', label: 'All' },
    { id: 'todo', label: 'To Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'done', label: 'Done' },
  ];

  readonly tasks: DummyTask[] = [
    {
      id: 'TASK-1021',
      title: 'Design dashboard cards',
      assignee: 'Emma',
      dueDate: 'Mar 28',
      status: 'todo',
    },
    {
      id: 'TASK-1045',
      title: 'Integrate tasks API endpoint',
      assignee: 'Liam',
      dueDate: 'Mar 27',
      status: 'in-progress',
    },
    {
      id: 'TASK-1032',
      title: 'Create task filtering tests',
      assignee: 'Sophia',
      dueDate: 'Mar 29',
      status: 'in-progress',
    },
    {
      id: 'TASK-1010',
      title: 'Set up Angular Material theme',
      assignee: 'Noah',
      dueDate: 'Mar 24',
      status: 'done',
    },
    {
      id: 'TASK-1003',
      title: 'Add dashboard overview metrics',
      assignee: 'Olivia',
      dueDate: 'Mar 22',
      status: 'done',
    },
  ];

  activeTab = this.tabs[0].id;

  get visibleTasks(): DummyTask[] {
    if (this.activeTab === 'all') {
      return this.tasks;
    }

    return this.tasks.filter((task) => task.status === this.activeTab);
  }

  setActiveTab(tabId: string): void {
    if (this.activeTab === tabId) {
      return;
    }

    this.activeTab = tabId;
    this.tabChanged.emit(tabId);
  }
}
