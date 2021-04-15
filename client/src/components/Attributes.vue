<template>
	<div class="attributes unselectable">
		<div class="title">Attributes</div>
		<div class="attr-bars">
			<div
				v-for="(attr, idx) in attributes"
				:key="attr"
				class="attr-bar-container"
			>
				<div class="attr-bar">
					<img
						class="attr-icon"
						:src="
							require(`@/assets/data/sprites/spr_trait_icons/spr_trait_icons_${idx}.png`)
						"
					/><!-- TODO! -->
					<img
						v-for="e in effects[idx].filter((e) => e.ADDITIVE !== null)"
						:key="e.REF"
						class="effect-level"
						:style="`left: ${76 + additiveEffectMargin(e.LEVEL)}px`"
						:src="
							require(`@/assets/data/sprites/spr_trait_evolve/spr_trait_evolve_${idx}.png`)
						"
					/>
					<div class="attr-indicators">
						<div v-for="i in attrValues[idx]" :key="i" class="attr-point">
							<img
								:src="
									require(`@/assets/data/sprites/${attrPointImage(
										i
									)}/${attrPointImage(i)}_${idx}.png`)
								"
							/>

							<div class="attr-gain" />
						</div>
					</div>
				</div>
				<div class="attr-button-container">
					<div
						class="attr-button plus-button"
						@click="attrValues[idx] = clamp(attrValues[idx] + 1, 0, 75)"
						:class="{ disabled: !editable || attrValues[idx] >= 75 }"
					/>
					<div
						class="attr-button minus-button"
						@click="attrValues[idx] = clamp(attrValues[idx] - 1, 0, 75)"
						:class="{ disabled: !editable || attrValues[idx] <= 0 }"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import AttributeData from "../assets/data/dat_att.json";

export default {
	props: {
		values: { type: Array },
		editable: { type: Boolean, default: true },
	},
	data() {
		let effects = [];
		for (let attr of AttributeData) {
			while (attr.TRAIT > effects.length - 1) effects.push([]);
			effects[attr.TRAIT].push(attr);
		}
		const attributes = [
			"Toughness",
			"Savagery",
			"Fury",
			"Determination",
			"Zeal",
			"Willpower",
			"Dexterity",
			"Bravery",
		];
		const attrValues = [];
		for (let i = 0; i < attributes.length; ++i)
			attrValues.push(this.values ? this.values[i] : 0);
		return {
			attributes,
			attrValues,
			effects,
		};
	},
	methods: {
		clamp(val, min, max) {
			return Math.max(0, Math.min(val, max));
		},
		attrPointImage(idx) {
			if (idx > 0 && idx % 15 === 0) return "spr_trait_point_losange";
			else if (idx > 0 && idx % 5 === 0) return "spr_trait_point_square";
			else return "spr_trait_point_default";
		},
		additiveEffectMargin(i) {
			--i;
			let fifteen = Math.floor(i / 15);
			let five = Math.floor(i / 5) - fifteen;
			let r = 10 * (i - five - fifteen) + 16 * five + 16 * fifteen;
			if (i > 0 && i % 15 === 0) r -= 12;
			else if (i > 0 && i % 5 === 0) r -= 12;
			return r;
		},
		serialize() {
			return this.attrValues.join(",");
		},
	},
};
</script>

<style>
.attributes {
	margin: 1em auto;
	background-image: url("../assets/data/sprites/spr_inventory_trait_panel/spr_inventory_trait_panel_0.png");
	text-align: center;
	width: 1192px;
	height: 840px;
}

.title {
	padding-top: 40px;
	margin-bottom: 100px;
	height: 90px;
	line-height: 90px;
	font-size: 3rem;
}

.attr-bars {
	margin: auto;
	width: min-content;
}

.attr-bar-container {
	display: flex;
	align-items: center;
}

