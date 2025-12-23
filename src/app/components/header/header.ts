import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
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
