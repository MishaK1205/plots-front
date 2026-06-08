import { Injectable, signal } from '@angular/core';

export type CurrencyType = 'GEL' | 'USD';

const DEFAULT_CURRENCY: CurrencyType = 'GEL';
const STORAGE_KEY = 'plots.selectedCurrency';

@Injectable({
  providedIn: 'root',
})
export class CurrencyStateService {
  private readonly selectedCurrency = signal<CurrencyType>(
    this.readStoredCurrency(),
  );

  readonly currency = this.selectedCurrency.asReadonly();

  setCurrency(currency: CurrencyType): void {
    if (currency === this.selectedCurrency()) {
      return;
    }

    this.selectedCurrency.set(currency);
    this.saveCurrency(currency);
  }

  private readStoredCurrency(): CurrencyType {
    try {
      const storedCurrency = localStorage.getItem(STORAGE_KEY);

      return this.isCurrencyType(storedCurrency)
        ? storedCurrency
        : DEFAULT_CURRENCY;
    } catch {
      return DEFAULT_CURRENCY;
    }
  }

  private saveCurrency(currency: CurrencyType): void {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {
      // Keep the in-memory signal as the source of truth if storage is unavailable.
    }
  }

  private isCurrencyType(value: string | null): value is CurrencyType {
    return value === 'GEL' || value === 'USD';
  }
}
