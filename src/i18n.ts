import { createI18n } from 'vue-i18n'
import en from './lang/en.json'
import vi from './lang/vi.json'
import ja from './lang/ja.json'

const i18n = createI18n({
  legacy: false,             
  globalInjection: true,      
  locale: 'vi',               
  fallbackLocale: 'en',
  messages: {
    en, vi, ja
  }
})

export default i18n
