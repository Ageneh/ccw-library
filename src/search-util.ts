import Fuse from 'fuse.js';
import { IBook } from '@/types';

export const defaultFuseOptions = {
	include: ['matches'],
	shouldSort: true,
	threshold: 0.2,
	location: 0,
	distance: 80,
	maxPatternLength: 32,
	minMatchCharLength: 2,
	keys: [],
	ignoreLocation: true,
};

export default class SearchUtil {

	fuseKeys: string[] = [];

	constructor(fuseKeys: string[] = []) {
		this.fuseKeys = fuseKeys;
	}

	setKeys(fuseKeys: string[]) {
		this.fuseKeys = fuseKeys
	}

	get fuseOptions() {
		return {
			...defaultFuseOptions,
			keys: this.fuseKeys
		};
	}

	search = (query: string, books: IBook[], options: Fuse.IFuseOptions<IBook> = {}): Fuse.FuseResult<IBook>[] => {
		const fuseResults = new Fuse(books, {
			...this.fuseOptions,
			...options,
		})
			.search(query);
		return fuseResults;
	};

	searchTransformed = (query: string, books: IBook[], options: Fuse.IFuseOptions<IBook> = {}) => {
		return this.search(query, books, options).map(fuseBook => {
			return fuseBook.item
		})
	};

}
