import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ProjectCard,
  ProjectSearch,
  SponsoredProjectCard,
} from '../../components';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { ProjectsService } from '../../api/services';
import {
  ProjectResponseInterface,
  ProjectsQueryParamsInterface,
} from '../../api/interfaces';

@Component({
  selector: 'app-home',
  imports: [
    ProjectCard,
    ProjectSearch,
    RouterLink,
    SponsoredProjectCard,
    TranslatePipe,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private projectsService = inject(ProjectsService);
  private router = inject(Router);

  favouriteProjects = signal<ProjectResponseInterface[]>([]);
  sponsoredProjects = signal<ProjectResponseInterface[]>([]);
  newProjects = signal<ProjectResponseInterface[]>([]);

  ngOnInit() {
    this.projectsService.getFavourites().subscribe({
      next: (data) => {
        this.favouriteProjects.set(data);
      },
    });

    this.projectsService.getSponsored().subscribe({
      next: (data) => {
        this.sponsoredProjects.set(data);
      },
    });

    this.projectsService.getNew().subscribe({
      next: (data) => {
        this.newProjects.set(data);
      },
    });
  }

  onSearch(params: ProjectsQueryParamsInterface): void {
    this.router.navigate(['/projects'], { queryParams: params });
  }

  openProject(project: ProjectResponseInterface): void {
    this.router.navigate(['/projects', project.id]);
  }

  scrollList(list: HTMLElement, direction: 1 | -1): void {
    const scrollAmount = Math.round(list.clientWidth * 0.8);
    list.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }
}
