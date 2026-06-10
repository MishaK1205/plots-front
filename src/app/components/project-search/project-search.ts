import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../api/services';
import { ProjectsQueryParamsInterface } from '../../api/interfaces';
import { applyKeywordToParams } from '../../shared/utils/keyword-params.util';

@Component({
  selector: 'app-project-search',
  imports: [FormsModule],
  templateUrl: './project-search.html',
  styleUrl: './project-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSearch implements OnInit {
  private readonly projectsService = inject(ProjectsService);

  search = output<ProjectsQueryParamsInterface>();

  quickFilters = ['ლისის ტბა', 'საგურამო', 'ნაკვეთი', 'ტაბახმელა', 'ნაფეტვრები'];

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

  ngOnInit(): void {
    this.projectsService.getAll({ page: 1, limit: 1 }).subscribe({
      next: (response) =>
        this.totalActiveProjects.set(response.pagination.totalItems),
    });
  }

  toggleFilters(): void {
    this.filtersOpen.update((open) => !open);
  }

  onQuickFilterClick(filter: string): void {
    this.locationName = filter;
    this.onSearch();
  }

  onSearch(): void {
    const params: ProjectsQueryParamsInterface = {};

    const locationName = this.locationName.trim();
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
}
