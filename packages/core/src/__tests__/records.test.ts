import { filterRecords, T_Record } from '../records'

const dummyRecords: T_Record[] = [
  {
    createdOn: 0,
    language: 'japanese',
    lastLoadedOn: 0,
  },
  {
    createdOn: 0,
    language: 'english',
    lastLoadedOn: 1,
  },
].map((semiRecord, semiRecordIdx) => ({
  ...semiRecord,
  createdOn: Date.now(),
  id: semiRecordIdx,
  link: `linkValue-${semiRecordIdx}`,
  name: `nameValue-${semiRecordIdx}`,
  pronunciation: `pronunciationValue-${semiRecordIdx}`,
  text: `textValue-${semiRecordIdx}`,
}))

describe('filterRecords', () => {
  it('returns the original input when no text', () => {
    expect(filterRecords({ filterText: '', records: dummyRecords })).toEqual(
      dummyRecords,
    )
    expect(filterRecords({ filterText: '', records: [] })).toEqual([])
  })

  it('returns the expected lists', () => {
    expect(
      filterRecords({ filterText: 'japanese', records: dummyRecords }),
    ).toEqual([dummyRecords[0]])

    expect(
      filterRecords({ filterText: 'nameValue', records: dummyRecords }),
    ).toEqual(dummyRecords.slice(0).reverse())
  })
})
