<template>
	<div class="gear-builder" :class="{ editable: editable }">
		<GearPanel :className="className">
			<template v-for="t in ItemSlots" v-slot:[t] :key="t">
				<GearSlot
					:type="t"
					:item="gear[t]"
					:class="{ selected: selectedSlot === t }"
					@click="select(t)"
					@contextmenu.prevent="if (editable) gear[t] = null;"
					@mouseenter="displayTooltip($event, t)"
				/>
			</template>
			<template v-slot:weapon>
				<div
					class="reaper"
					:class="{ selected: selectedSlot === 'reaper' }"
					@click="select('reaper')"
					@contextmenu.prevent="if (editable) gear['reaper'] = null;"
					@mouseenter="displayReaperTooltip($event)"
				>
					<div v-if="gear.reaper">
						<img
							:src="
								require(`../assets/extracted/sprites/spr_reapers_${reaperType}s/spr_reapers_${reaperType}s_${
									gear.reaper.REF ?? 0
								}.png`)
							"
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
	</div>
	<tooltip ref="tooltip"><Legendary :item="hoveredItem"></Legendary></tooltip>
	<tooltip ref="reapertooltip"
		><Reaper v-if="gear.reaper" :item="gear.reaper"></Reaper
	></tooltip>
</template>

<script>
import { ref } from "vue";
import { ItemSlots, Reapers } from "../utils.js";
import GearSlot from "./GearSlot.vue";
import GearPanel from "./GearPanel.vue";
import Legendary from "./Legendary.vue";
import Legendaries from "../assets/extracted/dat_leg.json";
import Reaper from "./Reaper.vue";
import ReaperGallery from "./ReaperGallery.vue";
import Tooltip from "./Tooltip.vue";

export default {
	name: "Gear",
	components: {
		GearSlot,
		GearPanel,
		Legendary,
		Reaper,
		ReaperGallery,
		Tooltip,
	},
	data(props) {
		let gear = {};
		for (let s in props.import)
			if (s !== "reaper" && props.import[s] !== -1)
				gear[s] = Legendaries.find((o) => o.REF === props.import[s]);
		if (props.import?.["reaper"] && props.import?.["reaper"] !== -1)
			gear["reaper"] = Reapers.find((o) => o.REF === props.import["reaper"]);
		return {
			gear: ref(gear),
			selectedSlot: "helm",
			tooltip: ref(null),
			reapertooltip: ref(null),
			hoveredItem: null,
			ItemSlots,
		};
	},
	props: {
		className: { type: String },
		import: {
			type: Object,
			default: () => {
				return {};
			},
		},
		editable: { type: Boolean, default: true },
	},
	methods: {
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
			return r.join();
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
			let n = this.gear?.reaper?.[this.settings.language + "_NAME"]?.split("/");
			if (!n) return "";
			if (n.length > 1 && this.reaperType === "sword") n = n[1];
			else n = n[0];
			return this.t(n, this.t(this.reaperType));
		},
	},
};
</script>

<style scoped>
.gear-builder {
	height: 840px;
}

.gear-builder.editable {
	display: grid;
	grid-template-columns: auto auto;
	gap: 1em;
}

.gear-panel:not(.editable) {
	margin: auto;
}

.editable .reaper,
.editable .gear-slot {
	cursor: pointer;
}

.selected {
	outline: 4px solid rgb(72, 22, 17);
}

.reaper {
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
	margin-top: 30px;
	margin-bottom: 12px;
	padding: 4px;
	border-style: solid;
	border-image-source: url("../assets/img/skill-tree-border.png");
	border-image-slice: 16 16 16 16;
	border-image-width: 12px;
	border-image-outset: 0px 0px 0px 0px;
	border-image-repeat: stretch stretch;
	border-image-outset: 12px;
}
</style>