module.exports = {
	publicPath: "/SlormBuilder/",
	configureWebpack: {
		optimization: {
			splitChunks: {
				chunks: "all",
			},
		},
	},
};
