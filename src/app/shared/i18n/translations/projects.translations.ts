import { TranslationGroup } from '../translation-group.interface';

export const projectsTranslations = {
  filters: {
    area: { geo: 'ფართობი', eng: 'Area', rus: 'Площадь' },
    squareMeterPrice: {
      geo: 'კვმ ფასი',
      eng: 'Price per m²',
      rus: 'Цена за м²',
    },
    price: { geo: 'ფასი', eng: 'Price', rus: 'Цена' },
    company: { geo: 'კომპანია', eng: 'Company', rus: 'Компания' },
    allCompanies: {
      geo: 'ყველა კომპანია',
      eng: 'All companies',
      rus: 'Все компании',
    },
    searchCompany: {
      geo: 'მოძებნე კომპანია',
      eng: 'Search company',
      rus: 'Поиск компании',
    },
    apply: { geo: 'არჩევა', eng: 'Apply', rus: 'Применить' },
    any: { geo: 'ყველა', eng: 'All', rus: 'Все' },
    clear: {
      geo: 'ფილტრის გასუფთავება',
      eng: 'Clear filters',
      rus: 'Сбросить фильтры',
    },
  },
  results: {
    found: {
      geo: 'ნაპოვნია {{count}} პროექტი',
      eng: '{{count}} projects found',
      rus: 'Найдено проектов: {{count}}',
    },
    viewOnMap: {
      geo: 'რუკაზე ნახვა',
      eng: 'View on map',
      rus: 'Показать на карте',
    },
    empty: {
      geo: 'პროექტები ვერ მოიძებნა',
      eng: 'No projects found',
      rus: 'Проекты не найдены',
    },
  },
} satisfies TranslationGroup;
