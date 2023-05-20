<template>
	<div class='filter loader'>
		<LoaderParagraph/>
	</div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator';
import BookFilter from '@/components/BookFilter.vue';
import LoaderParagraph from '@/components/loader/LoaderParagraph.vue';

@Component({
	components: { LoaderParagraph }
})
export default class BookFilterLoader extends BookFilter {

	data() {
		return {
			randWidth: `${Math.floor((Math.random() * 5) + 5)}rem`
		};
	}

}
</script>

<style lang='less'>
@import "../../style.less";
.filter {
  position: relative;
}
</style>
