<template>
	<div class="attribute" :style="`--color: ${attr.color}`">
		<div class="top">{{ attr.name }}</div>
		<div class="body">
			Level: {{ attr.level }} / 75
			<br />
			<br />
			<div
				v-for="(e, idx) in effects"
				:key="idx"
				:class="{
					'non-activated': attr.level < e.level,
					'non-basic': !e.basic,
				}"
				v-html="e.text"
			/>
		</div>
	</div>
</template>

<script>
import { translate, parseText } from "../utils.js";

export default {
	props: {
		attr: { type: Object },
	},
	methods: {
		n(s) {
			return `<span class="number">${s}</span>`;
		},
		p(s) {
			return `<span class="small">${s}</span>`;
		},
	},
	computed: {
		effects() {
			let basics = {};
			let others = [];
			for (let e of this.attr.effects) {
				if (!e.EN_TEXT || e.EN_TEXT === "") {
					let types = e.TYPE.split("|");
					let stats = e.STAT.split("|");
					for (let idx = 0; idx < stats.length; ++idx) {
						let s = stats[idx];
						if (!(s in basics))
							basics[s] = { level: 75, value: 0, max: 0, type: types[idx] };
						basics[s].level = Math.min(basics[s].level, e.LEVEL);
						basics[s].value +=
							e.ADDITIVE === null
								? parseFloat(e.VALUE)
								: parseFloat(e.VALUE) *
								  Math.max(0, 1 + e.ADDITIVE * (this.attr.level - e.LEVEL));
						basics[s].max +=
							e.ADDITIVE === null
								? parseFloat(e.VALUE)
								: parseFloat(e.VALUE) *
								  e.ADDITIVE *
								  Math.max(0, 1 + 75 - e.LEVEL);
					}
				} else {
					others.push({
						level: e.LEVEL,
						text: parseText(e, {
							text: "EN_TEXT",
							value_base: "VALUE",
							value_type: "TYPE",
							value_stat: "STAT",
						}),
					});
				}
			}
			let basicEffect = [];
			for (let a in basics) {
				basicEffect.push({
					level: basics[a].level,
					text: `+${this.n(basics[a].value)}${basics[a].type} ${this.p(
						`(+${basics[a].max}${basics[a].type} Max.)`
					)} ${translate(a)}`,
					basic: true,
				});
			}
			basicEffect.sort((l, r) => l.level - r.level);
			others.sort((l, r) => l.level - r.level);
			return basicEffect.concat(others);
		},
	},
};
</script>

<style scoped>
.attribute {
	width: 406px;
	text-align: center;
}

.attribute .top {
	width: 406px;
	height: 96px;
	background-image: url("../assets/data/sprites/spr_item_tooltip_top/spr_item_tooltip_top_0.png");
	background-position: center -56px;
	padding-top: 21px;
	line-height: 56px;
	box-sizing: border-box;
	font-size: 1.5rem;
	color: var(--color);
}

.attribute .body {
	padding: 0 18px 24px 18px;
	box-sizing: border-box;
	background-image: url("../assets/data/sprites/spr_item_tooltip_bottom/spr_item_tooltip_bottom_0.png"),
		url("../assets/data/sprites/spr_item_tooltip_repeat_1px/spr_item_tooltip_repeat_1px_0.png");
	background-position: center bottom -20px, center;
	background-repeat: no-repeat, repeat-y;
}

.non-activated {
	color: #555;
}

.non-basic {
	margin: 0.75em;
	white-space: pre-line;
}

.attribute ::v-deep(.small) {
	color: #555;
}

.attribute ::v-deep(.number) {
	color: var(--color);
}
</style>