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
export type UpdateTaskPayload = NewTaskPayload;

const INITIAL_COLUMNS: TaskColumn[] = [
  {
    id: 'todo-column',
    label: 'To Do',
    status: 'todo',
    total: 0,
    tasks: [],
  },
  {
    id: 'in-progress-column',
    label: 'In Progress',
    status: 'in-progress',
    total: 0,
    tasks: [],
  },
  {
    id: 'done-column',
    label: 'Done',
    status: 'done',
    total: 0,
    tasks: [],
  },
];

@Injectable({ providedIn: 'root' })
export class TaskBoardService {
  private readonly columnsState = signal<TaskColumn[]>(this.cloneColumns(INITIAL_COLUMNS));
  readonly columns = this.columnsState.asReadonly();

  addTask(payload: NewTaskPayload): void {
    const newTask: TaskItem = {
      id: `${payload.status}-${Date.now()}`,
      ...this.normalizePayload(payload),
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
            total: Math.max(0, column.total - 1),
            tasks: column.tasks.filter((task) => task.id !== taskId),
          };
        }

        if (column.status === payload.status) {
          return {
            ...column,
            total: column.total + 1,
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
          total: Math.max(0, column.total - 1),
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
