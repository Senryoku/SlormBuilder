<template>
	<div class="item-stats">
		<GearPanel
			><template v-for="s in ItemSlots" v-slot:[s] :key="s">
				<gear-slot :type="s" /></template
		></GearPanel>
		<div>
			<h1>Item Stats</h1>
			<select v-model="selection">
				<option v-for="s in Stats" :key="s.REF_NB" :value="s">
					{{ translate(s.REF) }}
				</option>
			</select>
			<div v-if="selection">
				<ul>
					<li>{{ t("Category") }} : {{ translate(selection.CATEGORY) }}</li>
					<li>
						{{ t("PRIMARY_NAME_TYPE") }} :
						{{ translate(selection.PRIMARY_NAME_TYPE) }}
					</li>
					<li>{{ t("SCORE") }} : {{ selection.SCORE }}</li>
					<li>{{ t("PERCENT") }} : {{ selection.PERCENT }}</li>
					<li>Min. Level: {{ selection.MIN_LEVEL }}</li>
				</ul>
				<table>
					<tr v-for="s in ItemTypes.filter((s) => !!selection[s])" :key="s">
						<td>{{ t(s) }}</td>
						<td>{{ selection[s] }}</td>
					</tr>
				</table>
			</div>
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
		return { Stats, ItemTypes, ItemSlots, selection: ref(Stats[0]) };
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
	},
	methods: {
		convert(type) {
			if (type === "ARMOR") return "body";
			return type.toLowerCase();
		},
	},
};
</script>

<style scoped>
.item-stats {
	display: flex;
	margin: 0 2em;
}
</style>