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
import { LocationsService } from '../../api/services/locations.service';
import {
  LocationResponseInterface,
  LocationsResponseInterface,
} from '../../api/interfaces';

@Component({
  selector: 'app-locations',
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
  templateUrl: './locations.html',
  styleUrl: './locations.scss',
})
export class Locations implements OnInit {
  private locationsService = inject(LocationsService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['locationName', 'actions'];
  dataSource = new MatTableDataSource<LocationResponseInterface>();

  isLoading = signal(false);
  totalItems = signal(0);
  pageSize = signal(10);
  currentPage = signal(0);

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.isLoading.set(true);
    this.locationsService
      .getAll({
        page: this.currentPage() + 1,
        limit: this.pageSize(),
      })
      .subscribe({
        next: (response: LocationsResponseInterface) => {
          this.dataSource.data = response.data;
          this.totalItems.set(response.pagination.totalItems);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading locations:', error);
          this.isLoading.set(false);
        },
      });
  }

  onDelete(location: LocationResponseInterface): void {
    if (!confirm(`Delete location "${location.locationName.geo}"?`)) {
      return;
    }

    this.locationsService.delete(location.id).subscribe({
      next: () => {
        this.snackBar.open('Location deleted successfully', 'Close', {
          duration: 3000,
        });
        this.loadLocations();
      },
      error: (error) => {
        console.error('Error deleting location:', error);
        this.snackBar.open('Error deleting location', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadLocations();
  }
}
