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
			<div class="type-select">
				<button
					v-for="w in ['sword', 'bow', 'staff']"
					:key="w"
					@click="type = w"
				>
					{{ t(w + "s") }}
				</button>
			</div>
		</div>
		<reaper-gallery
			:type="type"
			:smallDisplay="smallDisplay"
			:lootable="lootable"
		></reaper-gallery>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import Toggle from "./Toggle.vue";
	import ReaperGallery from "./ReaperGallery.vue";

	defineOptions({
		name: "Reapers",
	});

	const props = withDefaults(defineProps<{ large: boolean }>(), {
		large: false,
	});

	const type = ref("sword");
	const lootable = ref(false);
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
