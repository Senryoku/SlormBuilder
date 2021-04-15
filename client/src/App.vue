<template>
	<div class="header">
		<img
			:src="require('./assets/data/sprites/spr_game_logo/spr_game_logo_0.png')"
			height="100"
		/>
		<h1>SlormBuilder</h1>
		<div id="nav">
			<router-link to="/">Builder</router-link> |
			<router-link
				to="/build/MSw3LDAsMTUsMCwzLDAsNiwxLGh1bnRyZXNzLDEsNCw2LDE1OSwxMCwxNjEsMSwxNjYsMSwxNjksMSwxNzMsMSwxNzUsMywxNzgsMiwxODEsNiw3NSwyLDc4LDMsODMsMiw4NCwyLDg4LDEsMTAzLDEsMTA4LDEsMTEyLDIsMTE0LDEsMTE2LDM="
				>Build Example</router-link
			>
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

	margin-bottom: 5rem;
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
</style>

<style scoped>
.header {
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: center;
	margin: 0;
	padding: 0 6rem;
	justify-content: space-between;
	justify-items: center;
	background-color: #222;
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