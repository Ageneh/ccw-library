<template>
	<input type='text' placeholder='Suchen' @input='onEnter'>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class DebouncedInput extends Vue {

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

<style lang='less' scoped>
@import "../style.less";
@import "../vars.less";

input {
  padding-left: 3rem;
	margin: 0;
  border-radius: .5rem;
  background-color: transparent;

  @media screen and (max-width: @wd-small) {
    background-color: rgba(255, 255, 255, 10);

    &:hover {
      background-color: rgba(255, 255, 255, 30);
    }
  }
}
</style>
