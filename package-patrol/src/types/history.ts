export type HistoryIconKind = 'lock' | 'unlock' | 'send';

export interface HistoryEntry {
  id: string;
  icon: HistoryIconKind;
  messageKey: string;
  messageParams?: Record<string, string>;
  at: string;
}
