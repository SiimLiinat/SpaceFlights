<template>
  <div class="row">
    <div class="col-md-8 col-sm-12 mx-auto">
      <div>
        <img class="img-fluid col-md-6 rounded-15" src="@/assets/2704593_2.jpg">
        <h1 class="text-white records-page-header">Travel Records API</h1>
        <h3 class="text-black mt-5 mb-3 text-start">Travel Records:</h3>
      </div>
      <div class="accordion" id="travelRecords">
        <div v-for="(data, index) of priceList" v-bind:key="data.id" class="accordion-item">
          <h2 class="accordion-header" :id="'heading' + index">
            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                    :data-bs-target="'#collapse' + index"
                    aria-expanded="true" :aria-controls="'collapse' + index">
              Travel Data {{ index + 1 }}. Valid until - {{ new Date(data.validUntil).toLocaleString('es-MX') }}
            </button>
          </h2>
          <div :id="'collapse' + index" class="accordion-collapse collapse" :aria-labelledby="'heading' + index"
               data-bs-parent="#travelRecords">
            <div class="accordion-body text-start">
              <pre>{{ JSON.stringify(data, undefined, '\t') }}</pre>
            </div>
          </div>
        </div>
      </div>
      <br>
      <h3 class="text-black my-3 text-start">Reservations:</h3>
      <div class="accordion" id="reservations">
        <div v-for="(data, index) of reservationList" v-bind:key="data" class="accordion-item">
          <h2 class="accordion-header" :id="'headingR' + index">
            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                    :data-bs-target="'#reservation' + index" aria-expanded="true"
                    :aria-controls="'reservation' + index">
              Reservation {{ index + 1 }}.
            </button>
          </h2>
          <div :id="'reservation' + index" class="accordion-collapse collapse" :aria-labelledby="'headingR' + index"
               data-bs-parent="#reservations">
            <div class="accordion-body text-start">
              <h6><span class="text-black text-bold">Full Name:</span> {{ data.firstName }} {{ data.lastName }}</h6>
              <h6><span class="text-black text-bold">Company Name:</span> {{ data.companyName }}</h6>
              <h6><span class="text-black text-bold">Route:</span> {{ data.routeStart }} <i class="fa fa-arrow-right"/>
                {{ data.routeEnd }}</h6>
              <h6><span class="text-black text-bold">Price:</span> {{Number.parseFloat(data.price.toString()).toLocaleString('fr', { style: 'currency', currency: 'EUR' }) }}</h6>
              <h6><span class="text-black text-bold">Flight Time:</span>
                {{ new Date(data.flightStart).toLocaleString('es-MX') }} - {{ new Date(data.flightEnd).toLocaleString('es-MX') }}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Vue } from 'vue-class-component'
import { ITravelData } from '@/domain/ITravelData'
import { IReservation } from '@/types/IReservation'

export default class TravelRecords extends Vue {
  priceList: ITravelData[] = []
  reservationList: IReservation[] = []

  mounted (): void {
    const localTravelHistory = localStorage.getItem('travelDataHistory')
    if (localTravelHistory) this.priceList = JSON.parse(localTravelHistory) as ITravelData[]
    const reservationHistory = localStorage.getItem('reservations')
    if (reservationHistory) this.reservationList = JSON.parse(reservationHistory) as IReservation[]
  }
}
</script>

<style scoped lang="css">
.records-page-header {
  margin-top: -1.4em !important;
}
</style>
