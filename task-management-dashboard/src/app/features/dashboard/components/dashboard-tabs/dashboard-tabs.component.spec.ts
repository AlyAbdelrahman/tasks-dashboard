import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DashboardTabsComponent } from './dashboard-tabs.component';
import { TaskBoardService, TaskColumn } from '../task-status-board/task-board.service';

describe('DashboardTabsComponent', () => {
  let component: DashboardTabsComponent;
  let fixture: ComponentFixture<DashboardTabsComponent>;
  let matDialog: { open: ReturnType<typeof vi.fn> };
  let taskBoardService: {
    columns: ReturnType<typeof vi.fn>;
    formatTimeline: ReturnType<typeof vi.fn>;
    addTask: ReturnType<typeof vi.fn>;
    sortTasksByPriority: ReturnType<typeof vi.fn>;
  };

  const mockColumns: TaskColumn[] = [
    {
      id: 'todo-column',
      label: 'To Do',
      status: 'todo',
      tasks: [
        {
          id: 'todo-1',
          title: 'Task title',
          description: 'Task description',
          dueDays: 1,
          category: 'Engineering',
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
      formatTimeline: vi.fn(() => 'Due in 1 day'),
      addTask: vi.fn(),
      sortTasksByPriority: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardTabsComponent],
      providers: [
        { provide: MatDialog, useValue: matDialog },
        { provide: TaskBoardService, useValue: taskBoardService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardTabsComponent);
    component = fixture.componentInstance;
    // Force dialog interactions to use the test stub.
    (component as unknown as { dialog: typeof matDialog }).dialog = matDialog;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defaults active tab to all', () => {
    expect(component.activeTab).toBe('all');
  });

  it('updates active tab and emits tabChanged for a new tab', () => {
    const emitSpy = vi.spyOn(component.tabChanged, 'emit');

    component.setActiveTab('done');

    expect(component.activeTab).toBe('done');
    expect(emitSpy).toHaveBeenCalledWith('done');
  });

  it('does not emit when the same tab is selected again', () => {
    component.activeTab = 'todo';
    const emitSpy = vi.spyOn(component.tabChanged, 'emit');

    component.setActiveTab('todo');

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('toggles priority sort direction and calls service in sequence', () => {
    expect(component.priorityButtonLabel).toBe('Priority ▼');

    component.togglePrioritySort();
    expect(component.priorityButtonLabel).toBe('Priority ▼');
    expect(taskBoardService.sortTasksByPriority).toHaveBeenNthCalledWith(1, 'desc');

    component.togglePrioritySort();
    expect(component.priorityButtonLabel).toBe('Priority ▲');
    expect(taskBoardService.sortTasksByPriority).toHaveBeenNthCalledWith(2, 'asc');
  });

  it('adds a task when create modal returns create action', () => {
    const payload = {
      title: 'New task',
      description: 'desc',
      dueDays: 1,
      category: 'QA',
      assignee: 'john',
      assigneeInitials: 'JD',
      priority: 'high' as const,
      status: 'todo' as const,
    };

    matDialog.open.mockReturnValueOnce({
      afterClosed: () =>
        of({
          action: 'create',
          payload,
        }),
    });

    component.openNewTaskModal();

    expect(taskBoardService.addTask).toHaveBeenCalledWith(payload);
  });

  it('does not add a task when create modal is cancelled', () => {
    matDialog.open.mockReturnValueOnce({
      afterClosed: () => of(undefined),
    });

    component.openNewTaskModal();

    expect(taskBoardService.addTask).not.toHaveBeenCalled();
  });
});
