import { Component, inject } from '@angular/core';
import { ProjectsService } from '../../api/services';
import { ProjectResponseInterface } from '../../api/interfaces';
import { ProjectCard } from '../../components';

@Component({
  selector: 'app-home',
  imports: [ProjectCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private projectsService = inject(ProjectsService);

  favouriteProjects: ProjectResponseInterface[] = [];

  ngOnInit() {
    this.projectsService.getAll().subscribe((projects) => {
      this.favouriteProjects = projects.data.slice(1, 2);
      console.log(this.favouriteProjects);
    });
  }
}
