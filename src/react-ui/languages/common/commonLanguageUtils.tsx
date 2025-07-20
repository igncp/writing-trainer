import { handle_keydown } from 'writing-trainer-wasm/writing_trainer_wasm';

import { T_LangUIController } from '../types';
import { saveFailChar, saveSentenceStats, saveSuccessChar } from './stats';

export const commonHandleWritingKeyDown: T_LangUIController['handleKeyDown'] =
  ({ 按鍵事件, langOpts, language }) => {
    const keyDownResult = handle_keydown(language, 按鍵事件.key, {
      gameModeValue: langOpts?.gameModeValue,
      tonesHandling: langOpts?.tonesHandling,
    });

    const selectedLanguage = language.id;

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
