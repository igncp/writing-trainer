import { CurrentCharObj, LanguageManager } from 'writing-trainer-core'

import LinksBlock from '../LinksBlock/LinksBlock'
import OptionsBlock from '../OptionsBlock'
import englishUIHandler, { _test } from '../english'

const { 語言選項 } = _test!

const languageManager = new LanguageManager()

beforeEach(() => {
  languageManager.clear()
})

describe('getDisplayedCharHandler', () => {
  it('returns null', () => {
    expect(englishUIHandler.getDisplayedCharHandler()).toEqual(null)
  })
})

describe('取得語言選項', () => {
  it('returns the expected object', () => {
    expect(englishUIHandler.取得語言選項()).toEqual(語言選項)
  })
})

describe('handleWritingKeyDown', () => {
  const commonOpts: any = {
    getCurrentCharObjFromPractice: jest.fn(),
    keyEvent: { key: 'eventKeyValue' },
    practiceValue: 'foo bar baz ',
    setCurrentDisplayCharIdx: jest.fn(),
    setPractice: jest.fn(),
    setPracticeHasError: jest.fn(),
    setWriting: jest.fn(),
    writingValue: 'writingValue',
    語言選項: {},
  }

  it('removes a word (leaving a space) and select the previous one when deleting', () => {
    const opts: any = {
      ...commonOpts,
      getCurrentCharObjFromPractice: () =>
        new CurrentCharObj({
          ch: 'charValue' as any,
          index: 'indexValue' as any,
        }),
      keyEvent: { key: 'Backspace' },
      writingValue: '',
    }

    englishUIHandler.handleWritingKeyDown(opts)

    expect(opts.setCurrentDisplayCharIdx.mock.calls).toEqual([['indexValue']])
    expect(opts.setPractice.mock.calls).toEqual([['foo bar ']])
    expect(opts.setWriting.mock.calls).toEqual([])
  })

  it('handles when a CharObj is missing', () => {
    const opts: any = {
      ...commonOpts,
      getCurrentCharObjFromPractice: () => ({}),
    }

    englishUIHandler.handleWritingKeyDown(opts)

    expect(opts.setPracticeHasError.mock.calls).toEqual([[false]])
    expect(opts.setWriting.mock.calls).toEqual([])
  })

  it('updates the practice text when the word is completed', () => {
    const opts: any = {
      ...commonOpts,
      getCurrentCharObjFromPractice: () => ({
        ch: { pronunciation: 'abc', word: 'wordValue' },
      }),
      keyEvent: { key: 'c', preventDefault: jest.fn() },
      writingValue: 'ab',
    }

    englishUIHandler.handleWritingKeyDown(opts)

    expect(opts.keyEvent.preventDefault.mock.calls).toEqual([[]])
    expect(opts.setWriting.mock.calls).toEqual([['']])
    expect(opts.setPractice.mock.calls).toEqual([['foo bar baz wordValue ']])
  })
})

describe('getOptionsBlock', () => {
  it('returns the expected component', () => {
    expect(englishUIHandler.getOptionsBlock()).toEqual(OptionsBlock)
  })
})

describe('getLinksBlock', () => {
  it('returns the expected component', () => {
    expect(englishUIHandler.getLinksBlock()).toEqual(LinksBlock)
  })
})
