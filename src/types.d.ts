export interface IBook {
	id: number;
	author: string;
	title: string;
	borrowed?: string; // date
	owner: string;
	category: string;
}
