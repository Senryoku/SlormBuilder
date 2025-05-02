import { AncestralSkills } from "@/data/AncestralSkills";
import GameStrings from "@/assets/extracted/dat_str.json";
import Strings from "@/assets/data/Strings.json";

// https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
export const copyToClipboard = (str: string) => {
	const el = document.createElement("textarea"); // Create a <textarea> element
	el.value = str; // Set its value to the string that you want copied
	el.setAttribute("readonly", ""); // Make it readonly to be tamper-proof
	el.style.position = "absolute";
	el.style.left = "-9999px"; // Move outside the screen to make it invisible
	document.body.appendChild(el); // Append the <textarea> element to the HTML document
	const selected =
		document.getSelection()!.rangeCount > 0 // Check if there is any content selected previously
			? document.getSelection()!.getRangeAt(0) // Store selection if found
			: false; // Mark as false to know no selection existed before
	el.select(); // Select the <textarea> content
	document.execCommand("copy"); // Copy - only works as a result of a user action (e.g. click events)
	document.body.removeChild(el); // Remove the <textarea> element
	if (selected) {
		// If a selection existed before copying
		document.getSelection()!.removeAllRanges(); // Unselect everything on the HTML document
		document.getSelection()!.addRange(selected); // Restore the original selection
	}
};

export type Language = Exclude<keyof (typeof GameStrings)[number], "REF">;

export function translate(id: string, lang: Language) {
	if (!id || id === "" || typeof id !== "string") return "";
	id = id.replace("\n", ""); // Wup.
	if (id.includes(":")) id = id.split(":")[1];
	let t = GameStrings.find((o) => o.REF === id);
	if (t) return t[lang as keyof typeof t];
	else return id;
}

export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function localize(
	lang: Language,
	str: keyof typeof Strings | string,
	...args: string[]
) {
	let r =
		Strings[str as keyof typeof Strings]?.[
			lang as keyof (typeof Strings)[keyof typeof Strings]
		] ?? str;
	if (args.length > 0) {
		for (let s of args) r = r.replace("$", s);
	}
	return r;
}

export function parseText(
	item: Record<string, string> & { UPGRADE_NUMBER?: number },
	lang: Language,
	format: Record<string, string> = {},
	options = { rank: 0 }
) {
	format = {
		text: format.text ?? lang + "_DESC",
		value_base: format.value_base ?? "VALUE_BASE",
		value_type: format.value_type ?? "VALUE_TYPE",
		value_level: format.value_level ?? "VALUE_LEVEL",
		value_stat: format.value_stat ?? "VALUE_STAT",
		value_real: format.value_real ?? "VALUE_REAL",
	};

	const n = (s: string) => `<span class="number">${s}</span>`;
	const s = (str: string) => `<span class="small">${str}</span>`;

	let r = item[format.text]
		.replace(/</g, "&lt;") // <Buffs>
		.replace(/>/g, "&gt;")
		.replaceAll("#", "<br />"); // New lines;

	// Reapers paragraphs
	r = r
		.replaceAll("/\n", "")
		.split("|")
		.filter((p: string) => p !== "")
		.map((para: string) =>
			para
				.split("*")
				.filter((sentence) => sentence !== "")
				.join("<br />")
		)
		.map(
			(s: string, idx: number, arr: string[]) =>
				`<p>${
					arr.length >= 3 && idx >= arr.length - 2
						? `<div class="primordial ${
								idx === arr.length - 2 ? "benediction" : "curse"
						  }">${localize(
								lang,
								"Primordial " +
									(idx === arr.length - 2
										? "Benediction"
										: "Malediction")
						  )}</div>`
						: ""
				}${s}</p>`
		)
		.join("");

	// Reapers ancestral skill (TODO)
	r = r.replaceAll(/act:(\d+)/g, (_match, group) => {
		const ref = parseInt(group) - 200;
		let act = AncestralSkills.find((o) => o.REF === ref);
		if (act)
			return `${localize(
				lang,
				"Gain Ancestral Skill"
			)} <span class="colored">${act[`${lang}_NAME`]}</span>`;
		else return "";
	});

	const extras = item.EXTRA_NBR?.split("|");
	if (extras) for (let e of extras) r = r.replace("¥", e);

	const levels = item[format.value_level]
		? item[format.value_level].split("|").map((f) => parseFloat(f))
		: null;
	// Reaper level
	const reaperLevels = item[format.value_level]
		?.split("|")
		.map((l) => l === "rl");
	// Item upgrades
	const itemRanges = item["RANGE"]?.split("|").map((r) => r === "1");

	let types = item[format.value_type].split("|");
	for (let s of item[format.value_stat].split("|"))
		r = r.replace("£", translate(s, lang));

	const values = item[format.value_base].split("|").map((f) => parseFloat(f));
	for (let [idx, v] of values.entries()) {
		const mult = item[format.value_real] === "negative" ? -1 : 1;
		const t = types[idx] && !types[idx].includes(":") ? types[idx] : "";
		const valueRange = itemRanges?.[idx] ? `[${0.75 * v} - ${v}]` : v;
		if (reaperLevels?.[idx]) {
			r = r.replace(
				"@",
				`${n(v.toString())}${t} ${s(
					`(+${v}${t} ${translate("per level", lang)})`
				)}`
			);
		} else {
			const currentValue = itemRanges?.[idx]
				? valueRange
				: levels && !isNaN(levels[idx])
				? v + mult * levels?.[idx] * options.rank
				: v;
			let value_explanation =
				(item.UPGRADE_NUMBER! > 1 ||
					format.value_level === "UPGRADABLE") &&
				!r.includes("µ");
			const levelStr =
				format.value_level === "UPGRADABLE"
					? "per upgrade"
					: "per rank";
			r = r.replace(
				"@",
				n(`${currentValue}${t}`) +
					(value_explanation && levels?.[idx]
						? s(
								` (${valueRange}${t} + ${
									levels?.[idx]
								}${t} ${localize(lang, levelStr)})`
						  )
						: "")
			);
			if (!value_explanation && levels?.[idx]) {
				r = r.replace(/([(（]µ[^µ)]*µ[^)]*[)）])/, (_match, group) =>
					s(group)
				);
				r = r.replace(
					"_",
					`${values[idx] + mult * levels[idx] * options.rank}${
						types[idx]
					}`
				);
				r = r.replace("µ", values[idx].toString());
				r = r.replace("µ", levels[idx].toString());
			}
		}
	}

	if (format.value_real && item[format.value_real]) {
		let reals = item[format.value_real].split("|");
		for (let t of reals)
			if (t.includes(":")) r = r.replace("$", translate(t, lang));
	} else {
		for (let t of types)
			if (t.includes(":")) r = r.replace("$", translate(t, lang));
	}
	// WTH is ¤?
	return r;
}

