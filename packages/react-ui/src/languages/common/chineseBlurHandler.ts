import { T_UIHandler } from '../types'

export const chineseBlurHandler: T_UIHandler['onBlur'] = ({
  fragmentsList,
  languageOptions,
}) => {
  if (languageOptions.autoSplitLines) {
    const splitChars = new Set(['。', '？', '！', '；', '，'])
    const splitLength = 20
    const newList = fragmentsList
      .map(l => {
        if (l.startsWith('原文網址: ')) {
          return []
        }

        if (l.length <= splitLength) {
          return [l]
        }

        const lines: string[] = []

        let currentLine = l.slice(0, splitLength)
        let currentCharNum = splitLength

        while (currentCharNum < l.length) {
          currentLine += l[currentCharNum]

          if (splitChars.has(l[currentCharNum])) {
            lines.push(currentLine)

            currentLine = ''
          }

          currentCharNum++
        }

        if (currentLine.length > 0) {
          lines.push(currentLine)
        }

        return lines
      })
      .flat()
      .map(l => l.trim())
      .filter(Boolean)

    return { newFragmentsList: newList }
  }

  return { newFragmentsList: undefined }
}
