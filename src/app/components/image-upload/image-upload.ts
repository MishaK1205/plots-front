import { Component, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-upload',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss',
})
export class ImageUpload implements OnInit {
  label = input<string>('Upload Image');
  maxSizeMB = input<number>(5);
  acceptedFormats = input<string[]>([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]);
  existingImageUrl = input<string | undefined>();
  required = input<boolean>(false);

  imageSelected = output<File>();
  imageRemoved = output<void>();

  selectedImage = signal<string | null>(null);
  isUploading = signal(false);
  errorMessage = signal<string | null>(null);
  fileInputId = `file-input-${Math.random().toString(36).substr(2, 9)}`;
  selectedFile = signal<File | null>(null);

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.existingImageUrl()) {
      this.selectedImage.set(this.existingImageUrl()!);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type
    if (!this.acceptedFormats().includes(file.type)) {
      this.errorMessage.set(
        `Invalid file format. Accepted formats: ${this.acceptedFormats().join(', ')}`,
      );
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > this.maxSizeMB()) {
      this.errorMessage.set(`File size exceeds ${this.maxSizeMB()}MB`);
      return;
    }

    this.errorMessage.set(null);
    this.isUploading.set(true);
    this.selectedFile.set(file);

    // Read file as base64 for preview
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const base64String = e.target?.result as string;
      this.selectedImage.set(base64String);
      this.isUploading.set(false);
      // Emit the File object for uploading
      this.imageSelected.emit(file);
    };

    reader.onerror = () => {
      this.errorMessage.set('Error reading file');
      this.isUploading.set(false);
      this.selectedFile.set(null);
    };

    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedImage.set(null);
    this.selectedFile.set(null);
    this.errorMessage.set(null);
    this.imageRemoved.emit();
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById(
      this.fileInputId,
    ) as HTMLInputElement;
    fileInput?.click();
  }

  getSafeImageUrl(imageUrl: string): SafeUrl | string {
    if (!imageUrl) return '';

    if (imageUrl.startsWith('data:')) {
      return imageUrl;
    }

    return this.sanitizer.sanitize(1, imageUrl) || imageUrl;
  }
}
