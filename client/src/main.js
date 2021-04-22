import { createApp, reactive } from "vue";
import Toaster from "@meforma/vue-toaster";
import App from "./App.vue";
import { translate, Settings, localize } from "./utils.js";
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

app.config.globalProperties.settings = reactive(Settings);
app.config.globalProperties.translate = (s) =>
	translate(s, app.config.globalProperties.settings.language);

app.config.globalProperties.t = function() {
	return localize(
		app.config.globalProperties.settings.language,
		...arguments
	);
};

app.mount("#app");
