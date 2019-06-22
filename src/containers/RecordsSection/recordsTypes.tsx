import { TLanguageId } from '#/languages/types'

export interface Record {
  createdOn: number
  id: number
  language: TLanguageId
  lastLoadedOn: number
  link: string
  name: string
  pronunciation: string
  text: string
}
