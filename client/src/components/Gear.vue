<template>
	<div class="gear-builder" :class="{ editable: editable }">
		<GearPanel :className="className">
			<template v-for="t in ItemSlots" v-slot:[t] :key="t">
				<GearSlot
					:type="t"
					:item="gear[t] as Legendary"
					:class="{
						selected: selectedSlot === t,
						primary:
							hoveredStat?.[t.startsWith('ring') ? 'ring' : t] ===
							'P',
						secondary:
							hoveredStat?.[t.startsWith('ring') ? 'ring' : t] ===
							'S',
					}"
					@click="select(t)"
					@contextmenu.prevent="if (editable) gear[t] = undefined;"
					@mouseenter="displayTooltip($event, t)"
				/>
			</template>
			<template v-slot:weapon>
				<div
					class="reaper-slot"
					:class="{ selected: selectedSlot === 'reaper' }"
					@click="select('reaper')"
					@contextmenu.prevent="
						if (editable) gear['reaper'] = undefined;
					"
					@mouseenter="displayReaperTooltip($event)"
				>
					<div v-if="gear.reaper">
						<img
							:src="reaperIcon(reaperType, gear.reaper.REF ?? 0)"
						/>
						<div>
							{{ reaperName }}
						</div>
					</div>
				</div>
			</template>
		</GearPanel>
		<template v-if="editable">
			<div class="item-gallery" v-if="selectedSlot === 'reaper'">
				<ReaperGallery
					:type="reaperType"
					@select="selectItem"
					:lootable="false"
					:smallDisplay="false"
				/>
			</div>
			<div class="item-gallery" v-else>
				<div
					v-for="i in galleryItems"
					:key="i.REF"
					class="clickable"
					@click="selectItem(i)"
				>
					<LegendaryComponent :item="i" />
				</div>
			</div>
		</template>
		<div class="stats-priority">
			<h2>{{ t("Stats. Priority") }}</h2>
			<div v-if="statPriority.length === 0" style="text-align: center">
				{{ t("Priority list is empty.") }}
			</div>
			<draggable
				v-model="statPriority"
				group="statPriority"
				tag="ol"
				item-key="REF"
				:disabled="!editable"
			>
				<template #item="{ element, index }">
					<li
						@mouseenter="hoveredStat = element"
						@mouseleave="hoveredStat = null"
					>
						<span>
							{{ index + 1 }}.
							{{ translate(element.REF, settings.language) }}
							{{ element.PERCENT === "%" ? " (%)" : "" }}
						</span>
						<div
							class="minus-button"
							@click="statPriority.splice(index, 1)"
							v-if="editable"
						></div>
					</li>
				</template>
			</draggable>
			<template v-if="editable">
				<div style="display: flex; justify-content: center">
					<select v-model="selectedStat">
						<option
							v-for="s in orderedStats"
							:key="s.REF_NB"
							:value="s"
						>
							{{ translate(s.REF, settings.language)
							}}{{ s.PERCENT === "%" ? " (%)" : "" }}
						</option>
					</select>
					<div
						class="plus-button"
						@click="
							if (selectedStat) {
								statPriority.push(selectedStat);
								selectedStat = orderedStats[0];
							}
						"
					></div>
				</div>
				<div class="help">
					{{
						t(
							"Add stats. to the list using the dropdown and re-order them by drag & dropping."
						)
					}}
				</div>
			</template>
			<div class="help">
				{{
					t(
						"Hover over a stat to see on which item slots you can find it."
					)
				}}
				<div>
					<div
						class="primary"
						style="
							display: inline-block;
							margin: 10px;
							padding: 4px;
						"
					>
						{{ t("Primary") }}
					</div>
					<div
						class="secondary"
						style="
							display: inline-block;
							margin: 10px;
							padding: 4px;
						"
					>
						{{ t("Secondary") }}
					</div>
				</div>
			</div>
		</div>
	</div>
	<tooltip ref="tooltip">
		<LegendaryComponent v-if="hoveredItem" :item="hoveredItem" />
	</tooltip>
	<tooltip ref="reapertooltip">
		<ReaperComponent v-if="selectedReaper" :item="selectedReaper" />
	</tooltip>
