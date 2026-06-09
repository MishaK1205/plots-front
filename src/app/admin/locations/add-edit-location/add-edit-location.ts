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
import { LocationsService } from '../../../api/services/locations.service';
import {
  CreateLocationInterface,
  LocationResponseInterface,
  UpdateLocationInterface,
} from '../../../api/interfaces';

@Component({
  selector: 'app-add-edit-location',
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
  templateUrl: './add-edit-location.html',
  styleUrl: './add-edit-location.scss',
})
export class AddEditLocation implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private locationsService = inject(LocationsService);
  private snackBar = inject(MatSnackBar);

  locationForm!: FormGroup;
  isEditMode = signal(false);
  isLoading = signal(false);
  locationId = signal<string | null>(null);

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.locationForm = this.fb.group({
      locationNameGeo: ['', [Validators.required, Validators.minLength(2)]],
      locationNameEng: ['', [Validators.required, Validators.minLength(2)]],
      locationNameRus: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.locationId.set(id);
      this.loadLocation(id);
    }
  }

  private loadLocation(id: string): void {
    this.isLoading.set(true);
    this.locationsService.getById(id).subscribe({
      next: (location: LocationResponseInterface) => {
        this.locationForm.patchValue({
          locationNameGeo: location.locationName.geo,
          locationNameEng: location.locationName.eng,
          locationNameRus: location.locationName.rus,
        });
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading location:', error);
        this.snackBar.open('Error loading location details', 'Close', {
          duration: 3000,
        });
        this.isLoading.set(false);
        this.router.navigate(['/admin/locations']);
      },
    });
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      this.isLoading.set(true);
      const formData = this.locationForm.value;

      if (this.isEditMode()) {
        this.updateLocation(formData);
      } else {
        this.createLocation(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createLocation(data: CreateLocationInterface): void {
    this.locationsService.create(data).subscribe({
      next: () => {
        this.snackBar.open('Location created successfully', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/admin/locations']);
      },
      error: (error: any) => {
        console.error('Error creating location:', error);
        this.snackBar.open('Error creating location', 'Close', {
          duration: 3000,
        });
        this.isLoading.set(false);
      },
    });
  }

  private updateLocation(data: UpdateLocationInterface): void {
    const id = this.locationId();
    if (id) {
      this.locationsService.update(id, data).subscribe({
        next: () => {
          this.snackBar.open('Location updated successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/admin/locations']);
        },
        error: (error: any) => {
          console.error('Error updating location:', error);
          this.snackBar.open('Error updating location', 'Close', {
            duration: 3000,
          });
          this.isLoading.set(false);
        },
      });
    }
  }

  private markFormGroupTouched(): void {
    this.locationForm.markAllAsTouched();
  }

  onCancel(): void {
    this.router.navigate(['/admin/locations']);
  }

  getFieldError(fieldName: string, label?: string): string {
    const field = this.locationForm.get(fieldName);
    const name = label ?? fieldName;
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${name} is required`;
      if (field.errors['minlength'])
        return `${name} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
