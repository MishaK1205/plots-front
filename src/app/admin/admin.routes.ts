import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'companies',
    loadComponent: () =>
      import('./companies/companies').then((m) => m.Companies),
  },
  {
    path: 'add-company',
    loadComponent: () =>
      import('./companies/add-edit-company/add-edit-company').then(
        (m) => m.AddEditCompany,
      ),
  },
  {
    path: 'edit-company/:id',
    loadComponent: () =>
      import('./companies/add-edit-company/add-edit-company').then(
        (m) => m.AddEditCompany,
      ),
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects/projects').then((m) => m.Projects),
  },
  {
    path: 'add-project',
    loadComponent: () =>
      import('./projects/add-edit-project/add-edit-project').then(
        (m) => m.AddEditProject,
      ),
  },
  {
    path: 'edit-project/:id',
    loadComponent: () =>
      import('./projects/add-edit-project/add-edit-project').then(
        (m) => m.AddEditProject,
      ),
  },
  {
    path: 'lands',
    loadComponent: () => import('./lands/lands').then((m) => m.Lands),
  },
  {
    path: 'add-land',
    loadComponent: () =>
      import('./lands/add-edit-land/add-edit-land').then((m) => m.AddEditLand),
  },
  {
    path: 'edit-land/:id',
    loadComponent: () =>
      import('./lands/add-edit-land/add-edit-land').then((m) => m.AddEditLand),
  },
  {
    path: 'locations',
    loadComponent: () =>
      import('./locations/locations').then((m) => m.Locations),
  },
  {
    path: 'add-location',
    loadComponent: () =>
      import('./locations/add-edit-location/add-edit-location').then(
        (m) => m.AddEditLocation,
      ),
  },
  {
    path: 'edit-location/:id',
    loadComponent: () =>
      import('./locations/add-edit-location/add-edit-location').then(
        (m) => m.AddEditLocation,
      ),
  },
  {
    path: 'amenities',
    loadComponent: () =>
      import('./amenities/amenities').then((m) => m.Amenities),
  },
  {
    path: 'add-amenity',
    loadComponent: () =>
      import('./amenities/add-edit-amenity/add-edit-amenity').then(
        (m) => m.AddEditAmenity,
      ),
  },
  {
    path: 'edit-amenity/:id',
    loadComponent: () =>
      import('./amenities/add-edit-amenity/add-edit-amenity').then(
        (m) => m.AddEditAmenity,
      ),
  },
];
