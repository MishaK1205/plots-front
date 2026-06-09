import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationResponseInterface } from '../interfaces/location/location-response.interface';
import { LocationsResponseInterface } from '../interfaces/location/locations-response.interface';
import { CreateLocationInterface } from '../interfaces/location/create-location.interface';
import { UpdateLocationInterface } from '../interfaces/location/update-location.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  private readonly api = inject(ApiService);

  getAll(params?: {
    page?: number;
    limit?: number;
  }): Observable<LocationsResponseInterface> {
    return this.api.get<LocationsResponseInterface>('/locations', params);
  }

  getById(id: string): Observable<LocationResponseInterface> {
    return this.api.get<LocationResponseInterface>(`/locations/${id}`);
  }

  create(
    location: CreateLocationInterface,
  ): Observable<LocationResponseInterface> {
    return this.api.post<LocationResponseInterface>('/locations', location);
  }

  update(
    id: string,
    location: UpdateLocationInterface,
  ): Observable<LocationResponseInterface> {
    return this.api.put<LocationResponseInterface>(
      `/locations/${id}`,
      location,
    );
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/locations/${id}`);
  }
}
