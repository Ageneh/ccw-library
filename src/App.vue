<template>
	<div id='app' v-if='$store.getters.isReady'>
		<div class='logo-container content'>
			<h1>
				<img src='/img/chapel-library-logo.png' alt='Chapel Library Logo'>
			</h1>
		</div>

		<div id='borrow-modal' class='modal' aria-modal='true' v-if='displayBorrowModal'>
			<div class='form'>
				<form action='#' method='dialog' onsubmit='() => {}'>
					<h3 class='title'>"{{ selectedBook.title }}" ausleihen</h3>
					<input type='text' v-model='username' placeholder='Username'>
					<button type='submit' @click.stop='borrow(bookId, username)'>Ausleihen</button>
				</form>
			</div>
			<div class='blanket'></div>
		</div>

		<div class='filters'>

			<div class='search'>
				<SearchBar @enter='onSearch' />
			</div>

			<div class='table-filter-container content'>
				<div class='filter-gradient-overlay'></div>

				<div class='table-filters'>
					<BookFilter title='Ausgeliehen'
											label='borrowed'
											@update='onFilterLozenge' />
					<BookFilter title='Verfügbar'
											label='available'
											@update='onFilterLozenge' />
					<BookFilter v-for='category in categories'
											:title='category'
											@update='onFilterLozenge' />
				</div>
			</div>
		</div>

		<div class='table content' :key='`${query}-${filterStr}`'>
			<BookEntry
				v-for='(book, pos) in books'
				:book='book'
				:key='`book::${book.book_id}_${pos}_${book.owner}`'
				@click.native.stop='selectBook(book)'
				:active='selectedBookId === book.book_id'
			/>
		</div>

		<div class='overlay-options' v-if='selectedBookId >= 0'>
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

@Component({
	components: { SearchBar, BookEntry, BookFilter }
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

	get filterStr(): string {
		return [...this.filter.values()].join('-');
	}

	async beforeMount() {
		await this.$store.dispatch('initialize');
	}

	async borrow(bookId: number, username: string) {
		if (!this.selectedBook) {
			this.displayBorrowModal = false;
			return
		}
		await fetch(`/.netlify/functions/airtable-borrowBook?${new URLSearchParams({
			username,
			book_id: `${bookId}`,
			book_ref: `${this.selectedBook._id}`
		}).toString()}`)
			.finally(() => {
				this.displayBorrowModal = false;
				this.$store.dispatch("initialize")
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
		if (['available', 'borrowed'].includes(category)) return;
		this.$store.commit('toggleCategoryFilter', { category, active });
	}

	onSearch(queryString: string) {
		this.$store.commit('setQuery', queryString);
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

  color: white;

  .title {
    margin-bottom: 2rem
  }

  input {
    position: relative;
    padding: 1rem;
    padding-left: 3rem;
    border-radius: .5rem;
    border: 2px solid transparent;
    //margin: 1rem 0;
    //background-color: transparent;
    width: 100%;
		max-width: 500px;
    z-index: 5;

    transition-duration: 150ms;
    transition-timing-function: ease-out;

    font-size: larger;

    &:hover {
      background-color: rgba(255, 255, 255, 10);
    }

    &:active, &:focus {
      background-color: white;
    }
  }

  .form {
    margin-left: auto;
    margin-right: auto;
    width: 600px;
    height: 300px;
    margin-bottom: 5rem;
  }
}
</style>

<style lang='less'>
@primary-color: #296b6a;

body {
  background-color: var(--background-color) !important;
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

  padding-top: 2rem;
}

.filters {

  .table-filter-container {
    position: relative;
    z-index: 0;
    display: flex;
    flex-direction: row;

    .table-filters {
      display: flex;
      flex-direction: row;
      position: relative;

      overflow-x: scroll;

      padding-left: 2rem;
      padding-right: 2rem;
      padding-bottom: 1rem;
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
        background: linear-gradient(-90deg, var(--background-color) 0%, transparent 85%);
      }

      &:before {
        left: 0;
        background: linear-gradient(90deg, var(--background-color) 0%, transparent 85%);
      }
    }
  }
}


.logo-container {
  height: 85px;

  display: flex;
  flex-direction: row;

  padding: 0.5rem;

  img, h1 {
    height: 100%;
    width: auto;
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
  bottom: 2rem;
}

button {
  border-radius: 10rem !important;
  padding: .75rem 1.25rem;
  margin: 1rem !important;
  background-color: #42b983;
  border: 2px solid #42b983;
  cursor: pointer;
}
</style>
