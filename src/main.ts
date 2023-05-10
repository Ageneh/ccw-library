import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import "carbon-components/css/carbon-components.min.css"

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
