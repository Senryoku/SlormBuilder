<template>
	<div class="skill-tooltip">
		<h2>{{ skill.EN_NAME }}</h2>
		<img
			style="max-width: 100%"
			:src="
				require('../assets/data/sprites/spr_skill_small_separation/spr_skill_small_separation_0.png')
			"
		/>
		<img :src="skill.image" width="88" height="88" />
		<img
			style="max-width: 100%"
			:src="
				require('../assets/data/sprites/spr_skill_small_separation/spr_skill_small_separation_0.png')
			"
		/>
		<p class="description">{{ description }}</p>
		<details>
			<summary>Debug data</summary>
			<table class="details">
				<tr v-for="(v, k) in filteredProperties" :key="k">
					<td>{{ k }}</td>
					<td>{{ v }}</td>
				</tr>
			</table>
		</details>
	</div>
</template>

<script>
import GameStrings from "../assets/data/dat_str.json";

export default {
	props: {
		skill: { type: Object },
	},
	computed: {
		filteredProperties() {
			let r = {};
			for (let k of Object.keys(this.skill).filter(
				(key) => !(key.endsWith("_DESCRIPTION") || key.endsWith("_NAME"))
			))
				r[k] = this.skill[k];
			return r;
		},
		description() {
			let r = this.skill.EN_DESCRIPTION;
			// New lines
			r = r.replaceAll("#", "\n");

			const translate = (id) => {
				if (id.startsWith("synergy:")) id = id.slice(8);
				let t = GameStrings.find((o) => o.REF === id);
				if (t) return t["EN"];
				else return id;
			};

			if (this.skill.DESC_VALUE_REAL) {
				let reals = this.skill.DESC_VALUE_REAL.split("|");
				for (let e of reals) r = r.replace("$", translate(e));
			}

			//let tokens = ["@", "£"];
			if (this.skill.DESC_VALUE) {
				let value_name = this.skill.DESC_VALUE.split("|");
				value_name = value_name.map(translate);
				let value_base = this.skill.DESC_VALUE_BASE.split("|");
				value_base = value_base.map((v) => parseFloat(v));
				let value_per_level = this.skill.DESC_VALUE_PER_LVL.split("|");
				value_per_level = value_per_level.map((v) => parseFloat(v));
				let value_type = this.skill.DESC_VALUE_TYPE.split("|");
				//let value_real = this.skill.DESC_VALUE_REAL.split("|");
				let value_explanation = this.skill.UPGRADE_NUMBER > 1;
				if (r.includes("µ")) {
					r = r.replace("µ", value_base[0]);
					r = r.replace("µ", value_per_level[0]);
					value_explanation = false;
				}
				for (let idx = 0; idx < value_name.length; ++idx) {
					let current_value =
						value_base[idx] + this.skill.currentLevel * value_per_level[idx];
					r = r.replace(
						"@ £",
						`${current_value}${value_type[idx]}${
							value_explanation
								? ` (${value_base[idx]}${value_type[idx]} + ${value_per_level[idx]}${value_type[idx]} per rank)`
								: ""
						} ${value_name[idx]}`
					);
					// Synergies
					r = r.replace("_", `${current_value}%`);
				}

				if (r.includes("@")) {
					let current_value =
						value_base[0] + this.skill.currentLevel * value_per_level[0];
					r = r.replace("@", `${current_value}${value_type[0]}`);
				}
				if (r.includes("£")) {
					r = r.replace("£", `${value_name[0]}`);
				}
			}

			if (this.skill.EXTRA_NBR) {
				let extras = this.skill.EXTRA_NBR.split("|");
				for (let e of extras) r = r.replace("¥", e);
			}
			return r;
		},
	},
};
</script>

<style>
.skill-tooltip {
	right: 0;
	top: 0;
	box-sizing: border-box;
	width: 396px;
	padding: 20px;
	background-color: #222;
	z-index: 99;
	/*pointer-events: none;*/

	background-image: url("../assets/data/sprites/spr_skill_support_top/spr_skill_support_top_0.png");
	background-repeat: no-repeat;
	border-image-source: url("../assets/img/skill-tree-border.png");
	border-image-slice: 16 16 16 16;
	border-image-width: 12px;
	border-image-outset: 0px 0px 0px 0px;
	border-image-repeat: stretch stretch;
	border-image-outset: 12px;
}

h2 {
	margin-top: 0;
	text-align: center;
}

.description {
	white-space: pre-line;
}

.details {
	word-wrap: break-word;
	text-align: left;
}
</style>