import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

type TaskStatus = 'todo' | 'in-progress' | 'done';
type PriorityLevel = 'high' | 'medium' | 'low';

interface TaskItem {
  id: string;
  title: string;
  description: string;
  timeline: string;
  category: string;
  assignee: string;
  assigneeInitials: string;
  priority: PriorityLevel;
  status: TaskStatus;
  highlighted?: boolean;
}

interface TaskColumn {
  id: string;
  label: string;
  status: TaskStatus;
  total: number;
  tasks: TaskItem[];
}

@Component({
  selector: 'app-task-status-board',
  standalone: true,
  imports: [DragDropModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './task-status-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskStatusBoardComponent {
  readonly columns: TaskColumn[] = [
    {
      id: 'todo-column',
      label: 'To Do',
      status: 'todo',
      total: 42,
      tasks: [
        {
          id: 'todo-1',
          title: 'Prepare Q4 budget report',
          description: 'Compile and analyze financial data for quarterly budget presentation',
          timeline: 'Overdue by 2 days',
          category: 'Finance',
          assignee: '@Sarah',
          assigneeInitials: 'SS',
          priority: 'high',
          status: 'todo',
          highlighted: true,
        },
        {
          id: 'todo-2',
          title: 'Design new homepage layout',
          description: 'Create wireframes and mockups for the new homepage redesign with modern UI elements',
          timeline: 'Due in 2 days',
          category: 'Design',
          assignee: '@John',
          assigneeInitials: 'JD',
          priority: 'high',
          status: 'todo',
        },
        {
          id: 'todo-3',
          title: 'Update documentation',
          description: 'Review and update API documentation for v2.0 release',
          timeline: 'Due in 5 days',
          category: 'Documentation',
          assignee: '@Sarah',
          assigneeInitials: 'SS',
          priority: 'medium',
          status: 'todo',
        },
        {
          id: 'todo-4',
          title: 'Organize team meeting',
          description: 'Schedule and prepare agenda for quarterly planning session',
          timeline: 'Due in 1 week',
          category: 'Admin',
          assignee: '@Mike',
          assigneeInitials: 'MJ',
          priority: 'low',
          status: 'todo',
        },
      ],
    },
    {
      id: 'in-progress-column',
      label: 'In Progress',
      status: 'in-progress',
      total: 25,
      tasks: [
        {
          id: 'in-progress-1',
          title: 'Update payment gateway integration',
          description: 'Migrate to new payment provider API and update billing logic',
          timeline: 'Overdue by 1 day',
          category: 'Backend',
          assignee: '@John',
          assigneeInitials: 'JD',
          priority: 'high',
          status: 'in-progress',
          highlighted: true,
        },
        {
          id: 'in-progress-2',
          title: 'Implement user authentication',
          description: 'Add JWT-based authentication system with refresh tokens',
          timeline: 'Due in 3 days',
          category: 'Backend',
          assignee: '@John',
          assigneeInitials: 'JD',
          priority: 'high',
          status: 'in-progress',
        },
        {
          id: 'in-progress-3',
          title: 'Optimize database queries',
          description: 'Review and optimize slow queries identified in performance audit',
          timeline: 'Due in 4 days',
          category: 'Performance',
          assignee: '@Sarah',
          assigneeInitials: 'SS',
          priority: 'medium',
          status: 'in-progress',
        },
      ],
    },
    {
      id: 'done-column',
      label: 'Done',
      status: 'done',
      total: 89,
      tasks: [
        {
          id: 'done-1',
          title: 'Fix critical login bug',
          description: 'Resolved issue preventing users from logging in on mobile devices',
          timeline: 'Completed today',
          category: 'Bug Fix',
          assignee: '@Mike',
          assigneeInitials: 'MJ',
          priority: 'high',
          status: 'done',
        },
        {
          id: 'done-2',
          title: 'Setup CI/CD pipeline',
          description: 'Configured GitHub Actions for automated testing and deployment',
          timeline: 'Completed yesterday',
          category: 'DevOps',
          assignee: '@John',
          assigneeInitials: 'JD',
          priority: 'medium',
          status: 'done',
        },
      ],
    },
  ];

  get connectedDropListIds(): string[] {
    return this.columns.map((column) => column.id);
  }

  onTaskDrop(event: CdkDragDrop<TaskItem[]>, targetStatus: TaskStatus): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    const movedTask = event.container.data[event.currentIndex];
    movedTask.status = targetStatus;
  }

  trackByColumnId(_index: number, column: TaskColumn): string {
    return column.id;
  }

  trackByTaskId(_index: number, task: TaskItem): string {
    return task.id;
  }
}
