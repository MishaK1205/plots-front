import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AmenityResponseInterface } from '../interfaces';
import { AmenitiesResponseInterface } from '../interfaces';
import { CreateAmenityInterface } from '../interfaces';
import { UpdateAmenityInterface } from '../interfaces';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AmenitiesService {
  private readonly api = inject(ApiService);

  getAll(params?: {
    page?: number;
    limit?: number;
  }): Observable<AmenitiesResponseInterface> {
    return this.api.get<AmenitiesResponseInterface>('/amenities', params);
  }

  getById(id: string): Observable<AmenityResponseInterface> {
    return this.api.get<AmenityResponseInterface>(`/amenities/${id}`);
  }

  create(
    amenity: CreateAmenityInterface,
  ): Observable<AmenityResponseInterface> {
    return this.api.post<AmenityResponseInterface>('/amenities', amenity);
  }

  update(
    id: string,
    amenity: UpdateAmenityInterface,
  ): Observable<AmenityResponseInterface> {
    return this.api.put<AmenityResponseInterface>(`/amenities/${id}`, amenity);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/amenities/${id}`);
  }
}
