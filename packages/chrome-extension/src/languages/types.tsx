import React from 'react'
import { constants, T_CharObj } from 'writing-trainer-core'

export type T_LangOpts = { [k: string]: unknown }

export type T_LinksBlock = React.FC<{
  text: string
}>

export type T_OptionsBlock = React.FC<{
  onOptionsChange: Function
}>

export type T_convertToCharsObjs = (opts: {
  pronunciation: string
  text: string
  charsToRemove: string
}) => T_CharObj[]

export type T_getPronunciationOfText = (opts: {
  text: string
  charsToRemove: string
}) => string

export type T_getFilteredTextToPracticeFn = (s: string) => (s: string) => string

type T_CurrentCharObj = { ch: T_CharObj | null; index: number }

export type T_getCurrentCharObj = (opts: {
  originalCharsObjs: T_CharObj[]
  practiceCharsObjs: T_CharObj[]
}) => T_CurrentCharObj

export type T_handleWritingKeyDown = (opts: {
  charsObjs: T_CharObj[]
  getCurrentCharObjFromPractice(t?: string): T_CurrentCharObj
  keyEvent: React.KeyboardEvent<HTMLTextAreaElement>
  languageOptions: T_LangOpts
  originalTextValue: string
  practiceValue: string
  setCurrentDisplayCharIdx(idx: number): void
  setPractice(o: string): void
  setPracticeHasError(o: boolean): void
  setWriting(o: string): void
  specialCharsValue: string
  writingValue: string
}) => void

export type T_LanguageId = constants.T_LanguageDefinition['id']

export type T_CharsDisplayClickHandler =
  | null
  | ((opts: {
      charObj: T_CharObj
      charsObjs: T_CharObj[]
      index: number
    }) => void)

export interface T_UIHandler {
  getDisplayedCharHandler(): T_CharsDisplayClickHandler
  getLangOpts(): T_LangOpts
  getLinksBlock(): T_LinksBlock
  getOptionsBlock(): T_OptionsBlock
  handleWritingKeyDown: T_handleWritingKeyDown
  id: T_LanguageId
  register(): void
  shouldAllCharsHaveSameWidth: boolean
}
