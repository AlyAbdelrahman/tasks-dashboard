import { computed, Injectable, signal } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type PriorityLevel = 'high' | 'medium' | 'low';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDays: number;
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
  tasks: TaskItem[];
}

export interface NewTaskPayload {
  title: string;
  description: string;
  dueDays: number;
  category: string;
  assignee: string;
  assigneeInitials: string;
  priority: PriorityLevel;
  status: TaskStatus;
}
export type UpdateTaskPayload = NewTaskPayload;

export interface BoardStats {
  totalTasks: number;
  completed: number;
  inProgress: number;
  overdue: number;
}

const INITIAL_COLUMNS: TaskColumn[] = [
  {
    id: 'todo-column',
    label: 'To Do',
    status: 'todo',
    tasks: [
      {
        id: 'todo-1',
        title: 'Prepare Q4 budget report',
        description: 'Compile and analyze financial data for quarterly budget presentation',
        dueDays: -2,
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
        dueDays: 2,
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
        dueDays: 5,
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
        dueDays: 7,
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
    tasks: [
      {
        id: 'in-progress-1',
        title: 'Update payment gateway integration',
        description: 'Migrate to new payment provider API and update billing logic',
        dueDays: -1,
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
        dueDays: 3,
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
        dueDays: 4,
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
    tasks: [
      {
        id: 'done-1',
        title: 'Fix critical login bug',
        description: 'Resolved issue preventing users from logging in on mobile devices',
        dueDays: 0,
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
        dueDays: -1,
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

  readonly stats = computed<BoardStats>(() => {
    const allTasks = this.columnsState().flatMap((column) => column.tasks);
    const completed = allTasks.filter((task) => task.status === 'done').length;
    const inProgress = allTasks.filter((task) => task.status === 'in-progress').length;
    const overdue = allTasks.filter((task) => task.status !== 'done' && task.dueDays < 0).length;

    return {
      totalTasks: allTasks.length,
      completed,
      inProgress,
      overdue,
    };
  });

  addTask(payload: NewTaskPayload): void {
    const newTask: TaskItem = {
      id: `${payload.status}-${Date.now()}`,
      ...this.normalizePayload(payload),
    };

    this.columnsState.update((columns) =>
      columns.map((column) =>
        column.status === payload.status
          ? { ...column, tasks: [newTask, ...column.tasks] }
          : column,
      ),
    );
  }

  updateTask(taskId: string, payload: UpdateTaskPayload): void {
    this.columnsState.update((columns) => {
      const sourceColumn = columns.find((column) => column.tasks.some((task) => task.id === taskId));

      if (!sourceColumn) {
        return columns;
      }

      const existingTask = sourceColumn.tasks.find((task) => task.id === taskId);
      if (!existingTask) {
        return columns;
      }

      const updatedTask: TaskItem = {
        ...existingTask,
        ...this.normalizePayload(payload),
      };

      if (sourceColumn.status === payload.status) {
        return columns.map((column) => {
          if (column.id !== sourceColumn.id) {
            return column;
          }

          return {
            ...column,
            tasks: column.tasks.map((task) => (task.id === taskId ? updatedTask : task)),
          };
        });
      }

      return columns.map((column) => {
        if (column.id === sourceColumn.id) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          };
        }

        if (column.status === payload.status) {
          return {
            ...column,
            tasks: [{ ...updatedTask, status: column.status }, ...column.tasks],
          };
        }

        return column;
      });
    });
  }

  deleteTask(taskId: string): void {
    this.columnsState.update((columns) =>
      columns.map((column) => {
        const hasTask = column.tasks.some((task) => task.id === taskId);
        if (!hasTask) {
          return column;
        }

        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        };
      }),
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
          return { ...column, tasks: sourceTasks };
        }

        if (column.id === targetColumn.id) {
          return { ...column, tasks: destinationTasks };
        }

        return column;
      });
    });
  }

  formatTimeline(task: TaskItem): string {
    if (task.status === 'done') {
      return task.dueDays === 0 ? 'Completed today' : 'Completed yesterday';
    }

    if (task.dueDays < 0) {
      const days = Math.abs(task.dueDays);
      return `Overdue by ${days} ${days === 1 ? 'day' : 'days'}`;
    }

    if (task.dueDays === 0) {
      return 'Due today';
    }

    if (task.dueDays === 7) {
      return 'Due in 1 week';
    }

    return `Due in ${task.dueDays} ${task.dueDays === 1 ? 'day' : 'days'}`;
  }

  private cloneColumns(columns: TaskColumn[]): TaskColumn[] {
    return columns.map((column) => ({
      ...column,
      tasks: column.tasks.map((task) => ({ ...task })),
    }));
  }

  private normalizePayload(payload: NewTaskPayload): NewTaskPayload {
    const normalizedAssignee = payload.assignee.startsWith('@')
      ? payload.assignee
      : `@${payload.assignee}`;

    return {
      ...payload,
      assignee: normalizedAssignee,
      assigneeInitials: payload.assigneeInitials.toUpperCase(),
    };
  }
}
