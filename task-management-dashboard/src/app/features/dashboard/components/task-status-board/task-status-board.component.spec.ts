import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TaskStatusBoardComponent } from './task-status-board.component';
import { TaskBoardService, TaskColumn, TaskItem } from './task-board.service';

describe('TaskStatusBoardComponent', () => {
  let component: TaskStatusBoardComponent;
  let fixture: ComponentFixture<TaskStatusBoardComponent>;
  let matDialog: { open: ReturnType<typeof vi.fn> };
  let taskBoardService: {
    columns: ReturnType<typeof vi.fn>;
    moveTask: ReturnType<typeof vi.fn>;
    updateTask: ReturnType<typeof vi.fn>;
    deleteTask: ReturnType<typeof vi.fn>;
    formatTimeline: ReturnType<typeof vi.fn>;
  };

  const mockColumns: TaskColumn[] = [
    {
      id: 'todo-column',
      label: 'To Do',
      status: 'todo',
      tasks: [
        {
          id: 'todo-1',
          title: 'Todo task',
          description: 'Todo task description',
          dueDays: 2,
          category: 'Design',
          assignee: '@John',
          assigneeInitials: 'JD',
          priority: 'high',
          status: 'todo',
        },
      ],
    },
    {
      id: 'in-progress-column',
      label: 'In Progress',
      status: 'in-progress',
      tasks: [],
    },
    {
      id: 'done-column',
      label: 'Done',
      status: 'done',
      tasks: [],
    },
  ];

  beforeEach(async () => {
    matDialog = {
      open: vi.fn().mockReturnValue({
        afterClosed: () => of(undefined),
      }),
    };

    taskBoardService = {
      columns: vi.fn(() => mockColumns),
      moveTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      formatTimeline: vi.fn((task: TaskItem) => `Timeline for ${task.id}`),
    };

    await TestBed.configureTestingModule({
      imports: [TaskStatusBoardComponent],
      providers: [
        { provide: MatDialog, useValue: matDialog },
        { provide: TaskBoardService, useValue: taskBoardService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskStatusBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows all columns for the all tab', () => {
    component.selectedTab = 'all';
    expect(component.filteredColumns.map((column) => column.id)).toEqual([
      'todo-column',
      'in-progress-column',
      'done-column',
    ]);
  });

  it('filters columns by selected tab', () => {
    component.selectedTab = 'todo';
    expect(component.filteredColumns).toHaveLength(1);
    expect(component.filteredColumns[0].status).toBe('todo');
  });

  it('computes connected drop list ids from filtered columns', () => {
    component.selectedTab = 'done';
    expect(component.connectedDropListIds).toEqual(['done-column']);
  });

  it('forwards drag-drop payload to service moveTask', () => {
    component.onTaskDrop({
      previousContainer: { id: 'todo-column' },
      container: { id: 'done-column' },
      previousIndex: 0,
      currentIndex: 0,
    } as never);

    expect(taskBoardService.moveTask).toHaveBeenCalledWith('todo-column', 'done-column', 0, 0);
  });

  it('returns correct timeline icon for done, overdue, and upcoming tasks', () => {
    expect(
      component.getTimelineIcon({
        id: 'done-id',
        title: 'Done',
        description: 'x',
        dueDays: 0,
        category: 'x',
        assignee: '@x',
        assigneeInitials: 'XX',
        priority: 'low',
        status: 'done',
      }),
    ).toBe('✅');

    expect(
      component.getTimelineIcon({
        id: 'overdue-id',
        title: 'Overdue',
        description: 'x',
        dueDays: -1,
        category: 'x',
        assignee: '@x',
        assigneeInitials: 'XX',
        priority: 'low',
        status: 'todo',
      }),
    ).toBe('⚠️');

    expect(
      component.getTimelineIcon({
        id: 'upcoming-id',
        title: 'Upcoming',
        description: 'x',
        dueDays: 1,
        category: 'x',
        assignee: '@x',
        assigneeInitials: 'XX',
        priority: 'low',
        status: 'in-progress',
      }),
    ).toBe('📅');
  });

  it('delegates timeline text to service', () => {
    const task = mockColumns[0].tasks[0];
    expect(component.getTimelineText(task)).toBe('Timeline for todo-1');
    expect(taskBoardService.formatTimeline).toHaveBeenCalledWith(task);
  });

  it('updates task when edit modal returns update action', () => {
    const task = mockColumns[0].tasks[0];
    matDialog.open.mockReturnValueOnce({
      afterClosed: () =>
        of({
          action: 'update',
          taskId: 'todo-1',
          payload: {
            title: 'Updated title',
            description: 'Updated',
            dueDays: 2,
            category: 'Design',
            assignee: '@John',
            assigneeInitials: 'JD',
            priority: 'medium',
            status: 'todo',
          },
        }),
    });

    component.openTaskActionsModal(task);

    expect(taskBoardService.updateTask).toHaveBeenCalledWith('todo-1', {
      title: 'Updated title',
      description: 'Updated',
      dueDays: 2,
      category: 'Design',
      assignee: '@John',
      assigneeInitials: 'JD',
      priority: 'medium',
      status: 'todo',
    });
  });

  it('deletes task when edit modal returns delete action', () => {
    const task = mockColumns[0].tasks[0];
    matDialog.open.mockReturnValueOnce({
      afterClosed: () =>
        of({
          action: 'delete',
          taskId: 'todo-1',
        }),
    });

    component.openTaskActionsModal(task);

    expect(taskBoardService.deleteTask).toHaveBeenCalledWith('todo-1');
  });

  it('does not update or delete when edit modal is cancelled', () => {
    const task = mockColumns[0].tasks[0];
    matDialog.open.mockReturnValueOnce({
      afterClosed: () => of(undefined),
    });

    component.openTaskActionsModal(task);

    expect(taskBoardService.updateTask).not.toHaveBeenCalled();
    expect(taskBoardService.deleteTask).not.toHaveBeenCalled();
  });
});
