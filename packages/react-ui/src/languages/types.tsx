import React from 'react'
import {
  字元對象類別,
  CurrentCharObj,
  LanguageHandler,
} from 'writing-trainer-core'

export type 類型_文字片段列表 = { 列表: string[]; 索引: number }

export type 類型_語言選項 = { [k: string]: unknown }

export type 類型_連結區塊 = (選項: {
  children?: React.ReactNode
  文字: string
  文字片段列表: 類型_文字片段列表
  更改文字片段列表: (列表: 類型_文字片段列表) => void
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

type T_處理寫鍵按下 = (opts: {
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
  字元對象列表: 字元對象類別[]
  按鍵事件: React.KeyboardEvent<HTMLTextAreaElement>
  語言選項: 類型_語言選項
}) => void

export type T_CharsDisplayClickHandler =
  | ((opts: {
      字元對象: 字元對象類別
      字元對象列表: 字元對象類別[]
      索引: number
    }) => void)
  | null

type T_BlurHandlerOpts = {
  fragmentsList: string[]
  語言選項: 類型_語言選項
}

type T_BlurHandler = (opts: T_BlurHandlerOpts) => {
  newFragmentsList: string[] | undefined
}

export interface 類型_語言UI處理程序 {
  getDisplayedCharHandler: () => T_CharsDisplayClickHandler
  getOptionsBlock: () => T_OptionsBlock
  languageHandler: LanguageHandler
  onBlur?: T_BlurHandler
  shouldAllCharsHaveSameWidth: boolean
  儲存語言選項: (o: 類型_語言選項) => void
  取得語言選項: () => 類型_語言選項
  取得連結區塊: () => 類型_連結區塊
  取得錯誤顏色?: (
    選項: 類型_語言選項,
    字元: CurrentCharObj | null,
  ) => string | undefined
  處理寫鍵按下: T_處理寫鍵按下
  處理清除事件?: (處理程序: 類型_語言UI處理程序) => void
}
