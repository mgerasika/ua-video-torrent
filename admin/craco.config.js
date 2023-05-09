/* eslint-disable no-console */
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
// eslint-disable-next-line no-undef
const path = require('path');
const { CracoAliasPlugin, configPaths } = require('react-app-rewire-alias');
const aliasMap = configPaths('./tsconfig.paths.json');

console.log("env", process.env.NODE_ENV);

module.exports = {
	babel: {
		presets: [['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }]],
		plugins: [
			'babel-plugin-twin',
			'babel-plugin-macros',
			[
				'@emotion/babel-plugin-jsx-pragmatic',
				{
					export: 'jsx',
					import: '__cssprop',
					module: '@emotion/react',
				},
			],
			[
				'@babel/plugin-transform-react-jsx',
				{
					pragma: '__cssprop',
					pragmaFrag: 'React.Fragment',
				},
			],
			[
				'@emotion',
				{
					// sourceMap is on by default but source maps are dead code eliminated in production
					sourceMap: true,
					autoLabel: 'dev-only',
					labelFormat: '----[filename]----[local]----',
					cssPropOptimization: true,
				},
			],

		],
	},

	webpack: {
		configure: (config) => {
			const scopePluginIndex = config.resolve.plugins.findIndex(
				({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin',
			);
			config.resolve.plugins.splice(scopePluginIndex, 1);
			config.resolve = {
				...config.resolve,

				alias: {
					'@src': path.resolve(__dirname, 'src/'),
				},
			};
			return config;
		},
	},
	plugins: [

		{
			plugin: CracoAliasPlugin,
			options: { alias: aliasMap },
		},
	],
};
