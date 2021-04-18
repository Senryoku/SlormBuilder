<template>
	<div class="legendary" v-if="item">
		<div class="top">{{ item.EN_NAME }}</div>
		<div class="body">
			<div class="desc">
				<ItemIcon :item="item" />
				<div class="stats">
					<div class="slot">{{ item.ITEM }}</div>
					<div>Lootable: {{ item.LOOTABLE ? "True" : "False" }}</div>
				</div>
			</div>
			<div class="effect">
				<div class="effect-top">Legendary Effect</div>
				<div class="effect-text" v-html="effect"></div>
			</div>
		</div>
	</div>
</template>

<script>
import { parseText } from "../utils.js";
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
	computed: {
		effect() {
			return parseText(this.item, {
				text: "EN_DESC",
				value_base: "VALUE",
				value_type: "TYPE",
				value_stat: "STAT",
			});
		},
	},
};
</script>

<style scoped>
.legendary {
	width: 406px;
	text-align: center;
}

.legendary .top {
	width: 406px;
	height: 112px;
	background-image: url("../assets/data/sprites/spr_item_tooltip_top/spr_item_tooltip_top_5.png");
	background-position: center -44px;
	padding-top: 33px;
	line-height: 56px;
	box-sizing: border-box;

	color: rgb(206, 70, 7);
	font-weight: 600;
}

.legendary .body {
	box-sizing: border-box;
	background-image: url("../assets/data/sprites/spr_item_tooltip_bottom/spr_item_tooltip_bottom_5.png"),
		url("../assets/data/sprites/spr_item_tooltip_repeat_1px/spr_item_tooltip_repeat_1px_5.png");
	background-position: center bottom -20px, center;
	background-repeat: no-repeat, repeat-y;
	padding-bottom: 22px;
}

.legendary .desc {
	padding: 0 20px 0 20px;
	display: flex;
}

.stats {
	margin: 6px 12px;
	padding: 2px 6px;
	border-left: 2px solid rgb(59, 56, 49);
	text-align: left;
}

.slot {
	color: rgb(206, 70, 7);
	text-transform: capitalize;
}

.effect {
	width: 360px;
	background-image: url("../assets/data/sprites/spr_item_tooltip_legendary_text_top/spr_item_tooltip_legendary_text_top_0.png"),
		url("../assets/data/sprites/spr_item_tooltip_legendary_text_bottom/spr_item_tooltip_legendary_text_bottom_0.png");
	background-position: center top, center bottom;
	background-repeat: no-repeat, no-repeat;
	padding: 64px 18px;
	margin: auto;
}

.effect-top {
	color: #555;
	font-weight: 600;
}

.effect-text {
	color: rgb(206, 70, 7);
	padding: 0 14px;
}

.effect-text ::v-deep(.number) {
	color: white;
}
</style>