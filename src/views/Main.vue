<template>
  <div class="col-md-6 col-sm-10 mx-auto">
    <div>
      <img class="img-fluid rounded-15" src="@/assets/2704593_3.jpg">
      <h1 class="text-white main-header">Space Flights</h1>
    </div>
    <div v-if="!loading" class="card rounded-15 shadow my-5">
      <form @submit.prevent="searchData" ref="searchForm" class="mx-auto mt-3 col-md-6">
        <div>
          <label for="fromPlanet" class="form-label text-black text-bold">Where from:</label>
          <select @change="filterDestinationPlanets" v-model="departurePlanet" id="fromPlanet" class="form-select">
            <option class="display-none" selected :value="undefined">Select a planet</option>
            <option v-for="planet of departurePlanets"
                    v-bind:key="planet.name" v-bind:value="planet">{{ planet.name }}
            </option>
          </select>
        </div>
        <div class="mt-3">
          <label for="toPlanet" class="form-label text-black text-bold">Where to:</label>
          <select @change="filterDeparturePlanets" v-model="destinationPlanet" id="toPlanet" class="form-select">
            <option class="display-none" selected :value="undefined">Select a planet</option>
            <option v-for="planet of destinationPlanets"
                    v-bind:key="planet.name" v-bind:value="planet">{{ planet.name }}
            </option>
          </select>
        </div>
        <div class="float-end my-3">
          <button :disabled="!departurePlanet || !destinationPlanet" type="submit" class="btn btn-primary mx-1"><i
            class="fa fa-search"/> Search
          </button>
          <button @click="resetSearch" type="reset" class="btn btn-danger mx-1">Reset</button>
        </div>
      </form>
    </div>
  </div>

  <div class="col-md-10 mx-auto" v-if="loadedSearchResults === true">
    <div class="row my-3">
      <div class="col-lg-3 col-md-4">
        <div class="select-container">
          <select v-model="company" class="form-select">
            <option :value="null" selected>Select company</option>
            <option v-for="company of companies" v-bind:key="company" v-bind:value="company">
              {{ company }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-lg-3 col-md-4">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="price">Price:</span>
          </div>
          <input v-model="priceMin" type="text" class="form-control" placeholder="Min">
          <input v-model="priceMax" type="text" class="form-control" placeholder="Max">
        </div>
      </div>
      <div class="col-md-6 col-sm-4">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="distance">Travel Time:</span>
          </div>
          <Datepicker v-model="date" range/>
        </div>
      </div>
    </div>

    <div class="card my-3">
      <table data-search="true" class="table">
        <thead>
        <tr>
          <th @click="setCustomSort(ISortEnum.company)">
            Company <i v-if="customSort.sortBy === ISortEnum.company" class="fa"
                       v-bind:class="customSort.ascending ? 'fa-sort-asc' : 'fa-sort-desc'"/>
          </th>
          <th @click="setCustomSort(ISortEnum.price)">
            Price <i v-if="customSort.sortBy === ISortEnum.price" class="fa"
                     v-bind:class="customSort.ascending ? 'fa-sort-asc' : 'fa-sort-desc'"/>
          </th>
          <th @click="setCustomSort(ISortEnum.travelLength)">
            Travel Length <i v-if="customSort.sortBy === ISortEnum.travelLength" class="fa"
                             v-bind:class="customSort.ascending ? 'fa-sort-asc' : 'fa-sort-desc'"/>
          </th>
          <th @click="setCustomSort(ISortEnum.flightStart)">
            Departure <i v-if="customSort.sortBy === ISortEnum.flightStart" class="fa"
                         v-bind:class="customSort.ascending ? 'fa-sort-asc' : 'fa-sort-desc'"/>
          </th>
          <th @click="setCustomSort(ISortEnum.flightEnd)">
            Arrival <i v-if="customSort.sortBy === ISortEnum.flightEnd" class="fa"
                       v-bind:class="customSort.ascending ? 'fa-sort-asc' : 'fa-sort-desc'"/>
          </th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="provider of searchResults.filter(x => filterProviders(x)).sort((a, b) => sortFlights(a, b))"
          v-bind:key="provider.id">
          <td>
            {{ provider.company.name }}
          </td>
          <td>
            {{
              provider.price.toLocaleString('fr', {
                style: 'currency',
                currency: 'EUR'
              })
            }}
          </td>
          <td>
            {{ Math.floor(provider.travelLength / 24).toFixed(0) }} days {{ Math.floor(provider.travelLength % 24) }}
            hours
          </td>
          <td>
            {{ new Date(provider.flightStart).toLocaleString('es-MX') }}
          </td>
          <td>
            {{ new Date(provider.flightEnd).toLocaleString('es-MX') }}
          </td>
          <td>
            <button @click="makeReservation(provider)" type="button"
                    class="btn btn-outline-primary">Select flight
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="spinner-border text-primary mt-5" role="status" v-if="loading">
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Options, Vue } from 'vue-class-component'
import { BaseService } from '@/services/BaseService'
import { ITravelData } from '@/domain/ITravelData'
import { planetList } from '@/types/PlanetList'
import { IProvider } from '@/domain/IProvider'
import { IRouteInfo } from '@/domain/IRouteInfo'
import { ILeg } from '@/domain/ILeg'
import Datepicker from 'vue3-date-time-picker'
import 'vue3-date-time-picker/dist/main.css'
import { ISort, ISortEnum } from '@/types/ISort'
import Reservation from '@/views/Reservation.vue'
import { IReservation } from '@/types/IReservation'
import { IDestinationPlanet } from '@/types/IDestinationPlanet'

