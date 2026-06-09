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
import { ProjectsService } from '../../api/services/projects.service';
import {
  ProjectResponseInterface,
  ProjectsResponseInterface,
} from '../../api/interfaces';

@Component({
  selector: 'app-projects',
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
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements OnInit {
  private projectsService = inject(ProjectsService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = [
    'name',
    'status',
    'isActive',
    'isFavourite',
    'createdAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<ProjectResponseInterface>();

  isLoading = signal(false);
  totalItems = signal(0);
  pageSize = signal(10);
  currentPage = signal(0);

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading.set(true);
    this.projectsService
      .getAll({
        page: this.currentPage() + 1,
        limit: this.pageSize(),
      })
      .subscribe({
        next: (response: ProjectsResponseInterface) => {
          this.dataSource.data = response.data;
          this.totalItems.set(response.pagination.totalItems);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading projects:', error);
          this.isLoading.set(false);
        },
      });
  }

  onDelete(project: ProjectResponseInterface): void {
    if (!confirm(`Delete project "${project.name}"?`)) {
      return;
    }

    this.projectsService.delete(project.id).subscribe({
      next: () => {
        this.snackBar.open('Project deleted successfully', 'Close', {
          duration: 3000,
        });
        this.loadProjects();
      },
      error: (error) => {
        console.error('Error deleting project:', error);
        this.snackBar.open('Error deleting project', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProjects();
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
      default:
        return 'gray';
    }
  }
}
