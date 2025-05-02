import MechanicsJSON from "@/assets/data/mechanics.json";

export type Mechanic = (typeof MechanicsJSON)[keyof typeof MechanicsJSON];
export const Mechanics: Record<keyof typeof MechanicsJSON, Mechanic> =
	MechanicsJSON;
