<template>
	<div class="item-icon">
		<img :src="image" :alt="name" />
	</div>
</template>

<script>
	import { require } from "../utils";

	import ItemIcons from "../ItemIcons";

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
			return {
				image: ItemIcons[
					props.item.SPRITE !== null
						? TypeOffsets[props.item.ITEM] + props.item.SPRITE
						: 0
				],
			};
		},
		computed: {
			name() {
				return this.item[this.settings.value.language + "_NAME"];
			},
		},
	};
</script>

<style scoped>
	.item-icon {
		position: relative;
		width: 56px;
		height: 56px;
		background-image: url("../assets/extracted/sprites/spr_inventory_rarity_back/spr_inventory_rarity_back_4.png");
	}

	.item-icon img {
		position: absolute;
		bottom: 0;
		right: 50%;
		transform: translateX(50%);
	}
</style>
