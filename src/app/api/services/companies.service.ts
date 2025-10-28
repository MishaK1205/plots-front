import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Company, 
  CreateCompany, 
  UpdateCompany 
} from '../interfaces';

export interface CompanyQueryParams {
  page?: number;
  limit?: number;
}

export interface CompanyPaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Get all companies with pagination
   */
  getAll(queryParams?: CompanyQueryParams): Observable<CompanyPaginatedResponse<Company>> {
    let params = new HttpParams();
    if (queryParams) {
      if (queryParams.page !== undefined) {
        params = params.set('page', queryParams.page.toString());
      }
      if (queryParams.limit !== undefined) {
        params = params.set('limit', queryParams.limit.toString());
      }
    }
    
    return this.http.get<CompanyPaginatedResponse<Company>>(`${this.baseUrl}/companies`, { params });
  }

  /**
   * Get a company by ID
   */
  getById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/companies/${id}`);
  }

  /**
   * Create a new company
   */
  create(company: CreateCompany): Observable<Company> {
    return this.http.post<Company>(`${this.baseUrl}/companies`, company);
  }

  /**
   * Update a company by ID
   */
  update(id: string, company: UpdateCompany): Observable<Company> {
    return this.http.put<Company>(`${this.baseUrl}/companies/${id}`, company);
  }

  /**
   * Delete a company by ID
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/companies/${id}`);
  }
}