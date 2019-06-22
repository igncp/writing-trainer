import React from 'react'

import { TLanguageDefinition } from '#/languages/types'
import { useHover } from '#/utils/hooks'
import {
  COMP_TRANSITION,
  DIM_COMP_OPACITY,
  HOVERED_COMP_OPACITY,
} from '#/utils/ui'

type TChooseLanguage = React.FC<{
  languages: TLanguageDefinition[]
  onOptionsChange(id: string): void
  selectedLanguage: TLanguageDefinition['id']
}>

const ChooseLanguage: TChooseLanguage = ({
  languages,
  onOptionsChange,
  selectedLanguage,
}) => {
  const { hovered, bind } = useHover()
  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onOptionsChange(e.target.value)
  }

  return (
    <select
      onChange={handleOptionChange}
      style={{
        opacity: hovered ? HOVERED_COMP_OPACITY : DIM_COMP_OPACITY,
        transition: COMP_TRANSITION,
      }}
      value={selectedLanguage}
      {...bind}
    >
      {languages.map(languageDefinition => {
        return (
          <option key={languageDefinition.id} value={languageDefinition.id}>
            {languageDefinition.text}
          </option>
        )
      })}
    </select>
  )
}

export default ChooseLanguage
