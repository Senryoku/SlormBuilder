<template>
	<div class="tooltip" ref="el">
		<transition name="fade" mode="out-in" @enter="transitionEnter">
			<div v-show="show" :key="triggerCount"><slot /></div>
		</transition>
	</div>
</template>

<script>
import { ref } from "vue";

export default {
	setup() {
		const show = ref(false);
		const el = ref(null);
		const target = ref(null);

		return { show, el, target, triggerCount: ref(0) };
	},
	methods: {
		transitionEnter() {
			this.mousemove(this.lastEvent);
		},
		mousemove(event) {
			let w = window.innerWidth;
			let h = window.innerHeight;
			let x = this.$refs.el.clientWidth;
			let y = this.$refs.el.clientHeight;
			let targetX = 12 + event.clientX;
			let targetY = 5 + event.clientY;
			const margin = 10;
			this.$refs.el.style.top =
				window.innerHeight < y ? 0 : Math.min(targetY, h - y - margin) + "px";
			this.$refs.el.style.left =
				window.clientWidth < x ? 0 : Math.min(targetX, w - x - margin) + "px";
			this.lastEvent = event;
		},
		mouseleave(event) {
			this.hide(event.target);
		},
		display(event) {
			++this.triggerCount;
			this.show = true;
			this.target = event.target;
			this.target.addEventListener("mousemove", this.mousemove);
			this.target.addEventListener("mouseleave", this.mouseleave);
			this.lastEvent = event;
		},
		hide(el) {
			if (this.target === el) {
				++this.triggerCount;
				this.show = false;
				this.target = null;
			}
			el.removeEventListener("mouseleave", this.mouseleave);
			el.removeEventListener("mousemove", this.mousemove);
		},
	},
};
</script>

<style>
.tooltip {
	position: fixed;
	left: 0;
	top: 0;
	z-index: 99;
	pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.15s;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>