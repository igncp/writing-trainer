import { KeyboardEvent, ReactNode } from 'react';
import {
  CharObj,
  CurrentCharObj,
  GameModes,
  LanguagesList,
} from 'writing-trainer-wasm/writing_trainer_wasm';

const gameModes: GameModes | null =
  typeof window !== 'undefined' ? new GameModes() : null;

type T_Fragments = { index: number; list: string[] };

type T_LangOpts = { [k: string]: unknown };

type T_LinksBlock = (選項: {
  文字: string;
  children?: ReactNode;
  focusWritingArea: () => void;
  fragments: T_Fragments;
  langOptsObj: Record<string, unknown>;
  languagesList: LanguagesList;
  updateFragments: (list: T_Fragments) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateLangOpts: (...args: any[]) => void;
}) => ReactNode;

type T_GetToneColor = (
  char: 'current-error' | 'current' | 'other',
  選項: T_LangOpts,
  字元: CharObj | null,
) => string | undefined;

type T_OptionsBlock = (props: {
  langOpts: T_LangOpts;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateLangOpts: (...args: any[]) => void;
}) => ReactNode;

type T_getCurrentCharObjFromPractice = (t?: string) => CurrentCharObj | null;

type PanelState = {
  currentDisplayCharIdx: number;
  override: string;
  practice: string;
  practiceError: boolean;
  pronunciation: string;
  writing: string;
};

type T_HandleKeyDown = (opts: {
  按鍵事件: KeyboardEvent<HTMLTextAreaElement>;
  langOpts: T_LangOpts;
  languagesList: LanguagesList;
  setPanel: (state: ((s: PanelState) => PanelState) | PanelState) => void;
}) => void;

type T_BlurHandlerOpts = {
  fragmentsList: string[];
  langOpts: T_LangOpts;
};

type T_BlurHandler = (opts: T_BlurHandlerOpts) => {
  newFragmentsList: string[] | undefined;
};

export interface T_LangUIController {
  getLangOpts: () => T_LangOpts;
  getLinksBlock: () => T_LinksBlock;
  getOptionsBlock: () => T_OptionsBlock;
  getToneColor?: T_GetToneColor;
  handleClearEvent?: (處理程序: T_LangUIController) => void;
  handleKeyDown: T_HandleKeyDown;
  loadDictionary: () => Promise<Array<[string, string]> | undefined>;
  onBlur?: T_BlurHandler;
  saveLangOptss: (o: T_LangOpts) => void;
  shouldAllCharsHaveSameWidth: boolean;
}

export {
  gameModes,
  type PanelState,
  type T_Fragments,
  type T_getCurrentCharObjFromPractice,
  type T_GetToneColor,
  type T_LangOpts,
  type T_LinksBlock,
  type T_OptionsBlock,
};
