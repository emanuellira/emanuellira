//[# version: 6.4.3 #]

export interface IKeyPair {
  key: string;
  value: string;
}

export interface IListKeyPair {
  list: Array<IKeyPair>;
}

export interface IDictionary_Number {
  [index: number]: Function;
}
export interface IDictionary_String {
  [index: string]: Function;
}
