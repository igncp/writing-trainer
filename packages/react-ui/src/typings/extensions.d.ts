declare module '*.csv' {
  const list: string[][]

  export default list
}

declare module '*.txt' {
  const value: string

  export default value
}

declare let __USE_CHROME_TABS_FEATURE__: boolean
declare let __TEST__: boolean

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const chrome: any
