<template>
	<div class="item-stats">
		<GearPanel>
			<template v-for="s in ItemSlots" v-slot:[s] :key="s">
				<GearSlot
					:type="s"
					:class="{
						primary: selection[itemSlotToItemType(s)] === 'P',
						secondary: selection[itemSlotToItemType(s)] === 'S',
						epic: selection[itemSlotToItemType(s)] === 'E',
					}"
					@click="selectedSlot = itemSlotToItemType(s)"
				/>
			</template>
		</GearPanel>
		<div>
			<h1>{{ t("Item Stats") }}</h1>
			<div style="padding: 0 1em">
				{{ t("Where can you find") }}
				<select v-model="selection">
					<option
						v-for="s in orderedStats"
						:key="s.REF_NB"
						:value="s"
					>
						{{ translate(s.REF, settings.language)
						}}{{ s.PERCENT === "%" ? " (%)" : "" }}
					</option>
				</select>
				?
				<div v-if="selection">
					<ul>
						<li>
							{{ t("Category") }} :
							{{
								translate(selection.CATEGORY, settings.language)
							}}
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
						<li>
							{{ t("Min. Level") }}: {{ selection.MIN_LEVEL }}
						</li>
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
												: selection[s] === "S"
												? "Secondary"
												: "Epic"
										)
									}}
								</td>
							</tr>
						</tbody>
					</table>
					<div v-else>{{ t("Not found on gear.") }}</div>
				</div>
			</div>
		</div>
		<div>
			<h1>{{ t("Item Slots") }}</h1>
			<div style="padding: 0 1em">
				{{ t("What stats can be found on") }}
				<select v-model="selectedSlot">
					<option v-for="s in ItemTypes" :key="s" :value="s">
						{{ t(s) }}
					</option>
				</select>
				?
				<div style="display: flex; gap: 1em">
					<div
						v-for="p in ['Primary', 'Secondary', 'Epic'] as const"
						:key="p"
						:class="p"
					>
						<h3>{{ t(p) }}</h3>
						<h5>
							<template v-if="p === 'Primary'">
								<span style="color: var(--color-normal)">
									{{ t("Normal") }}</span
								>,
								<span style="color: var(--color-magic)">{{
									t("Magic")
								}}</span>
								{{ t("and") }}
								<span style="color: var(--color-rare)">{{
									t("Rare")
								}}</span>
							</template>
							<template v-else-if="p === 'Secondary'">
								<span style="color: var(--color-magic)">{{
									t("Magic")
								}}</span
								>,
								<span style="color: var(--color-rare)">{{
									t("Rare")
								}}</span>
								{{ t("and") }}
								<span style="color: var(--color-epic)">{{
									t("Epic")
								}}</span>
							</template>
							<template v-else-if="p === 'Epic'">
								<span style="color: var(--color-epic)">{{
									t("Epic")
								}}</span>
								{{ t("only") }}
							</template>
						</h5>
						<div
							v-for="s in statsFoundOnSelectedSlot[p]"
							:key="s.REF"
						>
							<div>
								{{ translate(s.REF, settings.language)
								}}{{ s.PERCENT === "%" ? " (%)" : "" }}
							</div>
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
		const priorities: Record<string, number> = { P: 0, S: 1, E: 2 };
		return ItemTypes.filter((s) => !!selection.value[s]).sort(
			(a, b) =>
				priorities[selection.value[a]] - priorities[selection.value[b]]
		);
	});

	const orderedStats = computed(() => {
		return [...Stats].sort((a, b) =>
			translate(a.REF, settings.value.language).localeCompare(
				translate(b.REF, settings.value.language)
			)
		);
	});

	const statsFoundOnSelectedSlot = computed(() => {
		const r = orderedStats.value.filter((s) => !!s[selectedSlot.value]);
		return {
			Primary: r.filter((s) => s[selectedSlot.value] === "P"),
			Secondary: r.filter((s) => s[selectedSlot.value] === "S"),
			Epic: r.filter((s) => s[selectedSlot.value] === "E"),
		};
	});
</script>

<style scoped>
	.item-stats {
		display: flex;
		gap: 1em;
		margin: 0 1em;
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

	.gear-panel {
		flex-shrink: 0;
	}

	.gear-slot {
		position: relative;
		cursor: pointer;
		&.primary,
		&.secondary,
		&.epic {
			background: none;
		}
	}

	.primary:before,
	.secondary:before,
	.epic:before {
		background: var(--bg-url);
		filter: brightness(700%);
		content: "";
		position: absolute;
		inset: 0;
	}

	.primary:after,
	.secondary:after,
	.epic:after {
		content: "";
		position: absolute;
		inset: 0;
		mix-blend-mode: multiply;
	}

	.primary:after {
		background: linear-gradient(
			to bottom right,
			var(--color-normal) 36%,
			var(--color-magic) 38%,
			var(--color-magic) 62%,
			var(--color-rare) 64%,
			var(--color-rare)
		);
	}

	.secondary:after {
		background: linear-gradient(
			to bottom right,
			var(--color-magic) 36%,
			var(--color-rare) 38%,
			var(--color-rare) 62%,
			var(--color-epic) 64%,
			var(--color-epic)
		);
	}

	.epic:after {
		background: var(--color-epic);
	}

	.Primary h3 {
		color: var(--color-normal);
	}

	.Secondary h3 {
		color: var(--color-magic);
	}

	.Epic h3 {
		color: var(--color-epic);
	}
</style>
