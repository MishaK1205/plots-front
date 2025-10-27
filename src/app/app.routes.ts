import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'admin', 
    loadComponent: () => import('./admin/admin').then(m => m.Admin),
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
  },
  { path: '', redirectTo: '/admin', pathMatch: 'full' }
];
