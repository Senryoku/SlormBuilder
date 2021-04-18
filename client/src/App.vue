<template>
	<div class="header">
		<router-link to="/"
			><img
				style="position: absolute; top: 0"
				:src="
					require('@/assets/data/sprites/spr_game_logo/spr_game_logo_0.png')
				"
				height="100"
		/></router-link>
		<router-link to="/" custom v-slot="{ href, navigate, isActive }"
			><h1
				:class="{ active: isActive }"
				:href="href"
				@click="navigate"
				class="clickable"
			>
				SlormBuilder
			</h1></router-link
		>
		<div id="nav" style="text-align: right">
			<router-link to="/">Builder</router-link> |
			<router-link
				to="/build/MSwwLDAsMCwwLDMwLDE1LDAsMCwtMSwtMSwtMSwtMSwtMSwtMSwtMSw3LC0xLC0xLDQ2LG1hZ2UsMCw0LDYsMTQzLDEwLDE0NSwxMCwxNDksMTAsMTUyLDEwLDE1NSwxLDE1NiwxLDE1OSwxMCwxNjQsMTAsNzcsMTAsODEsMTAsODMsNSw4NywxLDg5LDEwLDEwOSwxMCwxMTYsMTAsMTIwLDUsMTIzLDE="
				>Build Example (Debug)</router-link
			>
			| <router-link to="/reapers">Reapers</router-link> |
			<router-link to="/legendaries">Legendaries</router-link>
		</div>
	</div>
	<router-view :key="$route.fullPath" />
</template>

<script>
export default {};
</script>

<style>
body {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	min-height: 100%;
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

button {
	border: 0;
	height: 52px;
	line-height: 52px;
	border-image-slice: 26 32 26 32;
	border-image-width: 26px 32px 26px 32px;
	border-image-outset: 0px 0px 0px 0px;
	border-image-repeat: stretch stretch;
	border-image-source: url("./assets/data/sprites/spr_menu_grey_button/spr_menu_grey_button_0.png");
	font-size: 1.4rem;
	color: #bbb;
	padding: 0 36px;
	text-align: center;
}

button:hover {
	color: #fff;
	border-image-source: url("./assets/data/sprites/spr_menu_grey_button/spr_menu_grey_button_1.png");
}

button:active {
	position: relative;
	top: 2px;
}

button.large {
	height: 60px;
	padding: 0 50px;
	border-image-slice: 30 32 30 32;
	border-image-width: 30px 32px 30px 32px;
	border-image-source: url("./assets/data/sprites/spr_menu_large_grey_button/spr_menu_large_grey_button_0.png");
}

button.large {
	border-image-source: url("./assets/data/sprites/spr_menu_large_grey_button/spr_menu_large_grey_button_0.png");
}

button.large:hover {
	border-image-source: url("./assets/data/sprites/spr_menu_large_grey_button/spr_menu_large_grey_button_1.png");
}

button.large.blue {
	border-image-source: url("./assets/data/sprites/spr_menu_large_blue_button/spr_menu_large_blue_button_0.png");
}

button.large.blue:hover {
	border-image-source: url("./assets/data/sprites/spr_menu_large_blue_button/spr_menu_large_blue_button_1.png");
}

.clickable {
	cursor: pointer;
}
</style>

<style scoped>
.header {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	align-items: center;
	margin: 0;
	padding: 0 6rem;
	background-color: #222;
}

.header h1 {
	background-image: url("./assets/data/sprites/spr_enemy_breach_seal_1/spr_enemy_breach_seal_1_4.png");
	background-position: 0 50%;
	background-repeat: no-repeat;
	padding: 0.75rem 5rem;
	margin: 0;
	-webkit-text-stroke: 2px #222;
	color: white;
	font-weight: 600;
	font-size: 2.5rem;
	font-family: "Courier New";
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