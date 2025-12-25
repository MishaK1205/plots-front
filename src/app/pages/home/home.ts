import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ProjectsService } from '../../api/services';
import { ProjectResponseInterface } from '../../api/interfaces';
import { ProjectCard } from '../../components';

@Component({
  selector: 'app-home',
  imports: [ProjectCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private projectsService = inject(ProjectsService);

  favouriteProjects = signal<ProjectResponseInterface[]>([]);

  ngOnInit() {
    this.projectsService.getAll().subscribe((projects) => {
      this.favouriteProjects.set(projects.data);
    });
  }
}
