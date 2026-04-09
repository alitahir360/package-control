import { defineStore } from 'pinia';
import { ref } from 'vue';
import { LOCALE_KEY, storage } from '@/services/appStorage';
import {
  type LocaleCode,
  isLocaleCode,
  lookupMessage,
} from '@/stores/locale/messages';

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<LocaleCode>('en');

  function t(key: string, params?: Record<string, string>): string {
    let s = lookupMessage(locale.value, key);
    if (s === undefined) {
      s = lookupMessage('en', key) ?? key;
    }
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        s = s.replaceAll(`{${k}}`, v);
      }
    }
    return s;
  }

  async function setLocale(code: LocaleCode) {
    locale.value = code;
    await storage.set(LOCALE_KEY, code);
  }

  async function hydrate() {
    const v = await storage.get(LOCALE_KEY);
    if (typeof v === 'string' && isLocaleCode(v)) {
      locale.value = v;
    }
  }

  return { locale, t, setLocale, hydrate };
});
