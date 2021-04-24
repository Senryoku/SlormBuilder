<template>
	<img :src="image" :alt="name" />
</template>

<script>
export default {
	props: {
		type: { type: String, required: true },
		item: { type: Object, required: true },
	},
	methods: {
		transformName(name) {
			if (!name) return "";
			let n = name.split("/");
			if (n.length > 1 && this.type === "sword") n = n[1];
			else n = n[0];
			return n.replace("$", this.t(this.type));
		},
	},
	computed: {
		image() {
			switch (this.type) {
				case "sword":
					return require(`../assets/extracted/sprites/spr_reapers_swords/spr_reapers_swords_${
						this.item.REF ?? 0
					}.png`);
				case "bow":
					return require(`../assets/extracted/sprites/spr_reapers_bows/spr_reapers_bows_${
						this.item.REF ?? 0
					}.png`);
				case "staff":
					return require(`../assets/extracted/sprites/spr_reapers_staffs/spr_reapers_staffs_${
						this.item.REF ?? 0
					}.png`);
			}
			return require("../assets/extracted/sprites/spr_unknown_48/spr_unknown_48_0.png");
		},
		name() {
			return this.transformName(this.item[this.settings.language + "_NAME"]);
		},
	},
};
</script>

<style>
</style>