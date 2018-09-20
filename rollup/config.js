'use strict';

const fsJetpack = require('fs-jetpack');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');

let dest = './bin';
let file = 'cocos-3d.dev';
let moduleName = 'cocos3d';

// clear directory
fsJetpack.dir(dest, { empty: true });

module.exports = {
  input: './index.js',
  output: [
    {
      file: `${dest}/${file}.js`,
      format: 'iife',
      name: moduleName,
      sourcemap: false,
    },
  ],
  plugins: [
    resolve({
      jsnext: true,
      main: true,
    }),
    json({
      // for tree-shaking, properties will be declared as
      // variables, using either `var` or `const`
      preferConst: true, // Default: false
      // ignores indent and generates the smallest code
      compact: true, // Default: false
    }),
    babel({
      plugins: [
        "transform-decorators-legacy",
        "transform-class-properties"
      ],
      exclude: 'node_modules/**'
    }),
    commonjs()
  ],
};
