import { Component, model, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CurrencyType = 'GEL' | 'USD';

@Component({
  selector: 'app-currency-toggle',
  imports: [CommonModule],
  templateUrl: './currency-toggle.html',
  styleUrl: './currency-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyToggle {
  activeCurrency = model<CurrencyType>('GEL');
  currencyChanged = output<CurrencyType>();

  onCurrencyClick(currency: CurrencyType): void {
    if (currency !== this.activeCurrency()) {
      this.activeCurrency.set(currency);
      this.currencyChanged.emit(currency);
    }
  }
}

