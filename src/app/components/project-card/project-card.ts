import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ProjectResponseInterface } from '../../api/interfaces';
import { CurrencyToggle, CurrencyType } from '../currency-toggle/currency-toggle';
import { CurrencyStateService } from '../../shared/services/currency-state.service';
import { ExchangeRateService } from '../../shared/services/exchange-rate.service';
import { LocalizedPipe } from '../../shared/pipes/localized.pipe';

@Component({
  selector: 'app-project-card',
  imports: [CurrencyToggle, DecimalPipe, LocalizedPipe],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  private readonly currencyState = inject(CurrencyStateService);
  private readonly exchangeRate = inject(ExchangeRateService);

  project = input.required<ProjectResponseInterface>();
  currencyChanged = output<CurrencyType>();

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

  get cardImageUrl(): string {
    return this.resolveImageUrl(this.project().photoId);
  }

  onCurrencyChange(currency: CurrencyType) {
    this.currencyChanged.emit(currency);
  }

  onLocationClick(event: Event): void {
    event.stopPropagation();
    const location = this.project().location;
    const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    window.open(googleMapsUrl, '_blank');
  }

  private resolveImageUrl(image?: string): string {
    return `http://localhost:3000/api/images/${image}`;
  }
}
