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
				v-for="(bridge, idx) in Bridges.filter((b) => true)"
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

<script setup lang="ts">
	import { nextTick, onMounted, ref, useTemplateRef } from "vue";
	import { clamp } from "../utils.js";
	import SkillIcon from "./SkillIcon.vue";
	import { Elements, type Element } from "./Elements.ts";
	import ElementComponent from "./Element.vue";
	import Tooltip from "./Tooltip.vue";

	const size = 4 * 732;
	const halfSize = size / 2;

	const props = withDefaults(
		defineProps<{
			editable?: boolean;
			import?: { REF: number; rank: number }[];
		}>(),
		{ editable: true }
	);

	type Coord = [number, number];
	type Realm = {
		elements: Element[];
		coords: Coord;
		offsets: Coord[];
		type: "small" | "mid" | "large";
	};

	let Realms = ref<Realm[]>([]);

	for (let e of Elements) {
		while (Realms.value.length - 1 < e.REALM)
			Realms.value.push({
				elements: [],
				coords: [0, 0],
				offsets: [],
				type: "mid",
			});
		const el = props?.import?.find((el) => el.REF === e.REF);
		e.rank = el?.rank ?? 0;
		e.selected = !!el;
		Realms.value[e.REALM].elements.push(e);
	}

	function radialCoords(
		i: number,
		d: number,
		r: number,
		p: number = 0
	): [number, number] {
		return [
			halfSize + r * Math.cos(p + ((2 * Math.PI * 1) / d) * (i % d)),
			halfSize + r * Math.sin(p + ((2 * Math.PI * 1) / d) * (i % d)),
		];
	}

	for (let i = 0; i < 10; i++) {
		Realms.value[i].coords = radialCoords(i, 10, 234, (-2 * Math.PI) / 5);
		Realms.value[i].offsets.push([0, 0]);
		Realms.value[i].type = "small";
	}
	for (let i = 0; i < 10; i++) {
		Realms.value[10 + i].coords = radialCoords(
			i,
			10,
			372,
			(-1.5 * Math.PI) / 5
		);
		Realms.value[10 + i].offsets.push([0, 0]);
		Realms.value[10 + i].type = "small";
	}
	for (let i = 0; i < 10; i++) {
		let center = radialCoords(i, 10, 518, (-2 * Math.PI) / 5);
		Realms.value[20 + i].coords = center;
		Realms.value[20 + i].type = "mid";
		if (center[0] > halfSize) {
			Realms.value[20 + i].offsets.push([-36, +24]);
			Realms.value[20 + i].offsets.push([+36, -24]);
		} else {
			Realms.value[20 + i].offsets.push([+36, +24]);
			Realms.value[20 + i].offsets.push([-36, -24]);
		}
	}

	for (let i = 0; i < 10; i++) {
		Realms.value[30 + i].coords = radialCoords(
			i,
			10,
			596,
			(-2.5 * Math.PI) / 5
		);
		Realms.value[30 + i].offsets.push([0, 0]);
		Realms.value[30 + i].type = "small";
	}

	// TODO!
	console.warn("TODO: Place all the realms!");
	console.log(Realms.value.slice(40));

	// FIXME: Temporary fix until all realms are placed
	Realms.value = Realms.value.splice(0, 40);

	//const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
	const sub = (a: Coord, b: Coord): Coord => [a[0] - b[0], a[1] - b[1]];
	const normalize = (a: Coord): Coord => {
		const mag = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
		return [a[0] / mag, a[1] / mag];
	};
	const gemPos = (a: Realm, b: Realm): Coord => {
		const r = { small: 82, mid: 116, large: 176 }[b.type];
		const dir = normalize(sub(a.coords, b.coords));
		return [b.coords[0] + r * dir[0], b.coords[1] + r * dir[1]];
	};

	// Bridges between realms
	const Bridges = ref<
		{
			selected: boolean;
			coords: Coord;
			prev: number | null;
			next: number;
		}[]
	>([]);
	for (let i = 0; i < 10; i++)
		Bridges.value.push({
			selected: false,
			coords: radialCoords(i, 10, 162, (-2 * Math.PI) / 5),
			prev: null,
			next: i,
		});
	for (let i = 0; i < 10; i++) {
		Bridges.value.push({
			selected: false,
			coords: gemPos(Realms.value[i], Realms.value[10 + ((i + 9) % 10)]),
			prev: i,
			next: 10 + ((i + 9) % 10),
		});
		Bridges.value.push({
			selected: false,
			coords: gemPos(Realms.value[i], Realms.value[10 + (i % 10)]),
			prev: i,
			next: 10 + (i % 10),
		});
	}
	for (let i = 0; i < 10; i++) {
		Bridges.value.push({
			selected: false,
			coords: gemPos(Realms.value[i], Realms.value[20 + i]),
			prev: i,
			next: 20 + i,
		});
	}

	const el = useTemplateRef("el");
	const tree = ref(null);
	const tooltip = ref(null);
	const pan = ref({ panning: false, start: { x: 0, y: 0 } });
	const hoveredSkill = ref<Element | null>(null);
	const scale = ref(1);

	onMounted(() => {
		el.value?.addEventListener("wheel", zoom);
	});

	function recenter() {
		nextTick(() => {
			if (el.value) {
				el.value.scrollLeft = halfSize - el.value.clientWidth / 2;
				el.value.scrollTop = halfSize - el.value.clientHeight / 2;
			}
		});
	}

	function help(e: MouseEvent) {
		console.log([e.layerX, e.layerY]);
	}

	function mousedown() {
		if (el.value) {
			pan.value.panning = true;
			pan.value.start.x = el.value.scrollLeft;
			pan.value.start.y = el.value.scrollTop;
		}
	}

	function mousemove(e: MouseEvent) {
		if (el.value && pan.value.panning) {
			el.value.scrollLeft = Math.min(
				el.value.scrollWidth - el.value.clientWidth,
				Math.max(0, el.value.scrollLeft - e.movementX)
			);
			el.value.scrollTop = Math.min(
				el.value.scrollHeight - el.value.clientHeight,
				Math.max(0, el.value.scrollTop - e.movementY)
			);
		}
	}

	function mouseup() {
		pan.value.panning = false;
	}

	function mouseenter(e: MouseEvent) {
		if (!(e.buttons & 1))
			// Primary button isn't down
			pan.value.panning = false;
	}

	function displayTooltip(e: MouseEvent, s: Element) {
		hoveredSkill.value = s;
		tooltip.value?.display(e);
	}

	function selectSkill(e: MouseEvent, skill: Element) {
		if (!props.editable) return;
		let alt = e.getModifierState("Shift") || e.getModifierState("Alt");
		if (skill.selected) {
			skill.rank = alt
				? skill.UPGRADE_NUMBER
				: Math.min(skill.rank + 1, skill.UPGRADE_NUMBER);
		} else {
			skill.rank = alt ? skill.UPGRADE_NUMBER : Math.max(skill.rank, 1);
			skill.selected = true;
		}
	}

	function deselectSkill(e: MouseEvent, skill: Element) {
		e.preventDefault();
		if (!props.editable) return;
		let alt = e.getModifierState("Shift") || e.getModifierState("Alt");
		if (alt) {
			skill.rank = 0;
			skill.selected = false;
		}
		skill.rank = Math.max(0, skill.rank - 1);
		if (skill.rank === 0) skill.selected = false;
	}

	function zoom(e: WheelEvent) {
		e.preventDefault();
		if (el.value) {
			scale.value = clamp(
				scale.value + 0.1 * (e.deltaY > 0 ? -1 : 1),
				Math.max(
					el.value.clientWidth / size,
					el.value.clientHeight / size
				),
				1
			);
		}
	}

	function importSave(equipped: number[], ranks: number[]) {
		for (let e of Elements) e.selected = false;
		for (let idx = 0; idx < equipped.length; ++idx) {
			if (equipped[idx]) {
				Bridges.value[idx].selected = true;
				for (let e of Realms.value[Bridges.value[idx].next].elements)
					e.selected = true;
			}
		}
		for (let e of Elements) {
			e.rank = ranks[e.REF] ?? 0;
		}
	}

	function serialize() {
		let elements = Elements.filter((e) => e.selected);
		return elements.length > 0
			? `${elements.length},${elements
					.map((e) => `${e.REF},${e.rank}`)
					.join(",")}`
			: "0";
	}

	defineExpose({ recenter, importSave, serialize });
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
		width: calc(4 * 732px);
		height: calc(4 * 732px);
		background-color: #111;
		background-image: url("../assets/extracted/sprites/spr_menu_element_tree/spr_menu_element_tree_0.png"),
			url("../assets/extracted/sprites/spr_menu_element_tree_back/spr_menu_element_tree_back_0.png");
		background-position: calc(50% + 4px) calc(50% + 2px);
		transform-origin: 50% 50%;
		cursor: grab;

		transform: scale(1);
		transition: transform 0.2s ease;
		background-size: cover, 140%;
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
		width: 20px;
		height: 20px;
		background-image: url("../assets/extracted/sprites/spr_menu_elements_gem/spr_menu_elements_gem_0.png");
	}
</style>
