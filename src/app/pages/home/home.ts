import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ProjectResponseInterface } from '../../api/interfaces';
import { ProjectCard, SponsoredProjectCard } from '../../components';
import { DUMMY_PROJECTS_RESPONSE } from '../dummy-projects';

@Component({
  selector: 'app-home',
  imports: [ProjectCard, SponsoredProjectCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  favouriteProjects = signal<ProjectResponseInterface[]>(
    DUMMY_PROJECTS_RESPONSE.data,
  );
  sponsoredProjects = signal<ProjectResponseInterface[]>(
    DUMMY_PROJECTS_RESPONSE.data,
  );

  something() {
    return 'something';
  }
}
