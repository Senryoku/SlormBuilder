import { createApp, reactive } from "vue";
import Toaster from "@meforma/vue-toaster";
import fuzzysort from "fuzzysort";
import App from "./App.vue";
import { translate, Settings, localize } from "./utils.js";
const Builder = () => import("./Builder.vue");

import ReaperData from "./assets/extracted/dat_rea.json";
const Reaper = () => import("./components/Reaper.vue");
const Reapers = () => import("./components/Reapers.vue");

import LegendariesData from "./assets/extracted/dat_leg.json";
const Legendary = () => import("./components/Legendary.vue");
const Legendaries = () => import("./components/Legendaries.vue");

const NotFound = () => import("./components/NotFound.vue");
const Stats = () => import("./components/Stats.vue");
import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{ path: "/", component: Builder },
	{ path: "/build/:data", component: Builder },
	{ path: "/reapers", component: Reapers },
	{
		path: "/reapers/large",
		props: () => ({
			large: true,
		}),
		component: Reapers,
	},
	{ path: "/legendaries", component: Legendaries },
	{
		path: "/legendary/:id",
		props: (route) => {
			let id = parseInt(route.params.id);
			let item = null;
			if (isNaN(id)) {
				const results = fuzzysort.go(route.params.id, LegendariesData, {
					key: "EN_NAME",
				});
				item = results[0].obj;
			} else {
				item = LegendariesData.find(
					(o) => o.REF === parseInt(route.params.id)
				);
			}
			return {
				item: item,
			};
		},
		component: Legendary,
		meta: { singleComponent: true },
	},
	{
		path: "/reaper/:type/:id",
		props: (route) => {
			let id = parseInt(route.params.id);
			let item = null;
			if (isNaN(id)) {
				const results = fuzzysort.go(route.params.id, ReaperData, {
					key: "EN_NAME",
				});
				item = results[0].obj;
			} else {
				item = ReaperData.find((o) => o.REF === id);
			}
			return {
				type: route.params.type,
				item: item,
			};
		},
		component: Reaper,
		meta: { singleComponent: true },
	},
	{ path: "/stats", component: Stats },
	{ path: "/:pathMatch(.*)", component: NotFound },
];

const publicPath = "/SlormBuilder/";
const router = createRouter({
	history: createWebHistory(publicPath),
	routes,
});

const app = createApp(App).use(router).use(Toaster);

app.config.globalProperties.settings = reactive(Settings);
app.config.globalProperties.translate = (s) =>
	translate(s, app.config.globalProperties.settings.language);

app.config.globalProperties.t = function () {
	return localize(
		app.config.globalProperties.settings.language,
		...arguments
	);
};

app.mount("#app");
