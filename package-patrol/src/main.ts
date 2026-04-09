import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { initAppStorage } from './services/appStorage';
import { useHistoryStore } from './stores/history';
import { useLocaleStore } from './stores/locale';

import { IonicVue } from '@ionic/vue';

import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import '@ionic/vue/css/palettes/dark.system.css';

import './theme/variables.css';

async function bootstrap() {
  await initAppStorage();

  const app = createApp(App);
  const pinia = createPinia();

  app.use(IonicVue).use(pinia).use(router);

  const historyStore = useHistoryStore();
  const localeStore = useLocaleStore();
  await Promise.all([historyStore.hydrate(), localeStore.hydrate()]);

  await router.isReady();
  app.mount('#app');
}

void bootstrap();
