import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import alias from 'rollup-plugin-alias';
import includePaths from 'rollup-plugin-includepaths';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const dedupe = importee => importee === 'svelte' || importee.startsWith('svelte/');
const preprocess = sveltePreprocess({
    transformers: {
        scss: { sourceMap: false },
        postcss: { plugins: [ autoprefixer ] }
    }
});

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			includePaths({ paths: ["src"], extensions: [".svelte"] }),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				dev,
				hydratable: true,
				emitCss: true,
				preprocess
			}),
			resolve({
				browser: true,
				dedupe
			}),
			commonjs(),

			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				runtimeHelpers: true,
				exclude: ['node_modules/@babel/**'],
				presets: [['@babel/preset-env']],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true,
                numWorkers: 1
			})
		],
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				generate: 'ssr',
				dev,
                preprocess
			}),
			resolve({
				dedupe
			}),
			commonjs(),
			includePaths({ paths: ["src"], extensions: [".svelte"] }),
		],
		external: Object.keys(pkg.dependencies).concat(
			require('module').builtinModules || Object.keys(process.binding('natives'))
		),
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			includePaths({ paths: ["src"], extensions: [".svelte"] }),
			commonjs(),
			!dev && terser({numWorkers: 1})
		]
	}
};
