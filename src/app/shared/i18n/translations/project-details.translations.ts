import { TranslationGroup } from '../translation-group.interface';

export const projectDetailsTranslations = {
  cover: {
    visitQuestion: {
      geo: 'როდის შეგვიძლია მონახულება?',
      eng: 'When can we visit?',
      rus: 'Когда можно посмотреть?',
    },
  },
  lands: {
    title: {
      geo: 'მიწის ნაკვეთები',
      eng: 'Land plots',
      rus: 'Земельные участки',
    },
    viewAll: {
      geo: 'ყველა მიწის ნახვა',
      eng: 'View all plots',
      rus: 'Смотреть все участки',
    },
    empty: {
      geo: 'ნაკვეთები ვერ მოიძებნა',
      eng: 'No plots found',
      rus: 'Участки не найдены',
    },
  },
  about: {
    title: {
      geo: 'პროექტის შესახებ',
      eng: 'About the project',
      rus: 'О проекте',
    },
  },
  gallery: {
    title: { geo: 'ფოტო გალერეა', eng: 'Photo gallery', rus: 'Фотогалерея' },
  },
  contact: {
    title: { geo: 'კონტაქტი', eng: 'Contact', rus: 'Контакты' },
  },
  faq: {
    title: {
      geo: 'კითხვები და პასუხები',
      eng: 'Questions and answers',
      rus: 'Вопросы и ответы',
    },
  },
} satisfies TranslationGroup;
