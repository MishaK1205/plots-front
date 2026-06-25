import { TranslationGroup } from '../translation-group.interface';

/** Texts shared across pages: header, footer, pagination, project/land cards. */
export const commonTranslations = {
  nav: {
    projects: { geo: 'პროექტები', eng: 'Projects', rus: 'Проекты' },
    companies: { geo: 'კომპანიები', eng: 'Companies', rus: 'Компании' },
    statistics: { geo: 'სტატისტიკა', eng: 'Statistics', rus: 'Статистика' },
    blog: { geo: 'ბლოგი', eng: 'Blog', rus: 'Блог' },
    contact: { geo: 'კონტაქტი', eng: 'Contact', rus: 'Контакты' },
  },
  footer: {
    description: {
      geo: 'მიწის ნაკვეთები, სააგარაკე მიწები, ურბან პროექტები ერთ სივრცეში',
      eng: 'Land plots, countryside lands and urban projects in one space',
      rus: 'Земельные участки, дачные земли и городские проекты в одном пространстве',
    },
    platforms: { geo: 'პლატფორმები', eng: 'Platforms', rus: 'Платформы' },
    company: { geo: 'კომპანია', eng: 'Company', rus: 'Компания' },
    contactInfo: {
      geo: 'საკონტაქტო ინფორმაცია',
      eng: 'Contact information',
      rus: 'Контактная информация',
    },
    aboutProject: {
      geo: 'პროექტის შესახებ',
      eng: 'About the project',
      rus: 'О проекте',
    },
    termsAndConditions: {
      geo: 'წესები და პირობები',
      eng: 'Terms and conditions',
      rus: 'Правила и условия',
    },
    partnership: { geo: 'პარტნიორობა', eng: 'Partnership', rus: 'Партнёрство' },
  },
  pagination: {
    previous: { geo: 'უკან', eng: 'Back', rus: 'Назад' },
    next: { geo: 'შემდეგი', eng: 'Next', rus: 'Далее' },
  },
  card: {
    developer: { geo: 'დეველოპერი', eng: 'Developer', rus: 'Девелопер' },
    contact: { geo: 'დაკავშირება', eng: 'Contact', rus: 'Связаться' },
    // Georgian marks "starting from" with the '-დან' suffix after the price,
    // while English/Russian put 'from'/'от' before it. The empty halves keep
    // the markup identical for all languages.
    priceFromPrefix: { geo: '', eng: 'from ', rus: 'от ' },
    priceFromSuffix: { geo: '-დან', eng: '', rus: '' },
    minimumLandSize: {
      geo: 'მინიმალური მიწის ზომა',
      eng: 'Minimum land size',
      rus: 'Минимальный размер участка',
    },
    shortDescription: {
      geo: 'მოკლე აღწერა',
      eng: 'Short description',
      rus: 'Краткое описание',
    },
    landSize: { geo: 'მიწის ზომა', eng: 'Land size', rus: 'Размер участка' },
    cadastralCode: {
      geo: 'საკადასტრო კოდი',
      eng: 'Cadastral code',
      rus: 'Кадастровый код',
    },
  },
  units: {
    // The letter for the meter unit, rendered as მ²/m²/м² in templates.
    meter: { geo: 'მ', eng: 'm', rus: 'м' },
  },
  search: {
    locationPlaceholder: {
      geo: 'მაგ. თბილისის, ლისის ტბის მიმდებარედ',
      eng: 'e.g. Tbilisi, near Lisi Lake',
      rus: 'напр. Тбилиси, рядом с озером Лиси',
    },
    keywordPlaceholder: {
      geo: 'ID, პროექტის დასახელება, ს/კ, ტელეფონი',
      eng: 'ID, project name, cadastral code, phone',
      rus: 'ID, название проекта, кадастровый код, телефон',
    },
    search: { geo: 'ძებნა', eng: 'Search', rus: 'Поиск' },
    clear: { geo: 'გასუფთავება', eng: 'Clear', rus: 'Очистить' },
    from: { geo: 'დან', eng: 'From', rus: 'От' },
    to: { geo: 'მდე', eng: 'To', rus: 'До' },
  },
} satisfies TranslationGroup;