</template>

<script setup lang="ts">
	import { ref, computed, useTemplateRef } from "vue";
	import {
		ItemSlots,
		localize,
		translate,
		type ClassName,
		type ItemSlot,
	} from "@/utils";
	import draggable from "vuedraggable";
	import Stats from "@/assets/data/item_stats.json";
	import GearSlot from "./GearSlot.vue";
	import GearPanel from "./GearPanel.vue";
	import LegendaryComponent from "./Legendary.vue";
	import Legendaries from "@/assets/extracted/dat_leg.json";
	import ReaperComponent from "./Reaper.vue";
	import ReaperGallery from "./ReaperGallery.vue";
	import Tooltip from "./Tooltip.vue";

	import {
		ReaperIcons,
		Reapers,
		type Reaper,
		type ReaperType,
	} from "@/data/Reapers.ts";
	import { useSettings } from "@/Settings";
	import type { Legendary } from "@/data/Legendaries.ts";

	type GearSlot = ItemSlot | "reaper";
	type GearSet = Partial<Record<GearSlot, Legendary | Reaper>>;

	const gear = ref<GearSet>({});
	const selectedSlot = ref<GearSlot>("helm");
	const statPriority = ref<(typeof Stats)[number][]>([]);
	const selectedStat = ref(Stats[0]);
	const hoveredStat = ref(null);
	const tooltip = useTemplateRef("tooltip");
	const reapertooltip = useTemplateRef("reapertooltip");
	const hoveredItem = ref<Legendary | null>(null);

	const settings = useSettings();

	const props = withDefaults(
		defineProps<{
			className: ClassName;
			editable: boolean;
		}>(),
		{ editable: true }
	);

	function reaperIcon(type: ReaperType, index: number) {
		return ReaperIcons[type][index];
	}

	function select(type: GearSlot): void {
		selectedSlot.value = type;
	}

	function selectItem(item: Legendary | Reaper): void {
		gear.value[selectedSlot.value] = item;
	}

	function displayTooltip(event: MouseEvent, type: ItemSlot) {
		hoveredItem.value = gear.value[type] as Legendary;
		tooltip.value?.display(event);
	}

	function displayReaperTooltip(event: MouseEvent) {
		reapertooltip.value?.display(event);
	}

	const selectedReaper = computed(
		() => gear.value["reaper"] as Reaper | null
	);

	const galleryItems = computed(() => {
		if (selectedSlot.value === "reaper") return [];
		const slot = selectedSlot.value;
		const itemType = slot === "ring0" || slot === "ring1" ? "ring" : slot;
		return Legendaries.filter((o) => o.ITEM === itemType);
	});

	const reaperType = computed(() => {
		return { knight: "sword", huntress: "bow", mage: "staff" }[
			props.className
		] as ReaperType;
	});

	const reaperName = computed(() => {
		const name =
			gear.value.reaper?.[`${settings.value.language}_NAME`]?.split("/");
		if (!name) return "";
		const ref_name =
			name.length > 1 && reaperType.value === "sword" ? name[1] : name[0];
		return localize(
			settings.value.language,
			ref_name,
			localize(settings.value.language, reaperType.value)
		);
	});

	const orderedStats = computed(() => {
		return Stats.filter((s) => !statPriority.value.includes(s)).sort(
			(a, b) =>
				translate(a.REF, settings.value.language).localeCompare(
					translate(b.REF, settings.value.language)
				)
		);
	});

	function serialize() {
		let r = [];
		for (let slot of ItemSlots) r.push(gear.value[slot]?.REF ?? -1);
		r.push(gear.value["reaper"]?.REF ?? -1);
		r.push(statPriority.value.length);
		for (let s of statPriority.value) r.push(s.REF_NB);
		return r.join();
	}

	function importGear(
		importGear: Partial<Record<GearSlot, number>>,
		importStatPriority: number[]
	) {
		const tmp: GearSet = {};
		for (let s of ItemSlots) {
			if (importGear[s] && importGear[s] !== -1)
				tmp[s] = Legendaries.find((o) => o.REF === importGear[s]);
		}
		if (importGear["reaper"] && importGear["reaper"] !== -1)
			tmp["reaper"] = Reapers.find((o) => o.REF === importGear["reaper"]);
		gear.value = tmp;

		statPriority.value = importStatPriority.map(
			(ref) => Stats.find((s) => s.REF_NB === ref)!
		);
	}

	function importSave(importedGear: GearSet) {
		gear.value = {};
		for (let slot of [...ItemSlots, "reaper"] as (keyof GearSet)[]) {
			if (!importedGear[slot]) gear.value[slot] = undefined;
			else {
				gear.value[slot] = (
					slot === "reaper" ? Reapers : Legendaries
				).find((l) => l.REF === importedGear[slot]!.REF);
			}
		}
	}

	defineExpose({ serialize, importGear, importSave });
