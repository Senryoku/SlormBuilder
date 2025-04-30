import AttributeJSON from "../assets/extracted/dat_att.json";
export type Attribute = (typeof AttributeJSON)[number];
export const Attributes: Attribute[] = AttributeJSON;
