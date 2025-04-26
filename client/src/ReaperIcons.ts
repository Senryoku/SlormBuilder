import { spritesByIndex } from "./utils";

export default {
	axe: spritesByIndex(
		import.meta.glob("./assets/extracted/sprites/spr_reapers_axes/*.png", {
			eager: true,
			query: "?url",
			import: "default",
		})
	),
	bow: spritesByIndex(
		import.meta.glob("./assets/extracted/sprites/spr_reapers_bows/*.png", {
			eager: true,
			query: "?url",
			import: "default",
		})
	),
	staff: spritesByIndex(
		import.meta.glob(
			"./assets/extracted/sprites/spr_reapers_staffs/*.png",
			{ eager: true, query: "?url", import: "default" }
		)
	),
	sword: spritesByIndex(
		import.meta.glob(
			"./assets/extracted/sprites/spr_reapers_swords/*.png",
			{ eager: true, query: "?url", import: "default" }
		)
	),
};
