import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConnectionStore = defineStore('connection', () => {
  const isOnline = ref(false);
  const deviceName = ref<string | undefined>(undefined);
  const lastError = ref<string | undefined>(undefined);
  const bleReady = ref(false);

  function setConnected(name?: string) {
    isOnline.value = true;
    deviceName.value = name;
    lastError.value = undefined;
  }

  function setDisconnected() {
    isOnline.value = false;
    deviceName.value = undefined;
  }

  function setError(msg: string) {
    lastError.value = msg;
  }

  function clearError() {
    lastError.value = undefined;
  }

  function setBleReady(ready: boolean) {
    bleReady.value = ready;
  }

  return {
    isOnline,
    deviceName,
    lastError,
    bleReady,
    setConnected,
    setDisconnected,
    setError,
    clearError,
    setBleReady,
  };
});
