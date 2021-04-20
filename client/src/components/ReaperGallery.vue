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
					<img :src="image(r)" />
				</div>
				<div v-if="r.previous" class="evolve-marker" />
			</div>
			<Tooltip ref="tooltip"
				><Reaper
					:type="type"
					:item="hoveredReaper"
					:key="hoveredReaper.REF" /></Tooltip
		></template>
		<template v-else>
			<Reaper
				v-for="r in filteredReapers"
				:key="type + r.REF"
				:item="r"
				:type="type"
				@click="$emit('select', r)"
			/>
		</template>
	</div>
</template>

<script>
import { ref } from "vue";
import { Reapers } from "../utils.js";
import Reaper from "./Reaper.vue";
import Tooltip from "./Tooltip.vue";

export default {
	components: { Reaper, Tooltip },
	props: {
		type: { type: String, required: true },
		smallDisplay: { type: Boolean, default: false },
		lootable: { type: Boolean, default: false },
	},
	data() {
		return {
			Reapers: Reapers.filter((r) => r[this.settings.language + "_NAME"]),
			tooltip: ref(null),
			hoveredReaper: ref(Reapers[0]),
		};
	},
	methods: {
		displayTooltip(event, r) {
			this.hoveredReaper = r;
			this.$refs.tooltip.display(event);
		},
		image(item) {
			switch (this.type) {
				case "sword":
					return require(`../assets/data/sprites/spr_reapers_swords/spr_reapers_swords_${
						item.REF ?? 0
					}.png`);
				case "bow":
					return require(`../assets/data/sprites/spr_reapers_bows/spr_reapers_bows_${
						item.REF ?? 0
					}.png`);
				case "staff":
					return require(`../assets/data/sprites/spr_reapers_staffs/spr_reapers_staffs_${
						item.REF ?? 0
					}.png`);
			}
		},
	},
	computed: {
		filteredReapers() {
			return this.Reapers.filter((r) => !this.lootable || r.LOOTABLE !== null);
		},
	},
};
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
	background: url("../assets/data/sprites/spr_weapon_rarities/spr_weapon_rarities_6.png");
	border-style: solid;
	border-image: url("../assets/data/sprites/spr_weapon_spot/spr_weapon_spot_0.png");
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
	margin: 16px;
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
	background-image: url("../assets/data/sprites/spr_weapon_evolve/spr_weapon_evolve_0.png");
	left: -28px;
	width: 32px;
	height: 56px;
	top: 32px;
	z-index: -1;
}
</style>