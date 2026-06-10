import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
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
export class Home implements OnInit {
  private projectsService = inject(ProjectsService);

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
}
