<template>
	<img :src="image" :alt="name" :class="{ primordial: primordial }" />
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { localize, require } from "@/utils";
	import {
		ReaperIcons,
		type Reaper,
		type ReaperType,
	} from "@/data/Reapers.ts";
	import { useSettings } from "@/Settings";

	const settings = useSettings();

	const props = withDefaults(
		defineProps<{
			type: ReaperType;
			item: Reaper;
			primordial?: boolean;
		}>(),
		{ primordial: false }
	);

	function transformName(name: string) {
		if (!name) return "";
		let n = name.split("/");
		const s = n.length > 1 && props.type === "sword" ? n[1] : n[0];
		return s.replace("$", localize(settings.value.language, props.type));
	}

	const image = computed(() => {
		return (
			(props.primordial
				? ReaperIcons.primordial[props.type][props.item.REF ?? 0]
				: ReaperIcons[props.type][props.item.REF ?? 0]) ??
			require("@/assets/extracted/sprites/spr_unknown_48/spr_unknown_48_0.png")
		);
	});

	const name = computed(() => {
		return transformName(props.item[`${settings.value.language}_NAME`]);
	});
</script>
