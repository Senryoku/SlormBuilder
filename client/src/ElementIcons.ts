import { spritesByIndex } from "./utils";

export default spritesByIndex(
	import.meta.glob("./assets/extracted/sprites/spr_elements/*.png", {
		eager: true,
		query: "?url",
		import: "default",
	})
);
