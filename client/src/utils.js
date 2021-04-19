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

import Act from "./assets/data/dat_act.json";

export function parseText(item, lang, format = {}) {
	format = {
		text: format.text ?? lang + "_DESC",
		value_base: format.value_base ?? "VALUE_BASE",
		value_type: format.value_type ?? "VALUE_TYPE",
		value_level: format.value_level ?? "VALUE_LEVEL",
		value_stat: format.value_stat ?? "VALUE_STAT",
		value_real: format.value_real ?? "VALUE_REAL",
	};

	const n = (s) => `<span class="number">${s}</span>`;

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
						  }">Primordial ${
								idx === arr.length - 2 ? "Benediction" : "Curse"
						  }</div>`
						: ""
				}${s}</p>`
		)
		.join("");

	// Reapers ancestral skill (TODO)
	r = r.replaceAll(/act:(\d+)/g, (match, group) => {
		const ref = parseInt(group) - 200;
		let act = Act.find((o) => o.REF === ref);
		if (act)
			return `Gain Ancestral Skill <span class="colored">${
				act[lang + "_NAME"]
			}</span>`;
		else return "";
	});

	let types = item[format.value_type].split("|");
	for (let s of item[format.value_stat].split("|"))
		r = r.replace("£", translate(s, lang));
	for (let [idx, v] of item[format.value_base].split("|").entries())
		r = r.replace(
			"@",
			n(
				`${v}${
					types[idx] && !types[idx].includes(":") ? types[idx] : ""
				}`
			)
		);

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
