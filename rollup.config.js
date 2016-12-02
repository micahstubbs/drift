import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'; 

export default {
  entry: 'src/index.js',
  format: 'umd',
  globals: {},
  moduleName: 'flow',
  plugins: [
    nodeResolve({ jsnext: true, main: true }),
    json(),
    babel(),
    commonjs()
  ],
  external: [],
  dest: 'build/flow.js',
  acorn: {
    allowReserved: true
  }
};