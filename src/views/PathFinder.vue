<template>
  <div class="col-md-6 col-sm-10 mx-auto">
    <div>
      <img class="img-fluid rounded-15 mx-auto" src="@/assets/2704593_1.jpg">
      <h1 class="text-white pathfinder-page-header">Path Finder</h1>
      <h6 class="text-white">Not sure how to reach your destination?</h6>
      <h6 class="text-white">Shows you all potential routes between 2 planets!</h6>
    </div>
    <div class="row card rounded-15 shadow mx-auto my-5">
        <form @submit.prevent="searchRoutes" ref="searchForm" class="mx-auto mt-3 col-md-6 col-sm-8">
          <div>
            <label for="fromPlanet" class="form-label text-black text-bold">Where from:</label>
            <select v-model="fromPlanet" id="fromPlanet" class="form-select">
              <option class="display-none" selected :value="undefined">Select a planet</option>
              <option v-for="planet of planets"
                      v-bind:key="planet.name" v-bind:value="planet">{{ planet.name }}
              </option>
            </select>
          </div>
          <div class="mt-3">
            <label for="toPlanet" class="form-label text-black text-bold">Where to:</label>
            <select v-model="toPlanet" id="toPlanet" class="form-select">
              <option class="display-none" selected :value="undefined">Select a planet</option>
              <option v-for="planet of planets"
                      v-bind:key="planet.name" v-bind:value="planet">{{ planet.name }}
              </option>
            </select>
          </div>
          <div class="float-end my-3">
            <button type="submit" class="btn btn-primary mx-1"><i class="fa fa-search me-2"/> Find</button>
          </div>
        </form>
    </div>
    <div v-if="routeFindingComplete">
      <div class="border border-dark rounded-15 mb-3 p-3" v-for="(routes) of finishedRoutes"
           v-bind:key="routes.route">
        <div class="row justify-content-start">
          <h6 class="col-2 text-black" v-for="(route, routeIndex) of routes.route" v-bind:key="route.name">{{
              route.name
            }}
            <i v-if="routeIndex !== routes.route.length - 1" class="fa fa-arrow-right mx-auto"></i>
          </h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Vue } from 'vue-class-component'
import { planetList } from '@/types/PlanetList'
import { IDestinationPlanet } from '@/types/IDestinationPlanet'

export default class PathFinder extends Vue {
  private planets = planetList
  private routeFindingComplete = false

  private fromPlanet: IDestinationPlanet | undefined
  private toPlanet: IDestinationPlanet | undefined

  private finishedRoutes: PlanetRoute[] = []

  private searchRoutes (): void {
    if (!this.toPlanet || !this.fromPlanet) return
    this.routeFindingComplete = false
    this.finishedRoutes = []
    this.findRoutes(this.fromPlanet!, this.toPlanet!, { route: [] })
    this.routeFindingComplete = true
    this.finishedRoutes = this.finishedRoutes.sort((a, b) => a.route.length > b.route.length ? 1 : -1)
  }

  private findRoutes (fromPlanet: IDestinationPlanet, toPlanet: IDestinationPlanet, planetRoute: PlanetRoute = { route: [] }): void {
    if (planetRoute.route.map(p => p.name!).includes(fromPlanet.name!)) return

    planetRoute.route.push(fromPlanet)
    if (fromPlanet.name === toPlanet.name) {
      const newRoutes: PlanetRoute = PathFinder.copyObject(planetRoute)
      this.finishedRoutes.push(newRoutes)
      return
    }
    for (const route of fromPlanet.destinations!) {
      const newFromPlanet = this.planets.find(x => x.name === route)!
      const newRoutes: PlanetRoute = PathFinder.copyObject(planetRoute)
      this.findRoutes(newFromPlanet, toPlanet, newRoutes)
    }
  }

  private static copyObject<T> (object: T): T {
    return JSON.parse(JSON.stringify(object))
  }
}

interface PlanetRoute {
  route: IDestinationPlanet[];
}

</script>

<style scoped lang="css">
.pathfinder-page-header {
  margin-top: -3em !important;
}
</style>
