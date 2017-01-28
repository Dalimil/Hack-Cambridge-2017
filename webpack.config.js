const path = require('path');

module.exports = {
	entry: ['./web/src/client/scripts/main.js'],
	output: {
		path: path.resolve(__dirname, './web/src/client/public/build'), // absolute path
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			// Webpack should run sources through Babel when it bundles them
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					presets: ["latest"]
				}
			},
			// CSS modules
			{
				test: /\.css$/,
				loader: "style-loader!css-loader"
			}
		]
	}
}
