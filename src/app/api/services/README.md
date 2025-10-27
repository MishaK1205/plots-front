# API Services

This directory contains Angular services for interacting with the backend API.

## Services

### CompaniesService
- `getAll()` - Get all companies
- `getById(id: string)` - Get company by ID
- `create(company: CreateCompanyDto)` - Create new company

### ProjectsService
- `getAll(companyId?: string)` - Get all projects or filter by company
- `getById(id: string)` - Get project by ID
- `create(project: CreateProjectDto)` - Create new project
- `update(id: string, project: UpdateProjectDto)` - Update project
- `delete(id: string)` - Delete project

## Usage

```typescript
import { Component, OnInit } from '@angular/core';
import { CompaniesService, Company } from '../api';

@Component({
  selector: 'app-example',
  template: '...'
})
export class ExampleComponent implements OnInit {
  companies: Company[] = [];

  constructor(private companiesService: CompaniesService) {}

  ngOnInit(): void {
    this.companiesService.getAll().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (err) => {
        console.error('Error loading companies:', err);
      }
    });
  }
}
```

## Configuration

All services use `http://localhost:3000/api` as the base URL. To change this:

1. Update the `baseUrl` property in each service
2. Or create a configuration service to manage API endpoints

## Error Handling

Services return RxJS Observables. Always handle errors in your components:

```typescript
this.companiesService.getAll().subscribe({
  next: (data) => { /* handle success */ },
  error: (err) => { /* handle error */ }
});
```
