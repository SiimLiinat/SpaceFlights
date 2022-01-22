import { IDestinationPlanet } from '@/types/IDestinationPlanet'

const mercury: IDestinationPlanet = { name: 'Mercury', destinations: null }
const venus: IDestinationPlanet = { name: 'Venus', destinations: null }
const earth: IDestinationPlanet = { name: 'Earth', destinations: null }
const mars: IDestinationPlanet = { name: 'Mars', destinations: null }
const jupiter: IDestinationPlanet = { name: 'Jupiter', destinations: null }
const saturn: IDestinationPlanet = { name: 'Saturn', destinations: null }
const uranus: IDestinationPlanet = { name: 'Uranus', destinations: null }
const neptune: IDestinationPlanet = { name: 'Neptune', destinations: null }

mercury.destinations = ['Venus']
venus.destinations = ['Mercury', 'Earth']
earth.destinations = ['Uranus', 'Jupiter']
mars.destinations = ['Venus']
jupiter.destinations = ['Mars', 'Venus']
saturn.destinations = ['Earth', 'Neptune']
uranus.destinations = ['Saturn', 'Neptune']
neptune.destinations = ['Mercury', 'Uranus']

export const planetList = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune]
