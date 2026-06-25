import { TranslationKeyOf } from '../translation-group.interface';
import { commonTranslations } from './common.translations';
import { companiesTranslations } from './companies.translations';
import { homeTranslations } from './home.translations';
import { projectDetailsTranslations } from './project-details.translations';
import { projectsTranslations } from './projects.translations';

export const TRANSLATIONS = {
  common: commonTranslations,
  companies: companiesTranslations,
  home: homeTranslations,
  projects: projectsTranslations,
  projectDetails: projectDetailsTranslations,
} as const;

export type TranslationKey = TranslationKeyOf<typeof TRANSLATIONS>;
