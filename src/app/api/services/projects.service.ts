import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectResponseInterface } from '../interfaces/project/project-response.interface';
import { CreateProjectInterface } from '../interfaces/project/create-project.interface';
import { UpdateProjectInterface } from '../interfaces/project/update-project.interface';
import { ProjectsResponseInterface } from '../interfaces/project/projects-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  /**
   * Get all projects with pagination and optional filtering
   * @param params Query parameters (companyId, page, limit)
   */
  getAll(params?: { companyId?: string; page?: number; limit?: number }): Observable<ProjectsResponseInterface> {
    let httpParams = new HttpParams();
    if (params?.companyId) {
      httpParams = httpParams.set('companyId', params.companyId);
    }
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<ProjectsResponseInterface>(`${this.apiUrl}/projects`, { params: httpParams });
  }

  /**
   * Get a project by ID
   * @param id Project UUID
   */
  getById(id: string): Observable<ProjectResponseInterface> {
    return this.http.get<ProjectResponseInterface>(`${this.apiUrl}/projects/${id}`);
  }

  /**
   * Create a new project
   * @param project Project data
   */
  create(project: CreateProjectInterface): Observable<ProjectResponseInterface> {
    return this.http.post<ProjectResponseInterface>(`${this.apiUrl}/projects`, project);
  }

  /**
   * Update a project by ID
   * @param id Project UUID
   * @param project Updated project data
   */
  update(id: string, project: UpdateProjectInterface): Observable<ProjectResponseInterface> {
    return this.http.put<ProjectResponseInterface>(`${this.apiUrl}/projects/${id}`, project);
  }

  /**
   * Delete a project by ID
   * @param id Project UUID
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${id}`);
  }
}

