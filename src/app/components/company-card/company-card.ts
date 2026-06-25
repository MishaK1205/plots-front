import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { CompanyResponseInterface } from '../../api/interfaces';
import { Button } from '../button/button';
import { LanguageStateService } from '../../shared/services/language-state.service';
import { localizeText } from '../../shared/utils/localize-text.util';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-company-card',
  imports: [Button, TranslatePipe],
  templateUrl: './company-card.html',
  styleUrl: './company-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyCard {
  private readonly languageState = inject(LanguageStateService);

  company = input.required<CompanyResponseInterface>();

  view = output<CompanyResponseInterface>();

  readonly logoUrl = computed(() => {
    const logoId = this.company().logoId;
    if (!logoId) return '';
    return `${environment.apiUrl}/images/${logoId}`;
  });

  readonly companyName = computed(() =>
    localizeText(this.company().companyName, this.languageState.language()),
  );

  readonly address = computed(() =>
    localizeText(this.company().address, this.languageState.language()),
  );

  readonly initials = computed(() => {
    const name = this.companyName().trim();
    if (!name) return '';
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  });

  readonly websiteLabel = computed(() => {
    const website = this.company().website?.trim();
    if (!website) return '';
    return website.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  });

  onView(): void {
    this.view.emit(this.company());
  }
}
