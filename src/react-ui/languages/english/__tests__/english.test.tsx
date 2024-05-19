import { CurrentCharObj, LanguageManager } from '#/core'

import OptionsBlock from '../OptionsBlock'
import englishUIHandler, { _test } from '../english'
import 連結區塊 from '../連結區塊/連結區塊'

const { 語言選項 } = _test!

const languageManager = new LanguageManager()

beforeEach(() => {
  languageManager.clear()
})

describe('取得語言選項', () => {
  it('returns the expected object', () => {
    expect(englishUIHandler.取得語言選項()).toEqual(語言選項)
  })
})

describe('處理寫鍵按下', () => {
  const commonOpts: any = {
    getCurrentCharObjFromPractice: jest.fn(),
    practiceValue: 'foo bar baz ',
    setCurrentDisplayCharIdx: jest.fn(),
    setPractice: jest.fn(),
    setPracticeHasError: jest.fn(),
    setWriting: jest.fn(),
    writingValue: 'writingValue',
    按鍵事件: { key: 'eventKeyValue' },
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
      writingValue: '',
      按鍵事件: { key: 'Backspace' },
    }

    englishUIHandler.處理寫鍵按下(opts)

    expect(opts.setCurrentDisplayCharIdx.mock.calls).toEqual([['indexValue']])
    expect(opts.setPractice.mock.calls).toEqual([['foo bar ']])
    expect(opts.setWriting.mock.calls).toEqual([])
  })

  it('handles when a 字元對象類別 is missing', () => {
    const opts: any = {
      ...commonOpts,
      getCurrentCharObjFromPractice: () => ({}),
    }

    englishUIHandler.處理寫鍵按下(opts)

    expect(opts.setPracticeHasError.mock.calls).toEqual([[false]])
    expect(opts.setWriting.mock.calls).toEqual([])
  })

  it('updates the practice text when the word is completed', () => {
    const opts: any = {
      ...commonOpts,
      getCurrentCharObjFromPractice: () => ({
        ch: { pronunciation: 'abc', word: 'wordValue' },
      }),
      writingValue: 'ab',
      按鍵事件: { key: 'c', preventDefault: jest.fn() },
    }

    englishUIHandler.處理寫鍵按下(opts)

    expect(opts.按鍵事件.preventDefault.mock.calls).toEqual([[]])
    expect(opts.setWriting.mock.calls).toEqual([['']])
    expect(opts.setPractice.mock.calls).toEqual([['foo bar baz wordValue ']])
  })
})

describe('getOptionsBlock', () => {
  it('returns the expected component', () => {
    expect(englishUIHandler.getOptionsBlock()).toEqual(OptionsBlock)
  })
})

describe('取得連結區塊', () => {
  it('returns the expected component', () => {
    expect(englishUIHandler.取得連結區塊()).toEqual(連結區塊)
  })
})
