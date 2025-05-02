import AncestralSkillsJSON from "@/assets/extracted/dat_act.json";
export type AncestralSkill = (typeof AncestralSkillsJSON)[number];
export const AncestralSkills: AncestralSkill[] = AncestralSkillsJSON;
