import { createApp, reactive } from "vue";
import Toaster from "@meforma/vue-toaster";
import App from "./App.vue";
import { translate } from "./utils.js";
const Builder = () => import("./Builder.vue");
const Reapers = () => import("./components/Reapers.vue");
const Legendaries = () => import("./components/Legendaries.vue");
const NotFound = () => import("./components/NotFound.vue");
import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{ path: "/", component: Builder },
	{ path: "/build/:data", component: Builder },
	{ path: "/reapers", component: Reapers },
	{ path: "/legendaries", component: Legendaries },
	{ path: "/:pathMatch(.*)", component: NotFound },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

const app = createApp(App)
	.use(router)
	.use(Toaster);

app.config.globalProperties.settings = reactive({ language: "EN" });
app.config.globalProperties.translate = (s) =>
	translate(s, app.config.globalProperties.settings.language);

const Strings = {
	"Build Example (Debug)": { FR: "Exemple de Build (Debug)" },
	Legendaries: { FR: "Légendaires" },
	"Made by": { FR: "Créé par" },

	Yes: { FR: "Oui" },
	No: { FR: "Non" },

	ring: { EN: "Ring", FR: "Anneau" },
	amulet: { EN: "Amulet", FR: "Amulette" },
	helm: {
		EN: "Helmet",
		FR: "Heaume",
	},
	body: {
		EN: "Chest Armor",
		FR: "Cuirasse",
	},
	shoulder: { EN: "Shoulders", FR: "Épaulettes" },
	bracer: {
		EN: "Bracers",
		FR: "Bracelets",
	},
	glove: {
		EN: "Gloves",
		FR: "Gants",
	},
	boot: {
		EN: "Boots",
		FR: "Bottes",
	},
	cape: {
		EN: "Cape",
		FR: "Cape",
	},
	belt: {
		EN: "Belt",
		FR: "Ceinture",
	},

	knight: { FR: "chevalier" },
	huntress: { FR: "chasseresse" },
	mage: { FR: "mage" },

	"Imported Build": { FR: "Build importé" },
	Skills: { FR: "Compétences" },
	Attributes: { FR: "Attributs" },
	Gear: { FR: "Équipement" },
	"Import Save": { FR: "Importer une sauvegarde" },
	Share: { FR: "Partager" },
	"Edit this build": { FR: "Editer ce build" },
	"Saves are located in $": {
		FR: "Les sauvegardes se trouvent dans le dossier $",
	},
	Level: { FR: "Niveau" },
	"Reaper Damage": { FR: "Dégâts de Reaper" },

	"Specialisation (Support Skill)": {
		FR: "Spécialisation (Compétence de support)",
	},
	"Primary Skill": { FR: "Compétence Primaire" },
	"Secondary Skill": { FR: "Compétence Secondaire" },

	"Legendary Effect": { FR: "Effet Légendaire" },

	"Page Not Found": { FR: "Page non trouvée" },
	"Return Home": { FR: "Retourner à l'accueil" },

	"at level $": { FR: "au niveau $" },
	"Evolves from $ at level $": { FR: "Évolue depuis $ au niveau $" },

	Rank: { FR: "Rang" },
	Cooldown: { FR: "Temps de rechargement" },
	"Base Cost": { FR: "Coût de base" },
	"Next Rank": { FR: "Rang suivant" },
	"Max Rank": { FR: "Rang maximal" },

	"Small Icons": { FR: "Petites icônes" },
	Filters: { FR: "Filtres" },
	sword: { EN: "Sword", FR: "Épée" },
	bow: { EN: "Bow", FR: "Arc" },
	staff: { EN: "Staff", FR: "Bâton" },
	Swords: { FR: "Épées" },
	Bows: { FR: "Arcs" },
	Staffs: { EN: "Staves", FR: "Bâtons" },
	By: { FR: "Par" },
	"Primordial Benediction": { FR: "Bénédiction Primordiale" },
	"Primordial Malediction": { FR: "Malédiction Primordiale" },
};

app.config.globalProperties.t = function(str) {
	str =
		Strings?.[str]?.[app.config.globalProperties.settings.language] ?? str;
	if (arguments.length > 1) {
		for (let i = 1; i < arguments.length; ++i)
			str = str.replace("$", arguments[i]);
	}
	return str;
};

app.mount("#app");
