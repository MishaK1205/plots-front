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
import {
  CompanyResponseInterface,
  CreateCompanyInterface,
  UpdateCompanyInterface,
} from '../../../api/interfaces';
import { ImageUpload } from '../../../components/image-upload/image-upload';
import { ImagesService, CompaniesService } from '../../../api/services';
import { resolveImageUrl } from '../../../shared/utils/resolve-image-url.util';

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
    ImageUpload,
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
  logoImageId = signal<string | null>(null);

  get logoPreviewUrl(): string | undefined {
    return resolveImageUrl(this.companyForm.get('logoId')?.value) || undefined;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.companyForm = this.fb.group({
      companyName: this.fb.group({
        geo: ['', [Validators.required, Validators.minLength(2)]],
        eng: ['', [Validators.required, Validators.minLength(2)]],
        rus: ['', [Validators.required, Validators.minLength(2)]],
      }),
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      website: [''],
      logoId: [''],
      address: this.fb.group({
        geo: ['', [Validators.required]],
        eng: ['', [Validators.required]],
        rus: ['', [Validators.required]],
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
        // The API returns already-localized strings for companyName/address,
        // so we seed the primary (geo) language fields and the flat fields.
        this.companyForm.patchValue({
      companyName: { geo: company.companyName.geo, eng: company.companyName.eng, rus: company.companyName.rus },
          address: { geo: company.address.geo, eng: company.address.eng, rus: company.address.rus },
          email: company.email,
          phone: company.phone,
          website: company.website ?? '',
          logoId: company.logoId ?? '',
          socialAccounts: company.socialAccounts ?? {},
        });
        this.logoImageId.set(company.logoId ?? null);
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
    this.companyForm.markAllAsTouched();
  }

  onCancel(): void {
    this.router.navigate(['/admin/companies']);
  }

  getFieldError(fieldName: string, label?: string): string {
    const field = this.companyForm.get(fieldName);
    const name = label ?? fieldName;
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${name} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength'])
        return `${name} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) return `${name} format is invalid`;
    }
    return '';
  }
}