@Options({
  components: {
    Datepicker,
    Reservation
  }
})

export default class Main extends Vue {
  private searchResults?: IProvider[] | null;
  private routeInfo?: IRouteInfo | undefined;
  private companies?: string[] | undefined;
  private travelData?: ITravelData;
  private loading = true;
  private loadedSearchResults = false;
  private customSort: ISort = {
    sortBy: ISortEnum.company,
    ascending: true
  }
  private ISortEnum: any = ISortEnum;

  private departurePlanet: IDestinationPlanet | undefined;
  private destinationPlanet: IDestinationPlanet | undefined;

  private planets = planetList;
  private departurePlanets = this.planets;
  private destinationPlanets = this.planets;

  private companyName?: string | null = null;
  private price: IMinMax = {
    min: null,
    max: null
  }
  private date: Date[] = [];

  private timeOut: ReturnType<typeof setTimeout> | null = null;

  async mounted (): Promise<void> {
    await this.getTravelData();
    this.loading = false;
  }

  beforeUnmount (): void {
    if (this.timeOut) clearTimeout(this.timeOut);
  }

  private async getTravelData () {
    const baseService = new BaseService<ITravelData>()
    await baseService.get('v1.0/TravelPrices').then((data) => {
      if (data.ok) {
        this.setTravelData(data.data!)
        if (this.searchResults) {
          this.searchData();
          this.$forceUpdate();
          this.$toast.info('Data updated!', {
            message: 'Data updated!',
            position: 'top-right'
          });
        }
      } else {
        this.$toast.error('Data update failed. Please try again!', {
          message: 'Data update failed. Please try again!',
          position: 'top-right',
          onClick: this.getTravelData
        });
      }
    })
  }

  private filterDeparturePlanets(): void {
    if (this.destinationPlanet && planetList) {
      this.departurePlanets = this.planets.filter(p => p.destinations!.includes(this.destinationPlanet?.name!))
    } else {
      this.departurePlanets = this.planets;
    }
  }

  private filterDestinationPlanets(): void {
    if (this.departurePlanet && planetList) {
      this.destinationPlanets = this.planets.filter(p => this.departurePlanet!.destinations!.includes(p.name!));
    } else {
      this.destinationPlanets = this.planets;
    }
  }

  private searchData(): void {
    const resultLeg: ILeg = this.travelData?.legs?.
      find(leg => leg.routeInfo.from.name === this.departurePlanet?.name && leg.routeInfo.to.name === this.destinationPlanet?.name)!;
    this.searchResults = resultLeg.providers;
    for (const provider of this.searchResults!) {
      provider.travelLength = Math.abs(new Date(provider.flightEnd).getTime() - new Date(provider.flightStart).getTime()) / 3600000;
    }
    this.routeInfo = resultLeg.routeInfo;
    this.companies = [...new Set(this.searchResults?.map(p => p.company.name!))].sort((a, b) => a.localeCompare(b));
    this.loadedSearchResults = true;
  }

  private resetSearch (): void {
    (this.$refs.searchForm as any).reset();
    this.departurePlanet = undefined;
    this.destinationPlanet = undefined;
    this.destinationPlanets = this.planets;
    this.departurePlanets = this.planets;
    this.loadedSearchResults = false;
  }

