import { ref } from 'vue';
import {
  BleClient,
  dataViewToText,
  textToDataView,
} from '@capacitor-community/bluetooth-le';
import { NUS_RX_UUID, NUS_SERVICE_UUID, NUS_TX_UUID } from '@/constants/ble';
import { useConnectionStore } from '@/stores/connection';
import { useHistoryStore } from '@/stores/history';
import { useLockStore } from '@/stores/lock';

let rxLineBuffer = '';

function flushLines(chunk: string, onLine: (line: string) => void) {
  rxLineBuffer += chunk;
  const parts = rxLineBuffer.split(/\r?\n/);
  rxLineBuffer = parts.pop() ?? '';
  for (const p of parts) {
    const line = p.trim();
    if (line) onLine(line);
  }
}

function dispatchIncomingLine(line: string) {
  const lock = useLockStore();
  const history = useHistoryStore();
  lock.applyDeviceLine(line);
  void history.logDeviceLine(line);
}

const deviceIdRef = ref<string | null>(null);
const notificationsActive = ref(false);

export function useBluetooth() {
  const connection = useConnectionStore();
  const history = useHistoryStore();

  async function ensureInitialized() {
    if (connection.bleReady) return;
    await BleClient.initialize();
    connection.setBleReady(true);
  }

  async function startListening(deviceId: string) {
    if (notificationsActive.value) {
      await BleClient.stopNotifications(deviceId, NUS_SERVICE_UUID, NUS_TX_UUID);
    }
    rxLineBuffer = '';
    await BleClient.startNotifications(
      deviceId,
      NUS_SERVICE_UUID,
      NUS_TX_UUID,
      (value: DataView) => {
        const text = dataViewToText(value);
        if (text.includes('\n') || text.includes('\r')) {
          flushLines(text, dispatchIncomingLine);
        } else {
          const line = text.trim();
          if (line) dispatchIncomingLine(line);
        }
      },
    );
    notificationsActive.value = true;
  }

  async function pairAndConnect(): Promise<void> {
    await ensureInitialized();
    connection.clearError();

    const device = await BleClient.requestDevice({
      services: [NUS_SERVICE_UUID],
      optionalServices: [NUS_SERVICE_UUID],
    });

    await BleClient.connect(device.deviceId, (id: string) => {
      if (deviceIdRef.value === id) {
        deviceIdRef.value = null;
        notificationsActive.value = false;
        connection.setDisconnected();
        useLockStore().setUnknown();
      }
    });

    deviceIdRef.value = device.deviceId;
    connection.setConnected(device.name ?? device.deviceId);
    await startListening(device.deviceId);
    await sendCommand('STATUS?');
  }

  async function disconnect() {
    const id = deviceIdRef.value;
    if (!id) return;
    try {
      if (notificationsActive.value) {
        await BleClient.stopNotifications(id, NUS_SERVICE_UUID, NUS_TX_UUID);
        notificationsActive.value = false;
      }
    } catch {
      /* ignore */
    }
    try {
      await BleClient.disconnect(id);
    } catch {
      /* ignore */
    }
    deviceIdRef.value = null;
    connection.setDisconnected();
    useLockStore().setUnknown();
    rxLineBuffer = '';
  }

  async function sendRaw(cmd: string): Promise<void> {
    const id = deviceIdRef.value;
    if (!id) throw new Error('NOT_CONNECTED');
    const payload = textToDataView(cmd);
    await BleClient.writeWithoutResponse(
      id,
      NUS_SERVICE_UUID,
      NUS_RX_UUID,
      payload,
    );
  }

  function historyKeyForCommand(cmd: string): {
    icon: 'lock' | 'unlock' | 'send';
    key: string;
    params?: Record<string, string>;
  } {
    const upper = cmd.trim().toUpperCase();
    if (upper === 'OPEN') return { icon: 'unlock', key: 'historyEvents.sentOpen' };
    if (upper === 'LOCK') return { icon: 'lock', key: 'historyEvents.sentLock' };
    if (upper === 'STATUS?') return { icon: 'send', key: 'historyEvents.sentStatus' };
    if (upper.startsWith('PIN:')) {
      return { icon: 'send', key: 'historyEvents.sentPin' };
    }
    return {
      icon: 'send',
      key: 'historyEvents.sentUnknown',
      params: { cmd: cmd.trim() },
    };
  }

  async function sendCommand(cmd: string): Promise<void> {
    const { icon, key, params } = historyKeyForCommand(cmd);
    await sendRaw(cmd);
    await history.logCommand(icon, key, params);
  }

  return {
    deviceId: deviceIdRef,
    ensureInitialized,
    pairAndConnect,
    disconnect,
    sendCommand,
    sendRaw,
  };
}
