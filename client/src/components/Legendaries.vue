<template>
	<div class="header">
		<h1>{{ t("Legendaries") }}</h1>
	</div>
	<div class="filters">
		<div>
			<label for="slot" style="margin-right: 1em">{{ t("Item Slot") }}</label>
			<select id="slot" v-model="selectedSlot">
				<option value="">{{ t("All") }}</option>
				<option v-for="s in ItemTypes" :key="s" :value="s">{{ t(s) }}</option>
			</select>
		</div>
		<Toggle v-model="lootable">{{ t("Lootable Only") }}</Toggle>
	</div>
	<div class="gallery">
		<Legendary v-for="l in filteredList" :key="l.REF" :item="l" />
	</div>
</template>

<script>
import { ref } from "vue";
import { ItemTypes } from "../utils.js";
import Toggle from "./Toggle.vue";
import Legendary from "./Legendary.vue";
import Legendaries from "../assets/extracted/dat_leg.json";

export default {
	name: "Legendaries",
	components: { Toggle, Legendary },
	data() {
		return {
			ItemTypes,
			Legendaries,
			selectedSlot: ref(""),
			lootable: ref(false),
		};
	},
	computed: {
		filteredList() {
			return Legendaries.filter(
				(l) =>
					(this.selectedSlot === "" || l.ITEM === this.selectedSlot) &&
					(!this.lootable || l.LOOTABLE)
			);
		},
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
	margin: 1em 0;
}

.filters {
	margin: 0 2em;
	display: flex;
	gap: 1em;
	justify-content: space-around;
	align-items: center;
}
</style>