export interface T_LanguageDefinition {
  id: string
  name: string
}

export type T_LanguageId = T_LanguageDefinition['id']

export interface T_Storage {
  setValue(key: string, value: string): void
  getValue(key: string): Promise<string>
}
