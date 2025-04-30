import ElementsJSON from "../assets/extracted/dat_ele.json";

import { spritesByIndex } from "../utils";

export const ElementIcons = spritesByIndex(
	import.meta.glob("../assets/extracted/sprites/spr_elements/*.png", {
		eager: true,
		query: "?url",
		import: "default",
	})
);

export type Element = (typeof ElementsJSON)[number] & {
	rank: number;
	selected: boolean;
	image: string;
};

export const Elements: Element[] = ElementsJSON.map((e) => ({
	...e,
	selected: false,
	rank: 0,
	image: ElementIcons[e.REF],
}));
