import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SearchTasksModalComponent } from './search-tasks-modal.component';
import { TaskBoardService, TaskItem } from '../../features/dashboard/components/task-status-board/task-board.service';

describe('SearchTasksModalComponent', () => {
  let component: SearchTasksModalComponent;
  let fixture: ComponentFixture<SearchTasksModalComponent>;
  let matDialog: { open: ReturnType<typeof vi.fn> };
  let dialogRef: { close: ReturnType<typeof vi.fn> };
  let taskBoardService: {
    searchTasks: ReturnType<typeof vi.fn>;
    formatTimeline: ReturnType<typeof vi.fn>;
    updateTask: ReturnType<typeof vi.fn>;
    deleteTask: ReturnType<typeof vi.fn>;
  };

  const mockResults: TaskItem[] = [
    {
      id: 'todo-1',
      title: 'Prepare Q4 budget report',
      description: 'Compile budget data',
      dueDays: -2,
      category: 'Finance',
      assignee: '@Sarah',
      assigneeInitials: 'SS',
      priority: 'high',
      status: 'todo',
    },
  ];

  beforeEach(async () => {
    matDialog = {
      open: vi.fn().mockReturnValue({
        afterClosed: () => of(undefined),
      }),
    };

    dialogRef = {
      close: vi.fn(),
    };

    taskBoardService = {
      searchTasks: vi.fn((query: string) => (query.trim() ? mockResults : [])),
      formatTimeline: vi.fn(() => 'Overdue by 2 days'),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SearchTasksModalComponent],
      providers: [
        { provide: MatDialog, useValue: matDialog },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { initialQuery: 'budget' } },
        { provide: TaskBoardService, useValue: taskBoardService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTasksModalComponent);
    component = fixture.componentInstance;
    // Ensure modal-opening paths always use the stubbed dialog instance.
    (component as unknown as { dialog: typeof matDialog }).dialog = matDialog;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes search input from dialog data', () => {
    expect(component.searchControl.value).toBe('budget');
  });

  it('hasQuery trims whitespace and reflects query presence', () => {
    component.searchControl.setValue('   ');
    expect(component.hasQuery).toBe(false);

    component.searchControl.setValue(' task ');
    expect(component.hasQuery).toBe(true);
  });

  it('computes results from service using current query', () => {
    component.searchControl.setValue('budget');
    const results = component.results;

    expect(taskBoardService.searchTasks).toHaveBeenCalledWith('budget');
    expect(results).toEqual(mockResults);
  });

  it('maps status labels and falls back for unknown statuses', () => {
    expect(component.getStatusLabel('todo')).toBe('To Do');
    expect(component.getStatusLabel('in-progress')).toBe('In Progress');
    expect(component.getStatusLabel('done')).toBe('Done');
    expect(component.getStatusLabel('blocked')).toBe('blocked');
  });

  it('delegates timeline formatting to service', () => {
    const timeline = component.getTimelineText(mockResults[0]);
    expect(timeline).toBe('Overdue by 2 days');
    expect(taskBoardService.formatTimeline).toHaveBeenCalledWith(mockResults[0]);
  });

  it('renders start-typing empty state when there is no query', () => {
    component.searchControl.setValue('');
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent ?? '';
    expect(content).toContain('Start typing to search tasks...');
    expect(content).not.toContain('No tasks match your search.');
  });

  it('renders no-results state for unmatched query', () => {
    taskBoardService.searchTasks.mockImplementation((query: string) =>
      query.trim().toLowerCase() === 'no-match' ? [] : mockResults,
    );
    component.searchControl.setValue('no-match');
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent ?? '';
    expect(content).toContain('No tasks match your search.');
  });

  it('shows clear search button only when a query exists', () => {
    component.searchControl.setValue('');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button[aria-label="Clear search"]')).toBeNull();

    component.searchControl.setValue('budget');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button[aria-label="Clear search"]')).toBeTruthy();
  });

  it('updates task when edit modal returns update action', () => {
    matDialog.open.mockReturnValueOnce({
      afterClosed: () =>
        of({
          action: 'update',
          taskId: 'todo-1',
          payload: {
            title: 'Updated',
            description: 'Updated description',
            dueDays: 2,
            category: 'Finance',
            assignee: '@Sarah',
            assigneeInitials: 'SS',
            priority: 'medium',
            status: 'todo',
          },
        }),
    });

    component.openEditModal(mockResults[0]);

    expect(taskBoardService.updateTask).toHaveBeenCalledWith('todo-1', {
      title: 'Updated',
      description: 'Updated description',
      dueDays: 2,
      category: 'Finance',
      assignee: '@Sarah',
      assigneeInitials: 'SS',
      priority: 'medium',
      status: 'todo',
    });
  });

  it('deletes task when edit modal returns delete action', () => {
    matDialog.open.mockReturnValueOnce({
      afterClosed: () =>
        of({
          action: 'delete',
          taskId: 'todo-1',
        }),
    });

    component.openEditModal(mockResults[0]);

    expect(taskBoardService.deleteTask).toHaveBeenCalledWith('todo-1');
  });

  it('does nothing when edit modal closes without result', () => {
    matDialog.open.mockReturnValueOnce({
      afterClosed: () => of(undefined),
    });

    component.openEditModal(mockResults[0]);

    expect(taskBoardService.updateTask).not.toHaveBeenCalled();
    expect(taskBoardService.deleteTask).not.toHaveBeenCalled();
  });

  it('closes the dialog', () => {
    component.close();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
