import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  LocationResponseInterface,
  ProjectResponseInterface,
  ProjectsQueryParamsInterface,
} from '../../api/interfaces';
import {
  Button,
  DetailedProjectCard,
  FilterDropdown,
  LocationAutocomplete,
  Pagination,
  ProjectCard,
  ProjectsMap,
} from '../../components';
import { ProjectsService } from '../../api/services';
import { applyKeywordToParams } from '../../shared/utils/keyword-params.util';
import { localizeText } from '../../shared/utils/localize-text.util';
import { LanguageStateService } from '../../shared/services/language-state.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslationService } from '../../shared/i18n/translation.service';

const PAGE_LIMIT = 10;

type ProjectCollection = 'favourites' | 'new';

@Component({
  selector: 'app-projects',
  imports: [
    Button,
    DetailedProjectCard,
    FilterDropdown,
    FormsModule,
    LocationAutocomplete,
    Pagination,
    ProjectCard,
    ProjectsMap,
    TranslatePipe,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly translation = inject(TranslationService);
  private readonly languageState = inject(LanguageStateService);

  projects = signal<ProjectResponseInterface[]>([]);
  totalItems = signal(0);
  totalPages = signal(0);
  currentPage = signal(1);
  isLoading = signal(false);
  collection = signal<ProjectCollection | null>(null);

  mapView = signal(true);

  locationName = '';
  keyword = '';
  minSquareMeters: number | null = null;
  maxSquareMeters: number | null = null;
  minSquareMeterPrice: number | null = null;
  maxSquareMeterPrice: number | null = null;
  minTotalPrice: number | null = null;
  maxTotalPrice: number | null = null;

  private selectedLocation = signal<LocationResponseInterface | null>(null);

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((queryParams) => {
        this.syncFiltersFromQuery(queryParams);
        this.loadProjects(queryParams);
      });
  }

  onLocationSelect(location: LocationResponseInterface | null): void {
    this.selectedLocation.set(location);
  }

  rangeLabel(
    min: number | null,
    max: number | null,
    suffix: string,
  ): string {
    if (min == null && max == null) {
      return this.translation.translate('projects.filters.any');
    }
    return `${min ?? 0}${suffix} - ${max != null ? max + suffix : '∞'}`;
  }

  hasActiveFilters(): boolean {
    return (
      this.collection() != null ||
      !!this.locationName.trim() ||
      !!this.keyword.trim() ||
      this.minSquareMeters != null ||
      this.maxSquareMeters != null ||
      this.minSquareMeterPrice != null ||
      this.maxSquareMeterPrice != null ||
      this.minTotalPrice != null ||
      this.maxTotalPrice != null
    );
  }

  applyFilters(): void {
    const params: ProjectsQueryParamsInterface = {};

    const locationName = this.resolveLocationSearchValue();
    if (locationName) params.locationName = locationName;

    applyKeywordToParams(this.keyword, params);

    if (this.minSquareMeters != null)
      params.minSquareMeters = this.minSquareMeters;
    if (this.maxSquareMeters != null)
      params.maxSquareMeters = this.maxSquareMeters;
    if (this.minSquareMeterPrice != null)
      params.minSquareMeterPrice = this.minSquareMeterPrice;
    if (this.maxSquareMeterPrice != null)
      params.maxSquareMeterPrice = this.maxSquareMeterPrice;
    if (this.minTotalPrice != null) params.minTotalPrice = this.minTotalPrice;
    if (this.maxTotalPrice != null) params.maxTotalPrice = this.maxTotalPrice;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
    });
  }

  clearFilters(): void {
    this.locationName = '';
    this.selectedLocation.set(null);
    this.keyword = '';
    this.minSquareMeters = null;
    this.maxSquareMeters = null;
    this.minSquareMeterPrice = null;
    this.maxSquareMeterPrice = null;
    this.minTotalPrice = null;
    this.maxTotalPrice = null;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  openProject(project: ProjectResponseInterface): void {
    this.router.navigate(['/projects', project.id]);
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

  private loadProjects(queryParams: ParamMap): void {
    const collection = this.parseCollection(queryParams.get('collection'));
    this.collection.set(collection);
    this.isLoading.set(true);

    if (collection === 'favourites') {
      this.projectsService.getFavourites().subscribe({
        next: (data) => this.setCollectionResults(data),
        error: (error) => this.handleLoadError(error),
      });
      return;
    }

    if (collection === 'new') {
      this.projectsService.getNew().subscribe({
        next: (data) => this.setCollectionResults(data),
        error: (error) => this.handleLoadError(error),
      });
      return;
    }

    this.projectsService.getAll(this.buildApiParams(queryParams)).subscribe({
      next: (response) => {
        this.projects.set(response.data);
        this.totalItems.set(response.pagination.totalItems);
        this.totalPages.set(response.pagination.totalPages);
        this.currentPage.set(response.pagination.currentPage);
        this.isLoading.set(false);
      },
      error: (error) => this.handleLoadError(error),
    });
  }

  private setCollectionResults(data: ProjectResponseInterface[]): void {
    this.projects.set(data);
    this.totalItems.set(data.length);
    this.totalPages.set(1);
    this.currentPage.set(1);
    this.isLoading.set(false);
  }

  private handleLoadError(error: unknown): void {
    console.error('Error loading projects:', error);
    this.isLoading.set(false);
  }

  private parseCollection(value: string | null): ProjectCollection | null {
    if (value === 'favourites' || value === 'new') return value;
    return null;
  }

  private buildApiParams(queryParams: ParamMap): ProjectsQueryParamsInterface {
    const params: ProjectsQueryParamsInterface = {
      page: this.toNumber(queryParams.get('page')) ?? 1,
      limit: PAGE_LIMIT,
    };

    const stringKeys = [
      'locationName',
      'cadastralCode',
      'projectName',
      'projectId',
      'companyId',
    ] as const;
    const numberKeys = [
      'minSquareMeters',
      'maxSquareMeters',
      'minSquareMeterPrice',
      'maxSquareMeterPrice',
      'minTotalPrice',
      'maxTotalPrice',
    ] as const;

    for (const key of stringKeys) {
      const value = queryParams.get(key)?.trim();
      if (value) params[key] = value;
    }

    for (const key of numberKeys) {
      const value = this.toNumber(queryParams.get(key));
      if (value != null) params[key] = value;
    }

    return params;
  }

  private syncFiltersFromQuery(queryParams: ParamMap): void {
    this.locationName = queryParams.get('locationName') ?? '';
    this.selectedLocation.set(null);
    this.keyword =
      queryParams.get('projectName') ??
      queryParams.get('cadastralCode') ??
      queryParams.get('projectId') ??
      '';

    this.minSquareMeters = this.toNumber(queryParams.get('minSquareMeters'));
    this.maxSquareMeters = this.toNumber(queryParams.get('maxSquareMeters'));
    this.minSquareMeterPrice = this.toNumber(
      queryParams.get('minSquareMeterPrice'),
    );
    this.maxSquareMeterPrice = this.toNumber(
      queryParams.get('maxSquareMeterPrice'),
    );
    this.minTotalPrice = this.toNumber(queryParams.get('minTotalPrice'));
    this.maxTotalPrice = this.toNumber(queryParams.get('maxTotalPrice'));
  }

  private toNumber(value: string | null): number | null {
    if (value == null || value.trim() === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
