import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-upload-form',
  templateUrl: './image-upload-form.component.html',
  styleUrls: ['./image-upload-form.component.css'],
})
export class ImageUploadFormComponent {
  @Input() employee: any;
  @Output() imagesSubmitted = new EventEmitter<{
    pancard: string;
    aadharcard: string;
  }>();

  constructor(private router: Router) {}

  pancardPreview: string | null = null;
  aadharcardPreview: string | null = null;

  onFileChange(event: any, type: string): void {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      if (type === 'pancard') {
        this.pancardPreview = e.target.result;
      } else if (type === 'aadharcard') {
        this.aadharcardPreview = e.target.result;
      }
    };

    reader.readAsDataURL(file);
  }

  submitImages(): void {
    const images = {
      pancard: this.pancardPreview || '',
      aadharcard: this.aadharcardPreview || '',
    };

    this.imagesSubmitted.emit(images);
    this.pancardPreview = null;
    this.aadharcardPreview = null;
    this.router.navigate(['']);
  }
}
