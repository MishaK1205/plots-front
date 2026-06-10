import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocalizedTextInterface } from '../../api/interfaces';
import { LanguageStateService } from '../services/language-state.service';
import { localizeText } from '../utils/localize-text.util';

@Pipe({
  name: 'localized',
  // Impure so the pipe re-evaluates when the selected language signal changes.
  pure: false,
})
export class LocalizedPipe implements PipeTransform {
  private readonly languageState = inject(LanguageStateService);

  transform(value: LocalizedTextInterface | undefined | null): string {
    return localizeText(value, this.languageState.language());
  }
}
