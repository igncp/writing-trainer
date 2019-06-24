export const STORAGE_ENABLED_PAGES_KEY = 'enabledPages'

export enum MessageType {
  EnableOnce,
  RequestUrl,
}

export interface Message {
  type: MessageType
}
