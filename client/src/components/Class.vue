<template>
	<div class="class" :class="{ editable: editable }">
		<div class="skill-slots">
			<div class="skill-slot">
				<img
					class="icon"
					:src="
						require('@/assets/data/sprites/spr_keyboard_buttons/spr_keyboard_buttons_5.png')
					"
				/>
				Specialisation (Support Skill)
				<div class="skill-selection">
					<skill
						v-for="(spec, idx) in specialisations"
						:className="className"
						:skill="spec.skill"
						:key="idx"
						@click="if (editable) selections.specialisation = idx;"
						:selected="idx === selections.specialisation"
						@mouseenter="display($event, spec.skill)"
					></skill>
				</div>
				<skill-tree
					:tree="specialisations[selections.specialisation]"
					@selectSkill="selectSkill"
					@deselectSkill="deselectSkill"
					@display="display"
				></skill-tree>
			</div>
			<div class="skill-slot">
				<img
					class="icon"
					:src="
						require('@/assets/data/sprites/spr_keyboard_buttons/spr_keyboard_buttons_0.png')
					"
				/>
				Primary Skill
				<div class="skill-selection">
					<skill
						v-for="(spec, idx) in skillTrees"
						:className="className"
						:skill="spec.skill"
						:key="idx"
						@click="
							if (editable) {
								if (selections.secondarySkill === idx)
									selections.secondarySkill = selections.primarySkill;
								selections.primarySkill = idx;
							}
						"
						:selected="idx === selections.primarySkill"
						@mouseenter="display($event, spec.skill)"
					></skill>
				</div>
				<skill-tree
					:tree="skillTrees[selections.primarySkill]"
					@selectSkill="selectSkill"
					@deselectSkill="deselectSkill"
					@display="display"
				></skill-tree>
			</div>
			<div class="skill-slot">
				<img
					class="icon"
					:src="
						require('@/assets/data/sprites/spr_keyboard_buttons/spr_keyboard_buttons_1.png')
					"
				/>
				Secondary Skill
				<div class="skill-selection">
					<skill
						v-for="(spec, idx) in skillTrees"
						:className="className"
						:skill="spec.skill"
						:key="idx"
						@click="
							if (editable) {
								if (selections.primarySkill === idx)
									selections.primarySkill = selections.secondarySkill;
								selections.secondarySkill = idx;
							}
						"
						:selected="idx === selections.secondarySkill"
						@mouseenter="display($event, spec.skill)"
					></skill>
				</div>
				<skill-tree
					:tree="skillTrees[selections.secondarySkill]"
					@selectSkill="selectSkill"
					@deselectSkill="deselectSkill"
					@display="display"
				></skill-tree>
			</div>
		</div>
		<skill-tooltip ref="skillTooltip"></skill-tooltip>
	</div>
</template>

<script>
import { ref, defineAsyncComponent } from "vue";
import KnightSkills from "../assets/data/dat_cla_0.json";
import HuntressSkills from "../assets/data/dat_cla_1.json";
import MageSkills from "../assets/data/dat_cla_2.json";
import Skill from "./Skill.vue";
import SkillTree from "./SkillTree.vue";
const SkillTooltip = defineAsyncComponent(() =>
	import(/* webpackChunkName: "SkillTooltip" */ "./SkillTooltip.vue")
);

const SkillData = {
	knight: KnightSkills,
	huntress: HuntressSkills,
	mage: MageSkills,
};

const TreeShapes = {
	mage: [
		[3, 3, 3, 3, 3, 3, 3, 3],
		[3, 2, 4, 3, 3, 3, 3, 3],
		[4, 3, 2, 3, 3, 3, 2, 3],
		[2, 4, 4, 4, 2],
		[3, 3, 3, 4, 3],
		[4, 3, 3, 3, 2],
		[3, 3, 4, 4, 2],
		[4, 4, 4, 3, 3],
		[4, 4, 2, 3, 4],
		[3, 4, 4, 4, 2],
		[3, 2, 3, 4, 4],
	],
	knight: [
		[3, 3, 4, 4, 3, 3, 3, 2],
		[3, 3, 3, 3, 3, 3, 4, 2],
		[3, 3, 4, 3, 4, 2, 4, 3],
		[3, 4, 3, 3, 2],
		[4, 3, 3, 3, 3],
		[3, 3, 3, 3, 4],
		[4, 3, 2, 3, 3],
		[4, 3, 2, 4, 2],
		[4, 3, 4, 2, 3],
		[3, 4, 2, 4, 3],
		[4, 3, 3, 4, 4],
	],
	huntress: [
		[3, 3, 3, 4, 3, 4, 3, 2],
		[2, 4, 4, 3, 3, 3, 3, 2],
		[3, 4, 3, 4, 3, 3, 3, 2],
		[3, 3, 4, 3, 2],
		[3, 4, 3, 4, 2],
		[3, 3, 4, 3, 3],
		[3, 3, 4, 2, 4],
		[3, 4, 3, 3, 2],
		[3, 2, 3, 4, 2],
		[4, 3, 3, 3, 2],
		[3, 4, 4, 2, 2],
	],
};

