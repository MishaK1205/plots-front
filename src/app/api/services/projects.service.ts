import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Project, 
  CreateProject, 
  UpdateProject 
} from '../interfaces';

export interface ProjectQueryParams {
  companyId?: string;
  page?: number;
  limit?: number;
}

export interface ProjectPaginatedResponse<T> {
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
export class ProjectsService {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Get all projects with pagination or filter by company
   */
  getAll(queryParams?: ProjectQueryParams): Observable<ProjectPaginatedResponse<Project>> {
    let params = new HttpParams();
    if (queryParams) {
      if (queryParams.companyId) {
        params = params.set('companyId', queryParams.companyId);
      }
      if (queryParams.page !== undefined) {
        params = params.set('page', queryParams.page.toString());
      }
      if (queryParams.limit !== undefined) {
        params = params.set('limit', queryParams.limit.toString());
      }
    }
    
    return this.http.get<ProjectPaginatedResponse<Project>>(`${this.baseUrl}/projects`, { params });
  }

  /**
   * Get a project by ID
   */
  getById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/projects/${id}`);
  }

  /**
   * Create a new project
   */
  create(project: CreateProject): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects`, project);
  }

  /**
   * Update a project by ID
   */
  update(id: string, project: UpdateProject): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/projects/${id}`, project);
  }

  /**
   * Delete a project by ID
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${id}`);
  }
}