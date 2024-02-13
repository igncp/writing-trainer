import React from 'react'
import { CharObj, CurrentCharObj, LanguageHandler } from 'writing-trainer-core'

export type 類型_語言選項 = { [k: string]: unknown }

export type T_LinksBlock = (opts: {
  children?: React.ReactNode
  text: string
}) => React.ReactNode

export type T_OptionsBlock = (props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  更改語言選項: (...args: any[]) => void
  語言選項: 類型_語言選項
}) => React.ReactNode

export type T_getPronunciationOfText = (opts: {
  charsToRemove: string
  text: string
}) => string

export type T_getCurrentCharObjFromPractice = (
  t?: string,
) => CurrentCharObj | null

type T_handleWritingKeyDown = (opts: {
  charsObjs: CharObj[]
  getCurrentCharObjFromPractice: T_getCurrentCharObjFromPractice
  originalTextValue: string
  practiceValue: string
  setCurrentDisplayCharIdx: (idx: number) => void
  setCurrentText: (text: string) => void
  setPractice: (o: string) => void
  setPracticeHasError: (o: boolean) => void
  setWriting: (o: string) => void
  specialCharsValue: string
  writingValue: string
  按鍵事件: React.KeyboardEvent<HTMLTextAreaElement>
  語言選項: 類型_語言選項
}) => void

export type T_CharsDisplayClickHandler =
  | ((opts: { charObj: CharObj; charsObjs: CharObj[]; index: number }) => void)
  | null

type T_BlurHandlerOpts = {
  fragmentsList: string[]
  語言選項: 類型_語言選項
}

type T_BlurHandler = (opts: T_BlurHandlerOpts) => {
  newFragmentsList: string[] | undefined
}

export interface T_UIHandler {
  getDisplayedCharHandler: () => T_CharsDisplayClickHandler
  getLinksBlock: () => T_LinksBlock
  getOptionsBlock: () => T_OptionsBlock
  handleWritingKeyDown: T_handleWritingKeyDown
  languageHandler: LanguageHandler
  onBlur?: T_BlurHandler
  shouldAllCharsHaveSameWidth: boolean
  儲存語言選項: (o: 類型_語言選項) => void
  取得語言選項: () => 類型_語言選項
}
