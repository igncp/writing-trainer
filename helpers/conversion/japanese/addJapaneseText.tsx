import fs from 'fs'
import path from 'path'

import { charToPronunciationMap } from '#/languages/japanese/japaneseUtils'

import textFileContent from '../untrackedText.txt'

const argv = process.argv
const groups = textFileContent.split('+')

if (groups.length !== 2) {
  throw new Error('Unexpected number of groups')
}

const chars = groups[0]
  .split('')
  .map(t => t.trim())
  .filter(t => !!t)
const pronunciations = groups[1]
  .split(' ')
  .map(t => t.trim())
  .filter(t => !!t)

if (chars.length !== pronunciations.length) {
  throw new Error('Unexpected groups lengths')
}

const result = chars.reduce((acc, ch, idx) => {
  return {
    ...acc,
    [ch]: pronunciations[idx],
  }
}, charToPronunciationMap)

// @TODO: Sort by value
const text = Object.keys(result)
  .sort()
  .map(k => `${k},${result[k]}`)
  .join(
    `
`
  )
  .replace(/ō/g, 'o')

const filePath = path.resolve(
  __dirname,
  '../../../../src/frontend/languages/japanese/converted-list-jp.csv'
)

if (argv[2] === 'y') {
  fs.writeFileSync(filePath, text)
  console.log(`Written to: ${filePath}`)
} else {
  console.log(text)
  console.log('')
  console.log(
    'Not writing to the file. You must pass "y" as the first argument.'
  )
}
