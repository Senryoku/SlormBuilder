<template>
	<div
		class="rune-slot"
		:class="{
			large: rune.REF >= 7 && rune.REF < 8 + 13,
			selected: selected,
		}"
	>
		<img :src="rune.icon" :alt="name" ref="icon" />
		<Tooltip ref="tooltip" v-if="tooltip">
			<RuneComponent :rune="rune" />
		</Tooltip>
	</div>
</template>

<script setup lang="ts">
	import { computed, onMounted, onUnmounted, useTemplateRef } from "vue";
	import { useSettings } from "@/Settings";
	import { type Rune } from "@/data/Runes";
	import RuneComponent from "./Rune.vue";
	import Tooltip from "./Tooltip.vue";

	const settings = useSettings();

	const props = withDefaults(
		defineProps<{
			rune: Rune;
			selected?: boolean;
			tooltip?: boolean;
		}>(),
		{ selected: false, tooltip: false }
	);

	const icon = useTemplateRef("icon");
	const tooltipComponent = useTemplateRef("tooltip");

	onMounted(() => {
		if (props.tooltip) {
			icon.value?.addEventListener("mouseenter", onMouseEnter);
		}
	});

	onUnmounted(() => {
		if (props.tooltip) {
			icon.value?.removeEventListener("mouseenter", onMouseEnter);
		}
	});

	const onMouseEnter = (event: MouseEvent) => {
		if (props.tooltip) tooltipComponent.value!.display(event);
	};

	const name = computed(() => {
		return props.rune[`${settings.value.language}_NAME`];
	});
</script>

<style scoped>
	.rune-slot {
		display: flex;
		place-items: center;
		justify-content: center;
		position: relative;

		width: 52px;
		height: 52px;
		background-image: url("@/assets/extracted/sprites/spr_runes_button/spr_runes_button_0.png");

		&.selected {
			background-image: url("@/assets/extracted/sprites/spr_runes_button/spr_runes_button_4.png");
		}

		&.large {
			width: 60px;
			height: 60px;
			background-image: url("@/assets/extracted/sprites/spr_runes_button_large/spr_runes_button_large_0.png");

			img {
				width: 60px;
				height: 60px;
			}

			&.selected {
				background-image: url("@/assets/extracted/sprites/spr_runes_button_large/spr_runes_button_large_4.png");
			}
		}

		&.level-15:after {
			content: "";
			position: absolute;
			bottom: -8px;
			width: 60px;
			height: 40px;
			background-image: url("@/assets/extracted/sprites/spr_runes_rank/spr_runes_rank_15.png");
		}
	}
</style>
