<template>
	<div
		class="toggle clickable unselectable"
		:class="{ checked: modelValue }"
		@click="toggle"
	>
		<img class="toggle-image" :src="image" />
		<div class="label">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import ImageOn from "@/assets/extracted/sprites/spr_menu_toggler_right/spr_menu_toggler_right_0.png";
	import ImageOff from "@/assets/extracted/sprites/spr_menu_toggler/spr_menu_toggler_0.png";

	const props = defineProps<{ modelValue: boolean }>();

	const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

	function toggle() {
		emit("update:modelValue", !props.modelValue);
	}

	const image = computed(() => {
		return props.modelValue ? ImageOn : ImageOff;
	});
</script>

<style>
	.toggle {
		display: flex;
		align-items: center;
		background-color: #222;
		border-radius: 16px;
		padding: 4px 14px 4px 0;
	}

	.toggle:not(.checked) .toggle-image {
		filter: brightness(40%);
	}

	.toggle:not(.checked):hover .toggle-image {
		filter: brightness(60%);
	}

	.toggle.checked:hover .toggle-image {
		filter: brightness(120%);
	}
</style>
