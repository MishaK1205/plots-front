import { LocalizedTextInterface } from '../../api/interfaces';

export interface TranslationGroup {
  [key: string]: LocalizedTextInterface | TranslationGroup;
}

/**
 * Builds a union of dot-separated key paths ('group.nested.key') for a
 * translation object, so translation keys are checked at compile time.
 */
export type TranslationKeyOf<T> = {
  [K in keyof T & string]: T[K] extends LocalizedTextInterface
    ? K
    : `${K}.${TranslationKeyOf<T[K]>}`;
}[keyof T & string];
