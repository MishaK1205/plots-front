import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectResponseInterface } from '../interfaces/project/project-response.interface';
import { CreateProjectInterface } from '../interfaces/project/create-project.interface';
import { UpdateProjectInterface } from '../interfaces/project/update-project.interface';
import { ProjectsResponseInterface } from '../interfaces/project/projects-response.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly api = inject(ApiService);

  getAll(params?: {
    companyId?: string;
    page?: number;
    limit?: number;
  }): Observable<ProjectsResponseInterface> {
    return this.api.get<ProjectsResponseInterface>('/projects', params);
  }

  getById(id: string): Observable<ProjectResponseInterface> {
    return this.api.get<ProjectResponseInterface>(`/projects/${id}`);
  }

  create(
    project: CreateProjectInterface,
  ): Observable<ProjectResponseInterface> {
    return this.api.post<ProjectResponseInterface>('/projects', project);
  }

  update(
    id: string,
    project: UpdateProjectInterface,
  ): Observable<ProjectResponseInterface> {
    return this.api.put<ProjectResponseInterface>(`/projects/${id}`, project);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/projects/${id}`);
  }
}
