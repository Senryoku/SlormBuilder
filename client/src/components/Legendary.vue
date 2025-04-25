<template>
	<div class="legendary" v-if="item">
		<div class="top">{{ item[settings.language + "_NAME"] }}</div>
		<div class="body">
			<div class="desc">
				<ItemIcon :item="item" />
				<div class="stats">
					<div class="slot">{{ t(item.ITEM) }}</div>
					<div>
						{{ t("Lootable") }}:
						{{ t(item.LOOTABLE ? "Yes" : "No") }}
					</div>
				</div>
			</div>
			<div class="effect">
				<div class="effect-top">{{ t("Legendary Effect") }}</div>
				<div class="effect-text" v-html="effect"></div>
				<AncestralSkill :skill="associatedSkill" />
			</div>
		</div>
	</div>
</template>

<script>
	import { parseText, require } from "../utils.js";
	import AncestralSkills from "../assets/extracted/dat_act.json";
	import ItemIcon from "./ItemIcon.vue";
	import AncestralSkill from "./AncestralSkill.vue";

	export default {
		name: "Legendary",
		components: { ItemIcon, AncestralSkill },
		props: {
			item: { type: Object },
		},
		data(props) {
			let image = "";
			try {
				image = require(`../assets/extracted/sprites/spr_inventory_items/spr_inventory_items_${
					props.item.SPRITE ?? 0
				}.png`);
			} catch (e) {
				//
			}
			return {
				image,
			};
		},
		computed: {
			effect() {
				return parseText(this.item, this.settings.language, {
					text: this.settings.language + "_DESC",
					value_base: "VALUE",
					value_type: "TYPE",
					value_stat: "STAT",
					value_level: "UPGRADABLE",
				});
			},
			associatedSkill() {
				let s = AncestralSkills.find(
					(s) =>
						s.BASED_ON === "legendary" &&
						s.ID_BASED_ON === this.item.REF
				);
				return s ? s : null;
			},
		},
	};
</script>

<style scoped>
	.legendary {
		width: 406px;
		text-align: center;
	}

	.legendary .top {
		width: 406px;
		height: 112px;
		background-image: url("../assets/extracted/sprites/spr_item_tooltip_top/spr_item_tooltip_top_5.png");
		padding-top: 33px;
		line-height: 56px;
		box-sizing: border-box;

		color: rgb(206, 70, 7);
		font-weight: 600;
	}

	.legendary .body {
		box-sizing: border-box;
		background-image: url("../assets/extracted/sprites/spr_item_tooltip_bottom/spr_item_tooltip_bottom_5.png"),
			url("../assets/extracted/sprites/spr_item_tooltip_repeat_1px/spr_item_tooltip_repeat_1px_5.png");
		background-position: center bottom, center;
		background-repeat: no-repeat, repeat-y;
		padding-bottom: 22px;
	}

	.legendary .desc {
		padding: 0 20px 0 20px;
		display: flex;
	}

	.stats {
		margin: 6px 12px;
		padding: 2px 6px;
		border-left: 2px solid rgb(59, 56, 49);
		text-align: left;
	}

	.slot {
		color: rgb(206, 70, 7);
		text-transform: capitalize;
	}

	.effect {
		width: 360px;
		background-image: url("../assets/extracted/sprites/spr_item_tooltip_legendary_text_top/spr_item_tooltip_legendary_text_top_0.png"),
			url("../assets/extracted/sprites/spr_item_tooltip_legendary_text_bottom/spr_item_tooltip_legendary_text_bottom_0.png");
		background-position: center top, center bottom;
		background-repeat: no-repeat, no-repeat;
		padding: 64px 18px;
		margin: auto;
	}

	.effect-top {
		color: #555;
		font-weight: 600;
	}

	.effect-text {
		color: rgb(206, 70, 7);
		padding: 0 14px;
	}

	.effect-text ::v-deep(.number) {
		color: white;
	}

	:deep(.small) {
		color: #444;
		font-size: 0.9em;
	}
</style>
