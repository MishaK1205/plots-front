import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
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
import { LandsService } from '../../../api/services/lands.service';
import { ProjectsService } from '../../../api/services/projects.service';
import {
  LandResponseInterface,
  CreateLandInterface,
  UpdateLandInterface,
  ProjectResponseInterface,
} from '../../../api/interfaces';
import { ImageUpload } from '../../../components/image-upload/image-upload';
import { ImagesService } from '../../../api/services';

@Component({
  selector: 'app-add-edit-land',
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
    ImageUpload,
  ],
  templateUrl: './add-edit-land.html',
  styleUrl: './add-edit-land.scss',
})
export class AddEditLand implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private landsService = inject(LandsService);
  private projectsService = inject(ProjectsService);
  private snackBar = inject(MatSnackBar);
  private imagesService = inject(ImagesService);

  landForm!: FormGroup;
  isEditMode = signal(false);
  isLoading = signal(false);
  landId = signal<string | null>(null);
  projects = signal<ProjectResponseInterface[]>([]);
  coverImageId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProjects();
    this.initializeForm();
    this.checkEditMode();
  }

  private loadProjects(): void {
    this.projectsService.getAll().subscribe({
      next: (response) => {
        this.projects.set(response.data);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      },
    });
  }

  private initializeForm(): void {
    this.landForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      squareMeters: [null, [Validators.required, Validators.min(1)]],
      squareMeterPrice: [null, [Validators.required, Validators.min(0)]],
      cadastralCode: ['', [Validators.required]],
      projectId: ['', [Validators.required]],
      imageUrl: [''],
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.landId.set(id);
      this.loadLand(id);
    }
  }

  private loadLand(id: string): void {
    this.isLoading.set(true);
    this.landsService.getById(id).subscribe({
      next: (land: LandResponseInterface) => {
        this.landForm.patchValue({
          name: land.name,
          squareMeters: land.squareMeters,
          squareMeterPrice: land.squareMeterPrice,
          cadastralCode: land.cadastralCode,
          projectId: land.projectId,
          imageUrl: land.imageUrl,
        });
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading land:', error);
        this.snackBar.open('Error loading land details', 'Close', {
          duration: 3000,
        });
        this.isLoading.set(false);
        this.router.navigate(['/admin/lands']);
      },
    });
  }

  onSubmit(): void {
    if (this.landForm.valid) {
      this.isLoading.set(true);
      const formData = this.landForm.value;

      if (this.isEditMode()) {
        this.updateLand(formData);
      } else {
        this.createLand(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createLand(data: CreateLandInterface): void {
    this.landsService.create(data).subscribe({
      next: (land: LandResponseInterface) => {
        this.snackBar.open('Land created successfully', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/admin/lands']);
      },
      error: (error: any) => {
        console.error('Error creating land:', error);
        this.snackBar.open('Error creating land', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      },
    });
  }

  private updateLand(data: UpdateLandInterface): void {
    const id = this.landId();
    if (id) {
      this.landsService.update(id, data).subscribe({
        next: (land: LandResponseInterface) => {
          this.snackBar.open('Land updated successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/admin/lands']);
        },
        error: (error: any) => {
          console.error('Error updating land:', error);
          this.snackBar.open('Error updating land', 'Close', {
            duration: 3000,
          });
          this.isLoading.set(false);
        },
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.landForm.controls).forEach((key) => {
      const control = this.landForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/lands']);
  }

  getFieldError(fieldName: string): string {
    const field = this.landForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength'])
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['min'])
        return `${fieldName} must be greater than ${field.errors['min'].min}`;
    }
    return '';
  }

  onCoverImageSelected(file: File): void {
    this.imagesService.upload(file).subscribe({
      next: (response) => {
        this.coverImageId.set(response.id);
        this.landForm.patchValue({ imageUrl: response.imageUrl });
      },
      error: (error) => {
        console.error('Error uploading cover image:', error);
        this.snackBar.open('Error uploading cover image', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onCoverImageRemoved(): void {
    const imageId = this.coverImageId();
    if (imageId) {
      this.imagesService.delete(imageId).subscribe({
        next: () => {
          this.coverImageId.set(null);
          this.landForm.patchValue({ imageUrl: '' });
        },
        error: (error) => {
          console.error('Error deleting cover image:', error);
          this.snackBar.open('Error deleting cover image', 'Close', {
            duration: 3000,
          });
        },
      });
    } else {
      this.coverImageId.set(null);
      this.landForm.patchValue({ imageUrl: '' });
    }
  }
}
