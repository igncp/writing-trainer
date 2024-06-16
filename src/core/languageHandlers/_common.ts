import { LanguageDefinition } from '../constants'
import { T_CharObj, CurrentCharObj } from '../languageManager'

import { 特殊字元 } from './_特殊字元'

type 類型_轉換為字元對象列表 = (opts: {
  charsToRemove: string[]
  langOpts?: { [k: string]: unknown }
  text: string
}) => T_CharObj[]

class LanguageHandler {
  private readonly extraSpecialChars: string[]
  private readonly language: LanguageDefinition
  public readonly 轉換為字元對象列表: 類型_轉換為字元對象列表

  public constructor({
    extraSpecialChars,
    language,
    轉換為字元對象列表,
  }: {
    extraSpecialChars?: string[]
    language: LanguageHandler['language']
    轉換為字元對象列表: LanguageHandler['轉換為字元對象列表']
  }) {
    this.轉換為字元對象列表 = 轉換為字元對象列表
    this.language = language
    this.extraSpecialChars = extraSpecialChars ?? []
  }

  public filterTextToPractice({
    charsToRemove,
    text,
  }: {
    charsToRemove: string[]
    text: string
  }) {
    const specialChars = this.取得特殊字符()
    const allCharsToRemove = charsToRemove.concat(specialChars)

    return text
      .split('')
      .filter(c => !!c)
      .filter(c => !allCharsToRemove.includes(c))
      .join('')
  }

  public getCurrentCharObj({
    originalCharsObjs,
    practiceCharsObjs,
  }: {
    originalCharsObjs: T_CharObj[]
    practiceCharsObjs: T_CharObj[]
  }) {
    const originalCharsWithPronunciationObjs = originalCharsObjs
      .map((ch, idx) => ({ ch, idx }))
      .filter(c => !!c.ch.pronunciation)
    const practiceCharsWithPronunciation = practiceCharsObjs.filter(
      c => !!c.pronunciation,
    )

    let originalCharIdx = 0

    for (
      let practiceIndex = 0;
      practiceIndex < practiceCharsWithPronunciation.length;
      practiceIndex += 1
    ) {
      originalCharIdx =
        practiceIndex % originalCharsWithPronunciationObjs.length

      const expectedCharObj =
        originalCharsWithPronunciationObjs[originalCharIdx]

      if (
        expectedCharObj.ch.word !==
        practiceCharsWithPronunciation[practiceIndex].word
      ) {
        return new CurrentCharObj({
          ch: expectedCharObj.ch,
          index: expectedCharObj.idx,
        })
      }
    }

    originalCharIdx =
      practiceCharsWithPronunciation.length %
      originalCharsWithPronunciationObjs.length

    if (!originalCharsWithPronunciationObjs.length) {
      return null
    }

    return new CurrentCharObj({
      ch: originalCharsWithPronunciationObjs[originalCharIdx].ch,
      index: originalCharsWithPronunciationObjs[originalCharIdx].idx,
    })
  }

  public getId() {
    return this.language.id
  }

  public getName() {
    return this.language.name
  }

  public 取得特殊字符() {
    return 特殊字元.concat(this.extraSpecialChars)
  }
}

export { LanguageHandler }
