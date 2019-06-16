declare module '*.csv' {
  declare const list: Array<Array<string>>

  export default list
}

declare module '*.txt' {
  declare const value: string

  export default value
}

declare var __USE_CHROME_API__: boolean
