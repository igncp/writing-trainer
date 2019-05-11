import React, { useEffect, useState } from 'react'

import Button from '../../components/Button/Button'
import CharactersDisplay from '../../components/CharactersDisplay/CharactersDisplay'
import PanelBase from '../../components/PanelBase/PanelBase'
import TextArea from '../../components/TextArea/TextArea'

import LinksBlock from '../../languages/mandarin/LinksBlock/LinksBlock'
import OptionsBlock from '../../languages/mandarin/OptionsBlock/OptionsBlock'
import {
  convertToCharsObjs,
  getChineseCharsOnlyTextFn,
  getPronunciationOfText,
  handleDisplayedCharClick,
  SPECIAL_CHARS,
} from '../../languages/mandarin/utils'

import { getCurrentPracticeWord } from './panelHelpers'

const createInputSetterFn = (setValue: Function) => (e: any) => {
  setValue(e.target.value)
}
const createToggleFn = (val: any, fn: Function) => () => fn(!val)

const SHORTCUT_EDITING = 'control+control+shift'
const SHORTCUT_PRONUNCIATION = 'shift+shift+control'

const PRACTICE_TEXT_PLACEHOLDER = `Practice Text
Toggle Editing: ${SHORTCUT_EDITING}
Toggle Pronunciation: ${SHORTCUT_PRONUNCIATION}`

type TPanel = React.FC<{
  onHideRequest(): void
  pronunciation?: string
  text: string
}>

