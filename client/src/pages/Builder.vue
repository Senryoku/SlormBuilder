<template>
	<div class="header">
		<div>
			<h1 v-if="editable">Builder</h1>
			<h1 v-else>
				<img
					style="vertical-align: sub; margin-right: 1rem"
					src="@/assets/extracted/sprites/spr_keybind_lock/spr_keybind_lock_0.png"
				/>{{ t("Imported Build") }}
			</h1>
		</div>
		<div class="class-select">
			<template v-if="editable">
				<div
					v-for="(c, idx) in Classes"
					:key="c"
					@click="selectedClass = c"
					:class="{ selected: c === selectedClass }"
					class="class-name clickable"
				>
					<img :src="classIcon(idx)" :title="c" height="44" />
					{{ t(c) }}
				</div></template
			><template v-else>
				<div class="class-name selected" style="font-size: 1.2em">
					<img :src="selectedClassIcon" height="44" />
					{{ selectedClass }} Build
				</div></template
			>
		</div>
		<div class="tabs">
			<div
				class="tab clickable"
				@click="selectedTab = 'skills'"
				:class="{ 'tab-selected': selectedTab == 'skills' }"
			>
				<img
					src="@/assets/extracted/sprites/spr_ui_hud_skills_button_v2/spr_ui_hud_skills_button_v2_0.png"
				/>
				{{ t("Skills") }}
			</div>
			<div
				class="tab clickable"
				@click="selectedTab = 'traits'"
				:class="{ 'tab-selected': selectedTab == 'traits' }"
			>
				<img
					src="@/assets/extracted/sprites/spr_ui_hud_traits_v2/spr_ui_hud_traits_v2_0.png"
				/>
				{{ t("Attributes") }}
			</div>
			<div
				class="tab clickable"
				@click="selectedTab = 'gear'"
				:class="{ 'tab-selected': selectedTab == 'gear' }"
			>
				<img
					src="@/assets/extracted/sprites/spr_ui_hud_inventory_button_v2/spr_ui_hud_inventory_button_v2_0.png"
				/>
				{{ t("Gear") }}
			</div>
			<div
				class="tab clickable"
				@click="showElements"
				:class="{ 'tab-selected': selectedTab == 'elements' }"
			>
				<img
					src="@/assets/extracted/sprites/spr_ui_hud_elements_button_v2/spr_ui_hud_elements_button_v2_0.png"
				/>
				{{ t("Legacy") }}
			</div>
		</div>
		<div class="actions">
			<button v-if="!editable" @click="edit">
				{{ t("Edit this build") }}
			</button>
			<button @click="share">{{ t("Share") }}</button>
			<button
				@click="saveImportDialog"
				:title="
					t(
						'Saves are located in $',
						'C:\\Users\\%username%\\AppData\\Local\\The_Slormancer'
					)
				"
				v-if="editable"
			>
				{{ t("Import Save") }}
			</button>
			<input
				type="file"
				id="save-import-input"
				hidden
				@change="importSaveFile"
			/>
		</div>
	</div>
	<div v-show="selectedTab === 'skills'" class="tab-container">
		<template v-for="c in Classes" :key="c">
			<Class
				:className="c"
				v-show="c === selectedClass"
				ref="classComponents"
				:editable="editable"
			/>
		</template>
	</div>
	<div v-show="selectedTab === 'traits'" class="tab-container">
		<Attributes ref="attributes" :editable="editable" />
	</div>
	<div v-show="selectedTab === 'gear'" class="tab-container">
		<Gear ref="gear" :className="selectedClass" :editable="editable" />
	</div>
	<div v-show="selectedTab === 'elements'" class="tab-container">
		<AncestralTree ref="ancestralTree" :editable="editable" />
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, useTemplateRef, computed } from "vue";
	import {
		copyToClipboard,
		capitalize,
		ItemSlots,
		ItemTypes,
		spritesByIndex,
		Classes,
		localize,
		type ClassName,
	} from "@/utils";
	import Class from "@/components/Class.vue";
	import Attributes from "@/components/Attributes.vue";
	import Gear from "@/components/Gear.vue";
	import AncestralTree from "@/components/AncestralTree.vue";
	import { useRoute } from "vue-router";
	import { useSettings } from "@/Settings";
	import { useToast } from "vue-toast-notification";
	import "vue-toast-notification/dist/theme-default.css";

	const ClassIcons = spritesByIndex(
		import.meta.glob(
			"@/assets/extracted/sprites/spr_class_icon_mid/*.png",
			{ eager: true, query: "?url", import: "default" }
		)
	);

	const classComponents = useTemplateRef<(typeof Class)[]>("classComponents");
	const attributesComponent = useTemplateRef<typeof Attributes>("attributes");
	const gearComponent = useTemplateRef<typeof Gear>("gear");
	const ancestralTreeComponent =
		useTemplateRef<typeof AncestralTree>("ancestralTree");

	const selectedClass = ref(Classes[0]);
	const selectedTab = ref("skills");
	const editable = ref(true);

	const route = useRoute();
	const settings = useSettings();
	const toast = useToast();

	const t = (key: string, ...args: any[]) =>
		localize(settings.value.language, key, ...args);

	onMounted(() => {
		if (route.params.data && typeof route.params.data === "string") {
			try {
				let data = window.atob(route.params.data).split(",");

				const versionValues = data[0]
					.split(".")
					.map((i) => parseInt(i));
				const version = {
					major: versionValues[0],
					minor: versionValues[1] ?? 0,
				};
				switch (version.major) {
					case 1:
						{
							let currentIndex = 1;
							// Attributes
							let attributes: number[] = [];
							for (
								currentIndex = 1;
								currentIndex < 1 + 8;
								++currentIndex
							)
								attributes.push(parseInt(data[currentIndex]));
							// Gear
							const tmpGearImport: Record<string, number> = {};
							for (let slot of version.minor >= 1
								? ItemSlots
								: ItemTypes)
								tmpGearImport[slot] = parseInt(
									data[currentIndex++]
								);
							tmpGearImport["reaper"] = parseInt(
								data[currentIndex++]
							);

							const tmpStatPriority: number[] = [];

							if (version.minor >= 3) {
								const statCount = parseInt(
									data[currentIndex++]
								);
								for (let i = 0; i < statCount; ++i)
									tmpStatPriority.push(
										parseInt(data[currentIndex++])
									);
							}
							// Elements
							const tmpElementsImport: {
								REF: number;
								rank: number;
							}[] = [];
							if (version.minor >= 2) {
								const elementsCount = parseInt(
									data[currentIndex++]
								);
								for (let i = 0; i < elementsCount; ++i) {
									tmpElementsImport.push({
										REF: parseInt(data[currentIndex++]),
										rank: parseInt(data[currentIndex++]),
									});
								}
							}
							const tmpBridgesImport: number[] = [];
							if (version.minor >= 4) {
								const bridgesCount = parseInt(
									data[currentIndex++]
								);
								for (let i = 0; i < bridgesCount; ++i) {
									tmpBridgesImport.push(
										parseInt(data[currentIndex++])
									);
								}
							}
							const primalGem =
								version.minor >= 5
									? parseInt(data[currentIndex++])
									: null;
							// Skil selection
							selectedClass.value = data[
								currentIndex++
							] as ClassName;
							const selections = {
								specialisation: parseInt(data[currentIndex++]),
								primarySkill: parseInt(data[currentIndex++]),
								secondarySkill: parseInt(data[currentIndex++]),
							};
							// Upgrades (Variable length)
							const upgrades: {
								REF: number;
								rank: number;
								selected: boolean;
							}[] = [];
							for (
								;
								currentIndex < data.length - 1;
								currentIndex += 2
							) {
								upgrades.push({
									REF: parseInt(data[currentIndex]),
									rank: parseInt(data[currentIndex + 1]),
									selected: true,
								});
							}
							attributesComponent.value!.deserialize(attributes);
							gearComponent.value!.importGear(
								tmpGearImport,
								tmpStatPriority
							);
							ancestralTreeComponent.value!.deserialize(
								tmpElementsImport,
								tmpBridgesImport,
								primalGem
							);
							classComponents.value![
								Classes.indexOf(selectedClass.value)
							].deserialize(selections, upgrades);
							editable.value = false;
						}
						break;
					default:
						alert("Invalid template.");
						break;
				}

				const descEl = document.querySelector(
					'meta[name="description"]'
				);
				descEl!.setAttribute(
					"content",
					`Slormancer ${capitalize(selectedClass.value)} Build`
				);
			} catch (e: any) {
				alert(`Error while importing build: ${e.toString()}`);
			}
		}
	});

	const selectedClassIcon = computed(() => {
		return ClassIcons[Classes.findIndex((s) => s === selectedClass.value)];
	});

	function classIcon(index: number) {
		return ClassIcons[index];
	}

	function showElements() {
		selectedTab.value = "elements";
		ancestralTreeComponent.value!.recenter();
	}

	function serialize() {
		const version = "1.5";
		return [
			version,
			attributesComponent.value!.serialize(),
			gearComponent.value!.serialize(),
			ancestralTreeComponent.value!.serialize(),
			classComponents.value![
				Classes.indexOf(selectedClass.value)
			].serialize(),
		].join(",");
	}

	function genURL() {
		// FIXME: Should use the vite base path
		const basePath = "SlormBuilder/";
		return `${window.location.protocol}//${window.location.hostname}${
			window.location.port ? ":" + window.location.port : ""
		}/${basePath}build/${window.btoa(serialize())}`;
	}

	function share() {
		copyToClipboard(genURL());
		toast.success(`Build URL copied to clipboard!`);
	}

	function edit() {
		editable.value = true;
	}

	function saveImportDialog() {
		document.getElementById("save-import-input")!.click();
	}

	function importSaveFile(event: Event) {
		event.preventDefault();
		const file = (event.target as HTMLInputElement)?.files?.[0];
		if (file) {
			var reader = new FileReader();
			reader.onload = (evt) => {
				let content = evt.target!.result;
				if (content && content instanceof ArrayBuffer)
					content = new TextDecoder().decode(content);
				if (content) decodeSave(content);
			};
			reader.onerror = () => {
				toast.error("Error reading save.");
			};
			reader.readAsText(file, "UTF-8");
		}
	}

	function decodeSave(txt: string) {
		try {
			let r = txt.substring(0, txt.indexOf("#"));
			let i = 0;
			let asciish = "";
			while (i < r.length - 1) {
				let hex = r[i] + r[i + 1];
				asciish += String.fromCharCode(parseInt(hex, 16));
				i += 2;
			}
			console.log(asciish);
			const isNumber = (c: string): boolean => {
				return (
					c.charCodeAt(0) >= "0".charCodeAt(0) &&
					c.charCodeAt(0) <= "9".charCodeAt(0)
				);
			};
			const isChar = (c: string): boolean => {
				return (
					c.charCodeAt(0) >= "A".charCodeAt(0) &&
					c.charCodeAt(0) <= "Z".charCodeAt(0)
				);
			};
			const getStartIndex = (idx: number) => {
				while (idx < asciish.length && !isNumber(asciish[idx])) ++idx;
				return idx;
			};
			const getEndIndex = (idx: number) => {
				const skip = (c: string) =>
					["/", ":", ",", "-", "|", "."].includes(c) ||
					isChar(c) ||
					isNumber(c);
				while (idx < asciish.length && skip(asciish[idx])) {
					++idx;
				}
				if (idx + 1 < asciish.length && skip(asciish[idx + 1]))
					return getEndIndex(idx + 1);
				return idx;
			};
			const getNextSection = (idx: number) => {
				let start = getStartIndex(idx);
				return asciish.substring(start, getEndIndex(start)).split("|");
			};

			const classIdx = Classes.findIndex(
				(c) => c === selectedClass.value
			);
			const dataFields: any = {};
			dataFields.weapon_data = getNextSection(
				asciish.indexOf("weapon_data")
			);
			dataFields.traits = asciish
				.match(
					/\d+,\d+,\d+,\d+,\d+,\d+,\d+,\d+\|\d+,\d+,\d+,\d+,\d+,\d+,\d+,\d+\|\d+,\d+,\d+,\d+,\d+,\d+,\d+,\d+/
				)![0]
				.split("|")
				[classIdx].split(",")
				.map((i) => parseInt(i));
			dataFields.skill_equip = getNextSection(
				asciish.indexOf("skill_equip")
			);
			// Number of use for the 3+8 base skills, then rank of each upgrade!
			dataFields.skill_rank = getNextSection(
				asciish.indexOf("skill_rank")
			).map((s) => s.split(",").map((i) => parseInt(i)));
			dataFields.element_equip = getNextSection(
				asciish.indexOf("element_equip")
			)
				[classIdx].split(",")
				.map((i) => parseInt(i));
			dataFields.element_rank = getNextSection(
				asciish.indexOf("element_rank")
			)
				[classIdx].split(",")
				.map((i) => parseInt(i));

			// First 8 slots of the inventory (NOT shared_inventory!) are the equipped items (equipment_list may be the merchant inventory?)
			// Format for each item (example: 4.0.40.0.1.5-5192.1.4:E.78.24.0:N.13.86.0:N.15.78.0:M.79.38.0:RP.3.4:AT.2.1:R.45.54.0;)
			// Entry separated by ':', first entry has general data about the item (mostly unknown, NUM represents a number whose function is unknown):
			//     NUM.ITEMSLOT.ITEMLEVEL.NUM.NUM.UPGRADELEVEL-NUM.NUM.NUM
			// Then each entry represents an item stats
			//     StatSlot:StatType:Value?:NUM
			// with StatSlot in N (Normal), M (Magic), R (Rare), E (Epic), L (Legendary), RP (Reaper), MA (Skill Mastery), AT (Attribut bonus)
			// and StatType is an REF entry in dat_sta.json
			dataFields.gear = getNextSection(asciish.search(/[^_]inventory/));
			dataFields.gear = dataFields.gear[classIdx].split(";");
			const slotsorder = [
				"helm",
				"body",
				"shoulder",
				"bracer",
				"glove",
				"boot",
				"ring0",
				"ring1",
				"amulet",
				"belt",
				"cape",
			];
			const gear: any = {};
			for (let i = 0; i < slotsorder.length; ++i) {
				let legendary = dataFields.gear[i]
					.split(":")
					.find((s: string) => s.startsWith("L"));
				if (legendary) {
					const [, REF, value] = legendary.split(".");
					gear[slotsorder[i]] = {
						REF: parseInt(REF),
						value: parseInt(value), // Percent of stat range?
					};
				}
			}
			dataFields.weapon_equip = getNextSection(
				asciish.indexOf("weapon_equip")
			)[classIdx];
			gear.reaper = {
				REF: parseInt(dataFields.weapon_equip),
			};

			const selections: {
				specialisation: number;
				primarySkill: number;
				secondarySkill: number;
			}[] = [];
			const upgrades: {
				REF: number;
				rank: number;
				selected: boolean;
			}[][] = [];
			for (let i = 0; i < dataFields.skill_equip.length; ++i) {
				const dat = dataFields.skill_equip[i]
					.split(",")
					.map((n: string) => parseInt(n));
				selections.push({
					specialisation: dat.findIndex((n: number) => n === 4),
					primarySkill: dat.findIndex((n: number) => n === 2) - 3,
					secondarySkill: dat.findIndex((n: number) => n === 3) - 3,
				});
				upgrades.push([]);
				for (let ref = 11; ref < dat.length; ++ref) {
					upgrades[i].push({
						REF: ref,
						rank: dataFields.skill_rank[i][ref],
						selected: dat[ref] !== -1,
					});
				}
				classComponents.value![i].importSave(
					selections[i],
					upgrades[i]
				);
			}

			const ultimatums = getNextSection(
				asciish.indexOf("ultimatums")
			).map((s) => s.split(",").map((i) => parseInt(i)));
			console.warn("TODO: Import Ultimatums.");
			console.log(ultimatums);

			const reaper_runes = getNextSection(
				asciish.indexOf("reaper_runes")
			).map((s) => s.split(",").map((i) => parseInt(i)));
			console.warn("TODO: Import Reaper Runes.");
			console.log(reaper_runes);

			gearComponent.value!.importSave(gear);
			attributesComponent.value!.importSave(dataFields.traits);
			ancestralTreeComponent.value!.importSave(
				dataFields.element_equip,
				dataFields.element_rank
			);

			toast.success(
				localize(
					settings.value.language,
					`Save successfully imported! (Every Skills and Attributes, Legendaries and Elements for the $)`,
					capitalize(
						localize(settings.value.language, Classes[classIdx])
					)
				)
			);
		} catch (e: any) {
			toast.error(e.toString());
		}
	}

	defineExpose({ importSaveFile });
