<template>
	<div class="gear-slot" :class="type">
		<item-icon v-if="item" :item="item" :key="item.REF" />
		<div v-if="item" class="upgrade-bar"></div>
	</div>
</template>

<script setup lang="ts">
	import type { Legendary } from "../data/Legendaries";
	import ItemIcon from "./ItemIcon.vue";
	defineProps<{ type: string; item: Legendary }>();
</script>

<style scoped>
	.gear-slot {
		width: 56px;
		height: 64px;
		padding: 4px;
		background-image: url("../assets/extracted/sprites/spr_inventory_slot/spr_inventory_slot_12.png");
	}

	.upgrade-bar {
		background-color: rgb(206, 70, 7); /* Legendary */
		width: 56px;
		height: 4px;
		border-top: 4px solid black;
	}

	.helm {
		background-image: url("../assets/extracted/sprites/spr_inventory_slot/spr_inventory_slot_0.png");
	}

	.boot {
		background-image: url("../assets/extracted/sprites/spr_inventory_slot/spr_inventory_slot_5.png");
	}

	.amulet {
		background-image: url("../assets/extracted/sprites/spr_inventory_slot/spr_inventory_slot_8.png");
	}

	.shoulder {
		background-image: url("../assets/extracted/sprites/spr_inventory_slot/spr_inventory_slot_2.png");
	}

	.bracer {
		background-image: url("../assets/extracted/sprites/spr_inventory_slot/spr_inventory_slot_3.png");
	}

	.glove {
		background-image: url("../assets/extracted/sprites/spr_inventory_slot/spr_inventory_slot_4.png");
	}

	.body {
		background-image: url("../assets/extracted/sprites/spr_inventory_slot/spr_inventory_slot_1.png");
	}

	.cape {
		background-image: url("../assets/extracted/sprites/spr_inventory_slot/spr_inventory_slot_10.png");
	}

	.belt {
		background-image: url("../assets/extracted/sprites/spr_inventory_slot/spr_inventory_slot_9.png");
	}

	.ring,
	.ring0,
	.ring1 {
		background-image: url("../assets/extracted/sprites/spr_inventory_slot/spr_inventory_slot_6.png");
	}
</style>
