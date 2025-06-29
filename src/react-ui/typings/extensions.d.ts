declare module '*.csv' {
  const list: string[][];

  export default list;
}

declare module '*.yml' {
  const list: unknown;

  export default list;
}

declare module '*.txt' {
  const value: string;

  export default value;
}
