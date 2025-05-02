<template>
	<div class="reaper">
		<div class="top">{{ name }}</div>
		<div class="body">
			<div class="body-top">
				<div class="image-box">
					<ReaperIcon :type="type" :item="item" />
				</div>
				<div>
					<div style="text-transform: capitalize">
						{{ translatedType }}
					</div>
					<div v-if="blacksmith">{{ t("By") }} {{ blacksmith }}</div>
					<div class="reaper-damage">
						{{ item.BASE_DMG_MIN }} - {{ item.BASE_DMG_MAX }}
					</div>
					<div>{{ t("Reaper Damage") }}</div>
					<!-- TODO: These values are wrong. -->
					<div class="small">
						{{
							item.BASE_DMG_MIN +
							item.DMG_MULTIPLIER *
								item.MAX_LVL *
								item.MIN_DMG_LVL
						}}
						-
						{{
							item.BASE_DMG_MAX +
							item.DMG_MULTIPLIER *
								item.MAX_LVL *
								item.MAX_DMG_LVL
						}}
						{{ t("at level $", item.MAX_LVL) }}
					</div>
					<div class="smaller" v-if="item.MAX_LVL !== 100">
						{{
							item.BASE_DMG_MIN +
							item.DMG_MULTIPLIER * 100 * item.MIN_DMG_LVL
						}}
						-
						{{
							item.BASE_DMG_MAX +
							item.DMG_MULTIPLIER * 100 * item.MAX_DMG_LVL
						}}
						{{ t("at level $", 100) }}
					</div>
					<div v-if="item.previous">
						{{
							t(
								"Evolves from $ at level $",
								previousReapers,
								item.previous[0].MAX_LVL
							)
						}}
					</div>
				</div>
			</div>
			<div v-if="item.previous" class="evolve-reminder">
				{{ t("(Includes every effect from $)", previousReapers) }}
			</div>
			<div class="description" v-html="description"></div>
			<AncestralSkill
				v-for="s in associatedSkills"
				:key="s.REF"
				:skill="s"
			/>
			<img
				style="margin: 16px 0 8px 0"
				src="@/assets/extracted/sprites/spr_weapon_separator/spr_weapon_separator_0.png"
			/>
			<div class="lore" v-if="lore">
				{{ lore }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { localize, parseText, translate } from "@/utils";
	import AncestralSkill from "./AncestralSkill.vue";
	import ReaperIcon from "./ReaperIcon.vue";
	import { useSettings } from "../Settings";
	import { AncestralSkills } from "@/data/AncestralSkills";
	import type { ReaperType, Reaper } from "@/data/Reapers";

	const settings = useSettings();

	const props = withDefaults(
		defineProps<{
			type?: ReaperType;
			item: Reaper;
		}>(),
		{ type: "sword" }
	);

	const blacksmith = props.item.BLACKSMITH
		? translate(
				`weapon_reapersmith_${props.item.BLACKSMITH}`,
				settings.value.language
		  )
		: null;

	function transformName(name: string) {
		if (!name) return "";
		let n = name.split("/");
		let n2 = n.length > 1 && props.type === "sword" ? n[1] : n[0];
		return n2.replace("$", translatedType.value);
	}

	function transformText(txt: string) {
		return txt.replaceAll("#", "\n");
	}

	const translatedType = computed(() => {
		return localize(settings.value.language, props.type);
	});

	const description = computed(() => {
		if (!props.item) return "";
		return parseText(props.item, settings.value.language);
	});

	const name = computed(() => {
		return transformName(props.item[`${settings.value.language}_NAME`]);
	});

	const lore = computed(() => {
		const txt =
			props.item[`${settings.value.language}_LORE`] ??
			props.item[`EN_LORE`];
		if (!txt) return null;
		return transformText(txt);
	});

	const associatedSkills = computed(() => {
		let s = AncestralSkills.filter(
			(s) => s.BASED_ON === "reaper" && s.ID_BASED_ON === props.item.REF
		);
		return s ? s : null;
	});

	const previousReapers = computed(() => {
		if (!props.item.previous) return "";
		return props.item.previous
			.map((o) => o[`${settings.value.language}_NAME`])
			.map(transformName)
			.join(localize(settings.value.language, " and "));
	});
</script>

<style scoped>
	.reaper {
		width: 406px;
		text-align: center;
	}

	.reaper .top {
		width: 406px;
		height: 112px;
		background-image: url("@/assets/extracted/sprites/spr_item_tooltip_top/spr_item_tooltip_top_6.png");
		background-position: center;
		padding-top: 33px;
		line-height: 56px;
		box-sizing: border-box;
		font-weight: 600;
	}

	.reaper .body {
		padding: 0 12px 20px 12px;
		box-sizing: border-box;
		/*white-space: pre-line;*/
		background-image: url("@/assets/extracted/sprites/spr_item_tooltip_bottom/spr_item_tooltip_bottom_6.png"),
			url("@/assets/extracted/sprites/spr_item_tooltip_repeat_1px/spr_item_tooltip_repeat_1px_6.png");
		background-position: center bottom 0, center;
		background-repeat: no-repeat, repeat-y;
	}

	.body-top {
		margin: 0 10px 10px 20px;
		display: grid;
		gap: 25px;
		grid-template-columns: auto 1fr;
		text-align: left;
	}

	.reaper ::v-deep(.primordial) {
		font-weight: 600;
	}

	.reaper ::v-deep(.primordial.benediction) {
		color: cyan;
	}

	.reaper ::v-deep(.primordial.curse) {
		color: red;
	}

	.reaper ::v-deep(.colored) {
		color: rgb(206, 70, 7);
	}

	.image-box {
		position: relative;
		background-image: url("@/assets/extracted/sprites/spr_weapon_back_box/spr_weapon_back_box_0.png");
		width: 96px;
		height: 160px;
	}

	.image-box img {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 138px;
		image-rendering: pixelated;
	}

	.reaper-damage {
		font-size: 2em;
	}

	.evolve-reminder {
		color: #444;
		font-size: 0.8em;
	}

	.description {
		margin: 0 8px;
	}

	.lore {
		color: #888;
		font-style: italic;
		white-space: pre-line;
	}

	:deep(.small) {
		color: #444;
		font-size: 0.9em;
	}

	:deep(.number) {
		font-weight: 600;
		color: var(--color-reaper);
	}
</style>
