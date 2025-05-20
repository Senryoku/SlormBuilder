<template>
	<div class="reapers">
		<div class="header"><h1>Slorm Reapers</h1></div>
		<div class="filters">
			<div>
				<Toggle v-model="smallDisplay">{{ t("Small Icons") }}</Toggle>
			</div>
			{{ t("Filters") }}
			<div>
				<Toggle v-model="lootable">{{ t("Lootable") }}</Toggle>
			</div>
			<div>
				<Toggle v-model="primordial">{{ t("Primordial") }}</Toggle>
			</div>
			<div class="type-select">
				<button v-for="rt in ReaperTypes" :key="rt" @click="type = rt">
					{{ t(rt + "s") }}
				</button>
			</div>
		</div>
		<reaper-gallery
			:type="type"
			:smallDisplay="smallDisplay"
			:lootable="lootable"
			:primordial="primordial"
		></reaper-gallery>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import Toggle from "@/components/Toggle.vue";
	import ReaperGallery from "@/components/ReaperGallery.vue";
	import { type ReaperType, ReaperTypes } from "@/data/Reapers";

	const props = withDefaults(defineProps<{ large: boolean }>(), {
		large: false,
	});

	const type = ref<ReaperType>("sword");
	const lootable = ref(false);
	const primordial = ref(false);
	const smallDisplay = ref(!props.large);
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
