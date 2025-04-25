import ElementsJSON from "../assets/extracted/dat_ele.json";

export const Elements = ElementsJSON;
export type Element = (typeof Elements)[number];
export type AugmentedElement = (typeof Elements)[number] & {
	rank: number;
	selected: boolean;
	image: string;
};
