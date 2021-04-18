<template>
	<transition name="fade">
		<div
			class="skill-tooltip"
			v-show="show"
			v-if="skill"
			ref="el"
			:key="skill.REF"
		>
			<h2 class="colored">{{ skill.EN_NAME }}</h2>
			<img
				style="max-width: 100%"
				:src="
					require('../assets/data/sprites/spr_skill_small_separation/spr_skill_small_separation_0.png')
				"
			/>
			<div style="display: flex; margin: 1em; min-height: 96px">
				<div
					class="skill-image"
					:style="`background-image: url(${skill.image});`"
				></div>
				<div style="text-align: left">
					<ul style="list-style: none">
						<li v-if="skill.rank">
							Rank: {{ skill.rank }} / {{ skill.UPGRADE_NUMBER }}
						</li>
						<li v-show="genres">{{ genres }}</li>
						<li v-show="skill.COOLDOWN">
							Cooldown: {{ (skill.COOLDOWN / 60).toFixed(2) }} secondes
						</li>
						<li>Base Cost: {{ skill.COST }}</li>
					</ul>
				</div>
			</div>
			<img
				style="max-width: 100%"
				:src="
					require('../assets/data/sprites/spr_skill_small_separation/spr_skill_small_separation_0.png')
				"
			/>
			<p class="description" v-html="description"></p>
			<!-- TODO -->
			<p v-for="r in reminders" :key="r" class="mechanic-summary">
				<template v-if="r.EN_NAME">
					<!-- TODO Add Tooltip here -->
					<img
						:src="
							require(`../assets/data/sprites/spr_skills_${className}/spr_skills_${className}_${r.REF}.png`)
						"
						width="44"
						height="44"
					/>
					<div class="mechanic-summary-name">{{ r.EN_NAME }}</div>
				</template>
				<!-- TEMP -->
				<template v-else>
					<div class="mechanic-summary-name">{{ r }}</div>
				</template>
			</p>
			<template v-if="skill.rank">
				<img
					style="max-width: 100%"
					:src="
						require('../assets/data/sprites/spr_skill_small_separation/spr_skill_small_separation_0.png')
					"
				/>
				<div>Next Rank:</div>
				<div>Max Rank:</div></template
			>
		</div>
	</transition>
</template>

<script>
import { ref } from "vue";
import { translate } from "../utils.js";
import Mecanics from "../assets/data/mechanics.json";

