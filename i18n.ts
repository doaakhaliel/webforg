import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const savedLanguage = typeof localStorage !== 'undefined' 
  ? localStorage.getItem('language') || 'en' 
  : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

i18n.on('languageChanged', (lng) => {
  const direction = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;
  document.documentElement.lang = lng;
  localStorage.setItem('language', lng);
  
  if (lng === 'ar') {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
});

const initialDirection = savedLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.dir = initialDirection;
document.documentElement.lang = savedLanguage;

if (savedLanguage === 'ar') {
  document.body.classList.add('rtl');
}

export default i18n;