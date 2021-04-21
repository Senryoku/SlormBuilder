import { createApp, reactive } from "vue";
import Toaster from "@meforma/vue-toaster";
import App from "./App.vue";
import { translate } from "./utils.js";
const Builder = () => import("./Builder.vue");
const Reapers = () => import("./components/Reapers.vue");
const Legendaries = () => import("./components/Legendaries.vue");
const NotFound = () => import("./components/NotFound.vue");
const Stats = () => import("./components/Stats.vue");
import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{ path: "/", component: Builder },
	{ path: "/build/:data", component: Builder },
	{ path: "/reapers", component: Reapers },
	{ path: "/legendaries", component: Legendaries },
	{ path: "/stats", component: Stats },
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

import Strings from "./assets/data/Strings.json";

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
