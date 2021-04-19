<template>
	<div class="header">
		<h1>{{ t("Legendaries") }}</h1>
	</div>
	<div class="gallery">
		<Legendary v-for="l in Legendaries" :key="l.REF" :item="l" />
	</div>
</template>

<script>
import Legendary from "./Legendary.vue";
import Legendaries from "../assets/data/dat_leg.json";
export default {
	components: { Legendary },
	data() {
		return {
			Legendaries,
		};
	},
};
</script>

<style scoped>
.header {
	margin: auto;
	text-align: center;
}

.gallery {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
}
</style>