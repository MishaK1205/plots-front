import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { CompaniesService } from '../../api/services/companies.service';
import {
  CompanyResponseInterface,
  CompaniesResponseInterface,
} from '../../api/interfaces';

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
    MatToolbarModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './companies.html',
  styleUrl: './companies.scss',
})
export class Companies implements OnInit {
  private companiesService = inject(CompaniesService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = [
    'companyName',
    'email',
    'phone',
    'address',
    'createdAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<CompanyResponseInterface>();

  isLoading = signal(false);
  totalItems = signal(0);
  pageSize = signal(10);
  currentPage = signal(0);

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading.set(true);
    this.companiesService
      .getAll({
        page: this.currentPage() + 1,
        limit: this.pageSize(),
      })
      .subscribe({
        next: (response: CompaniesResponseInterface) => {
          this.dataSource.data = response.data;
          this.totalItems.set(response.pagination.totalItems);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading companies:', error);
          this.isLoading.set(false);
        },
      });
  }

  onDelete(company: CompanyResponseInterface): void {
    if (!confirm(`Delete company "${company.companyName.geo}"?`)) {
      return;
    }

    this.companiesService.delete(company.id).subscribe({
      next: () => {
        this.snackBar.open('Company deleted successfully', 'Close', {
          duration: 3000,
        });
        this.loadCompanies();
      },
      error: (error) => {
        console.error('Error deleting company:', error);
        this.snackBar.open('Error deleting company', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadCompanies();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
