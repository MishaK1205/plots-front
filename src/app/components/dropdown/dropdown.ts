import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface DropdownOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-dropdown',
  imports: [FormsModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dropdown {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  options = input<DropdownOption[]>([]);
  label = input('');
  placeholder = input('');
  searchPlaceholder = input('');
  emptyLabel = input('');
  clearLabel = input('');
  searchable = input(false);
  clearable = input(false);
  disabled = input(false);
  ariaLabel = input<string | undefined>(undefined);

  value = model<string | null>(null);

  selectionChange = output<string | null>();

  open = signal(false);
  query = signal('');

  readonly selectedLabel = computed(() => {
    const current = this.value();
    if (current == null) return '';
    return (
      this.options().find((option) => option.value === current)?.label ?? ''
    );
  });

  readonly filteredOptions = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    if (!query) return this.options();
    return this.options().filter((option) =>
      option.label.toLocaleLowerCase().includes(query),
    );
  });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  toggle(): void {
    if (this.disabled()) return;
    this.open.update((isOpen) => !isOpen);
    if (!this.open()) {
      this.query.set('');
    }
  }

  close(): void {
    this.open.set(false);
    this.query.set('');
  }

  select(option: DropdownOption): void {
    this.value.set(option.value);
    this.selectionChange.emit(option.value);
    this.close();
  }

  clear(event: Event): void {
    event.stopPropagation();
    this.value.set(null);
    this.selectionChange.emit(null);
    this.close();
  }
}
