import { LanguageType } from '../services/language-state.service';

export function detectQueryLanguage(query: string): LanguageType | null {
  let geoCount = 0;
  let rusCount = 0;
  let engCount = 0;

  for (const char of query) {
    if (/\p{Script=Georgian}/u.test(char)) {
      geoCount++;
    } else if (/\p{Script=Cyrillic}/u.test(char)) {
      rusCount++;
    } else if (/[a-zA-Z]/.test(char)) {
      engCount++;
    }
  }

  if (geoCount === 0 && rusCount === 0 && engCount === 0) {
    return null;
  }

  if (geoCount >= rusCount && geoCount >= engCount) {
    return 'geo';
  }

  if (rusCount >= geoCount && rusCount >= engCount) {
    return 'rus';
  }

  return 'eng';
}
