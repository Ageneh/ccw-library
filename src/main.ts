import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
// @ts-ignore
import CarbonComponentsVue from '@carbon/vue';
import 'carbon-components/css/carbon-components.min.css';
// @ts-ignore
import { CarbonIconsVue } from '@carbon/icons-vue';
// @ts-ignore
import Search24 from '@carbon/icons-vue/es/search/24';
// @ts-ignore
import CheckmarkFilled from '@carbon/icons-vue/es/checkmark--filled/24';
import store from '@/store';

Vue.config.productionTip = false;

Vue.use(CarbonComponentsVue);

Vue.use(CarbonIconsVue, {
	components: {
		Search24,
		CheckmarkFilled,
	}
});

new Vue({
	router,
	provide: {
		baseUrl: process.env.BASE_URL
	},
	store,
	render: h => h(App)
})
	.$mount('#app');
