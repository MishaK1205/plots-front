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
import { AmenitiesService } from '../../api/services/amenities.service';
import {
  AmenityResponseInterface,
  AmenitiesResponseInterface,
} from '../../api/interfaces';

@Component({
  selector: 'app-amenities',
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
  templateUrl: './amenities.html',
  styleUrl: './amenities.scss',
})
export class Amenities implements OnInit {
  private amenitiesService = inject(AmenitiesService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['amenityName', 'actions'];
  dataSource = new MatTableDataSource<AmenityResponseInterface>();

  isLoading = signal(false);
  totalItems = signal(0);
  pageSize = signal(10);
  currentPage = signal(0);

  ngOnInit(): void {
    this.loadAmenities();
  }

  loadAmenities(): void {
    this.isLoading.set(true);
    this.amenitiesService
      .getAll({
        page: this.currentPage() + 1,
        limit: this.pageSize(),
      })
      .subscribe({
        next: (response: AmenitiesResponseInterface) => {
          this.dataSource.data = response.data;
          this.totalItems.set(response.pagination.totalItems);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading amenities:', error);
          this.isLoading.set(false);
        },
      });
  }

  onDelete(amenity: AmenityResponseInterface): void {
    if (!confirm(`Delete amenity "${amenity.amenityName.geo}"?`)) {
      return;
    }

    this.amenitiesService.delete(amenity.id).subscribe({
      next: () => {
        this.snackBar.open('Amenity deleted successfully', 'Close', {
          duration: 3000,
        });
        this.loadAmenities();
      },
      error: (error) => {
        console.error('Error deleting amenity:', error);
        this.snackBar.open('Error deleting amenity', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadAmenities();
  }
}
