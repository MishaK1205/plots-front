import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ProjectResponseInterface } from '../../api/interfaces';
import { Button } from '../button/button';
import { LocalizedPipe } from '../../shared/pipes/localized.pipe';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { resolveImageUrl } from '../../shared/utils/resolve-image-url.util';

@Component({
  selector: 'app-sponsored-project-card',
  imports: [Button, LocalizedPipe, TranslatePipe],
  templateUrl: './sponsored-project-card.html',
  styleUrl: './sponsored-project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsoredProjectCard {
  project = input.required<ProjectResponseInterface>();
  view = output<void>();

  get cardImageBackground(): string {
    return `url(${resolveImageUrl(this.project().photoId)})`;
  }

  viewProject() {
    this.view.emit();
  }
}