</script>

<style scoped>
	.gear-builder {
		min-height: 840px;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.gear-builder.editable {
		display: grid;
		grid-template-columns: auto auto auto;
		gap: 1em;
	}

	.gear-builder:not(.editable) {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 3em;
	}

	.editable .reaper-slot,
	.editable .gear-slot {
		cursor: pointer;
	}

	.editable .selected {
		outline: 4px solid rgb(72, 22, 17);
	}

	.editable .selected.primary,
	.primary {
		outline: 4px solid var(--color-rare);
	}

	.editable .selected.secondary,
	.secondary {
		outline: 4px solid var(--color-magic);
	}

	.reaper-slot {
		width: 100%;
		height: 100%;
	}

	.weapon img {
		margin: auto;
		width: 180px;
		image-rendering: pixelated;
	}

	.item-gallery {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		overflow-y: scroll;
		padding: 4px;
	}

	.item-gallery,
	.stats-priority {
		border-style: solid;
		border-image-source: url("@/assets/img/skill-tree-border.png");
		border-image-slice: 16 16 16 16;
		border-image-width: 12px;
		border-image-outset: 0px 0px 0px 0px;
		border-image-repeat: stretch stretch;
		border-image-outset: 12px;
		margin: 6px;
		margin-top: 30px;
		margin-bottom: 18px;
	}

	.stats-priority li {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: default;
	}

	.editable .stats-priority li {
		cursor: grab;
	}

	.stats-priority li:hover {
		color: white;
	}

	.stats-priority li:hover::before {
		position: absolute;
		content: "";
		left: -1em;
		background-image: url("@/assets/extracted/sprites/spr_tutorial_arrow/spr_tutorial_arrow_0.png");
		background-size: contain;
		width: 0.82em;
		height: 1em;
	}

	.stats-priority ol {
		padding-left: 1em;
		padding-right: 1em;
	}

	.minus-button,
	.plus-button {
		display: inline-block;
		width: 32px;
		height: 32px;
		vertical-align: middle;
		cursor: pointer;
	}

	.stats-priority .help {
		font-size: 0.9em;
		color: #888;
		margin: 0.5em auto;
		max-width: 17em;
		text-align: center;
	}

	.plus-button {
		background-image: url("@/assets/extracted/sprites/spr_plus_button_mini/spr_plus_button_mini_0.png");
	}
	.plus-button:hover {
		background-image: url("@/assets/extracted/sprites/spr_plus_button_mini/spr_plus_button_mini_1.png");
	}
	.plus-button:active {
		background-image: url("@/assets/extracted/sprites/spr_plus_button_mini/spr_plus_button_mini_2.png");
	}

	.minus-button {
		background-image: url("@/assets/extracted/sprites/spr_minus_button_mini/spr_minus_button_mini_0.png");
	}
	.minus-button:hover {
		background-image: url("@/assets/extracted/sprites/spr_minus_button_mini/spr_minus_button_mini_1.png");
	}
	.minus-button:active {
		background-image: url("@/assets/extracted/sprites/spr_minus_button_mini/spr_minus_button_mini_2.png");
	}
</style>
