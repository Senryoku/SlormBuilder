import { createApp } from "vue";
import App from "./App.vue";
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

createApp(App)
	.use(router)
	.mount("#app");
