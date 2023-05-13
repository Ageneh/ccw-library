<template>
	<div class='filter' :data-selected='selected' @click='onClick'>
		<p>{{ title }}</p>
	</div>
</template>

<script lang='ts'>
import { Component, ModelSync, Prop, Vue } from 'vue-property-decorator';

@Component
export default class BookFilter extends Vue {
	@ModelSync(
		'active',
		'change',
		{ type: Boolean, default: false }
	) selected!: boolean;

	@Prop() private title!: string;

	onClick() {
		this.selected = !this.selected;
	}
}
</script>

<style lang='less'>
@primary-color: #296b6a;
@primary-color-transluscent: rgba(41, 107, 106, 0.3);
@transparent: rgba(0, 0, 0, 0);

.filter {
	display:  flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	max-height: 40px;
	//width: 200px;

  background-color: rgba(0, 0, 0, .1);
  margin-left: 1rem;

  padding: .5rem 1rem;
  border-radius: 2rem;

	transition-timing-function:ease-in-out;
	transition-property: background-color, color;
	transition-duration: 250ms;

  //color: @primary-color;

  border: 2px solid transparent;

  &[data-selected="true"] {
    background-color: @primary-color;
		color: white;
    border: 2px solid @primary-color-transluscent;
  }
}
</style>
