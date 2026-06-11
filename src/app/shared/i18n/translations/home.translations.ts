import { TranslationGroup } from '../translation-group.interface';

export const homeTranslations = {
  hero: {
    title: {
      geo: 'მოძებნე მიწის ნაკვეთი აგარაკისთვის!',
      eng: 'Find a land plot for your summer house!',
      rus: 'Найдите земельный участок для дачи!',
    },
    subtitle: {
      geo: 'მიწის ნაკვეთები, სააგარაკე მიწები, ურბან პროექტები ერთ სივრცეში',
      eng: 'Land plots, countryside lands and urban projects in one space',
      rus: 'Земельные участки, дачные земли и городские проекты в одном пространстве',
    },
  },
  search: {
    totalPrice: { geo: 'სრული ფასი', eng: 'Total price', rus: 'Полная цена' },
    squareMeterPrice: {
      geo: '1მ² ფასი',
      eng: 'Price per 1m²',
      rus: 'Цена за 1м²',
    },
    area: { geo: 'ფართობი (მ²)', eng: 'Area (m²)', rus: 'Площадь (м²)' },
    totalActiveListings: {
      geo: 'სულ აქტიურია {{count}} განცხადება',
      eng: '{{count}} active listings in total',
      rus: 'Всего активных объявлений: {{count}}',
    },
  },
  quickFilters: {
    lisiLake: { geo: 'ლისის ტბა', eng: 'Lisi Lake', rus: 'Озеро Лиси' },
    saguramo: { geo: 'საგურამო', eng: 'Saguramo', rus: 'Сагурамо' },
    plot: { geo: 'ნაკვეთი', eng: 'Plot', rus: 'Участок' },
    tabakhmela: { geo: 'ტაბახმელა', eng: 'Tabakhmela', rus: 'Табахмела' },
    napetvrebi: { geo: 'ნაფეტვრები', eng: 'Napetvrebi', rus: 'Напетвреби' },
  },
  sections: {
    featuredProjects: {
      geo: 'რჩეული პროექტები',
      eng: 'Featured projects',
      rus: 'Избранные проекты',
    },
    newProjects: {
      geo: 'ახალი პროექტები',
      eng: 'New projects',
      rus: 'Новые проекты',
    },
    viewAll: { geo: 'ყველას ნახვა', eng: 'View all', rus: 'Смотреть все' },
  },
  sponsored: {
    title: {
      geo: 'გადმოდი საცხოვრებლად ჰილსაიდში',
      eng: 'Move in to Hillside',
      rus: 'Переезжайте жить в Хилсайд',
    },
    viewProject: {
      geo: 'პროექტის ნახვა',
      eng: 'View project',
      rus: 'Смотреть проект',
    },
  },
} satisfies TranslationGroup;
