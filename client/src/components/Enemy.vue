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

	const animation = computed(() => {
		return WalkAnimation[props.enemy.EN_REF.split(" ")[0].toLowerCase()];
	});

	const animationSize = computed(() => {
		let width = 0;
		let height = 0;
		for (let i = 0; i < animation.value.length; i++) {
			const img = new Image();
			img.src = animation.value[i];
			width = Math.max(width, img.naturalWidth);
			height = Math.max(height, img.naturalHeight);
		}
		return { width, height };
	});

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
