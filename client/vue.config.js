module.exports = {
	chainWebpack: (config) => {
		config.module
			.rule("images")
			.use("url-loader")
			.loader("url-loader")
			.tap((options) => {
				options.limit = 1024;
				return options;
			});
	},
	configureWebpack: {
		optimization: {
			splitChunks: {
				chunks: "all",
			},
		},
	},
};
