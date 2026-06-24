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

@Component({
  selector: 'app-location-autocomplete',
  imports: [TranslatePipe],
  templateUrl: './location-autocomplete.html',
  styleUrl: './location-autocomplete.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationAutocomplete implements OnInit {
  private readonly locationsService = inject(LocationsService);
  private readonly languageState = inject(LanguageStateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  variant = input<'default' | 'muted'>('default');

  locationName = model('');
  locationSelect = output<LocationResponseInterface | null>();

  suggestions = signal<LocationResponseInterface[]>([]);
  autocompleteOpen = signal(false);
  suggestionLanguage = signal<LanguageType>(this.languageState.language());

  private allLocations = signal<LocationResponseInterface[]>([]);
  private selectedLocation = signal<LocationResponseInterface | null>(null);
  private inputFocused = signal(false);
  private locationsLoaded = false;

  ngOnInit(): void {
    this.loadLocationsIfNeeded();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeAutocomplete();
    }
  }

  onFocus(): void {
    this.inputFocused.set(true);
    this.loadLocationsIfNeeded();
    this.updateSuggestions(this.locationName());
  }

  onBlur(): void {
    this.inputFocused.set(false);
  }

  onInput(value: string): void {
    this.locationName.set(value);
    this.selectedLocation.set(null);
    this.locationSelect.emit(null);
    this.loadLocationsIfNeeded();
    this.updateSuggestions(value);
  }

  selectLocation(location: LocationResponseInterface): void {
    this.selectedLocation.set(location);
    this.locationName.set(this.getSuggestionLabel(location));
    this.locationSelect.emit(location);
    this.closeAutocomplete();
  }

  applySelection(
    location: LocationResponseInterface | null,
    displayName: string,
  ): void {
    this.selectedLocation.set(location);
    this.locationName.set(displayName);
    this.locationSelect.emit(location);
    this.closeAutocomplete();
  }

  selectByGeoName(geoName: string): void {
    this.loadLocationsIfNeeded();

    const location =
      this.allLocations().find(
        (item) => item.locationName.geo === geoName,
      ) ?? null;

    this.applySelection(location, geoName);
  }

  getSuggestionLabel(location: LocationResponseInterface): string {
    return localizeText(
      location.locationName,
      this.suggestionLanguage(),
    );
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
          this.updateSuggestions(this.locationName());
        },
        error: () => {
          this.locationsLoaded = false;
        },
      });
  }

  private updateSuggestions(queryValue: string = this.locationName()): void {
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
