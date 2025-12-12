import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageResponseInterface } from '../interfaces/images/image-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  /**
   * Upload an image file
   * @param file Image file to upload
   */
  upload(file: File): Observable<ImageResponseInterface> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<ImageResponseInterface>(`${this.apiUrl}/images`, formData);
  }

  /**
   * Get image data by ID
   * @param id Image UUID
   */
  getImage(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/images/${id}`, { responseType: 'blob' });
  }

  /**
   * Delete an image by ID
   * @param id Image UUID
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/images/${id}`);
  }
}
