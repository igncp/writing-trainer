/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type AnkiGql = {
  __typename?: 'AnkiGQL';
  back: Scalars['String']['output'];
  correct: Scalars['Int']['output'];
  front: Scalars['String']['output'];
  id: Scalars['String']['output'];
  incorrect: Scalars['Int']['output'];
  language: Scalars['String']['output'];
};

export type CantoDictWordGql = {
  __typename?: 'CantoDictWordGQL';
  meaning: Scalars['String']['output'];
  word: Scalars['String']['output'];
};

export type DictResponse = {
  __typename?: 'DictResponse';
  words: Array<DictResponseItem>;
};

export type DictResponseItem = {
  __typename?: 'DictResponseItem';
  meaning: Scalars['String']['output'];
  word: Scalars['String']['output'];
};

export type HistoryMetric = {
  __typename?: 'HistoryMetric';
  allTime: Scalars['Float']['output'];
  today: Scalars['Float']['output'];
};

export type Me = {
  __typename?: 'Me';
  canUseAI: Scalars['Boolean']['output'];
  canUseCantodict: Scalars['Boolean']['output'];
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type MutationRoot = {
  __typename?: 'MutationRoot';
  clearStats: StatsClearGql;
  saveAnki: AnkiGql;
  saveReviewedAnki: AnkiGql;
  saveStats: StatsSaveResultGql;
  saveText: TextGql;
};

export type MutationRootClearStatsArgs = {
  lang: Scalars['String']['input'];
};

export type MutationRootSaveAnkiArgs = {
  back: Scalars['String']['input'];
  front: Scalars['String']['input'];
  id: Scalars['String']['input'];
  language: Scalars['String']['input'];
};

export type MutationRootSaveReviewedAnkiArgs = {
  guessed: Scalars['Boolean']['input'];
  id: Scalars['String']['input'];
};

export type MutationRootSaveStatsArgs = {
  localStats: Scalars['String']['input'];
};

export type MutationRootSaveTextArgs = {
  body: Scalars['String']['input'];
  id: Scalars['String']['input'];
  language: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  anki?: Maybe<AnkiGql>;
  ankis: Array<AnkiGql>;
  ankisRound: Array<AnkiGql>;
  ankisTotal: Scalars['Int']['output'];
  cantodictSentence: Array<CantoDictWordGql>;
  dictText: DictResponse;
  me: Me;
  song?: Maybe<SongGql>;
  songs: Array<SongGql>;
  songsTotal: Scalars['Int']['output'];
  texts: Array<TextGql>;
  translationRequest: Scalars['String']['output'];
};

export type QueryRootAnkiArgs = {
  id: Scalars['String']['input'];
};

export type QueryRootAnkisArgs = {
  itemsNum?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type QueryRootAnkisRoundArgs = {
  query?: InputMaybe<Scalars['String']['input']>;
};

export type QueryRootAnkisTotalArgs = {
  query?: InputMaybe<Scalars['String']['input']>;
};

export type QueryRootCantodictSentenceArgs = {
  sentence: Scalars['String']['input'];
};

export type QueryRootDictTextArgs = {
  content: Scalars['String']['input'];
  currentLanguage: Scalars['String']['input'];
};

export type QueryRootSongArgs = {
  id: Scalars['Int']['input'];
};

export type QueryRootSongsArgs = {
  itemsNum?: InputMaybe<Scalars['Int']['input']>;
  lang: Scalars['String']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type QueryRootSongsTotalArgs = {
  lang: Scalars['String']['input'];
  query?: InputMaybe<Scalars['String']['input']>;
};

export type QueryRootTranslationRequestArgs = {
  content: Scalars['String']['input'];
  currentLanguage: Scalars['String']['input'];
};

export type SongGql = {
  __typename?: 'SongGQL';
  artist: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  language: Scalars['String']['output'];
  lyrics: Scalars['String']['output'];
  pronunciation?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  videoUrl: Scalars['String']['output'];
};

export type StatsClearGql = {
  __typename?: 'StatsClearGQL';
  success: Scalars['Boolean']['output'];
};

export type StatsSaveResultDataGql = {
  __typename?: 'StatsSaveResultDataGQL';
  charsToday: Scalars['String']['output'];
  failCount: HistoryMetric;
  lang: Scalars['String']['output'];
  sentenceLength: HistoryMetric;
  sentencePercentage: HistoryMetric;
  sentencesCompleted: HistoryMetric;
  successCount: HistoryMetric;
  successPerc: HistoryMetric;
  uniqueCharsCount: HistoryMetric;
};

export type StatsSaveResultGql = {
  __typename?: 'StatsSaveResultGQL';
  data: StatsSaveResultDataGql;
  success: Scalars['Boolean']['output'];
};

export type TextGql = {
  __typename?: 'TextGQL';
  body: Scalars['String']['output'];
  id: Scalars['String']['output'];
  language: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};