</script>

<style scoped>
	#app {
		background-color: #111;
		margin: 0;
	}

	.header {
		display: grid;
		grid-template-columns: auto auto auto auto;
		align-items: center;
		justify-content: space-between;
		margin: 0 3em;
	}

	.tabs,
	.class-select {
		display: flex;
		justify-content: center;
		text-transform: capitalize;
		margin: auto;
		background-image: url("@/assets/extracted/sprites/spr_skill_large_title/spr_skill_large_title_0.png");
		background-size: 100% 54px;
		background-position: center;
		background-repeat: repeat-x;
		padding: 0 1rem;
	}

	.class-select {
		height: 54px;
	}

	.class-select > div {
		margin: 0 1em;
		display: flex;
		align-items: center;
	}

	.tab:hover img {
		filter: brightness(125%);
	}

	.class-select > div:hover {
		filter: brightness(200%);
	}

	.tab:active img {
		filter: brightness(150%);
	}
	.class-select > div:active {
		filter: brightness(300%);
	}

	.tab.tab-selected img {
		filter: brightness(125%);
	}
	.class-select > div.selected {
		filter: brightness(250%);
	}

	.tab {
		position: relative;
		display: flex;
		align-items: center;
		padding: 1rem;
	}

	.class-select > div img,
	.tab img {
		margin-right: 0.5rem;
	}

	.tab-container {
		position: relative;
		margin: 0 12px;
		flex-grow: 1;
	}

	.tab::after {
		position: absolute;
		bottom: calc(0.75 * -6px);
		left: calc(50% + 1rem - 9px);
		background-image: url("@/assets/extracted/sprites/spr_skill_selector/spr_skill_selector_0.png");
		background-size: cover;
		width: calc(0.75 * 44px);
		height: calc(0.75 * 36px);
		z-index: 1;
	}

	.tab:not(.tab-selected):hover::after {
		content: "";
		background-image: url("@/assets/extracted/sprites/spr_skill_selector/spr_skill_selector_1.png");
	}

	.tab-selected::after {
		content: "";
		background-image: url("@/assets/extracted/sprites/spr_skill_selector/spr_skill_selector_0.png");
	}

	.actions {
		display: flex;
		gap: 6px;
	}
</style>

<style>
	.gear-builder {
		margin-top: -26px;
	}
	.attributes {
		margin: auto;
		margin-top: -22px;
	}
</style>