const Panel: TPanel = ({ onHideRequest, text, pronunciation }) => {
  const [originalTextValue, setOriginalText] = useState(text)
  const [pronunciationValue, setPronunciation] = useState('')
  const [specialCharsValue, setSpecialChars] = useState('')
  const [writingValue, setWriting] = useState('')
  const [practiceValue, setPractice] = useState('')
  const [isShowingPronunciation, setShowingPronunciation] = useState(true)
  const [isShowingEdition, setShowingEdition] = useState(true)
  const [doesPracticeHaveError, setPracticeHasError] = useState(false)
  const [lastThreeKeys, setLastThreeKeys] = useState([])
  const [languageOptions, setLanguageOptions] = useState({
    newTonesValue: 'without-tones',
  })

  const tryToUpdatePronunciation = (originalTextNewValue: string) => {
    const maybePronunciation = getPronunciationOfText({
      charsToRemove: specialCharsValue,
      text: originalTextNewValue,
    })
    if (maybePronunciation) {
      setPronunciation(maybePronunciation)
    }
  }

  const handleOriginalTextUpdate = (e: any) => {
    const val = e.target.value
    if (val) {
      tryToUpdatePronunciation(val)
    }
    setOriginalText(val)
  }

  useEffect(() => {
    if (!pronunciationValue && originalTextValue) {
      tryToUpdatePronunciation(originalTextValue)
    }
  }, [])

  useEffect(() => {
    const handleShortcuts = (e: any) => {
      const value = e.key
      const newArr = lastThreeKeys.slice(-2).concat([value])
      const currentResult = newArr.join('+').toLowerCase()

      if (currentResult === SHORTCUT_PRONUNCIATION) {
        setShowingPronunciation(!isShowingPronunciation)
      } else if (currentResult === SHORTCUT_EDITING) {
        setShowingEdition(!isShowingEdition)
      }

      setLastThreeKeys(newArr)
    }

    document.addEventListener('keydown', handleShortcuts)

    return () => {
      document.removeEventListener('keydown', handleShortcuts)
    }
  }, [lastThreeKeys, isShowingEdition, isShowingPronunciation])

  const charsObjs = convertToCharsObjs({
    charsToRemove: specialCharsValue + SPECIAL_CHARS,
    pronunciation: pronunciationValue,
    text: originalTextValue,
  })

  const clearValues = () => {
    // tslint:disable-next-line semicolon
    ;[
      setOriginalText,
      setPronunciation,
      setSpecialChars,
      setWriting,
      setPractice,
    ].forEach(fn => fn(''))
    setShowingPronunciation(true)
    setShowingEdition(true)
  }

  // @TODO: This should be specific to the language library (with some helpers)
  const handleWritingKeyDown = (e: any) => {
    if (e.key === 'Backspace' && writingValue.length === 0) {
      setPractice(practiceValue.slice(0, practiceValue.length - 1))
    }

    // special key
    if (e.key === '`') {
      e.preventDefault()
      setWriting('')
      setPracticeHasError(false)

      return
    }

    if (e.key === 'Enter') {
      setPractice(`${practiceValue}\n`)
    }

    // including capital letters so it doesn't write when shortcut
    if (!/[a-z0-9A-Z]/.test(e.key)) {
      e.preventDefault()

      setPractice(practiceValue + e.key)

      return
    }

    const currentPracticeWord = getCurrentPracticeWord({
      extractFn: getChineseCharsOnlyTextFn,
      origText: originalTextValue,
      practiceText: practiceValue,
      specialChars: specialCharsValue,
    })

    if (!currentPracticeWord) {
      setPracticeHasError(false)

      return
    }

    const currentCharObj = charsObjs.find(ch => ch.word === currentPracticeWord)

    if (!currentCharObj) {
      console.warn('missing char obj')
      setPracticeHasError(false)

      return
    }

    if (e.key.length !== 1 && e.key !== 'Backspace') {
      e.preventDefault()

      return
    }

    e.preventDefault()

    const { pronunciation: correctPronunciation } = currentCharObj

    const newWritingValue =
      e.key === 'Backspace'
        ? writingValue.slice(0, writingValue.length - 1)
        : writingValue + e.key
    const parsedCorrectPronunciation =
      languageOptions.newTonesValue === 'without-tones'
        ? correctPronunciation.replace(/[0-9]$/, '')
        : correctPronunciation

    if (parsedCorrectPronunciation === newWritingValue) {
      setWriting('')
      setPracticeHasError(false)
      setPractice(practiceValue + currentCharObj.word)

      return
    }

    setWriting(newWritingValue)

    setPracticeHasError(!correctPronunciation.startsWith(newWritingValue))
  }

  const handleLanguageOptionsChange = (opts: any) => {
    setLanguageOptions(opts)
  }

  return (
    <PanelBase onOverlayClick={onHideRequest}>
      <Button onClick={clearValues}>Clear</Button>
      <Button onClick={createToggleFn(isShowingEdition, setShowingEdition)}>
        Toggle Edition
      </Button>
      <Button
        onClick={createToggleFn(
          isShowingPronunciation,
          setShowingPronunciation
        )}
      >
        Toggle Pronunciation
      </Button>
      <Button onClick={onHideRequest} style={{ float: 'right' }}>
        Hide
      </Button>
      <div style={{ padding: '0 20px 20px 20px' }}>
        {isShowingEdition && (
          <div>
            <TextArea
              onChange={handleOriginalTextUpdate}
              placeholder="Original text"
              rows={3}
              value={originalTextValue}
            />
            <TextArea
              onChange={createInputSetterFn(setPronunciation)}
              placeholder="Pronunciation"
              rows={2}
              value={pronunciationValue}
            />
            <TextArea
              onChange={createInputSetterFn(setSpecialChars)}
              placeholder="Special characters"
              rows={1}
              value={specialCharsValue}
            />
            <OptionsBlock onOptionsChange={handleLanguageOptionsChange} />
          </div>
        )}{' '}
        <div>
          <div style={{ marginTop: 5, marginBottom: 10 }}>
            <CharactersDisplay
              charsObjs={charsObjs}
              onCharClick={handleDisplayedCharClick}
              shouldHidePronunciation={!isShowingPronunciation}
            />
          </div>
          <TextArea
            onChange={createInputSetterFn(setWriting)}
            placeholder={practiceValue ? '' : 'Writing area'}
            rows={1}
            onKeyDown={handleWritingKeyDown}
            value={writingValue}
            withoutCursor
          />
          <TextArea
            onChange={createInputSetterFn(setPractice)}
            placeholder={PRACTICE_TEXT_PLACEHOLDER}
            rows={4}
            value={practiceValue}
            style={{
              border: `1px solid ${doesPracticeHaveError ? 'red' : 'white'}`,
              fontSize: 26,
            }}
          />
        </div>
      </div>
      <LinksBlock text={originalTextValue} />
    </PanelBase>
  )
}

export default Panel
