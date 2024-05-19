import {
  LanguageManager,
  cantoneseHandler,
  englishHandler,
  japaneseHandler,
  mandarinHandler,
} from '#/core'
import { FC } from 'react'

import { dummyServices } from '../../../__stories__/storybookHelpers'
import { 語言UI處理程序清單 } from '../../../languages/handlers'
import { LanguageUIManager } from '../../../languages/languageUIManager'
import Panel from '../Panel'

const languageManager = new LanguageManager()
const languageUIManager = new LanguageUIManager(
  languageManager,
  語言UI處理程序清單,
)

const initialText = '崩比筆,壁必畢.閉編'

const Mandarin = () => {
  return (
    <Panel
      _stories={{
        defaultLanguage: mandarinHandler.getId(),
      }}
      languageManager={languageManager}
      languageUIManager={languageUIManager}
      onHideRequest={() => console.log('hide-request')}
      services={dummyServices}
      text={initialText}
    />
  )
}

const MandarinLongText = () => {
  const text = Array.from({ length: 5 })
    .map(() => '崩比筆,壁必畢.閉編')
    .join('')

  return (
    <Panel
      _stories={{
        defaultLanguage: mandarinHandler.getId(),
        defaultPractice: text.slice(0, text.length - 5),
      }}
      languageManager={languageManager}
      languageUIManager={languageUIManager}
      onHideRequest={() => console.log('hide-request')}
      services={dummyServices}
      text={text}
    />
  )
}

const Japanese = () => {
  return (
    <Panel
      _stories={{
        defaultLanguage: japaneseHandler.getId(),
        defaultPronunciation: 'a i u e o',
      }}
      languageManager={languageManager}
      languageUIManager={languageUIManager}
      onHideRequest={() => console.log('hide-request')}
      services={dummyServices}
      text="あいうえお"
    />
  )
}

const Cantonese = () => {
  return (
    <Panel
      _stories={{
        defaultLanguage: cantoneseHandler.getId(),
        defaultPronunciation: '',
      }}
      languageManager={languageManager}
      languageUIManager={languageUIManager}
      onHideRequest={() => console.log('hide-request')}
      services={dummyServices}
      text={initialText}
    />
  )
}

const English = () => {
  return (
    <Panel
      _stories={{ defaultLanguage: englishHandler.getId() }}
      languageManager={languageManager}
      languageUIManager={languageUIManager}
      onHideRequest={() => console.log('hide-request')}
      services={dummyServices}
      text="Sample of English text"
    />
  )
}

export default {
  decorators: [
    (Story: FC) => {
      languageUIManager.init()

      return (
        <div>
          <Story />
        </div>
      )
    },
  ],
  title: 'Containers/Panel',
}

export { Cantonese, English, Japanese, Mandarin, MandarinLongText }
