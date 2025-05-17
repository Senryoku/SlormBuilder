<template>
	<div class="class" :class="{ editable: editable }">
		<div class="skill-slots">
			<div class="skill-slot">
				<img
					class="icon"
					src="@/assets/extracted/sprites/spr_keyboard_buttons/spr_keyboard_buttons_5.png"
				/>
				{{ t("Specialisation (Support Skill)") }}
				<div class="skill-selection">
					<skill-icon
						v-for="(spec, idx) in specialisations"
						:className="className"
						:skill="spec.skill"
						:key="idx"
						@click="if (editable) selections.specialisation = idx;"
						:selected="idx === selections.specialisation"
						@mouseenter="display($event, spec.skill)"
						:support="true"
					/>
				</div>
				<skill-tree
					:tree="specialisations[selections.specialisation]"
					@selectSkill="selectSkill"
					@deselectSkill="deselectSkill"
					@display="display"
				/>
			</div>
			<div class="skill-slot">
				<img
					class="icon"
					src="@/assets/extracted/sprites/spr_keyboard_buttons/spr_keyboard_buttons_0.png"
				/>
				{{ t("Primary Skill") }}
				<div class="skill-selection">
					<SkillIcon
						v-for="(spec, idx) in skillTrees"
						:className="className"
						:skill="spec.skill"
						:key="idx"
						@click="
							if (editable) {
								if (selections.secondarySkill === idx)
									selections.secondarySkill =
										selections.primarySkill;
								selections.primarySkill = idx;
							}
						"
						:selected="idx === selections.primarySkill"
						@mouseenter="display($event, spec.skill)"
					/>
				</div>
				<SkillTree
					:tree="skillTrees[selections.primarySkill]"
					@selectSkill="selectSkill"
					@deselectSkill="deselectSkill"
					@display="display"
				/>
			</div>
			<div class="skill-slot">
				<img
					class="icon"
					src="@/assets/extracted/sprites/spr_keyboard_buttons/spr_keyboard_buttons_1.png"
				/>
				{{ t("Secondary Skill") }}
				<div class="skill-selection">
					<skill-icon
						v-for="(spec, idx) in skillTrees"
						:className="className"
						:skill="spec.skill"
						:key="idx"
						@click="
							if (editable) {
								if (selections.primarySkill === idx)
									selections.primarySkill =
										selections.secondarySkill;
								selections.secondarySkill = idx;
							}
						"
						:selected="idx === selections.secondarySkill"
						@mouseenter="display($event, spec.skill)"
					/>
				</div>
				<skill-tree
					:tree="skillTrees[selections.secondarySkill]"
					@selectSkill="selectSkill"
					@deselectSkill="deselectSkill"
					@display="display"
				/>
			</div>
		</div>
		<tooltip ref="skillTooltip">
			<skill-tooltip
				v-if="hoveredSkill"
				:className="className"
				:skill="hoveredSkill"
				:key="hoveredSkill?.REF"
			/>
		</tooltip>
	</div>
</template>

