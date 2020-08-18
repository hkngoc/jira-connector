import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';
import serve from 'rollup-plugin-serve';

const ENV = process.env.NODE_ENV || 'development';
const PORT = 4000;

const config = [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'JiraClient',
      file: pkg.browser,
      format: 'umd',
    },
    // reference dependencies
    external: [
    ],
    plugins: [
      resolve(), // so Rollup can find dependencies
      commonjs(), // so Rollup can convert dependencies to an ES module
      babel({
        exclude: ['node_modules/**']
      })
    ]
  },
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    external: [
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      })
    ]
  }
];

if (ENV == "dev-server") {
  config[0].plugins.push(serve({
    host: 'localhost',
    port: PORT,
    contentBase: 'dist',
  }));
}

if (ENV == "production") {
  for (let item of config) {
    item.plugins.push(terser());
  }
}

export default config;
