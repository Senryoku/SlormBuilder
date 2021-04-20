<template>
	<div class="skill">
		<div
			:class="{
				support: support,
				passive: skill.TYPE === 'passive',
				selected: skill.selected || selected,
				maxed: skill.rank === skill.UPGRADE_NUMBER,
			}"
			class="skill-image"
			:style="`background-image: url(${image})`"
		></div>
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
		support: { type: Boolean, default: false },
	},
	data(props) {
		let sprite = props.skill.image;
		if (!sprite || props.support) {
			sprite = require("../assets/data/sprites/spr_unknown_48/spr_unknown_48_0.png");
			try {
				switch (props.className) {
					case "knight":
						sprite = props.support
							? require(`../assets/data/sprites/spr_supports_knight/spr_supports_knight_${props.skill.REF}.png`)
							: require(`../assets/data/sprites/spr_skills_knight/spr_skills_knight_${props.skill.REF}.png`);
						break;
					case "huntress":
						sprite = props.support
							? require(`../assets/data/sprites/spr_supports_huntress/spr_supports_huntress_${props.skill.REF}.png`)
							: require(`../assets/data/sprites/spr_skills_huntress/spr_skills_huntress_${props.skill.REF}.png`);
						break;
					case "mage":
						sprite = props.support
							? require(`../assets/data/sprites/spr_supports_mage/spr_supports_mage_${props.skill.REF}.png`)
							: require(`../assets/data/sprites/spr_skills_mage/spr_skills_mage_${props.skill.REF}.png`);
						break;
				}
			} catch (e) {
				console.error(e);
			}
		}
		return {
			image: sprite,
		};
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

	border-style: solid;
	border-image-source: url("../assets/data/sprites/spr_borders/spr_borders_6.png");
	border-image-slice: 12 12 12 12;
	border-image-width: 12px;
	border-image-outset: 0px 0px 0px 0px;
	border-image-repeat: stretch stretch;
	border-image-outset: 8px;
	background-size: cover;
	z-index: 2;
}

.skill-image.support {
	width: 92px;
}

.selected {
	border-image-source: url("../assets/data/sprites/spr_borders/spr_borders_2.png");
}

.selected.maxed:not(.passive) {
	border-image-source: url("../assets/data/sprites/spr_borders/spr_borders_3.png");
	border-image-slice: 16 16 16 16;
	border-image-width: 16px;
	border-image-outset: 8px;
}

.passive {
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