import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ProjectResponseInterface } from '../../api/interfaces';
import { LocalizedPipe } from '../../shared/pipes/localized.pipe';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-sponsored-project-card',
  imports: [LocalizedPipe, TranslatePipe],
  templateUrl: './sponsored-project-card.html',
  styleUrl: './sponsored-project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsoredProjectCard {
  project = input.required<ProjectResponseInterface>();
  view = output<void>();

  get cardImageBackground(): string {
    return `url(${this.resolveImageUrl(this.project().photoId)})`;
  }

  viewProject() {
    this.view.emit();
  }

  private resolveImageUrl(image?: string): string {
    if (!image) return '';
    return `http://localhost:3000/api/images/${image}`;
  }
}

