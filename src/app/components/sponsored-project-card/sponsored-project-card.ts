import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProjectResponseInterface } from '../../api/interfaces';
import { LocalizedPipe } from '../../shared/pipes/localized.pipe';

@Component({
  selector: 'app-sponsored-project-card',
  imports: [LocalizedPipe],
  templateUrl: './sponsored-project-card.html',
  styleUrl: './sponsored-project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsoredProjectCard {
  project = input.required<ProjectResponseInterface>();

  get cardImageBackground(): string {
    return `url(${this.resolveImageUrl(this.project().photoId)})`;
  }

  viewProject() {
    console.log(`Viewing project: ${this.project.name}`);
  }

  private resolveImageUrl(image?: string): string {
    if (!image) return '';
    return `http://localhost:3000/api/images/${image}`;
  }
}

