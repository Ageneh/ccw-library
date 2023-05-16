/// <reference types="node" />

declare module "@carbon/icons-vue" {

}

export interface IBook {
	id: number;
	author: string;
	title: string;
	borrowed?: string; // date
	status?: string; // borrowed, available
	owner: string;
	category: string;
	series: string;
}
