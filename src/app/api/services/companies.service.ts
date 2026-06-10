import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyResponseInterface } from '../interfaces';
import { CreateCompanyInterface } from '../interfaces';
import { UpdateCompanyInterface } from '../interfaces';
import { CompaniesResponseInterface } from '../interfaces';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private readonly api = inject(ApiService);

  getAll(params?: {
    page?: number;
    limit?: number;
  }): Observable<CompaniesResponseInterface> {
    return this.api.get<CompaniesResponseInterface>('/companies', params);
  }

  getById(id: string): Observable<CompanyResponseInterface> {
    return this.api.get<CompanyResponseInterface>(`/companies/${id}`);
  }

  create(
    company: CreateCompanyInterface,
  ): Observable<CompanyResponseInterface> {
    return this.api.post<CompanyResponseInterface>('/companies', company);
  }

  update(
    id: string,
    company: UpdateCompanyInterface,
  ): Observable<CompanyResponseInterface> {
    return this.api.put<CompanyResponseInterface>(`/companies/${id}`, company);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/companies/${id}`);
  }
}
