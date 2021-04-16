<template>
	<div class="header">
		<div><h1>Builder</h1></div>
		<div class="class-select">
			<div
				v-for="(c, idx) in classes"
				:key="c"
				@click="selectedClass = c"
				:class="{ selected: c === selectedClass }"
			>
				<img
					:src="
						require(`./assets/data/sprites/spr_class_icon_mid/spr_class_icon_mid_${idx}.png`)
					"
					:title="c"
				/>
			</div>
		</div>
		<div><button @click="share">Share</button></div>
	</div>
	<template v-for="c in classes">
		<Class
			:key="c"
			:className="c"
			v-if="c === selectedClass"
			:ref="(el) => (classComponents[c] = el)"
	/></template>
	<Attributes ref="attributes" />
</template>

<script>
import { ref, onBeforeUpdate, defineAsyncComponent } from "vue";
import { copyToClipboard } from "./utils.js";
const Class = defineAsyncComponent(() =>
	import(/* webpackChunkName: "Class" */ "./components/Class.vue")
);
import Attributes from "./components/Attributes.vue";

export default {
	components: {
		Class,
		Attributes,
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
	grid-template-columns: auto auto auto;
	align-items: center;
	justify-content: space-between;
	margin: 1em 3em;
}

.class-select {
	display: flex;
	justify-content: center;
	text-transform: capitalize;
	margin: auto;
}

.class-select > div {
	margin: 1em;
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
</style>
