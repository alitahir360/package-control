<template>
  <ion-page>
    <ion-content class="ion-padding">
      <h2>{{ loc.t('language.title') }}</h2>
      <p class="muted">{{ loc.t('language.subtitle') }}</p>

      <ion-list>
        <ion-radio-group :value="loc.locale" @ionChange="onLangChange">
          <ion-item>
            <ion-radio slot="start" value="en" />
            <ion-label>{{ loc.t('language.english') }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-radio slot="start" value="es" />
            <ion-label>{{ loc.t('language.spanish') }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-radio slot="start" value="fr" />
            <ion-label>{{ loc.t('language.french') }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-radio slot="start" value="it" />
            <ion-label>{{ loc.t('language.italian') }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-radio slot="start" value="zh-CN" />
            <ion-label>{{ loc.t('language.mandarin') }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-radio slot="start" value="nl" />
            <ion-label>{{ loc.t('language.dutch') }}</ion-label>
          </ion-item>
        </ion-radio-group>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRadio,
  IonRadioGroup,
} from '@ionic/vue';
import { isLocaleCode } from '@/stores/locale/messages';
import { useLocaleStore } from '@/stores/locale';

const loc = useLocaleStore();

async function onLangChange(ev: CustomEvent) {
  const v = ev.detail.value as string;
  if (isLocaleCode(v)) {
    await loc.setLocale(v);
  }
}
</script>

<style scoped>
.muted {
  opacity: 0.85;
  margin-top: 0;
}
</style>
