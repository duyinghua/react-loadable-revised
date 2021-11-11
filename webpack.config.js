const path = require('path')
const {ReactLoadablePlugin} = require('./webpack')
const nodeExternals = require('webpack-node-externals')
const {writeFile} = require('fs/promises')

const client = {
	entry: {
		main: './example/client',
	},
	output: {
		path: path.join(__dirname, 'example', 'dist', 'client'),
		filename: '[name].js',
		chunkFilename: '[name].js',
		publicPath: '/dist/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						babelrc: false,
						presets: [
							['@babel/preset-env', { modules: false }],
							'@babel/preset-react',
						],
						plugins: [
							'syntax-dynamic-import',
							'@babel/plugin-proposal-class-properties',
							'@babel/plugin-transform-object-assign',
							[require.resolve('./babel'), {absPath: true}],
						],
					}
				},
			},
		],
	},
	devtool: 'source-map',
	resolve: {
		alias: {
			'@react-loadable/revised': __dirname,
		},
	},
	plugins: [
		new ReactLoadablePlugin({
			async callback(manifest) {
				await writeFile(path.join(__dirname, 'example', 'dist/manifest.json'), JSON.stringify(manifest, null, 2))
			},
			absPath: true,
		}),
	],
	optimization: {
		runtimeChunk: 'single',
		splitChunks: { // force all chunk split
			chunks: 'all',
			cacheGroups: {
				vendors: {
					test: /\/node_modules\//
				},
			}
		}
	}
}
const server = {
	entry: {
		main: './example/server',
	},
	target: 'node',
	externals: [nodeExternals()],
	node: {__dirname: true},
	output: {
		path: path.join(__dirname, 'example', 'dist/server'),
		filename: '[name].js',
		chunkFilename: '[name].js',
		publicPath: '/dist/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						babelrc: false,
						presets: [
							['@babel/preset-env', { modules: false }],
							'@babel/preset-react',
						],
						plugins: [
							'syntax-dynamic-import',
							'@babel/plugin-proposal-class-properties',
							'@babel/plugin-transform-object-assign',
							[require.resolve('./babel'), {absPath: true}],
						],
					}
				},
			},
		],
	},
	devtool: 'inline-source-map',
	resolve: {
		alias: {
			'@react-loadable/revised': __dirname,
			'@react-loadable/revised/webpack': path.resolve(__dirname, 'webpack'),
		},
	},
}
module.exports = [client, server]
