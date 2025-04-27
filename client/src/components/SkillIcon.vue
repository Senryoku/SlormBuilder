<template>
	<div class="skill">
		<div
			:class="{
				support: support,
				passive: round,
				selected: skill.selected || selected,
				maxed: skill.rank === skill.UPGRADE_NUMBER,
			}"
			class="skill-image"
			:style="`background-image: url(${image})`"
			:alt="skill.EN_NAME"
		></div>
		<div class="level" v-if="skill.selected && skill.rank !== null">
			{{ skill.rank === skill.UPGRADE_NUMBER ? "Max" : skill.rank }}
		</div>
	</div>
</template>

<script setup lang="ts">
	import { getSkillSprite } from "../utils";
	import type { AugmentedSkill } from "./Skills";

	defineOptions({
		name: "SkillIcon",
	});

	const props = withDefaults(
		defineProps<{
			className?: "knight" | "huntress" | "mage";
			skill: AugmentedSkill;
			selected?: boolean;
			support?: boolean;
			round?: boolean;
		}>(),
		{
			selected: false,
			support: false,
			round: false,
		}
	);

	let image = props.skill.image;
	if (!image || props.support) {
		image = getSkillSprite(props.className!, props.skill, props.support);
	}
</script>

<style scoped>
	.skill {
		position: relative;
		margin: 6px;
		z-index: 1;
		-ms-user-select: none;
		user-select: none;
	}

	.skill-image {
		width: 44px;
		height: 44px;

		border-style: solid;
		border-image-source: url("../assets/extracted/sprites/spr_borders/spr_borders_6.png");
		border-image-slice: 15 15 15 15;
		border-image-width: 15px;
		border-image-outset: 0px 0px 0px 0px;
		border-image-repeat: stretch stretch;
		border-image-outset: 6px;
		background-size: cover;
		z-index: 2;
	}

	.skill-image.support {
		width: 92px;
	}

	.selected {
		border-image-source: url("../assets/extracted/sprites/spr_borders/spr_borders_2.png");
	}

	.selected.maxed:not(.passive) {
		border-image-source: url("../assets/extracted/sprites/spr_borders/spr_borders_3.png");
	}

	.passive {
		border-image-slice: 18;
		border-image-width: 18px;
		border-image-outset: 0px 0px 0px 0px;
		border-image-repeat: stretch stretch;
		border-image-outset: 6px;
		border-image-source: url("../assets/extracted/sprites/spr_border_round/spr_border_round_0.png");
	}

	.passive img {
		border-radius: 18px;
	}

	.passive.selected {
		border-image-source: url("../assets/extracted/sprites/spr_border_round/spr_border_round_1.png");
	}

	.passive.selected.maxed {
		border-image-source: url("../assets/extracted/sprites/spr_border_round/spr_border_round_5.png");
		border-image-slice: 20;
		border-image-width: 20px;
		border-image-outset: 0px 0px 0px 0px;
		border-image-outset: 10px;
	}

	.level {
		position: absolute;
		bottom: -11px;
		right: -11px;
		color: white;
		background-image: url("../assets/extracted/sprites/spr_skill_rank/spr_skill_rank_0.png");
		width: 22px;
		height: 22px;
		text-align: center;
		padding-top: 2px;
		box-sizing: border-box;
	}
</style>
