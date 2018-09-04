#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const path_ = require('path');
const shdcLib = require('./shdc-lib');

let argv = yargs
  .usage('shdc --chunks [path] --templates [path]')
  .options({
    chunks: {
      type: 'string',
      alias: 'c',
      desc: 'Provide the chunk path.',
      demandOption: true
    },
    templates: {
      type: 'string',
      alias: 't',
      desc: 'Provide the template path.',
      demandOption: true
    },
  })
  .help('help')
  .argv
  ;

let chunksCache = {};
let chunksFile = path_.join(argv.chunks, 'index.js');
console.log(`generate ${chunksFile}`);
shdcLib.buildChunks(chunksFile, argv.chunks, chunksCache);

let templateFile = path_.join(argv.templates, 'index.js');
console.log(`generate ${templateFile}`);
shdcLib.buildTemplates(templateFile, argv.templates, chunksCache);
