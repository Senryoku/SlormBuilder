// https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
export const copyToClipboard = (str) => {
	const el = document.createElement("textarea"); // Create a <textarea> element
	el.value = str; // Set its value to the string that you want copied
	el.setAttribute("readonly", ""); // Make it readonly to be tamper-proof
	el.style.position = "absolute";
	el.style.left = "-9999px"; // Move outside the screen to make it invisible
	document.body.appendChild(el); // Append the <textarea> element to the HTML document
	const selected =
		document.getSelection().rangeCount > 0 // Check if there is any content selected previously
			? document.getSelection().getRangeAt(0) // Store selection if found
			: false; // Mark as false to know no selection existed before
	el.select(); // Select the <textarea> content
	document.execCommand("copy"); // Copy - only works as a result of a user action (e.g. click events)
	document.body.removeChild(el); // Remove the <textarea> element
	if (selected) {
		// If a selection existed before copying
		document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
		document.getSelection().addRange(selected); // Restore the original selection
	}
};

import GameStrings from "./assets/data/dat_str.json";

export function translate(id, lang = "EN") {
	if (!id || id === "" || typeof id !== "string") return "";
	id = id.replace("\n", ""); // Wup.
	if (id.includes(":")) id = id.split(":")[1];
	let t = GameStrings.find((o) => o.REF === id);
	if (t) return t[lang];
	else return id;
}

export function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export const Settings = { language: "EN" };

import Strings from "./assets/data/Strings.json";

export function localize(lang, str) {
	str = Strings?.[str]?.[lang] ?? str;
	if (arguments.length > 2) {
		for (let i = 2; i < arguments.length; ++i)
			str = str.replace("$", arguments[i]);
	}
	return str;
}

import Act from "./assets/data/dat_act.json";

export function parseText(item, lang, format = {}, options = { rank: 0 }) {
	format = {
		text: format.text ?? lang + "_DESC",
		value_base: format.value_base ?? "VALUE_BASE",
		value_type: format.value_type ?? "VALUE_TYPE",
		value_level: format.value_level ?? "VALUE_LEVEL",
		value_stat: format.value_stat ?? "VALUE_STAT",
		value_real: format.value_real ?? "VALUE_REAL",
	};

	const n = (s) => `<span class="number">${s}</span>`;
	const s = (str) => `<span class="small">${str}</span>`;

	let r = item[format.text]
		.replace(/</g, "&lt;") // <Buffs>
		.replace(/>/g, "&gt;")
		.replaceAll("#", "<br />"); // New lines;

	// Reapers paragraphs
	r = r
		.replaceAll("/\n", "")
		.split("|")
		.filter((p) => p !== "")
		.map((para) =>
			para
				.split("*")
				.filter((sentence) => sentence !== "")
				.join("<br />")
		)
		.map(
			(s, idx, arr) =>
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
	r = r.replaceAll(/act:(\d+)/g, (match, group) => {
		const ref = parseInt(group) - 200;
		let act = Act.find((o) => o.REF === ref);
		if (act)
			return `${localize(
				lang,
				"Gain Ancestral Skill"
			)} <span class="colored">${act[lang + "_NAME"]}</span>`;
		else return "";
	});

	const extras = item.EXTRA_NBR?.split("|");
	if (extras) for (let e of extras) r = r.replace("¥", e);

	const levels = item?.[format.value_level]
		? item[format.value_level].split("|").map((f) => parseFloat(f))
		: null;

	let types = item[format.value_type].split("|");
	for (let s of item[format.value_stat].split("|"))
		r = r.replace("£", translate(s, lang));

	const values = item[format.value_base].split("|").map((f) => parseFloat(f));
	for (let [idx, v] of values.entries()) {
		const mult = item[format.value_real] === "negative" ? -1 : 1;
		const t = types[idx] && !types[idx].includes(":") ? types[idx] : "";
		const currentValue =
			levels && !isNaN(levels[idx])
				? v + mult * levels?.[idx] * options.rank
				: v;
		let value_explanation = item.UPGRADE_NUMBER > 1 && !r.includes("µ");
		r = r.replace(
			"@",
			n(`${currentValue}${t}`) +
				(value_explanation && levels?.[idx]
					? s(
							` (${v}${t} + ${levels?.[idx]}${t} ${localize(
								lang,
								"per rank"
							)})`
					  )
					: "")
		);
		if (!value_explanation && levels?.[idx]) {
			r = r.replace(/([(（]µ[^µ)]*µ[^)]*[)）])/, (match, group) =>
				s(group)
			);
			r = r.replace(
				"_",
				`${values[idx] + mult * levels[idx] * options.rank}${
					types[idx]
				}`
			);
			r = r.replace("µ", values[idx]);
			r = r.replace("µ", levels[idx]);
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

export const ItemTypes = [
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

export const ItemSlots = [
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

import ReapersData from "./assets/data/dat_rea.json";
export const Reapers = ReapersData;

for (let r of ReapersData) {
	if (r.EVOLVE_IN) {
		let e = ReapersData.find((e) => e.REF === r.EVOLVE_IN);
		e.previous = r;
	}
}
ReapersData.sort((l, r) => l.ORDER - r.ORDER);

export function getSkillSprite(className, skill, support = false) {
	let sprite = require("./assets/data/sprites/spr_unknown_48/spr_unknown_48_0.png");
	try {
		switch (className) {
			case "knight":
				sprite = support
					? require(`./assets/data/sprites/spr_supports_knight/spr_supports_knight_${skill.REF}.png`)
					: require(`./assets/data/sprites/spr_skills_knight/spr_skills_knight_${skill.REF}.png`);
				break;
			case "huntress":
				sprite = support
					? require(`./assets/data/sprites/spr_supports_huntress/spr_supports_huntress_${skill.REF}.png`)
					: require(`./assets/data/sprites/spr_skills_huntress/spr_skills_huntress_${skill.REF}.png`);
				break;
			case "mage":
				sprite = support
					? require(`./assets/data/sprites/spr_supports_mage/spr_supports_mage_${skill.REF}.png`)
					: require(`./assets/data/sprites/spr_skills_mage/spr_skills_mage_${skill.REF}.png`);
				break;
		}
	} catch (e) {
		console.warn(`'spr_skills_${className}_${skill.REF}.png' not found.`);
		//console.error(e);
	}
	return sprite;
}

export function clamp(val, min, max) {
	return Math.max(min, Math.min(val, max));
}
