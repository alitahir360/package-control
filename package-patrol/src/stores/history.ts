import { defineStore } from 'pinia';
import { ref } from 'vue';
import { HISTORY_KEY, storage } from '@/services/appStorage';
import type { HistoryEntry, HistoryIconKind } from '@/types/history';

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useHistoryStore = defineStore('history', () => {
  const entries = ref<HistoryEntry[]>([]);

  async function hydrate() {
    const raw = await storage.get(HISTORY_KEY);
    if (Array.isArray(raw)) {
      entries.value = raw.filter(
        (e): e is HistoryEntry =>
          e &&
          typeof e === 'object' &&
          typeof (e as HistoryEntry).id === 'string' &&
          typeof (e as HistoryEntry).messageKey === 'string' &&
          typeof (e as HistoryEntry).at === 'string',
      );
    }
  }

  async function persist() {
    // IndexedDB cannot clone Vue/Pinia reactive proxies; store plain JSON only.
    const plain: HistoryEntry[] = JSON.parse(JSON.stringify(entries.value));
    await storage.set(HISTORY_KEY, plain);
  }

  async function logCommand(
    icon: HistoryIconKind,
    messageKey: string,
    messageParams?: Record<string, string>,
  ) {
    entries.value.unshift({
      id: newId(),
      icon,
      messageKey,
      messageParams,
      at: new Date().toISOString(),
    });
    await persist();
  }

  async function logDeviceLine(text: string) {
    await logCommand('send', 'historyEvents.deviceResponse', { text });
  }

  async function clear() {
    entries.value = [];
    await storage.remove(HISTORY_KEY);
  }

  return { entries, hydrate, logCommand, logDeviceLine, clear };
});
