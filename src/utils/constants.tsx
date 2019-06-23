export const STORAGE_ENABLED_PAGES_KEY = 'enabledPages'

export enum MessageType {
  RequestUrl,
}

export interface Message {
  type: MessageType
}
