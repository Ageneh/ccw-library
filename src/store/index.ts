import Vue from 'vue';
import Vuex from 'vuex';
import { IBook } from '@/types';
import SearchUtil from '@/search-util';
import AirtableMiddleware from '@/airtableMiddleware';

Vue.use(Vuex);

type Books = IBook[]

const searchUtil: SearchUtil = new SearchUtil([
	'book_id',
	'author',
	'title'
]);

export interface State {
	allBooks: Books;
	categories: string[];
	query: string;
	filters: string[];
}

const airtableMiddleware = new AirtableMiddleware();

const bookSorter = (bookA: IBook, bookB: IBook) => {
	const titleA = `${bookA.title}-${bookA.author}-${bookA.book_id}_${bookA.owner}`.toLowerCase();
	const titleB = `${bookB.title}-${bookB.author}-${bookB.book_id}_${bookB.owner}`.toLowerCase();
	return (titleA > titleB) ? 1 : ((titleB > titleA) ? -1 : 0);
};

export default new Vuex.Store<State>({
	state: {
		allBooks: [] as Books,
		categories: [],
		query: '',
		filters: []
	},
	getters: {
		filteredBooks: (state) => {
			const { query, filters, allBooks, categories } = state;

			const searchResults = query?.trim() === ''
				? allBooks
				: searchUtil.searchTransformed(query, allBooks);


			const filterBooks = (books: Books) => {
				let matchedBooks: IBook[] = [];
				books.forEach((book: IBook) => {
					const category = book.category;
					for (const filter of state.filters) {
						if (['available', 'borrowed'].includes(filter.toLowerCase())) {
							if (filter === 'available' && !book.borrowed?.trim()) {
								matchedBooks.push(book);
								break;
							}
							if (filter === 'borrowed' && book.borrowed && book.borrowed.trim().length > 0) {
								matchedBooks.push(book);
								break;
							}
						} else if (book.category.trim() !== '' && filters.includes(book.category)) {
							matchedBooks.push(book);
							break;
						}
					}
				});
				return matchedBooks;
			};

			return filters.length < 1
				? searchResults
				: filterBooks(searchResults);
		},
		isReady: (state) => !!state.allBooks && state.allBooks.length > 0,
		getByBookId: (state) => {
			return (bookId: number): IBook | undefined => {
				const filtered = state.allBooks.filter(book => book.book_id === bookId);
				if (filtered.length > 0) {
					return filtered[0];
				}
				return undefined;
			};
		}
	},
	mutations: {
		setAllBooks: (state, books: Books) => state.allBooks = books,
		setCategories: (state, categories: string[]) => state.categories = categories,
		setQuery: (state, query: string) => state.query = query,
		setFilters: (state, filters: string[]) => state.filters = filters,
		toggleCategoryFilter: (state, payload: { category: string, active: boolean }) => {
			const categoryFiltersSet = new Set(state.filters);
			if (payload.active) {
				categoryFiltersSet.add(payload.category);
			} else {
				categoryFiltersSet.delete(payload.category);
			}
			state.filters = [...categoryFiltersSet.values()];
		}
	},
	actions: {
		initialize: async ({ commit }) => {
			const data1: any = await airtableMiddleware.getAllBooks();
			const allBooks: Books = data1.map((ref: any) => {
				return {
					...ref.fields,
					_id: ref.id
				};
			});

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
