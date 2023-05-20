<template>
	<div class='search-bar-container content'>
		<div class='search-bar'>
			<Search24 class='search-bar-icon' />
			<input type='text' placeholder='Suchen' @input='onEnter'>
		</div>
	</div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
// @ts-ignore
import Search24 from '@carbon/icons-vue/es/search/24';

@Component({
	components: { Search24 }
})
export default class SearchBar extends Vue {

	debouncer!: number;

	onEnter(e: any) {
		if (this.debouncer) {
			clearTimeout(this.debouncer);
		}
		const timeout = setTimeout(() => {
			this.$emit('enter', e.target.value);
		}, 300);
		this.debouncer = timeout as unknown as number
	}

}
</script>

<style lang='less'>
.search {
  padding: 1rem inherit;
	display: block;
}
.search-bar-container {
  display: block;
  margin: 1rem 0;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  input {
    position: relative;
    padding: 1rem;
    padding-left: 3rem;
    border-radius: .5rem;
    border: 2px solid transparent;
    //margin: 1rem 0;
    background-color: transparent;
    width: 100%;
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

    @media screen and (max-width: 890px) {
      background-color: rgba(255, 255, 255, 10);

      &:hover {
        background-color: rgba(255, 255, 255, 30);
      }
    }
  }

  .search-bar-icon {
    position: absolute;
    left: 1.15rem;
    z-index: 10;
  }

}

</style>
