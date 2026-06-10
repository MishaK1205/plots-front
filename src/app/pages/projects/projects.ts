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
  ProjectResponseInterface,
  ProjectsQueryParamsInterface,
} from '../../api/interfaces';
import {
  DetailedProjectCard,
  Pagination,
  ProjectCard,
  ProjectsMap,
} from '../../components';
import { ProjectsService } from '../../api/services';
import { applyKeywordToParams } from '../../shared/utils/keyword-params.util';

const PAGE_LIMIT = 10;

type FilterDropdown = 'area' | 'sqmPrice' | 'price';

@Component({
  selector: 'app-projects',
  imports: [
    DetailedProjectCard,
    FormsModule,
    Pagination,
    ProjectCard,
    ProjectsMap,
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

  projects = signal<ProjectResponseInterface[]>([]);
  totalItems = signal(0);
  totalPages = signal(0);
  currentPage = signal(1);
  isLoading = signal(false);

  mapView = signal(false);
  openDropdown = signal<FilterDropdown | null>(null);

  locationName = '';
  keyword = '';
  minSquareMeters: number | null = null;
  maxSquareMeters: number | null = null;
  minSquareMeterPrice: number | null = null;
  maxSquareMeterPrice: number | null = null;
  minTotalPrice: number | null = null;
  maxTotalPrice: number | null = null;

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((queryParams) => {
        this.syncFiltersFromQuery(queryParams);
        this.loadProjects(queryParams);
      });
  }

  toggleDropdown(dropdown: FilterDropdown): void {
    this.openDropdown.update((open) =>
      open === dropdown ? null : dropdown,
    );
  }

  rangeLabel(
    min: number | null,
    max: number | null,
    suffix: string,
  ): string {
    if (min == null && max == null) return 'ყველა';
    return `${min ?? 0}${suffix} - ${max != null ? max + suffix : '∞'}`;
  }

  hasActiveFilters(): boolean {
    return (
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
    this.openDropdown.set(null);

    const params: ProjectsQueryParamsInterface = {};

    const locationName = this.locationName.trim();
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
    this.keyword = '';
    this.minSquareMeters = null;
    this.maxSquareMeters = null;
    this.minSquareMeterPrice = null;
    this.maxSquareMeterPrice = null;
    this.minTotalPrice = null;
    this.maxTotalPrice = null;
    this.openDropdown.set(null);

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

  private loadProjects(queryParams: ParamMap): void {
    this.isLoading.set(true);

    this.projectsService.getAll(this.buildApiParams(queryParams)).subscribe({
      next: (response) => {
        this.projects.set(response.data);
        this.totalItems.set(response.pagination.totalItems);
        this.totalPages.set(response.pagination.totalPages);
        this.currentPage.set(response.pagination.currentPage);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.isLoading.set(false);
      },
    });
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
