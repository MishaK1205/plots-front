import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ProjectsService } from '../../../api/services/projects.service';
import { CompaniesService } from '../../../api/services/companies.service';
import { LocationsService } from '../../../api/services/locations.service';
import { AmenitiesService } from '../../../api/services/amenities.service';
import { ImagesService } from '../../../api/services';
import {
  ProjectResponseInterface,
  CompanyResponseInterface,
  LocationResponseInterface,
  AmenityResponseInterface,
  CreateProjectInterface,
  ProjectFaqItem,
} from '../../../api/interfaces';

import { ImageUpload } from '../../../components/image-upload/image-upload';
import {
  GoogleMaps,
  LocationSelectedEvent,
} from '../../../components/google-maps/google-maps';
import { environment } from '../../../../environments/environment';

const IMAGE_BASE_URL = `${environment.apiUrl}/images`;

type FaqLanguage = 'geo' | 'eng' | 'rus';

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
  private readonly locationsService = inject(LocationsService);
  private readonly amenitiesService = inject(AmenitiesService);
  private readonly imagesService = inject(ImagesService);

  readonly faqLanguages: { key: FaqLanguage; label: string }[] = [
    { key: 'geo', label: 'Georgian' },
    { key: 'eng', label: 'English' },
    { key: 'rus', label: 'Russian' },
  ];

  projectForm!: FormGroup;
  isEditMode = signal(false);
  isLoading = signal(false);
  projectId = signal<string | null>(null);

  companies = signal<CompanyResponseInterface[]>([]);
  locations = signal<LocationResponseInterface[]>([]);
  amenities = signal<AmenityResponseInterface[]>([]);

  gallery = signal<string[]>([]);
  isUploadingGallery = signal(false);

  ngOnInit(): void {
    this.initializeForm();
    this.loadDropdownData();
    this.checkEditMode();
  }

  private localizedGroup(): FormGroup {
    return this.fb.group({
      geo: [''],
      eng: [''],
      rus: [''],
    });
  }

  private initializeForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      companyId: ['', [Validators.required]],
      locationId: ['', [Validators.required]],
      amenityId: ['', [Validators.required]],
      shortDescription: this.localizedGroup(),
      description: this.localizedGroup(),
      tagline: this.localizedGroup(),
      minutesToLocation: this.localizedGroup(),
      faqs: this.fb.group({
        geo: this.fb.array([]),
        eng: this.fb.array([]),
        rus: this.fb.array([]),
      }),
      photoId: [''],
      coverPhotoId: [''],
      location: this.fb.group({
        latitude: [null as number | null],
        longitude: [null as number | null],
      }),
      isFavourite: [false],
      isSponsored: [false],
      isActive: [false],
    });
  }

  get faqsGroup(): FormGroup {
    return this.projectForm.get('faqs') as FormGroup;
  }

  faqArray(lang: FaqLanguage): FormArray {
    return this.faqsGroup.get(lang) as FormArray;
  }

  private createFaqGroup(item?: ProjectFaqItem): FormGroup {
    return this.fb.group({
      question: [item?.question ?? '', [Validators.required]],
      answer: [item?.answer ?? '', [Validators.required]],
    });
  }

  addFaq(lang: FaqLanguage, item?: ProjectFaqItem): void {
    this.faqArray(lang).push(this.createFaqGroup(item));
  }

  removeFaq(lang: FaqLanguage, index: number): void {
    this.faqArray(lang).removeAt(index);
  }

  private loadDropdownData(): void {
    this.companiesService
      .getAll({ limit: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (response) => this.companies.set(response.data),
        error: () => this.showError('Failed to load companies'),
      });

    this.locationsService
      .getAll({ limit: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (response) => this.locations.set(response.data),
        error: () => this.showError('Failed to load locations'),
      });

    this.amenitiesService
      .getAll({ limit: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (response) => this.amenities.set(response.data),
        error: () => this.showError('Failed to load amenities'),
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
      companyId: project.companyId,
      locationId: project.locationId,
      amenityId: project.amenityId,
      shortDescription: this.localizedValue(project.shortDescription),
      description: this.localizedValue(project.description),
      tagline: this.localizedValue(project.tagline),
      minutesToLocation: this.localizedValue(project.minutesToLocation),
      photoId: project.photoId ?? '',
      coverPhotoId: project.coverPhotoId ?? '',
      location: {
        latitude: project.location?.latitude ?? null,
        longitude: project.location?.longitude ?? null,
      },
      isFavourite: project.isFavourite ?? false,
      isSponsored: project.isSponsored ?? false,
      isActive: project.isActive ?? false,
    });

    this.gallery.set(project.gallery ?? []);
    this.patchFaqs(project.faq);
  }

  private localizedValue(
    value: { geo?: string; eng?: string; rus?: string } | undefined,
  ): { geo: string; eng: string; rus: string } {
    return {
      geo: value?.geo ?? '',
      eng: value?.eng ?? '',
      rus: value?.rus ?? '',
    };
  }

  private patchFaqs(faqs: ProjectResponseInterface['faq'] | undefined): void {
    if (!faqs) return;
    (['geo', 'eng', 'rus'] as FaqLanguage[]).forEach((lang) => {
      const arr = this.faqArray(lang);
      arr.clear();
      (faqs[lang] ?? []).forEach((item) => this.addFaq(lang, item));
    });
  }

  onLocationSelected(event: LocationSelectedEvent): void {
    this.projectForm.get('location')?.patchValue({
      latitude: event.latitude,
      longitude: event.longitude,
    });
  }

  private collectFaqs(): CreateProjectInterface['faqs'] {
    const build = (lang: FaqLanguage): ProjectFaqItem[] =>
      (this.faqArray(lang).getRawValue() as ProjectFaqItem[]).map((item) => ({
        question: (item.question ?? '').trim(),
        answer: (item.answer ?? '').trim(),
      }));

    return {
      geo: build('geo'),
      eng: build('eng'),
      rus: build('rus'),
    };
  }

  private toApiPayload(): CreateProjectInterface {
    const v = this.projectForm.getRawValue();
    const lat = Number(v.location.latitude);
    const lng = Number(v.location.longitude);

    return {
      name: v.name,
      shortDescription: v.shortDescription,
      description: v.description,
      faqs: this.collectFaqs(),
      locationId: v.locationId,
      amenityId: v.amenityId,
      minutesToLocation: v.minutesToLocation,
      tagline: v.tagline,
      photoId: v.photoId || undefined,
      coverPhotoId: v.coverPhotoId || undefined,
      gallery: this.gallery(),
      location: {
        latitude: Number.isFinite(lat) ? lat : 0,
        longitude: Number.isFinite(lng) ? lng : 0,
      },
      isFavourite: !!v.isFavourite,
      isSponsored: !!v.isSponsored,
      isActive: !!v.isActive,
      companyId: v.companyId,
    };
  }

  onSubmit(): void {
    if (!this.projectForm.valid) {
      this.projectForm.markAllAsTouched();
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

  imageUrl(id: string | null | undefined): string | undefined {
    return id ? `${IMAGE_BASE_URL}/${id}` : undefined;
  }

  onCoverImageSelected(file: File): void {
    this.imagesService
      .upload(file)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (response) => {
          this.projectForm.get('coverPhotoId')?.setValue(response.id);
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
          this.projectForm.get('coverPhotoId')?.setValue('');
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
          this.projectForm.get('photoId')?.setValue(response.id);
          this.showSuccess('Image uploaded successfully');
        },
        error: () => this.showError('Failed to upload image'),
      });
  }

  onCardImageRemoved(): void {
    const imageId = this.projectForm.get('photoId')?.value;
    if (!imageId) return;

    this.imagesService
      .delete(imageId)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: () => {
          this.projectForm.get('photoId')?.setValue('');
          this.showSuccess('Image removed successfully');
        },
        error: () => this.showError('Failed to remove image'),
      });
  }

  onGalleryFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    this.isUploadingGallery.set(true);
    const uploads = Array.from(files).map((file) =>
      this.imagesService.upload(file),
    );

    forkJoin(uploads)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (responses) => {
          this.gallery.update((ids) => [
            ...ids,
            ...responses.map((r) => r.id),
          ]);
          this.isUploadingGallery.set(false);
          this.showSuccess('Gallery images uploaded successfully');
        },
        error: () => {
          this.isUploadingGallery.set(false);
          this.showError('Failed to upload gallery images');
        },
      });

    input.value = '';
  }

  onGalleryImageRemoved(imageId: string): void {
    this.imagesService
      .delete(imageId)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: () => {
          this.gallery.update((ids) => ids.filter((id) => id !== imageId));
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
