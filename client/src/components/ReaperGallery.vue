<template>
	<div class="reaper-gallery" :class="{ large: !smallDisplay }">
		<template v-if="smallDisplay">
			<div
				v-for="r in filteredReapers"
				:key="type + r.REF"
				class="weapon-spot"
				:class="type"
				@mouseenter="displayTooltip($event, r)"
				@click="$emit('select', r)"
			>
				<div class="image-container">
					<ReaperIcon :type="type" :item="r" />
				</div>
				<div v-if="r.previous" class="evolve-marker" />
			</div>
			<Tooltip ref="tooltip">
				<ReaperComponent
					:type="type"
					:item="hoveredReaper"
					:key="hoveredReaper.REF"
				/>
			</Tooltip>
		</template>
		<template v-else>
			<ReaperComponent
				v-for="r in filteredReapers"
				:key="type + r.REF"
				:item="r"
				:type="type"
				@click="$emit('select', r)"
			/>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, useTemplateRef } from "vue";
	import { Reapers, type Reaper, type ReaperType } from "../data/Reapers";
	import ReaperIcon from "./ReaperIcon.vue";
	import ReaperComponent from "./Reaper.vue";
	import Tooltip from "./Tooltip.vue";
	import { useSettings } from "../Settings";

	const settings = useSettings();

	const props = withDefaults(
		defineProps<{
			type: ReaperType;
			smallDisplay: boolean;
			lootable: boolean;
		}>(),
		{
			smallDisplay: false,
			lootable: false,
		}
	);
	const tooltip = useTemplateRef<typeof Tooltip>("tooltip");

	const AvailableReapers = computed(() =>
		Reapers.filter((r) => r[`${settings.value.language}_NAME`])
	);

	const filteredReapers = computed(() => {
		return AvailableReapers.value.filter(
			(r) => !props.lootable || r.LOOTABLE !== null
		);
	});

	const hoveredReaper = ref(AvailableReapers.value[0]);

	function displayTooltip(event: MouseEvent, r: Reaper) {
		hoveredReaper.value = r;
		tooltip.value!.display(event);
	}
</script>

<style scoped>
	.reaper-gallery {
		display: flex;
		flex-wrap: wrap;
	}

	.reaper-gallery.large {
		justify-content: space-around;
	}

	.weapon-spot {
		position: relative;
		width: 120px;
		height: 120px;
		background: url("../assets/extracted/sprites/spr_weapon_rarities/spr_weapon_rarities_6.png");
		border-style: solid;
		border-image: url("../assets/extracted/sprites/spr_weapon_spot/spr_weapon_spot_0.png");
		border-image-slice: 18 18 18 18;
		border-image-width: 18px 18px 18px 18px;
		border-image-outset: 0;
		border-image-repeat: stretch stretch;
		box-sizing: border-box;
	}

	.weapon-spot > .image-container {
		overflow: hidden;
		width: 88px;
		height: 88px;
		margin: 13.5px 16px 16px 13.5px;
	}

	.weapon-spot img {
		image-rendering: crisp-edges;
		width: 172px;
	}

	.sword.weapon-spot img {
		margin: -48px -48px;
	}

	.bow.weapon-spot img {
		margin: -32px -32px;
	}

	.staff.weapon-spot img {
		margin: -12px -12px;
	}

	.evolve-marker {
		position: absolute;
		background-image: url("../assets/extracted/sprites/spr_weapon_evolve/spr_weapon_evolve_0.png");
		left: -28px;
		width: 32px;
		height: 56px;
		top: 32px;
		z-index: -1;
	}
</style>
