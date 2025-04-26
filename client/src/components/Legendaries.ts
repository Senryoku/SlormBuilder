import LegendariesJSON from "../assets/extracted/dat_leg.json";

export const Legendaries = LegendariesJSON;
export type Legendary = (typeof Legendaries)[number];
