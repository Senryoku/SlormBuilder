import EnemiesJSON from "@/assets/extracted/dat_enm.json";

export const Enemies = EnemiesJSON;
export type Enemy = (typeof Enemies)[number];

function transform(a: object) {
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

const AllSprites = import.meta.glob(
	"@/assets/extracted/sprites/spr_*_walk/*.png",
	{
		eager: true,
		query: "?url",
		import: "default",
	}
);

export const WalkAnimation: Record<string, string[]> = {};
for (const [path, url] of Object.entries(AllSprites)) {
	const m = path.match(/spr_(.+)_walk\/.+_(\d+)\.png/);
	if (!m) {
		console.error(`Invalid enemy walk sprite path: ${path}`);
		continue;
	}
	if (!WalkAnimation[m[1]]) WalkAnimation[m[1]] = [];
	WalkAnimation[m[1]].push(url);
}
