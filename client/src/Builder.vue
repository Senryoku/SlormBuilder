<template>
	<div class="header">
		<div>
			<h1 v-if="editable">Builder</h1>
			<h1 v-else>
				<img
					style="vertical-align: sub; margin-right: 1rem"
					src="./assets/data/sprites/spr_keybind_lock/spr_keybind_lock_0.png"
				/>Imported Build
			</h1>
		</div>
		<div class="class-select">
			<template v-if="editable">
				<div
					v-for="(c, idx) in classes"
					:key="c"
					@click="selectedClass = c"
					:class="{ selected: c === selectedClass }"
					class="class-name"
				>
					<img
						:src="
							require(`./assets/data/sprites/spr_class_icon_mid/spr_class_icon_mid_${idx}.png`)
						"
						:title="c"
						height="44"
					/>
					{{ c }}
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
				Skills
			</div>
			<div
				class="tab clickable"
				@click="selectedTab = 'traits'"
				:class="{ 'tab-selected': selectedTab == 'traits' }"
			>
				<img
					src="./assets/data/sprites/spr_ui_hud_traits_v2/spr_ui_hud_traits_v2_0.png"
				/>
				Attributes
			</div>
			<div
				class="tab clickable"
				@click="selectedTab = 'gear'"
				:class="{ 'tab-selected': selectedTab == 'gear' }"
			>
				<img
					src="./assets/data/sprites/spr_ui_hud_inventory_button_v2/spr_ui_hud_inventory_button_v2_0.png"
				/>
				Gear
			</div>
		</div>
		<div class="actions">
			<button v-if="!editable" @click="edit">Edit this build</button>
			<button @click="share">Share</button>
		</div>
	</div>
	<div v-show="selectedTab === 'skills'" class="tab-container">
		<template v-for="c in classes">
			<Class
				:key="c"
				:className="c"
				v-if="c === selectedClass"
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
import { copyToClipboard, capitalize, ItemTypes } from "./utils.js";
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
							for (let slot of ItemTypes)
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
			let version = "1";
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

.class-select {
	display: flex;
	justify-content: center;
	text-transform: capitalize;
	margin: auto;
}

.class-select > div {
	margin: 0 1em;
	display: flex;
	align-items: center;
}

.class-select > div:hover {
	filter: brightness(150%);
}

.class-select > div:active {
	filter: brightness(200%);
}

.class-select > div.selected {
	filter: brightness(175%);
}

.tabs {
	display: flex;
	align-items: center;
	background-image: url("./assets/data/sprites/spr_skill_large_title/spr_skill_large_title_0.png");
	background-size: 100% 54px;
	background-position: center;
	background-repeat: repeat-x;
	padding: 0 1rem;
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
	bottom: calc(0.75 * -12px);
	left: calc(50% - 0.75 * 22px);
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
