import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnInit,
  inject,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { LocationResponseInterface, ProjectsQueryParamsInterface } from '../../api/interfaces';
import { LocationsService, ProjectsService } from '../../api/services';
import { applyKeywordToParams } from '../../shared/utils/keyword-params.util';
import { detectQueryLanguage } from '../../shared/utils/detect-query-language.util';
import { localizeText } from '../../shared/utils/localize-text.util';
import { LanguageStateService, LanguageType } from '../../shared/services/language-state.service';
import { Button } from '../button/button';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslationKey } from '../../shared/i18n/translations';

interface QuickFilter {
  labelKey: TranslationKey;
  // Search value stays in Georgian so backend lookups keep working.
  value: string;
}

@Component({
  selector: 'app-project-search',
  imports: [FormsModule, Button, TranslatePipe],
  templateUrl: './project-search.html',
  styleUrl: './project-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSearch implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  private readonly locationsService = inject(LocationsService);
  private readonly languageState = inject(LanguageStateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  search = output<ProjectsQueryParamsInterface>();

  quickFilters: QuickFilter[] = [
    { labelKey: 'home.quickFilters.lisiLake', value: 'ლისის ტბა' },
    { labelKey: 'home.quickFilters.saguramo', value: 'საგურამო' },
    { labelKey: 'home.quickFilters.plot', value: 'ნაკვეთი' },
    { labelKey: 'home.quickFilters.tabakhmela', value: 'ტაბახმელა' },
    { labelKey: 'home.quickFilters.napetvrebi', value: 'ნაფეტვრები' },
  ];

  filtersOpen = signal(false);
  totalActiveProjects = signal<number | null>(null);
  locationSuggestions = signal<LocationResponseInterface[]>([]);
  locationAutocompleteOpen = signal(false);
  locationSuggestionLanguage = signal<LanguageType>(
    this.languageState.language(),
  );

  locationName = '';
  keyword = '';
  minTotalPrice: number | null = null;
  maxTotalPrice: number | null = null;
  minSquareMeterPrice: number | null = null;
  maxSquareMeterPrice: number | null = null;
  minSquareMeters: number | null = null;
  maxSquareMeters: number | null = null;

  private allLocations = signal<LocationResponseInterface[]>([]);
  private selectedLocation = signal<LocationResponseInterface | null>(null);
  private locationsLoaded = false;

  ngOnInit(): void {
    this.projectsService.getAll({ page: 1, limit: 1 }).subscribe({
      next: (response) =>
        this.totalActiveProjects.set(response.pagination.totalItems),
    });

    this.loadLocationsIfNeeded();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeLocationAutocomplete();
    }
  }

  onLocationFocus(): void {
    this.loadLocationsIfNeeded();
    this.updateLocationSuggestions(this.locationName);
  }

  onLocationInput(value: string = this.locationName): void {
    this.selectedLocation.set(null);
    this.loadLocationsIfNeeded();
    this.updateLocationSuggestions(value);
  }

  selectLocation(location: LocationResponseInterface): void {
    this.selectedLocation.set(location);
    this.locationName = this.getLocationSuggestionLabel(location);
    this.closeLocationAutocomplete();
  }

  getLocationSuggestionLabel(location: LocationResponseInterface): string {
    return localizeText(
      location.locationName,
      this.locationSuggestionLanguage(),
    );
  }

  closeLocationAutocomplete(): void {
    this.locationAutocompleteOpen.set(false);
    this.locationSuggestions.set([]);
  }

  toggleFilters(): void {
    this.filtersOpen.update((open) => !open);
  }

  onQuickFilterClick(filter: QuickFilter): void {
    this.loadLocationsIfNeeded();
    this.selectedLocation.set(
      this.allLocations().find(
        (location) => location.locationName.geo === filter.value,
      ) ?? null,
    );
    this.locationName = filter.value;
    this.closeLocationAutocomplete();
    this.onSearch();
  }

  onSearch(): void {
    const params: ProjectsQueryParamsInterface = {};

    const locationName = this.resolveLocationSearchValue();
    if (locationName) {
      params.locationName = locationName;
    }

    applyKeywordToParams(this.keyword, params);

    if (this.minTotalPrice != null) params.minTotalPrice = this.minTotalPrice;
    if (this.maxTotalPrice != null) params.maxTotalPrice = this.maxTotalPrice;
    if (this.minSquareMeterPrice != null)
      params.minSquareMeterPrice = this.minSquareMeterPrice;
    if (this.maxSquareMeterPrice != null)
      params.maxSquareMeterPrice = this.maxSquareMeterPrice;
    if (this.minSquareMeters != null)
      params.minSquareMeters = this.minSquareMeters;
    if (this.maxSquareMeters != null)
      params.maxSquareMeters = this.maxSquareMeters;

    this.search.emit(params);
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
          this.updateLocationSuggestions(this.locationName);
        },
        error: () => {
          this.locationsLoaded = false;
        },
      });
  }

  private updateLocationSuggestions(queryValue: string = this.locationName): void {
    const query = this.normalizeSearchText(queryValue);

    if (!query) {
      this.closeLocationAutocomplete();
      return;
    }

    const detectedLanguage = detectQueryLanguage(queryValue);
    if (detectedLanguage) {
      this.locationSuggestionLanguage.set(detectedLanguage);
    }

    const matches = this.allLocations()
      .filter((location) =>
        this.locationMatchesQuery(location, query, detectedLanguage),
      )
      .slice(0, 8);

    this.locationSuggestions.set(matches);
    this.locationAutocompleteOpen.set(matches.length > 0);
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

  private resolveLocationSearchValue(): string {
    const selected = this.selectedLocation();

    if (selected) {
      return selected.locationName.geo.trim();
    }

    return this.locationName.trim();
  }
}
