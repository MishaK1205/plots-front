import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnInit,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocationResponseInterface } from '../../api/interfaces';
import { LocationsService } from '../../api/services';
import { detectQueryLanguage } from '../../shared/utils/detect-query-language.util';
import { localizeText } from '../../shared/utils/localize-text.util';
import {
  LanguageStateService,
  LanguageType,
} from '../../shared/services/language-state.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

export type SearchInputIcon = 'none' | 'search' | 'location';

export type SearchInputVariant = 'default' | 'muted';

@Component({
  selector: 'app-search-input',
  imports: [TranslatePipe],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInput implements OnInit {
  private readonly locationsService = inject(LocationsService);
  private readonly languageState = inject(LanguageStateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  autocomplete = input(false);
  icon = input<SearchInputIcon>('none');
  variant = input<SearchInputVariant>('default');
  name = input('search');
  placeholder = input('');
  clearable = input(true);
  ariaLabel = input<string | undefined>(undefined);

  value = model('');
  locationSelect = output<LocationResponseInterface | null>();

  suggestions = signal<LocationResponseInterface[]>([]);
  autocompleteOpen = signal(false);
  suggestionLanguage = signal<LanguageType>(this.languageState.language());

  private allLocations = signal<LocationResponseInterface[]>([]);
  private selectedLocation = signal<LocationResponseInterface | null>(null);
  private inputFocused = signal(false);
  private locationsLoaded = false;

  ngOnInit(): void {
    if (this.autocomplete()) {
      this.loadLocationsIfNeeded();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeAutocomplete();
    }
  }

  onFocus(): void {
    this.inputFocused.set(true);
    if (!this.autocomplete()) {
      return;
    }
    this.loadLocationsIfNeeded();
    this.updateSuggestions(this.value());
  }

  onBlur(): void {
    this.inputFocused.set(false);
  }

  onInput(value: string): void {
    this.value.set(value);

    if (!this.autocomplete()) {
      return;
    }

    this.selectedLocation.set(null);
    this.locationSelect.emit(null);
    this.loadLocationsIfNeeded();
    this.updateSuggestions(value);
  }

  clear(): void {
    this.value.set('');
    this.selectedLocation.set(null);

    if (this.autocomplete()) {
      this.locationSelect.emit(null);
      this.closeAutocomplete();
    }
  }

  selectLocation(location: LocationResponseInterface): void {
    this.selectedLocation.set(location);
    this.value.set(this.getSuggestionLabel(location));
    this.locationSelect.emit(location);
    this.closeAutocomplete();
  }

  getSuggestionLabel(location: LocationResponseInterface): string {
    return localizeText(location.locationName, this.suggestionLanguage());
  }

  private closeAutocomplete(): void {
    this.autocompleteOpen.set(false);
    this.suggestions.set([]);
  }

  private loadLocationsIfNeeded(): void {
    if (this.locationsLoaded) {
      return;
    }

    this.locationsLoaded = true;

    this.locationsService
      .getAll({ page: 1, limit: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.allLocations.set(response.data);
          this.updateSuggestions(this.value());
        },
        error: () => {
          this.locationsLoaded = false;
        },
      });
  }

  private updateSuggestions(queryValue: string = this.value()): void {
    const query = this.normalizeSearchText(queryValue);

    if (!query) {
      this.closeAutocomplete();
      return;
    }

    const detectedLanguage = detectQueryLanguage(queryValue);
    if (detectedLanguage) {
      this.suggestionLanguage.set(detectedLanguage);
    }

    const matches = this.allLocations()
      .filter((location) =>
        this.locationMatchesQuery(location, query, detectedLanguage),
      )
      .slice(0, 8);

    this.suggestions.set(matches);
    this.autocompleteOpen.set(this.inputFocused() && matches.length > 0);
  }

  private locationMatchesQuery(
    location: LocationResponseInterface,
    query: string,
    detectedLanguage: LanguageType | null,
  ): boolean {
    const fallbackLanguage = detectedLanguage ?? this.languageState.language();
    const names = new Set(
      [
        location.locationName.geo,
        location.locationName.eng,
        location.locationName.rus,
        localizeText(location.locationName, fallbackLanguage),
      ]
        .map((name) => this.normalizeSearchText(name))
        .filter(Boolean),
    );

    return [...names].some((name) => name.includes(query));
  }

  private normalizeSearchText(value: string): string {
    return value.trim().toLocaleLowerCase();
  }
}
