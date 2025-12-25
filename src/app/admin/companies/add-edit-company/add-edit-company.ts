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
import {
  CompanyResponseInterface,
  CreateCompanyInterface,
  UpdateCompanyInterface,
} from '../../../api/interfaces';
import { ImageUpload } from '../../../components/image-upload/image-upload';
import { ImagesService, CompaniesService } from '../../../api/services';
import { GoogleMaps, LocationSelectedEvent } from '../../../components';

@Component({
  selector: 'app-add-edit-company',
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
    GoogleMaps,
  ],
  templateUrl: './add-edit-company.html',
  styleUrl: './add-edit-company.scss',
})
export class AddEditCompany implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private imagesService = inject(ImagesService);
  private companiesService = inject(CompaniesService);
  private snackBar = inject(MatSnackBar);

  companyForm!: FormGroup;
  isEditMode = signal(false);
  isLoading = signal(false);
  companyId = signal<string | null>(null);
  logoFile = signal<File | null>(null);
  coverImageFile = signal<File | null>(null);
  logoImageId = signal<string | null>(null);
  coverImageId = signal<string | null>(null);

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      website: [''],
      description: [''],
      logoId: [''],
      coverImageId: [''],
      status: ['ACTIVE', [Validators.required]],
      location: this.fb.group({
        streetName: [''],
        city: [''],
        district: [''],
        latitude: [''],
        longitude: [''],
      }),
      socialAccounts: this.fb.group({
        facebook: [''],
        instagram: [''],
        linkedin: [''],
        tiktok: [''],
      }),
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.companyId.set(id);
      this.loadCompany(id);
    }
  }

  private loadCompany(id: string): void {
    this.isLoading.set(true);
    this.companiesService.getById(id).subscribe({
      next: (company: CompanyResponseInterface) => {
        this.companyForm.patchValue(company);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading company:', error);
        this.snackBar.open('Error loading company details', 'Close', {
          duration: 3000,
        });
        this.isLoading.set(false);
        this.router.navigate(['/admin/companies']);
      },
    });
  }

  onLocationSelected(event: LocationSelectedEvent): void {
    this.companyForm.patchValue(
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

  onLogoSelected(file: File): void {
    this.imagesService.upload(file).subscribe({
      next: (response) => {
        const logoId = response.id;

        this.logoImageId.set(logoId);
        this.companyForm.patchValue({ logoId });
      },
      error: (error) => {
        console.error('Error uploading logo:', error);
        this.snackBar.open('Error uploading logo', 'Close', { duration: 3000 });
      },
    });
  }

  onLogoRemoved(): void {
    this.imagesService.delete(this.companyForm.get('logoId')!.value).subscribe({
      next: () => {
        this.logoImageId.set(null);
        this.companyForm.patchValue({ logoId: '' });
      },
      error: (error) => {
        console.error('Error deleting logo:', error);
        this.snackBar.open('Error deleting logo', 'Close', { duration: 3000 });
      },
    });
  }

  onCoverImageSelected(file: File): void {
    this.imagesService.upload(file).subscribe({
      next: (response) => {
        const coverImageId = response.id;

        this.coverImageId.set(coverImageId);
        this.companyForm.patchValue({ coverImageId });
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
    this.imagesService.delete(this.companyForm.get('coverImageId')!.value).subscribe({
      next: () => {
        this.coverImageId.set(null);
        this.companyForm.patchValue({ coverImageId: '' });
      },
      error: (error) => {
        console.error('Error deleting cover image:', error);
        this.snackBar.open('Error deleting cover image', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      this.isLoading.set(true);
      const formData = this.companyForm.value;

      if (this.isEditMode()) {
        this.updateCompany(formData);
      } else {
        this.createCompany(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createCompany(data: CreateCompanyInterface): void {
    this.companiesService.create(data).subscribe({
      next: (company: CompanyResponseInterface) => {
        this.snackBar.open('Company created successfully', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/admin/companies']);
      },
      error: (error: any) => {
        console.error('Error creating company:', error);
        this.snackBar.open('Error creating company', 'Close', {
          duration: 3000,
        });
        this.isLoading.set(false);
      },
    });
  }

  private updateCompany(data: UpdateCompanyInterface): void {
    const id = this.companyId();
    if (id) {
      this.companiesService.update(id, data).subscribe({
        next: (company: CompanyResponseInterface) => {
          this.snackBar.open('Company updated successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/admin/companies']);
        },
        error: (error: any) => {
          console.error('Error updating company:', error);
          this.snackBar.open('Error updating company', 'Close', {
            duration: 3000,
          });
          this.isLoading.set(false);
        },
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.companyForm.controls).forEach((key) => {
      const control = this.companyForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/companies']);
  }

  getFieldError(fieldName: string): string {
    const field = this.companyForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength'])
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) return `${fieldName} format is invalid`;
    }
    return '';
  }
}
