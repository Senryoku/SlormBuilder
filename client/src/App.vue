<template>
	<div class="header">
		<img
			:src="require('./assets/data/sprites/spr_game_logo/spr_game_logo_0.png')"
			height="100"
		/>
		<h1>SlormBuilder</h1>
		<div id="nav">
			<router-link to="/">Home</router-link> |
			<router-link to="/build">Build Example</router-link>
		</div>
	</div>
	<router-view />
</template>

<script>
export default {};
</script>

<style>
body {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.header {
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: center;
	margin: 0 6em;
	justify-content: space-between;
	justify-items: center;
}
</style>