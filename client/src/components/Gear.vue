<template>
	<div class="gear-builder" :class="{ editable: editable }">
		<GearPanel :className="className">
			<template v-for="t in ItemSlots" v-slot:[t] :key="t">
				<GearSlot
					:type="t"
					:item="gear[t]"
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
					@contextmenu.prevent="if (editable) gear[t] = null;"
					@mouseenter="displayTooltip($event, t)"
				/>
			</template>
			<template v-slot:weapon>
				<div
					class="reaper-slot"
					:class="{ selected: selectedSlot === 'reaper' }"
					@click="select('reaper')"
					@contextmenu.prevent="if (editable) gear['reaper'] = null;"
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
				<reaper-gallery
					:type="reaperType"
					@select="selectItem"
				></reaper-gallery>
			</div>
			<div class="item-gallery" v-else>
				<div
					v-for="i in galleryItems"
					:key="i.REF"
					class="clickable"
					@click="selectItem(i)"
				>
					<Legendary :item="i" />
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
						<span
							>{{ index + 1 }}. {{ translate(element.REF)
							}}{{ element.PERCENT === "%" ? " (%)" : "" }}</span
						>
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
							{{ translate(s.REF)
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
		<Legendary v-if="hoveredItem" :item="hoveredItem"></Legendary>
	</tooltip>
	<tooltip ref="reapertooltip">
		<Reaper v-if="gear.reaper" :item="gear.reaper"></Reaper>
	</tooltip>
</template>

<script>
	import { ref } from "vue";
	import { ItemSlots, Reapers, spritesByIndex } from "../utils.js";
	import draggable from "vuedraggable";
	import Stats from "../assets/data/item_stats.json";
	import GearSlot from "./GearSlot.vue";
	import GearPanel from "./GearPanel.vue";
	import Legendary from "./Legendary.vue";
	import Legendaries from "../assets/extracted/dat_leg.json";
	import Reaper from "./Reaper.vue";
	import ReaperGallery from "./ReaperGallery.vue";
	import Tooltip from "./Tooltip.vue";

	import ReaperIcons from "../ReaperIcons.ts";

	export default {
		name: "Gear",
		components: {
			GearSlot,
			GearPanel,
			Legendary,
			Reaper,
			ReaperGallery,
			Tooltip,
			draggable,
		},
		data() {
			return {
				Stats,
				gear: ref({}),
				selectedSlot: "helm",
				statPriority: ref([]),
				selectedStat: ref(Stats[0]),
				hoveredStat: ref(null),
				tooltip: ref(null),
				reapertooltip: ref(null),
				hoveredItem: null,
				ItemSlots,
			};
		},
		props: {
			className: { type: String },
			editable: { type: Boolean, default: true },
		},
		methods: {
			reaperIcon(type, index) {
				return ReaperIcons[type][index];
			},
			select(type) {
				this.selectedSlot = type;
			},
			selectItem(item) {
				this.gear[this.selectedSlot] = item;
			},
			displayTooltip(event, type) {
				this.hoveredItem = this.gear[type];
				this.$refs.tooltip.display(event);
			},
			displayReaperTooltip(event) {
				this.$refs.reapertooltip.display(event);
			},
			serialize() {
				let r = [];
				for (let slot of ItemSlots) r.push(this.gear[slot]?.REF ?? -1);
				r.push(this.gear["reaper"]?.REF ?? -1);
				r.push(this.statPriority.length);
				for (let s of this.statPriority) r.push(s.REF_NB);
				return r.join();
			},
			import(importGear, statPriority) {
				let gear = {};
				for (let s in importGear)
					if (s !== "reaper" && importGear[s] !== -1)
						gear[s] = Legendaries.find(
							(o) => o.REF === importGear[s]
						);
				if (importGear?.["reaper"] && importGear?.["reaper"] !== -1)
					gear["reaper"] = Reapers.find(
						(o) => o.REF === importGear["reaper"]
					);
				this.gear = gear;

				if (statPriority)
					this.statPriority = statPriority.map((ref) =>
						this.Stats.find((s) => s.REF_NB === ref)
					);
			},
			importSave(gear) {
				this.gear = {};
				for (let slot in gear) {
					this.gear[slot] = (
						slot === "reaper" ? Reapers : Legendaries
					).find((l) => l.REF === gear[slot].REF);
				}
			},
		},
		computed: {
			galleryItems() {
				if (this.selectedSlot === "reaper") return [];
				let slot = this.selectedSlot;
				if (slot === "ring0" || slot === "ring1") slot = "ring";
				return Legendaries.filter((o) => o.ITEM === slot);
			},
			reaperType() {
				return { knight: "sword", huntress: "bow", mage: "staff" }[
					this.className
				];
			},
			reaperName() {
				let n =
					this.gear?.reaper?.[
						this.settings.value.language + "_NAME"
					]?.split("/");
				if (!n) return "";
				if (n.length > 1 && this.reaperType === "sword") n = n[1];
				else n = n[0];
				return this.t(n, this.t(this.reaperType));
			},
			orderedStats() {
				return this.Stats.filter(
					(s) => !this.statPriority.includes(s)
				).sort((a, b) => this.translate(a.REF) > this.translate(b.REF));
			},
		},
	};
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
		border-image-source: url("../assets/img/skill-tree-border.png");
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
		background-image: url("../assets/extracted/sprites/spr_tutorial_arrow/spr_tutorial_arrow_0.png");
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
		background-image: url("../assets/extracted/sprites/spr_plus_button_mini/spr_plus_button_mini_0.png");
	}
	.plus-button:hover {
		background-image: url("../assets/extracted/sprites/spr_plus_button_mini/spr_plus_button_mini_1.png");
	}
	.plus-button:active {
		background-image: url("../assets/extracted/sprites/spr_plus_button_mini/spr_plus_button_mini_2.png");
	}

	.minus-button {
		background-image: url("../assets/extracted/sprites/spr_minus_button_mini/spr_minus_button_mini_0.png");
	}
	.minus-button:hover {
		background-image: url("../assets/extracted/sprites/spr_minus_button_mini/spr_minus_button_mini_1.png");
	}
	.minus-button:active {
		background-image: url("../assets/extracted/sprites/spr_minus_button_mini/spr_minus_button_mini_2.png");
	}
</style>
