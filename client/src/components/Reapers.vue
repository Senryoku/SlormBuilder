<template>
	<div class="header"><h1>Slorm Reapers</h1></div>
	<div class="filters">
		<div>
			<input type="checkbox" id="smallDisplay" v-model="smallDisplay" /><label
				for="smallDisplay"
				>Small Gallery</label
			>
		</div>
		Filters
		<div>
			<input type="checkbox" id="obtainable" /><label for="obtainable"
				>Obtainable (WIP)</label
			>
			<input type="checkbox" v-model="lootable" id="lootable" /><label
				for="lootable"
				>Lootable</label
			>
		</div>
		<div class="type-select">
			<button v-for="w in ['sword', 'bow', 'staff']" :key="w" @click="type = w">
				{{ w }}
			</button>
		</div>
	</div>
	<div class="gallery">
		<template v-if="smallDisplay">
			<div
				v-for="r in filteredReapers"
				:key="type + r.REF"
				class="weapon-spot"
				:class="type"
				@mouseenter="displayTooltip($event, r)"
			>
				<div class="image-container">
					<img
						:src="
							require(`../assets/data/sprites/spr_reapers_${type}s/spr_reapers_${type}s_${
								r.REF ?? 0
							}.png`)
						"
					/>
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
			/>
		</template>
	</div>
</template>

<script>
import { ref } from "vue";
import Reaper from "./Reaper.vue";
import Reapers from "../assets/data/dat_rea.json";
import Tooltip from "./Tooltip.vue";

export default {
	components: { Reaper, Tooltip },
	data() {
		for (let r of Reapers) {
			if (r.EVOLVE_IN) {
				let e = Reapers.find((e) => e.REF === r.EVOLVE_IN);
				e.previous = r;
			}
		}
		Reapers.sort((l, r) => l.ORDER - r.ORDER);
		return {
			Reapers,
			type: "sword",
			lootable: true,
			smallDisplay: true,
			tooltip: ref(null),
			hoveredReaper: ref(Reapers[0]),
		};
	},
	methods: {
		displayTooltip(event, r) {
			this.hoveredReaper = r;
			this.$refs.tooltip.display(event);
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
.header {
	margin: auto;
	text-align: center;
}

.filters {
	display: flex;
	justify-content: space-around;
}

.type-select {
	display: flex;
	justify-content: space-around;
}

.type-select > * {
	text-transform: capitalize;
}

.gallery {
	display: flex;
	flex-wrap: wrap;
	margin: 0 4rem;
}

.weapon-spot {
	position: relative;
	width: 120px;
	height: 120px;
	background: url("../assets/data/sprites/spr_weapon_rarities/spr_weapon_rarities_6.png");
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
	left: -16px;
	width: 32px;
	height: 56px;
	top: 32px;
	z-index: -1;
}
</style>