export default {
	name: "Class",
	components: {
		Skill,
		SkillTree,
		SkillTooltip,
	},
	props: {
		className: { type: String },
		import: { type: Object },
		editable: { type: Boolean, default: true },
	},
	data() {
		let skills = [];
		let upgrades = [];
		let activeBoxes = [];
		for (let s of SkillData[this.className]) {
			s.className = this.className;
			s.rank = 0;
			let sprite = require("../assets/data/sprites/spr_unknown_48/spr_unknown_48_0.png");
			try {
				sprite = require(`../assets/data/sprites/spr_skills_${s.className}/spr_skills_${s.className}_${s.REF}.png`);
			} catch (e) {
				//console.error(e);
			}
			s.image = sprite;

			if (s.TYPE === "upgrade") upgrades.push(s);
			else skills.push(s);
			if (!activeBoxes[s.ACTIVE_BOX]) activeBoxes[s.ACTIVE_BOX] = [];
			activeBoxes[s.ACTIVE_BOX].push(s);
			s.selected =
				this.import?.upgrades?.find((u) => u.REF === s.REF) !== undefined ??
				false;
			s.rank =
				this.import?.upgrades?.find((u) => u.REF === s.REF)?.rank ?? false;
		}

		function splitToRows(array, className, idx) {
			let result = [];
			for (let count of TreeShapes[className][idx]) {
				let row = array.splice(0, Math.min(count, array.length));
				result.push(row);
			}
			return result;
		}

		const genTree = (arr, idx) => {
			let primarySkills = arr.splice(0, 1)[0];
			let upgrades = splitToRows(arr, this.className, idx);
			return {
				className: this.className,
				skill: primarySkills,
				upgrades: upgrades,
			};
		};

		let skillTrees = activeBoxes.map(genTree);

		let specialisations = skillTrees.splice(0, 3);
		let classImages = [];
		for (let i = 0; i < 3; ++i)
			classImages.push(
				require(`../assets/data/sprites/spr_specialization_${this.className}/spr_specialization_${this.className}_${i}.png`)
			);
		let selections = this.import?.selections ?? {
			specialisation: 0,
			primarySkill: 0,
			secondarySkill: 1,
		};

		const skillTooltip = ref(null);

		return {
			skills,
			upgrades,
			skillTrees,
			specialisations,
			selections,
			classImages: classImages,
			skillTooltip,
		};
	},
	methods: {
		display(event, skill) {
			this.$refs.skillTooltip.display(skill, event.target);
		},
		selectSkill(tree, row, skill) {
			if (!this.editable) return;
			if (skill.selected) {
				skill.rank = Math.min(skill.rank + 1, skill.UPGRADE_NUMBER);
			} else {
				tree.upgrades[row].map((s) => (s.selected = false));
				skill.rank = Math.max(skill.rank, 1);
				skill.selected = true;
			}
		},
		deselectSkill(event, skill) {
			event.preventDefault();
			if (!this.editable) return;
			if (skill.rank > 1) --skill.rank;
			else skill.selected = false;
		},
		share() {
			let base64 = window.btoa(this.serialize());
			console.log(base64);
			const decoded = window.atob(base64);
			console.log(decoded);
		},
		serialize() {
			let upgrades = [];
			let selectedUpgrades = [
				this.specialisations[this.selections.specialisation].upgrades
					.flat()
					.flat(),
				this.skillTrees[this.selections.primarySkill].upgrades.flat().flat(),
				this.skillTrees[this.selections.secondarySkill].upgrades.flat().flat(),
			]
				.flat()
				.filter((s) => s.selected);

			for (let s of selectedUpgrades) upgrades.push(`${s.REF},${s.rank}`);

			let r = `${this.className},${Object.values(this.selections).join(",")}`;
			let upgradesStr = upgrades.join(",");
			if (upgradesStr.length > 0) r += "," + upgradesStr;

			return r;
		},
	},
};
</script>

<style scoped>
.class {
	text-align: center;
}

.class-header {
	display: inline-grid;
	grid-template-columns: 1fr auto 1fr;
	justify-content: center;
	align-content: center;
	text-transform: capitalize;
	text-align: center;
	margin: auto;
	gap: 0 3em;
}

.class-image {
	width: 150px;
	height: 150px;
	background-position: 50% 50%;
	background-repeat: no-repeat;
	background-size: 170px;
}

.class-name {
	font-size: 5em;
	line-height: 150px;
}

.skill-slots {
	display: grid;
	justify-content: space-around;
	grid-template-columns: 1fr 1fr 1fr;
	margin: 0 5em;
}

.skill-slot {
	margin: 0 0.5em;
}

.skill-selection {
	display: flex;
	justify-content: center;
}

.icon {
	vertical-align: middle;
}
</style>

<style>
.editable .skill {
	cursor: pointer;
}
</style>
