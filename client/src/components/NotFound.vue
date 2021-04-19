<template>
	<div class="not-found">
		<h1>{{ t("Page Not Found") }}</h1>
		<router-link to="/">{{ t("Return Home") }}</router-link>
	</div>
</template>

<script>
export default {};
</script>

<style>
.not-found {
	text-align: center;
}
</style>