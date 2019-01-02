'use strict';

const Path = require('path');
const resolve = require('rollup-plugin-node-resolve');
const rollup = require('rollup');

let src = Path.join(__dirname, './mappings/offline-mappings.js');
let dest = Path.join(__dirname, './mappings');
let name = 'index';
let sourcemap = false;
let globals = {};

console.log('rollup mappings...');

// see below for details on the options
const inputOptions = {
  input: src,
  plugins: [
    resolve({
      jsnext: false,
      main: false,
      root: process.cwd()
    }),
  ],
};
const outputOptions = {
  file: Path.join(dest, name+'.js'),
  format: 'cjs',
  name,
  globals,
  sourcemap,
};

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);

  // console.log(bundle.imports); // an array of external dependencies
  // console.log(bundle.exports); // an array of names exported by the entry point
  // console.log(bundle.modules); // an array of module objects

  // generate code and a sourcemap
  const { code, map } = await bundle.generate(outputOptions);

  // or write the bundle to disk
  await bundle.write(outputOptions);
}

build();
