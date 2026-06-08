import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProjectsResponseInterface } from '../../api/interfaces';
import { AsyncPipe } from '@angular/common';
import { DetailedProjectCard } from '../../components';
import { DUMMY_PROJECTS_RESPONSE } from '../dummy-projects';

@Component({
  selector: 'app-projects',
  imports: [AsyncPipe, DetailedProjectCard],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  projects$: Observable<ProjectsResponseInterface> = of(DUMMY_PROJECTS_RESPONSE);
}
