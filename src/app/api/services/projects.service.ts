import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, CreateProjectDto, UpdateProjectDto } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Get all projects or filter by company ID
   */
  getAll(companyId?: string): Observable<Project[]> {
    let params = new HttpParams();
    if (companyId) {
      params = params.set('companyId', companyId);
    }
    
    return this.http.get<Project[]>(`${this.baseUrl}/projects`, { params });
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
  create(project: CreateProjectDto): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects`, project);
  }

  /**
   * Update a project
   */
  update(id: string, project: UpdateProjectDto): Observable<Project> {
    return this.http.patch<Project>(`${this.baseUrl}/projects/${id}`, project);
  }

  /**
   * Delete a project
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${id}`);
  }
}
