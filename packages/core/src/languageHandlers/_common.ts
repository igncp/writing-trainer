import { LanguageDefinition } from '../constants'
import { CharObj, CurrentCharObj } from '../languageManager'

import { SPECIAL_SYMBOLS } from './_commonChars'

type T_convertToCharsObjs = (opts: {
  text: string
  charsToRemove: string[]
  langOpts?: { [k: string]: unknown }
}) => CharObj[]

class LanguageHandler {
  public readonly convertToCharsObjs: T_convertToCharsObjs
  private readonly language: LanguageDefinition

  public constructor({
    convertToCharsObjs,
    language,
  }: {
    convertToCharsObjs: LanguageHandler['convertToCharsObjs']
    language: LanguageHandler['language']
  }) {
    this.convertToCharsObjs = convertToCharsObjs
    this.language = language
  }

  public getId() {
    return this.language.id
  }

  public getName() {
    return this.language.name
  }

  public filterTextToPractice({
    text,
    charsToRemove,
  }: {
    text: string
    charsToRemove: string[]
  }) {
    const specialCharts = this.getSpecialChars()
    const allCharsToRemove = charsToRemove.concat(specialCharts)

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
    originalCharsObjs: CharObj[]
    practiceCharsObjs: CharObj[]
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

  public getSpecialChars() {
    return SPECIAL_SYMBOLS
  }
}

export { LanguageHandler }
