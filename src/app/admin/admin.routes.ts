import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'companies', loadComponent: () => import('./companies/companies').then(m => m.Companies) },
  { path: 'add-company', loadComponent: () => import('./companies/add-edit-company/add-edit-company').then(m => m.AddEditCompany) },
  { path: 'edit-company/:id', loadComponent: () => import('./companies/add-edit-company/add-edit-company').then(m => m.AddEditCompany) },
  { path: 'projects', loadComponent: () => import('./projects/projects').then(m => m.Projects) },
  { path: 'add-project', loadComponent: () => import('./projects/add-edit-project/add-edit-project').then(m => m.AddEditProject) },
  { path: 'edit-project/:id', loadComponent: () => import('./projects/add-edit-project/add-edit-project').then(m => m.AddEditProject) }
];
