<template>
	<div class="attributes">
		<div
			v-for="(attr, idx) in attributes"
			:key="attr"
			class="attr-bar-container"
		>
			<div class="attr-bar">
				<img
					class="attr-icon"
					:src="
						require(`../assets/data/sprites/spr_trait_icons/spr_trait_icons_${idx}.png`)
					"
				/>
				<div class="attr-indicators">
					<img
						v-for="i in attrValues[idx]"
						:key="i"
						class="attr-point"
						:src="
							require(`../assets/data/sprites/${attrPointImage(
								i
							)}/${attrPointImage(i)}_${idx}.png`)
						"
					/>
				</div>
			</div>
			<div class="attr-button-container">
				<div
					class="attr-button plus-button"
					@click="attrValues[idx] = clamp(attrValues[idx] + 1, 0, 75)"
					:class="{ disabled: attrValues[idx] >= 75 }"
				/>
				<div
					class="attr-button minus-button"
					@click="attrValues[idx] = clamp(attrValues[idx] - 1, 0, 75)"
					:class="{ disabled: attrValues[idx] <= 0 }"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import AttributeData from "../assets/data/dat_att.json";

export default {
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
		for (let i = 0; i < attributes.length; ++i) attrValues.push(0);
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
	},
};
</script>

<style>
.attributes {
	margin: 1em 3em;
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
	top: 17px;
	left: 74px;
	align-items: center;
	height: 24px;
}

.attr-point {
	margin: 0 2px;
}

.attr-point:nth-child(5n) {
	margin: 6px;
}

.attr-point:nth-child(15n) {
	margin: 2px;
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
}

.attr-button.disabled {
	pointer-events: none;
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