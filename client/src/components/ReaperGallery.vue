<template>
	<div class="reaper-gallery" :class="{ large: !smallDisplay }">
		<template v-if="smallDisplay">
			<div
				v-for="r in filteredReapers"
				:key="type + r.REF"
				class="weapon-slot"
				:class="[type, { primordial: primordial }]"
				@mouseenter="displayTooltip($event, r)"
				@click="$emit('select', r)"
			>
				<div class="image-container">
					<ReaperIcon
						:type="type"
						:item="r"
						:primordial="primordial"
					/>
				</div>
				<div v-if="r.previous" class="evolve-marker" />
			</div>
			<Tooltip ref="tooltip">
				<ReaperComponent
					:type="type"
					:item="hoveredReaper"
					:key="hoveredReaper.REF"
					:primordial="primordial"
				/>
			</Tooltip>
		</template>
		<template v-else>
			<ReaperComponent
				v-for="r in filteredReapers"
				:key="type + r.REF"
				:item="r"
				:type="type"
				:primordial="primordial"
				@click="$emit('select', r)"
			/>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, useTemplateRef } from "vue";
	import { Reapers, type Reaper, type ReaperType } from "@/data/Reapers";
	import ReaperIcon from "./ReaperIcon.vue";
	import ReaperComponent from "./Reaper.vue";
	import Tooltip from "./Tooltip.vue";
	import { useSettings } from "@/Settings";

	const settings = useSettings();

	const props = withDefaults(
		defineProps<{
			type: ReaperType;
			smallDisplay: boolean;
			lootable: boolean;
			primordial: boolean;
		}>(),
		{
			smallDisplay: false,
			lootable: false,
			primordial: false,
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

	.weapon-slot {
		position: relative;
		width: 120px;
		height: 120px;
		background: url("@/assets/extracted/sprites/spr_weapon_spot/spr_weapon_spot_0.png");
		background-size: 100%;

		display: grid;
		place-content: center;

		&.primordial {
			background: transparent;
			&:before {
				content: "";
				position: absolute;
				top: -4px;
				left: -4px;
				width: 128px;
				height: 128px;
			}
			&:nth-child(5n + 1):before {
				background: url("@/assets/extracted/sprites/spr_weapon_spot/spr_weapon_spot_8.png");
			}
			&:nth-child(5n + 2):before {
				background: url("@/assets/extracted/sprites/spr_weapon_spot/spr_weapon_spot_16.png");
			}
			&:nth-child(5n + 3):before {
				background: url("@/assets/extracted/sprites/spr_weapon_spot/spr_weapon_spot_20.png");
			}
			&:nth-child(5n + 4):before {
				background: url("@/assets/extracted/sprites/spr_weapon_spot/spr_weapon_spot_24.png");
			}
			&:nth-child(5n + 5):before {
				background: url("@/assets/extracted/sprites/spr_weapon_spot/spr_weapon_spot_28.png");
			}
		}

		img {
			image-rendering: crisp-edges;
			width: 108px;
			height: 108px;

			margin: var(--margin-y) var(--margin-x);

			&.primordial {
				width: calc(108px * (43 / 30));
				height: calc(108px * (43 / 30));
			}
		}

		&.sword img {
			--margin-x: -4px;
			--margin-y: -4px;
			&.primordial {
				--margin-x: -24px;
				--margin-y: -24px;
			}
		}

		&.bow img {
			--margin-x: 8px;
			--margin-y: 8px;
			&.primordial {
				--margin-x: -16px;
				--margin-y: -16px;
			}
		}

		&.staff img {
			--margin-x: 22px;
			--margin-y: 22px;
			&.primordial {
				--margin-x: 0;
				--margin-y: 0;
			}
		}
	}

	.weapon-slot > .image-container {
		background: url("@/assets/extracted/sprites/spr_weapon_rarities/spr_weapon_rarities_6.png");
		overflow: hidden;
		width: 96px;
		height: 96px;
		background-size: 100%;
	}

	.evolve-marker {
		position: absolute;
		background-image: url("@/assets/extracted/sprites/spr_weapon_evolve/spr_weapon_evolve_0.png");
		left: -28px;
		width: 32px;
		height: 56px;
		top: 32px;
		z-index: -1;
	}
</style>