.attr-bar {
	position: relative;
	width: 924px;
	height: 60px;
	background-image: url("../assets/data/sprites/spr_trait_bar_large/spr_trait_bar_large_0.png");
}

.attr-bar-container:nth-child(odd) .attr-bar {
	background-image: url("../assets/data/sprites/spr_trait_bar_large/spr_trait_bar_large_1.png");
}

.attr-icon {
	position: absolute;
	top: 12px;
	left: 12.3px;
}

.attr-bar-container:nth-child(odd) .attr-icon {
	left: 28px;
}

.attr-indicators {
	display: flex;
	position: absolute;
	top: 18px;
	left: 74px;
	align-items: center;
	height: 24px;
}

.attr-point {
	position: relative;
	margin: 0 2px;
}

.attr-point:nth-child(5n) {
	margin: 6px;
}

.attr-point:nth-child(15n) {
	margin: 4px 2px 0 2px;
}

.effect-level {
	position: absolute;
	top: 8px;
}

.attr-button-container {
	background-image: url("../assets/data/sprites/spr_trait_button_back/spr_trait_button_back_0.png");
	width: 100px;
	height: 60px;
	position: relative;
}

.attr-button {
	width: 44px;
	height: 44px;
	cursor: pointer;
}

.attr-button.disabled {
	pointer-events: none;
}

.attr-gain {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 1;

	width: 75px;
	height: 80px;

	animation-duration: 400ms;
	animation-iteration-count: 1;
	animation-timing-function: linear;
	animation-name: attr-gain-animation;
	animation-direction: forward;
}

.attr-point:nth-child(15n) .attr-gain {
	animation-name: attr-gain-major-animation;
	width: 112.5px;
	height: 120px;
	background-size: cover;
	background-repeat: no-repeat;
}

@keyframes attr-gain-animation {
	0% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_0.png");
	}
	14% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_1.png");
	}
	28% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_2.png");
	}
	42% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_3.png");
	}
	56% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_4.png");
	}
	70% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_5.png");
	}
	85% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_6.png");
	}
	100% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_7.png");
	}
}

@keyframes attr-gain-major-animation {
	0% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation/spr_class_ui_animation_0.png");
	}
	14% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation/spr_class_ui_animation_1.png");
	}
	28% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation/spr_class_ui_animation_2.png");
	}
	42% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation/spr_class_ui_animation_3.png");
	}
	56% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation/spr_class_ui_animation_4.png");
	}
	70% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation/spr_class_ui_animation_5.png");
	}
	85% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation/spr_class_ui_animation_6.png");
	}
	100% {
		background-image: url("../assets/data/sprites/spr_class_ui_animation/spr_class_ui_animation_7.png");
	}
}

.plus-button {
	position: absolute;
	top: 8px;
	left: 8px;
	background-image: url("../assets/data/sprites/spr_trait_button_plus/spr_trait_button_plus_0.png");
}
.plus-button:hover {
	background-image: url("../assets/data/sprites/spr_trait_button_plus/spr_trait_button_plus_1.png");
}
.plus-button:active {
	background-image: url("../assets/data/sprites/spr_trait_button_plus/spr_trait_button_plus_2.png");
}
.plus-button.disabled {
	background-image: url("../assets/data/sprites/spr_trait_button_plus/spr_trait_button_plus_4.png");
}

.minus-button {
	position: absolute;
	top: 8px;
	right: 8px;
	background-image: url("../assets/data/sprites/spr_trait_button_minus/spr_trait_button_minus_0.png");
}
.minus-button:hover {
	background-image: url("../assets/data/sprites/spr_trait_button_minus/spr_trait_button_minus_1.png");
}
.minus-button:active {
	background-image: url("../assets/data/sprites/spr_trait_button_minus/spr_trait_button_minus_2.png");
}
.minus-button.disabled {
	background-image: url("../assets/data/sprites/spr_trait_button_minus/spr_trait_button_minus_4.png");
}
</style>