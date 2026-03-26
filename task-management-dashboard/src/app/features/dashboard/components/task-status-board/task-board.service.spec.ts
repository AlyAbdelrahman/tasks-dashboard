import { TestBed } from '@angular/core/testing';
import { TaskBoardService, TaskItem } from './task-board.service';

describe('TaskBoardService', () => {
  let service: TaskBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskBoardService);
  });

  function getAllTasks(): TaskItem[] {
    return service.columns().flatMap((column) => column.tasks);
  }

  it('returns empty search results for empty query', () => {
    expect(service.searchTasks('')).toEqual([]);
    expect(service.searchTasks('   ')).toEqual([]);
  });

  it('searches case-insensitively across title, description, category, and assignee', () => {
    expect(service.searchTasks('budget').some((task) => task.id === 'todo-1')).toBe(true);
    expect(service.searchTasks('MOBILE DEVICES').some((task) => task.id === 'done-1')).toBe(true);
    expect(service.searchTasks('devops').some((task) => task.id === 'done-2')).toBe(true);
    expect(service.searchTasks('@john').length).toBeGreaterThan(0);
  });

  it('sorts tasks by priority descending and ascending', () => {
    service.sortTasksByPriority('desc');
    for (const column of service.columns()) {
      const priorities = column.tasks.map((task) => task.priority);
      const indexHigh = priorities.indexOf('high');
      const indexLow = priorities.lastIndexOf('low');
      if (indexHigh !== -1 && indexLow !== -1) {
        expect(indexHigh).toBeLessThan(indexLow);
      }
    }

    service.sortTasksByPriority('asc');
    for (const column of service.columns()) {
      const priorities = column.tasks.map((task) => task.priority);
      const indexLow = priorities.indexOf('low');
      const indexHigh = priorities.lastIndexOf('high');
      if (indexLow !== -1 && indexHigh !== -1) {
        expect(indexLow).toBeLessThan(indexHigh);
      }
    }
  });

  it('moves tasks across columns and updates task status', () => {
    service.moveTask('todo-column', 'done-column', 0, 0);

    const movedTask = service.columns()[2].tasks[0];
    expect(movedTask.id).toBe('todo-1');
    expect(movedTask.status).toBe('done');
    expect(service.columns()[0].tasks.some((task) => task.id === 'todo-1')).toBe(false);
  });

  it('reorders tasks inside the same column', () => {
    const firstBefore = service.columns()[0].tasks[0].id;
    const secondBefore = service.columns()[0].tasks[1].id;

    service.moveTask('todo-column', 'todo-column', 0, 1);

    const tasksAfter = service.columns()[0].tasks;
    expect(tasksAfter[0].id).toBe(secondBefore);
    expect(tasksAfter[1].id).toBe(firstBefore);
  });

  it('ignores move requests with invalid column ids', () => {
    const before = getAllTasks().map((task) => task.id);

    service.moveTask('unknown-column', 'done-column', 0, 0);
    service.moveTask('todo-column', 'unknown-column', 0, 0);

    expect(getAllTasks().map((task) => task.id)).toEqual(before);
  });

  it('updates search results after add, update, and delete', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
    service.addTask({
      title: 'Brand new alpha task',
      description: 'Testing search updates',
      dueDays: 2,
      category: 'QA',
      assignee: 'alex',
      assigneeInitials: 'ax',
      priority: 'medium',
      status: 'todo',
    });

    expect(service.searchTasks('alpha').length).toBe(1);
    const createdTask = service.searchTasks('alpha')[0];
    expect(createdTask.assignee).toBe('@alex');
    expect(createdTask.assigneeInitials).toBe('AX');

    service.updateTask(createdTask.id, {
      title: 'Renamed beta task',
      description: 'Updated task description',
      dueDays: 1,
      category: 'Engineering',
      assignee: '@alex',
      assigneeInitials: 'ax',
      priority: 'high',
      status: 'in-progress',
    });

    expect(service.searchTasks('alpha').length).toBe(0);
    expect(service.searchTasks('beta').length).toBe(1);
    expect(service.searchTasks('engineering').length).toBeGreaterThan(0);

    service.deleteTask(createdTask.id);
    expect(service.searchTasks('beta').length).toBe(0);
  });

  it('does not mutate state when update or delete target is missing', () => {
    const before = JSON.stringify(service.columns());

    service.updateTask('missing-id', {
      title: 'No-op',
      description: 'No-op',
      dueDays: 0,
      category: 'No-op',
      assignee: '@none',
      assigneeInitials: 'NN',
      priority: 'low',
      status: 'todo',
    });
    service.deleteTask('missing-id');

    expect(JSON.stringify(service.columns())).toBe(before);
  });

  it('computes stats correctly and updates them after moving tasks', () => {
    const initialStats = service.stats();
    expect(initialStats.totalTasks).toBe(9);
    expect(initialStats.completed).toBe(2);
    expect(initialStats.inProgress).toBe(3);
    expect(initialStats.overdue).toBe(2);

    service.moveTask('todo-column', 'done-column', 0, 0);
    const nextStats = service.stats();
    expect(nextStats.totalTasks).toBe(9);
    expect(nextStats.completed).toBe(3);
    expect(nextStats.inProgress).toBe(3);
    expect(nextStats.overdue).toBe(1);
  });

  it('formats timeline text for done, overdue, due today, due in one week, and generic due dates', () => {
    expect(
      service.formatTimeline({
        id: 't1',
        title: 'Done today',
        description: 'x',
        dueDays: 0,
        category: 'x',
        assignee: '@x',
        assigneeInitials: 'XX',
        priority: 'low',
        status: 'done',
      }),
    ).toBe('Completed today');

    expect(
      service.formatTimeline({
        id: 't2',
        title: 'Done before',
        description: 'x',
        dueDays: -1,
        category: 'x',
        assignee: '@x',
        assigneeInitials: 'XX',
        priority: 'low',
        status: 'done',
      }),
    ).toBe('Completed yesterday');

    expect(
      service.formatTimeline({
        id: 't3',
        title: 'Overdue',
        description: 'x',
        dueDays: -3,
        category: 'x',
        assignee: '@x',
        assigneeInitials: 'XX',
        priority: 'low',
        status: 'todo',
      }),
    ).toBe('Overdue by 3 days');

    expect(
      service.formatTimeline({
        id: 't4',
        title: 'Today',
        description: 'x',
        dueDays: 0,
        category: 'x',
        assignee: '@x',
        assigneeInitials: 'XX',
        priority: 'low',
        status: 'todo',
      }),
    ).toBe('Due today');

    expect(
      service.formatTimeline({
        id: 't5',
        title: 'Week',
        description: 'x',
        dueDays: 7,
        category: 'x',
        assignee: '@x',
        assigneeInitials: 'XX',
        priority: 'low',
        status: 'in-progress',
      }),
    ).toBe('Due in 1 week');

    expect(
      service.formatTimeline({
        id: 't6',
        title: 'Later',
        description: 'x',
        dueDays: 2,
        category: 'x',
        assignee: '@x',
        assigneeInitials: 'XX',
        priority: 'low',
        status: 'in-progress',
      }),
    ).toBe('Due in 2 days');
  });
});
