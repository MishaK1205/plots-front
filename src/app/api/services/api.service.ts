import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';

  /**
   * Build HttpParams from an object, filtering out undefined and null values
   * @param params Object with query parameters
   * @returns HttpParams instance
   */
  private buildHttpParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    
    return httpParams;
  }

  /**
   * GET request
   * @param endpoint API endpoint (without base URL)
   * @param params Optional query parameters
   * @param options Optional HTTP options (headers, responseType, etc.)
   */
  get<T>(endpoint: string, params?: Record<string, any>, options?: {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    context?: HttpContext;
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  }): Observable<T> {
    const httpParams = this.buildHttpParams(params);
    const httpOptions: any = {
      params: httpParams,
      ...options
    };
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, httpOptions) as Observable<T>;
  }

  /**
   * POST request
   * @param endpoint API endpoint (without base URL)
   * @param body Request body
   * @param params Optional query parameters
   * @param options Optional HTTP options (headers, etc.)
   */
  post<T>(endpoint: string, body: any, params?: Record<string, any>, options?: {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    context?: HttpContext;
  }): Observable<T> {
    const httpParams = this.buildHttpParams(params);
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      params: httpParams,
      ...options
    });
  }

  /**
   * PUT request
   * @param endpoint API endpoint (without base URL)
   * @param body Request body
   * @param params Optional query parameters
   * @param options Optional HTTP options (headers, etc.)
   */
  put<T>(endpoint: string, body: any, params?: Record<string, any>, options?: {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    context?: HttpContext;
  }): Observable<T> {
    const httpParams = this.buildHttpParams(params);
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
      params: httpParams,
      ...options
    });
  }

  /**
   * DELETE request
   * @param endpoint API endpoint (without base URL)
   * @param params Optional query parameters
   * @param options Optional HTTP options (headers, etc.)
   */
  delete<T>(endpoint: string, params?: Record<string, any>, options?: {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    context?: HttpContext;
  }): Observable<T> {
    const httpParams = this.buildHttpParams(params);
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      params: httpParams,
      ...options
    });
  }
}

