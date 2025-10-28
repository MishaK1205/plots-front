import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CompaniesService, CompanyPaginatedResponse } from '../../api/services/companies.service';
import { Company } from '../../api/interfaces/company.interface';

@Component({
  selector: 'app-companies',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './companies.html',
  styleUrl: './companies.scss',
})
export class Companies implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = ['name', 'email', 'phone', 'city', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Company>();
  
  isLoading = false;
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  
  constructor(private companiesService: CompaniesService) {}
  
  ngOnInit(): void {
    this.loadCompanies();
  }
  
  loadCompanies(): void {
    this.isLoading = true;
    this.companiesService.getAll({
      page: this.currentPage + 1, // API uses 1-based pagination
      limit: this.pageSize
    }).subscribe({
      next: (response: CompanyPaginatedResponse<Company>) => {
        this.dataSource.data = response.data;
        this.totalItems = response.pagination.totalItems;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.isLoading = false;
      }
    });
  }
  
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCompanies();
  }
  
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'gray';
      case 'SUSPENDED':
        return 'red';
      default:
        return 'gray';
    }
  }
}
