import { ref } from "vue";
import type { Language } from "./utils";

export const DefaultSettings: { language: Language } = { language: "EN" };

const settings = ref(DefaultSettings);

export function useSettings() {
	return settings;
}
