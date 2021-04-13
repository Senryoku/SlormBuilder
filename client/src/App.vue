<template>
	<div class="header">
		<img
			:src="require('./assets/data/sprites/spr_game_logo/spr_game_logo_0.png')"
			height="110"
		/>
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
	</div>
	<Class
		v-for="c in classes"
		:key="c"
		:className="c"
		v-show="c === selectedClass"
	/>
</template>

<script>
import Class from "./components/Class.vue";

export default {
	name: "App",
	components: {
		Class,
	},
	data() {
		let classes = ["knight", "huntress", "mage"];
		return {
			selectedClass: classes[0],
			classes: classes,
		};
	},
};
</script>

<style scoped>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	background-color: #111;
	margin: 0;
}

.header {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
}

.class-select {
	display: flex;
	justify-content: center;
	text-transform: capitalize;
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
