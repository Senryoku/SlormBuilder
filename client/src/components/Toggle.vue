<template>
	<div class="toogle">
		<div class="toogle-image"></div>
		<slot />
	</div>
</template>

<script>
export default {};
</script>

<style>
.toggle-image {
	background-image: url("../assets/data/sprites/spr_menu_toggler_right/spr_menu_toggler_right_0.png");
}
.checked .toggle-image {
	background-image: url("../assets/data/sprites/spr_menu_toggler_right/spr_menu_toggler_0.png");
}
</style>