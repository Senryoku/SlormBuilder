import ElementsJSON from "../assets/extracted/dat_ele.json";
import ElementIcons from "../ElementIcons.ts";

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
