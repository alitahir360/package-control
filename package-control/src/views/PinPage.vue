<template>
  <ion-page>
    <ion-content class="ion-padding">
      <h2>{{ locale.t('pin.title') }}</h2>
      <p class="muted">{{ locale.t('pin.subtitle') }}</p>
      <p class="hint">{{ locale.t('pin.sendHint') }}</p>

      <div class="digits" aria-label="PIN digits">
        <div v-for="(d, i) in digitChars" :key="i" class="digit-box">{{ d }}</div>
      </div>

      <ion-button
        expand="block"
        class="ion-margin-top"
        @click="copyPin"
        :disabled="!connection.isOnline"
      >
        {{ copied ? locale.t('pin.copied') : locale.t('pin.copy') }}
      </ion-button>
      <ion-button
        expand="block"
        fill="outline"
        @click="rollAndSync"
        :disabled="!connection.isOnline || syncing"
      >
        {{ locale.t('pin.newRandom') }}
      </ion-button>
      <ion-text v-if="!connection.isOnline" color="medium">
        <p>{{ locale.t('pin.notConnected') }}</p>
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonPage, IonText } from '@ionic/vue';
import { computed, onMounted, ref } from 'vue';
import { useBluetooth } from '@/composables/useBluetooth';
import { useConnectionStore } from '@/stores/connection';
import { useLocaleStore } from '@/stores/locale';
import { copyToClipboard } from '@/utils/clipboard';

const locale = useLocaleStore();
const connection = useConnectionStore();
const { sendCommand } = useBluetooth();

const pin = ref('0000');
const copied = ref(false);
const syncing = ref(false);

const digitChars = computed(() => pin.value.padStart(4, '0').slice(-4).split(''));

function randomPin(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function rollAndSync() {
  pin.value = randomPin();
  await syncPin();
}

async function syncPin() {
  if (!connection.isOnline) return;
  syncing.value = true;
  try {
    await sendCommand(`PIN:${pin.value}`);
  } finally {
    syncing.value = false;
  }
}

async function copyPin() {
  try {
    await copyToClipboard(pin.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    /* ignore */
  }
}

onMounted(() => {
  pin.value = randomPin();
});
</script>

<style scoped>
.muted {
  opacity: 0.85;
  margin-top: 0;
}
.hint {
  font-size: 0.88rem;
  opacity: 0.8;
}
.digits {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin: 1.5rem 0;
}
.digit-box {
  width: 3rem;
  height: 3.5rem;
  border-radius: 12px;
  border: 2px solid var(--ion-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  background: var(--ion-item-background, #fff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
</style>
