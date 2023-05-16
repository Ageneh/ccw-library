import Vue from 'vue';
import Vuex from 'vuex';
import { IBook } from '@/types';
import SearchUtil from '@/search-util';

Vue.use(Vuex);

type Books = IBook[]

const searchUtil: SearchUtil = new SearchUtil([
	'id',
	'author',
	'title'
]);

export interface State {
	allBooks: Books;
	categories: string[];
	query: string;
	filters: string[];
}

const bookSorter = (bookA: IBook, bookB: IBook) => {
	const titleA = `${bookA.title}-${bookA.author}-${bookA.id}_${bookA.owner}`.toLowerCase();
	const titleB = `${bookB.title}-${bookB.author}-${bookB.id}_${bookB.owner}`.toLowerCase();
	return (titleA > titleB) ? 1 : ((titleB > titleA) ? -1 : 0);
};

export default new Vuex.Store<State>({
	state: {
		allBooks: [],
		categories: [],
		query: '',
		filters: []
	},
	getters: {
		filteredBooks: (state) => {
			const { query, filters, allBooks, categories } = state;

			console.log(JSON.parse(JSON.stringify(state)));

			const searchResults = query?.trim() === ''
				? allBooks
				: searchUtil.searchTransformed(query, allBooks);
			const booksByCategory: Books = filters.length < 1
				? searchResults
				: searchResults.filter(book => book.category.trim() != "" && filters.includes(book.category));

			return booksByCategory;
		}
	},
	mutations: {
		setAllBooks: (state, books: Books) => state.allBooks = books,
		setCategories: (state, categories: string[]) => state.categories = categories,
		setQuery: (state, query: string) => state.query = query,
		setFilters: (state, filters: string[]) => state.filters = filters,
		toggleCategoryFilter: (state, payload: {category: string, active: boolean}) => {
			const categoryFiltersSet = new Set(state.filters);
			if (payload.active) {
				categoryFiltersSet.add(payload.category)
			} else {
				categoryFiltersSet.delete(payload.category)
			}
			state.filters = [...categoryFiltersSet.values()]
		},
	},
	actions: {
		initialize: async ({ commit }) => {
			const baseUrl = process.env.BASE_URL;
			const data = await fetch(`${baseUrl}books_v2.json`);
			const allBooks: Books = await data.json();

			const categories = new Set(
				allBooks.map(book => book.category)
					.filter(category => category.trim() !== '')
			);

			allBooks.sort(bookSorter);
			commit('setAllBooks', allBooks);
			commit('setCategories', [...categories.values()]);
		}
	},
	modules: {}
});
