<template>
	<div class="header" v-if="!$route.meta.singleComponent">
		<div class="header-left">
			<router-link to="/"
				><img
					alt="The Slormancer Logo"
					src="@/assets/extracted/sprites/spr_game_logo/spr_game_logo_0.png"
					height="100"
			/></router-link>
			<div>
				<a @click="changeLanguage('FR')">FR</a> |
				<a @click="changeLanguage('EN')">EN</a> |
				<a @click="changeLanguage('CH')">CH</a> |
				<a @click="changeLanguage('TW')">TW</a>
			</div>
		</div>
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
			<router-link to="/reapers">Reapers</router-link> |
			<router-link to="/legendaries">{{ t("Legendaries") }}</router-link>
			|
			<router-link to="/stats">{{ t("Stats") }}</router-link>
			<span style="margin-left: 1rem; text-align: right">
				{{ t("Made by") }}
				<a href="https://senryoku.github.io/">Senryoku</a>
			</span>
			<form
				action="https://www.paypal.com/donate"
				method="post"
				target="_top"
				style="
					display: inline-block;
					vertical-align: text-top;
					margin-left: 0.5em;
					line-height: initial;
				"
			>
				<input
					type="hidden"
					name="hosted_button_id"
					value="4WQRX5MFZG6HJ"
				/>
				<input
					type="image"
					src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif"
					border="0"
					name="submit"
					title="PayPal - The safer, easier way to pay online!"
					alt="Donate with PayPal button"
				/>
				<img
					alt=""
					border="0"
					src="https://www.paypal.com/en_FR/i/scr/pixel.gif"
					width="1"
					height="1"
				/>
			</form>
		</div>
	</div>
	<router-view :key="$route.fullPath" />
</template>

<script setup>
	import { onMounted } from "vue";

	onMounted(() => {
		try {
			let settings = localStorage.getItem("settings") ?? "{}";
			let json = JSON.parse(settings);
			for (const [k, v] of Object.entries(json)) this.settings[k] = v;
		} catch (e) {
			console.error("Error getting local settings: ", e);
		}
	});

	function changeLanguage(val) {
		this.settings.language = val;
		this.saveSettings();
	}

	function saveSettings() {
		localStorage.setItem("settings", JSON.stringify(this.settings));
	}
</script>

<style>
	@font-face {
		font-family: "Slorm";
		src: url("./assets/Berlin Sans FB Regular.ttf");
	}

	body {
		font-family: "Slorm", Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

		--color-magic: rgb(46, 135, 38);
		--color-rare: rgb(23, 106, 177);
		--color-epic: rgb(219, 164, 21);
		--color-legendary: rgb(206, 70, 7);
		--color-ancestral: rgb(203, 33, 246);
		--color-reaper: rgb(15, 109, 105);

		min-height: 100%;
	}

	#app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
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
		border-image-source: url("./assets/extracted/sprites/spr_wrath_decoration/spr_wrath_decoration_0.png");
	}

	button {
		font-family: "Slorm";
		height: 52px;
		line-height: 52px;
		border-style: solid;
		border-image-slice: 26 32 26 32;
		border-image-width: 26px 32px 26px 32px;
		border-image-outset: 0px 0px 0px 0px;
		border-image-repeat: stretch stretch;
		border-image-source: url("./assets/extracted/sprites/spr_menu_grey_button/spr_menu_grey_button_0.png");
		font-size: 1.4rem;
		color: #bbb;
		padding: 0 36px;
		text-align: center;
		cursor: pointer;
	}

	button:hover {
		color: #fff;
		border-image-source: url("./assets/extracted/sprites/spr_menu_grey_button/spr_menu_grey_button_1.png");
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
		border-image-source: url("./assets/extracted/sprites/spr_menu_large_grey_button/spr_menu_large_grey_button_0.png");
	}

	button.large {
		border-image-source: url("./assets/extracted/sprites/spr_menu_large_grey_button/spr_menu_large_grey_button_0.png");
	}

	button.large:hover {
		border-image-source: url("./assets/extracted/sprites/spr_menu_large_grey_button/spr_menu_large_grey_button_1.png");
	}

	button.large.blue {
		border-image-source: url("./assets/extracted/sprites/spr_menu_large_blue_button/spr_menu_large_blue_button_0.png");
	}

	button.large.blue:hover {
		border-image-source: url("./assets/extracted/sprites/spr_menu_large_blue_button/spr_menu_large_blue_button_1.png");
	}

	select {
		font-family: "Slorm", Avenir, Helvetica, Arial, sans-serif;
		padding: 0.5em;
		background: #444;
		color: white;
		border: 1px solid #444;
		border-radius: 0.5em;
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
		height: 70px;
		line-height: 70px;
	}

	.header-left {
		display: flex;
		height: 70px;
	}

	.header h1 {
		background-image: url("./assets/extracted/sprites/spr_enemy_breach_seal_1/spr_enemy_breach_seal_1_4.png");
		background-position: 0 50%;
		background-repeat: no-repeat;
		padding: 0 5rem;
		height: 100%;
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
		text-decoration: underline;
		text-decoration-color: #777;
		cursor: pointer;
	}

	a:hover {
		color: #eee;
		text-decoration-color: #eee;
	}

	a:active {
		color: #fff;
	}
</style>
