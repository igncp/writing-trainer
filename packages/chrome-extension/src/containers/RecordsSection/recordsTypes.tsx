import { T_LanguageId } from '#/languages/types'

export interface Record {
  createdOn: number
  id: number
  language: T_LanguageId
  lastLoadedOn: number
  link: string
  name: string
  pronunciation: string
  text: string
}
