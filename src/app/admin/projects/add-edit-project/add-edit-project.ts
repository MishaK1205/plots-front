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
  CreateProjectInterface,
  ProjectCommunication,
  ProjectCommunicationType,
} from '../../../api/interfaces';

import { ImageUpload } from '../../../components/image-upload/image-upload';
import {
  GoogleMaps,
  LocationSelectedEvent,
} from '../../../components/google-maps/google-maps';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommunicationType } from '../../../shared';

const COMMUNICATION_DEFAULT_DESCRIPTIONS: Record<string, string> = {
  [CommunicationType.GAS]: 'Natural gas connection',
  [CommunicationType.WATER]: 'Water supply connection',
  [CommunicationType.SEWERAGE]: 'Sewerage system',
  [CommunicationType.ROAD]: 'Road access',
  [CommunicationType.ELECTRICITY]: 'Electrical connection',
  [CommunicationType.INTERNET]: 'Internet connection',
};

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

  ngOnInit(): void {
    this.initializeForm();
    this.loadCompanies();
    this.checkEditMode();
  }

  get communicationsFormArray(): FormArray {
    return this.projectForm.get('communications') as FormArray;
  }

  private createCommunicationsFormArray(): FormArray {
    return this.fb.array(
      Object.values(CommunicationType).map((type) =>
        this.fb.group({
          type: [type],
          available: [false],
          description: [COMMUNICATION_DEFAULT_DESCRIPTIONS[type] ?? ''],
        }),
      ),
    );
  }

  private initializeForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      companyId: ['', [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
      cardPhotoId: [''],
      coverPhotoId: [''],
      photosText: [''],
      tagsText: [''],
      communications: this.createCommunicationsFormArray(),
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

  private patchCommunicationsFromProject(
    comms: ProjectResponseInterface['communications'] | undefined,
  ): void {
    const arr = this.communicationsFormArray;
    if (!comms?.length) return;
    const first = comms[0];
    const isNewFormat =
      typeof first === 'object' &&
      first !== null &&
      'available' in first;

    if (isNewFormat) {
      const byType = new Map(
        (comms as ProjectCommunication[]).map((c) => [c.type, c]),
      );
      arr.controls.forEach((ctrl) => {
        const g = ctrl as FormGroup;
        const t = g.get('type')!.value as ProjectCommunicationType;
        const item = byType.get(t);
        if (item) {
          g.patchValue({
            available: item.available,
            description: item.description ?? '',
          });
        }
      });
    } else {
      const selected = new Set(comms as unknown as string[]);
      arr.controls.forEach((ctrl) => {
        const g = ctrl as FormGroup;
        const t = g.get('type')!.value as CommunicationType;
        g.patchValue({
          available: selected.has(t),
          description: COMMUNICATION_DEFAULT_DESCRIPTIONS[t] ?? '',
        });
      });
    }
  }

  private populateForm(project: ProjectResponseInterface): void {
    this.projectForm.patchValue({
      name: project.name,
      description: project.description,
      companyId: project.companyId,
      status: project.status,
      coverPhotoId: project.coverPhotoId,
      cardPhotoId: project.cardPhotoId,
      videoUrl: project.videoUrl,
      photosText: (project.photos ?? []).join('\n'),
      tagsText: (project.tags ?? []).join(', '),
      location: {
        streetName: project.location.streetName,
        city: project.location.city,
        district: project.location.district,
        latitude: project.location.latitude,
        longitude: project.location.longitude,
      },
    });
    this.patchCommunicationsFromProject(project.communications);
  }

  onLocationSelected(event: LocationSelectedEvent): void {
    this.projectForm.patchValue({
      location: {
        streetName: event.streetName,
        city: event.city,
        district: event.district,
        latitude: event.latitude,
        longitude: event.longitude,
      },
    });
  }

  private toApiPayload(): CreateProjectInterface {
    const v = this.projectForm.getRawValue();
    const photos = (v.photosText as string)
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = (v.tagsText as string)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const lat = Number(v.location.latitude);
    const lng = Number(v.location.longitude);

    return {
      name: v.name,
      description: v.description,
      location: {
        streetName: v.location.streetName ?? '',
        city: v.location.city ?? '',
        district: v.location.district ?? '',
        latitude: Number.isFinite(lat) ? lat : 0,
        longitude: Number.isFinite(lng) ? lng : 0,
      },
      cardPhotoId: v.cardPhotoId || undefined,
      coverPhotoId: v.coverPhotoId || undefined,
      photos: photos.length ? photos : undefined,
      videoUrl: v.videoUrl || undefined,
      communications: (v.communications as ProjectCommunication[]).map(
        (c) => ({
          type: c.type,
          available: !!c.available,
          description: (c.description ?? '').toString(),
        }),
      ),
      tags: tags.length ? tags : undefined,
      status: v.status,
      companyId: v.companyId,
    };
  }

  onSubmit(): void {
    if (!this.projectForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading.set(true);
    const payload = this.toApiPayload();

    const operation$ = this.isEditMode()
      ? this.projectsService.update(this.projectId()!, payload)
      : this.projectsService.create(payload);

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
    this.communicationsFormArray.controls.forEach((c) => c.markAsTouched());
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
