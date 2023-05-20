<template>
	<div id='app' v-if='$store.getters.isReady'>
		<div class='logo-container content'>
			<h1>
				<img src='/img/chapel-library-logo.png' alt='Chapel Library Logo'>
			</h1>
			<button v-if='!isNaN(Number(query)) && query.trim().length > 0'
							type='submit'
							@click='displayReturnModal = true'>
				Zurückgeben
			</button>
		</div>

		<div id='borrow-modal' class='modal' aria-modal='true' v-if='displayBorrowModal'>
			<div class='form-container' @click.prevent>
				<div class='form'>
					<form action='#' method='dialog' onsubmit='() => {}'>
						<h3 class='title'>"{{ selectedBook.title }}" ausleihen</h3>
						<input type='text' v-model='username' placeholder='Benutzername'>
						<button type='submit' @click.stop='borrow(username)'
										:disabled='username.trim().length < 3'>Ausleihen
						</button>
					</form>
				</div>
			</div>
			<div class='blanket' @click.prevent='displayBorrowModal = false'></div>
		</div>
		<div id='return-modal' class='modal' aria-modal='true' v-if='displayReturnModal'>
			<div class='form-container' @click.prevent>
				<div class='form'>
					<form action='#' method='dialog' onsubmit='() => {}'>
						<h3 class='title'>Buch #{{ query }} zurückgeben</h3>
						<input type='text' v-model='username' placeholder='Benutzername'>
						<button type='submit' @click.stop='returnBook(Number(query), username)'
										:disabled='username.trim().length < 3'>Zurückgeben
						</button>
					</form>
				</div>
			</div>
			<div class='blanket' @click.prevent='displayReturnModal = false'></div>
		</div>

		<div class='filters'>
			<div class='search'>
				<SearchBar @enter='onSearch' />
			</div>

			<div class='table-filter-container content'>
				<div class='filter-gradient-overlay' :data-start='showFilterStartOverlay'></div>

				<transition mode='out-in' name='fade'>
					<div id='table-filters' v-if='isReady' class='table-filters' @scroll='onCategoriesScroll'>
						<template>
							<BookFilter title='Ausgeliehen'
													label='borrowed'
													@update='onFilterLozenge' />
							<BookFilter title='Verfügbar'
													label='available'
													@update='onFilterLozenge' />
							<BookFilter v-for='category in categories'
													:title='category'
													@update='onFilterLozenge' />
						</template>
					</div>
					<div v-else class='table-filters'>
						<template>
							<BookFilterLoader />
							<BookFilterLoader />
							<BookFilterLoader />
							<BookFilterLoader />
						</template>
					</div>
				</transition>
			</div>
		</div>

		<transition name='fade'>
			<div v-if='isReady' class='table content' :key='`${query}-${filterStr}`'>
				<template>
					<BookEntry
						v-for='(book, pos) in books'
						:book='book'
						:key='`book::${book.book_id}_${pos}_${book.owner}`'
						@click.native.stop='selectBook(book)'
						:active='selectedBookId === book.book_id'
					/>
				</template>
			</div>
			<div v-else class='table content' :key='`${query}-${filterStr}`'>
				<template>
					<BookEntryLoader :key='`book-entry-loader_${pos}`'
													 v-for='(book, pos) in [...Array(7).map((_v, pos) => pos + 1)]' />
				</template>
			</div>
		</transition>

		<div v-if='selectedBookId >= 0' class='overlay-options'>
			<button @click='displayBorrowModal = true'>Ausleihen</button>
		</div>
	</div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IBook } from '@/types';
import BookFilter from '@/components/BookFilter.vue';
import BookEntry from '@/components/BookEntry.vue';
import SearchBar from '@/components/SearchBar.vue';
import BookFilterLoader from '@/components/loader/BookFilterLoader.vue';
import BookEntryLoader from '@/components/loader/BookEntryLoader.vue';

@Component({
	components: { BookEntryLoader, BookFilterLoader, SearchBar, BookEntry, BookFilter }
})
export default class App extends Vue {
	@Prop() private msg!: string;

	bookId: number = 0;
	username: string = '';

	light: boolean = false;
	active: Set<number> = new Set();
	selectedBookId: number = -1;
	filter: Set<string> = new Set<string>();

	displayBorrowModal = false;
	displayReturnModal = false;

	ready = false;
	isFilterAtStart = true;

	async beforeMount() {
		await this.$store.dispatch('initialize');
	}

	mounted() {
		const el = document.getElementById('table-filters');
		if (el) {
			el.onscroll = (ev: any) => {
				if (ev.srcElement.scrollLeft > 30) this.showFilterStartOverlay = true;
				console.log('>>>>>>>>>>', ev);
			};
		}
	}

	set isReady(ready: boolean) {
		this.ready = ready;
	}

	get isReady(): boolean {
		return this.ready || this.$store.getters.isReady;
	}

	async borrow(username: string) {
		if (!this.selectedBook) {
			this.displayBorrowModal = false;
			return;
		}
		await fetch(`/.netlify/functions/airtable-borrowBook?${new URLSearchParams({
			username,
			book_id: `${this.selectedBook.book_id}`,
			book_ref: `${this.selectedBook._id}`
		}).toString()}`)
			.finally(() => {
				this.displayBorrowModal = false;
				this.$store.dispatch('initialize');
			});
	}

	async returnBook(bookId: number, username: string) {
		const book: IBook | undefined = this.$store.getters.getByBookId(bookId);
		if (!book) {
			return;
		}
		await fetch(`/.netlify/functions/airtable-returnBook?${new URLSearchParams({
			username,
			book_id: `${book.book_id}`,
			book_ref: `${book._id}`
		}).toString()}`)
			.finally(() => {
				this.displayReturnModal = false;
				this.$store.commit('setQuery', '');
				this.$store.dispatch('initialize');
			});
	}

