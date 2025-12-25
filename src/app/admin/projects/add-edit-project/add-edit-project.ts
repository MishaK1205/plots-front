import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
import { ImagesService } from '../../../api/services';
import {
  ProjectResponseInterface,
  CompanyResponseInterface,
} from '../../../api/interfaces';

import { ImageUpload } from '../../../components/image-upload/image-upload';
import {
  GoogleMaps,
  LocationSelectedEvent,
} from '../../../components/google-maps/google-maps';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { CommunicationType } from '../../../shared';

const MATERIAL_MODULES = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSelectModule,
  MatCheckboxModule,
];

@Component({
  selector: 'app-add-edit-project',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImageUpload,
    GoogleMaps,
    ...MATERIAL_MODULES,
  ],
  templateUrl: './add-edit-project.html',
  styleUrl: './add-edit-project.scss',
})
export class AddEditProject implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef$ = inject(DestroyRef);

  private readonly projectsService = inject(ProjectsService);
  private readonly companiesService = inject(CompaniesService);
  private readonly imagesService = inject(ImagesService);

  projectForm!: FormGroup;
  isEditMode = signal(false);
  isLoading = signal(false);
  projectId = signal<string | null>(null);
  companies = signal<CompanyResponseInterface[]>([]);
  communicationTypes = Object.values(CommunicationType);

  ngOnInit(): void {
    this.initializeForm();
    this.loadCompanies();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      propertyType: ['land', [Validators.required]],
      companyId: ['', [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
      cardPhotoId: [''],
      coverPhotoId: [''],
      communications: [[]],
      location: this.fb.group({
        streetName: [''],
        city: [''],
        district: [''],
        latitude: [''],
        longitude: [''],
      }),
      videoUrl: [''],
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

  private loadCompanies(): void {
    this.companiesService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (response) => this.companies.set(response.data),
        error: () => this.showError('Failed to load companies'),
      });
  }

  private loadProject(id: string): void {
    this.isLoading.set(true);

    this.projectsService
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (project) => {
          this.populateForm(project);
          this.isLoading.set(false);
        },
        error: () => {
          this.showError('Failed to load project details');
          this.isLoading.set(false);
          this.router.navigate(['/admin/projects']);
        },
      });
  }

  private populateForm(project: ProjectResponseInterface): void {
    this.projectForm.patchValue({
      name: project.name,
      description: project.description,
      propertyType: project.propertyType,
      companyId: project.companyId,
      status: project.status,
      coverPhotoId: project.coverPhotoId,
      cardPhotoId: project.cardPhotoId,
      videoUrl: project.videoUrl,
      communications: project.communications,
      location: {
        streetName: project.location.streetName,
        city: project.location.city,
        district: project.location.district,
        latitude: project.location.latitude,
        longitude: project.location.longitude,
      }
    });
  }

  onLocationSelected(event: LocationSelectedEvent): void {
    this.projectForm.patchValue(
      {
        location: {
          streetName: event.streetName,
          city: event.city,
          district: event.district,
          latitude: event.latitude,
          longitude: event.longitude,
        }
      }
    );
  }

  onCommunicationChange(event: MatCheckboxChange, communication: string): void {
    if (event && event.checked) {
      this.projectForm.get('communications')?.value?.push(communication);
    } else {
      this.projectForm.get('communications')?.value?.splice(this.projectForm.get('communications')?.value?.indexOf(communication), 1);
    }
  }

  onSubmit(): void {
    if (!this.projectForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading.set(true);

    const operation$ = this.isEditMode()
      ? this.projectsService.update(this.projectId()!, this.projectForm.value)
      : this.projectsService.create(this.projectForm.value);

    operation$.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe({
      next: () => {
        this.showSuccess(
          this.isEditMode()
            ? 'Project updated successfully'
            : 'Project created successfully',
        );
        this.router.navigate(['/admin/projects']);
      },
      error: () => {
        this.showError(
          this.isEditMode()
            ? 'Failed to update project'
            : 'Failed to create project',
        );
        this.isLoading.set(false);
      },
    });
  }

  onCoverImageSelected(file: File): void {
    this.imagesService
      .upload(file)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (response) => {
          const coverImageId = response.id;

          this.projectForm.get('coverPhotoId')?.setValue(coverImageId);
          this.showSuccess('Image uploaded successfully');
        },
        error: () => this.showError('Failed to upload image'),
      });
  }

  onCoverImageRemoved(): void {
    const imageId = this.projectForm.get('coverPhotoId')?.value;
    if (!imageId) return;

    this.imagesService
      .delete(imageId)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: () => {
          this.projectForm.get('coverPhotoId')?.setValue(null);
          this.showSuccess('Image removed successfully');
        },
        error: () => this.showError('Failed to remove image'),
      });
  }

  onCardImageSelected(file: File): void {
    this.imagesService
      .upload(file)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (response) => {
          const cardImageId = response.id;
          this.projectForm.get('cardPhotoId')?.setValue(cardImageId);
          this.showSuccess('Image uploaded successfully');
        },
        error: () => this.showError('Failed to upload image'),
      });
  }

  onCardImageRemoved(): void {
    const imageId = this.projectForm.get('cardPhotoId')?.value;
    if (!imageId) return;

    this.imagesService
      .delete(imageId)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: () => {
          this.projectForm.get('cardPhotoId')?.setValue(null);
          this.showSuccess('Image removed successfully');
        },
        error: () => this.showError('Failed to remove image'),
      });
  }

  getFieldError(fieldName: string): string {
    const field = this.projectForm.get(fieldName);
    if (!field?.errors || !field.touched) return '';

    if (field.errors['required']) {
      return `${this.formatFieldName(fieldName)} is required`;
    }
    if (field.errors['minlength']) {
      return `${this.formatFieldName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .trim();
  }

  private markFormGroupTouched(): void {
    Object.values(this.projectForm.controls).forEach((control) =>
      control.markAsTouched(),
    );
  }

  onCancel(): void {
    this.router.navigate(['/admin/projects']);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }
}
