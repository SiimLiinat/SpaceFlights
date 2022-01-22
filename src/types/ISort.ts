export enum ISortEnum {
  company,
  price,
  travelLength,
  flightStart,
  flightEnd
}

export interface ISort {
  sortBy?: ISortEnum | null;
  ascending: boolean
}
