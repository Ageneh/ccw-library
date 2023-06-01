declare module "@carbon/icons-vue" {
	import icons from '@carbon/icons-vue'
	export default icons
}

declare module "vue-material" {
	import VM from 'vue-material'
	export default {
		components: VM.components,
	}
}

export interface IBook {
	_id: string; // ID FROM AIRTABLE
	book_id: number;
	author: string;
	title: string;
	borrowed?: string; // date
	status?: string; // borrowed, available
	owner: string;
	category: string;
	series: string;
}
