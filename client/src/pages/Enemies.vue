<template>
	<div class="legendaries">
		<div class="header">
			<h1>{{ t("Enemies") }}</h1>
		</div>
		<div class="filters"></div>
		<div class="gallery">
			<EnemyComponent v-for="e in Enemies" :key="e.REF" :enemy="e" />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { Enemies } from "@/data/Enemies";
	import EnemyComponent from "@/components/Enemy.vue";
</script>

<style scoped>
	.header {
		margin: auto;
		text-align: center;
	}

	.gallery {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		margin: 1em 0;
	}

	.filters {
		margin: 0 2em;
		display: flex;
		gap: 1em;
		justify-content: space-around;
		align-items: center;
	}
</style>
