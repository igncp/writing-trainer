import { LanguageDefinition } from '#/core';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { useHover } from '../../utils/hooks';
import {
  COMP_TRANSITION,
  DIM_COMP_OPACITY,
  HOVERED_COMP_OPACITY,
} from '../../utils/ui';

type Props = {
  languages: Array<{ id: LanguageDefinition['id']; name: string }>;
  onOptionsChange: (id: string) => void;
  selectedLanguage: LanguageDefinition['id'];
};

const ChooseLanguage = ({
  languages,
  onOptionsChange,
  selectedLanguage,
}: Props) => {
  const { bind, hovered } = useHover();
  const { t } = useTranslation();

  const handleOptionChange = (事件: ChangeEvent<HTMLSelectElement>) => {
    onOptionsChange(事件.target.value);
  };

  const languageNames: Record<string, string | undefined> = {
    cantonese: t('lang.cantonese'),
    english: t('lang.english'),
    japanese: t('lang.japanese'),
    mandarin: t('lang.mandarin'),
  };

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
      {languages.map((languageDefinition) => (
        <option key={languageDefinition.id} value={languageDefinition.id}>
          {languageNames[languageDefinition.id] ?? languageDefinition.name}
        </option>
      ))}
    </select>
  );
};

export default ChooseLanguage;
