import React from 'react'

import { T_getCurrentPracticeWord } from '#/containers/Panel/panelHelpers'

export interface T_CharObj {
  word: string
  pronunciation: string
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
}) => Array<{
  word: string
  pronunciation: string
}>

export type T_getPronunciationOfText = (opts: {
  text: string
  charsToRemove: string
}) => string

export type T_getFilteredTextToPracticeFn = (s: string) => (s: string) => string

export type T_getWritingKeyDownHandler = (opts: {
  charsObjs: T_CharObj[]
  getCurrentPracticeWord: T_getCurrentPracticeWord
  languageOptions: TLanguageOptions
  originalTextValue: string
  practiceValue: string
  setPractice(o: string): void
  setPracticeHasError(o: boolean): void
  setWriting(o: string): void
  specialCharsValue: string
  writingValue: string
}) => (e: React.KeyboardEvent<HTMLTextAreaElement>) => void

export interface TLanguageDefinition {
  id: string
  text: string
}

export type TLanguageId = TLanguageDefinition['id']
