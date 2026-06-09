import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectResponseInterface } from '../interfaces';
import { CreateProjectInterface } from '../interfaces';
import { UpdateProjectInterface } from '../interfaces';
import { ProjectsResponseInterface } from '../interfaces';
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

  getFavourites(): Observable<ProjectResponseInterface[]> {
    return this.api.get<ProjectResponseInterface[]>('/projects/favourites');
  }

  getSponsored(): Observable<ProjectResponseInterface[]> {
    return this.api.get<ProjectResponseInterface[]>('/projects/sponsored');
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
