<template>
	<div id='app'>
		<div class='logo-container content'>
			<h1>
				<img src='/img/chapel-library-logo.png' alt='Chapel Library Logo'>
			</h1>
		</div>

		<div class='filters'>
			<div class='table-filter content'>
				<BookFilter title='Ausgeliehen'></BookFilter>
				<BookFilter title='Verfügbar'></BookFilter>
				<BookFilter v-for='category in categories' :title='category'></BookFilter>
			</div>
		</div>

		<div class='table content'>
			<BookEntry
				v-for='(book, pos) in books'
				:book='book'
				:key='`book::${book.id}_${pos}_${book.owner}`'
				@click='active.add(pos)' />
		</div>
	</div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IBook } from '@/types';
import BookFilter from '@/components/BookFilter.vue';
import BookEntry from '@/components/BookEntry.vue';

@Component({
	components: { BookEntry, BookFilter }
})
export default class App extends Vue {
	@Prop() private msg!: string;

	mod = false;

	books: IBook[] = [];
	groupedBooks: { [book: string]: IBook[] } = {};
	light: boolean = false;

	categories: Set<string> = new Set();

	active: Set<number> = new Set();

	filter: Set<string> = new Set<string>();

	async beforeMount() {
		const baseUrl = process.env.BASE_URL;
		const data = await fetch(`${baseUrl}books_v2.json`);
		this.books = await data.json();

		this.categories = new Set(this.books.map(book => book.category));
	}

	onTileChange(event: any) {
		console.log(event);
	}

	onClick(pos: number) {
		if (this.active.has(pos)) {
			this.active.delete(pos);
		} else {
			this.active.add(pos);
		}
	}

}
</script>

<style lang='less'>
@primary-color: #296b6a;

body {
  //background-color: #42b983 !important;
  background-color: #f8f6f5 !important;

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
}

.filters {
  .table-filter {
    display: flex;
    flex-direction: row;

    overflow-x: scroll;

    padding-bottom: 1rem;
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
</style>
