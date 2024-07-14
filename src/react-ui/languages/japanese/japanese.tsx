import { japaneseHandler } from '#/core'

import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils'
import { T_LangUIController, T_LangOpts } from '../types'

import LinksBlock from './LinksBlock/LinksBlock'
import OptionsBlock from './OptionsBlock/OptionsBlock'

const handleKeyDown: T_LangUIController['handleKeyDown'] = params => {
  commonHandleWritingKeyDown(params, {})
}

const charToPronunciationMap: { [key: string]: string } = {}
const pronunciationToCharMap: { [key: string]: string } = {}

const langOpts: T_LangOpts = {
  dictionary: charToPronunciationMap,
}

const loadDictionary = async () => {
  if (Object.keys(charToPronunciationMap).length) {
    return
  }

  const dictionary = (await import('./list.csv')).default

  const dictionaryParsed = dictionary.reduce<
    Record<string, [string] | undefined>
  >((acc, item) => {
    const [char, pronunciation] = item

    if (!char || !pronunciation) {
      return acc
    }

    acc[char] = [pronunciation]

    return acc
  }, {})

  Object.keys(dictionaryParsed).forEach(char => {
    const item = dictionaryParsed[char]

    if (!item) return

    charToPronunciationMap[char] = item[0]
    pronunciationToCharMap[item[0]] = char
  })
}

const languageUIController: T_LangUIController = {
  getLangOpts: () => langOpts,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  handleKeyDown,
  languageHandler: japaneseHandler,
  loadDictionary,
  saveLangOptss: () => {},
  shouldAllCharsHaveSameWidth: false,
}

export default languageUIController
