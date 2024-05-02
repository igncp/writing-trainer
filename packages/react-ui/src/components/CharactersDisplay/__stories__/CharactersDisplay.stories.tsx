import React from 'react'
import { mandarinHandler, englishHandler } from 'writing-trainer-core'

import CharactersDisplay from '../CharactersDisplay'

const charsObjsMandarin = mandarinHandler.轉換為字元對象列表({
  charsToRemove: [',', '.'],
  text: '崩比筆,壁必畢.閉編',
  語言選項: {
    dictionary: {
      壁: 'bi4',
      崩: 'beng1',
      必: 'bi4',
      比: 'bi3',
      畢: 'bi4',
      筆: 'bi3',
      編: 'bian1',
      閉: 'bi4',
    },
  },
})

const commonProps = {
  字元對象列表: charsObjsMandarin,
  按一下該符號: () => console.log('on-click'),
}

const charObjsEnglish = englishHandler.轉換為字元對象列表({
  charsToRemove: [],
  text: 'Sample of English text',
})

const Common = () => {
  return <CharactersDisplay {...commonProps} 應該隱藏發音={false} />
}

const WithoutPronunciation = () => {
  return <CharactersDisplay {...commonProps} 應該隱藏發音 />
}

const DifferentWidthsNoPronunciation = () => {
  return (
    <CharactersDisplay
      {...commonProps}
      字元對象列表={charObjsEnglish}
      應該有不同的寬度
      應該隱藏發音
    />
  )
}

export default {
  title: 'Components/CharactersDisplay',
}

export { Common, DifferentWidthsNoPronunciation, WithoutPronunciation }
