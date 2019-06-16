import fs from 'fs'
import path from 'path'

import {
  charToPronunciationMap,
  SPECIAL_CHARS,
} from '#/languages/japanese/japaneseUtils'

import textFileContent from '../untrackedText.txt'

const chars: Set<string> = new Set()

textFileContent.split('').forEach(ch => {
  if (
    !ch.trim() ||
    SPECIAL_CHARS.indexOf(ch) !== -1 ||
    charToPronunciationMap[ch]
  ) {
    return
  }

  chars.add(ch)
})

const resultChars = Array.from(chars)
  .sort()
  .join('')

console.log(resultChars)

const textFilePath = path.resolve(__dirname, '../../untrackedText.txt')

fs.writeFileSync(textFilePath, `${resultChars}+`)
console.log(`Written to: ${textFilePath}`)
