import { IPlanet } from '@/domain/IPlanet'

export interface IRouteInfo {
  id: string;
  from: IPlanet;
  to: IPlanet;
  distance: number;
}
