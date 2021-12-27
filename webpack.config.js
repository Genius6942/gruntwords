const path = require("path");
const webpack = require("webpack");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const express = require('express');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	mode: "development",
	watchOptions: {
	    aggregateTimeout: 300, // After seeing an edit, wait .3 seconds to recompile
	    poll: 100 // Check for edits every 5 seconds
	},
	plugins: [
	    new FriendlyErrorsWebpackPlugin(),
	    new webpack.ProgressPlugin(),
	    new HtmlWebpackPlugin({
		    template: path.resolve(process.cwd(), "dist", "index.html")
	    })

	],
	context: __dirname,
	entry: './src/main.js',
	output: {
	    path: path.resolve( __dirname, 'dist/' ),
	    filename: 'neanderthal.js',
	},
	devtool: 'source-map',
	devServer: {
		https: false,
		historyApiFallback: true,
		hot: true,
		host: "0.0.0.0",
		allowedHosts: [
			".repl.it",
			".repl.co",
			".repl.run",
			".fezzle.dev"
		],
		static: {
			directory: path.join(__dirname, '/src/static'),
			publicPath: '/static'
		},
	},
	module: {
	    rules: [
	        {
	            test: /\.(js|jsx)?$/,
	            use: 'babel-loader',
	        },
	        {
	            test: /\.css$/,
	            use: ['style-loader', 'css-loader'],
	        },
	        {
	            test: /\.(png|j?g|svg|gif)?$/,
	            use: 'file-loader'
	        }
		]
	},
}