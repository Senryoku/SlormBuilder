<template>
	<div class="header"><h1>Slorm Reapers</h1></div>
	<div class="type-select">
		<button v-for="w in ['sword', 'bow', 'staff']" :key="w" @click="type = w">
			{{ w }}
		</button>
	</div>
	<div class="gallery">
		<Reaper v-for="l in Reapers" :key="type + l.REF" :item="l" :type="type" />
	</div>
</template>

<script>
import Reaper from "./Reaper.vue";
import Reapers from "../assets/data/dat_rea.json";
export default {
	components: { Reaper },
	data() {
		return {
			Reapers,
			type: "sword",
		};
	},
};
</script>

<style scoped>
.header {
	margin: auto;
	text-align: center;
}

.type-select {
	display: flex;
	justify-content: space-around;
}

.type-select > * {
	text-transform: capitalize;
}

.gallery {
	display: flex;
	flex-wrap: wrap;
}
</style>