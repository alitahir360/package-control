<template>
  <ion-page>
    <ion-content class="ion-padding">
      <h2>{{ locale.t('connect.title') }}</h2>
      <p class="muted">{{ locale.t('connect.notConnected') }}</p>

      <ion-note class="platform-note" color="medium">
        <p v-if="isIos">{{ locale.t('connect.iosHint') }}</p>
        <p v-else-if="isWeb">{{ locale.t('connect.webHint') }}</p>
        <p v-else>{{ locale.t('connect.nativeHint') }}</p>
      </ion-note>

      <p v-if="connection.isOnline" class="status-ok">
        {{ locale.t('connect.connectedTo', { name: connection.deviceName ?? '—' }) }}
      </p>
      <p v-if="connection.lastError" class="status-err">
        {{ locale.t('connect.error', { msg: connection.lastError }) }}
      </p>

      <ion-button expand="block" class="ion-margin-top" @click="onPair" :disabled="busy">
        {{ locale.t('connect.pair') }}
      </ion-button>
      <ion-button
        expand="block"
        fill="outline"
        color="medium"
        :disabled="!connection.isOnline || busy"
        @click="onDisconnect"
      >
        {{ locale.t('connect.disconnect') }}
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonNote, IonPage } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';
import { computed, ref } from 'vue';
import { useBluetooth } from '@/composables/useBluetooth';
import { useConnectionStore } from '@/stores/connection';
import { useLocaleStore } from '@/stores/locale';

const locale = useLocaleStore();
const connection = useConnectionStore();
const { pairAndConnect, disconnect } = useBluetooth();

const busy = ref(false);

const isIos = computed(() => Capacitor.getPlatform() === 'ios');
const isWeb = computed(() => Capacitor.getPlatform() === 'web');

async function onPair() {
  busy.value = true;
  connection.clearError();
  try {
    await pairAndConnect();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    connection.setError(msg);
  } finally {
    busy.value = false;
  }
}

async function onDisconnect() {
  busy.value = true;
  try {
    await disconnect();
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
.platform-note {
  display: block;
  margin: 1rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
}
.status-ok {
  color: var(--ion-color-success-shade);
  font-weight: 600;
}
.status-err {
  color: var(--ion-color-danger-shade);
  font-size: 0.9rem;
}
</style>
