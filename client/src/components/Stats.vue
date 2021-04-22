<template>
	<div class="item-stats">
		<GearPanel
			><template v-for="s in ItemSlots" v-slot:[s] :key="s">
				<gear-slot
					:type="s"
					:class="{
						primary: selection[s.startsWith('ring') ? 'ring' : s] === 'Primary',
						secondary:
							selection[s.startsWith('ring') ? 'ring' : s] === 'Secondary',
					}"
					@click="selectedSlot = s.startsWith('ring') ? 'ring' : s" /></template
		></GearPanel>
		<div>
			<h1>Item Stats</h1>
			Where can you find
			<select v-model="selection">
				<option v-for="s in Stats" :key="s.REF_NB" :value="s">
					{{ translate(s.REF) }}{{ s.PERCENT === "%" ? " (%)" : "" }}
				</option>
			</select>
			?
			<div v-if="selection">
				<ul>
					<li>{{ t("Category") }} : {{ translate(selection.CATEGORY) }}</li>
					<li v-if="selection.PRIMARY_NAME_TYPE">
						{{ t("Type") }} :
						{{ translate(selection.PRIMARY_NAME_TYPE) }}
					</li>
					<li>{{ t("Score") }} : {{ selection.SCORE }}</li>
					<li>Min. Level: {{ selection.MIN_LEVEL }}</li>
				</ul>
				<table v-if="foundOn.length > 0">
					<thead>
						<tr>
							<th>Item Slot</th>
							<th>Stat. Type</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="s in foundOn" :key="s">
							<td>{{ t(s) }}</td>
							<td>{{ selection[s] }}</td>
						</tr>
					</tbody>
				</table>
				<div v-else>{{ t("Not found on gear.") }}</div>
			</div>
		</div>
		<div>
			<h1>Item Slots</h1>
			What stats can be found on
			<select v-model="selectedSlot">
				<option v-for="s in ItemTypes" :key="s" :value="s">
					{{ t(s) }}
				</option>
			</select>
			?
			<table v-if="statsFoundOnSelectedSlot.length > 0">
				<thead>
					<tr>
						<th>Stat.</th>
						<th>Stat. Type</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="s in statsFoundOnSelectedSlot" :key="s.REF">
						<td>{{ translate(s.REF) }}</td>
						<td>{{ s[selectedSlot] }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import { ref } from "vue";
import { ItemTypes, ItemSlots } from "../utils.js";
import GearSlot from "./GearSlot.vue";
import GearPanel from "./GearPanel.vue";
import Stats from "../assets/data/dat_sta.json";

export default {
	components: { GearSlot, GearPanel },
	data() {
		return {
			Stats,
			ItemTypes,
			ItemSlots,
			selection: ref(Stats[0]),
			selectedSlot: ref(ItemTypes[0]),
		};
	},
	mounted() {
		for (let s of Stats)
			for (let t of [
				"HELM",
				"ARMOR",
				"BELT",
				"BRACER",
				"GLOVE",
				"SHOULDER",
				"BOOT",
				"RING",
				"AMULET",
				"CAPE",
			])
				s[this.convert(t)] =
					s[t] === "P" ? "Primary" : s[t] === "S" ? "Secondary" : null;
		this.Stats = Stats.sort(
			(a, b) => this.translate(a.REF) > this.translate(b.REF)
		);
		this.selection = this.Stats[0];
	},
	methods: {
		convert(type) {
			if (type === "ARMOR") return "body";
			return type.toLowerCase();
		},
	},
	computed: {
		foundOn() {
			return ItemTypes.filter((s) => !!this.selection[s]).sort((a, b) =>
				this.selection[a] === this.selection[b]
					? 0
					: this.selection[a] === "Primary"
					? -1
					: 1
			);
		},
		statsFoundOnSelectedSlot() {
			return this.Stats.filter((s) => !!s[this.selectedSlot]).sort((a, b) =>
				a[this.selectedSlot] === b[this.selectedSlot]
					? 0
					: a[this.selectedSlot] === "Primary"
					? -1
					: 1
			);
		},
	},
};
</script>

<style scoped>
.item-stats {
	display: flex;
	gap: 4em;
	margin: 0 2em;
}

select {
	padding: 0.5em;
	background: #444;
	color: white;
	border: 1px solid #444;
	border-radius: 0.5em;
}

table {
	border-collapse: collapse;
	margin: 0.25em auto;
}

th,
td {
	padding: 0.25em 0.5em;
}

thead tr {
	background-color: #00583e;
	border-bottom: 2px solid #888;
}

tbody tr:nth-child(even) {
	background-color: #222;
}

tbody tr:nth-child(odd) {
	background-color: #333;
}

.primary {
	filter: brightness(400%);
	background-color: var(--color-rare);
	background-blend-mode: luminosity;
}

.secondary {
	filter: brightness(400%);
	background-color: var(--color-magic);
	background-blend-mode: luminosity;
}

.gear-slot {
	cursor: pointer;
}
</style>