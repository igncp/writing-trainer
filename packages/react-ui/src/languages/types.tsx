import React from 'react'
import { CharObj, CurrentCharObj, LanguageHandler } from 'writing-trainer-core'

export type T_LangOpts = { [k: string]: unknown }

// @TODO: Review this interface
export type T_LinksBlock = React.FC<{
  text: string
}>

export type T_OptionsBlock = React.FC<{
  languageOptions: T_LangOpts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOptionsChange: (...args: any[]) => void
}>

export type T_getPronunciationOfText = (opts: {
  text: string
  charsToRemove: string
}) => string

export type T_getCurrentCharObjFromPractice = (
  t?: string,
) => CurrentCharObj | null

type T_handleWritingKeyDown = (opts: {
  charsObjs: CharObj[]
  getCurrentCharObjFromPractice: T_getCurrentCharObjFromPractice
  keyEvent: React.KeyboardEvent<HTMLTextAreaElement>
  languageOptions: T_LangOpts
  originalTextValue: string
  practiceValue: string
  setCurrentDisplayCharIdx: (idx: number) => void
  setPractice: (o: string) => void
  setPracticeHasError: (o: boolean) => void
  setWriting: (o: string) => void
  specialCharsValue: string
  writingValue: string
}) => void

export type T_CharsDisplayClickHandler =
  | ((opts: { charObj: CharObj; charsObjs: CharObj[]; index: number }) => void)
  | null

export interface T_UIHandler {
  getDisplayedCharHandler: () => T_CharsDisplayClickHandler
  getLangOpts: () => T_LangOpts
  getLinksBlock: () => T_LinksBlock
  getOptionsBlock: () => T_OptionsBlock
  handleWritingKeyDown: T_handleWritingKeyDown
  languageHandler: LanguageHandler
  shouldAllCharsHaveSameWidth: boolean
}
