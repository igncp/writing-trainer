import { AnkiGql, Me, TextGql } from '../graphql/graphql'

const baseURL =
  process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:9000'
const clientID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string

const fetchCommon = (uri: string, options?: RequestInit) =>
  fetch(baseURL + uri, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })
    .then(r => {
      if (!r.ok) {
        throw new Error(r.statusText)
      }

      return r
    })
    .then(res => res.json())

const fetchGraphQL = <A>(query: string) =>
  fetchCommon('/graphql', {
    body: JSON.stringify({ query }),
    method: 'POST',
  }).then(res => {
    if (res.errors) {
      throw new Error(res.errors[0].message)
    }

    return res.data as A
  })

const getGoogleUrl = (from: string) => {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`

  const options = {
    access_type: 'offline',
    client_id: clientID,
    flowName: 'GeneralOAuthFlow',
    redirect_uri: `${baseURL.includes('http') ? baseURL : window.location.href.replace(/\/$/, '') + baseURL}/sessions/oauth/google`,
    response_type: 'code',
    scope: ['https://www.googleapis.com/auth/userinfo.email'].join(' '),
    state: from.replace(/\/$/g, ''),
  }

  const qs = new URLSearchParams(options)

  return `${rootUrl}?${qs.toString()}`
}

const decodeAnki = <T extends Partial<AnkiGql>>(anki: T): T => ({
  ...anki,
  ...('back' in anki && anki.back && { back: decodeURIComponent(anki.back) }),
  ...('front' in anki &&
    anki.front && { front: decodeURIComponent(anki.front) }),
})

const getHealth = () => fetchCommon('/health')

const login = () => (window.location.href = getGoogleUrl(window.location.href))

const getInfo = () =>
  fetchGraphQL<{ me: Me }>(`#graphql
    query {
      me {
        id
        email
        canUseAI
      }
    }
  `).then(({ me }) => me)

const TextFragment = `
  fragment TextFragment on TextGQL {
    body
    id
    language
    title
  }
`

const getUserAnkis = (items: number, offset: number, query: string) =>
  fetchGraphQL<{
    ankis: Array<
      Pick<AnkiGql, 'id' | 'front' | 'language' | 'correct' | 'incorrect'>
    >
    ankisTotal: number
  }>(`#graphql
    query {
      ankis(
        itemsNum: ${items},
        offset: ${offset}
        query: ${query ? `"${query}"` : null}
      ) {
        correct
        front
        id
        incorrect
        language
      }
      ankisTotal(
        query: ${query ? `"${query}"` : null}
      )
    }
  `).then(({ ankis, ankisTotal }) => ({
    list: ankis.map(decodeAnki),
    total: ankisTotal,
  }))

const getAnkisRound = (query: string) =>
  fetchGraphQL<{
    ankisRound: Array<Pick<AnkiGql, 'id' | 'front' | 'back'>>
  }>(`#graphql
    query {
      ankisRound(
        query: ${query ? `"${query}"` : null}
      ) {
        id
        front
        back
      }
    }
  `).then(({ ankisRound }) => ankisRound.map(decodeAnki))

const getUserTexts = () =>
  fetchGraphQL<{ texts: TextGql[] }>(`#graphql
    query {
      texts {
        ...TextFragment
      }
    }
    ${TextFragment}
  `).then(({ texts }) => texts)

const translateText = (content: string, currentLanguage: string) => {
  return fetchGraphQL<{ translationRequest: string }>(`#graphql
    query {
      translationRequest(
        content: "${content}",
        currentLanguage: "${currentLanguage}"
      )
    }
  `).then(({ translationRequest }) => translationRequest)
}

const saveAnki = (anki: Pick<AnkiGql, 'front' | 'id' | 'back' | 'language'>) =>
  fetchGraphQL<{ saveAnki: { id: string } }>(`#graphql
    mutation {
      saveAnki(
        id: "${anki.id}",
        front: "${encodeURIComponent(anki.front)}",
        language: "${anki.language}",
        back: "${encodeURIComponent(anki.back)}"
      ) {
        id
      }
    }
  `).then(({ saveAnki: saveAnkiResult }) => saveAnkiResult)

const saveReviewedAnki = (anki: { guessed: boolean; id: string }) =>
  fetchGraphQL<{ saveReviewedAnki: { id: string } }>(`#graphql
    mutation {
      saveReviewedAnki(
        guessed: ${anki.guessed},
        id: "${anki.id}"
      ) {
        id
      }
    }
  `).then(
    ({ saveReviewedAnki: saveReviewedAnkiResult }) => saveReviewedAnkiResult,
  )

const saveText = (text: TextGql) =>
  fetchGraphQL<{ saveText: { id: string } }>(`#graphql
    mutation {
      saveText(
        id: "${text.id}",
        body: "${encodeURIComponent(text.body)}",
        language: "${text.language}",
        title: "${encodeURIComponent(text.title ?? '')}"
      ) {
        id
      }
    }
  `).then(({ saveText: saveTextResult }) => saveTextResult)

const logout = () => fetchCommon('/auth/logout')

export const backendClient = {
  getAnkisRound,
  getHealth,
  getInfo,
  getUserAnkis,
  getUserTexts,
  login,
  logout,
  saveAnki,
  saveReviewedAnki,
  saveText,
  translateText,
}
