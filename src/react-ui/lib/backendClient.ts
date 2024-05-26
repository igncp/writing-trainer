import { AnkiGql, Me, TextGql } from '../graphql/graphql'

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:9000'
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
    redirect_uri: `${baseURL}/sessions/oauth/google`,
    response_type: 'code',
    scope: ['https://www.googleapis.com/auth/userinfo.email'].join(' '),
    state: from.replace(/\/$/g, ''),
  }

  const qs = new URLSearchParams(options)

  return `${rootUrl}?${qs.toString()}`
}

const getHealth = () => fetchCommon('/health')

const login = () => (window.location.href = getGoogleUrl(window.location.href))

const getInfo = () =>
  fetchGraphQL<{ me: Me }>(`#graphql
    query {
      me {
        id
        email
      }
    }
  `).then(({ me }) => me)

const AnkiFragment = `
  fragment AnkiFragment on AnkiGQL {
    back
    front
    id
    language
  }
`

const TextFragment = `
  fragment TextFragment on TextGQL {
    body
    id
    language
    title
  }
`

const getUserAnkis = () =>
  fetchGraphQL<{ ankis: AnkiGql[] }>(`#graphql
    query {
      ankis {
        ...AnkiFragment
      }
    }
    ${AnkiFragment}
  `).then(({ ankis }) => ankis)

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

const saveAnki = (anki: AnkiGql) =>
  fetchGraphQL<{ saveAnki: { id: string } }>(`#graphql
    mutation {
      saveAnki(
        id: "${anki.id}",
        front: "${anki.front}",
        language: "${anki.language}",
        back: "${anki.back}"
      ) {
        id
      }
    }
  `).then(({ saveAnki: saveAnkiResult }) => saveAnkiResult)

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
  getHealth,
  getInfo,
  getUserAnkis,
  getUserTexts,
  login,
  logout,
  saveAnki,
  saveText,
  translateText,
}
