import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

import 'carbon-components/css/carbon-components.min.css';

// @ts-ignore
import CarbonComponentsVue from '@carbon/vue';
Vue.use(CarbonComponentsVue);

Vue.config.productionTip = false;

new Vue({
	router,
	provide: {
		baseUrl: process.env.BASE_URL
	},
	render: h => h(App)
}).$mount('#app');
