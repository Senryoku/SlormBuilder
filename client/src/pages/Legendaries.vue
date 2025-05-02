<template>
	<div class="legendaries">
		<div class="header">
			<h1>{{ t("Legendaries") }}</h1>
		</div>
		<div class="filters">
			<div>
				<label for="slot" style="margin-right: 1em">{{
					t("Item Slot")
				}}</label>
				<select id="slot" v-model="selectedSlot">
					<option value="">{{ t("All") }}</option>
					<option v-for="s in ItemTypes" :key="s" :value="s">
						{{ t(s) }}
					</option>
				</select>
			</div>
			<Toggle v-model="lootable">{{ t("Lootable Only") }}</Toggle>
		</div>
		<div class="gallery">
			<Legendary v-for="l in filteredList" :key="l.REF" :item="l" />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import { ItemTypes } from "@/utils";
	import Toggle from "@/components/Toggle.vue";
	import Legendary from "@/components/Legendary.vue";
	import { Legendaries } from "@/data/Legendaries";

	const selectedSlot = ref("");
	const lootable = ref(true);

	const filteredList = computed(() => {
		return Legendaries.filter(
			(l) =>
				(selectedSlot.value === "" || l.ITEM === selectedSlot.value) &&
				(!lootable.value || l.LOOTABLE)
		);
	});
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
