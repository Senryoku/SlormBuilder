<template>
	<div class="attributes unselectable">
		<div class="title">{{ t("Attributes") }}</div>
		<div class="attr-bars">
			<div
				v-for="(attr, idx) in attrNames"
				:key="attr"
				class="attr-bar-container"
			>
				<div
					class="attr-bar clickable"
					@click="plus($event, idx)"
					@contextmenu.prevent="minus($event, idx)"
				>
					<img
						@mouseenter="displayTooltip($event, idx)"
						class="attr-icon"
						:src="TraitIcons[idx]"
					/>
					<img
						v-for="e in effects[idx].filter(
							(e) => e.ADDITIVE !== null
						)"
						:key="e.REF"
						class="effect-level"
						:style="`left: ${76 + additiveEffectMargin(e.LEVEL)}px`"
						:src="TraitEvolve[idx]"
					/>
					<div class="attr-indicators">
						<div
							v-for="i in attributes[idx].level +
							attributes[idx].bonus"
							:key="i"
							class="attr-point"
							:class="{
								bonus: i > attributes[idx].level,
							}"
						>
							<img :src="attrPointImage(idx, i)" />

							<div class="attr-gain" />
						</div>
					</div>
				</div>
				<div class="attr-button-container">
					<div
						class="attr-button plus-button"
						@click="plus($event, idx)"
						:class="{
							disabled:
								!editable ||
								attributes[idx].level + attributes[idx].bonus >=
									75,
						}"
					/>
					<div
						class="attr-button minus-button"
						@click="minus($event, idx)"
						:class="{
							disabled:
								!editable ||
								attributes[idx].level + attributes[idx].bonus <=
									0,
						}"
					/>
				</div>
			</div>
		</div>
	</div>
	<tooltip ref="tooltip">
		<AttributeComponent :attr="hoveredAttr" :key="hoveredAttr.name" />
	</tooltip>
</template>

