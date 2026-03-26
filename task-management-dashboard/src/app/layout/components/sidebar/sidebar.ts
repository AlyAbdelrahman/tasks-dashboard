import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewTaskModalComponent } from '../../../modal/new-task-modal/new-task-modal.component';
import { NewTaskPayload, TaskBoardService } from '../../../features/dashboard/components/task-status-board/task-board.service';

export interface SidebarNavItem {
  path: string;
  label: string;
  icon: string;
  exact: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButton,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
    MatDialogModule,
  ],
  templateUrl: './sidebar.html'
})
export class Sidebar {
  private readonly dialog = inject(MatDialog);
  private readonly taskBoardService = inject(TaskBoardService);

  readonly navItems: SidebarNavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/tasks', label: 'Tasks', icon: '✅', exact: false },
    { path: '/calendar', label: 'Calendar', icon: '📅', exact: false },
    { path: '/analytics', label: 'Analytics', icon: '📈', exact: false },
    { path: '/team', label: 'Team', icon: '👥', exact: false },
    { path: '/settings', label: 'Settings', icon: '⚙️', exact: false },
  ];

  openNewTaskModal(): void {
    const dialogRef = this.dialog.open<NewTaskModalComponent, undefined, NewTaskPayload | undefined>(
      NewTaskModalComponent,
      {
        width: '560px',
        maxWidth: '95vw',
      },
    );

    dialogRef.afterClosed().subscribe((payload) => {
      if (payload) {
        this.taskBoardService.addTask(payload);
      }
    });
  }
}
