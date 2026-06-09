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
import { LandsService } from '../../api/services/lands.service';
import {
  LandResponseInterface,
  LandsResponseInterface,
} from '../../api/interfaces';

@Component({
  selector: 'app-lands',
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
  templateUrl: './lands.html',
  styleUrl: './lands.scss',
})
export class Lands implements OnInit {
  private landsService = inject(LandsService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = [
    'name',
    'cadastralCode',
    'squareMeters',
    'squareMeterPrice',
    'totalPrice',
    'createdAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<LandResponseInterface>();

  isLoading = signal(false);
  totalItems = signal(0);
  pageSize = signal(10);
  currentPage = signal(0);

  ngOnInit(): void {
    this.loadLands();
  }

  loadLands(): void {
    this.isLoading.set(true);
    this.landsService
      .getAll({
        page: this.currentPage() + 1,
        limit: this.pageSize(),
      })
      .subscribe({
        next: (response: LandsResponseInterface) => {
          this.dataSource.data = response.data;
          this.totalItems.set(response.pagination.totalItems);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading lands:', error);
          this.isLoading.set(false);
        },
      });
  }

  onDelete(land: LandResponseInterface): void {
    if (!confirm(`Delete land "${land.name}"?`)) {
      return;
    }

    this.landsService.delete(land.id).subscribe({
      next: () => {
        this.snackBar.open('Land deleted successfully', 'Close', {
          duration: 3000,
        });
        this.loadLands();
      },
      error: (error) => {
        console.error('Error deleting land:', error);
        this.snackBar.open('Error deleting land', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadLands();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  formatArea(area: number): string {
    return `${area.toLocaleString()} m²`;
  }

  formatPricePerSquareMeter(price: number): string {
    return `${this.formatCurrency(price)}/m²`;
  }
}
