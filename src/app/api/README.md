# API Interfaces

This directory contains auto-generated TypeScript interfaces from the OpenAPI specification.

## Files

- `types.ts` - Complete OpenAPI type definitions (auto-generated, do not edit)
- `interfaces.ts` - Simplified exports of commonly used types

## Usage

### Import Types

```typescript
import { Company, CreateCompanyDto, Project } from '../api/interfaces';

// Use the types in your components
const company: Company = {
  id: '123',
  name: 'Example Company',
  // ... other properties
};
```

### Available Types

- `Company` - Company interface
- `CreateCompanyDto` - Company creation payload
- `Project` - Project interface
- `CreateProjectDto` - Project creation payload
- `UpdateProjectDto` - Project update payload

### Using with HTTP Client

Example with Angular HttpClient:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company, CreateCompanyDto } from './api/interfaces';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>('http://localhost:3000/api/companies');
  }

  createCompany(data: CreateCompanyDto): Observable<Company> {
    return this.http.post<Company>('http://localhost:3000/api/companies', data);
  }
}
```

## Regenerating Types

When the API changes, regenerate the types:

```bash
npx openapi-typescript http://localhost:3000/swagger-json -o src/app/api/types.ts
```

Note: The `types.ts` file is auto-generated and should not be manually edited.
