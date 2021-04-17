<template>
	<div class="item-icon">
		<img :src="image" />
	</div>
</template>

<script>
const TypeOffsets = {
	helm: 1,
	body: 30,
	shoulder: 61,
	bracer: 83,
	glove: 105,
	boot: 127,
	ring: 148,
	amulet: 158,
	belt: 168,
	cape: 178,
};

export default {
	name: "ItemIcon",
	props: {
		item: { type: Object },
	},
	data(props) {
		let image = "";
		try {
			image = require(`../assets/data/sprites/spr_inventory_items/spr_inventory_items_${
				props.item.SPRITE !== null
					? TypeOffsets[props.item.ITEM] + props.item.SPRITE
					: 0
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
.item-icon {
	width: 64px;
	height: 64px;
	background-image: url("../assets/data/sprites/spr_inventory_rarity_back/spr_inventory_rarity_back_4.png");
}
</style>