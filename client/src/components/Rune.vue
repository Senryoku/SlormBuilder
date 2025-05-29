<template>
	<div class="rune" v-if="rune">
		<div class="top">{{ name }}</div>
		<div class="body">
			<div class="header">
				<RuneIcon :rune="rune" />
				<div>
					<div class="type">
						{{
							translate(
								`rune_${getRuneType(rune.REF)}`,
								settings.language
							)
						}}
					</div>
					<div class="blacksmith">{{ t("By") }} {{ blacksmith }}</div>
				</div>
				<RuneIcon :rune="rune" />
			</div>
			<div class="decoration"></div>
			<div class="description" v-html="description"></div>
			<div class="decoration" style="transform: rotate(180deg)"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import RuneIcon from "./RuneIcon.vue";
	import { useSettings } from "@/Settings";
	import { type Rune, getRuneType } from "@/data/Runes";
	import { parseText, translate } from "@/utils";

	const settings = useSettings();

	const props = defineProps<{ rune: Rune }>();

	const name = computed(() => {
		return props.rune[`${settings.value.language}_NAME`];
	});

	const description = computed(() => {
		return parseText(
			props.rune as unknown as Record<string, string>,
			settings.value.language,
			{
				text: `${settings.value.language}_DESCRIPTION`,
			}
		);
	});

	const blacksmith = computed(() =>
		translate(
			`weapon_reapersmith_${props.rune.BLACKSMITH}`,
			settings.value.language
		)
	);
</script>

<style scoped>
	.rune {
		width: 428px;
		text-align: center;
	}

	.top {
		width: 444px;
		height: 120px;
		margin-left: -8px;
		background-image: url("@/assets/extracted/sprites/spr_skill_tooltip_top/spr_skill_tooltip_top_0.png");
		padding-top: 28px;
		line-height: 56px;
		box-sizing: border-box;

		color: white;
		font-weight: 600;

		text-transform: uppercase;
	}

	.body {
		position: relative;
		box-sizing: border-box;
		background-image: url("@/assets/extracted/sprites/spr_skill_tooltip_repeat/spr_skill_tooltip_repeat_0.png");
		background-position: center;
		background-repeat: repeat-y;

		padding: 0 40px;

		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.body:before {
		content: "";
		position: absolute;
		left: 0;
		z-index: -1;
		bottom: -32px;
		width: 428px;
		height: 50px;
		box-sizing: border-box;
		background-image: url("@/assets/extracted/sprites/spr_skill_tooltip_bottom/spr_skill_tooltip_bottom_0.png");
		background-position: center;
		background-repeat: no-repeat;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		.type {
			text-transform: uppercase;
		}
	}

	.decoration {
		width: 196px;
		height: 56px;
		background-image: url("@/assets/extracted/sprites/spr_runes_decoration/spr_runes_decoration_0.png");
		margin: 12px;
	}

	:deep(.small) {
		color: #666;
		font-size: 0.9em;
	}

	:deep(.number) {
		color: var(--color-legendary);
	}
</style>
