import { spritesByIndex, type ClassName } from "@/utils";

import ReapersJSON from "@/assets/extracted/dat_rea.json";

export type ReaperRAW = (typeof ReapersJSON)[number];
export type Reaper = ReaperRAW & { previous?: Reaper[] };
export type ReaperType = "sword" | "bow" | "staff";
export const ReaperTypes = ["sword", "bow", "staff"] as ReaperType[];
export const Reapers: Reaper[] = ReapersJSON;

for (let r of Reapers) {
	if (r.EVOLVE_IN) {
		let e = Reapers.find((e) => e.REF === r.EVOLVE_IN)!;
		if (e.previous) {
			e.previous.push(r);
		} else {
			e.previous = [r];
		}
	}
}
Reapers.sort((l: Reaper, r: Reaper) => l.ORDER - r.ORDER);

export function reaperTypeForClass(className: ClassName) {
	switch (className) {
		case "knight":
			return "sword";
		case "huntress":
			return "bow";
		case "mage":
			return "staff";
	}
}

export const ReaperIcons = {
	bow: spritesByIndex(
		import.meta.glob("@/assets/extracted/sprites/spr_reapers_bows/*.png", {
			eager: true,
			query: "?url",
			import: "default",
		})
	),
	staff: spritesByIndex(
		import.meta.glob(
			"@/assets/extracted/sprites/spr_reapers_staffs/*.png",
			{ eager: true, query: "?url", import: "default" }
		)
	),
	sword: spritesByIndex(
		import.meta.glob(
			"@/assets/extracted/sprites/spr_reapers_swords/*.png",
			{ eager: true, query: "?url", import: "default" }
		)
	),
	primordial: {
		bow: spritesByIndex(
			import.meta.glob(
				"@/assets/extracted/sprites/spr_reapers_bows_corrupted/*.png",
				{
					eager: true,
					query: "?url",
					import: "default",
				}
			)
		),
		staff: spritesByIndex(
			import.meta.glob(
				"@/assets/extracted/sprites/spr_reapers_staffs_corrupted/*.png",
				{ eager: true, query: "?url", import: "default" }
			)
		),
		sword: spritesByIndex(
			import.meta.glob(
				"@/assets/extracted/sprites/spr_reapers_swords_corrupted/*.png",
				{ eager: true, query: "?url", import: "default" }
			)
		),
	},
};
