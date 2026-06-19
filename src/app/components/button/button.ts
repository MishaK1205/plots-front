import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  input,
} from '@angular/core';

export type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'ghost'
  | 'text'
  | 'icon'
  | 'chip';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export type ButtonShape = 'rounded' | 'pill' | 'circle';

export type ButtonActiveTone = 'primary' | 'muted';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  shape = input<ButtonShape>('rounded');
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
  active = input(false);
  activeTone = input<ButtonActiveTone>('primary');
  fullWidth = input(false);
  ariaLabel = input<string | undefined>(undefined);
  ariaExpanded = input<boolean | undefined>(undefined);
  ariaCurrent = input<string | null | undefined>(undefined);
  extraClass = input<string>('');

  @HostBinding('class.app-button-host--full-width')
  get hostFullWidth(): boolean {
    return this.fullWidth();
  }

  readonly classes = computed(() =>
    [
      'app-button',
      `app-button--${this.variant()}`,
      `app-button--${this.size()}`,
      `app-button--${this.shape()}`,
      this.active() ? 'app-button--active' : '',
      this.active() ? `app-button--active-${this.activeTone()}` : '',
      this.fullWidth() ? 'app-button--full-width' : '',
      this.extraClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
