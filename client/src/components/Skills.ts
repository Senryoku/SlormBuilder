import KnightSkillsJSON from "../assets/extracted/dat_cla_0.json";
import HuntressSkillsJSON from "../assets/extracted/dat_cla_1.json";
import MageSkillsJSON from "../assets/extracted/dat_cla_2.json";

export const KnightSkills = KnightSkillsJSON;
export const HuntressSkills = HuntressSkillsJSON;
export const MageSkills = MageSkillsJSON;

export type Skill =
	| (typeof KnightSkills)[number]
	| (typeof HuntressSkills)[number]
	| (typeof MageSkills)[number];

export type AugmentedSkill = Skill & {
	selected: boolean;
	rank: number;
	image: string;
};
