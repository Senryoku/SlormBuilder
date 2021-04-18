<template>
	<div class="header">
		<div><h1>Builder</h1></div>
		<div class="class-select">
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
			</div>
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
		<div><button @click="share">Share</button></div>
	</div>
	<div class="tab-container">
		<template v-if="selectedTab === 'skills'">
			<template v-for="c in classes">
				<Class
					:key="c"
					:className="c"
					v-if="c === selectedClass"
					:ref="(el) => (classComponents[c] = el)"
			/></template>
		</template>
		<template v-if="selectedTab === 'traits'">
			<Attributes ref="attributes" />
		</template>
		<template v-if="selectedTab === 'gear'">
			<Gear :className="selectedClass" />
		</template>
		<!-- Maybe one day :) -->
		<template v-if="selectedTab === 'elements'">
			<AncestralTree v-if="false" />
		</template>
	</div>
</template>

<script>
import { ref, onBeforeUpdate, defineAsyncComponent } from "vue";
import { copyToClipboard } from "./utils.js";
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
		onBeforeUpdate(() => {
			classComponents.value = {};
		});
		return { classComponents, attributes };
	},
	data() {
		let classes = ["knight", "huntress", "mage"];
		return {
			selectedClass: classes[0],
			selectedTab: "skills",
			classes: classes,
		};
	},
	methods: {
		serialize() {
			let version = "1";
			let str =
				version +
				"," +
				this.$refs.attributes.serialize() +
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
	margin: 1em;
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
</style>

<style>
.gear-builder {
	margin-top: -26px;
}
.attributes {
	margin-top: -26px;
}
</style>
