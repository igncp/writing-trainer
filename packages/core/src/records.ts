import { T_LanguageId } from './constants'

interface T_Record {
  createdOn: number
  id: number
  language: T_LanguageId
  lastLoadedOn: number
  link: string
  name: string
  pronunciation: string
  text: string
}

type T_filterRecords = (opts: {
  records: T_Record[]
  filterText: string
}) => T_Record[]

const filterRecords: T_filterRecords = ({ records, filterText }) => {
  if (!filterText.trim()) {
    return records
  }

  const lowercaseFilterValue = filterText.toLowerCase()
  const filterValueSegments = lowercaseFilterValue
    .split(' ')
    .map((s) => s.trim())
    .filter((s) => !!s)

  return records
    .filter((r) => {
      const name = r.name.toLowerCase()
      const language = r.language.toLowerCase()

      return filterValueSegments.every((segment) => {
        return name.indexOf(segment) !== -1 || language.indexOf(segment) !== -1
      })
    })
    .sort((a: T_Record, b: T_Record) => {
      return b.lastLoadedOn - a.lastLoadedOn
    })
}

export { T_Record, filterRecords }
