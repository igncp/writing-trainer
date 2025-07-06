export interface T_Storage {
  getValue: (key: string) => Promise<string>;
  setValue: (key: string, value: string) => void;
}
