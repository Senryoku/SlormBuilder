<template>
	<div class="skill" @mouseenter="showTooltip" @mouseleave="hideTooltip">
		<div
			:class="{
				passive: skill.TYPE === 'passive',
				selected: skill.selected || selected,
				maxed: skill.rank === skill.UPGRADE_NUMBER,
			}"
			class="skill-image"
		>
			<img :src="image" width="44" height="44" />
		</div>
		<div class="level" v-if="skill.selected && skill.rank !== null">
			{{ skill.rank === skill.UPGRADE_NUMBER ? "Max" : skill.rank }}
		</div>
	</div>
</template>

<script>
export default {
	props: {
		className: { type: String },
		skill: { type: Object },
		selected: { type: Boolean },
	},
	data(inst) {
		let sprite = this.skill.image;
		if (!sprite) {
			sprite =
				"data:image/jpeg;base64,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";
			try {
				sprite = require(`../assets/data/sprites/spr_skills_${inst.className}/spr_skills_${inst.className}_${inst.skill.REF}.png`);
			} catch (e) {
				console.error(e);
			}
		}
		return {
			image: sprite,
			displayTooltip: false,
		};
	},
	methods: {
		showTooltip() {
			this.displayTooltip = true;
		},
		hideTooltip() {
			this.displayTooltip = false;
		},
	},
};
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

	border-image-source: url("../assets/data/sprites/spr_borders/spr_borders_6.png");
	border-image-slice: 12 12 12 12;
	border-image-width: 12px;
	border-image-outset: 0px 0px 0px 0px;
	border-image-repeat: stretch stretch;
	border-image-outset: 12px;
	z-index: 2;
}

.selected {
	border-image-source: url("../assets/data/sprites/spr_borders/spr_borders_2.png");
}

.selected.maxed {
	border-image-source: url("../assets/data/sprites/spr_borders/spr_borders_3.png");
}

.skill-image img {
	position: relative;
	z-index: -1;
}

.passive {
	border-radius: 22px;
	border-image-slice: 22 22 22 22;
	border-image-width: 22px;
	border-image-outset: 0px 0px 0px 0px;
	border-image-repeat: stretch stretch;
	border-image-outset: 11px;
	border-image-source: url("../assets/data/sprites/spr_border_round/spr_border_round_0.png");
}

.passive img {
	border-radius: 22px;
}

.passive.selected {
	border-image-source: url("../assets/data/sprites/spr_border_round/spr_border_round_1.png");
}

.passive.selected.maxed {
	border-image-source: url("../assets/data/sprites/spr_border_round/spr_border_round_5.png");
}

.level {
	position: absolute;
	bottom: -11px;
	right: -11px;
	color: white;
	background-image: url("../assets/data/sprites/spr_skill_rank/spr_skill_rank_0.png");
	width: 22px;
	height: 22px;
	text-align: center;
	padding-top: 2px;
	box-sizing: border-box;
}
</style>