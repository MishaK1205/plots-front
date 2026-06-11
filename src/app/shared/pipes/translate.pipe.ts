import { Pipe, PipeTransform, inject } from '@angular/core';
import {
  TranslationParams,
  TranslationService,
} from '../i18n/translation.service';
import { TranslationKey } from '../i18n/translations';

@Pipe({
  name: 'translate',
  // Impure so the pipe re-evaluates when the selected language signal changes.
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly translationService = inject(TranslationService);

  transform(key: TranslationKey, params?: TranslationParams): string {
    return this.translationService.translate(key, params);
  }
}
