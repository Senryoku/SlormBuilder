<template>
	<div class="header">
		<div>
			<h1 v-if="editable">Builder</h1>
			<h1 v-else>
				<img
					style="vertical-align: sub; margin-right: 1rem"
					src="./assets/data/sprites/spr_keybind_lock/spr_keybind_lock_0.png"
				/>{{ t("Imported Build") }}
			</h1>
		</div>
		<div class="class-select">
			<template v-if="editable">
				<div
					v-for="(c, idx) in classes"
					:key="c"
					@click="selectedClass = c"
					:class="{ selected: c === selectedClass }"
					class="class-name clickable"
				>
					<img
						:src="
							require(`./assets/data/sprites/spr_class_icon_mid/spr_class_icon_mid_${idx}.png`)
						"
						:title="c"
						height="44"
					/>
					{{ t(c) }}
				</div></template
			><template v-else>
				<div class="class-name selected" style="font-size: 1.2em">
					<img
						:src="
							require(`./assets/data/sprites/spr_class_icon_mid/spr_class_icon_mid_${classes.findIndex(
								(s) => s === selectedClass
							)}.png`)
						"
						height="44"
					/>
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
					src="./assets/data/sprites/spr_ui_hud_skills_button_v2/spr_ui_hud_skills_button_v2_0.png"
				/>
				{{ t("Skills") }}
			</div>
			<div
				class="tab clickable"
				@click="selectedTab = 'traits'"
				:class="{ 'tab-selected': selectedTab == 'traits' }"
			>
				<img
					src="./assets/data/sprites/spr_ui_hud_traits_v2/spr_ui_hud_traits_v2_0.png"
				/>
				{{ t("Attributes") }}
			</div>
			<div
				class="tab clickable"
				@click="selectedTab = 'gear'"
				:class="{ 'tab-selected': selectedTab == 'gear' }"
			>
				<img
					src="./assets/data/sprites/spr_ui_hud_inventory_button_v2/spr_ui_hud_inventory_button_v2_0.png"
				/>
				{{ t("Gear") }}
			</div>
		</div>
		<div class="actions">
			<button v-if="!editable" @click="edit">{{ t("Edit this build") }}</button>
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
		<template v-for="c in classes" :key="c">
			<Class
				:className="c"
				v-show="c === selectedClass"
				:ref="(el) => (classComponents[c] = el)"
				:import="classImport"
				:editable="editable"
		/></template>
	</div>
	<div v-show="selectedTab === 'traits'" class="tab-container">
		<Attributes
			ref="attributes"
			:values="attributeImport"
			:editable="editable"
		/>
	</div>
	<div v-show="selectedTab === 'gear'" class="tab-container">
		<Gear
			ref="gear"
			:className="selectedClass"
			:import="gearImport"
			:editable="editable"
		/>
	</div>
	<!-- Maybe one day :) -->
	<div v-show="selectedTab === 'elements'" class="tab-container">
		<AncestralTree v-if="false" />
	</div>
	<div class="toast"></div>
</template>

<script>
import { ref, onBeforeUpdate, defineAsyncComponent } from "vue";
import { copyToClipboard, capitalize, ItemSlots, ItemTypes } from "./utils.js";
const Class = defineAsyncComponent(() =>
	import(/* webpackChunkName: "Class" */ "./components/Class.vue")
);
import Attributes from "./components/Attributes.vue";
import Gear from "./components/Gear.vue";
const AncestralTree = defineAsyncComponent(() =>
	import("./components/AncestralTree.vue")
);

