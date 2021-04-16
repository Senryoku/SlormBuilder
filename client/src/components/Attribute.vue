<template>
	<div class="attribute">
		<div class="top" :style="`color: ${attr.color}`">{{ attr.name }}</div>
		<div class="body">
			<div v-for="e in attr.effects" :key="e.REF">
				{{ e.EN_TEXT !== "" ? e.EN_TEXT : e.STAT }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		attr: { type: Object },
	},
};
</script>

<style>
.attribute {
	width: 406px;
	text-align: center;
}

.attribute .top {
	width: 406px;
	height: 96px;
	background-image: url("../assets/data/sprites/spr_item_tooltip_top/spr_item_tooltip_top_0.png");
	background-position: center -56px;
	padding-top: 21px;
	line-height: 56px;
	box-sizing: border-box;
	font-size: 1.5rem;
}

.attribute .body {
	padding: 0 18px 24px 18px;
	box-sizing: border-box;
	background-image: url("../assets/data/sprites/spr_item_tooltip_bottom/spr_item_tooltip_bottom_0.png"),
		url("../assets/data/sprites/spr_item_tooltip_repeat_1px/spr_item_tooltip_repeat_1px_0.png");
	background-position: center bottom -20px, center;
	background-repeat: no-repeat, repeat-y;
}
</style>