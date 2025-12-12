import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { ProjectsService } from '../../../api/services/projects.service';
import { CompaniesService } from '../../../api/services/companies.service';
import { 
  ProjectResponseInterface, 
  CreateProjectInterface, 
  UpdateProjectInterface,
  CompanyResponseInterface
} from '../../../api/interfaces';
import { ImageUpload } from '../../../components/image-upload/image-upload';
import { ImagesService } from '../../../api/services';

@Component({
  selector: 'app-add-edit-project',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    ImageUpload
  ],
  templateUrl: './add-edit-project.html',
  styleUrl: './add-edit-project.scss',
})
export class AddEditProject implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectsService = inject(ProjectsService);
  private companiesService = inject(CompaniesService);
  private snackBar = inject(MatSnackBar);
  private imagesService = inject(ImagesService);

  projectForm!: FormGroup;
  isEditMode = signal(false);
  isLoading = signal(false);
  projectId = signal<string | null>(null);
  companies = signal<CompanyResponseInterface[]>([]);

  ngOnInit(): void {
    this.loadCompanies();
    this.initializeForm();
    this.checkEditMode();
  }

  private loadCompanies(): void {
    this.companiesService.getAll().subscribe({
      next: (response) => {
        this.companies.set(response.data);
      },
      error: (error) => {
        console.error('Error loading companies:', error);
      }
    });
  }

  private initializeForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      latitude: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      locationName: ['', [Validators.required, Validators.minLength(5)]],
      propertyType: ['land', [Validators.required]],
      companyId: ['', [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
      coverPhotoUrl: [''],
      videoUrl: ['']
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.projectId.set(id);
      this.loadProject(id);
    }
  }

  private loadProject(id: string): void {
    this.isLoading.set(true);
    this.projectsService.getById(id).subscribe({
      next: (project: ProjectResponseInterface) => {
        this.projectForm.patchValue({
          name: project.name,
          description: project.description,
          latitude: project.latitude,
          longitude: project.longitude,
          locationName: project.locationName,
          propertyType: project.propertyType,
          companyId: project.companyId,
          status: project.status,
          coverPhotoUrl: project.coverPhotoUrl,
          videoUrl: project.videoUrl
        });
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading project:', error);
        this.snackBar.open('Error loading project details', 'Close', { duration: 3000 });
        this.isLoading.set(false);
        this.router.navigate(['/admin/projects']);
      }
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isLoading.set(true);
      const formData = this.projectForm.value;

      if (this.isEditMode()) {
        this.updateProject(formData);
      } else {
        this.createProject(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createProject(data: CreateProjectInterface): void {
    this.projectsService.create(data).subscribe({
      next: (project: ProjectResponseInterface) => {
        this.snackBar.open('Project created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/admin/projects']);
      },
      error: (error: any) => {
        console.error('Error creating project:', error);
        this.snackBar.open('Error creating project', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  private updateProject(data: UpdateProjectInterface): void {
    const id = this.projectId();
    if (id) {
      this.projectsService.update(id, data).subscribe({
        next: (project: ProjectResponseInterface) => {
          this.snackBar.open('Project updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/projects']);
        },
        error: (error: any) => {
          console.error('Error updating project:', error);
          this.snackBar.open('Error updating project', 'Close', { duration: 3000 });
          this.isLoading.set(false);
        }
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/projects']);
  }

  getFieldError(fieldName: string): string {
    const field = this.projectForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  onCoverImageSelected(file: File): void {
    this.imagesService.upload(file).subscribe({
      next: (response) => {
        this.projectForm.get('coverPhotoUrl')?.setValue(response.imageUrl);
      },
      error: (error) => {
        console.error('Error uploading cover image:', error);
        this.snackBar.open('Error uploading cover image', 'Close', { duration: 3000 });
      }
    });
  }

  onCoverImageRemoved(): void {
    this.imagesService.delete(this.projectForm.get('coverPhotoUrl')?.value).subscribe({
      next: () => {
        this.projectForm.get('coverPhotoUrl')?.setValue(null);
      },
      error: (error) => {
        console.error('Error deleting cover image:', error);
        this.snackBar.open('Error deleting cover image', 'Close', { duration: 3000 });
      }
    });
  }
}

