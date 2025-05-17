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
			:style="`transform: scale(${scale}); `"
			ref="tree"
		>
			<template
				v-for="(realm, _rIdx) in Realms.filter(
					(r) => r.coords.length > 0
				)"
				:key="_rIdx"
			>
				<div
					class="realm"
					:class="[
						realm.type,
						`realm-color-${realm.elements[0].REALM_COLOR}`,
						{
							active: realm.active,
						},
					]"
					:style="`left: ${realm.coords[0]}px; top: ${realm.coords[1]}px`"
				>
					<div
						v-if="Debug"
						style="
							pointer-events: none;
							position: absolute;
							bottom: 2em;
							left: 50%;
							transform: translate(-50%, 0);
						"
					>
						Realm {{ _rIdx }}
					</div>
					<div
						v-for="(e, idx) in realm.elements"
						:key="e.REF"
						class="element-node clickable"
						:style="`left: calc( ${realm.offsets[idx][0]}px + var(--x-center)); top: calc(${realm.offsets[idx][1]}px + var(--y-center))`"
					>
						<SkillIcon
							v-if="e"
							:skill="e"
							:round="true"
							:selected="realm.active && e.rank > 0"
							@mouseenter="displayTooltip($event, e)"
							@click="selectSkill($event, e)"
							@contextmenu="deselectSkill($event, e)"
						/>
					</div>
				</div>
			</template>
			<div
				v-for="(bridge, idx) in Bridges"
				:key="idx"
				class="bridge"
				:class="{ active: bridge.selected }"
				:style="`left: ${bridge.coords[0]}px; top: ${bridge.coords[1]}px`"
				@click="toggleGem(bridge)"
			>
				<template v-if="Debug">
					<div
						style="
							pointer-events: none;
							position: absolute;
							bottom: 0;
							left: 50%;
							white-space: nowrap;
							transform: translate(-50%, 0);
						"
					>
						{{ idx }}
					</div>
					<div
						v-for="r in bridge.realms"
						:key="`${idx}_${r}`"
						:style="`
							pointer-events: none;
							position: absolute; top: 50%; left: 50%; 
							height: 3px;
							width: ${
								0.9 *
								Math.sqrt(
									(bridge.coords[0] - Realms[r].coords[0]) *
										(bridge.coords[0] -
											Realms[r].coords[0]) +
										(bridge.coords[1] -
											Realms[r].coords[1]) *
											(bridge.coords[1] -
												Realms[r].coords[1])
								)
							}px;
							--rotation: ${Math.atan2(
								Realms[r].coords[1] - bridge.coords[1],
								Realms[r].coords[0] - bridge.coords[0]
							)}rad;
							transform-origin: 0 0;
							transform:  rotate(var(--rotation));
							background-color: #FFF8 `"
					></div>
				</template>
			</div>
		</div>
	</div>
	<div class="stock">
		<div
			v-for="idx in MaxActiveBridges"
			:key="idx"
			style="width: 20px; height: 20px"
			:class="{ gem: idx <= MaxActiveBridges - activeBridges.length }"
		/>
	</div>
	<Tooltip ref="tooltip">
		<template v-if="hoveredSkill !== null">
			<ElementComponent :element="hoveredSkill" />
		</template>
	</Tooltip>
</template>

