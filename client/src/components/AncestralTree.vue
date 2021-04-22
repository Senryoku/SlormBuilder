<template>
	<div class="ancestral-tree unselectable" ref="el">
		<div
			class="tree"
			:class="{ panning: pan.panning }"
			@click="help"
			@mouseenter.self="mouseenter"
			@mousedown.self="mousedown"
			@mousemove.self="mousemove"
			@mouseup="mouseup"
			:style="`transform: scale(${scale})`"
			ref="tree"
		>
			<template
				v-for="(realm, rIdx) in Realms.filter((r) => r.coords.length > 0)"
				:key="rIdx"
			>
				<div
					v-for="(e, idx) in realm.elements"
					:key="e.REF"
					class="element-node clickable"
					:style="`top: ${realm.coords[idx][0]}px; left: ${realm.coords[idx][1]}px`"
				>
					<SkillIcon
						:skill="e"
						:round="true"
						@mouseenter="displayTooltip($event, e)"
						@click="selectSkill($event, e)"
						@contextmenu="deselectSkill($event, e)"
					/></div
			></template>
		</div>
	</div>
	<Tooltip ref="tooltip"
		><Element :v-if="hoveredSkill" :element="hoveredSkill"></Element
	></Tooltip>
</template>

<script>
import { ref } from "vue";
import { clamp } from "../utils.js";
import Elements from "../assets/data/dat_ele.json";
import SkillIcon from "./SkillIcon.vue";
import Element from "./Element.vue";
import Tooltip from "./Tooltip.vue";

export default {
	name: "AncestralTree",
	components: { Tooltip, Element, SkillIcon },
	props: {
		editable: { type: Boolean, default: true },
	},
	data() {
		let Realms = [];

		for (let e of Elements) {
			while (Realms.length - 1 < e.REALM)
				Realms.push({ elements: [], coords: [] });
			Realms[e.REALM].elements.push(e);
			e.rank = 0;
			e.selected = false;
			e.image = require(`../assets/data/sprites/spr_elements/spr_elements_${e.REF}.png`);
		}

		const radialCoords = (i, d, r, p = 0) => [
			1500 + r * Math.cos(p - ((2 * Math.PI * 1) / d) * (i % d)),
			1500 + r * Math.sin(p - ((2 * Math.PI * 1) / d) * (i % d)),
		];

		for (let i = 0; i < 10; i++)
			Realms[i].coords.push(radialCoords(i, 10, 238, (4.5 * Math.PI) / 5));

		for (let i = 0; i < 10; i++)
			Realms[10 + i].coords.push(radialCoords(i, 10, 370, (4 * Math.PI) / 5));

		for (let i = 0; i < 10; i++) {
			let center = radialCoords(i, 10, 505, (4.5 * Math.PI) / 5);
			if (center[1] > 2048) {
				Realms[20 + i].coords.push([center[0] + 24, center[1] - 36]);
				Realms[20 + i].coords.push([center[0] - 24, center[1] + 36]);
			} else {
				Realms[20 + i].coords.push([center[0] + 24, center[1] + 36]);
				Realms[20 + i].coords.push([center[0] - 24, center[1] - 36]);
			}
		}

		for (let i = 0; i < 10; i++)
			Realms[30 + i].coords.push(radialCoords(i, 10, 596, (5 * Math.PI) / 5));

		return {
			el: ref(null),
			tree: ref(null),
			tooltip: ref(null),
			Elements,
			Realms,
			pan: ref({ panning: false, start: { x: 0, y: 0 } }),
			hoveredSkill: ref(null),
			scale: ref(1),
		};
	},
	mounted() {
		// FIXME: Should be called on first actual render, not mounted.
		this.$refs.el.scrollLeft = 1500 - this.$refs.el.clientWidth / 2;
		this.$refs.el.scrollTop = 1500 - this.$refs.el.clientHeight / 2;
		this.$refs.el.addEventListener("wheel", this.zoom);
	},
	methods: {
		help(e) {
			console.log([e.layerX, e.layerY]);
		},
		mousedown() {
			this.pan.panning = true;
			this.pan.start.x = this.$refs.el.scrollLeft;
			this.pan.start.y = this.$refs.el.scrollTop;
		},
		mousemove(e) {
			if (this.pan.panning) {
				this.$refs.el.scrollLeft = Math.min(
					this.$refs.el.scrollWidth - this.$refs.el.clientWidth,
					Math.max(0, this.$refs.el.scrollLeft - e.movementX)
				);
				this.$refs.el.scrollTop = Math.min(
					this.$refs.el.scrollHeight - this.$refs.el.clientHeight,
					Math.max(0, this.$refs.el.scrollTop - e.movementY)
				);
			}
		},
		mouseup() {
			this.pan.panning = false;
		},
		mouseenter(e) {
			if (!(e.buttons & 1))
				// Primary button isn't down
				this.pan.panning = false;
		},
		displayTooltip(e, s) {
			this.hoveredSkill = s;
			this.$refs.tooltip.display(e);
		},
		selectSkill(e, skill) {
			if (!this.editable) return;
			let alt = e.getModifierState("Shift") || e.getModifierState("Alt");
			if (skill.selected) {
				skill.rank = alt
					? skill.UPGRADE_NUMBER
					: Math.min(skill.rank + 1, skill.UPGRADE_NUMBER);
			} else {
				skill.rank = alt ? skill.UPGRADE_NUMBER : Math.max(skill.rank, 1);
				skill.selected = true;
			}
		},
		deselectSkill(e, skill) {
			e.preventDefault();
			if (!this.editable) return;
			let alt = e.getModifierState("Shift") || e.getModifierState("Alt");
			if (alt) {
				skill.rank = 0;
				skill.selected = false;
			}
			skill.rank = Math.max(0, skill.rank - 1);
			if (skill.rank === 0) skill.selected = false;
		},
		zoom(e) {
			e.preventDefault();
			this.scale = clamp(
				this.scale + 0.1 * (e.deltaY > 0 ? -1 : 1),
				Math.max(
					this.$refs.el.clientWidth / 3000,
					this.$refs.el.clientHeight / 3000
				),
				1
			);
		},
	},
};
</script>

<style>
.ancestral-tree {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 12px;
	overflow: scroll;
	margin: auto;

	border-style: solid;
	border-image-source: url("../assets/img/skill-tree-border.png");
	border-image-slice: 16 16 16 16;
	border-image-width: 12px;
	border-image-outset: 0px 0px 0px 0px;
	border-image-repeat: stretch stretch;
	border-image-outset: 12px;

	background-color: #0f0f0f;
}

.tree {
	position: relative;
	width: 3000px;
	height: 3000px;
	background-color: #111;
	background-image: url("../assets/data/sprites/spr_menu_element_tree/spr_menu_element_tree_0.png"),
		url("../assets/data/sprites/spr_menu_element_tree_back/spr_menu_element_tree_back_0.png");
	background-position: 50%;
	transform-origin: 50% 50%;
	cursor: grab;

	transform: scale(1);
	transition: transform 0.2s ease;
}

.tree.panning {
	cursor: grabbing;
}

.element-node {
	position: absolute;
	transform: translate(-50%, -50%);
}
</style>