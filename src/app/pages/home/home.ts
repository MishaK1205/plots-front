import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ProjectCard, SponsoredProjectCard } from '../../components';
import { ProjectsService } from '../../api/services';
import { ProjectResponseInterface } from '../../api/interfaces';

@Component({
  selector: 'app-home',
  imports: [ProjectCard, SponsoredProjectCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private projectsService = inject(ProjectsService);

  favouriteProjects = signal<ProjectResponseInterface[]>([]);
  sponsoredProjects = signal<ProjectResponseInterface[]>([]);

  constructor() {
    this.projectsService.getFavourites().subscribe({
      next: (data) => {
        console.log(data);
        this.favouriteProjects.set(data);
      },
    });

    this.projectsService.getSponsored().subscribe({
      next: (data) => {
        console.log(data);
        this.sponsoredProjects.set(data);
      }
    })
  }
}
