<template>
	<div class="legendary">
		<div class="top">{{ item.EN_NAME }}</div>
		<div class="body">
			<img :src="image" />
			<div class="effect">
				<div>Legendary Effect</div>
				<div>{{ item.EN_DESC }}</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		item: { type: Object },
	},
	data(props) {
		let image = "";
		try {
			image = require(`../assets/data/sprites/spr_inventory_items/spr_inventory_items_${
				props.item.SPRITE ?? 0
			}.png`);
		} catch (e) {
			//
		}
		return {
			image,
		};
	},
};
</script>

<style scoped>
.legendary {
	width: 406px;
	background-image: url("../assets/data/sprites/spr_item_tooltip_bottom/spr_item_tooltip_bottom_5.png"),
		url("../assets/data/sprites/spr_item_tooltip_repeat_1px/spr_item_tooltip_repeat_1px_5.png");
	background-position: center bottom -20px, center;
	background-repeat: no-repeat, repeat-y;
	text-align: center;
	margin: 2em;
}

.legendary .top {
	width: 406px;
	height: 112px;
	background-color: #111;
	background-image: url("../assets/data/sprites/spr_item_tooltip_top/spr_item_tooltip_top_5.png");
	background-position: center -44px;
	padding-top: 33px;
	line-height: 56px;
	box-sizing: border-box;
}

.legendary .body {
	padding: 0 12px 20px 12px;
	box-sizing: border-box;
}

.effect {
	width: 360px;
	background-image: url("../assets/data/sprites/spr_item_tooltip_legendary_text_top/spr_item_tooltip_legendary_text_top_0.png"),
		url("../assets/data/sprites/spr_item_tooltip_legendary_text_bottom/spr_item_tooltip_legendary_text_bottom_0.png");
	background-position: center top, center bottom;
	background-repeat: no-repeat, no-repeat;
	padding: 64px 12px;
	margin: auto;
}
</style>