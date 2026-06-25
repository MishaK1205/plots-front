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
import { CompanyResponseInterface } from '../../api/interfaces';
import { CompaniesService } from '../../api/services';
import { CompanyCard, Loader, Pagination } from '../../components';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

const PAGE_LIMIT = 12;

@Component({
  selector: 'app-companies',
  imports: [CompanyCard, Loader, Pagination, TranslatePipe],
  templateUrl: './companies.html',
  styleUrl: './companies.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Companies implements OnInit {
  private readonly companiesService = inject(CompaniesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  companies = signal<CompanyResponseInterface[]>([]);
  totalItems = signal(0);
  totalPages = signal(0);
  currentPage = signal(1);
  isLoading = signal(false);

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((queryParams) => this.loadCompanies(queryParams));
  }

  openCompany(company: CompanyResponseInterface): void {
    this.router.navigate(['/projects'], {
      queryParams: { companyId: company.id },
    });
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  private loadCompanies(queryParams: ParamMap): void {
    this.isLoading.set(true);

    this.companiesService
      .getAll({ page: this.toPage(queryParams.get('page')), limit: PAGE_LIMIT })
      .subscribe({
        next: (response) => {
          this.companies.set(response.data);
          this.totalItems.set(response.pagination.totalItems);
          this.totalPages.set(response.pagination.totalPages);
          this.currentPage.set(response.pagination.currentPage);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading companies:', error);
          this.isLoading.set(false);
        },
      });
  }

  private toPage(value: string | null): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }
}
