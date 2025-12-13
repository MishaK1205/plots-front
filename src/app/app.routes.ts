import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/layout/layout').then(m => m.Layout),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin').then(m => m.Admin),
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
  }
];