<script setup lang="ts">
	import {
		watch,
		computed,
		nextTick,
		onMounted,
		ref,
		useTemplateRef,
	} from "vue";
	import { clamp, copyToClipboard } from "@/utils";
	import SkillIcon from "./SkillIcon.vue";
	import { Elements, type Element } from "@/data/Elements.ts";
	import ElementComponent from "./Element.vue";
	import Tooltip from "./Tooltip.vue";

	const Debug = false && import.meta.env.DEV;

	const size = 4 * 732;
	const halfSize = size / 2;

	const MaxActiveBridges = 7;

	const props = withDefaults(
		defineProps<{
			editable?: boolean;
		}>(),
		{ editable: true }
	);

	type Coord = [number, number];

	const sub = (a: Coord, b: Coord): Coord => [a[0] - b[0], a[1] - b[1]];
	type Realm = {
		elements: (Element & { selected: boolean; rank: number })[];
		coords: Coord;
		offsets: Coord[];
		type: "small" | "mid" | "large";
		active: boolean;
		connectedRealms: number[];
	};
	type Bridge = {
		selected: boolean;
		coords: Coord;
		realms: number[];
	};

	const Realms = ref<Realm[]>([]);
	const Bridges = ref<Bridge[]>([]);

	for (let e of Elements) {
		while (Realms.value.length - 1 < e.REALM)
			Realms.value.push({
				elements: [],
				coords: [0, 0],
				offsets: [],
				type: "mid",
				active: false,
				connectedRealms: [],
			});
		Realms.value[e.REALM].elements.push({
			...e,
			selected: false,
			rank: 0,
		});
	}
	// Realms placement (could be constant...)
	{
		let current_idx = 0;
		function addRealm(coords: Coord, type: "small" | "mid" | "large") {
			const r = Realms.value[current_idx];
			r.coords = coords;
			r.type = type;
			switch (type) {
				case "small":
					r.offsets = [[0, 0]];
					break;
				case "mid": {
					if (r.coords[0] > halfSize) {
						r.offsets = [
							[-36, +24],
							[+36, -24],
						];
					} else {
						r.offsets = [
							[+36, +24],
							[-36, -24],
						];
					}
					break;
				}
				case "large": {
					r.offsets = [
						sub([1946, 734], [1946, 801]),
						sub([2004, 845], [1946, 801]),
						sub([1889, 843], [1946, 801]),
					];
					break;
				}
			}
			current_idx++;
		}

		const FirstCicle = [
			[1538, 1244],
			[1658, 1328],
			[1702, 1464],
			[1654, 1600],
			[1538, 1692],
			[1394, 1692],
			[1278, 1604],
			[1226, 1464],
			[1274, 1328],
			[1394, 1244],
		] as Coord[];
		for (let c of FirstCicle) addRealm(c, "small");

		const SecondCircle = [
			[1682, 1168],
			[1818, 1352],
			[1818, 1580],
			[1682, 1764],
			[1466, 1828],
			[1250, 1764],
			[1114, 1580],
			[1114, 1352],
			[1250, 1168],
			[1466, 1100],
		] as Coord[];
		for (let c of SecondCircle) addRealm(c, "small");

		const ThirdCircle = [
			[1622, 982],
			[1878, 1166],
			[1974, 1466],
			[1878, 1766],
			[1626, 1950],
			[1306, 1950],
			[1054, 1766],
			[958, 1466],
			[1054, 1166],
			[1310, 982],
		] as Coord[];
		for (let c of ThirdCircle) addRealm(c, "mid");

		const FourthCircle = [
			[1466, 872],
			[1814, 984],
			[2034, 1280],
			[2034, 1648],
			[1818, 1952],
			[1466, 2056],
			[1114, 1952],
			[898, 1648],
			[898, 1280],
			[1118, 984],
		] as Coord[];
		for (let c of FourthCircle) addRealm(c, "small");

		const circle_5: Coord[] = [
			[1546, 720],
			[1694, 800],

			[2026, 1032],
			[2150, 1148],
			[2198, 1316],
			[2170, 1472],

			[2050, 1868],
			[1974, 2012],
			[1830, 2116],
			[1662, 2144],

			[1270, 2144],
			[1102, 2116],
			[958, 2012],
			[882, 1868],

			[762, 1472],
			[734, 1316],
			[782, 1148],
			[906, 1032],

			[1238, 800],
			[1386, 720],
		];
		for (let c of circle_5) addRealm(c, "small");

		const circle_6: Coord[] = [
			[1946, 800],
			[2246, 1716],
			[1466, 2288],
			[686, 1716],
			[986, 800],
		];
		for (let c of circle_6) addRealm(c, "large");

		const circle_7: Coord[] = [
			[1466, 572],
			[1762, 606],

			[2194, 914],
			[2310, 1192],
			[2370, 1466],

			[2222, 1978],
			[1986, 2180],
			[1726, 2338],

			[1206, 2338],
			[946, 2180],
			[710, 1978],

			[562, 1466],
			[622, 1192],
			[738, 914],

			[1170, 606],
		];
		for (let i = 0; i < circle_7.length; i++) {
			Realms.value[current_idx + i].coords = circle_7[i];
			if (i % 3 === 0) {
				Realms.value[current_idx + i].type = "small";
				Realms.value[current_idx + i].offsets.push([0, 0]);
			} else {
				Realms.value[current_idx + i].type = "mid";
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
			[1290, 436],
			[1466, 408],
			[1642, 436],
			[2390, 980],
			[2470, 1136],
			[2494, 1305],
			[2210, 2192],
			[2082, 2320],
			[1922, 2400],
			[1010, 2400],
			[850, 2320],
			[722, 2192],
			[438, 1304],
			[462, 1136],
			[542, 980],
		];
		for (let c of circle_8) addRealm(c, "small");

		const circle_9: Coord[] = [
			[1846, 386],
			[2098, 590],
			[2386, 774],

			[2618, 1466],
			[2494, 1802],
			[2410, 2126],

			[1802, 2562],
			[1466, 2550],
			[1130, 2562],

			[522, 2126],
			[438, 1802],
			[314, 1466],

			[546, 774],
			[834, 590],
			[1086, 386],
		];
		for (let i = 0; i < circle_9.length; i++) {
			Realms.value[current_idx + i].coords = circle_9[i];
			Realms.value[current_idx + i].type = "mid";
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

		const circle_10: Coord[] = [
			[1466, 202],
			[2670, 1074],
			[2210, 2486],
			[722, 2486],
			[262, 1074],
		];
		for (let i = 0; i < circle_10.length; i++) {
			Realms.value[current_idx + i].coords = circle_10[i];
			Realms.value[current_idx + i].offsets.push([0, 0]);
			Realms.value[current_idx + i].type = "mid";
		}
		current_idx += circle_10.length;

		const circle_11: Coord[] = [
			[1774, 196],
			[2026, 288],
			[2234, 416],
			[2418, 576],
			[2586, 800],
			[2766, 1328],
			[2762, 1616],
			[2702, 1872],
			[2607, 2092],
			[2430, 2332],
			[1978, 2660],
			[1710, 2744],
			[1466, 2764],

			[1222, 2744],
			[958, 2660],
			[502, 2332],
			[326, 2092],
			[230, 1872],
			[170, 1616],
			[166, 1328],
			[346, 800],
			[514, 576],
			[698, 416],
			[906, 288],
			[1158, 196],
		];
		for (let i = 0; i < circle_11.length; i++) {
			Realms.value[current_idx + i].coords = circle_11[i];
			Realms.value[current_idx + i].offsets.push([0, 0]);
			Realms.value[current_idx + i].type = "small";
		}
		current_idx += circle_11.length;

		if (current_idx !== Realms.value.length) {
			console.warn("TODO: Place all the realms!");
			console.log(
				Realms.value
					.slice(current_idx)
					.map((e) => e.elements.map((el) => el.EN_NAME))
			);

			Realms.value = Realms.value.splice(0, current_idx);
		}
	}

	const BridgeData = [
		{ coords: [1514, 1316], realms: [0] },
		{ coords: [1594, 1376], realms: [1] },
		{ coords: [1626, 1464], realms: [2] },
		{ coords: [1594, 1564], realms: [3] },
		{ coords: [1514, 1620], realms: [4] },
		{ coords: [1418, 1620], realms: [5] },
		{ coords: [1338, 1564], realms: [6] },
		{ coords: [1302, 1464], realms: [7] },
		{ coords: [1338, 1376], realms: [8] },
		{ coords: [1418, 1316], realms: [9] },
		{ coords: [1502, 1172], realms: [0, 19] },
		{ coords: [1610, 1208], realms: [0, 10] },
		{ coords: [1670, 1248], realms: [1, 10] },
		{ coords: [1738, 1340], realms: [1, 11] },
		{ coords: [1758, 1408], realms: [2, 11] },
		{ coords: [1758, 1520], realms: [2, 12] },
		{ coords: [1738, 1596], realms: [3, 12] },
		{ coords: [1670, 1684], realms: [3, 13] },
		{ coords: [1610, 1728], realms: [4, 13] },
		{ coords: [1498, 1760], realms: [4, 14] },
		{ coords: [1434, 1761], realms: [5, 14] },
		{ coords: [1322, 1728], realms: [5, 15] },
		{ coords: [1262, 1684], realms: [6, 15] },
		{ coords: [1194, 1596], realms: [6, 16] },
		{ coords: [1174, 1520], realms: [7, 16] },
		{ coords: [1170, 1408], realms: [7, 17] },
		{ coords: [1194, 1340], realms: [8, 17] },
		{ coords: [1262, 1248], realms: [8, 18] },
		{ coords: [1322, 1208], realms: [9, 18] },
		{ coords: [1430, 1172], realms: [9, 19] },
		{ coords: [1534, 1056], realms: [19, 20] },
		{ coords: [1590, 1088], realms: [0, 20] },
		{ coords: [1654, 1092], realms: [10, 20] },
		{ coords: [1762, 1172], realms: [10, 21] },
		{ coords: [1790, 1232], realms: [1, 21] },
		{ coords: [1838, 1276], realms: [11, 21] },
		{ coords: [1878, 1400], realms: [11, 22] },
		{ coords: [1862, 1464], realms: [2, 22] },
		{ coords: [1878, 1528], realms: [12, 22] },
		{ coords: [1838, 1656], realms: [12, 23] },
		{ coords: [1790, 1700], realms: [3, 23] },
		{ coords: [1762, 1760], realms: [13, 23] },
		{ coords: [1658, 1836], realms: [13, 24] },
		{ coords: [1586, 1840], realms: [4, 24] },
		{ coords: [1534, 1876], realms: [14, 24] },
		{ coords: [1398, 1876], realms: [14, 25] },
		{ coords: [1346, 1840], realms: [5, 25] },
		{ coords: [1278, 1836], realms: [15, 25] },
		{ coords: [1170, 1760], realms: [15, 26] },
		{ coords: [1142, 1700], realms: [6, 26] },
		{ coords: [1094, 1656], realms: [16, 26] },
		{ coords: [1054, 1528], realms: [16, 27] },
		{ coords: [1070, 1464], realms: [7, 27] },
		{ coords: [1054, 1400], realms: [17, 27] },
		{ coords: [1094, 1276], realms: [17, 28] },
		{ coords: [1142, 1232], realms: [8, 28] },
		{ coords: [1170, 1172], realms: [18, 28] },
		{ coords: [1278, 1092], realms: [18, 29] },
		{ coords: [1342, 1088], realms: [9, 29] },
		{ coords: [1398, 1056], realms: [19, 29] },
		{ coords: [1402, 916], realms: [29, 30] },
		{ coords: [1466, 956], realms: [19, 30] },
		{ coords: [1530, 916], realms: [20, 30] },
		{ coords: [1734, 988], realms: [20, 31] },
		{ coords: [1830, 1060], realms: [21, 31] },
		{ coords: [1974, 1228], realms: [21, 32] },
		{ coords: [1962, 1300], realms: [11, 32] },
		{ coords: [2006, 1356], realms: [22, 32] },
		{ coords: [2006, 1572], realms: [22, 33] },
		{ coords: [1962, 1688], realms: [23, 33] },
		{ coords: [1842, 1872], realms: [23, 34] },
		{ coords: [1774, 1888], realms: [13, 34] },
		{ coords: [1738, 1948], realms: [24, 34] },
		{ coords: [1526, 2008], realms: [24, 35] },
		{ coords: [1406, 2008], realms: [25, 35] },
		{ coords: [1194, 1948], realms: [25, 36] },
		{ coords: [1158, 1888], realms: [15, 36] },
		{ coords: [1090, 1872], realms: [26, 36] },
		{ coords: [970, 1688], realms: [26, 37] },
		{ coords: [926, 1572], realms: [27, 37] },
		{ coords: [926, 1356], realms: [27, 38] },
		{ coords: [970, 1300], realms: [17, 38] },
		{ coords: [962, 1228], realms: [28, 38] },
		{ coords: [1102, 1060], realms: [28, 39] },
		{ coords: [1198, 988], realms: [29, 39] },
		{ coords: [1418, 800], realms: [30, 59] },
		{ coords: [1514, 800], realms: [30, 40] },
		{ coords: [1662, 876], realms: [20, 41] },
		{ coords: [1862, 920], realms: [31, 60] },
		{ coords: [1966, 1092], realms: [21, 42] },
		{ coords: [2094, 1212], realms: [32, 43] },
		{ coords: [2114, 1300], realms: [32, 44] },
		{ coords: [2090, 1464], realms: [22, 45] },
		{ coords: [2106, 1672], realms: [33, 61] },
		{ coords: [1974, 1828], realms: [23, 46] },
		{ coords: [1898, 1980], realms: [34, 47] },
		{ coords: [1822, 2032], realms: [34, 48] },
		{ coords: [1650, 2060], realms: [24, 49] },
		{ coords: [1466, 2136], realms: [35, 62] },
		{ coords: [1282, 2060], realms: [25, 50] },
		{ coords: [1110, 2032], realms: [36, 51] },
		{ coords: [1034, 1980], realms: [36, 52] },
		{ coords: [958, 1828], realms: [26, 53] },
		{ coords: [826, 1672], realms: [37, 63] },
		{ coords: [842, 1464], realms: [27, 54] },
		{ coords: [818, 1300], realms: [38, 55] },
		{ coords: [838, 1212], realms: [38, 56] },
		{ coords: [966, 1092], realms: [28, 57] },
		{ coords: [1070, 920], realms: [39, 64] },
		{ coords: [1270, 876], realms: [29, 58] },
		{ coords: [1426, 648], realms: [59, 65] },
		{ coords: [1506, 648], realms: [40, 65] },
		{ coords: [1618, 760], realms: [40, 41] },
		{ coords: [1722, 720], realms: [41, 66] },
		{ coords: [2098, 984], realms: [42, 67] },
		{ coords: [2090, 1084], realms: [42, 43] },
		{ coords: [2230, 1168], realms: [43, 68] },
		{ coords: [2258, 1260], realms: [44, 68] },
		{ coords: [2182, 1392], realms: [44, 45] },
		{ coords: [2254, 1464], realms: [45, 69] },
		{ coords: [2114, 1920], realms: [46, 70] },
		{ coords: [2018, 1944], realms: [46, 47] },
		{ coords: [1982, 2092], realms: [47, 71] },
		{ coords: [1906, 2152], realms: [48, 71] },
		{ coords: [1746, 2140], realms: [48, 49] },
		{ coords: [1690, 2224], realms: [49, 72] },
		{ coords: [1242, 2224], realms: [50, 73] },
		{ coords: [1186, 2140], realms: [50, 51] },
		{ coords: [1026, 2152], realms: [51, 74] },
		{ coords: [950, 2092], realms: [52, 74] },
		{ coords: [914, 1944], realms: [52, 53] },
		{ coords: [818, 1920], realms: [53, 75] },
		{ coords: [678, 1464], realms: [54, 76] },
		{ coords: [750, 1392], realms: [54, 55] },
		{ coords: [674, 1260], realms: [55, 77] },
		{ coords: [702, 1168], realms: [56, 77] },
		{ coords: [842, 1084], realms: [56, 57] },
		{ coords: [834, 984], realms: [57, 78] },
		{ coords: [1210, 720], realms: [58, 79] },
		{ coords: [1314, 760], realms: [58, 59] },
		{ coords: [1842, 692], realms: [60, 66] },
		{ coords: [2034, 684], realms: [60, 96] },
		{ coords: [2082, 868], realms: [60, 67] },
		{ coords: [2318, 1580], realms: [61, 69] },
		{ coords: [2382, 1764], realms: [61, 99] },
		{ coords: [2230, 1864], realms: [61, 70] },
		{ coords: [1610, 2304], realms: [62, 72] },
		{ coords: [1466, 2432], realms: [62, 102] },
		{ coords: [1322, 2308], realms: [62, 73] },
		{ coords: [706, 1864], realms: [63, 75] },
		{ coords: [550, 1764], realms: [63, 105] },
		{ coords: [614, 1580], realms: [63, 76] },
		{ coords: [850, 868], realms: [64, 78] },
		{ coords: [898, 684], realms: [64, 108] },
		{ coords: [1090, 692], realms: [64, 79] },
		{ coords: [1126, 496], realms: [79, 109] },
		{ coords: [1202, 420], realms: [80, 109] },
		{ coords: [1242, 508], realms: [79, 80] },
		{ coords: [1326, 508], realms: [59, 80] },
		{ coords: [1378, 428], realms: [80, 81] },
		{ coords: [1466, 488], realms: [65, 81] },
		{ coords: [1554, 428], realms: [81, 82] },
		{ coords: [1606, 508], realms: [40, 82] },
		{ coords: [1690, 508], realms: [66, 82] },
		{ coords: [1730, 420], realms: [82, 95] },
		{ coords: [1806, 496], realms: [66, 95] },
		{ coords: [2290, 844], realms: [67, 97] },
		{ coords: [2394, 892], realms: [83, 97] },
		{ coords: [2310, 952], realms: [67, 83] },
		{ coords: [2350, 1048], realms: [43, 83] },
		{ coords: [2434, 1056], realms: [83, 84] },
		{ coords: [2390, 1164], realms: [68, 84] },
		{ coords: [2490, 1220], realms: [84, 85] },
		{ coords: [2418, 1304], realms: [44, 85] },
		{ coords: [2442, 1372], realms: [69, 85] },
		{ coords: [2554, 1368], realms: [85, 98] },
		{ coords: [2494, 1464], realms: [69, 98] },
		{ coords: [2314, 2056], realms: [70, 100] },
		{ coords: [2218, 2104], realms: [70, 86] },
		{ coords: [2294, 2172], realms: [86, 100] },
		{ coords: [2138, 2172], realms: [47, 86] },
		{ coords: [2150, 2264], realms: [86, 87] },
		{ coords: [2038, 2252], realms: [71, 87] },
		{ coords: [1926, 2320], realms: [48, 88] },
		{ coords: [2006, 2368], realms: [87, 88] },
		{ coords: [1842, 2376], realms: [72, 88] },
		{ coords: [1874, 2472], realms: [88, 101] },
		{ coords: [1766, 2452], realms: [72, 101] },
		{ coords: [1166, 2452], realms: [73, 103] },
		{ coords: [1058, 2472], realms: [89, 103] },
		{ coords: [1090, 2376], realms: [73, 89] },
		{ coords: [1006, 2320], realms: [51, 89] },
		{ coords: [926, 2364], realms: [89, 90] },
		{ coords: [894, 2252], realms: [74, 90] },
		{ coords: [782, 2264], realms: [90, 91] },
		{ coords: [794, 2172], realms: [52, 91] },
		{ coords: [714, 2104], realms: [75, 91] },
		{ coords: [638, 2172], realms: [91, 104] },
		{ coords: [618, 2056], realms: [75, 104] },
		{ coords: [438, 1464], realms: [76, 106] },
		{ coords: [378, 1368], realms: [92, 106] },
		{ coords: [490, 1372], realms: [76, 92] },
		{ coords: [514, 1304], realms: [55, 92] },
		{ coords: [442, 1220], realms: [92, 93] },
		{ coords: [542, 1164], realms: [77, 93] },
		{ coords: [498, 1056], realms: [93, 94] },
		{ coords: [582, 1048], realms: [56, 94] },
		{ coords: [622, 952], realms: [78, 94] },
		{ coords: [538, 892], realms: [94, 107] },
		{ coords: [642, 844], realms: [78, 107] },
		{ coords: [1466, 320], realms: [81, 110] },
		{ coords: [1698, 184], realms: [81, 115] },
		{ coords: [1802, 276], realms: [95, 115] },
		{ coords: [1954, 332], realms: [95, 116] },
		{ coords: [2094, 328], realms: [96, 116] },
		{ coords: [2178, 492], realms: [96, 117] },
		{ coords: [2358, 520], realms: [96, 118] },
		{ coords: [2406, 656], realms: [97, 118] },
		{ coords: [2502, 792], realms: [97, 119] },
		{ coords: [2622, 876], realms: [84, 119] },
		{ coords: [2554, 1112], realms: [84, 111] },
		{ coords: [2746, 1252], realms: [84, 120] },
		{ coords: [2702, 1380], realms: [98, 120] },
		{ coords: [2702, 1552], realms: [98, 121] },
		{ coords: [2746, 1692], realms: [99, 121] },
		{ coords: [2614, 1840], realms: [99, 122] },
		{ coords: [2642, 2024], realms: [99, 123] },
		{ coords: [2526, 2108], realms: [100, 123] },
		{ coords: [2418, 2248], realms: [100, 124] },
		{ coords: [2382, 2388], realms: [87, 124] },
		{ coords: [2138, 2388], realms: [87, 112] },
		{ coords: [2050, 2620], realms: [87, 125] },
		{ coords: [1906, 2616], realms: [101, 125] },
		{ coords: [1750, 2664], realms: [101, 126] },
		{ coords: [1630, 2752], realms: [102, 126] },
		{ coords: [1466, 2672], realms: [102, 127] },
		{ coords: [1302, 2756], realms: [102, 128] },
		{ coords: [1182, 2664], realms: [103, 128] },
		{ coords: [1030, 2616], realms: [103, 129] },
		{ coords: [882, 2620], realms: [90, 129] },
		{ coords: [794, 2388], realms: [90, 113] },
		{ coords: [550, 2388], realms: [90, 130] },
		{ coords: [514, 2248], realms: [104, 130] },
		{ coords: [406, 2108], realms: [104, 131] },
		{ coords: [290, 2024], realms: [105, 131] },
		{ coords: [318, 1840], realms: [105, 132] },
		{ coords: [190, 1692], realms: [105, 133] },
		{ coords: [230, 1552], realms: [106, 133] },
		{ coords: [230, 1380], realms: [106, 134] },
		{ coords: [190, 1252], realms: [93, 134] },
		{ coords: [378, 1112], realms: [93, 114] },
		{ coords: [310, 876], realms: [93, 135] },
		{ coords: [430, 792], realms: [107, 135] },
		{ coords: [526, 656], realms: [107, 136] },
		{ coords: [574, 520], realms: [108, 136] },
		{ coords: [754, 492], realms: [108, 137] },
		{ coords: [838, 328], realms: [108, 138] },
		{ coords: [978, 332], realms: [109, 138] },
		{ coords: [1130, 276], realms: [109, 139] },
		{ coords: [1234, 184], realms: [81, 139] },
	];

	for (let d of BridgeData) {
		Bridges.value.push({
			selected: false,
			coords: d.coords as Coord,
			realms: d.realms,
		});
		if (d.realms.length > 1) {
			for (let r of d.realms) {
				Realms.value[r].connectedRealms.push(
					...d.realms.filter((rr) => rr !== r)
				);
			}
		}
	}

	const el = useTemplateRef("el");
	const pan = ref({ panning: false, start: { x: 0, y: 0 } });
	const scale = ref(1);
	const tooltip = useTemplateRef<typeof Tooltip>("tooltip");
	const hoveredSkill = ref<Element | null>(null);

	onMounted(() => {
		el.value?.addEventListener("wheel", zoom);
		recenter();
	});

	const activeBridges = computed(() => {
		return Bridges.value.filter((b) => b.selected);
	});

	function activateRealm(realm: number) {
		if (Realms.value[realm].active) return;
		Realms.value[realm].active = true;
		for (let r of Realms.value[realm].connectedRealms) {
			if (
				activeBridges.value.find(
					(b) => b.realms.includes(r) && b.realms.includes(realm)
				)
			)
				activateRealm(r);
		}
	}

	watch(Bridges.value, () => {
		for (let r of Realms.value) r.active = false;

		const startingPoints = Bridges.value.filter(
			(b) => b.realms.length === 1
		)!;
		for (let b of startingPoints) {
			if (b.selected) {
				for (let r of b.realms) {
					activateRealm(r);
				}
			}
		}
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
		if (Debug) {
			const coords = [e.layerX & ~1, e.layerY & ~1] as Coord;
			const msg = `[${coords[0]}, ${coords[1]}],`;
			console.log(msg);
			copyToClipboard(msg);
			// Bridges.value[0].coords = coords;
		}
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

	function toggleGem(bridge: Bridge) {
		if (!props.editable) return;
		if (bridge.selected) {
			bridge.selected = false;
			// Deselect now unconnnected bridges
			nextTick(() => {
				for (let b of activeBridges.value) {
					// If all realms are inactive, deselected the bridge.
					if (
						b.realms.reduce(
							(p, c) => p && !Realms.value[c].active,
							true
						)
					)
						b.selected = false;
				}
			});
		} else {
			if (activeBridges.value.length >= MaxActiveBridges) return;
			const allowed =
				bridge.realms.length === 1 || // Starting Point
				bridge.realms.filter((r) => Realms.value[r].active).length > 0; // At least one adjacent realm is active
			if (allowed) bridge.selected = true;
		}
	}

	function selectSkill(e: MouseEvent, skill: Element) {
		if (!props.editable) return;
		let alt = e.getModifierState("Shift") || e.getModifierState("Alt");
		skill.rank = alt
			? skill.UPGRADE_NUMBER
			: Math.min(skill.rank + 1, skill.UPGRADE_NUMBER);
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
		for (let r of Realms.value) {
			r.active = false;
			for (let e of r.elements) e.rank = ranks[e.REF] ?? 0;
		}
		for (let b of Bridges.value) b.selected = false;
		for (let idx = 0; idx < equipped.length; ++idx) {
			if (equipped[idx]) {
				if (Bridges.value[idx]) Bridges.value[idx].selected = true;
				else console.warn("Could not find bridge for ", idx);
			}
		}
	}

	function serialize() {
		let elements = Realms.value
			.map((r) => r.elements)
			.flat()
			.filter((e) => e.rank > 0);

		const elementStr =
			elements.length > 0
				? `${elements.length},${elements
						.map((e) => `${e.REF},${e.rank}`)
						.join(",")}`
				: "0";
		const activeBridgesIndices = activeBridges.value.map((b) =>
			Bridges.value.indexOf(b)
		);
		const bridgeStr = `${
			activeBridgesIndices.length
		},${activeBridgesIndices.join(",")}`;
		return `${elementStr},${bridgeStr}`;
	}

	function deserialize(
		skills: {
			REF: number;
			rank: number;
		}[],
		bridges: number[]
	) {
		for (let r of Realms.value) {
			for (let e of r.elements) {
				e.rank = skills.find((s) => s.REF === e.REF)?.rank ?? 0;
			}
		}
		for (let b of Bridges.value) b.selected = false;
		for (let b of bridges) Bridges.value[b].selected = true;
	}

	defineExpose({ recenter, importSave, serialize, deserialize });
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
		border-image-source: url("@/assets/img/skill-tree-border.png");
		border-image-slice: 16 16 16 16;
		border-image-width: 12px;
		border-image-outset: 0px 0px 0px 0px;
		border-image-repeat: stretch stretch;
		border-image-outset: 12px;

		background-color: #0f0f0f;
	}

	.stock {
		box-sizing: border-box;
		position: absolute;
		top: -12px;
		left: 8px;
		width: 316px;
		height: 84px;
		background-image: url("@/assets/extracted/sprites/spr_menu_elements_stock/spr_menu_elements_stock_0.png");
		background-position: 0 0;
		background-size: 100%;
		image-rendering: crisp-edges;

		display: flex;
		justify-content: center;
		padding-top: 28px;
		gap: 20px;

		/* Flip Background... */
		transform: scaleY(-1);
		& > * {
			transform: scaleY(-1);
		}
	}

	.tree {
		position: relative;
		width: calc(4 * 732px);
		height: calc(4 * 732px);
		background-color: #111;
		background-image: url("@/assets/extracted/sprites/spr_menu_element_tree_back/spr_menu_element_tree_back_0.png");
		background-position: calc(50% + 4px) calc(50% + 2px);
		transform-origin: 50% 50%;
		cursor: grab;

		transform: scale(1);
		transition: transform 0.2s ease;
		background-size: calc(100% * (1024 / 732));
		image-rendering: crisp-edges;

		&::before {
			content: "";
			pointer-events: none;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-image: url("@/assets/extracted/sprites/spr_menu_element_tree/spr_menu_element_tree_0.png");
			background-position: calc(50% + 4px) calc(50% + 2px);
			transform-origin: 50% 50%;
			transform: scale(1);
			transition: transform 0.2s ease;
			background-size: cover;
			image-rendering: crisp-edges;
		}
	}

	.tree.panning {
		cursor: grabbing;
	}

	.realm {
		pointer-events: none;
		position: absolute;
		transform: translate(-50%, -50%);
		width: var(--width);
		height: var(--height);
		--x-center: calc(var(--width) / 2);
		--y-center: calc(var(--height) / 2);
		image-rendering: crisp-edges;
		z-index: -1;

		&.small {
			--width: 164px;
			--height: 164px;
			&.active {
				&.realm-color-0 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_small/spr_element_circle_small_0.png");
				}
				&.realm-color-1 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_small/spr_element_circle_small_1.png");
				}
				&.realm-color-2 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_small/spr_element_circle_small_2.png");
				}
				&.realm-color-3 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_small/spr_element_circle_small_3.png");
				}
				&.realm-color-4 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_small/spr_element_circle_small_4.png");
				}
				&.realm-color-5 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_small/spr_element_circle_small_5.png");
				}
			}
		}
		&.mid {
			--width: 228px;
			--height: 232px;
			&.active {
				&.realm-color-0 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_mid/spr_element_circle_mid_0.png");
				}
				&.realm-color-1 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_mid/spr_element_circle_mid_1.png");
				}
				&.realm-color-2 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_mid/spr_element_circle_mid_2.png");
				}
				&.realm-color-3 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_mid/spr_element_circle_mid_3.png");
				}
				&.realm-color-4 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_mid/spr_element_circle_mid_4.png");
				}
				&.realm-color-5 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_mid/spr_element_circle_mid_5.png");
				}
			}
		}
		&.large {
			--width: 284px;
			--height: 292px;
			&.active {
				&.realm-color-0 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_large/spr_element_circle_large_0.png");
				}
				&.realm-color-1 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_large/spr_element_circle_large_1.png");
				}
				&.realm-color-2 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_large/spr_element_circle_large_2.png");
				}
				&.realm-color-3 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_large/spr_element_circle_large_3.png");
				}
				&.realm-color-4 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_large/spr_element_circle_large_4.png");
				}
				&.realm-color-5 {
					background-image: url("@/assets/extracted/sprites/spr_element_circle_large/spr_element_circle_large_5.png");
				}
			}
		}
	}

	.element-node {
		pointer-events: all;
		position: absolute;
		transform: translate(-50%, -50%);
	}

	.bridge {
		pointer-events: all;
		cursor: pointer;
		position: absolute;
		transform: translate(-50%, -50%);
		width: 28px;
		height: 20px;
		&.active {
			background-image: url("@/assets/extracted/sprites/spr_menu_elements_gem/spr_menu_elements_gem_2.png");
		}
	}

	.gem {
		width: 20px;
		height: 20px;
		background-image: url("@/assets/extracted/sprites/spr_menu_elements_gem/spr_menu_elements_gem_0.png");
	}
</style>
