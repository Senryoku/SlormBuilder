import { ref } from "vue";
import type { Language } from "./utils";

export const DefaultSettings: { language: Language } = {
	language: "EN" as Language,
};

const settings = ref(DefaultSettings);

export function useSettings() {
	return settings;
}
