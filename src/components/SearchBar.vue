<template>
	<div class='search'>
		<div class='search-bar-container content'>
			<div class='search-bar'>
				<Search24 class='search-bar-icon' />
				<DebouncedInput type='text' placeholder='Suchen' v-on="$listeners" />
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
// @ts-ignore
import Search24 from '@carbon/icons-vue/es/search/24';
import DebouncedInput from '@/components/DebouncedInput.vue';

@Component({
	components: { DebouncedInput, Search24 }
})
export default class SearchBar extends Vue {

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

  .search-bar-icon {
    position: absolute;
    left: 1.15rem;
    z-index: 10;
  }
}
</style>
