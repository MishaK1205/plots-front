import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  languages = ['ქარ', 'Eng', 'Rus'];
  selectedLanguage = this.languages[0];
  languageMenuOpen = false;

  selectLanguage(language: string): void {
    this.selectedLanguage = language;
    this.languageMenuOpen = false;
  }
}
