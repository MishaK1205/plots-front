import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslationKey } from '../../shared/i18n/translations';

interface FooterItem {
  nameKey: TranslationKey;
  link: string;
}

@Component({
  selector: 'app-footer',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  currentYear = new Date().getFullYear();

  platforms: FooterItem[] = [
    {
      nameKey: 'common.nav.projects',
      link: '/projects',
    },
    {
      nameKey: 'common.nav.statistics',
      link: '/statistics',
    },
    {
      nameKey: 'common.nav.blog',
      link: '/blog',
    },
    {
      nameKey: 'common.nav.contact',
      link: '/contact',
    },
  ];

  company: FooterItem[] = [
    {
      nameKey: 'common.footer.aboutProject',
      link: '/about-project',
    },
    {
      nameKey: 'common.footer.termsAndConditions',
      link: '/terms-and-conditions',
    },
    {
      nameKey: 'common.footer.partnership',
      link: '/partnership',
    },
    {
      nameKey: 'common.nav.contact',
      link: '/contact',
    },
  ];

  socialLinks = [
    {
      image: 'assets/icons/facebook-icon.svg',
      link: 'https://www.facebook.com',
      alt: 'Facebook',
    },
    {
      image: 'assets/icons/linkedin-icon.svg',
      link: 'https://www.linkedin.com',
      alt: 'LinkedIn',
    },
    {
      image: 'assets/icons/instagram-icon.svg',
      link: 'https://www.instagram.com',
      alt: 'Instagram',
    },
    {
      image: 'assets/icons/x-icon.svg',
      link: 'https://www.x.com',
      alt: 'X',
    },
  ];
}
