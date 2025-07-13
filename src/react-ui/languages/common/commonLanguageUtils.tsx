import { handle_keydown } from 'writing-trainer-wasm/writing_trainer_wasm';

import { T_LangUIController } from '../types';
import { saveFailChar, saveSentenceStats, saveSuccessChar } from './stats';

export const commonHandleWritingKeyDown: T_LangUIController['handleKeyDown'] =
  ({ 按鍵事件, langOpts, languagesList, setPanel }) => {
    const selectedLanguage = languagesList.get_language_id();

    const keyDownResult = handle_keydown(languagesList, 按鍵事件.key, {
      gameModeValue: langOpts?.gameModeValue,
      tonesHandling: langOpts?.tonesHandling,
    });

    if (!keyDownResult || !selectedLanguage) return;

    const {
      last_char,
      last_sentence_length,
      last_sentence_ratio,
      prevent_default,
      save_stat,
    } = keyDownResult;

    if (prevent_default) {
      按鍵事件.preventDefault();
    }

    const currentCharObj = languagesList.get_current_char_obj();

    setPanel((prev) => ({
      ...prev,
      override: languagesList.get_override_text() ?? '',
      practice: languagesList.get_practice() ?? '',
      practiceError: languagesList.get_practice_has_error(),
      writing: languagesList.get_writing() ?? '',
      ...(typeof currentCharObj?.index === 'number'
        ? {
            currentDisplayCharIdx: currentCharObj.index,
          }
        : {}),
    }));

    if (last_char) {
      if (save_stat.includes('success_char'))
        saveSuccessChar(selectedLanguage, last_char);

      if (save_stat.includes('fail_char'))
        saveFailChar(selectedLanguage, last_char);

      if (save_stat.includes('success_sentence')) {
        void saveSentenceStats(
          selectedLanguage,
          last_sentence_length,
          last_sentence_ratio,
        );
      }
    }
  };
