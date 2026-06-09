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
import { AmenitiesService } from '../../../api/services/amenities.service';
import {
  AmenityResponseInterface,
  CreateAmenityInterface,
  UpdateAmenityInterface,
} from '../../../api/interfaces';

@Component({
  selector: 'app-add-edit-amenity',
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
  ],
  templateUrl: './add-edit-amenity.html',
  styleUrl: './add-edit-amenity.scss',
})
export class AddEditAmenity implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private amenitiesService = inject(AmenitiesService);
  private snackBar = inject(MatSnackBar);

  amenityForm!: FormGroup;
  isEditMode = signal(false);
  isLoading = signal(false);
  amenityId = signal<string | null>(null);

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.amenityForm = this.fb.group({
      amenityNameGeo: ['', [Validators.required, Validators.minLength(2)]],
      amenityNameEng: ['', [Validators.required, Validators.minLength(2)]],
      amenityNameRus: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.amenityId.set(id);
      this.loadAmenity(id);
    }
  }

  private loadAmenity(id: string): void {
    this.isLoading.set(true);
    this.amenitiesService.getById(id).subscribe({
      next: (amenity: AmenityResponseInterface) => {
        this.amenityForm.patchValue({
          amenityNameGeo: amenity.amenityName.geo,
          amenityNameEng: amenity.amenityName.eng,
          amenityNameRus: amenity.amenityName.rus,
        });
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading amenity:', error);
        this.snackBar.open('Error loading amenity details', 'Close', {
          duration: 3000,
        });
        this.isLoading.set(false);
        this.router.navigate(['/admin/amenities']);
      },
    });
  }

  onSubmit(): void {
    if (this.amenityForm.valid) {
      this.isLoading.set(true);
      const formData = this.amenityForm.value;

      if (this.isEditMode()) {
        this.updateAmenity(formData);
      } else {
        this.createAmenity(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createAmenity(data: CreateAmenityInterface): void {
    this.amenitiesService.create(data).subscribe({
      next: () => {
        this.snackBar.open('Amenity created successfully', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/admin/amenities']);
      },
      error: (error: any) => {
        console.error('Error creating amenity:', error);
        this.snackBar.open('Error creating amenity', 'Close', {
          duration: 3000,
        });
        this.isLoading.set(false);
      },
    });
  }

  private updateAmenity(data: UpdateAmenityInterface): void {
    const id = this.amenityId();
    if (id) {
      this.amenitiesService.update(id, data).subscribe({
        next: () => {
          this.snackBar.open('Amenity updated successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/admin/amenities']);
        },
        error: (error: any) => {
          console.error('Error updating amenity:', error);
          this.snackBar.open('Error updating amenity', 'Close', {
            duration: 3000,
          });
          this.isLoading.set(false);
        },
      });
    }
  }

  private markFormGroupTouched(): void {
    this.amenityForm.markAllAsTouched();
  }

  onCancel(): void {
    this.router.navigate(['/admin/amenities']);
  }

  getFieldError(fieldName: string, label?: string): string {
    const field = this.amenityForm.get(fieldName);
    const name = label ?? fieldName;
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${name} is required`;
      if (field.errors['minlength'])
        return `${name} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