<script setup lang="ts">
	import { ref, useTemplateRef } from "vue";
	import { getSkillSprite, type ClassName } from "../utils.js";
	import SkillIcon from "./SkillIcon.vue";
	import SkillTree from "./SkillTree.vue";
	import Tooltip from "./Tooltip.vue";
	import SkillTooltip from "./SkillTooltip.vue";

	import {
		KnightSkills,
		HuntressSkills,
		MageSkills,
		type AugmentedSkill,
	} from "../data/Skills.js";

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

	const props = withDefaults(
		defineProps<{
			className: ClassName;
			editable?: boolean;
		}>(),
		{
			editable: true,
		}
	);

	const skills = ref<AugmentedSkill[]>([]);
	const activeBoxes: AugmentedSkill[][] = [];

	for (let s of SkillData[props.className]) {
		const as: AugmentedSkill = {
			...s,
			selected: false,
			rank: 0,
			image: getSkillSprite(props.className, s),
		};
		skills.value.push(as);
		// FIXME: I don't even know how it's supposed to work. Most of ACTIVE_BOX are null. I don't remember what it means.
		//        Casting to number is wrong.
		if (!activeBoxes[s.ACTIVE_BOX as number])
			activeBoxes[s.ACTIVE_BOX as number] = [];
		activeBoxes[s.ACTIVE_BOX as number].push(as);
	}

	function splitToRows(
		array: AugmentedSkill[],
		className: ClassName,
		idx: number
	) {
		let result = [];
		array.sort((l, r) =>
			l.UNLOCK_LEVEL === r.UNLOCK_LEVEL
				? l.ORDER! - r.ORDER!
				: l.UNLOCK_LEVEL! - r.UNLOCK_LEVEL!
		);
		for (let count of TreeShapes[className][idx]) {
			let row = array.splice(0, Math.min(count, array.length));
			result.push(row);
		}
		return result;
	}

	const genTree = (arr: AugmentedSkill[], idx: number) => {
		let primarySkills = arr.splice(0, 1)[0];
		let upgrades = splitToRows(arr, props.className, idx);
		return {
			className: props.className,
			skill: primarySkills,
			upgrades: upgrades,
		};
	};

	let skillTrees = ref(activeBoxes.map(genTree));

	const specialisations = ref(skillTrees.value.splice(0, 3));
	const selections = ref({
		specialisation: 0,
		primarySkill: 0,
		secondarySkill: 1,
	});

	const skillTooltip = useTemplateRef<typeof SkillTooltip>("skillTooltip");
	const hoveredSkill = ref<AugmentedSkill | null>(null);

	function display(event: MouseEvent, skill: AugmentedSkill) {
		hoveredSkill.value = skill;
		skillTooltip.value?.display(event);
	}

	function selectSkill(
		event: MouseEvent,
		tree: { skill: AugmentedSkill[]; upgrades: AugmentedSkill[][] },
		row: number,
		skill: AugmentedSkill
	) {
		if (!props.editable) return;
		let alt =
			event.getModifierState("Shift") || event.getModifierState("Alt");
		if (skill.selected) {
			skill.rank = alt
				? skill.UPGRADE_NUMBER!
				: Math.min(skill.rank + 1, skill.UPGRADE_NUMBER!);
		} else {
			tree.upgrades[row].map((s: AugmentedSkill) => (s.selected = false)); // Deselect all other skills in row.
			skill.rank = alt ? skill.UPGRADE_NUMBER! : Math.max(skill.rank, 1);
			skill.selected = true;
		}
	}

	function deselectSkill(event: MouseEvent, skill: AugmentedSkill) {
		event.preventDefault();
		if (!props.editable) return;
		let alt =
			event.getModifierState("Shift") || event.getModifierState("Alt");
		if (alt) {
			skill.rank = 0;
			skill.selected = false;
		} else if (skill.rank > 0) --skill.rank;
		if (skill.rank <= 0) skill.selected = false;
	}

	function share() {
		let base64 = window.btoa(serialize());
		console.log(base64);
		const decoded = window.atob(base64);
		console.log(decoded);
	}

	function serialize() {
		let upgrades = [];
		let selectedUpgrades = [
			specialisations.value[selections.value.specialisation].upgrades
				.flat()
				.flat(),
			skillTrees.value[selections.value.primarySkill].upgrades
				.flat()
				.flat(),
			skillTrees.value[selections.value.secondarySkill].upgrades
				.flat()
				.flat(),
		]
			.flat()
			.filter((s) => s.selected);

		for (let s of selectedUpgrades) upgrades.push(`${s.REF},${s.rank}`);

		let r = `${props.className},${Object.values(selections.value).join(
			","
		)}`;
		let upgradesStr = upgrades.join(",");
		if (upgradesStr.length > 0) r += "," + upgradesStr;

		return r;
	}

	function deserialize(
		selections: {
			primarySkill: number;
			secondarySkill: number;
			specialisation: number;
		},
		upgrades: { REF: number; rank: number; selected: boolean }[]
	) {
		importSave(selections, upgrades);
	}

	function importSave(
		importedSelections: {
			primarySkill: number;
			secondarySkill: number;
			specialisation: number;
		},
		upgrades: { REF: number; rank: number; selected: boolean }[]
	) {
		selections.value = importedSelections;
		for (let u of skills.value) u.selected = false;
		for (let u of upgrades) {
			let t = skills.value.find((up) => up.REF === u.REF);
			if (t) {
				t.selected = u.selected;
				t.rank = u.rank;
			} else console.warn("Could not find ", u);
		}
	}

	defineExpose({
		share,
		serialize,
		deserialize,
		importSave,
	});
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
