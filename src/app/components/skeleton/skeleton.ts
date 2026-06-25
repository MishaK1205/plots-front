import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

export type SkeletonVariant =
  | 'project-card'
  | 'detailed-card'
  | 'company-card'
  | 'project-details';

@Component({
  selector: 'app-skeleton',
  imports: [TranslatePipe],
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skeleton {
  variant = input<SkeletonVariant>('project-card');
  count = input(1);

  protected readonly items = computed(() =>
    Array.from({ length: Math.max(1, this.count()) }),
  );
}