export default {
	components: {
		Class,
		Attributes,
		Gear,
		AncestralTree,
	},
	setup() {
		let classComponents = ref({});
		let attributes = ref(null);
		let gear = ref(null);
		onBeforeUpdate(() => {
			classComponents.value = {};
		});

		return { classComponents, attributes, gear };
	},
	data() {
		let classes = ["knight", "huntress", "mage"];
		const r = {
			classes: classes,
			selectedClass: classes[0],
			selectedTab: "skills",
			editable: true,
			classImport: null,
			attributeImport: null,
			gearImport: null,
		};
		if (this.$route.params.data) {
			try {
				let data = window.atob(this.$route.params.data).split(",");
				console.log(data);
				let version = data[0].split(".");
				switch (version[0]) {
					case "1":
						{
							let currentIndex = 1;
							// Attributes
							let attributes = [];
							for (currentIndex = 1; currentIndex < 1 + 8; ++currentIndex)
								attributes.push(parseInt(data[currentIndex]));
							// Gear
							let gearImport = {};
							for (let slot of version[1] ? ItemSlots : ItemTypes)
								gearImport[slot] = parseInt(data[currentIndex++]);
							gearImport["reaper"] = parseInt(data[currentIndex++]);
							// Skil selection
							r.selectedClass = data[currentIndex++];
							let selections = {
								specialisation: parseInt(data[currentIndex++]),
								primarySkill: parseInt(data[currentIndex++]),
								secondarySkill: parseInt(data[currentIndex++]),
							};
							// Upgrades (Variable length)
							let upgrades = [];
							for (; currentIndex < data.length - 1; currentIndex += 2) {
								upgrades.push({
									REF: parseInt(data[currentIndex]),
									rank: parseInt(data[currentIndex + 1]),
								});
							}
							r.attributeImport = attributes;
							r.gearImport = gearImport;
							r.classImport = {
								selections,
								upgrades,
							};
							r.editable = false;
						}
						break;
					default:
						alert("Invalid template.");
						break;
				}

				const descEl = document.querySelector('meta[name="description"]');
				descEl.setAttribute(
					"content",
					`Slormancer ${capitalize(r.selectedClass)} Build`
				);
			} catch (e) {
				alert(`Error while importing build: ${e.toString()}`);
			}
		}

		return r;
	},
	methods: {
		serialize() {
			let version = "1.1";
			let str =
				version +
				"," +
				this.$refs.attributes.serialize() +
				"," +
				this.$refs.gear.serialize() +
				"," +
				this.classComponents[this.selectedClass].serialize();
			return str;
		},
		genURL() {
			return `${window.location.protocol}//${window.location.hostname}${
				window.location.port ? ":" + window.location.port : ""
			}/build/${window.btoa(this.serialize())}`;
		},
		share() {
			copyToClipboard(this.genURL());
			this.$toast.success(`Build URL copied to clipboard!`);
		},
		edit() {
			this.editable = true;
		},
		saveImportDialog() {
			document.getElementById("save-import-input").click();
		},
		importSaveFile(event) {
			event.preventDefault();
			const file = event.target.files[0];
			if (file) {
				var reader = new FileReader();
				reader.onload = (evt) => {
					let content = evt.target.result;
					this.decodeSave(content);
				};
				reader.onerror = () => {
					this.$toast.error("Error reading save.");
				};
				reader.readAsText(file, "UTF-8");
			}
		},
		decodeSave(txt) {
			try {
				let r = txt.substring(0, txt.indexOf("#"));
				let i = 0;
				let asciish = "";
				while (i < r.length - 1) {
					let hex = r[i] + r[i + 1];
					asciish += String.fromCharCode(parseInt(hex, 16));
					i += 2;
				}
				const isNumber = (c) => {
					return (
						c.charCodeAt(0) >= "0".charCodeAt(0) &&
						c.charCodeAt(0) <= "9".charCodeAt(0)
					);
				};
				const getStartIndex = (idx) => {
					while (idx < asciish.length && !isNumber(asciish[idx])) ++idx;
					return idx;
				};
				const getEndIndex = (idx) => {
					const skip = (c) =>
						["/", ":", ",", "-", "|"].includes(c) || isNumber(c);
					while (idx < asciish.length && skip(asciish[idx])) {
						++idx;
					}
					if (idx + 1 < asciish.length && skip(asciish[idx + 1]))
						return getEndIndex(idx + 1);
					return idx;
				};
				const getNextSection = (idx) => {
					let start = getStartIndex(idx);
					return asciish.substring(start, getEndIndex(start)).split("|");
				};

				let dataFields = {};
				dataFields.weapon_data = getNextSection(asciish.indexOf("weapon_data"));
				dataFields.weapon_equip = getNextSection(
					asciish.indexOf("weapon_equip")
				);
				dataFields.traits = asciish
					.match(
						/\d+,\d+,\d+,\d+,\d+,\d+,\d+,\d+\|\d+,\d+,\d+,\d+,\d+,\d+,\d+,\d+\|\d+,\d+,\d+,\d+,\d+,\d+,\d+,\d+/
					)[0]
					.split("|")
					[this.classes.findIndex((c) => c === this.selectedClass)].split(",")
					.map((i) => parseInt(i));
				dataFields.skill_equip = getNextSection(asciish.indexOf("skill_equip"));
				// Number of use for the 3+8 base skills, then rank of each upgrade!
				dataFields.skill_rank = getNextSection(
					asciish.indexOf("skill_rank")
				).map((s) => s.split(",").map((i) => parseInt(i)));

				let selections = [];
				let upgrades = [];
				for (let i = 0; i < dataFields.skill_equip.length; ++i) {
					let dat = dataFields.skill_equip[i]
						.split(",")
						.map((n) => parseInt(n));
					selections.push({
						specialisation: dat.findIndex((n) => n === 4),
						primarySkill: dat.findIndex((n) => n === 2) - 3,
						secondarySkill: dat.findIndex((n) => n === 3) - 3,
					});
					upgrades.push([]);
					for (let ref = 11; ref < dat.length; ++ref) {
						upgrades[i].push({
							REF: ref,
							rank: dataFields.skill_rank[i][ref],
							selected: dat[ref] !== -1,
						});
					}
					this.classComponents[this.classes[i]].importSave(
						selections[i],
						upgrades[i]
					);
				}

				this.$refs.attributes.importSave(dataFields.traits);

				this.$toast.success(
					"Save (Skills & Attributes) successfully imported!"
				);
			} catch (e) {
				this.$toast.error(e.toString());
			}
		},
	},
};
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
	background-image: url("./assets/data/sprites/spr_skill_large_title/spr_skill_large_title_0.png");
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
	margin: 0 12px;
}

.tab::after {
	position: absolute;
	bottom: calc(0.75 * -6px);
	left: calc(50% + 1rem - 9px);
	background-image: url("./assets/data/sprites/spr_skill_selector/spr_skill_selector_0.png");
	background-size: cover;
	width: calc(0.75 * 44px);
	height: calc(0.75 * 36px);
}

.tab:not(.tab-selected):hover::after {
	content: "";
	background-image: url("./assets/data/sprites/spr_skill_selector/spr_skill_selector_1.png");
}

.tab-selected::after {
	content: "";
	background-image: url("./assets/data/sprites/spr_skill_selector/spr_skill_selector_0.png");
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
	margin-top: -26px;
}
</style>
