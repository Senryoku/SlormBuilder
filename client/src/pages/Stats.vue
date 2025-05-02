<template>
	<div class="item-stats">
		<GearPanel
			><template v-for="s in ItemSlots" v-slot:[s] :key="s">
				<gear-slot
					:type="s"
					:class="{
						primary:
							selection[s.startsWith('ring') ? 'ring' : s] ===
							'P',
						secondary:
							selection[s.startsWith('ring') ? 'ring' : s] ===
							'S',
					}"
					@click="
						selectedSlot = s.startsWith('ring') ? 'ring' : s
					" /></template
		></GearPanel>
		<div>
			<h1>{{ t("Item Stats") }}</h1>
			{{ t("Where can you find") }}
			<select v-model="selection">
				<option v-for="s in orderedStats" :key="s.REF_NB" :value="s">
					{{ translate(s.REF) }}{{ s.PERCENT === "%" ? " (%)" : "" }}
				</option>
			</select>
			?
			<div v-if="selection">
				<ul>
					<li>
						{{ t("Category") }} :
						{{ translate(selection.CATEGORY) }}
					</li>
					<li v-if="selection.PRIMARY_NAME_TYPE">
						{{ t("Type") }} :
						{{ translate(selection.PRIMARY_NAME_TYPE) }}
					</li>
					<li>{{ t("Score") }} : {{ selection.SCORE }}</li>
					<li>{{ t("Min. Level") }}: {{ selection.MIN_LEVEL }}</li>
				</ul>
				<table v-if="foundOn.length > 0">
					<thead>
						<tr>
							<th>{{ t("Item Slot") }}</th>
							<th>{{ t("Stat. Type") }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="s in foundOn" :key="s">
							<td>{{ t(s) }}</td>
							<td>
								{{
									t(
										selection[s] === "P"
											? "Primary"
											: "Secondary"
									)
								}}
							</td>
						</tr>
					</tbody>
				</table>
				<div v-else>{{ t("Not found on gear.") }}</div>
			</div>
		</div>
		<div>
			<h1>{{ t("Item Slots") }}</h1>
			{{ t("What stats can be found on") }}
			<select v-model="selectedSlot">
				<option v-for="s in ItemTypes" :key="s" :value="s">
					{{ t(s) }}
				</option>
			</select>
			?
			<div style="display: flex">
				<div
					v-for="p in ['Primary', 'Secondary']"
					:key="p"
					:class="p"
					style="margin: 0 1em"
				>
					<h3>{{ t(p) }}</h3>
					<div v-for="s in statsFoundOnSelectedSlot[p]" :key="s.REF">
						<div>
							{{ translate(s.REF)
							}}{{ s.PERCENT === "%" ? " (%)" : "" }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { ref } from "vue";
	import { ItemTypes, ItemSlots } from "@/utils";
	import GearSlot from "@/components/GearSlot.vue";
	import GearPanel from "@/components/GearPanel.vue";
	import Stats from "@/assets/data/item_stats.json";

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
		created() {
			this.selection = this.orderedStats[0];
		},
		methods: {
			convert(type) {
				if (type === "ARMOR") return "body";
				return type.toLowerCase();
			},
		},
		computed: {
			foundOn() {
				return ItemTypes.filter((s) => !!this.selection[s]).sort(
					(a, b) =>
						this.selection[a] === this.selection[b]
							? 0
							: this.selection[a] === "P"
							? -1
							: 1
				);
			},
			statsFoundOnSelectedSlot() {
				const r = this.Stats.filter((s) => !!s[this.selectedSlot]);
				return {
					Primary: r.filter((s) => s[this.selectedSlot] === "P"),
					Secondary: r.filter((s) => s[this.selectedSlot] === "S"),
				};
			},
			orderedStats() {
				return [...this.Stats].sort(
					(a, b) => this.translate(a.REF) > this.translate(b.REF)
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

	.Primary h3 {
		color: var(--color-rare);
	}

	.Secondary h3 {
		color: var(--color-magic);
	}
</style>
