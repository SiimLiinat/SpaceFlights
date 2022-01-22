import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Main from '../views/Main.vue'
import PathFinder from '@/views/PathFinder.vue'
import Reservation from '@/views/Reservation.vue'
import TravelRecords from '@/views/TravelRecords.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Main
  },
  {
    path: '/reservation',
    name: 'Reservation',
    component: Reservation
  },
  {
    path: '/path-finder',
    name: 'PathFinder',
    component: PathFinder
  },
  {
    path: '/travel-records',
    name: 'TravelRecords',
    component: TravelRecords
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
