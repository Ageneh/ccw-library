import Vue from 'vue';
import App from './App.vue';
// import './registerServiceWorker';
// import router from './router';
import 'carbon-components/css/carbon-components.min.css';
import store from '@/store';

const CarbonComponentsVue = require('@carbon/vue');
const { CarbonIconsVue } = require('@carbon/icons-vue');
const Search24 = require('@carbon/icons-vue/es/search/24');
const CheckmarkFilled = require('@carbon/icons-vue/es/checkmark--filled/24');

Vue.config.productionTip = false;

Vue.use(CarbonComponentsVue);

Vue.use(CarbonIconsVue, {
	components: {
		Search24,
		CheckmarkFilled
	}
});

new Vue({
	// router,
	provide: {
		baseUrl: process.env.BASE_URL
	},
	store,
	render: h => h(App)
})
	.$mount('#app');
