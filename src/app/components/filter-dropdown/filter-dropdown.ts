import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslationKey } from '../../shared/i18n/translations';

@Component({
  selector: 'app-filter-dropdown',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './filter-dropdown.html',
  styleUrl: './filter-dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDropdown {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  labelKey = input.required<TranslationKey>();
  valueLabel = input.required<string>();
  fromPlaceholderKey = input<TranslationKey>('common.search.from');
  toPlaceholderKey = input<TranslationKey>('common.search.to');
  applyLabelKey = input<TranslationKey>('projects.filters.apply');

  min = model<number | null>(null);
  max = model<number | null>(null);

  apply = output<void>();

  open = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  toggle(): void {
    this.open.update((isOpen) => !isOpen);
  }

  close(): void {
    this.open.set(false);
  }

  onApply(): void {
    this.apply.emit();
    this.close();
  }
}
