import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageResponseInterface } from '../interfaces/images/image-response.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private readonly api = inject(ApiService);

  upload(file: File): Observable<ImageResponseInterface> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.api.post<ImageResponseInterface>('/images', formData);
  }

  getImage(id: string): Observable<Blob> {
    return this.api.get<Blob>(`/images/${id}`, undefined, {
      responseType: 'blob',
    });
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${id}`);
  }
}
