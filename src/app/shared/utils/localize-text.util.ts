import { LocalizedTextInterface } from '../../api/interfaces';
import { LanguageType } from '../services/language-state.service';

export function localizeText(
  value: LocalizedTextInterface | undefined | null,
  language: LanguageType,
): string {
  if (!value) return '';

  return (
    value[language]?.trim() ||
    value.geo?.trim() ||
    value.eng?.trim() ||
    value.rus?.trim() ||
    ''
  );
}
