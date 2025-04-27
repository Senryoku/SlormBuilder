<template>
	<img :src="image" :alt="name" />
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { localize, require, type Reaper } from "../utils.ts";
	import ReaperIcons from "../ReaperIcons.ts";
	import { useSettings } from "../Settings.ts";

	const settings = useSettings();

	const props = defineProps<{
		type: "sword" | "bow" | "staff";
		item: Reaper;
	}>();

	function transformName(name: string) {
		if (!name) return "";
		let n = name.split("/");
		const s = n.length > 1 && props.type === "sword" ? n[1] : n[0];
		return s.replace("$", localize(settings.value.language, props.type));
	}

	const image = computed(() => {
		return (
			ReaperIcons[props.type][props.item.REF ?? 0] ??
			require("../assets/extracted/sprites/spr_unknown_48/spr_unknown_48_0.png")
		);
	});

	const name = computed(() => {
		return transformName(props.item[`${settings.value.language}_NAME`]);
	});
</script>

<style></style>
