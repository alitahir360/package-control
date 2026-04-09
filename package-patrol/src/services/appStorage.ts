import { Storage } from '@ionic/storage';

const storage = new Storage({
  name: '__package_patrol',
});

export const HISTORY_KEY = 'ble_history';
export const LOCALE_KEY = 'ui_locale';

export async function initAppStorage(): Promise<void> {
  await storage.create();
}

export { storage };
