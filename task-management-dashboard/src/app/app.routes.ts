import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Dashboard',
      },
      {
        path: 'tasks',
        loadChildren: () => import('./features/tasks/tasks.routes').then((m) => m.TASKS_ROUTES),
        title: 'Tasks',
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent
          ),
        title: 'Calendar',
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent
          ),
        title: 'Analytics',
      },
      {
        path: 'team',
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent
          ),
        title: 'Team',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/placeholder/placeholder.component').then(
            (m) => m.PlaceholderComponent
          ),
        title: 'Settings',
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
