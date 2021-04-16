<template>
	<div class="reaper">
		<div class="top">{{ name }}</div>
		<div class="body">
			<div class="body-top">
				<div class="image-box"><img :src="image" /></div>
				<div>
					<div style="text-transform: capitalize">{{ type }}</div>
					<div v-if="blacksmith">By {{ blacksmith }}</div>
					<div>{{ item.BASE_DMG_MIN }} - {{ item.BASE_DMG_MAX }}</div>
					<div v-if="item.previous">
						Evolves from
						{{ transformName(item.previous.EN_NAME) }} at level
						{{ item.previous.MAX_LVL }}
					</div>
				</div>
			</div>
			<div>{{ transformText(item.EN_DESC) }}</div>
			<img
				style="margin: 16px 0 8px 0"
				src="../assets/data/sprites/spr_weapon_separator/spr_weapon_separator_0.png"
			/>
			<div class="lore">"{{ transformText(item.EN_LORE) }}"</div>
		</div>
	</div>
</template>

<script>
import { translate, capitalize } from "../utils.js";

// spr_weapon_bot_box_0.png
export default {
	props: {
		type: { type: String, default: "sword" },
		item: { type: Object },
	},
	data(props) {
		let image = "";
		try {
			image = require(`../assets/data/sprites/spr_reapers_${
				props.type
			}s/spr_reapers_${props.type}s_${props.item.REF ?? 0}.png`);
		} catch (e) {
			//
		}
		return {
			image,
			name: this.transformName(props.item.EN_NAME),
			blacksmith: props.item.BLACKSMITH
				? translate(`weapon_reapersmith_${props.item.BLACKSMITH}`)
				: null,
		};
	},
	methods: {
		transformName(name) {
			return name.replace("$", capitalize(this.type));
		},
		transformText(txt) {
			// Todo
			return txt.replaceAll("#", "\n");
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
	background-image: url("../assets/data/sprites/spr_item_tooltip_top/spr_item_tooltip_top_6.png");
	background-position: center -44px;
	padding-top: 33px;
	line-height: 56px;
	box-sizing: border-box;
}

.reaper .body {
	padding: 0 12px 20px 12px;
	box-sizing: border-box;
	white-space: pre-line;
	background-image: url("../assets/data/sprites/spr_item_tooltip_bottom/spr_item_tooltip_bottom_6.png"),
		url("../assets/data/sprites/spr_item_tooltip_repeat_1px/spr_item_tooltip_repeat_1px_6.png");
	background-position: center bottom -20px, center;
	background-repeat: no-repeat, repeat-y;
}

.body-top {
	margin: 0 0 25px 20px;
	display: grid;
	gap: 25px;
	grid-template-columns: auto 1fr;
	text-align: left;
}

.image-box {
	position: relative;
	background-image: url("../assets/data/sprites/spr_weapon_back_box/spr_weapon_back_box_0.png");
	width: 96px;
	height: 160px;
}

.image-box img {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 200px;
	image-rendering: pixelated;
}

.lore {
	color: #888;
	font-style: italic;
	white-space: pre-line;
}
</style>