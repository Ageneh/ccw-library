<template>
	<div id='app'>
		<div class='logo-container content'>
			<h1>
				<img src='/img/chapel-library-logo.png' alt='Chapel Library Logo'>
			</h1>
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
											@update='onFilterLozenge'/>
					<BookFilter title='Verfügbar'
											label='available'
											@update='onFilterLozenge'/>
					<BookFilter v-for='category in categories'
											:title='category'
											@update='onFilterLozenge'/>
				</div>
			</div>
		</div>

		<div class='table content' :key='`${query}-${filterStr}`'>
			<BookEntry
				v-for='(book, pos) in books'
				:book='book'
				:key='`book::${book.id}_${pos}_${book.owner}`'
				@click='active.add(pos)' />
		</div>
	</div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IBook } from '@/types';
import BookFilter from '@/components/BookFilter.vue';
import BookEntry from '@/components/BookEntry.vue';
import SearchBar from '@/components/SearchBar.vue';

@Component({
	components: { SearchBar, BookEntry, BookFilter }
})
export default class App extends Vue {
	@Prop() private msg!: string;

	light: boolean = false
	active: Set<number> = new Set()
	filter: Set<string> = new Set<string>()

	get filterStr(): string {
		return [...this.filter.values()].join("-")
	}

	async beforeMount() {
		await this.$store.dispatch("initialize")
	}

	onFilterLozenge({ category, active }: any) {
		if (["available", "borrowed"].includes(category)) return
		this.$store.commit("toggleCategoryFilter", { category, active })
	}

	onSearch(queryString: string) {
		this.$store.commit("setQuery", queryString)
	}

	get query(): string {
		return this.$store.state.query
	}

	get books(): IBook[] {
		return this.$store.getters.filteredBooks
	}

	get categories(): string[] {
		return this.$store.state.categories
	}

}
</script>

<style lang='css'>
:root {
    --background-color: #f8f6f5;
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
</style>
