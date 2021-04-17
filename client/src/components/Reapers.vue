<template>
	<div class="header"><h1>Slorm Reapers</h1></div>
	<div class="filters">
		<div>
			<input type="checkbox" id="smallDisplay" v-model="smallDisplay" /><label
				for="smallDisplay"
				>Small Gallery</label
			>
		</div>
		Filters
		<div>
			<input type="checkbox" id="obtainable" /><label for="obtainable"
				>Obtainable (WIP)</label
			>
			<input type="checkbox" v-model="lootable" id="lootable" /><label
				for="lootable"
				>Lootable</label
			>
		</div>
		<div class="type-select">
			<button v-for="w in ['sword', 'bow', 'staff']" :key="w" @click="type = w">
				{{ w }}
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
			lootable: true,
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
}

.type-select {
	display: flex;
	justify-content: space-around;
}

.type-select > * {
	text-transform: capitalize;
}

.reaper-gallery {
	margin: 1rem auto;
}
</style>