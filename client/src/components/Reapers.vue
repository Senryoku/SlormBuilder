<template>
	<div class="header"><h1>Slorm Reapers</h1></div>
	<div class="filters">
		<div>
			<Toggle v-model="smallDisplay">{{ t("Small Icons") }}</Toggle>
		</div>
		{{ t("Filters") }}
		<div>
			<Toggle v-model="lootable">{{ t("Lootable") }}</Toggle>
		</div>
		<div class="type-select">
			<button v-for="w in ['sword', 'bow', 'staff']" :key="w" @click="type = w">
				{{ t(w + "s") }}
			</button>
		</div>
	</div>
	<reaper-gallery
		:type="type"
		:smallDisplay="smallDisplay"
		:lootable="lootable"
	></reaper-gallery>
</template>

<script>
import Toggle from "./Toggle.vue";
import ReaperGallery from "./ReaperGallery.vue";

export default {
	name: "Reapers",
	components: { ReaperGallery, Toggle },
	data() {
		return {
			type: "sword",
			lootable: false,
			smallDisplay: true,
		};
	},
};
</script>

<style scoped>
.header {
	margin: auto;
	text-align: center;
}

.filters {
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.type-select {
	display: flex;
	justify-content: space-around;
	gap: 1em;
}

.type-select > * {
	text-transform: capitalize;
}

.reaper-gallery {
	margin: 1rem auto;
	width: 95%;
}
</style>