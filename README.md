# Task Management Dashboard

Angular + Angular Material Kanban dashboard for task planning, prioritization, and tracking.

## Tech Stack

- Angular 22 (standalone components)
- Angular Material + Angular CDK (tabs, dialogs, cards, chips, drag-drop)
- Reactive Forms
- Vitest for unit tests
- Optional `json-server` API for local mock backend workflows

## Features Completed

### 1) Dashboard Layout

- Responsive app layout with:
  - Header
  - Sidebar navigation
  - Main dashboard content area
- Route-based navigation for:
  - `dashboard` (implemented)
  - `tasks` (basic page scaffolded)
  - `calendar`, `analytics`, `team`, `settings` (placeholder pages)

### 2) Kanban Board

- Three status columns:
  - `To Do`
  - `In Progress`
  - `Done`
- Task cards display:
  - Title and description
  - Priority chip (`high`, `medium`, `low`)
  - Category
  - Assignee and initials
  - Timeline status text and icon (due/overdue/completed)
- Drag-and-drop support:
  - Reorder tasks within a column
  - Move tasks across columns
  - Automatic status update when moved to another column

### 3) Search Tasks (Header + Modal)

- Global task search opened from header search field (on focus/Enter)
- Search modal with live filtering
- Search is case-insensitive and matches:
  - Task title
  - Task description
  - Category
  - Assignee
- Search UX includes:
  - Initial query handoff from header input
  - Clear search action
  - Result count
  - Empty states (`Start typing...` / `No tasks match...`)
- Clicking a search result opens task edit actions

### 4) Filter, Tabs, and Sorting

- Status tab filter:
  - `All`
  - `To Do`
  - `In Progress`
  - `Done`
- Priority sort toggle button:
  - Descending (`high` first)
  - Ascending (`low` first)

### 5) Task CRUD via Material Dialogs

- Create task dialog with validation
- Edit task dialog with prefilled values
- Delete task action in edit mode
- Payload normalization:
  - Assignee auto-prefix (`@`)
  - Assignee initials normalized to uppercase

### 6) Dashboard Overview Metrics

- Computed board summary cards:
  - Total tasks
  - Completed tasks
  - In progress tasks
  - Overdue tasks
- Values update automatically from board state

## Testing Coverage Implemented

Unit tests now cover Kanban, search, and filtering workflows:

- `task-board.service.spec.ts`
  - Search behavior and edge cases
  - Priority sorting
  - Drag/move behavior
  - Add/update/delete effects
  - Stats computation
  - Timeline formatting branches
- `dashboard-tabs.component.spec.ts`
  - Tab switching and event emission
  - Priority toggle logic
  - Create modal result handling
- `task-status-board.component.spec.ts`
  - Column filtering
  - Connected drop lists
  - Drag-drop event forwarding
  - Edit/delete modal flows
- `search-tasks-modal.component.spec.ts`
  - Initial query and query state
  - Result rendering and empty states
  - Status labels and timeline text
  - Edit/delete modal flows
- `header.spec.ts`
  - Search modal opening payload
  - Input clear/blur behavior

Current result: `46` unit tests passing.

## Run Locally

Install dependencies:

```bash
npm install
```

Start UI:

```bash
npm run start
```

Start mock API:

```bash
npm run start:api
```

Start both UI + mock API:

```bash
npm run start:all
```

## Build

```bash
npm run build
```

Production output is generated in `dist/task-management-dashboard/browser`.

## Test

```bash
npm run test -- --watch=false
```

## Lint

```bash
npm run lint
```
