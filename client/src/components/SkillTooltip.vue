<template>
	<transition name="fade">
		<div
			class="skill-tooltip"
			v-show="show"
			v-if="skill"
			ref="el"
			:key="skill.REF"
		>
			<h2>{{ skill.EN_NAME }}</h2>
			<img
				style="max-width: 100%"
				:src="
					require('../assets/data/sprites/spr_skill_small_separation/spr_skill_small_separation_0.png')
				"
			/>
			<img :src="skill.image" width="88" height="88" style="float: left" />
			<ul>
				<li v-if="skill.rank">
					Rank: {{ skill.rank }} / {{ skill.UPGRADE_NUMBER }}
				</li>
				<li v-show="genres">{{ genres }}</li>
				<li v-show="skill.COOLDOWN">
					Cooldown: {{ (skill.COOLDOWN / 60).toFixed(2) }} secondes
				</li>
				<li>Base Cost: {{ skill.COST }}</li>
			</ul>
			<img
				style="max-width: 100%"
				:src="
					require('../assets/data/sprites/spr_skill_small_separation/spr_skill_small_separation_0.png')
				"
			/>
			<p class="description">{{ description }}</p>
			<!--
				Debug data
				<table class="details">
					<tr v-for="(v, k) in filteredProperties" :key="k">
						<td>{{ k }}</td>
						<td>{{ v }}</td>
					</tr>
				</table>
			-->
		</div>
	</transition>
</template>

<script>
import { ref } from "vue";
import GameStrings from "../assets/data/dat_str.json";

export default {
	props: {
		language: { type: String, default: "EN" },
	},
	setup() {
		const show = ref(false);
		const el = ref(null);
		const skill = ref(null);
		const target = ref(null);

		return { show, el, skill, target };
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
			this.target = element;
			this.target.addEventListener("mousemove", this.mousemove);
			this.target.addEventListener("mouseout", this.mouseout);
		},
		hide() {
			this.show = false;
			this.target.removeEventListener("mouseout", this.mouseout);
			this.target.removeEventListener("mousemove", this.mousemove);
		},
		translate(id) {
			if (!id || id === "" || typeof id !== "string") return "";
			if (id.startsWith("synergy:")) id = id.slice(8);
			let t = GameStrings.find((o) => o.REF === id);
			if (t) return t[this.language];
			else return id;
		},
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

			if (this.skill.DESC_VALUE_REAL) {
				let reals = this.skill.DESC_VALUE_REAL.split("|");
				for (let e of reals) r = r.replace("$", this.translate(e));
			}

			function splice(str, start, count, insert) {
				return str.slice(0, start) + insert + str.slice(start + count);
			}

			if (this.skill.DESC_VALUE) {
				let value_name = this.skill.DESC_VALUE.split("|");
				value_name = value_name.map(this.translate);
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
								`${current_value}${value_type[idx]}${
									value_explanation
										? ` (${value_base[idx]}${value_type[idx]} + ${value_per_level[idx]}${value_type[idx]} per rank)`
										: ""
								} ${value_name[idx]}`
							);
						} else {
							let current_value =
								value_base[idx] +
								Math.max(1, this.skill.rank) * value_per_level[idx];
							r = splice(r, index, 1, `${current_value}${value_type[idx]}`);
						}
					}

					if (!value_explanation) {
						r = r.replace("µ", value_base[idx]);
						r = r.replace("µ", value_per_level[idx]);
					}
					// Synergies
					r = r.replace("_", `${current_value}%`);
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
		genres() {
			if (!this.skill.GENRE) return null;
			return this.skill.GENRE.split(",")
				?.map((str) => "atk_" + str)
				.map(this.translate)
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

.description {
	white-space: pre-line;
}

.details {
	word-wrap: break-word;
	text-align: left;
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