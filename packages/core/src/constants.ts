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
  setValue: (key: string, value: string) => void
  getValue: (key: string) => Promise<string>
}
