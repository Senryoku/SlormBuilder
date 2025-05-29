import RunesJSON from "@/assets/extracted/dat_run.json";
export type Rune = (typeof RunesJSON)[number] & { icon: string };
export const Runes: Rune[] = RunesJSON as Rune[];

import { spritesByIndex } from "@/utils";

export const RuneIcons = spritesByIndex(
	import.meta.glob("@/assets/extracted/sprites/spr_inventory_runes/*.png", {
		eager: true,
		query: "?url",
		import: "default",
	})
);

for (let r of Runes) {
	r.icon = RuneIcons[r.SPRITE];
}

export function getRuneType(ref: number) {
	return ref < 7 ? 0 : ref < 7 + 14 ? 1 : 2;
}
