export const unknownPronunciation = '?'

export class LanguageDefinition {
  public id: string
  public name: string

  public constructor(opts: {
    id: LanguageDefinition['id']
    name: LanguageDefinition['name']
  }) {
    this.id = opts.id
    this.name = opts.name
  }
}

export interface T_Storage {
  getValue: (key: string) => Promise<string>
  setValue: (key: string, value: string) => void
}
