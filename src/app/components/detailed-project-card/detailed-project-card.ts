import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import {
  LocalizedTextInterface,
  ProjectResponseInterface,
} from '../../api/interfaces';
import { Button } from '../button/button';
import { CurrencyToggle, CurrencyType } from '../currency-toggle/currency-toggle';
import { CurrencyStateService } from '../../shared/services/currency-state.service';
import { ExchangeRateService } from '../../shared/services/exchange-rate.service';
import { LanguageStateService } from '../../shared/services/language-state.service';
import { localizeText } from '../../shared/utils/localize-text.util';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-detailed-project-card',
  imports: [CommonModule, Button, CurrencyToggle, TranslatePipe],
  templateUrl: './detailed-project-card.html',
  styleUrl: './detailed-project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailedProjectCard {
  private readonly currencyState = inject(CurrencyStateService);
  private readonly exchangeRate = inject(ExchangeRateService);
  private readonly languageState = inject(LanguageStateService);

  project = input.required<ProjectResponseInterface>();
  currencyChanged = output<CurrencyType>();

  readonly cardImageUrl = computed(() =>
    this.resolveImageUrl(this.project().photoId),
  );

  readonly developerLogoUrl = computed(() =>
    this.resolveImageUrl(this.project().companyInfo?.logoId),
  );

  readonly developerName = computed(() =>
    this.localized(this.project().companyInfo?.companyName),
  );

  readonly shortDescription = computed(() =>
    this.localized(this.project().shortDescription),
  );

  readonly minutesToLocation = computed(() =>
    this.localized(this.project().minutesToLocation),
  );

  readonly currencySymbol = computed(() =>
    this.currencyState.currency() === 'USD' ? '$' : '₾',
  );

  readonly lowestTotalPrice = computed(() =>
    this.exchangeRate.convertFromUsd(
      this.project().lowestLandTotalPrice,
      this.currencyState.currency(),
    ),
  );

  readonly lowestSquareMeterPrice = computed(() =>
    this.exchangeRate.convertFromUsd(
      this.project().lowestLandSquareMeterPrice,
      this.currencyState.currency(),
    ),
  );

  readonly locationName = computed(() =>
    this.localized(this.project().locationName),
  );

  readonly developerInitials = computed(() => {
    const name = this.developerName().trim();
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
    const companyInfo = this.project().companyInfo;

    const phone = companyInfo?.phone?.replace(/[^\d+]/g, '');
    if (phone) {
      window.open(`tel:${phone}`, '_self');
      return;
    }

    const email = companyInfo?.email?.trim();
    if (email) {
      window.open(`mailto:${email}`, '_self');
    }
  }

  private localized(value?: LocalizedTextInterface): string {
    return localizeText(value, this.languageState.language());
  }

  private resolveImageUrl(image?: string): string {
    if (!image) return '';
    return `http://localhost:3000/api/images/${image}`;
  }
}
