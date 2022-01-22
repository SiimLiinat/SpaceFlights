import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap'
import 'popper.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

createApp(App)
  .use(router)
  .use(VueToast)
  .mount('#app')
