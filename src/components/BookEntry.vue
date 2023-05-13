<template>
	<div class='book-entry' :data-available='true' :data-selected='selected' @click='toggle'>
		<div class='book-main'>
			<h4 class='book-title'>{{ book.title }}</h4>
			<p class='book-author'>{{ book.author }}</p>
		</div>
		<div class='book-meta'>
			<p class='book-author'>{{ book.owner }}</p>
		</div>
	</div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IBook } from '@/types';
import BookFilter from '@/components/BookFilter.vue';

@Component({
	components: { BookFilter }
})
export default class BookEntry extends Vue {
	@Prop() private book!: IBook

	active: boolean = false

	toggle() {
		this.active = !this.active
	}

	set selected(selected: boolean) {
		this.active = selected
	}

	get selected() {
		return this.active
	}
}
</script>

<style lang='less'>
@primary-color: #296b6a;
@rad: 1rem;

.book-entry {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  position: absolute;

  border-radius: @rad;
  padding: 1rem;
  margin-top: .5rem;
  top: 0;
  transform: scale(1);

	overflow: hidden;

  box-shadow: 0 0rem 0rem 0rem rgba(0, 0, 0, 0.2);

  border: 2px solid transparent;

  &, * {
    position: relative;
  }

  transition-timing-function: ease-in-out;
  transition-duration: 200ms;

  //background-color: #ffffff;

  .book-main {
    text-align: left;
    display: flex;
    flex-direction: column;

    transition-timing-function: ease-in-out;
    transition-duration: 200ms;
  }

  .book-title {
    font-weight: 700;
  }

  .book-author {
    font-weight: 400;
  }

  .book-meta {
    text-align: right;
    display: flex;
    justify-content: end;
    //align-items: center;

    position: relative;
    right: 0;

    width: 100px;
  }

  &::before {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: #42b983;
    top: auto;
    bottom: auto;
    display: flex;
    align-self: center;
    left: -20px;
    opacity: 0;

    transition-timing-function: ease-out;
    transition-duration: 200ms;
  }

  &:hover, &[data-selected="true"] {
    background-color: white;
    top: -5px;
    transform: scale(1.002);
    box-shadow: 0 1.25rem 1.5rem -.5rem rgba(0, 0, 0, 0.06);
    border-radius: .5rem;
  }

  &[data-selected="true"] {
    background-color: white;
    color: #42b983;
    border: 2px solid rgba(66, 185, 131, 0.33);

    .book-main {
      margin-left: 2rem;
    }

    &::before {
      opacity: 1;
      left: 1rem;
    }
  }

  &[data-available="false"] {
    //background-color: rgba(0, 0, 0, 0.1);
    background-color: rgba(0, 0, 0, 0.1);
    opacity: .5;

    &, * {
      font-style: italic;
      pointer-events: none !important;
      cursor: not-allowed !important;
      text-decoration: line-through;
    }
  }
}
</style>
