<template>
	<div class="skill-tree">
		<slot></slot>
		<!-- <skill :className="tree.className" :skill="tree.skill" /> -->
		<div v-for="(row, rowIdx) in tree.upgrades" :key="rowIdx" class="skill-row">
			<div class="skill-tier-bubble">
				<div>
					{{
						["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][
							rowIdx
						]
					}}
				</div>
			</div>
			<skill
				v-for="skill in row"
				:key="skill.EN_NAME"
				:className="tree.className"
				:skill="skill"
				@click="$emit('selectSkill', tree, rowIdx, skill)"
				@contextmenu="$emit('deselectSkill', $event, skill)"
				@mouseenter="$emit('display', $event, skill)"
			/>
		</div>
	</div>
</template>

<script>
import Skill from "./Skill.vue";

export default {
	components: {
		Skill,
	},
	props: {
		tree: { type: Object, required: true },
	},
};
</script>

<style scoped>
.skill-tree {
	margin: 12px 24px;
	padding: 2px 12px;

	background-color: #111;

	border-style: solid;
	border-image-source: url("../assets/img/skill-tree-border.png");
	border-image-slice: 16 16 16 16;
	border-image-width: 12px;
	border-image-outset: 0px 0px 0px 0px;
	border-image-repeat: stretch stretch;
	border-image-outset: 12px;
}

.skill-row {
	display: flex;
	position: relative;
	padding-left: 42px;
	margin: 12px 0;
	background: url("../assets/data/sprites/spr_skill_tier_link/spr_skill_tier_link_0.png");
	background-repeat: repeat-x;
	background-position-y: 50%;
}

.skill-tier-bubble {
	position: absolute;
	left: -44px;
	top: 4px;
	background: url("../assets/data/sprites/spr_skill_tier_bubble/spr_skill_tier_bubble_0.png");
	width: 88px;
	height: 44px;
	color: white;
	padding: 13px 0;
	background-repeat: no-repeat;
	-ms-user-select: none;
	user-select: none;
}

.skill-tier-bubble div {
	font-family: Andale Mono;
	width: 56px;
	text-align: center;
}

.skill-row .skill:not(:last-child) {
	margin-right: 24px;
}

.pre {
	white-space: pre-line;
}
</style>