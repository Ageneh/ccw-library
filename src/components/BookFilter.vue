<template>
	<div class='filter transitioned' :data-selected='active' @click='onClick'>
		{{ title }}
	</div>
</template>

<script lang='ts'>
import { Component, ModelSync, Prop, VModel, Vue } from 'vue-property-decorator';

@Component
export default class BookFilter extends Vue {
	@Prop(
		{ type: Boolean }
	) selected!: boolean;
	private active: boolean = false

	@Prop() private title!: string;

	@Prop({required: false}) private label!: string;

	get activeValue(): boolean {
		return this.active
	}

	set activeValue(val: boolean) {
		this.active = val;
		this.$emit("update", {category: this.label || this.title, active: this.active})
	}

	onClick(e: any) {
		this.activeValue = !this.active;
	}
}
</script>

<style lang='less'>
@transparent: rgba(0, 0, 0, 0);

.filter {
	&:first-of-type {
    margin-left: initial;
	}

  cursor: pointer;

	display:  flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	max-height: 40px;
	//width: 200px;

  background-color: var(--loader-bg-color);
  margin-left: 1rem;

  padding: .5rem 1rem;
  border-radius: 2rem;

  border: 2px solid transparent;

	white-space: nowrap;

  &[data-selected="true"] {
    background-color: var(--color-primary);
		color: white;
    border: 2px solid var(--color-primary-luscent);
  }
}
</style>
