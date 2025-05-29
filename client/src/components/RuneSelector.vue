<template>
	<div class="rune-selector">
		<h2 class="title">
			{{ translate("reaper_runes") }}
		</h2>

		<div class="activation">
			<div>
				<RuneIcon
					v-for="i in 3"
					:key="i - 1"
					:rune="Runes[i - 1]"
					:selected="model[0]?.REF === i - 1"
					:tooltip="true"
					@click="select(0, i - 1)"
				/>
			</div>
			<div>
				<RuneIcon
					v-for="i in 4"
					:key="3 + i - 1"
					:rune="Runes[3 + i - 1]"
					:selected="model[0]?.REF === 3 + i - 1"
					:tooltip="true"
					@click="select(0, 3 + i - 1)"
				/>
			</div>
		</div>

		<div class="decoration"></div>

		<div class="effect">
			<div>
				<RuneIcon
					v-for="i in 5"
					:key="7 + i - 1"
					:rune="Runes[7 + i - 1]"
					:selected="model[1]?.REF === 7 + i - 1"
					:tooltip="true"
					@click="select(1, 7 + i - 1)"
				/>
			</div>
			<div>
				<RuneIcon
					v-for="i in 4"
					:key="12 + i - 1"
					:rune="Runes[12 + i - 1]"
					:selected="model[1]?.REF === 12 + i - 1"
					:tooltip="true"
					@click="select(1, 12 + i - 1)"
				/>
			</div>
			<div>
				<RuneIcon
					v-for="i in 5"
					:key="16 + i - 1"
					:rune="Runes[16 + i - 1]"
					:selected="model[1]?.REF === 16 + i - 1"
					:tooltip="true"
					@click="select(1, 16 + i - 1)"
				/>
			</div>
		</div>

		<div class="decoration" style="transform: rotate(180deg)"></div>

		<div class="amelioration">
			<div>
				<RuneIcon
					v-for="i in 4"
					:key="21 + i - 1"
					:rune="Runes[21 + i - 1]"
					:selected="model[2]?.REF === 21 + i - 1"
					:tooltip="true"
					@click="select(2, 21 + i - 1)"
				/>
			</div>
			<div>
				<RuneIcon
					v-for="i in 3"
					:key="25 + i - 1"
					:rune="Runes[25 + i - 1]"
					:selected="model[2]?.REF === 25 + i - 1"
					:tooltip="true"
					@click="select(2, 25 + i - 1)"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import RuneIcon from "./RuneIcon.vue";
	import { type Rune, Runes } from "@/data/Runes";

	const model = defineModel<[Rune | null, Rune | null, Rune | null]>({
		required: true,
	});

	function select(slot: number, ref: number) {
		model.value[slot] = Runes[ref];
	}
</script>

<style scoped>
	.rune-selector {
		position: relative;
		width: 400px;
		height: 600px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-image: url("@/assets/extracted/sprites/spr_runes_frame_top/spr_runes_frame_top_0.png"),
			url("@/assets/extracted/sprites/spr_runes_frame_bot/spr_runes_frame_bot_0.png");
		background-repeat: no-repeat;
		background-position: center top, center bottom;

		> div > div > div {
			cursor: pointer;
		}
	}

	.title {
		position: absolute;
		top: 1em;
		font-weight: 800;
	}

	.activation,
	.effect,
	.amelioration {
		> div {
			display: flex;
			justify-content: center;
			gap: 10px;

			&:not(:nth-child(1)) {
				margin-top: -12px;
			}
		}
	}

	.activation {
		margin-bottom: -22px;
	}

	.effect {
		margin-top: -22px;
		margin-bottom: -22px;

		> div {
			gap: 8px;
		}
	}

	.amelioration {
		margin-top: -22px;
	}

	.decoration {
		width: 196px;
		height: 56px;
		background-image: url("@/assets/extracted/sprites/spr_runes_decoration/spr_runes_decoration_0.png");
		margin: 12px;
	}
</style>
