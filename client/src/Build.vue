<template>
	<div class="header">
		<div></div>
		<div>
			<h1>{{ className }} Build</h1>
		</div>
		<div><button @click="edit">Edit this build</button></div>
	</div>
	<Class :className="className" :import="classImport" :editable="false" />
	<Attributes ref="attributes" :values="attributes" :editable="false" />
</template>

<script>
import Class from "./components/Class.vue";
import Attributes from "./components/Attributes.vue";

export default {
	components: {
		Class,
		Attributes,
	},
	data() {
		let data = window.atob(this.$route.params.data).split(",");
		//let version = data[0];
		let attributes = [];
		for (let i = 1; i < 1 + 8; ++i) attributes.push(parseInt(data[i]));
		let className = data[9];
		let selections = {
			specialisation: parseInt(data[10]),
			primarySkill: parseInt(data[11]),
			secondarySkill: parseInt(data[12]),
		};
		let upgrades = [];
		for (let i = 13; i < data.length - 1; i += 2) {
			upgrades.push({ REF: parseInt(data[i]), rank: parseInt(data[i + 1]) });
		}
		return {
			data,
			attributes,
			className,
			classImport: {
				selections,
				upgrades,
			},
		};
	},
	methods: {
		edit() {
			alert("todo");
		},
	},
};
</script>

<style scoped>
.header {
	display: grid;
	grid-template-columns: 1fr 3fr 1fr;
	align-items: center;
	margin: 1em 3em;
}

h1 {
	text-align: center;
	text-transform: capitalize;
	margin: 0;
	font-size: 3rem;
}
</style>