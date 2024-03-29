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
								previousReapers(),
								item.previous[0].MAX_LVL
							)
						}}
					</div>
				</div>
			</div>
			<div v-if="item.previous" class="evolve-reminder">
				{{ t("(Includes every effect from $)", previousReapers()) }}
			</div>
			<div class="description" v-html="description"></div>
			<AncestralSkill
				v-for="s in associatedSkills"
				:key="s.REF"
				:skill="s"
			/>
			<img
				style="margin: 16px 0 8px 0"
				src="../assets/extracted/sprites/spr_weapon_separator/spr_weapon_separator_0.png"
			/>
			<div class="lore">
				{{ transformText(item[settings.language + "_LORE"]) }}
			</div>
		</div>
	</div>
</template>

<script>
	import { parseText } from "../utils.js";
	import AncestralSkills from "../assets/extracted/dat_act.json";
	import AncestralSkill from "./AncestralSkill.vue";
	import ReaperIcon from "./ReaperIcon.vue";

	export default {
		name: "Reaper",
		components: { ReaperIcon, AncestralSkill },
		props: {
			type: { type: String, default: "sword" },
			item: { type: Object },
		},
		data(props) {
			return {
				blacksmith: props.item.BLACKSMITH
					? this.translate(
							`weapon_reapersmith_${props.item.BLACKSMITH}`
					  )
					: null,
			};
		},
		methods: {
			previousReapers() {
				if (!this.item.previous) return "";
				return this.item.previous
					.map((o) => o[this.settings.language + "_NAME"])
					.map(this.transformName)
					.join(this.t(" and "));
			},
			transformName(name) {
				if (!name) return "";
				let n = name.split("/");
				if (n.length > 1 && this.type === "sword") n = n[1];
				else n = n[0];
				return n.replace("$", this.translatedType);
			},
			transformText(txt) {
				return txt.replaceAll("#", "\n");
			},
		},
		computed: {
			translatedType() {
				return this.t(this.type);
			},
			description() {
				if (!this.item) return "";
				return parseText(this.item, this.settings.language);
			},
			name() {
				return this.transformName(
					this.item[this.settings.language + "_NAME"]
				);
			},
			associatedSkills() {
				let s = AncestralSkills.filter(
					(s) =>
						s.BASED_ON === "reaper" &&
						s.ID_BASED_ON === this.item.REF
				);
				return s ? s : null;
			},
		},
	};
</script>

<style scoped>
	.reaper {
		width: 406px;
		text-align: center;
	}

	.reaper .top {
		width: 406px;
		height: 112px;
		background-image: url("../assets/extracted/sprites/spr_item_tooltip_top/spr_item_tooltip_top_6.png");
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
		background-image: url("../assets/extracted/sprites/spr_item_tooltip_bottom/spr_item_tooltip_bottom_6.png"),
			url("../assets/extracted/sprites/spr_item_tooltip_repeat_1px/spr_item_tooltip_repeat_1px_6.png");
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
		background-image: url("../assets/extracted/sprites/spr_weapon_back_box/spr_weapon_back_box_0.png");
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
