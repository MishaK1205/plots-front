import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CurrencyType } from './currency-state.service';

const EXCHANGE_RATE_API_URL = 'https://open.er-api.com/v6/latest/USD';

interface ExchangeRateResponse {
  result: string;
  rates: Record<string, number>;
}

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  private readonly http = inject(HttpClient);

  private readonly usdToGelRate = signal<number | null>(null);

  readonly usdToGel = this.usdToGelRate.asReadonly();

  constructor() {
    this.loadRate();
  }

  /**
   * Converts a USD amount (the API's base currency for prices) into the
   * given display currency. Returns null while the GEL rate is not loaded yet.
   */
  convertFromUsd(
    amount: number | undefined | null,
    currency: CurrencyType,
  ): number | null {
    if (amount == null) return null;
    if (currency === 'USD') return amount;

    const rate = this.usdToGelRate();
    return rate == null ? null : amount * rate;
  }

  private loadRate(): void {
    this.http.get<ExchangeRateResponse>(EXCHANGE_RATE_API_URL).subscribe({
      next: (response) => {
        const rate = response?.rates?.['GEL'];
        if (typeof rate === 'number' && rate > 0) {
          this.usdToGelRate.set(rate);
        }
      },
      error: (error) => console.error('Error loading exchange rate:', error),
    });
  }
}
