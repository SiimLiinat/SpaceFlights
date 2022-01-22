<template>
  <div class="col-md-6 col-sm-10 mx-auto">
    <div>
      <img class="img-fluid rounded-15" src="@/assets/2704593_2.jpg">
      <h1 class="text-white records-page-header">Flight Reservation</h1>
    </div>
    <div class="card shadow rounded-15 mt-5 mx-auto pt-3 p-3">
      <form class="mx-auto col-md-6 col-sm-10">
        <div class="mb-3">
          <label for="firstName" class="form-label text-black text-bold">First Name:</label>
          <input required class="form-control" v-model="firstName" type="text" id="firstName" placeholder="John"/>
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label text-black text-bold">Last Name:</label>
          <input required class="form-control" v-model="lastName" type="text" id="lastName" placeholder="Doe"/>
        </div>
      </form>
      <hr class="col-md-9 col-sm-10 mx-auto">
      <div class="mb-3">
        <h6 type="text" id="companyName"><span class="text-black text-bold">Company: </span>{{ companyName }}</h6>
      </div>
      <div class="mb-3">
        <h6 id="route"><span class="text-black text-bold">Route:</span> {{ routeStart }} <i class="fa fa-arrow-right"></i> {{ routeEnd }}</h6>
      </div>
      <div>
        <h6 id="distance"><span class="text-black text-bold">Travel Time:</span> {{ new Date(flightStart).toLocaleString('es-MX') }} - {{ new Date(flightEnd).toLocaleString('es-ES') }}</h6>
      </div>
      <hr class="col-md-9 col-sm-10 mx-auto">
      <div class="mb-3 text-end" style="padding-right: 5em">
        <h5 class="text-black" id="price">Price: {{ Number.parseFloat(price.toString()).toLocaleString("fr", {style: "currency",
        currency: "EUR"}) }}</h5>
      </div>
      <div class="row justify-content-start my-3">
        <div class="col-md-3 col-sm-3">
          <button @click="$router.push('/')" class="btn btn-outline-dark" type="button"><i class="fa fa-arrow-left"/> Back</button>
        </div>
        <div class="col-md-6 col-sm-3">
          <button @click="submitReservation" :disabled="!firstName || !lastName" class="btn rounded-15 btn-primary col-12" type="button">Submit</button>
        </div>
        <div class="col-3"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Options, Vue } from 'vue-class-component'
import { IReservation } from '@/types/IReservation'
import { useRoute } from 'vue-router'
export default class Reservation extends Vue {
  travelDataId!: string;
  companyName!: string;
  flightStart!: string;
  flightEnd!: string;
  price!: number;
  routeStart!: string;
  routeEnd!: string;

  private firstName = '';
  private lastName = '';

  private timeOut: ReturnType<typeof setTimeout> | null = null;

  beforeUnmount(): void {
    if (this.timeOut) clearTimeout(this.timeOut);
  }

  async created(): Promise<void> {
    const route = useRoute();
    if (!route.params) await this.$router.push("/")
    else {
      let reservation: IReservation = route.params as unknown as IReservation;

      this.price = reservation.price;
      this.flightStart = reservation.flightStart;
      this.flightEnd = reservation.flightEnd;
      this.travelDataId = reservation.travelDataId;
      this.companyName = reservation.companyName;
      this.routeStart = reservation.routeStart;
      this.routeEnd = reservation.routeEnd;

      const timeUntilRefresh: number = new Date(reservation.validUntil!).getTime() - Date.now()
      this.timeOut = setTimeout(() => {this.$router.push("/"); this.$toast.info("Pricelist expired!",
        {message: "Pricelist expired!", position: "top-right" })}, timeUntilRefresh);
    }
  }

  submitReservation (): void {
    const reservation: IReservation = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      companyName: this.companyName,
      routeStart: this.routeStart,
      routeEnd: this.routeEnd,
      flightStart: this.flightStart,
      flightEnd: this.flightEnd,
      price: this.price,
      travelDataId: this.travelDataId,
      validUntil: null
    }
    Reservation.saveReservationToStorage(reservation);
    this.$toast.success('Reservation complete!', {
      message: 'Reservation complete!',
      position: 'top-right'
    });
    this.$router.push("/");
  }

  private static saveReservationToStorage (reservation: IReservation): void {
    const reservations = localStorage.getItem('reservations');
    if (!reservations) {
      localStorage.setItem('reservations', JSON.stringify([reservation]));
    } else {
      const reservationHistory = JSON.parse(reservations) as IReservation[];
      reservationHistory.push(reservation);
      localStorage.setItem('reservations', JSON.stringify(reservationHistory));
    }
  }
}
</script>

<style scoped lang="css">
  .records-page-header {
    margin-top: -1.75em !important;
  }
</style>
