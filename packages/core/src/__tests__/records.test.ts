import { Record } from '../records'

const dummyRecords: Record[] = [
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
].map(
  (semiRecord, semiRecordIdx) =>
    new Record({
      ...semiRecord,
      createdOn: Date.now(),
      id: semiRecordIdx,
      link: `linkValue-${semiRecordIdx}`,
      name: `nameValue-${semiRecordIdx}`,
      pronunciation: `pronunciationValue-${semiRecordIdx}`,
      text: `textValue-${semiRecordIdx}`,
    }),
)

describe('Record.filterByText', () => {
  it('returns the original input when no text', () => {
    expect(
      Record.filterByText({ filterText: '', records: dummyRecords }),
    ).toEqual(dummyRecords)
    expect(Record.filterByText({ filterText: '', records: [] })).toEqual([])
  })

  it('returns the expected lists', () => {
    expect(
      Record.filterByText({ filterText: 'japanese', records: dummyRecords }),
    ).toEqual([dummyRecords[0]])

    expect(
      Record.filterByText({ filterText: 'nameValue', records: dummyRecords }),
    ).toEqual(dummyRecords.slice(0).reverse())
  })
})
