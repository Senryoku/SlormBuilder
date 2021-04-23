<template>
	<div class="ancestral-skill" v-if="skill">
		<div class="header">
			<img
				class="icon"
				:src="
					require(`../assets/extracted/sprites/spr_actives/spr_actives_${skill.REF}.png`)
				"
			/>
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
					<span style="color: var(--color-rare)">{{ skill.COST }}</span>
					{{ t("Mana") }}
				</div>
				<div></div>
			</div>
		</div>
		<p v-html="desc"></p>
	</div>
</template>

<script>
import { parseText } from "../utils.js";
export default {
	props: { skill: { type: Object } },
	computed: {
		name() {
			return this.skill[this.settings.language + "_NAME"];
		},
		desc() {
			return parseText(this.skill, this.settings.language, {
				text: this.settings.language + "_DESCRIPTION",
				value_base: "DESC_VALUE_BASE",
				value_type: "DESC_VALUE_TYPE",
				value_stat: "DESC_VALUE",
				value_real: "DESC_VALUE_REAL",
			});
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