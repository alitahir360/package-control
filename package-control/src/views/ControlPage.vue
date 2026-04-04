<template>
  <ion-page>
    <ion-content class="ion-padding">
      <h2>{{ locale.t('control.title') }}</h2>
      <p class="muted">{{ locale.t('control.subtitle') }}</p>

      <div class="ring-wrap">
        <div
          class="status-ring"
          :class="{
            locked: lock.status === 'LOCKED',
            unlocked: lock.status === 'UNLOCKED',
            unknown: lock.status === 'UNKNOWN',
          }"
        >
          <ion-icon :icon="padlockIcon" class="ring-icon" />
        </div>
      </div>

      <ion-button
        expand="block"
        size="large"
        color="success"
        class="ion-margin-top"
        @click="doOpen"
        :disabled="!connection.isOnline || busy"
      >
        {{ locale.t('control.open') }}
      </ion-button>
      <ion-button
        expand="block"
        size="large"
        color="danger"
        @click="doLock"
        :disabled="!connection.isOnline || busy"
      >
        {{ locale.t('control.lock') }}
      </ion-button>
      <ion-text v-if="!connection.isOnline" color="medium">
        <p>{{ locale.t('control.notConnected') }}</p>
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonIcon, IonPage, IonText } from '@ionic/vue';
import { lockClosed } from 'ionicons/icons';
import { ref } from 'vue';
import { useBluetooth } from '@/composables/useBluetooth';
import { useConnectionStore } from '@/stores/connection';
import { useLockStore } from '@/stores/lock';
import { useLocaleStore } from '@/stores/locale';

const locale = useLocaleStore();
const connection = useConnectionStore();
const lock = useLockStore();
const { sendCommand } = useBluetooth();

const busy = ref(false);
const padlockIcon = lockClosed;

async function doOpen() {
  busy.value = true;
  try {
    await sendCommand('OPEN');
  } finally {
    busy.value = false;
  }
}

async function doLock() {
  busy.value = true;
  try {
    await sendCommand('LOCK');
  } finally {
    busy.value = false;
  }
}
</script>

<style scoped>
.muted {
  opacity: 0.85;
  margin-top: 0;
}
.ring-wrap {
  display: flex;
  justify-content: center;
  margin: 2rem 0 1rem;
}
.status-ring {
  width: 11rem;
  height: 11rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid var(--lock-ring-border, #999);
  background: var(--lock-ring-bg, rgba(0, 0, 0, 0.04));
  transition:
    border-color 0.25s ease,
    background 0.25s ease;
}
.status-ring.locked {
  --lock-ring-border: var(--ion-color-danger);
  --lock-ring-bg: rgba(var(--ion-color-danger-rgb), 0.12);
}
.status-ring.unlocked {
  --lock-ring-border: var(--ion-color-success);
  --lock-ring-bg: rgba(var(--ion-color-success-rgb), 0.15);
}
.status-ring.unknown {
  --lock-ring-border: var(--ion-color-medium);
  --lock-ring-bg: rgba(var(--ion-color-medium-rgb), 0.1);
}
.ring-icon {
  font-size: 4rem;
  color: var(--lock-ring-border, #999);
}
</style>