export type ClassName = "knight" | "huntress" | "mage";
export const Classes: ClassName[] = ["knight", "huntress", "mage"];

export type ItemType =
	| "amulet"
	| "belt"
	| "body"
	| "boot"
	| "bracer"
	| "cape"
	| "glove"
	| "helm"
	| "ring"
	| "shoulder";
export const ItemTypes: ItemType[] = [
	"amulet",
	"belt",
	"body",
	"boot",
	"bracer",
	"cape",
	"glove",
	"helm",
	"ring",
	"shoulder",
];

export type ItemSlot =
	| "amulet"
	| "belt"
	| "body"
	| "boot"
	| "bracer"
	| "cape"
	| "glove"
	| "helm"
	| "ring0"
	| "ring1"
	| "shoulder";
export const ItemSlots: ItemSlot[] = [
	"amulet",
	"belt",
	"body",
	"boot",
	"bracer",
	"cape",
	"glove",
	"helm",
	"ring0",
	"ring1",
	"shoulder",
];

export function itemSlotToItemType(slot: ItemSlot): ItemType {
	if (slot === "ring0" || slot === "ring1") return "ring";
	return slot;
}

export function require(url: string) {
	return new URL(url, import.meta.url).href;
}

const SkillSprites = {
	knight: {
		skills: spritesByIndex(
			import.meta.glob(
				"@/assets/extracted/sprites/spr_skills_knight/*.png",
				{
					eager: true,
					query: "?url",
					import: "default",
				}
			)
		),
		supports: spritesByIndex(
			import.meta.glob(
				"@/assets/extracted/sprites/spr_supports_knight/*.png",
				{
					eager: true,
					query: "?url",
					import: "default",
				}
			)
		),
	},
	huntress: {
		skills: spritesByIndex(
			import.meta.glob(
				"@/assets/extracted/sprites/spr_skills_huntress/*.png",
				{
					eager: true,
					query: "?url",
					import: "default",
				}
			)
		),
		supports: spritesByIndex(
			import.meta.glob(
				"@/assets/extracted/sprites/spr_supports_huntress/*.png",
				{
					eager: true,
					query: "?url",
					import: "default",
				}
			)
		),
	},
	mage: {
		skills: spritesByIndex(
			import.meta.glob(
				"@/assets/extracted/sprites/spr_skills_mage/*.png",
				{
					eager: true,
					query: "?url",
					import: "default",
				}
			)
		),
		supports: spritesByIndex(
			import.meta.glob(
				"@/assets/extracted/sprites/spr_supports_mage/*.png",
				{
					eager: true,
					query: "?url",
					import: "default",
				}
			)
		),
	},
};

export function getSkillSprite(
	className: ClassName,
	skill: { REF: number },
	support: boolean = false
) {
	const sprite =
		SkillSprites[className]?.[support ? "supports" : "skills"]?.[skill.REF];
	if (!sprite)
		console.log("[getSkillSprite] Could not find sprite for", {
			className,
			skill,
			support,
		});
	return (
		sprite ??
		require("@/assets/extracted/sprites/spr_unknown_48/spr_unknown_48_0.png")
	);
}

export function clamp<T extends number>(val: T, min: T, max: T) {
	return Math.max(min, Math.min(val, max));
}

export function spritesByIndex(a: object) {
	return Object.fromEntries(
		Object.entries(a).map(([path, url]) => {
			const m = path.match(/.+_(\d+)\.png/);
			if (!m) {
				console.error(`Invalid sprite path: ${path}`);
				return [0, url];
			}
			return [m[1], url];
		})
	);
}
