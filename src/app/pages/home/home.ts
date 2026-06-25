import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import {
  Loader,
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
    Loader,
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

  private readonly favouritesLoaded = signal(false);
  private readonly sponsoredLoaded = signal(false);
  private readonly newLoaded = signal(false);

  readonly isLoading = computed(
    () =>
      !this.favouritesLoaded() ||
      !this.sponsoredLoaded() ||
      !this.newLoaded(),
  );

  ngOnInit() {
    this.projectsService
      .getFavourites()
      .pipe(finalize(() => this.favouritesLoaded.set(true)))
      .subscribe({
        next: (data) => {
          this.favouriteProjects.set(data);
        },
      });

    this.projectsService
      .getSponsored()
      .pipe(finalize(() => this.sponsoredLoaded.set(true)))
      .subscribe({
        next: (data) => {
          this.sponsoredProjects.set(data);
        },
      });

    this.projectsService
      .getNew()
      .pipe(finalize(() => this.newLoaded.set(true)))
      .subscribe({
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
