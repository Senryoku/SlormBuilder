<template>
	<div class="skill-tooltip" :key="skill.REF">
		<h2 class="colored">{{ name }}</h2>
		<img
			style="max-width: 100%"
			src="@/assets/extracted/sprites/spr_skill_small_separation/spr_skill_small_separation_0.png"
		/>
		<div style="display: flex; margin: 1em; min-height: 96px">
			<div
				class="skill-image"
				:style="`background-image: url(${skill.image});`"
			></div>
			<div style="margin-left: 20px; text-align: left">
				<ul>
					<li v-if="skill.UPGRADE_NUMBER">
						{{ t("Rank") }}: {{ skill.rank ? skill.rank : 0 }} /
						{{ skill.UPGRADE_NUMBER }}
					</li>
					<li v-show="genres">{{ genres }}</li>
					<li v-show="skill.COOLDOWN">
						{{ t("Cooldown") }}:
						{{ (skill.COOLDOWN! / 60).toFixed(2) }} secondes
					</li>
					<li>{{ t("Base Cost") }}: {{ skill.COST }}</li>
				</ul>
			</div>
		</div>
		<img
			style="max-width: 100%"
			src="@/assets/extracted/sprites/spr_skill_small_separation/spr_skill_small_separation_0.png"
		/>
		<p class="description" v-html="description"></p>
		<!-- TODO -->
		<p v-for="r in reminders" :key="r.name" class="mechanic-summary">
			<template v-if="r.desc">
				<!-- TODO Add Infos here -->
				<img :src="r.icon" width="44" height="44" style="margin: 8px" />
				<div style="text-align: left">
					<div class="mechanic-name">
						{{ r.name }}
					</div>
					<div class="mechanic-desc" v-html="r.desc"></div>
				</div>
			</template>
			<!-- TEMP -->
			<template v-else>
				<div class="mechanic-summary-name">{{ r.name }}</div>
			</template>
		</p>
		<!--
		<template v-if="skill.rank">
			<img
				style="max-width: 100%"
				:src="
					require('@/assets/extracted/sprites/spr_skill_small_separation/spr_skill_small_separation_0.png')
				"
			/>
			<div>{{ t("Next Rank") }}:</div>
			<div>{{ t("Max Rank") }}:</div></template
		>-->
	</div>
</template>

