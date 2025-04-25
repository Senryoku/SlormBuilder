<template>
	<div class="ancestral-skill" v-if="skill">
		<div class="header">
			<img class="icon" :src="iconImage" />
			<div class="infos">
				<div class="name">{{ name }}</div>
				<div v-if="skill.COOLDOWN">
					{{ t("Cooldown") }} :
					<span style="color: var(--color-legendary)">{{
						skill.COOLDOWN
					}}</span>
					{{ t("seconds") }}
				</div>
				<div>
					{{ t("Cost") }} :
					<span style="color: var(--color-rare)">{{
						skill.COST
					}}</span>
					{{ t("Mana") }}
				</div>
				<div></div>
			</div>
		</div>
		<p v-html="desc"></p>
	</div>
</template>

<script>
	import { parseText, require, spritesByIndex } from "../utils.js";

	const IconSprites = spritesByIndex(
		import.meta.glob("../assets/extracted/sprites/spr_actives/*.png", {
			eager: true,
			query: "?url",
			import: "default",
		})
	);

	export default {
		props: { skill: { type: Object } },
		computed: {
			name() {
				return this.skill[this.settings.value.language + "_NAME"];
			},
			desc() {
				return parseText(this.skill, this.settings.value.language, {
					text: this.settings.value.language + "_DESCRIPTION",
					value_base: "DESC_VALUE_BASE",
					value_type: "DESC_VALUE_TYPE",
					value_stat: "DESC_VALUE",
					value_real: "DESC_VALUE_REAL",
				});
			},
			iconImage() {
				return (
					IconSprites[this.skill.REF] ??
					require(`../assets/img/spr_actives_missing.png`)
				);
			},
		},
	};
</script>

<style scoped>
	.ancestral-skill {
		margin: 0 16px;
		border: 2px solid black;
		background-color: #222;
		padding: 4px;
		text-align: left;
	}

	.header {
		display: flex;
	}

	.icon {
		width: 64px;
		height: 64px;
		image-rendering: crisp-edges;
		image-rendering: pixelated;
	}

	.name {
		font-size: 1.25em;
		color: var(--color-legendary);
	}

	.infos {
		margin: 2px 8px;
	}

	:deep(p) {
		margin: 2px;
	}
</style>
