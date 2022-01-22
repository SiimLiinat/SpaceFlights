import { IRouteInfo } from '@/domain/IRouteInfo'
import { IProvider } from '@/domain/IProvider'

export interface ILeg {
  id: string;
  routeInfo: IRouteInfo;
  providers: IProvider[] | null;
}
