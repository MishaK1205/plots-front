import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Button } from '../button/button';
import {
  LanguageStateService,
  LanguageType,
} from '../../shared/services/language-state.service';

interface LanguageOption {
  label: string;
  value: LanguageType;
}

@Component({
  selector: 'app-language-switcher',
  imports: [Button],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  private readonly languageState = inject(LanguageStateService);

  languages: LanguageOption[] = [
    { label: 'ქარ', value: 'geo' },
    { label: 'Eng', value: 'eng' },
    { label: 'Rus', value: 'rus' },
  ];

  selectedLanguage = this.languageState.language;

  readonly selectedLanguageLabel = computed(
    () =>
      this.languages.find((option) => option.value === this.selectedLanguage())
        ?.label ?? this.languages[0].label,
  );

  languageMenuOpen = false;

  selectLanguage(language: LanguageType): void {
    this.languageState.setLanguage(language);
    this.languageMenuOpen = false;
  }
}
