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

<script>
export default {
	name: "Toggle",
	props: { modelValue: { type: Boolean, required: true } },
	methods: {
		toggle() {
			this.$emit("update:modelValue", !this.modelValue);
		},
	},
	computed: {
		image() {
			return this.modelValue
				? require("../assets/data/sprites/spr_menu_toggler_right/spr_menu_toggler_right_0.png")
				: require("../assets/data/sprites/spr_menu_toggler/spr_menu_toggler_0.png");
		},
	},
};
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
</style>