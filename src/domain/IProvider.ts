import { ICompany } from '@/domain/ICompany'

export interface IProvider {
  id: string;
  company: ICompany;
  price: number;
  flightStart: string;
  flightEnd: string;

  travelLength: number | undefined;
}
