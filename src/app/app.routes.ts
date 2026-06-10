import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'projects',
        loadComponent: () => import('./pages/projects/projects').then((m) => m.Projects),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./pages/project-details/project-details').then(
            (m) => m.ProjectDetails,
          ),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin').then((m) => m.Admin),
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.adminRoutes),
  },
];
