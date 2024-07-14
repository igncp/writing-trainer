import { LanguageDefinition } from '../constants'
import { T_CharObj, CurrentCharObj } from '../languageManager'

import { specialChars } from './_特殊字元'

type 類型_轉換為字元對象列表 = (opts: {
  charsToRemove: string[]
  langOpts?: { [k: string]: unknown }
  text: string
}) => T_CharObj[]

class LanguageHandler {
  public readonly convertToCharsObjs: 類型_轉換為字元對象列表
  private readonly extraSpecialChars: string[]
  private readonly language: LanguageDefinition

  public constructor({
    convertToCharsObjs,
    extraSpecialChars,
    language,
  }: {
    convertToCharsObjs: LanguageHandler['convertToCharsObjs']
    extraSpecialChars?: string[]
    language: LanguageHandler['language']
  }) {
    this.convertToCharsObjs = convertToCharsObjs
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
    const specialCharsList = this.getSpecialChars()
    const allCharsToRemove = charsToRemove.concat(specialCharsList)

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

  public getSpecialChars() {
    return specialChars.concat(this.extraSpecialChars)
  }
}

export { LanguageHandler }
