export type LocaleCode = 'en' | 'es';

/** Nested string maps for translations (explicit type avoids circular alias issues). */
export type MessageValue = string | { [key: string]: MessageValue };
export type MessageTree = { [key: string]: MessageValue };

export const messages: Record<LocaleCode, MessageTree> = {
  en: {
    app: {
      title: 'Package Control 📦',
    },
    connection: {
      online: 'Online',
      offline: 'Offline',
    },
    lockBanner: {
      locked: 'Locked',
      unlocked: 'Unlocked',
      unknown: 'Lock status unknown — connect and sync',
    },
    tabs: {
      connect: 'Connect',
      pin: 'PIN',
      control: 'Open/Close',
      history: 'History',
      language: 'Language',
    },
    connect: {
      title: 'Connect',
      pair: 'Pair with Box',
      disconnect: 'Disconnect',
      connectedTo: 'Connected to {name}',
      notConnected: 'Not connected to a box.',
      iosHint:
        'On iPhone, use a Web Bluetooth–capable browser such as Bluefy, or install this app via Capacitor — Mobile Safari does not support Web Bluetooth.',
      webHint: 'Use Chrome or Edge on desktop for Web Bluetooth. Keep Bluetooth enabled.',
      nativeHint: 'Bluetooth permission may be requested. Stay within range of the box.',
      error: 'Connection error: {msg}',
    },
    pin: {
      title: 'PIN code',
      subtitle: 'Sync a 4-digit code with the keypad on the box.',
      copy: 'Copy code',
      copied: 'Copied',
      newRandom: 'New random code',
      sendHint: 'When you generate a code, it is sent to the box as PIN:XXXX.',
      notConnected: 'Connect to the box first.',
    },
    control: {
      title: 'Open / close',
      subtitle: 'Manual control of the delivery box.',
      open: 'OPEN THE BOX',
      lock: 'LOCK THE BOX',
      notConnected: 'Connect to the box first.',
    },
    history: {
      title: 'History',
      subtitle: 'Commands sent from this device.',
      clear: 'Clear history',
      empty: 'No events yet.',
      at: '{date}',
    },
    historyEvents: {
      sentOpen: 'Sent OPEN',
      sentLock: 'Sent LOCK',
      sentPin: 'Sent PIN sync',
      sentStatus: 'Sent STATUS?',
      sentUnknown: 'Sent: {cmd}',
      deviceResponse: 'Device: {text}',
    },
    language: {
      title: 'Language',
      subtitle: 'Choose the interface language.',
      english: 'English',
      spanish: 'Spanish',
    },
  },
  es: {
    app: {
      title: 'Package Control 📦',
    },
    connection: {
      online: 'En línea',
      offline: 'Sin conexión',
    },
    lockBanner: {
      locked: 'Cerrado',
      unlocked: 'Abierto',
      unknown: 'Estado desconocido — conecta y sincroniza',
    },
    tabs: {
      connect: 'Conectar',
      pin: 'PIN',
      control: 'Abrir/Cerrar',
      history: 'Historial',
      language: 'Idioma',
    },
    connect: {
      title: 'Conectar',
      pair: 'Emparejar caja',
      disconnect: 'Desconectar',
      connectedTo: 'Conectado a {name}',
      notConnected: 'No hay conexión con la caja.',
      iosHint:
        'En iPhone, usa un navegador con Web Bluetooth como Bluefy, o instala la app con Capacitor — Safari no admite Web Bluetooth.',
      webHint: 'Usa Chrome o Edge en el escritorio para Web Bluetooth. Mantén Bluetooth activado.',
      nativeHint: 'Puede pedirse permiso de Bluetooth. Mantente cerca de la caja.',
      error: 'Error de conexión: {msg}',
    },
    pin: {
      title: 'Código PIN',
      subtitle: 'Sincroniza un código de 4 dígitos con el teclado de la caja.',
      copy: 'Copiar código',
      copied: 'Copiado',
      newRandom: 'Nuevo código aleatorio',
      sendHint: 'Al generar un código se envía a la caja como PIN:XXXX.',
      notConnected: 'Conéctate a la caja primero.',
    },
    control: {
      title: 'Abrir / cerrar',
      subtitle: 'Control manual de la caja de entregas.',
      open: 'ABRIR LA CAJA',
      lock: 'CERRAR LA CAJA',
      notConnected: 'Conéctate a la caja primero.',
    },
    history: {
      title: 'Historial',
      subtitle: 'Comandos enviados desde este dispositivo.',
      clear: 'Borrar historial',
      empty: 'Aún no hay eventos.',
      at: '{date}',
    },
    historyEvents: {
      sentOpen: 'Enviado OPEN',
      sentLock: 'Enviado LOCK',
      sentPin: 'Sincronización PIN enviada',
      sentStatus: 'Enviado STATUS?',
      sentUnknown: 'Enviado: {cmd}',
      deviceResponse: 'Dispositivo: {text}',
    },
    language: {
      title: 'Idioma',
      subtitle: 'Elige el idioma de la interfaz.',
      english: 'Inglés',
      spanish: 'Español',
    },
  },
};

function getNested(obj: MessageTree, path: string[]): string | undefined {
  let cur: MessageValue | undefined = obj;
  for (const p of path) {
    if (cur === undefined || typeof cur === 'string') return undefined;
    cur = cur[p];
  }
  return typeof cur === 'string' ? cur : undefined;
}

export function lookupMessage(locale: LocaleCode, key: string): string | undefined {
  const path = key.split('.');
  return getNested(messages[locale], path);
}
