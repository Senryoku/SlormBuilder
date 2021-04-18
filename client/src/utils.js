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
	if (id.includes(":")) id = id.slice(id.indexOf(":") + 1);
	let t = GameStrings.find((o) => o.REF === id);
	if (t) return t[lang];
	else return id;
}

export function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function parseText(item, format) {
	format = {
		text: format.text ?? "EN_DESC",
	};

	const n = (s) => `<span class="number">${s}</span>`;

	let r = item[format.text]
		.replaceAll("#", "\n") // New lines
		.replace(/</g, "&lt;") // <Buffs>
		.replace(/>/g, "&gt;");

	let types = item.TYPE.split("|");
	for (let t of types) if (t.includes(":")) r = r.replace("$", translate(t));
	for (let s of item.STAT.split("|")) r = r.replace("£", translate(s));
	for (let [idx, v] of item.VALUE.split("|").entries())
		r = r.replace(
			"@",
			n(
				`${v}${
					types[idx] && !types[idx].includes(":") ? types[idx] : ""
				}`
			)
		);
	// WTH is ¤?
	return r;
}
