import { T_LanguageId } from './constants'

export interface T_Record {
  createdOn: number
  id: number
  language: T_LanguageId
  lastLoadedOn: number
  link: string
  name: string
  pronunciation: string
  text: string
}
