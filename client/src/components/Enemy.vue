<template>
	<div class="enemy">
		<div class="sprite-container" v-if="animation">
			<img
				class="sprite"
				:src="animation?.[animationFrame % animation.length]"
			/>
		</div>
		<div>
			<h2>{{ name }}</h2>
			<pre style="height: 160px; overflow: scroll">{{ enemy }}</pre>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import { useSettings } from "@/Settings";
	import type { Enemy } from "@/data/Enemies";
	import { WalkAnimation } from "@/data/Enemies";

	const settings = useSettings();

	const props = defineProps<{ enemy: Enemy }>();

	const animationFrame = ref(0);

	const name = computed(() => {
		return props.enemy[`${settings.value.language}_NAME`];
	});

	const animation = computed(
		() => WalkAnimation[props.enemy.EN_REF.split(" ")[0].toLowerCase()]
	);

	setInterval(() => {
		animationFrame.value++;
	}, 100);
</script>

<style scoped>
	.enemy {
		display: flex;
		gap: 1em;
		justify-content: center;
		align-items: center;
		margin: 1em 4em;
	}

	.sprite-container {
		img {
			height: 200px;
			image-rendering: pixelated;
		}
	}
</style>
