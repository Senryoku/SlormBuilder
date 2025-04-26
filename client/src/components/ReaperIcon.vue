<template>
	<img :src="image" :alt="name" />
</template>

<script>
	import { require } from "../utils.ts";
	import ReaperIcons from "../ReaperIcons.ts";

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
				return (
					ReaperIcons[this.type][this.item.REF ?? 0] ??
					require("../assets/extracted/sprites/spr_unknown_48/spr_unknown_48_0.png")
				);
			},
			name() {
				return this.transformName(
					this.item[this.settings.value.language + "_NAME"]
				);
			},
		},
	};
</script>

<style></style>
