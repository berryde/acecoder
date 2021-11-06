import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

const onwarn = ({ message }) => message.includes('@rollup/plugin-typescript TS2315');

export default [
	{
		input: 'src/utils/compiler/rollup.ts',
		output: {
			sourcemap: true,
			format: 'esm',
			name: 'app',
			file: 'static/worker.js'
		},
		plugins: [
			typescript(),
			commonjs(),
			resolve({
				browser: true
			})
		],
		watch: {
			clearScreen: false
		},
		onwarn
	}
];
