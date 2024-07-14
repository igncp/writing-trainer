import { T_CharObj, CurrentCharObj, LanguageHandler } from '#/core'
import { ReactNode, KeyboardEvent } from 'react'

export type T_Fragments = { index: number; list: string[] }

export type T_LangOpts = { [k: string]: unknown }

export type T_LinksBlock = (選項: {
  children?: ReactNode
  fragments: T_Fragments
  updateFragments: (list: T_Fragments) => void
  文字: string
}) => ReactNode

export type T_GetToneColor = (
  char: 'current' | 'current-error' | 'other',
  選項: T_LangOpts,
  字元: T_CharObj | null,
) => string | undefined

export type T_OptionsBlock = (props: {
  langOpts: T_LangOpts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateLangOpts: (...args: any[]) => void
}) => ReactNode

export type T_getPronunciationOfText = (opts: {
  charsToRemove: string
  text: string
}) => string

export type T_getCurrentCharObjFromPractice = (
  t?: string,
) => CurrentCharObj | null

type T_HandleKeyDown = (opts: {
  charsObjsList: T_CharObj[]
  getCurrentCharObjFromPractice: T_getCurrentCharObjFromPractice
  langOpts: T_LangOpts
  originalTextValue: string
  practiceValue: string
  setCurrentDisplayCharIdx: (idx: number) => void
  setCurrentText: (text: string) => void
  setPractice: (o: string) => void
  setPracticeHasError: (o: boolean) => void
  setWriting: (o: string) => void
  specialCharsValue: string
  writingValue: string
  按鍵事件: KeyboardEvent<HTMLTextAreaElement>
}) => void

type T_BlurHandlerOpts = {
  fragmentsList: string[]
  langOpts: T_LangOpts
}

type T_BlurHandler = (opts: T_BlurHandlerOpts) => {
  newFragmentsList: string[] | undefined
}

export interface T_LangUIController {
  getLangOpts: () => T_LangOpts
  getLinksBlock: () => T_LinksBlock
  getOptionsBlock: () => T_OptionsBlock
  getToneColor?: T_GetToneColor
  handleKeyDown: T_HandleKeyDown
  languageHandler: LanguageHandler
  loadDictionary: () => Promise<void>
  onBlur?: T_BlurHandler
  saveLangOptss: (o: T_LangOpts) => void
  shouldAllCharsHaveSameWidth: boolean
  tonesNumber?: number
  處理清除事件?: (處理程序: T_LangUIController) => void
}