<script setup lang="ts">
	import { type Mechanic, Mechanics } from "@/data/Mechanics";
	import { computed } from "vue";
	import { getSkillSprite, translate, type ClassName } from "@/utils";
	import type { AugmentedSkill } from "@/data/Skills";
	import { useSettings } from "../Settings";

	const settings = useSettings();

	const props = defineProps<{
		className: ClassName;
		skill: AugmentedSkill;
	}>();

	function genMechanicReminder(r: Mechanic | string) {
		if (typeof r === "string") return { name: r };
		return {
			name:
				`${settings.value.language}_NAME` in r
					? r[`${settings.value.language}_NAME` as keyof typeof r]
					: r.EN_NAME,
			desc:
				(
					(`${settings.value.language}_DESCRIPTION` in r
						? r[
								`${settings.value.language}_DESCRIPTION` as keyof typeof r
						  ]
						: r.EN_DESCRIPTION) as string
				).replaceAll("#", "<br />") ?? "",
			icon: getSkillSprite(props.className, r),
		};
	}

	const reminders = computed(() => {
		return [...props.skill["EN_DESCRIPTION"].matchAll(/<([^>]*)>/g)]
			.map((arr) => {
				if (arr[1] in Mechanics)
					return Mechanics[arr[1] as keyof typeof Mechanics];
				else {
					const candidates = Object.keys(Mechanics).filter(
						(k) => k.includes(arr[1]) || arr[1].includes(k)
					);
					if (candidates.length > 0)
						return Mechanics[
							candidates[0] as keyof typeof Mechanics
						];
					console.log(arr[1] + " not found in Mechanics");
				}
				return arr[1];
			})
			.filter((e, idx, arr) => arr.indexOf(e) === idx) // De-duplicate
			.map(genMechanicReminder);
	});

	const name = computed(() => {
		return props.skill[`${settings.value.language}_NAME`];
	});

	const description = computed(() => {
		if (!props.skill) return "";
		let r = props.skill[`${settings.value.language}_DESCRIPTION`];
		// New lines
		r = r.replaceAll("#", "\n");

		// Reminders
		r = r.replaceAll(
			/<([^>]*)>/g,
			(_match, group) => `<span class="keyword">${group}</span>`
		);

		const small = (s: string) => `<span class="smaller">${s}</span>`;
		const c = (n: string) => `<span class="colored">${n}</span>`;

		if (props.skill.DESC_VALUE_REAL) {
			let reals = props.skill.DESC_VALUE_REAL.split("|");
			for (let e of reals)
				r = r.replace("$", translate(e, settings.value.language));
		}

		function splice(
			str: string,
			start: number,
			count: number,
			insert: string
		) {
			return str.slice(0, start) + insert + str.slice(start + count);
		}

		if (props.skill.DESC_VALUE) {
			let negative = props.skill.DESC_VALUE_REAL.split("|").map((v) =>
				v === "negative" ? -1 : 1
			);
			let value_name = props.skill.DESC_VALUE.split("|");
			value_name = value_name.map((n) =>
				translate(n, settings.value.language)
			);
			const value_base_str = props.skill.DESC_VALUE_BASE.split("|");
			const value_base = value_base_str.map((v) => parseFloat(v));
			const value_per_level_str =
				props.skill.DESC_VALUE_PER_LVL.split("|");
			const value_per_level = value_per_level_str.map((v) =>
				parseFloat(v)
			);
			let value_type = props.skill.DESC_VALUE_TYPE.split("|");
			const value_regex = /@([^@]+)£/;
			for (let idx = 0; idx < value_name.length; ++idx) {
				let current_value =
					Math.round(
						100 *
							(value_base[idx] +
								negative[idx] *
									Math.max(0, props.skill.rank) *
									value_per_level[idx])
					) / 100;
				let index = r.search("@");
				let next_index = r.substring(index + 1).search("@");
				let value_explanation =
					(props.skill.UPGRADE_NUMBER ?? 0) > 1 &&
					index >= 0 &&
					!r
						.substring(
							index,
							next_index > 0 ? next_index : undefined
						)
						.includes("µ");
				if (index >= 0) {
					// Search corresponding £
					let matching_name = value_regex.exec(r);
					if (matching_name) {
						r = r.replace(value_regex, (_match, separator) => {
							return `${c(
								current_value + value_type[idx]
							)}${separator}${value_name[idx]}${
								value_explanation
									? small(
											` (${value_base[idx]}${
												value_type[idx]
											} ${
												negative[idx] < 0 ? "-" : "+"
											} ${value_per_level[idx]}${
												value_type[idx]
											} ${translate(
												"per rank",
												settings.value.language
											)})`
									  )
									: ""
							}`;
						});
					} else {
						r = splice(
							r,
							index,
							1,
							c(current_value + value_type[idx])
						);
					}
				} else {
					if (r.includes("£")) {
						r = r.replace("£", c(value_name[idx]));
					}
				}

				if (!value_explanation) {
					r = r.replace(
						/([(（]µ[^µ)]*µ[^)]*[)）])/,
						(_match, group) => small(group)
					);
					r = r.replace("µ", value_base_str[idx]);
					r = r.replace("µ", value_per_level_str[idx]);
				}
				// Synergies
				r = r.replace("_", c(current_value + "%"));
			}
		}

		if (props.skill.EXTRA_NBR) {
			let extras = props.skill.EXTRA_NBR.split("|");
			for (let e of extras) r = r.replace("¥", e);
		}

		// Wth is ¤?
		return r;
	});

	const genres = computed(() => {
		if (!props.skill.GENRE) return null;
		return props.skill.GENRE.split(",")
			?.map((str) => "atk_" + str)
			.map((s) => translate(s, settings.value.language))
			.join(", ");
	});
</script>

<style>
	.skill-tooltip {
		box-sizing: border-box;
		width: 396px;
		padding: 20px;
		background-color: #222;
		z-index: 99;
		pointer-events: none;

		background-image: url("@/assets/extracted/sprites/spr_skill_support_top/spr_skill_support_top_0.png");
		background-repeat: no-repeat;
		border-style: solid;
		border-image-source: url("@/assets/img/skill-tree-border.png");
		border-image-slice: 16 16 16 16;
		border-image-width: 12px;
		border-image-outset: 0px 0px 0px 0px;
		border-image-repeat: stretch stretch;
		border-image-outset: 12px;
	}

	.skill-tooltip ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	h2 {
		margin-top: 0;
		text-align: center;
	}

	.skill-image {
		width: 96px;
		height: 96px;
		flex-shrink: 0;

		border-style: solid;
		border-image-source: url("@/assets/extracted/sprites/spr_borders/spr_borders_4.png");
		border-image-slice: 12 12 12 12;
		border-image-width: 12px;
		border-image-outset: 0px 0px 0px 0px;
		border-image-repeat: stretch stretch;
		border-image-outset: 4px;
		background-size: cover;
		image-rendering: crisp-edges;
		z-index: 2;
	}

	.description {
		white-space: pre-line;
	}

	.colored {
		color: #b13d07;
	}

	.smaller {
		color: #666;
		font-size: 0.9em;
	}

	.keyword {
		font-weight: 600;
	}

	.details {
		word-wrap: break-word;
		text-align: left;
	}

	.mechanic-summary {
		display: flex;
		align-content: center;
		justify-content: flex-start;
		background-color: #282828;
		min-height: 44px;
	}

	.mechanic-summary-name {
		padding-left: 8px;
		line-height: 44px;
	}

	.mechanic-name {
		font-weight: 600;
	}

	.mechanic-desc {
		font-size: 0.8em;
	}
</style>
