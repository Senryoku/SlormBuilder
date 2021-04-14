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

.unselectable {
	-moz-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.weapon-border {
	border-style: solid;
	border-image-slice: 44 44 21 44;
	border-image-width: 20px 20px 20px 20px;
	border-image-outset: 0px 0px 0px 0px;
	border-image-repeat: stretch stretch;
	border-image-source: url("./assets/data/sprites/spr_wrath_decoration/spr_wrath_decoration_0.png");
}
</style>

<style scoped>
.header {
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: center;
	margin: 0 6em;
	justify-content: space-between;
	justify-items: center;
}

a,
a:visited {
	color: #bbb;
	text-decoration: underline dashed;
}

a:hover {
	color: #eee;
}

a:active {
	color: #fff;
}
</style>