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
  private readonly extraSpecialChars: string[]

  public constructor({
    convertToCharsObjs,
    extraSpecialChars,
    language,
  }: {
    convertToCharsObjs: LanguageHandler['convertToCharsObjs']
    language: LanguageHandler['language']
    extraSpecialChars?: string[]
  }) {
    this.convertToCharsObjs = convertToCharsObjs
    this.language = language
    this.extraSpecialChars = extraSpecialChars ?? []
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
    const specialChars = this.getSpecialChars()
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
    return SPECIAL_SYMBOLS.concat(this.extraSpecialChars)
  }
}

export { LanguageHandler }
