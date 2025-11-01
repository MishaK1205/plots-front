import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyResponseInterface } from '../interfaces/company/company-response.interface';
import { CreateCompanyInterface } from '../interfaces/company/create-company.interface';
import { UpdateCompanyInterface } from '../interfaces/company/update-company.interface';
import { CompaniesResponseInterface } from '../interfaces/company/companies-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  /**
   * Get all companies with pagination
   * @param params Pagination parameters (page, limit)
   */
  getAll(params?: { page?: number; limit?: number }): Observable<CompaniesResponseInterface> {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<CompaniesResponseInterface>(`${this.apiUrl}/companies`, { params: httpParams });
  }

  /**
   * Get a company by ID
   * @param id Company UUID
   */
  getById(id: string): Observable<CompanyResponseInterface> {
    return this.http.get<CompanyResponseInterface>(`${this.apiUrl}/companies/${id}`);
  }

  /**
   * Create a new company
   * @param company Company data
   */
  create(company: CreateCompanyInterface): Observable<CompanyResponseInterface> {
    return this.http.post<CompanyResponseInterface>(`${this.apiUrl}/companies`, company);
  }

  /**
   * Update a company by ID
   * @param id Company UUID
   * @param company Updated company data
   */
  update(id: string, company: UpdateCompanyInterface): Observable<CompanyResponseInterface> {
    return this.http.put<CompanyResponseInterface>(`${this.apiUrl}/companies/${id}`, company);
  }
}

