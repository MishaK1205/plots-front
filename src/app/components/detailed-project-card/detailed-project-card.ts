import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LocalizedTextInterface, ProjectResponseInterface } from '../../api/interfaces';
import { CurrencyToggle, CurrencyType } from '../currency-toggle/currency-toggle';

@Component({
  selector: 'app-detailed-project-card',
  imports: [CommonModule, CurrencyToggle],
  templateUrl: './detailed-project-card.html',
  styleUrl: './detailed-project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailedProjectCard {
  project = input.required<ProjectResponseInterface>();
  currencyChanged = output<CurrencyType>();

  readonly cardImageUrl = computed(() =>
    this.resolveImageUrl(this.project().cardPhotoId ?? this.project().photoId),
  );

  readonly developerLogoUrl = computed(() =>
    this.resolveImageUrl(this.project().developerPhotoId),
  );

  readonly shortDescription = computed(() =>
    this.localized(this.project().shortDescription),
  );

  readonly minutesToLocation = computed(() =>
    this.localized(this.project().minutesToLocation),
  );

  readonly locationName = computed(() => {
    const location = this.project().location;
    return (
      location?.streetName?.trim() ||
      location?.city?.trim() ||
      location?.district?.trim() ||
      ''
    );
  });

  readonly developerInitials = computed(() => {
    const name = this.project().developerCompanyName?.trim();
    if (!name) return '';
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  });

  onCurrencyChange(currency: CurrencyType): void {
    this.currencyChanged.emit(currency);
  }

  onLocationClick(event: Event): void {
    event.stopPropagation();
    const location = this.project().location;
    if (location?.latitude == null || location?.longitude == null) return;
    const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    window.open(googleMapsUrl, '_blank', 'noopener');
  }

  onContactClick(event: Event): void {
    event.stopPropagation();
    const contact = this.project().developerContactInfo?.trim();
    if (!contact) return;

    if (contact.includes('@')) {
      window.open(`mailto:${contact}`, '_self');
      return;
    }

    const phone = contact.replace(/[^\d+]/g, '');
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  }

  private localized(value?: LocalizedTextInterface): string {
    if (!value) return '';
    return value.geo?.trim() || value.eng?.trim() || value.rus?.trim() || '';
  }

  private resolveImageUrl(image?: string): string {
    if (!image) return '';
    return `http://localhost:3000/api/images/${image}`;
  }
}
