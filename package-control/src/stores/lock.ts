import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { LockStatus } from '@/types/lock';

export const useLockStore = defineStore('lock', () => {
  const status = ref<LockStatus>('UNKNOWN');

  function applyDeviceLine(line: string) {
    const t = line.trim();
    if (t === 'OK:OPENED' || t === 'UNLOCKED') {
      status.value = 'UNLOCKED';
      return;
    }
    if (t === 'OK:LOCKED' || t === 'LOCKED') {
      status.value = 'LOCKED';
      return;
    }
  }

  function setUnknown() {
    status.value = 'UNKNOWN';
  }

  return { status, applyDeviceLine, setUnknown };
});
