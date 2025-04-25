import { spritesByIndex } from "./utils";

export default spritesByIndex(
	import.meta.glob("./assets/extracted/sprites/spr_inventory_items/*.png", {
		eager: true,
		query: "?url",
		import: "default",
	})
);
