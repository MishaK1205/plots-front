import { Injectable, signal } from '@angular/core';

export type LanguageType = 'geo' | 'eng' | 'rus';

const DEFAULT_LANGUAGE: LanguageType = 'geo';
const STORAGE_KEY = 'plots.selectedLanguage';

@Injectable({
  providedIn: 'root',
})
export class LanguageStateService {
  private readonly selectedLanguage = signal<LanguageType>(
    this.readStoredLanguage(),
  );

  readonly language = this.selectedLanguage.asReadonly();

  setLanguage(language: LanguageType): void {
    if (language === this.selectedLanguage()) {
      return;
    }

    this.selectedLanguage.set(language);
    this.saveLanguage(language);
  }

  private readStoredLanguage(): LanguageType {
    try {
      const storedLanguage = localStorage.getItem(STORAGE_KEY);

      return this.isLanguageType(storedLanguage)
        ? storedLanguage
        : DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  }

  private saveLanguage(language: LanguageType): void {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Keep the in-memory signal as the source of truth if storage is unavailable.
    }
  }

  private isLanguageType(value: string | null): value is LanguageType {
    return value === 'geo' || value === 'eng' || value === 'rus';
  }
}
