export type LocaleCode = 'en' | 'es' | 'fr' | 'it' | 'zh-CN' | 'nl';

export const SUPPORTED_LOCALES: readonly LocaleCode[] = [
  'en',
  'es',
  'fr',
  'it',
  'zh-CN',
  'nl',
];

export function isLocaleCode(value: string): value is LocaleCode {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** Nested string maps for translations (explicit type avoids circular alias issues). */
export type MessageValue = string | { [key: string]: MessageValue };
export type MessageTree = { [key: string]: MessageValue };

export const messages: Record<LocaleCode, MessageTree> = {
  en: {
    app: {
      title: 'Package Patrol 📦',
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
      french: 'French',
      italian: 'Italian',
      mandarin: 'Mandarin',
      dutch: 'Dutch',
    },
  },
  es: {
    app: {
      title: 'Package Patrol 📦',
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
      french: 'Francés',
      italian: 'Italiano',
      mandarin: 'Chino (simplificado)',
      dutch: 'Neerlandés',
    },
  },
  fr: {
    app: {
      title: 'Package Patrol 📦',
    },
    connection: {
      online: 'En ligne',
      offline: 'Hors ligne',
    },
    lockBanner: {
      locked: 'Verrouillé',
      unlocked: 'Déverrouillé',
      unknown: 'État inconnu — connectez la boîte et synchronisez',
    },
    tabs: {
      connect: 'Connexion',
      pin: 'PIN',
      control: 'Ouvrir/Fermer',
      history: 'Historique',
      language: 'Langue',
    },
    connect: {
      title: 'Connexion',
      pair: 'Associer la boîte',
      disconnect: 'Déconnecter',
      connectedTo: 'Connecté à {name}',
      notConnected: 'Non connecté à une boîte.',
      iosHint:
        'Sur iPhone, utilisez un navigateur compatible Web Bluetooth comme Bluefy, ou installez l’app via Capacitor — Safari ne prend pas en charge Web Bluetooth.',
      webHint:
        'Utilisez Chrome ou Edge sur ordinateur pour Web Bluetooth. Gardez le Bluetooth activé.',
      nativeHint:
        'L’autorisation Bluetooth peut être demandée. Restez à proximité de la boîte.',
      error: 'Erreur de connexion : {msg}',
    },
    pin: {
      title: 'Code PIN',
      subtitle: 'Synchronisez un code à 4 chiffres avec le clavier de la boîte.',
      copy: 'Copier le code',
      copied: 'Copié',
      newRandom: 'Nouveau code aléatoire',
      sendHint: 'Lorsque vous générez un code, il est envoyé à la boîte sous PIN:XXXX.',
      notConnected: 'Connectez-vous d’abord à la boîte.',
    },
    control: {
      title: 'Ouvrir / fermer',
      subtitle: 'Contrôle manuel de la boîte à colis.',
      open: 'OUVRIR LA BOÎTE',
      lock: 'VERROUILLER LA BOÎTE',
      notConnected: 'Connectez-vous d’abord à la boîte.',
    },
    history: {
      title: 'Historique',
      subtitle: 'Commandes envoyées depuis cet appareil.',
      clear: 'Effacer l’historique',
      empty: 'Aucun événement pour le moment.',
      at: '{date}',
    },
    historyEvents: {
      sentOpen: 'Envoyé OPEN',
      sentLock: 'Envoyé LOCK',
      sentPin: 'Synchronisation PIN envoyée',
      sentStatus: 'Envoyé STATUS?',
      sentUnknown: 'Envoyé : {cmd}',
      deviceResponse: 'Appareil : {text}',
    },
    language: {
      title: 'Langue',
      subtitle: 'Choisissez la langue de l’interface.',
      english: 'Anglais',
      spanish: 'Espagnol',
      french: 'Français',
      italian: 'Italien',
      mandarin: 'Chinois (simplifié)',
      dutch: 'Néerlandais',
    },
  },
  it: {
    app: {
      title: 'Package Patrol 📦',
    },
    connection: {
      online: 'In linea',
      offline: 'Non in linea',
    },
    lockBanner: {
      locked: 'Bloccato',
      unlocked: 'Sbloccato',
      unknown: 'Stato sconosciuto — connetti e sincronizza',
    },
    tabs: {
      connect: 'Connessione',
      pin: 'PIN',
      control: 'Apri/Chiudi',
      history: 'Cronologia',
      language: 'Lingua',
    },
    connect: {
      title: 'Connessione',
      pair: 'Abbina alla scatola',
      disconnect: 'Disconnetti',
      connectedTo: 'Connesso a {name}',
      notConnected: 'Non connesso a una scatola.',
      iosHint:
        'Su iPhone usa un browser con Web Bluetooth come Bluefy, o installa l’app con Capacitor — Safari non supporta Web Bluetooth.',
      webHint:
        'Usa Chrome o Edge sul desktop per Web Bluetooth. Tieni il Bluetooth attivo.',
      nativeHint:
        'Potrebbe essere richiesto il permesso Bluetooth. Resta vicino alla scatola.',
      error: 'Errore di connessione: {msg}',
    },
    pin: {
      title: 'Codice PIN',
      subtitle: 'Sincronizza un codice a 4 cifre con la tastiera sulla scatola.',
      copy: 'Copia codice',
      copied: 'Copiato',
      newRandom: 'Nuovo codice casuale',
      sendHint: 'Quando generi un codice, viene inviato alla scatola come PIN:XXXX.',
      notConnected: 'Connettiti prima alla scatola.',
    },
    control: {
      title: 'Apri / chiudi',
      subtitle: 'Controllo manuale della cassetta delle consegne.',
      open: 'APRI LA SCATOLA',
      lock: 'BLOCCA LA SCATOLA',
      notConnected: 'Connettiti prima alla scatola.',
    },
    history: {
      title: 'Cronologia',
      subtitle: 'Comandi inviati da questo dispositivo.',
      clear: 'Cancella cronologia',
      empty: 'Nessun evento ancora.',
      at: '{date}',
    },
    historyEvents: {
      sentOpen: 'Inviato OPEN',
      sentLock: 'Inviato LOCK',
      sentPin: 'Sincronizzazione PIN inviata',
      sentStatus: 'Inviato STATUS?',
      sentUnknown: 'Inviato: {cmd}',
      deviceResponse: 'Dispositivo: {text}',
    },
    language: {
      title: 'Lingua',
      subtitle: 'Scegli la lingua dell’interfaccia.',
      english: 'Inglese',
      spanish: 'Spagnolo',
      french: 'Francese',
      italian: 'Italiano',
      mandarin: 'Cinese (semplificato)',
      dutch: 'Olandese',
    },
  },
  'zh-CN': {
    app: {
      title: 'Package Patrol 📦',
    },
    connection: {
      online: '在线',
      offline: '离线',
    },
    lockBanner: {
      locked: '已锁定',
      unlocked: '已解锁',
      unknown: '状态未知 — 请连接并同步',
    },
    tabs: {
      connect: '连接',
      pin: 'PIN',
      control: '开/关',
      history: '历史',
      language: '语言',
    },
    connect: {
      title: '连接',
      pair: '与箱子配对',
      disconnect: '断开连接',
      connectedTo: '已连接到 {name}',
      notConnected: '未连接箱子。',
      iosHint:
        '在 iPhone 上请使用支持 Web Bluetooth 的浏览器（如 Bluefy），或通过 Capacitor 安装本应用 — 移动版 Safari 不支持 Web Bluetooth。',
      webHint: '在电脑上请使用 Chrome 或 Edge 以使用 Web Bluetooth。请保持蓝牙开启。',
      nativeHint: '可能会请求蓝牙权限。请靠近箱子。',
      error: '连接错误：{msg}',
    },
    pin: {
      title: 'PIN 码',
      subtitle: '将 4 位数字码同步到箱子上的键盘。',
      copy: '复制代码',
      copied: '已复制',
      newRandom: '新的随机码',
      sendHint: '生成代码后会以 PIN:XXXX 的形式发送到箱子。',
      notConnected: '请先连接箱子。',
    },
    control: {
      title: '打开 / 锁定',
      subtitle: '手动控制投递箱。',
      open: '打开箱子',
      lock: '锁定箱子',
      notConnected: '请先连接箱子。',
    },
    history: {
      title: '历史',
      subtitle: '从此设备发送的命令。',
      clear: '清除历史',
      empty: '暂无记录。',
      at: '{date}',
    },
    historyEvents: {
      sentOpen: '已发送 OPEN',
      sentLock: '已发送 LOCK',
      sentPin: '已发送 PIN 同步',
      sentStatus: '已发送 STATUS?',
      sentUnknown: '已发送：{cmd}',
      deviceResponse: '设备：{text}',
    },
    language: {
      title: '语言',
      subtitle: '选择界面语言。',
      english: '英语',
      spanish: '西班牙语',
      french: '法语',
      italian: '意大利语',
      mandarin: '中文（简体）',
      dutch: '荷兰语',
    },
  },
  nl: {
    app: {
      title: 'Package Patrol 📦',
    },
    connection: {
      online: 'Online',
      offline: 'Offline',
    },
    lockBanner: {
      locked: 'Vergrendeld',
      unlocked: 'Ontgrendeld',
      unknown: 'Status onbekend — verbind en synchroniseer',
    },
    tabs: {
      connect: 'Verbinden',
      pin: 'PIN',
      control: 'Open/dicht',
      history: 'Geschiedenis',
      language: 'Taal',
    },
    connect: {
      title: 'Verbinden',
      pair: 'Koppel met box',
      disconnect: 'Verbreken',
      connectedTo: 'Verbonden met {name}',
      notConnected: 'Niet verbonden met een box.',
      iosHint:
        'Op iPhone: gebruik een browser met Web Bluetooth zoals Bluefy, of installeer de app via Capacitor — Mobiele Safari ondersteunt geen Web Bluetooth.',
      webHint: 'Gebruik Chrome of Edge op desktop voor Web Bluetooth. Houd Bluetooth aan.',
      nativeHint: 'Bluetooth-toestemming kan worden gevraagd. Blijf in de buurt van de box.',
      error: 'Verbindingsfout: {msg}',
    },
    pin: {
      title: 'PIN-code',
      subtitle: 'Synchroniseer een 4-cijferige code met het keypad op de box.',
      copy: 'Code kopiëren',
      copied: 'Gekopieerd',
      newRandom: 'Nieuwe willekeurige code',
      sendHint: 'Als je een code genereert, wordt die naar de box gestuurd als PIN:XXXX.',
      notConnected: 'Verbind eerst met de box.',
    },
    control: {
      title: 'Openen / vergrendelen',
      subtitle: 'Handmatige bediening van de pakketbox.',
      open: 'BOX OPENEN',
      lock: 'BOX VERGRENDELEN',
      notConnected: 'Verbind eerst met de box.',
    },
    history: {
      title: 'Geschiedenis',
      subtitle: 'Opdrachten verstuurd vanaf dit apparaat.',
      clear: 'Geschiedenis wissen',
      empty: 'Nog geen gebeurtenissen.',
      at: '{date}',
    },
    historyEvents: {
      sentOpen: 'OPEN verstuurd',
      sentLock: 'LOCK verstuurd',
      sentPin: 'PIN-sync verstuurd',
      sentStatus: 'STATUS? verstuurd',
      sentUnknown: 'Verstuurd: {cmd}',
      deviceResponse: 'Apparaat: {text}',
    },
    language: {
      title: 'Taal',
      subtitle: 'Kies de interfacetaal.',
      english: 'Engels',
      spanish: 'Spaans',
      french: 'Frans',
      italian: 'Italiaans',
      mandarin: 'Mandarijn (Vereenvoudigd Chinees)',
      dutch: 'Nederlands',
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
