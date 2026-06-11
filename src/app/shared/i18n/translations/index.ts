import { TranslationKeyOf } from '../translation-group.interface';
import { commonTranslations } from './common.translations';
import { homeTranslations } from './home.translations';
import { projectDetailsTranslations } from './project-details.translations';
import { projectsTranslations } from './projects.translations';

export const TRANSLATIONS = {
  common: commonTranslations,
  home: homeTranslations,
  projects: projectsTranslations,
  projectDetails: projectDetailsTranslations,
} as const;

export type TranslationKey = TranslationKeyOf<typeof TRANSLATIONS>;

