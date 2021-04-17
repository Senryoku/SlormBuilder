<template>
	<div class="legendary" v-if="item">
		<div class="top">{{ item.EN_NAME }}</div>
		<div class="body">
			<div class="desc">
				<ItemIcon :item="item" />
			</div>
			<div class="effect">
				<div>Legendary Effect</div>
				<div>{{ item.EN_DESC }}</div>
			</div>
		</div>
	</div>
</template>

<script>
import ItemIcon from "./ItemIcon.vue";
export default {
	name: "Legendary",
	components: { ItemIcon },
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
	background-image: url("../assets/data/sprites/spr_item_tooltip_bottom/spr_item_tooltip_bottom_5.png");
	background-position: center bottom -20px;
	background-repeat: no-repeat;
	text-align: center;
	padding-bottom: 22px;
}

.legendary .top {
	width: 406px;
	height: 112px;
	background-image: url("../assets/data/sprites/spr_item_tooltip_top/spr_item_tooltip_top_5.png");
	background-position: center -44px;
	padding-top: 33px;
	line-height: 56px;
	box-sizing: border-box;
}

.legendary .body {
	box-sizing: border-box;
	background-image: url("../assets/data/sprites/spr_item_tooltip_repeat_1px/spr_item_tooltip_repeat_1px_5.png");
	background-position: center;
	background-repeat: repeat-y;
}

.legendary .desc {
	padding: 0 20px 0 20px;
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