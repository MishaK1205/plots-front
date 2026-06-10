import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LandResponseInterface } from '../../api/interfaces';
import { CurrencyToggle } from '../currency-toggle/currency-toggle';
import { CurrencyStateService } from '../../shared/services/currency-state.service';
import { ExchangeRateService } from '../../shared/services/exchange-rate.service';
import { LanguageStateService } from '../../shared/services/language-state.service';
import { localizeText } from '../../shared/utils/localize-text.util';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-land-card',
  imports: [CurrencyToggle, DecimalPipe],
  templateUrl: './land-card.html',
  styleUrl: './land-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandCard {
  private readonly currencyState = inject(CurrencyStateService);
  private readonly exchangeRate = inject(ExchangeRateService);
  private readonly languageState = inject(LanguageStateService);

  land = input.required<LandResponseInterface>();

  readonly imageUrl = computed(() => {
    const image = this.land().imageUrl;
    if (!image) return '';
    return image.startsWith('http')
      ? image
      : `${environment.serverUrl}${image}`;
  });

  readonly tag = computed(() =>
    localizeText(this.land().tag, this.languageState.language()),
  );

  readonly currencySymbol = computed(() =>
    this.currencyState.currency() === 'USD' ? '$' : '₾',
  );

  readonly totalPrice = computed(() =>
    this.exchangeRate.convertFromUsd(
      this.land().totalPrice,
      this.currencyState.currency(),
    ),
  );

  readonly squareMeterPrice = computed(() =>
    this.exchangeRate.convertFromUsd(
      this.land().squareMeterPrice,
      this.currencyState.currency(),
    ),
  );
}
