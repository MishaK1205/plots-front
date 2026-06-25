import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '../button/button';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslationKey } from '../../shared/i18n/translations';

interface HeaderItem {
  labelKey: TranslationKey;
  path: string;
  exact?: boolean;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, Button, LanguageSwitcher, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  headerItems: HeaderItem[] = [
    {
      labelKey: 'common.nav.companies',
      path: '/companies',
      exact: true,
    },
    {
      labelKey: 'common.nav.projects',
      path: '/projects',
    },
    {
      labelKey: 'common.nav.statistics',
      path: '/statistics',
      exact: true,
    },
    {
      labelKey: 'common.nav.blog',
      path: '/blog',
      exact: true,
    },
    {
      labelKey: 'common.nav.contact',
      path: '/contact',
      exact: true,
    },
  ];
  menuOpen = false;
}
