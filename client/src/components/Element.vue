<template>
	<div class="element" v-if="element">
		<div class="header">
			<img
				:src="
					require(`../assets/extracted/sprites/spr_elements/spr_elements_${element.REF}.png`)
				"
			/>
			<div class="infos">
				<div class="name">{{ name }}</div>
				<div v-if="element.TYPE">
					{{
						element.TYPE.split(",")
							.map((t) => translate("tt_" + t))
							.join(" - ")
					}}
				</div>
				<div>
					{{ t("Rank") }}:
					<span style="color: var(--color-ancestral)">{{
						element.rank
					}}</span
					>/{{ element.UPGRADE_NUMBER }}
				</div>
				<div v-if="element.COST_TYPE !== 'none'">
					{{ t("Cost") }}:
					<span style="color: var(--color-rare)">{{ cost }}</span>
					{{ translate("tt_" + element.COST_TYPE) }}
				</div>
			</div>
		</div>
		<div v-html="desc" />
	</div>
</template>

<script>
	import { parseText, require } from "../utils.js";
	export default {
		props: { element: { type: Object } },
		computed: {
			require(url) {
				return require(url);
			},
			name() {
				return this.translate(
					this.element[this.settings.language + "_NAME"]
				);
			},
			cost() {
				return this.element.COST_LEVEL
					? this.element.COST +
							this.element.COST_LEVEL * this.element.rank
					: this.element.rank;
			},
			desc() {
				return parseText(
					this.element,
					this.settings.language,
					{
						text: this.settings.language + "_DESCRIPTION",
						value_base: "DESC_VALUE_BASE",
						value_type: "DESC_VALUE_TYPE",
						value_level: "DESC_VALUE_PER_LVL",
						value_stat: "DESC_VALUE",
						value_real: "DESC_VALUE_REAL",
					},
					{ rank: this.element.rank ?? 0 }
				);
			},
		},
	};
</script>

<style scoped>
	.element {
		padding: 6px;
		background-color: #222;
		width: 512px;
		border: 2px solid black;
		border-radius: 4px;
	}

	.header {
		display: flex;
		gap: 12px;
	}

	.header img {
		width: 64px;
		height: 64px;
	}

	.name {
		font-size: 1.25em;
		color: var(--color-ancestral);
	}

	:deep(.number) {
		color: var(--color-legendary);
	}

	:deep(.small) {
		color: #888;
		font-size: 0.9em;
	}

	:deep(p) {
		margin: 6px 12px;
	}
</style>
