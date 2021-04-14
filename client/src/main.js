import { createApp } from 'vue'
import App from './App.vue'
import Build from './Build.vue'
import Builder from './Builder.vue'
import {createRouter, createWebHistory} from "vue-router";

const routes = [
	{ path: '/', component: Builder },
	{ path: '/build/:data', component: Build },
	{ path: '/:pathMatch(.*)', component: {template: 'Not Found'} }
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

createApp(App).use(router).mount('#app');
