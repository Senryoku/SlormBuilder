<template>
	<div class="header"><h1>Slorm Reapers</h1></div>
	<div class="filters">
		<div>
			<input type="checkbox" id="smallDisplay" v-model="smallDisplay" /><label
				for="smallDisplay"
				>{{ t("Small Icons") }}</label
			>
		</div>
		{{ t("Filters") }}
		<div>
			<input type="checkbox" v-model="lootable" id="lootable" /><label
				for="lootable"
				>{{ t("Lootable") }}</label
			>
		</div>
		<div class="type-select">
			<button v-for="w in ['Sword', 'Bow', 'Staff']" :key="w" @click="type = w">
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
import ReaperGallery from "./ReaperGallery.vue";

export default {
	components: { ReaperGallery },
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
	align-items: baseline;
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