import { TranslationGroup } from '../translation-group.interface';

export const companiesTranslations = {
  title: { geo: 'კომპანიები', eng: 'Companies', rus: 'Компании' },
  subtitle: {
    geo: 'აირჩიე დეველოპერი და ნახე მისი პროექტები',
    eng: 'Pick a developer and explore their projects',
    rus: 'Выберите девелопера и посмотрите его проекты',
  },
  viewProjects: {
    geo: 'პროექტების ნახვა',
    eng: 'View projects',
    rus: 'Смотреть проекты',
  },
  count: {
    geo: 'ნაპოვნია {{count}} კომპანია',
    eng: '{{count}} companies',
    rus: 'Найдено компаний: {{count}}',
  },
  empty: {
    geo: 'კომპანიები ვერ მოიძებნა',
    eng: 'No companies found',
    rus: 'Компании не найдены',
  },
} satisfies TranslationGroup;
