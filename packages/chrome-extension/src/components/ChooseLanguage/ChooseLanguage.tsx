import React from 'react'
import { constants } from 'writing-trainer-core'

import { useHover } from '#/utils/hooks'
import {
  COMP_TRANSITION,
  DIM_COMP_OPACITY,
  HOVERED_COMP_OPACITY,
} from '#/utils/ui'

type T_ChooseLanguage = React.FC<{
  languages: constants.T_LanguageDefinition[]
  onOptionsChange(id: string): void
  selectedLanguage: constants.T_LanguageDefinition['id']
}>

const ChooseLanguage: T_ChooseLanguage = ({
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
            {languageDefinition.name}
          </option>
        )
      })}
    </select>
  )
}

export default ChooseLanguage
