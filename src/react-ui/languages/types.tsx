import { T_CharObj, CurrentCharObj, LanguageHandler } from '#/core'
import { ReactNode, KeyboardEvent } from 'react'

export type T_Fragments = { index: number; list: string[] }

export type T_LangOpts = { [k: string]: unknown }

export type T_LinksBlock = (選項: {
  children?: ReactNode
  fragments: T_Fragments
  文字: string
  更改fragments: (list: T_Fragments) => void
}) => ReactNode

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

type T_處理寫鍵按下 = (opts: {
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

export interface 類型_語言UI處理程序 {
  getLangOpts: () => T_LangOpts
  getLinksBlock: () => T_LinksBlock
  getOptionsBlock: () => T_OptionsBlock
  languageHandler: LanguageHandler
  onBlur?: T_BlurHandler
  saveLangOptss: (o: T_LangOpts) => void
  shouldAllCharsHaveSameWidth: boolean
  tonesNumber?: number
  取得錯誤顏色?: (
    選項: T_LangOpts,
    字元: CurrentCharObj | null,
  ) => string | undefined
  處理寫鍵按下: T_處理寫鍵按下
  處理清除事件?: (處理程序: 類型_語言UI處理程序) => void
}
