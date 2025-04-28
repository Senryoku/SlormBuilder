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
							v-if="e"
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
		<template v-if="hoveredSkill !== null">
			<ElementComponent :element="hoveredSkill" />
		</template>
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

	const add = (a: Coord, b: Coord): Coord => [a[0] + b[0], a[1] + b[1]];
	const sub = (a: Coord, b: Coord): Coord => [a[0] - b[0], a[1] - b[1]];
	const normalize = (a: Coord): Coord => {
		const mag = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
		return [a[0] / mag, a[1] / mag];
	};
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

	const circle_5: Coord[] = [
		[1545, 721],
		[1692, 804],
		[2022, 1035],
		[2148, 1150],
		[2195, 1317],
		[2163, 1475],
		[2046, 1867],
		[1970, 2012],
		[1826, 2113],
		[1657, 2145],
		[1266, 2143],
		[1102, 2118],
		[955, 2014],
		[877, 1866],
		[758, 1470],
		[731, 1320],
		[780, 1151],
		[901, 1036],
		[1235, 800],
		[1385, 720],
	];
	let current_idx = 40;
	for (let i = 0; i < circle_5.length; i++) {
		Realms.value[current_idx + i].coords = circle_5[i];
		Realms.value[current_idx + i].type = "mid";
		Realms.value[current_idx + i].offsets.push([0, 0]);
	}
	current_idx += circle_5.length;

	const circle_6: Coord[] = [
		[1946, 801],
		[2245, 1715],
		[1464, 2287],
		[686, 1715],
		[987, 800],
	];
	for (let i = 0; i < circle_6.length; i++) {
		Realms.value[current_idx + i].coords = circle_6[i];
		Realms.value[current_idx + i].type = "large";
		Realms.value[current_idx + i].offsets.push(
			sub([1946, 734], circle_6[0])
		);
		Realms.value[current_idx + i].offsets.push(
			sub([2004, 845], circle_6[0])
		);
		Realms.value[current_idx + i].offsets.push(
			sub([1889, 843], circle_6[0])
		);
	}
	current_idx += circle_6.length;

	const circle_7: Coord[] = [
		[1466, 573],
		[1757, 611],
		[2193, 916],
		[2310, 1195],
		[2366, 1469],
		[2220, 1980],
		[1983, 2180],
		[1726, 2341],
		[1198, 2343],
		[943, 2181],
		[710, 1977],
		[558, 1470],
		[620, 1193],
		[736, 916],
		[1167, 612],
	];
	for (let i = 0; i < circle_7.length; i++) {
		Realms.value[current_idx + i].coords = circle_7[i];
		if (i % 3 === 0) {
			Realms.value[current_idx + i].type = "mid";
			Realms.value[current_idx + i].offsets.push([0, 0]);
		} else {
			Realms.value[current_idx + i].type = "large";
			if (i < circle_7.length / 2) {
				Realms.value[current_idx + i].offsets.push(
					sub([1715, 640], circle_7[1])
				);
				Realms.value[current_idx + i].offsets.push(
					sub([1800, 582], circle_7[1])
				);
			} else {
				Realms.value[current_idx + i].offsets.push(
					sub([1244, 2367], circle_7[8])
				);
				Realms.value[current_idx + i].offsets.push(
					sub([1151, 2310], circle_7[8])
				);
			}
		}
	}
	current_idx += circle_7.length;
	const circle_8: Coord[] = [
		[1290, 437],
		[1465, 407],
		[1643, 438],
		[2390, 980],
		[2468, 1136],
		[2493, 1305],
		[2210, 2195],
		[2081, 2323],
		[1922, 2406],
		[1010, 2402],
		[849, 2321],
		[720, 2192],
		[435, 1307],
		[459, 1139],
		[541, 981],
	];
	for (let i = 0; i < circle_8.length; i++) {
		Realms.value[current_idx + i].coords = circle_8[i];
		Realms.value[current_idx + i].type = "small";
		Realms.value[current_idx + i].offsets.push([0, 0]);
	}
	current_idx += circle_8.length;

	const circle_9: Coord[] = [
		[1843, 390],
		[2101, 591],
		[2383, 778],

		[2617, 1473],
		[2496, 1802],
		[2408, 2127],

		[1799, 2564],
		[1465, 2549],
		[1128, 2563],

		[522, 2128],
		[437, 1802],
		[313, 1466],

		[547, 777],
		[837, 592],
		[1086, 388],
	];
	for (let i = 0; i < circle_9.length; i++) {
		Realms.value[current_idx + i].coords = circle_9[i];
		Realms.value[current_idx + i].type = "large";
		if (i % 3 === 1) {
			Realms.value[current_idx + i].type = "mid";
			Realms.value[current_idx + i].offsets.push([0, 0]);
		} else {
			if (i < circle_9.length / 2) {
				Realms.value[current_idx + i].offsets.push(
					sub([1798, 415], circle_9[0])
				);
				Realms.value[current_idx + i].offsets.push(
					sub([1891, 353], circle_9[0])
				);
			} else {
				Realms.value[current_idx + i].offsets.push(
					sub([1176, 2592], circle_9[8])
				);
				Realms.value[current_idx + i].offsets.push(
					sub([1080, 2529], circle_9[8])
				);
			}
		}
	}
	current_idx += circle_9.length;

	for (let i = 0; i < 5; i++) {
		Realms.value[current_idx + i].coords = radialCoords(
			i,
			5,
			1262,
			(-2 * Math.PI) / 4 + 0.002
		);
		Realms.value[current_idx + i].offsets.push([0, 0]);
		Realms.value[current_idx + i].type = "large";
	}
	current_idx += 5;

	const circle_10: Coord[] = [
		[1774, 197],
		[2026, 286],
		[2235, 415],
		[2419, 575],
		[2586, 802],
		[2766, 1328],
		[2762, 1616],
		[2702, 1871],
		[2607, 2092],
		[2428, 2331],
		[1976, 2659],
		[1709, 2743],
		[1465, 2761],
		[1218, 2741],
		[958, 2654],
		[499, 2330],
		[326, 2091],
		[227, 1870],
		[168, 1611],
		[164, 1326],
		[344, 797],
		[515, 572],
		[696, 413],
		[905, 286],
		[1157, 192],
	];
	for (let i = 0; i < circle_10.length; i++) {
		Realms.value[current_idx + i].coords = circle_10[i];
		Realms.value[current_idx + i].offsets.push([0, 0]);
		Realms.value[current_idx + i].type = "small";
	}
	current_idx += circle_10.length;

	if (current_idx !== Realms.value.length) {
		console.warn("TODO: Place all the realms!");
		console.log(
			Realms.value
				.slice(current_idx)
				.map((e) => e.elements.map((el) => el.EN_NAME))
		);

		Realms.value = Realms.value.splice(0, current_idx);
	}

	// Bridges between realms
	const Bridges = ref<
		{
			selected: boolean;
			coords: Coord;
			prev: number | null;
			next: number;
		}[]
	>([]);
	for (let i = 0; i < 10; i++) {
		Bridges.value.push({
			selected: false,
			coords: (
				[
					[1514, 1316],
					[1594, 1376],
					[1626, 1464],
					[1594, 1564],
					[1514, 1620],
					[1418, 1620],
					[1338, 1564],
					[1302, 1464],
					[1338, 1376],
					[1418, 1316],
				] as Coord[]
			)[i],
			prev: null,
			next: i,
		});
	}

	const el = useTemplateRef("el");
	const tree = ref(null);
	const tooltip = useTemplateRef<typeof Tooltip>("tooltip");
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
