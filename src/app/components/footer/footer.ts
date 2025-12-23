import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = new Date().getFullYear();

  platforms = [
    {
      name: 'პროექტები',
      link: '/projects',
    },
    {
      name: 'სტატისტიკა',
      link: '/statistics',
    },
    {
      name: 'ბლოგი',
      link: '/blog',
    },
    {
      name: 'კონტაქტი',
      link: '/contact',
    },
  ];

  company = [
    {
      name: 'პროექტის შესახებ',
      link: '/about-project',
    },
    {
      name: 'წესები და პირობები',
      link: '/terms-and-conditions',
    },
    {
      name: 'პარტნიორობა',
      link: '/partnership',
    },
    {
      name: 'კონტაქტი',
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

