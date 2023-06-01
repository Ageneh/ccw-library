<template>
	<div class='book-entry loader'>
		<div class='book-pre'>
			<p class='book-id loader-item'><LoaderParagraph/></p>
		</div>
		<div class='book-main'>
			<h4 class='book-title loader-item'><LoaderParagraph class='book-id'/></h4>
			<p class='book-author loader-item'><br></p>
		</div>
<!--		<div class='book-meta'>-->
<!--			<p class='book-owner lozenge loader-item'><br></p>-->
<!--		</div>-->
	</div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator';
import BookEntry from '@/components/BookEntry.vue';
import LoaderParagraph from '@/components/loader/LoaderParagraph.vue';

@Component({
	components: { LoaderParagraph }
})
export default class BookEntryLoader extends BookEntry {
}
</script>

<style lang='less' scoped>
@import "../../style.less";

.book-entry {
  background-color: rgba(255, 255, 255, 0.75);
	box-shadow: none;
}

.book-id.loader-item, .book-owner.loader-item {
	width: 3rem;
}

.book-id {
  max-width: 2rem;
}

.book-title {
  max-width: 50%;
}

.book-author {
  max-width: 30%;
}
</style>
