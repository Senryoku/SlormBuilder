<template>
	<div class="item-stats">
		<GearPanel>
			<template v-for="s in ItemSlots" v-slot:[s] :key="s">
				<GearSlot
					:type="s"
					:class="{
						primary: selection[itemSlotToItemType(s)] === 'P',
						secondary: selection[itemSlotToItemType(s)] === 'S',
					}"
					@click="selectedSlot = itemSlotToItemType(s)"
				/>
			</template>
		</GearPanel>
		<div>
			<h1>{{ t("Item Stats") }}</h1>
			{{ t("Where can you find") }}
			<select v-model="selection">
				<option v-for="s in orderedStats" :key="s.REF_NB" :value="s">
					{{ translate(s.REF, settings.language)
					}}{{ s.PERCENT === "%" ? " (%)" : "" }}
				</option>
			</select>
			?
			<div v-if="selection">
				<ul>
					<li>
						{{ t("Category") }} :
						{{ translate(selection.CATEGORY, settings.language) }}
					</li>
					<li v-if="selection.PRIMARY_NAME_TYPE">
						{{ t("Type") }} :
						{{
							translate(
								selection.PRIMARY_NAME_TYPE,
								settings.language
							)
						}}
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
					v-for="p in ['Primary', 'Secondary'] as const"
					:key="p"
					:class="p"
					style="margin: 0 1em"
				>
					<h3>{{ t(p) }}</h3>
					<div v-for="s in statsFoundOnSelectedSlot[p]" :key="s.REF">
						<div>
							{{ translate(s.REF, settings.language)
							}}{{ s.PERCENT === "%" ? " (%)" : "" }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from "vue";
	import {
		ItemTypes,
		ItemSlots,
		translate,
		itemSlotToItemType,
	} from "@/utils";
	import GearSlot from "@/components/GearSlot.vue";
	import GearPanel from "@/components/GearPanel.vue";
	import Stats from "@/assets/data/item_stats.json";
	import { useSettings } from "@/Settings";

	const settings = useSettings();
	const selection = ref(Stats[0]);
	const selectedSlot = ref(ItemTypes[0]);

	onMounted(() => {
		selection.value = orderedStats.value[0];
	});

	const foundOn = computed(() => {
		return ItemTypes.filter((s) => !!selection.value[s]).sort((a, b) =>
			selection.value[a] === selection.value[b]
				? 0
				: selection.value[a] === "P"
				? -1
				: 1
		);
	});
	const statsFoundOnSelectedSlot = computed(() => {
		const r = Stats.filter((s) => !!s[selectedSlot.value]);
		return {
			Primary: r.filter((s) => s[selectedSlot.value] === "P"),
			Secondary: r.filter((s) => s[selectedSlot.value] === "S"),
		};
	});
	const orderedStats = computed(() => {
		return [...Stats].sort((a, b) =>
			translate(a.REF, settings.value.language).localeCompare(
				translate(b.REF, settings.value.language)
			)
		);
	});
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

	tbody tr {
		&:nth-child(even) {
			background-color: #222;
		}
		&:nth-child(odd) {
			background-color: #333;
		}
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
