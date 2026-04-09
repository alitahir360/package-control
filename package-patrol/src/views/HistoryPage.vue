<template>
  <ion-page>
    <ion-content>
      <div class="ion-padding">
        <h2>{{ loc.t('history.title') }}</h2>
        <p class="muted">{{ loc.t('history.subtitle') }}</p>
        <ion-button expand="block" fill="outline" color="danger" @click="onClear">
          {{ loc.t('history.clear') }}
        </ion-button>
      </div>

      <ion-list v-if="history.entries.length" lines="full">
        <ion-item v-for="e in history.entries" :key="e.id">
          <ion-icon
            slot="start"
            :icon="iconFor(e.icon)"
            :color="colorFor(e.icon)"
            aria-hidden="true"
          />
          <ion-label>
            <h3>{{ loc.t(e.messageKey, e.messageParams) }}</h3>
            <p>{{ formatAt(e.at) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <div v-else class="ion-padding empty">
        <p>{{ loc.t('history.empty') }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
} from '@ionic/vue';
import { lockClosed, lockOpen, send } from 'ionicons/icons';
import { useHistoryStore } from '@/stores/history';
import { useLocaleStore } from '@/stores/locale';
import type { HistoryIconKind } from '@/types/history';

const loc = useLocaleStore();
const history = useHistoryStore();

function iconFor(kind: HistoryIconKind) {
  if (kind === 'lock') return lockClosed;
  if (kind === 'unlock') return lockOpen;
  return send;
}

function colorFor(kind: HistoryIconKind) {
  if (kind === 'lock') return 'danger';
  if (kind === 'unlock') return 'success';
  return 'medium';
}

function formatAt(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(loc.locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  } catch {
    return iso;
  }
}

async function onClear() {
  await history.clear();
}
</script>

<style scoped>
.muted {
  opacity: 0.85;
  margin-top: 0;
}
.empty {
  text-align: center;
  opacity: 0.75;
  padding-top: 2rem;
}
</style>
