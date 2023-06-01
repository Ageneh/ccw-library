<template>
	<div class='book-entry' :data-borrowed='!!book.borrowed' :data-selected='active'>
		<div class='book-pre'>
			<p class='book-id'>{{ book.book_id }}</p>
		</div>
		<div class='book-main'>
			<h4 class='book-title'>{{ book.title }}</h4>
			<p class='book-author'>{{ book.author }}</p>
		</div>
		<div class='book-meta'>
			<p v-if='book?.owner' class='book-owner lozenge'>{{ book.owner.toUpperCase() }}</p>
		</div>
		<Checkmark class='selected-checkmark' />
	</div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IBook } from '@/types';
import BookFilter from '@/components/BookFilter.vue';
// @ts-ignore
import Checkmark from '@carbon/icons-vue/es/checkmark--filled/20';

@Component({
	components: { BookFilter, Checkmark }
})
export default class BookEntry extends Vue {
	@Prop() private book!: IBook;
	@Prop() private active!: boolean;
}
</script>

<style lang='less'>
@rad: 1rem;
@min-width: 890px;

.book-entry {
  cursor: pointer;

  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  position: absolute;

  border-radius: @rad;
  padding: 1rem;
  margin-top: .5rem;
  margin-bottom: 1rem;
  top: 0;
  transform: scale(1);

  overflow: hidden;

  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);

  border: 2px solid transparent;

  &, * {
    position: relative;
  }

  &, .selected-checkmark {
    transition-timing-function: ease-in-out;
    transition-duration: 200ms;
  }

  .book-main {
    text-align: left;
    display: flex;
    flex-direction: column;
    flex-grow: 4;
  }

  .book-main, .book-pre {
    transition-timing-function: ease-in-out;
    transition-duration: 200ms;
  }

  .book-title {
    font-weight: 700;
    margin-bottom: .5rem;
  }

  .book-author {
    font-weight: 400;
  }

  .book-meta {
    text-align: right;
    display: flex;
    flex-grow: 1;
    justify-content: end;
    align-items: end;

    position: relative;
    right: 0;

    width: 100px;
    min-width: 100px;
  }

  .book-pre {
    @wdt: 30px;
    width: @wdt;
    min-width: @wdt;
    margin-right: 1.25rem;
    display: flex;
    flex-direction: column;
    justify-items: start;
    text-align: left;
    opacity: 0.5;

    @media screen and (max-width: 470px) {
      display: none;
    }
  }

  &:hover, &[data-selected="true"] {
    box-shadow: 0 1.25rem 1.5rem -.5rem rgba(0, 0, 0, 0.06);
    border-radius: .5rem;
    background-color: white;

    @media screen and (min-width: @min-width) {
      transform: scale(1.002);
      top: -5px;
    }

    @media handheld and (min-width: @min-width) {
      background-color: inherit;
    }

    .lozenge {
      background: transparent;
    }
  }

  .selected-checkmark {
    position: absolute;
    top: 0;
    right: 1.5rem;
    opacity: 0;
  }

  &[data-selected="true"] {
    background-color: white;
    color: var(--color-primary);
    border: 2px solid var(--color-primary-luscent);

    @media screen and (min-width: @min-width) {
      .book-main, .book-pre {
        margin-left: .5rem;
      }
    }

    .selected-checkmark {
      top: 1rem;
      opacity: 1;
    }
  }

  &[data-borrowed="true"] {
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
