<template>
	<img :src="image" />
</template>

<script>
export default {
	props: {
		type: { type: String, required: true },
		item: { type: Object, required: true },
	},
	computed: {
		image() {
			switch (this.type) {
				case "sword":
					return require(`../assets/data/sprites/spr_reapers_swords/spr_reapers_swords_${
						this.item.REF ?? 0
					}.png`);
				case "bow":
					return require(`../assets/data/sprites/spr_reapers_bows/spr_reapers_bows_${
						this.item.REF ?? 0
					}.png`);
				case "staff":
					return require(`../assets/data/sprites/spr_reapers_staffs/spr_reapers_staffs_${
						this.item.REF ?? 0
					}.png`);
			}
			return require("../assets/data/sprites/spr_unknown_48/spr_unknown_48_0.png");
		},
	},
};
</script>

<style>
</style>