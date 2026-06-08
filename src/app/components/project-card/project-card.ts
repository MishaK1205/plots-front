import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ProjectResponseInterface } from '../../api/interfaces';
import { CurrencyToggle, CurrencyType } from '../currency-toggle/currency-toggle';

@Component({
  selector: 'app-project-card',
  imports: [CurrencyToggle],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  project = input.required<ProjectResponseInterface>();
  currencyChanged = output<CurrencyType>();

  get cardImageUrl(): string {
    return this.resolveImageUrl(this.project().cardPhotoId);
  }

  onCurrencyChange(currency: CurrencyType) {
    this.currencyChanged.emit(currency);
  }

  onLocationClick(): void {
    const location = this.project().location;
    const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    window.open(googleMapsUrl, '_blank');
  }

  private resolveImageUrl(image?: string): string {
    if (!image) return '';
    return /^https?:\/\//.test(image)
      ? image
      : `http://localhost:3000/api/images/${image}`;
  }
}
