'use strict';

const fsJetpack = require('fs-jetpack');
const pjson = require('../package.json');
const resolve = require('rollup-plugin-node-resolve');
const buble = require('rollup-plugin-buble');

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
      format: 'cjs',
      name: moduleName,
      sourcemap: false,
    },
  ],
  plugins: [
    resolve({
      jsnext: true,
      main: true,
    }),
    buble()
  ],
};