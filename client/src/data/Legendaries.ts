import LegendariesJSON from "@/assets/extracted/dat_leg.json";

export const Legendaries = LegendariesJSON;
export type Legendary = (typeof Legendaries)[number];

import { spritesByIndex } from "@/utils";

export const LegendaryIcons = spritesByIndex(
	import.meta.glob("@/assets/extracted/sprites/spr_inventory_items/*.png", {
		eager: true,
		query: "?url",
		import: "default",
	})
);
