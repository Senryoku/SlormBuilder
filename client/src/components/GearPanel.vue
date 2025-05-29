<template>
	<div class="gear-panel unselectable">
		<div class="character" v-if="className" :class="className"></div>
		<div class="gear-slots">
			<div class="top">
				<slot v-for="t in ['helm', 'amulet']" :key="t" :name="t" />
			</div>
			<div class="left">
				<slot
					v-for="t in ['shoulder', 'bracer', 'glove']"
					:key="t"
					:name="t"
				/>
			</div>
			<div class="right">
				<slot
					v-for="t in ['body', 'cape', 'belt']"
					:key="t"
					:name="t"
				/>
			</div>
			<div class="rings">
				<slot v-for="t in ['ring0', 'ring1']" :key="t" :name="t" />
			</div>
			<div class="boot">
				<slot name="boot" />
			</div>
		</div>
		<div class="weapon-box">
			<div class="weapon"><slot name="weapon" /></div>
			<div class="runes">
				<div class="rune"><slot name="rune0" /></div>
				<div class="rune large"><slot name="rune1" /></div>
				<div class="rune"><slot name="rune2" /></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { ClassName } from "@/utils";
	withDefaults(defineProps<{ className?: ClassName }>(), {
		className: undefined,
	});
</script>

<style scoped>
	.gear-panel {
		position: relative;
		width: 572px;
		height: 840px;
		background-image: url("@/assets/extracted/sprites/spr_inventory_slot_panel/spr_inventory_slot_panel_0.png");
		padding: 40px 10px 10px 10px;
		box-sizing: border-box;
	}

	.character {
		position: absolute;
		top: 205px;
		left: 50%;
		transform: translateX(calc(-50%)) scaleX(-1);
		animation-duration: 1000ms;
		animation-iteration-count: infinite;
		animation-direction: forward;
		width: 130px;
		height: 146.25px;
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		image-rendering: crisp-edges; /* Firefox */
		image-rendering: pixelated; /* Chrome */
	}

	.knight {
		animation-name: idle-animation-knight;
	}
	.huntress {
		animation-name: idle-animation-huntress;
	}
	.mage {
		animation-name: idle-animation-mage;
	}

	@keyframes idle-animation-knight {
		0% {
			background-image: url("@/assets/extracted/sprites/spr_npc_knight_idle/spr_npc_knight_idle_0.png");
		}
		25% {
			background-image: url("@/assets/extracted/sprites/spr_npc_knight_idle/spr_npc_knight_idle_1.png");
		}
		50% {
			background-image: url("@/assets/extracted/sprites/spr_npc_knight_idle/spr_npc_knight_idle_2.png");
		}
		75% {
			background-image: url("@/assets/extracted/sprites/spr_npc_knight_idle/spr_npc_knight_idle_3.png");
		}
		100% {
			background-image: url("@/assets/extracted/sprites/spr_npc_knight_idle/spr_npc_knight_idle_0.png");
		}
	}

	@keyframes idle-animation-huntress {
		0% {
			background-image: url("@/assets/extracted/sprites/spr_npc_huntress_idle/spr_npc_huntress_idle_0.png");
		}
		25% {
			background-image: url("@/assets/extracted/sprites/spr_npc_huntress_idle/spr_npc_huntress_idle_1.png");
		}
		50% {
			background-image: url("@/assets/extracted/sprites/spr_npc_huntress_idle/spr_npc_huntress_idle_2.png");
		}
		75% {
			background-image: url("@/assets/extracted/sprites/spr_npc_huntress_idle/spr_npc_huntress_idle_3.png");
		}
		100% {
			background-image: url("@/assets/extracted/sprites/spr_npc_huntress_idle/spr_npc_huntress_idle_0.png");
		}
	}

	@keyframes idle-animation-mage {
		0% {
			background-image: url("@/assets/extracted/sprites/spr_npc_mage_idle/spr_npc_mage_idle_0.png");
		}
		25% {
			background-image: url("@/assets/extracted/sprites/spr_npc_mage_idle/spr_npc_mage_idle_1.png");
		}
		50% {
			background-image: url("@/assets/extracted/sprites/spr_npc_mage_idle/spr_npc_mage_idle_2.png");
		}
		75% {
			background-image: url("@/assets/extracted/sprites/spr_npc_mage_idle/spr_npc_mage_idle_3.png");
		}
		100% {
			background-image: url("@/assets/extracted/sprites/spr_npc_mage_idle/spr_npc_mage_idle_0.png");
		}
	}

	.top {
		display: flex;
		position: absolute;
		top: 70px;
		left: 50%;
		transform: translateX(-50%);
		width: 170px;
		justify-content: space-between;
	}

	.left,
	.right {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 150px;
		height: 230px;
		justify-content: space-between;
	}

	.left {
		left: 80px;
	}

	.right {
		right: 80px;
	}

	.rings {
		display: flex;
		position: absolute;
		top: 400px;
		left: 50%;
		transform: translateX(-50%);
		width: 240px;
		justify-content: space-between;
	}

	.boot {
		position: absolute;
		top: 420px;
		left: 50%;
		transform: translateX(-50%);
	}

	.weapon-box {
		position: absolute;
		width: 419px;
		height: 304px;
		background-image: url("@/assets/extracted/sprites/spr_weapon_box_inventory_v2/spr_weapon_box_inventory_v2_0.png");
		bottom: 30px;
		left: calc(50% - 209.5px);
		text-align: center;
	}

	:deep(.weapon img) {
		margin: auto;
		margin-top: 50px;
		width: 160px;
		image-rendering: pixelated;
	}

	.runes {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 12px;

		position: absolute;
		bottom: 20px;
		left: calc(50% - (3 * 52px + 2 * 12px) / 2);
	}

	.rune {
		width: 52px;
		height: 52px;
		background-image: url("@/assets/extracted/sprites/spr_runes_button/spr_runes_button_0.png");

		&.large {
			width: 60px;
			height: 60px;
			background-image: url("@/assets/extracted/sprites/spr_runes_button_large/spr_runes_button_large_0.png");
		}
	}
</style>
