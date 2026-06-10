import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectResponseInterface } from '../../api/interfaces';
import { DetailedProjectCard } from '../../components';
import { ProjectsService } from '../../api/services';

@Component({
  selector: 'app-projects',
  imports: [DetailedProjectCard],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  private readonly destroyRef$ = inject(DestroyRef);

  favouriteProjects = signal<ProjectResponseInterface[]>([]);
  sponsoredProjects = signal<ProjectResponseInterface[]>([]);

  ngOnInit(): void {
    this.projectsService
      .getFavourites()
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (projects) => this.favouriteProjects.set(projects),
        error: (error) =>
          console.error('Error loading favourite projects:', error),
      });

    this.projectsService
      .getSponsored()
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (projects) => this.sponsoredProjects.set(projects),
        error: (error) =>
          console.error('Error loading sponsored projects:', error),
      });
  }
}
