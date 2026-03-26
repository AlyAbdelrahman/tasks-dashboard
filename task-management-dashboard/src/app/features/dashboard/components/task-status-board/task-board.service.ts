import { Injectable, signal } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type PriorityLevel = 'high' | 'medium' | 'low';

export interface TaskItem {
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

export interface TaskColumn {
  id: string;
  label: string;
  status: TaskStatus;
  total: number;
  tasks: TaskItem[];
}

export interface NewTaskPayload {
  title: string;
  description: string;
  timeline: string;
  category: string;
  assignee: string;
  assigneeInitials: string;
  priority: PriorityLevel;
  status: TaskStatus;
}

const INITIAL_COLUMNS: TaskColumn[] = [
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

@Injectable({ providedIn: 'root' })
export class TaskBoardService {
  private readonly columnsState = signal<TaskColumn[]>(this.cloneColumns(INITIAL_COLUMNS));
  readonly columns = this.columnsState.asReadonly();

  addTask(payload: NewTaskPayload): void {
    const normalizedAssignee = payload.assignee.startsWith('@')
      ? payload.assignee
      : `@${payload.assignee}`;

    const newTask: TaskItem = {
      id: `${payload.status}-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      timeline: payload.timeline,
      category: payload.category,
      assignee: normalizedAssignee,
      assigneeInitials: payload.assigneeInitials,
      priority: payload.priority,
      status: payload.status,
    };

    this.columnsState.update((columns) =>
      columns.map((column) =>
        column.status === payload.status
          ? {
              ...column,
              total: column.total + 1,
              tasks: [newTask, ...column.tasks],
            }
          : column,
      ),
    );
  }

  moveTask(previousColumnId: string, targetColumnId: string, previousIndex: number, currentIndex: number): void {
    this.columnsState.update((columns) => {
      const previousColumnIndex = columns.findIndex((column) => column.id === previousColumnId);
      const targetColumnIndex = columns.findIndex((column) => column.id === targetColumnId);

      if (previousColumnIndex === -1 || targetColumnIndex === -1) {
        return columns;
      }

      const previousColumn = columns[previousColumnIndex];
      const targetColumn = columns[targetColumnIndex];

      if (previousColumn.id === targetColumn.id) {
        const reorderedTasks = [...targetColumn.tasks];
        moveItemInArray(reorderedTasks, previousIndex, currentIndex);

        return columns.map((column) =>
          column.id === targetColumn.id ? { ...column, tasks: reorderedTasks } : column,
        );
      }

      const sourceTasks = [...previousColumn.tasks];
      const [movedTask] = sourceTasks.splice(previousIndex, 1);

      if (!movedTask) {
        return columns;
      }

      const destinationTasks = [...targetColumn.tasks];
      destinationTasks.splice(currentIndex, 0, { ...movedTask, status: targetColumn.status });

      return columns.map((column) => {
        if (column.id === previousColumn.id) {
          return {
            ...column,
            total: Math.max(0, column.total - 1),
            tasks: sourceTasks,
          };
        }

        if (column.id === targetColumn.id) {
          return {
            ...column,
            total: column.total + 1,
            tasks: destinationTasks,
          };
        }

        return column;
      });
    });
  }

  private cloneColumns(columns: TaskColumn[]): TaskColumn[] {
    return columns.map((column) => ({
      ...column,
      tasks: column.tasks.map((task) => ({ ...task })),
    }));
  }
}
