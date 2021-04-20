<template>
	<div class="gear-builder" :class="{ editable: editable }">
		<div class="gear unselectable">
			<div class="character" :class="className"></div>
			<div class="gear-slots">
				<div class="top">
					<gear-slot
						v-for="t in ['helm', 'amulet']"
						:key="t"
						:type="t"
						:item="gear[t]"
						:class="{ selected: selectedSlot === t }"
						@click="select(t)"
						@contextmenu.prevent="gear[t] = null"
						@mouseenter="displayTooltip($event, t)"
					/>
				</div>
				<div class="left">
					<gear-slot
						v-for="t in ['shoulder', 'bracer', 'glove']"
						:key="t"
						:type="t"
						:item="gear[t]"
						:class="{ selected: selectedSlot === t }"
						@click="select(t)"
						@contextmenu.prevent="gear[t] = null"
						@mouseenter="displayTooltip($event, t)"
					/>
				</div>
				<div class="right">
					<gear-slot
						v-for="t in ['body', 'cape', 'belt']"
						:key="t"
						:type="t"
						:item="gear[t]"
						:class="{ selected: selectedSlot === t }"
						@click="select(t)"
						@contextmenu.prevent="gear[t] = null"
						@mouseenter="displayTooltip($event, t)"
					/>
				</div>
				<div class="rings">
					<gear-slot
						v-for="t in ['ring0', 'ring1']"
						:key="t"
						:type="t"
						:item="gear[t]"
						:class="{ selected: selectedSlot === t }"
						@click="select(t)"
						@contextmenu.prevent="gear[t] = null"
						@mouseenter="displayTooltip($event, t)"
					/>
				</div>
				<gear-slot
					type="boot"
					:item="gear['boot']"
					:class="{ selected: selectedSlot === 'boot' }"
					@click="select('boot')"
					@contextmenu.prevent="gear['boot'] = null"
					@mouseenter="displayTooltip($event, 'boot')"
				/>
			</div>
			<div class="v-separator">
				<img
					src="../assets/data/sprites/spr_inventory_v_separator/spr_inventory_v_separator_0.png"
				/>
			</div>
			<div
				class="weapon"
				:class="{ selected: selectedSlot === 'reaper' }"
				@click="select('reaper')"
				@contextmenu.prevent="gear['reaper'] = null"
				@mouseenter="displayReaperTooltip($event)"
			>
				<div v-if="gear.reaper">
					<img
						:src="
							require(`../assets/data/sprites/spr_reapers_${reaperType}s/spr_reapers_${reaperType}s_${
								gear.reaper.REF ?? 0
							}.png`)
						"
					/>
					<div>
						{{ reaperName }}
					</div>
				</div>
			</div>
		</div>
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
import Legendary from "./Legendary.vue";
import Legendaries from "../assets/data/dat_leg.json";
import Reaper from "./Reaper.vue";
import ReaperGallery from "./ReaperGallery.vue";
import Tooltip from "./Tooltip.vue";

export default {
	name: "Gear",
	components: { GearSlot, Legendary, Reaper, ReaperGallery, Tooltip },
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

.gear {
	position: relative;
	width: 572px;
	height: 840px;
	background-image: url("../assets/data/sprites/spr_inventory_slot_panel/spr_inventory_slot_panel_0.png");
	padding: 40px 10px 10px 10px;
	box-sizing: border-box;
}

.gear:not(.editable) {
	margin: auto;
}

.character {
	position: absolute;
	top: 205px;
	left: 50%;
	transform: translateX(calc(-50% + 8px)) scaleX(-1);
	animation-duration: 1000ms;
	animation-iteration-count: infinite;
	animation-direction: forward;
	width: 130px;
	height: 146.25px;
	background-size: cover;
	image-rendering: crisp-edges; /* Firefox */
	image-rendering: pixelated; /* Chrome */
}

.knight {
	animation-name: idle-animation-knight;
}
.huntress {
	animation-name: idle-animation-huntress;
}
.mage {
	animation-name: idle-animation-mage;
}

@keyframes idle-animation-knight {
	0% {
		background-image: url("../assets/data/sprites/spr_npc_knight_idle/spr_npc_knight_idle_0.png");
	}
	25% {
		background-image: url("../assets/data/sprites/spr_npc_knight_idle/spr_npc_knight_idle_1.png");
	}
	50% {
		background-image: url("../assets/data/sprites/spr_npc_knight_idle/spr_npc_knight_idle_2.png");
	}
	75% {
		background-image: url("../assets/data/sprites/spr_npc_knight_idle/spr_npc_knight_idle_3.png");
	}
	100% {
		background-image: url("../assets/data/sprites/spr_npc_knight_idle/spr_npc_knight_idle_0.png");
	}
}

@keyframes idle-animation-huntress {
	0% {
		background-image: url("../assets/data/sprites/spr_npc_huntress_idle/spr_npc_huntress_idle_0.png");
	}
	25% {
		background-image: url("../assets/data/sprites/spr_npc_huntress_idle/spr_npc_huntress_idle_1.png");
	}
	50% {
		background-image: url("../assets/data/sprites/spr_npc_huntress_idle/spr_npc_huntress_idle_2.png");
	}
	75% {
		background-image: url("../assets/data/sprites/spr_npc_huntress_idle/spr_npc_huntress_idle_3.png");
	}
	100% {
		background-image: url("../assets/data/sprites/spr_npc_huntress_idle/spr_npc_huntress_idle_0.png");
	}
}

@keyframes idle-animation-mage {
	0% {
		background-image: url("../assets/data/sprites/spr_npc_mage_idle/spr_npc_mage_idle_0.png");
	}
	25% {
		background-image: url("../assets/data/sprites/spr_npc_mage_idle/spr_npc_mage_idle_1.png");
	}
	50% {
		background-image: url("../assets/data/sprites/spr_npc_mage_idle/spr_npc_mage_idle_2.png");
	}
	75% {
		background-image: url("../assets/data/sprites/spr_npc_mage_idle/spr_npc_mage_idle_3.png");
	}
	100% {
		background-image: url("../assets/data/sprites/spr_npc_mage_idle/spr_npc_mage_idle_0.png");
	}
}

.top {
	display: flex;
	position: absolute;
	top: 70px;
	left: 50%;
	transform: translateX(-50%);
	width: 170px;
	justify-content: space-between;
}

.left,
.right {
	display: flex;
	flex-direction: column;
	position: absolute;
	top: 150px;
	height: 230px;
	justify-content: space-between;
}

.left {
	left: 80px;
}

.right {
	right: 80px;
}

.rings {
	display: flex;
	position: absolute;
	top: 400px;
	left: 50%;
	transform: translateX(-50%);
	width: 240px;
	justify-content: space-between;
}

.selected {
	outline: 4px solid rgb(72, 22, 17);
}

.editable .gear-slot {
	cursor: pointer;
}

.boot {
	position: absolute;
	top: 420px;
	left: 50%;
	transform: translateX(-50%);
}

.v-separator {
	position: absolute;
	top: 520px;
	left: 50%;
	transform: translateX(-50%);
}

.weapon {
	position: absolute;
	width: 420px;
	height: 228px;
	background-image: url("../assets/data/sprites/spr_weapon_box_inventory/spr_weapon_box_inventory_0.png");
	bottom: 50px;
	left: 50%;
	transform: translateX(-50%);
	text-align: center;
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