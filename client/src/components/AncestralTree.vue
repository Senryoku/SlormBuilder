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
				v-for="(realm, rIdx) in Realms.filter(
					(r) => r.coords.length > 0
				)"
				:key="rIdx"
			>
				<div class="realm">
					<!--
					<div
						style="
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							width: 10px;
							height: 10px;
							border-radius: 5px;
							background-color: red;
							z-index: 99;
						"
						:style="`left: ${realm.coords[0]}px; top: ${realm.coords[1]}px`"
					></div>
					<div
						style="
							position: absolute;
							top: -2em;
							height: 2em;
							width: 5em;
							transform: translate(-50%, 0);
						"
						:style="`left: ${realm.coords[0]}px; top: calc(${realm.coords[1]}px - 4em)`"
					>
						Debug {{ rIdx }}
					</div>
					-->
					<div
						v-for="(e, idx) in realm.elements"
						:key="e.REF"
						class="element-node clickable"
						:style="`left: ${
							realm.coords[0] + realm.offsets[idx][0]
						}px; top: ${realm.coords[1] + realm.offsets[idx][1]}px`"
					>
						<SkillIcon
							:skill="e"
							:round="true"
							@mouseenter="displayTooltip($event, e)"
							@click="selectSkill($event, e)"
							@contextmenu="deselectSkill($event, e)"
						/>
					</div></div
			></template>
			<div
				v-for="(bridge, idx) in Bridges.filter((b) => b.selected)"
				:key="idx"
				class="bridge"
				:style="`left: ${bridge.coords[0]}px; top: ${bridge.coords[1]}px`"
			></div>
		</div>
	</div>
	<Tooltip ref="tooltip">
		<ElementComponent
			:v-if="hoveredSkill"
			:element="hoveredSkill"
		></ElementComponent>
	</Tooltip>
</template>

<script>
	import { ref } from "vue";
	import { clamp } from "../utils.js";
	import Elements from "../assets/extracted/dat_ele.json";
	import SkillIcon from "./SkillIcon.vue";
	import ElementComponent from "./Element.vue";
	import Tooltip from "./Tooltip.vue";

	export default {
		name: "AncestralTree",
		components: { Tooltip, ElementComponent, SkillIcon },
		props: {
			editable: { type: Boolean, default: true },
			import: { type: Object },
		},
		data(props) {
			let Realms = [];

			for (let e of Elements) {
				while (Realms.length - 1 < e.REALM)
					Realms.push({
						elements: [],
						coords: {},
						offsets: [],
						type: null,
					});
				Realms[e.REALM].elements.push(e);
				const el = props?.import?.find((el) => el.REF === e.REF);
				e.rank = el?.rank ?? 0;
				e.selected = !!el;
				e.image = require(`../assets/extracted/sprites/spr_elements/spr_elements_${e.REF}.png`);
			}

			const radialCoords = (i, d, r, p = 0) => [
				1500 + r * Math.cos(p + ((2 * Math.PI * 1) / d) * (i % d)),
				1500 + r * Math.sin(p + ((2 * Math.PI * 1) / d) * (i % d)),
			];

			for (let i = 0; i < 10; i++) {
				Realms[i].coords = radialCoords(i, 10, 237, (-2 * Math.PI) / 5);
				Realms[i].offsets.push([0, 0]);
				Realms[i].type = "small";
			}
			for (let i = 0; i < 10; i++) {
				Realms[10 + i].coords = radialCoords(
					i,
					10,
					368,
					(-1.5 * Math.PI) / 5
				);
				Realms[10 + i].offsets.push([0, 0]);
				Realms[10 + i].type = "small";
			}
			for (let i = 0; i < 10; i++) {
				let center = radialCoords(i, 10, 508, (-2 * Math.PI) / 5);
				Realms[20 + i].coords = center;
				Realms[20 + i].type = "mid";
				if (center[0] > 1500) {
					Realms[20 + i].offsets.push([-36, +24]);
					Realms[20 + i].offsets.push([+36, -24]);
				} else {
					Realms[20 + i].offsets.push([+36, +24]);
					Realms[20 + i].offsets.push([-36, -24]);
				}
			}

			for (let i = 0; i < 10; i++) {
				Realms[30 + i].coords = radialCoords(
					i,
					10,
					596,
					(-2.5 * Math.PI) / 5
				);
				Realms[30 + i].offsets.push([0, 0]);
				Realms[30 + i].type = "small";
			}

			//const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
			const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
			const normalize = (a) => {
				const mag = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
				return [a[0] / mag, a[1] / mag];
			};
			const gemPos = (a, b) => {
				const r = { small: 80, mid: 116, large: 180 }[b.type];
				const dir = normalize(sub(a.coords, b.coords));
				return [b.coords[0] + r * dir[0], b.coords[1] + r * dir[1]];
			};

			// Bridges between realms
			const Bridges = [];
			for (let i = 0; i < 10; i++)
				Bridges.push({
					coords: radialCoords(i, 10, 160, (-2 * Math.PI) / 5),
					prev: null,
					next: i,
				});
			for (let i = 0; i < 10; i++) {
				Bridges.push({
					coords: gemPos(Realms[i], Realms[10 + ((i + 9) % 10)]),
					prev: i,
					next: 10 + ((i + 9) % 10),
				});
				Bridges.push({
					coords: gemPos(Realms[i], Realms[10 + (i % 10)]),
					prev: i,
					next: 10 + (i % 10),
				});
			}
			for (let i = 0; i < 10; i++) {
				Bridges.push({
					coords: gemPos(Realms[i], Realms[20 + i]),
					prev: i,
					next: 20 + i,
				});
			}

			return {
				el: ref(null),
				tree: ref(null),
				tooltip: ref(null),
				Elements,
				Realms,
				Bridges,
				pan: ref({ panning: false, start: { x: 0, y: 0 } }),
				hoveredSkill: ref(null),
				scale: ref(1),
			};
		},
		mounted() {
			this.$refs.el.addEventListener("wheel", this.zoom);
		},
		methods: {
			recenter() {
				this.$nextTick(() => {
					this.$refs.el.scrollLeft =
						1500 - this.$refs.el.clientWidth / 2;
					this.$refs.el.scrollTop =
						1500 - this.$refs.el.clientHeight / 2;
				});
			},
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
				let alt =
					e.getModifierState("Shift") || e.getModifierState("Alt");
				if (skill.selected) {
					skill.rank = alt
						? skill.UPGRADE_NUMBER
						: Math.min(skill.rank + 1, skill.UPGRADE_NUMBER);
				} else {
					skill.rank = alt
						? skill.UPGRADE_NUMBER
						: Math.max(skill.rank, 1);
					skill.selected = true;
				}
			},
			deselectSkill(e, skill) {
				e.preventDefault();
				if (!this.editable) return;
				let alt =
					e.getModifierState("Shift") || e.getModifierState("Alt");
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
			importSave(equipped, ranks) {
				for (let e of this.Elements) e.selected = false;
				for (let idx = 0; idx < equipped.length; ++idx) {
					if (equipped[idx]) {
						this.Bridges[idx].selected = true;
						for (let e of this.Realms[this.Bridges[idx].next]
							.elements)
							e.selected = true;
					}
				}
				for (let e of this.Elements) {
					e.rank = ranks[e.REF] ?? 0;
				}
			},
			serialize() {
				let elements = Elements.filter((e) => e.selected);
				return elements.length > 0
					? `${elements.length},${elements
							.map((e) => `${e.REF},${e.rank}`)
							.join(",")}`
					: "0";
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
		background-image: url("../assets/extracted/sprites/spr_menu_element_tree/spr_menu_element_tree_0.png"),
			url("../assets/extracted/sprites/spr_menu_element_tree_back/spr_menu_element_tree_back_0.png");
		background-position: 50%;
		transform-origin: 50% 50%;
		cursor: grab;

		transform: scale(1);
		transition: transform 0.2s ease;
		background-size: 138%;
		image-rendering: crisp-edges;
	}

	.tree.panning {
		cursor: grabbing;
	}

	/*
.realm {
	position: absolute;
	transform: translate(-50%, -50%);
	width: 184px;
	height: 184px;
	background-image: url("../assets/extracted/sprites/spr_element_circle_small/spr_element_circle_small_0.png");
}
*/

	.element-node {
		position: absolute;
		transform: translate(-50%, -50%);
	}

	.bridge {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 52px;
		height: 52px;
		background-image: url("../assets/extracted/sprites/spr_menu_elements_gem/spr_menu_elements_gem_0.png");
	}
</style>
