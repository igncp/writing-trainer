import React from 'react'

export interface T_CharObj {
  index: number
  pronunciation: string
  word: string
}

export type TLanguageOptions = object

export type TLinksBlock = React.FC<{
  text: string
}>

export type TOptionsBlock = React.FC<{
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

export type T_handleWritingKeyDown = (opts: {
  charsObjs: T_CharObj[]
  currentCharObj: T_CharObj
  keyEvent: React.KeyboardEvent<HTMLTextAreaElement>
  languageOptions: TLanguageOptions
  originalTextValue: string
  practiceValue: string
  setPractice(o: string): void
  setPracticeHasError(o: boolean): void
  setWriting(o: string): void
  specialCharsValue: string
  writingValue: string
}) => void

export interface TLanguageDefinition {
  id: string
  text: string
}

export type TLanguageId = TLanguageDefinition['id']
