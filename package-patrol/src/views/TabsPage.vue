<template>
  <ion-page>
    <ion-header class="ion-no-border global-header">
      <ion-toolbar v-if="!isConnectTab">
        <ion-title>{{ loc.t('app.title') }}</ion-title>
        <ion-buttons slot="end">
          <ion-badge :color="connection.isOnline ? 'success' : 'medium'" class="conn-badge">
            {{ connection.isOnline ? loc.t('connection.online') : loc.t('connection.offline') }}
          </ion-badge>
        </ion-buttons>
      </ion-toolbar>
      <div
        class="lock-banner"
        :class="{
          'lock-banner--locked': lock.status === 'LOCKED',
          'lock-banner--unlocked': lock.status === 'UNLOCKED',
          'lock-banner--unknown': lock.status === 'UNKNOWN',
        }"
        role="status"
      >
        <span class="lock-banner__text">{{ bannerText }}</span>
      </div>
    </ion-header>

    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="connect" href="/tabs/connect">
          <ion-icon aria-hidden="true" :icon="bluetooth" />
          <ion-label>{{ loc.t('tabs.connect') }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="pin" href="/tabs/pin">
          <ion-icon aria-hidden="true" :icon="keypad" />
          <ion-label>{{ loc.t('tabs.pin') }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="control" href="/tabs/control">
          <ion-icon aria-hidden="true" :icon="lockClosed" />
          <ion-label>{{ loc.t('tabs.control') }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="history" href="/tabs/history">
          <ion-icon aria-hidden="true" :icon="time" />
          <ion-label>{{ loc.t('tabs.history') }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="language" href="/tabs/language">
          <ion-icon aria-hidden="true" :icon="language" />
          <ion-label>{{ loc.t('tabs.language') }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonBadge,
  IonButtons,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { bluetooth, keypad, language, lockClosed, time } from 'ionicons/icons';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useConnectionStore } from '@/stores/connection';
import { useLockStore } from '@/stores/lock';
import { useLocaleStore } from '@/stores/locale';

const loc = useLocaleStore();
const connection = useConnectionStore();
const lock = useLockStore();
const route = useRoute();

/** Connect tab shows its own branding; hide shared title + connection badge there only. */
const isConnectTab = computed(() => {
  const p = route.path.replace(/\/$/, '');
  return p.endsWith('/connect');
});

const bannerText = computed(() => {
  if (lock.status === 'LOCKED') return loc.t('lockBanner.locked');
  if (lock.status === 'UNLOCKED') return loc.t('lockBanner.unlocked');
  return loc.t('lockBanner.unknown');
});
</script>

<style scoped>
.global-header ion-toolbar {
  --background: var(--ion-toolbar-background);
}

.conn-badge {
  margin-right: 12px;
  padding: 6px 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

.lock-banner {
  width: 100%;
  padding: 10px 16px;
  text-align: center;
  font-weight: 600;
  font-size: 0.95rem;
  background: var(--lock-banner-unknown-bg);
  color: var(--lock-banner-unknown-color);
}

.lock-banner--locked {
  background: var(--lock-banner-locked-bg);
  color: var(--lock-banner-locked-color);
}

.lock-banner--unlocked {
  background: var(--lock-banner-unlocked-bg);
  color: var(--lock-banner-unlocked-color);
}

.lock-banner--unknown {
  background: var(--lock-banner-unknown-bg);
  color: var(--lock-banner-unknown-color);
}

.lock-banner__text {
  display: block;
}
</style>