export default {
	props: {
		language: { type: String, default: "EN" },
		className: { type: String, required: true },
	},
	setup() {
		const show = ref(false);
		const el = ref(null);
		const skill = ref(null);
		const target = ref(null);
		const reminders = ref([]);

		return { show, el, skill, target, reminders };
	},
	methods: {
		mousemove(event) {
			let w = window.innerWidth;
			let h = window.innerHeight;
			let x = this.$refs.el.clientWidth;
			let y = this.$refs.el.clientHeight;
			let targetX = 30 + event.clientX;
			let targetY = 20 + event.clientY;
			const margin = 40;
			this.$refs.el.style.top =
				Math.min(targetY, h - y - margin) + window.scrollY + "px";
			this.$refs.el.style.left =
				Math.min(targetX, w - x - margin) + window.scrollX + "px";
		},
		mouseout() {
			this.hide();
		},
		display(skill, element) {
			this.show = true;
			this.skill = skill;
			this.reminders = [...this.skill.EN_DESCRIPTION.matchAll(/<([^>]*)>/g)]
				.map((arr) => {
					if (arr[1] in Mecanics) return Mecanics[arr[1]];
					else console.log(arr[1] + " not found in Mecanics");
					return arr[1];
				})
				.filter((e, idx, arr) => arr.indexOf(e) === idx);
			this.target = element;
			this.target.addEventListener("mousemove", this.mousemove);
			this.target.addEventListener("mouseout", this.mouseout);
		},
		hide() {
			this.show = false;
			this.target.removeEventListener("mouseout", this.mouseout);
			this.target.removeEventListener("mousemove", this.mousemove);
		},
	},
	computed: {
		description() {
			let r = this.skill.EN_DESCRIPTION;
			// New lines
			r = r.replaceAll("#", "\n");

			// Reminders
			r = r.replaceAll(/<([^>]*)>/g, (match, group) => {
				return `<span class="keyword">${group}</span>`;
			});
			function small(s) {
				return `<span class="smaller">${s}</span>`;
			}

			function c(n) {
				return `<span class="colored">${n}</span>`;
			}

			if (this.skill.DESC_VALUE_REAL) {
				let reals = this.skill.DESC_VALUE_REAL.split("|");
				for (let e of reals) r = r.replace("$", translate(e));
			}

			function splice(str, start, count, insert) {
				return str.slice(0, start) + insert + str.slice(start + count);
			}

			if (this.skill.DESC_VALUE) {
				let value_name = this.skill.DESC_VALUE.split("|");
				value_name = value_name.map((n) => translate(n));
				let value_base = this.skill.DESC_VALUE_BASE.split("|");
				value_base = value_base.map((v) => parseFloat(v));
				let value_per_level = this.skill.DESC_VALUE_PER_LVL.split("|");
				value_per_level = value_per_level.map((v) => parseFloat(v));
				let value_type = this.skill.DESC_VALUE_TYPE.split("|");
				for (let idx = 0; idx < value_name.length; ++idx) {
					let value_explanation =
						this.skill.UPGRADE_NUMBER > 1 && !r.includes("µ");
					let current_value =
						value_base[idx] +
						Math.max(1, this.skill.rank) * value_per_level[idx];
					let index = r.search("@");
					if (index > 0) {
						if (r.slice(index, index + 3) === "@ £") {
							r = splice(
								r,
								index,
								3,
								`${c(current_value + value_type[idx])}${
									value_explanation
										? small(
												` (${value_base[idx]}${value_type[idx]} + ${value_per_level[idx]}${value_type[idx]} per rank)`
										  )
										: ""
								} ${value_name[idx]}`
							);
						} else {
							let current_value =
								value_base[idx] +
								Math.max(1, this.skill.rank) * value_per_level[idx];
							r = splice(r, index, 1, c(current_value + value_type[idx]));
						}
					}

					if (!value_explanation) {
						r = r.replace(/([(（]µ[^µ)]*µ[^)]*[)）])/, (match, group) =>
							small(group)
						);
						r = r.replace("µ", value_base[idx]);
						r = r.replace("µ", value_per_level[idx]);
					}
					// Synergies
					r = r.replace("_", c(current_value + "%"));
				}

				if (r.includes("£")) {
					r = r.replace("£", c(value_name[0]));
				}
			}

			if (this.skill.EXTRA_NBR) {
				let extras = this.skill.EXTRA_NBR.split("|");
				for (let e of extras) r = r.replace("¥", e);
			}

			// Wth is ¤?
			return r;
		},
		genres() {
			if (!this.skill.GENRE) return null;
			return this.skill.GENRE.split(",")
				?.map((str) => "atk_" + str)
				.map((s) => translate(s))
				.join(", ");
		},
	},
};
</script>

<style>
.skill-tooltip {
	position: absolute;
	left: 0;
	top: 0;
	box-sizing: border-box;
	width: 396px;
	padding: 20px;
	background-color: #222;
	z-index: 99;
	pointer-events: none;

	background-image: url("../assets/data/sprites/spr_skill_support_top/spr_skill_support_top_0.png");
	background-repeat: no-repeat;
	border-style: solid;
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

.skill-image {
	width: 96px;
	height: 96px;

	border-style: solid;
	border-image-source: url("../assets/data/sprites/spr_borders/spr_borders_4.png");
	border-image-slice: 12 12 12 12;
	border-image-width: 12px;
	border-image-outset: 0px 0px 0px 0px;
	border-image-repeat: stretch stretch;
	border-image-outset: 4px;
	background-size: cover;
	image-rendering: crisp-edges;
	z-index: 2;
}

.description {
	white-space: pre-line;
}

.colored {
	color: #b13d07;
}

.smaller {
	color: #666;
	font-size: 0.9em;
}

.keyword {
	font-weight: 600;
}

.details {
	word-wrap: break-word;
	text-align: left;
}

.mechanic-summary {
	display: flex;
	align-content: center;
	justify-content: flex-start;
	background-color: #282828;
	height: 44px;
}

.mechanic-summary-name {
	padding-left: 8px;
	line-height: 44px;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>