import React from 'react'
import {
  LanguageManager,
  englishHandler,
  japaneseHandler,
  mandarinHandler,
} from 'writing-trainer-core'

import { dummyServices } from '../../../__stories__/storybookHelpers'
import { uiHandlers } from '../../../languages/handlers'
import { LanguageUIManager } from '../../../languages/languageUIManager'
import Panel from '../Panel'

const languageManager = new LanguageManager()
const languageUIManager = new LanguageUIManager(languageManager, uiHandlers)

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
      text="崩比筆,壁必畢.閉編"
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
    (Story: React.FC) => {
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

export { Mandarin, MandarinLongText, Japanese, English }