<script setup lang="ts">
	import { computed, onMounted, ref, useTemplateRef } from "vue";
	import { clamp, spritesByIndex } from "@/utils";
	import { Attributes, type Attribute } from "@/data/Attributes";

	import Tooltip from "./Tooltip.vue";
	import AttributeComponent from "./Attribute.vue";

	const Animation = spritesByIndex(
		import.meta.glob(
			"@/assets/extracted/sprites/spr_class_ui_animation_mini/*.png",
			{ eager: true, query: "?url", import: "default" }
		)
	);

	const TraitIcons = spritesByIndex(
		import.meta.glob("@/assets/extracted/sprites/spr_trait_icons/*.png", {
			eager: true,
			query: "?url",
			import: "default",
		})
	);

	const TraitEvolve = spritesByIndex(
		import.meta.glob("@/assets/extracted/sprites/spr_trait_evolve/*.png", {
			eager: true,
			query: "?url",
			import: "default",
		})
	);

	const TraitPoints = {
		default: spritesByIndex(
			import.meta.glob(
				"@/assets/extracted/sprites/spr_trait_point_default/*.png",
				{ eager: true, query: "?url", import: "default" }
			)
		),
		losange: spritesByIndex(
			import.meta.glob(
				"@/assets/extracted/sprites/spr_trait_point_losange/*.png",
				{ eager: true, query: "?url", import: "default" }
			)
		),
		square: spritesByIndex(
			import.meta.glob(
				"@/assets/extracted/sprites/spr_trait_point_square/*.png",
				{ eager: true, query: "?url", import: "default" }
			)
		),
	};

	const props = withDefaults(
		defineProps<{
			editable: boolean;
		}>(),
		{ editable: true }
	);

	const effects: Attribute[][] = [];
	for (let attr of Attributes) {
		while (attr.TRAIT >= effects.length) effects.push([]);
		effects[attr.TRAIT].push(attr);
	}
	const attrNames = [
		"Toughness",
		"Savagery",
		"Fury",
		"Determination",
		"Zeal",
		"Willpower",
		"Dexterity",
		"Bravery",
	];
	const colors = [
		"#2f5896",
		"#a82f07",
		"#7ab549",
		"#a9852b",
		"#3b9999",
		"#4e2570",
		"#a54e1e",
		"#862d4c",
	];

	const attributes = ref<
		{
			name: string;
			effects: Attribute[];
			color: string;
			level: number;
			bonus: number;
		}[]
	>([]);
	for (let i = 0; i < attrNames.length; ++i) {
		attributes.value.push({
			name: attrNames[i],
			effects: effects[i],
			color: colors[i],
			level: 0,
			bonus: 0,
		});
	}

	const tooltip = useTemplateRef("tooltip");
	const hoveredAttrIdx = ref(0);
	const hoveredAttr = computed(() => {
		return {
			...attributes.value[hoveredAttrIdx.value],
			level:
				attributes.value[hoveredAttrIdx.value].level +
				attributes.value[hoveredAttrIdx.value].bonus,
		};
	});

	const MaxPoints = 100;

	const distributedPoints = computed(() => {
		return attributes.value.reduce((a, b) => a + b.level, 0);
	});

	const MaxBonusPoints = 3 * 11;

	const distributedBonusPoints = computed(() => {
		return attributes.value.reduce((a, b) => a + b.bonus, 0);
	});

	onMounted(() => {
		// Preload animation
		for (let i = 0; i < 8; ++i) {
			const img = new Image();
			img.src = Animation[i];
		}
	});

	function attrPointImage(idx: number, i: number) {
		if (i > attributes.value[idx].level) {
			if (i > 0 && i % 15 === 0) return TraitPoints.losange[8];
			else if (i > 0 && i % 5 === 0) return TraitPoints.square[8];
			else return TraitPoints.default[8];
		} else {
			if (i > 0 && i % 15 === 0) return TraitPoints.losange[idx];
			else if (i > 0 && i % 5 === 0) return TraitPoints.square[idx];
			else return TraitPoints.default[idx];
		}
	}

	function additiveEffectMargin(i: number) {
		--i;
		let fifteen = Math.floor(i / 15);
		let five = Math.floor(i / 5) - fifteen;
		let r = 10 * (i - five - fifteen) + 16 * five + 16 * fifteen;
		if (i > 0 && i % 15 === 0) r -= 12;
		else if (i > 0 && i % 5 === 0) r -= 12;
		return r;
	}

	function displayTooltip(event: MouseEvent, idx: number) {
		hoveredAttrIdx.value = idx;
		tooltip.value!.display(event);
	}

	function plus(event: MouseEvent, idx: number) {
		if (!props.editable) return;
		let max = clamp(
			75 - (attributes.value[idx].level + attributes.value[idx].bonus),
			0,
			75
		);
		let incr = clamp(
			event.getModifierState("Shift") || event.getModifierState("Alt")
				? 10
				: 1,
			0,
			max
		);
		const normal = clamp(MaxPoints - distributedPoints.value, 0, incr);
		const bonus = clamp(
			incr - normal,
			0,
			MaxBonusPoints - distributedBonusPoints.value
		);
		attributes.value[idx].level += normal;
		attributes.value[idx].bonus += bonus;
	}

	function minus(event: MouseEvent, idx: number) {
		if (!props.editable) return;
		// NOTE: contextmenu can't be triggered with getModifierState("Shift")
		let max = attributes.value[idx].level + attributes.value[idx].bonus;
		const decr = clamp(
			event.getModifierState("Shift") || event.getModifierState("Alt")
				? 10
				: 1,
			0,
			max
		);
		const bonus = clamp(attributes.value[idx].bonus, 0, decr);
		attributes.value[idx].bonus -= bonus;
		attributes.value[idx].level -= decr - bonus;
	}

	function serialize() {
		const attrStr = attributes.value.map((a) => a.level).join(",");
		const bonusStr = attributes.value.map((a) => a.bonus).join(",");
		return `${attrStr},${bonusStr}`;
	}

	function deserialize(values: number[], bonus: number[]) {
		for (let i = 0; i < values.length; ++i) {
			attributes.value[i].level = values[i];
			attributes.value[i].bonus = bonus[i];
		}
	}

	function importSave(values: number[], bonus: number[]) {
		deserialize(values, bonus);
	}

	defineExpose({ serialize, deserialize, importSave });