	selectBook(book: IBook) {
		if (this.selectedBookId === book.book_id) {
			this.selectedBookId = -1;
			return;
		}
		this.selectedBookId = book.book_id;
	}

	onFilterLozenge({ category, active }: any) {
		this.$store.commit('toggleCategoryFilter', { category, active });
	}

	onSearch(queryString: string) {
		this.$store.commit('setQuery', queryString);
	}

	onCategoriesScroll(e: any) {
		console.log(e.srcElement.scrollLeft);
		if (e.srcElement.scrollLeft > 30) this.showFilterStartOverlay = true;
	}

	set showFilterStartOverlay(isStart: boolean) {
		this.isFilterAtStart = isStart;
	}

	get showFilterStartOverlay() {
		return this.isFilterAtStart;
	}

	get filterStr(): string {
		return [...this.filter.values()].join('-');
	}

	get query(): string {
		return this.$store.state.query;
	}

	get books(): IBook[] {
		return this.$store.getters.filteredBooks;
	}

	get categories(): string[] {
		return this.$store.state.categories;
	}

	get selectedBook(): IBook | undefined {
		if (this.selectedBookId < 0) {
			return undefined;
		}
		return this.$store.state.allBooks
			.filter((book: IBook) => {
				return book.book_id === this.selectedBookId;
			})[0];
	}

}
</script>

<style lang='css'>
:root {
    --background-color: #f8f6f5;
    --loader-bg-color: rgba(0, 0, 0, .1);
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
    opacity: 1;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
{
    opacity: 0;
}
</style>

<style lang='less'>
.modal {
  background-color: rgba(40, 40, 40, 0.9);
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-items: center;

  @media screen and (max-width: 890px) {
    //align-items: start;
    .title {
      margin-bottom: initial;
    }

    //.form-container {
    //  transform: translateY(0) !important;
    //}
  }

  .blanket {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 0;
  }

  //color: white;

  .title {
    margin-bottom: 2rem
  }

  input {
    position: relative;
    padding: 1rem;
    //padding-left: 3rem;
    border-radius: .5rem;
    box-shadow: 0 1rem 3rem -.5rem rgba(0, 0, 0, 0.05);
    border: 2px solid transparent;
    //margin: 1rem 0;
    //background-color: transparent;
    width: 100%;
    max-width: 500px;
    z-index: 5;

    transition-duration: 150ms;
    transition-timing-function: ease-out;

    font-size: larger;

    margin-bottom: 1.25rem;

    &:hover {
      background-color: rgba(255, 255, 255, 10);
    }

    &:active, &:focus {
      background-color: white;
    }
  }

  .form-container {
    //padding: 2rem;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    z-index: 5;
    transform: translateY(-3rem);

    .form {
      position: relative;
      margin-left: auto;
      margin-right: auto;
      min-width: 300px;
      width: 100%;
      max-width: 560px;
      height: 300px;

      form {
        background: white;
        border-radius: 1rem;
        padding: 2rem 1rem 1rem;
        box-shadow: 0 1.25rem 1.5rem -.5rem rgba(0, 0, 0, 0.3);
      }
    }
  }
}
</style>

<style lang='less'>
@primary-color: #296b6a;

body {
  background-color: var(--background-color) !important;
  padding-bottom: 4rem !important;
}

.content {
  max-width: 800px;
  margin: 0 auto;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  padding: 1rem 1rem 2rem 1rem;
}

.filters {

  .table-filter-container {
    position: relative;
    z-index: 0;
    display: flex;
    flex-direction: row;
    margin-top: 1rem;

    .table-filters {
      display: flex;
      flex-direction: row;
      position: relative;
      cursor: grab;
      overflow-x: auto;

      //padding-left: 2rem;
      padding-right: 2rem;
      padding-bottom: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .filter-gradient-overlay {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      pointer-events: none;

      &:after, &:before {
        content: "";
        display: block;
        position: absolute;
        z-index: 10;
        height: 100%;
        width: 5rem;
      }

      &:after {
        right: 0;
        background: linear-gradient(-90deg, var(--background-color) 0%, transparent 95%);
      }

      &:not([data-start]) {
        &:before {
          left: 0;
          background: linear-gradient(90deg, var(--background-color) 0%, transparent 95%);
        }
      }
    }
  }
}


.logo-container {
  height: 85px;

  @media screen and (max-width: 890px) {
    height: 65px;
  }

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  padding: 0.5rem;
  margin-bottom: 1rem;

  img, h1 {
    height: 100%;
    width: auto;
  }

  button {
    padding: .25rem .75rem;
    background-color: white;
    border: 2px solid white;
		margin: .25rem 0 !important;

    box-shadow: 0 1rem 3rem -.5rem rgba(0, 0, 0, 0.2);
  }
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.table {
  //@rad: .2rem;
  @rad: 1rem;

  .books-list {
    display: flex;
    flex-direction: column;
    justify-items: stretch;
  }

  position: relative;
}

.lozenge {
  border-radius: 1rem;
  background-color: rgba(0, 0, 0, .04);
  padding: .25rem .5rem;
  font-size: smaller;
}

.overlay-options {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 1rem;

  * {
    box-shadow: 0 0 4rem -.5rem #153b2a;
  }
}

button {
  border-radius: 10rem !important;
  padding: .75rem 1.25rem;
  margin: 1rem !important;
  background-color: #42b983;
  border: 2px solid #42b983;
  cursor: pointer;

  &:disabled {
    background-color: rgba(66, 185, 131, 0.39);
    border: 2px solid rgba(66, 185, 131, 0.39);
  }
}
</style>
