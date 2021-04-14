<template>
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
	<div><button @click="serialize">Share</button></div>
	<Class
		v-for="c in classes"
		:key="c"
		:className="c"
		v-show="c === selectedClass"
		:ref="(el) => (classComponents[c] = el)"
	/>
	<Attributes ref="attributes" />
</template>

<script>
import { ref, onBeforeUpdate } from "vue";
import Class from "./components/Class.vue";
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
			console.log(this.classComponents[this.selectedClass].serialize());
			console.log(this.$refs.attributes.serialize());
		},
	},
};
</script>

<style scoped>
#app {
	background-color: #111;
	margin: 0;
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