</script>

<style scoped>
	.attributes {
		background-image: url("@/assets/extracted/sprites/spr_inventory_trait_panel/spr_inventory_trait_panel_0.png");
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
		background-image: url("@/assets/extracted/sprites/spr_trait_bar_large/spr_trait_bar_large_0.png");
		background-repeat: no-repeat;
	}

	.attr-bar-container:nth-child(odd) .attr-bar {
		background-image: url("@/assets/extracted/sprites/spr_trait_bar_large/spr_trait_bar_large_1.png");
		background-position: 16px;
	}

	.attr-icon {
		position: absolute;
		top: 12px;
		left: 12.3px;
		z-index: 2;
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
		background-image: url("@/assets/extracted/sprites/spr_trait_button_back/spr_trait_button_back_0.png");
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
		animation-timing-function: step-start;
		animation-name: attr-gain-animation;
		animation-direction: forward;

		background-repeat: no-repeat;
		background-position: center;
	}

	.attr-point:nth-child(15n) .attr-gain {
		animation-name: attr-gain-major-animation;
		width: 112.5px;
		height: 120px;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
	}

	@keyframes attr-gain-animation {
		0% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_0.png");
		}
		14% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_1.png");
		}
		28% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_2.png");
		}
		42% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_3.png");
		}
		56% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_4.png");
		}
		70% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_5.png");
		}
		85% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_6.png");
		}
		100% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation_mini/spr_class_ui_animation_mini_7.png");
		}
	}

	@keyframes attr-gain-major-animation {
		0% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation/spr_class_ui_animation_0.png");
		}
		14% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation/spr_class_ui_animation_1.png");
		}
		28% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation/spr_class_ui_animation_2.png");
		}
		42% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation/spr_class_ui_animation_3.png");
		}
		56% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation/spr_class_ui_animation_4.png");
		}
		70% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation/spr_class_ui_animation_5.png");
		}
		85% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation/spr_class_ui_animation_6.png");
		}
		100% {
			background-image: url("@/assets/extracted/sprites/spr_class_ui_animation/spr_class_ui_animation_7.png");
		}
	}

	.plus-button {
		position: absolute;
		top: 8px;
		left: 8px;
		background-image: url("@/assets/extracted/sprites/spr_trait_button_plus/spr_trait_button_plus_0.png");
	}
	.plus-button:hover {
		background-image: url("@/assets/extracted/sprites/spr_trait_button_plus/spr_trait_button_plus_1.png");
	}
	.plus-button:active {
		background-image: url("@/assets/extracted/sprites/spr_trait_button_plus/spr_trait_button_plus_2.png");
	}
	.plus-button.disabled {
		background-image: url("@/assets/extracted/sprites/spr_trait_button_plus/spr_trait_button_plus_4.png");
	}

	.minus-button {
		position: absolute;
		top: 8px;
		right: 8px;
		background-image: url("@/assets/extracted/sprites/spr_trait_button_minus/spr_trait_button_minus_0.png");
	}
	.minus-button:hover {
		background-image: url("@/assets/extracted/sprites/spr_trait_button_minus/spr_trait_button_minus_1.png");
	}
	.minus-button:active {
		background-image: url("@/assets/extracted/sprites/spr_trait_button_minus/spr_trait_button_minus_2.png");
	}
	.minus-button.disabled {
		background-image: url("@/assets/extracted/sprites/spr_trait_button_minus/spr_trait_button_minus_4.png");
	}
</style>
