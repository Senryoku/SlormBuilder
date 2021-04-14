<template>
	Build
	{{ data }}
</template>

<script>
export default {
	data() {
		return {
			data: this.$route.params.data,
		};
	},
};
</script>

<style>
</style>