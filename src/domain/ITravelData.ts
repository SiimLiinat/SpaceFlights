import { ILeg } from '@/domain/ILeg'

export interface ITravelData {
  id: string;
  validUntil: string;
  legs: ILeg[] | null;
}
