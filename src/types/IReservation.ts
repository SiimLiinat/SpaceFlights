export interface IReservation {
  firstName: string,
  lastName: string,
  routeStart: string,
  routeEnd: string,
  price: number,
  companyName: string,
  flightStart: string,
  flightEnd: string,

  validUntil: string | null
  travelDataId: string
}
