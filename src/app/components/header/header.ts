import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, LanguageSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  headerItems = [
    {
      label: 'პროექტები',
      path: '/projects',
    },
    {
      label: 'სტატისტიკა',
      path: '/statistics',
    },
    {
      label: 'ბლოგი',
      path: '/blog',
    },
    {
      label: 'კონტაქტი',
      path: '/contact',
    },
  ];
  menuOpen = false;
}
