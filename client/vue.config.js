module.exports = {
	chainWebpack: (config) => {
		config.module
			.rule("images")
			.use("url-loader")
			.loader("url-loader")
			.tap((options) => {
				if(!options) options = {};
				options.limit = 512;
				return options;
			});
	},
	configureWebpack: {
		optimization: {
			splitChunks: {
				chunks: "all",
			},
		},
		module: {
			rules: [
				{
					test: /\.(jpg|png|gif|svg)$/,
					loader: "image-webpack-loader",
					// Specify enforce: 'pre' to apply the loader
					// before url-loader/svg-url-loader
					// and not duplicate it in rules with them
					enforce: "pre",
				},
			],
		},
	},
};
