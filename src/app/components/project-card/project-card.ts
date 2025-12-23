import { Component, input, OnInit } from '@angular/core';
import { ProjectResponseInterface } from '../../api/interfaces';

@Component({
  selector: 'app-project-card',
  imports: [],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard implements OnInit {
  project = input.required<ProjectResponseInterface>();

  ngOnInit(): void {
    console.log(this.project());
  }
}
