<template>
	<div class="tooltip" ref="el">
		<transition name="fade" @enter="transitionEnter">
			<div v-show="show" :key="triggerCount"><slot /></div>
		</transition>
	</div>
</template>

<script setup lang="ts">
	import { ref, useTemplateRef } from "vue";

	const show = ref(false);
	const el = useTemplateRef("el");
	const target = ref<EventTarget | null>(null);
	const lastEvent = ref<MouseEvent | null>(null);
	const triggerCount = ref(0);

	function transitionEnter() {
		if (lastEvent.value) mousemove(lastEvent.value);
	}

	function mousemove(event: MouseEvent) {
		let w = window.innerWidth;
		let h = window.innerHeight;
		let x = el.value!.clientWidth;
		let y = el.value!.clientHeight;
		let targetX = 12 + event.clientX;
		let targetY = 5 + event.clientY;
		const margin = 10;
		el.value!.style.top =
			window.innerHeight < y
				? "0"
				: Math.min(targetY, h - y - margin) + "px";
		el.value!.style.left =
			window.innerWidth < x
				? "0"
				: Math.min(targetX, w - x - margin) + "px";
		lastEvent.value = event;
	}

	function mouseleave(event: MouseEvent): void {
		hide(event.target!);
	}

	function display(event: MouseEvent) {
		++triggerCount.value;
		show.value = true;
		target.value = event.target!;
		target.value!.addEventListener("mousemove", mousemove as EventListener);
		target.value!.addEventListener(
			"mouseleave",
			mouseleave as EventListener
		);
		mousemove(event);
	}

	function hide(evtt: EventTarget) {
		if (target.value === evtt) {
			++triggerCount.value;
			show.value = false;
			target.value = null;
		}
		evtt.removeEventListener("mousemove", mousemove as EventListener);
		evtt.removeEventListener("mouseleave", mouseleave as EventListener);
	}

	defineExpose({ display, hide });
</script>

<style>
	.tooltip {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 99;
		pointer-events: none;
		filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.75));
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