  private filterProviders (provider: IProvider): boolean {
    if (this.companyName && provider.company.name !== this.companyName) return false;
    if (this.priceMin && provider.price < this.priceMin) return false;
    if (this.priceMax && provider.price > this.priceMax) return false;
    if (this.date) {
      if (this.date[0] && new Date(provider.flightStart) < this.date[0] || this.date[1] && new Date(provider.flightEnd) > this.date[1])
        return false;
    }
    return true;
  }

  private sortFlights (provider: IProvider, provider2: IProvider): number {
    if (this.customSort.sortBy === ISortEnum.company) {
      return this.customSort.ascending ? provider?.company.name!.localeCompare(provider2.company.name!)
        : provider2.company.name!.localeCompare(provider.company.name!);
    } else if (this.customSort.sortBy === ISortEnum.price) {
      return this.customSort.ascending == provider.price > provider2.price ? 1 : -1;
    } else if (this.customSort.sortBy === ISortEnum.travelLength) {
      return this.customSort.ascending == provider.travelLength! > provider2.travelLength! ? 1 : -1;
    } else if (this.customSort.sortBy === ISortEnum.flightStart) {
      return this.customSort.ascending == new Date(provider.flightStart) > new Date(provider2.flightStart) ? 1 : -1;
    } else if (this.customSort.sortBy === ISortEnum.flightEnd) {
      return this.customSort.ascending == new Date(provider.flightEnd) > new Date(provider2.flightEnd) ? 1 : -1;
    }
    return 1;
  }

  private setCustomSort (sortBy: ISortEnum): void {
    if (this.customSort.sortBy === sortBy) {
      this.customSort.ascending = !this.customSort.ascending;
    } else {
      this.customSort.sortBy = sortBy;
      this.customSort.ascending = true;
    }
  }

  private setTravelData (travelData: ITravelData) {
    this.travelData = travelData;
    this.saveTravelData(this.travelData!);
    const timeUntilRefresh: number = new Date(travelData.validUntil).getTime() - Date.now();
    this.timeOut = setTimeout(this.getTravelData, timeUntilRefresh);
  }

  private saveTravelData (travelData: ITravelData): void {
    const localTravelHistory = localStorage.getItem('travelDataHistory')
    if (!localTravelHistory) {
      localStorage.setItem('travelDataHistory', JSON.stringify([travelData]))
    } else {
      let travelHistory = JSON.parse(localTravelHistory) as ITravelData[]
      if (!travelHistory.find(t => t.id === travelData.id)) {
        if (travelHistory.length >= 15) {
          travelHistory = travelHistory.sort((a, b) => new Date(a.validUntil) > new Date(b.validUntil) ? 1 : -1)
          this.filterOldReservations(travelHistory.shift()!);
        }
        travelHistory.push(travelData)
        localStorage.setItem('travelDataHistory', JSON.stringify(travelHistory))
      }
    }
  }

  private filterOldReservations(expiredTravelData: ITravelData): void {
    const reservations = localStorage.getItem('reservations')
    if (reservations) {
      let reservationHistory = JSON.parse(reservations) as IReservation[]
      reservationHistory = reservationHistory.filter(r => r.travelDataId !== expiredTravelData!.id)
      localStorage.setItem('reservations', JSON.stringify(reservationHistory))
    }
  }

  private makeReservation (provider: IProvider) {
    this.$router.push({
      name: 'Reservation',
      params: {
        travelDataId: this.travelData!.id,
        companyName: provider.company.name,
        routeStart: this.routeInfo?.from.name,
        routeEnd: this.routeInfo?.to.name,
        price: provider.price,
        flightStart: provider.flightStart,
        flightEnd: provider.flightEnd,
        validUntil: this.travelData?.validUntil
      }
    })
  }

  public get company (): string {
    return this.companyName!
  }

  public set company (value: string) {
    this.companyName = value
    this.$forceUpdate()
  }

  public get priceMin (): number | null {
    return this.price.min
  }

  public set priceMin (value: number | null) {
    this.price.min = value
  }

  public get priceMax (): number | null {
    return this.price.max
  }

  public set priceMax (value: number | null) {
    this.price.max = value
  }
}

interface IMinMax {
  min: number | null;
  max: number | null;
}

</script>

<style scoped lang="css">

.form-select {
  border-color: black !important;
}

.dp__main {
  width: 25em !important;
}

th {
  cursor: pointer
}

.main-header {
  margin-top: -2em !important;
}

</style>
