import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company, CreateCompanyDto } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Get all companies
   */
  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/companies`);
  }

  /**
   * Get a company by ID
   */
  getById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/companies/${id}`);
  }

  /**
   * Create a new company
   */
  create(company: CreateCompanyDto): Observable<Company> {
    return this.http.post<Company>(`${this.baseUrl}/companies`, company);
  }
}
