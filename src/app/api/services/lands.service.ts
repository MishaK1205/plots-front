import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LandResponseInterface } from '../interfaces/land/land-response.interface';
import { CreateLandInterface } from '../interfaces/land/create-land.interface';
import { UpdateLandInterface } from '../interfaces/land/update-land.interface';
import { LandsResponseInterface } from '../interfaces/land/lands-response.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class LandsService {
  private readonly api = inject(ApiService);

  getAll(params?: {
    projectId?: string;
    page?: number;
    limit?: number;
  }): Observable<LandsResponseInterface> {
    return this.api.get<LandsResponseInterface>('/lands', params);
  }

  getById(id: string): Observable<LandResponseInterface> {
    return this.api.get<LandResponseInterface>(`/lands/${id}`);
  }

  create(land: CreateLandInterface): Observable<LandResponseInterface> {
    return this.api.post<LandResponseInterface>('/lands', land);
  }

  update(
    id: string,
    land: UpdateLandInterface,
  ): Observable<LandResponseInterface> {
    return this.api.put<LandResponseInterface>(`/lands/${id}`, land);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/lands/${id}`);
  }
}
