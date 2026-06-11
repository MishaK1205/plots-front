import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

const ELLIPSIS = '...' as const;

export type PaginationItem = number | typeof ELLIPSIS;

@Component({
  selector: 'app-pagination',
  imports: [TranslatePipe],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  currentPage = input.required<number>();
  totalPages = input.required<number>();

  pageChange = output<number>();

  readonly items = computed<PaginationItem[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const candidates = new Set<number>([
      1,
      2,
      3,
      current - 1,
      current,
      current + 1,
      total - 1,
      total,
    ]);

    const pages = [...candidates]
      .filter((page) => page >= 1 && page <= total)
      .sort((a, b) => a - b);

    const items: PaginationItem[] = [];
    let previous = 0;

    for (const page of pages) {
      if (page - previous > 1) {
        items.push(ELLIPSIS);
      }
      items.push(page);
      previous = page;
    }

    return items;
  });

  isEllipsis(item: PaginationItem): item is typeof ELLIPSIS {
    return item === ELLIPSIS;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.pageChange.emit(page);
  }
}
