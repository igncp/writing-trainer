import { action } from '@storybook/addon-actions'
import { storiesOf, addDecorator } from '@storybook/react'
import * as React from 'react'

import mandarinHandler from 'writing-trainer-core/dist/languageHandlers/mandarin'
import englishHandler from 'writing-trainer-core/dist/languageHandlers/english'
import japaneseHandler from 'writing-trainer-core/dist/languageHandlers/japanese'

import languageUIManager from '#/languages/languageUIManager'

import Panel from '../Panel'

const mandarinLangOpts = {
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
}

addDecorator(fn => {
  languageUIManager.init()

  return <div>{fn()}</div>
})

storiesOf('Containers|Panel', module)
  .add('mandarin', () => {
    return (
      <Panel
        _stories={{
          defaultLanguage: mandarinHandler.id,
          langOpts: mandarinLangOpts,
        }}
        onHideRequest={action('hide-request')}
        text="崩比筆,壁必畢.閉編"
      />
    )
  })
  .add('mandarin, long text', () => {
    const text = Array.from({ length: 5 })
      .map(() => '崩比筆,壁必畢.閉編')
      .join('')

    return (
      <Panel
        _stories={{
          defaultLanguage: mandarinHandler.id,
          defaultPractice: text.slice(0, text.length - 5),
          langOpts: mandarinLangOpts,
        }}
        onHideRequest={action('hide-request')}
        text={text}
      />
    )
  })
  .add('japanese', () => {
    return (
      <Panel
        _stories={{
          defaultLanguage: japaneseHandler.id,
          defaultPronunciation: 'a i u e o',
        }}
        onHideRequest={action('hide-request')}
        text="あいうえお"
      />
    )
  })
  .add('english', () => {
    return (
      <Panel
        _stories={{ defaultLanguage: englishHandler.id }}
        onHideRequest={action('hide-request')}
        text="The feeling around the ground at that moment was distinct from the usual triumphalism. As the players lined up in an oddly formal crocodile to shake hands there was a feeling for the first time of a step into something else"
      />
    )
  })
