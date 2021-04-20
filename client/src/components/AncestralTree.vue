<template>
	<div class="ancestral-tree" ref="el">
		<img
			src="../assets/data/sprites/spr_menu_element_tree/spr_menu_element_tree_0.png"
		/>
	</div>
</template>

<script>
import { ref } from "vue";

export default {
	name: "AncestralTree",
	data() {
		return { el: ref(null) };
	},
	mounted() {
		this.$refs.el.scrollLeft = 2048 - this.$refs.el.clientWidth / 2;
		this.$refs.el.scrollTop = 2048 - this.$refs.el.clientHeight / 2;
	},
};
</script>

<style>
.ancestral-tree {
	width: 90vw;
	height: 90vh;
	overflow: scroll;
	margin: 2em auto;

	border-style: solid;
	border-image-source: url("../assets/img/skill-tree-border.png");
	border-image-slice: 16 16 16 16;
	border-image-width: 12px;
	border-image-outset: 0px 0px 0px 0px;
	border-image-repeat: stretch stretch;
	border-image-outset: 12px;
}
</style>