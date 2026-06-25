import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { LocationResponseInterface, ProjectsQueryParamsInterface } from '../../api/interfaces';
import { LocationsService, ProjectsService } from '../../api/services';
import { applyKeywordToParams } from '../../shared/utils/keyword-params.util';
import { localizeText } from '../../shared/utils/localize-text.util';
import { LanguageStateService } from '../../shared/services/language-state.service';
import { Button } from '../button/button';
import { SearchInput } from '../search-input/search-input';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-project-search',
  imports: [FormsModule, Button, SearchInput, TranslatePipe],
  templateUrl: './project-search.html',
  styleUrl: './project-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSearch implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  private readonly locationsService = inject(LocationsService);
  private readonly languageState = inject(LanguageStateService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('locationInput')
  private locationInput?: SearchInput;

  search = output<ProjectsQueryParamsInterface>();

  private readonly quickFilterLocations = signal<LocationResponseInterface[]>([]);

  readonly quickFilterItems = computed(() =>
    this.quickFilterLocations().map((location) => ({
      location,
      label: localizeText(location.locationName, this.languageState.language()),
    })),
  );

  filtersOpen = signal(false);
  totalActiveProjects = signal<number | null>(null);

  locationName = '';
  keyword = '';
  minTotalPrice: number | null = null;
  maxTotalPrice: number | null = null;
  minSquareMeterPrice: number | null = null;
  maxSquareMeterPrice: number | null = null;
  minSquareMeters: number | null = null;
  maxSquareMeters: number | null = null;

  private selectedLocation = signal<LocationResponseInterface | null>(null);

  ngOnInit(): void {
    this.projectsService.getAll({ page: 1, limit: 1 }).subscribe({
      next: (response) =>
        this.totalActiveProjects.set(response.pagination.totalItems),
    });

    this.locationsService
      .getAll({ page: 1, limit: 5 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.quickFilterLocations.set(response.data),
      });
  }

  onLocationSelect(location: LocationResponseInterface | null): void {
    this.selectedLocation.set(location);
  }

  toggleFilters(): void {
    this.filtersOpen.update((open) => !open);
  }

  onQuickFilterLocationClick(location: LocationResponseInterface): void {
    this.locationInput?.selectLocation(location);
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

  private resolveLocationSearchValue(): string {
    const selected = this.selectedLocation();

    if (selected) {
      return localizeText(
        selected.locationName,
        this.languageState.language(),
      );
    }

    return this.locationName.trim();
  }
}
