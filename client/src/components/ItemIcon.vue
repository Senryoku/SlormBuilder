<template>
	<div class="item-icon">
		<img :src="image" :alt="name" />
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { useSettings } from "../Settings";
	import { type Legendary, LegendaryIcons } from "@/data/Legendaries";

	const TypeOffsets: Record<string, number> = {
		helm: 1,
		body: 30,
		shoulder: 61,
		bracer: 83,
		glove: 105,
		boot: 127,
		ring: 148,
		amulet: 158,
		belt: 168,
		cape: 178,
	};

	const settings = useSettings();

	const props = defineProps<{
		item: Legendary;
	}>();

	const image =
		LegendaryIcons[
			props.item.SPRITE !== null
				? TypeOffsets[props.item.ITEM] + props.item.SPRITE
				: 0
		];

	const name = computed(() => {
		return props.item[`${settings.value.language}_NAME`];
	});
</script>

<style scoped>
	.item-icon {
		position: relative;
		width: 56px;
		height: 56px;
		background-image: url("@/assets/extracted/sprites/spr_inventory_rarity_back/spr_inventory_rarity_back_4.png");
	}

	.item-icon img {
		position: absolute;
		bottom: 0;
		right: 50%;
		transform: translateX(50%);
	}
</style>
