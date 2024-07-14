import { LanguageDefinition } from './constants'

// @TODO: refactor to have a private `data` property
class Record {
  public createdOn: number
  public id: string
  public isRemote: boolean
  public language: LanguageDefinition['id']
  public lastLoadedOn: number
  public link: string
  public name: string
  public pronunciation: string
  public text: string

  public constructor(ops: {
    createdOn: Record['createdOn']
    id: Record['id']
    isRemote: Record['isRemote']
    language: Record['language']
    lastLoadedOn: Record['lastLoadedOn']
    link: Record['link']
    name: Record['name']
    pronunciation: Record['pronunciation']
    text: Record['text']
  }) {
    this.createdOn = ops.createdOn
    this.id = ops.id
    this.language = ops.language
    this.lastLoadedOn = ops.lastLoadedOn
    this.link = ops.link
    this.name = ops.name
    this.pronunciation = ops.pronunciation
    this.text = ops.text
    this.isRemote = ops.isRemote
  }

  public static filterByText({
    filterText,
    records,
  }: {
    filterText: string
    records: Record[]
  }) {
    if (!filterText.trim()) {
      return records
    }

    const lowercaseFilterValue = filterText.toLowerCase()

    const filterValueSegments = lowercaseFilterValue
      .split(' ')
      .map(s => s.trim())
      .filter(s => !!s)

    return records
      .filter(r => {
        const name = r.name.toLowerCase()
        const language = r.language.toLowerCase()

        return filterValueSegments.every(segment => {
          return name.includes(segment) || language.includes(segment)
        })
      })
      .sort((a: Record, b: Record) => {
        return b.lastLoadedOn - a.lastLoadedOn
      })
  }

  public toJson() {
    return {
      createdOn: this.createdOn,
      id: this.id,
      isRemote: this.isRemote,
      language: this.language,
      lastLoadedOn: this.lastLoadedOn,
      link: this.link,
      name: this.name,
      pronunciation: this.pronunciation,
      text: this.text,
    }
  }
}

export { Record }
