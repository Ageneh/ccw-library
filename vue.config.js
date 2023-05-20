const { defineConfig } = require('@vue/cli-service');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

const manifestJson = {
	name: 'Chapel Library',
	'short-name': 'CCW Library',
	background_color: '#ebebeb',
	description: 'Willkomen in der CCW Library.',
	shortcuts: [
		{
			'name': 'Bücher',
			'url': '/books',
			'description': 'Heutiger Vers.'
		},
		{
			'name': 'Info',
			'url': '/about'
		}
	],
	theme_color: '#ebebeb',
	start_url: '/',
	scope: '/',
	display: 'standalone'
	// display: "minimal-ui",
};

const isDev = process.env.NODE_ENV === 'development';
const isAnalyze = false;

process.env.VUE_APP_VERSION = require('./package.json').version;

const devPlugins = [
	isAnalyze
		? new BundleAnalyzerPlugin({
			analyzerPort: 7777,
			openAnalyzer: process.env?.DEV_ANALYZE,
			logLevel: 'error'
		})
		: undefined
]
	.filter(i => !!i);

const pwa = {
	name: manifestJson.name,
	display: manifestJson.display,
	themeColor: manifestJson.theme_color,
	msTileColor: '#ebebeb',
	appleMobileWbeAppCapable: 'yes',
	appleMobileWebAppStatusBarStyle: '#ebebeb',
	workboxOptions: {
		exclude: [/_redirect/, /\.map$/, /_headers/],
		clientsClaim: true
	},
	manifestOptions: manifestJson
	// iconPaths: { TODO
	//   faviconSVG: "favicon.svg",
	//   favicon32: "img/icons/favicon-32x32.png",
	//   favicon16: "img/icons/favicon-16x16.png",
	//   appleTouchIcon: "img/icons/apple-touch-icon-180x180.png",
	//   maskIcon: "img/icons/safari-pinned-tab.svg",
	//   msTileImage: "img/icons/mstile-150x150.png",
	// },
};

module.exports = defineConfig({
	transpileDependencies: true,
	configureWebpack: {
		plugins: [
			...isDev ? devPlugins : []
		],
		output:
			process.env.NODE_ENV === 'development'
				? {}
				: {
					filename: 'js/[name].[chunkhash:8].bundle.js',
					chunkFilename: 'js/[name].[chunkhash:8].bundle.js'
				}
	}
	// pwa,
	// devServer: {
	//   proxy: "http://localhost:8888",
	// },
	// crossorigin: "anonymous",
	// pluginOptions: {},
});
