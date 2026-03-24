import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';

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
  ],
  templateUrl: './sidebar.html'
})
export class Sidebar {
  readonly navItems: SidebarNavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/tasks', label: 'Tasks', icon: '✅', exact: false },
    { path: '/calendar', label: 'Calendar', icon: '📅', exact: false },
    { path: '/analytics', label: 'Analytics', icon: '📈', exact: false },
    { path: '/team', label: 'Team', icon: '👥', exact: false },
    { path: '/settings', label: 'Settings', icon: '⚙️', exact: false },
  ];
}
