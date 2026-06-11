import { Injectable, inject } from '@angular/core';
import { LocalizedTextInterface } from '../../api/interfaces';
import { LanguageStateService } from '../services/language-state.service';
import { TranslationGroup } from './translation-group.interface';
import { TRANSLATIONS, TranslationKey } from './translations';

export type TranslationParams = Record<string, string | number>;

function isLeaf(
  value: LocalizedTextInterface | TranslationGroup,
): value is LocalizedTextInterface {
  return typeof (value as LocalizedTextInterface).geo === 'string';
}

function flatten(
  group: TranslationGroup,
  prefix: string,
  out: Map<string, LocalizedTextInterface>,
): Map<string, LocalizedTextInterface> {
  for (const [key, value] of Object.entries(group)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (isLeaf(value)) {
      out.set(path, value);
    } else {
      flatten(value, path, out);
    }
  }

  return out;
}

const FLAT_TRANSLATIONS = flatten(TRANSLATIONS, '', new Map());

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly languageState = inject(LanguageStateService);

  translate(key: TranslationKey, params?: TranslationParams): string {
    const entry = FLAT_TRANSLATIONS.get(key);

    let text = entry ? entry[this.languageState.language()] : key;

    if (params) {
      for (const [name, value] of Object.entries(params)) {
        text = text.replaceAll(`{{${name}}}`, String(value));
      }
    }

    return text;
  }
}
