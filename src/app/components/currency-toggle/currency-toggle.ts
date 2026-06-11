import { Component, output, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CurrencyStateService,
  CurrencyType,
} from '../../shared/services/currency-state.service';

export type { CurrencyType } from '../../shared/services/currency-state.service';

@Component({
  selector: 'app-currency-toggle',
  imports: [CommonModule],
  templateUrl: './currency-toggle.html',
  styleUrl: './currency-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyToggle {
  private readonly currencyState = inject(CurrencyStateService);

  activeCurrency = this.currencyState.currency;
  currencyChanged = output<CurrencyType>();

  onCurrencyClick(currency: CurrencyType, event: Event): void {
    event.stopPropagation();
    if (currency !== this.activeCurrency()) {
      this.currencyState.setCurrency(currency);
      this.currencyChanged.emit(currency);
    }
  }
}

