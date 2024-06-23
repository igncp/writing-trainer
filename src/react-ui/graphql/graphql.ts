/* eslint-disable */
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

export type AnkiGql = {
  __typename?: 'AnkiGQL'
  back: Scalars['String']['output']
  correct: Scalars['Int']['output']
  front: Scalars['String']['output']
  id: Scalars['String']['output']
  incorrect: Scalars['Int']['output']
  language: Scalars['String']['output']
}

export type Me = {
  __typename?: 'Me'
  canUseAI: Scalars['Boolean']['output']
  email: Scalars['String']['output']
  id: Scalars['String']['output']
}

export type MutationRoot = {
  __typename?: 'MutationRoot'
  saveAnki: AnkiGql
  saveReviewedAnki: AnkiGql
  saveText: TextGql
}

export type MutationRootSaveAnkiArgs = {
  back: Scalars['String']['input']
  front: Scalars['String']['input']
  id: Scalars['String']['input']
  language: Scalars['String']['input']
}

export type MutationRootSaveReviewedAnkiArgs = {
  guessed: Scalars['Boolean']['input']
  id: Scalars['String']['input']
}

export type MutationRootSaveTextArgs = {
  body: Scalars['String']['input']
  id: Scalars['String']['input']
  language: Scalars['String']['input']
  title?: InputMaybe<Scalars['String']['input']>
  url?: InputMaybe<Scalars['String']['input']>
}

export type QueryRoot = {
  __typename?: 'QueryRoot'
  ankis: Array<AnkiGql>
  ankisRound: Array<AnkiGql>
  ankisTotal: Scalars['Int']['output']
  me: Me
  texts: Array<TextGql>
  translationRequest: Scalars['String']['output']
}

export type QueryRootAnkisArgs = {
  itemsNum?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  query?: InputMaybe<Scalars['String']['input']>
}

export type QueryRootAnkisRoundArgs = {
  query?: InputMaybe<Scalars['String']['input']>
}

export type QueryRootAnkisTotalArgs = {
  query?: InputMaybe<Scalars['String']['input']>
}

export type QueryRootTranslationRequestArgs = {
  content: Scalars['String']['input']
  currentLanguage: Scalars['String']['input']
}

export type TextGql = {
  __typename?: 'TextGQL'
  body: Scalars['String']['output']
  id: Scalars['String']['output']
  language: Scalars['String']['output']
  title?: Maybe<Scalars['String']['output']>
  url?: Maybe<Scalars['String']['output']>
}
