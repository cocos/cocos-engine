'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');
const git = require('./git');

const externalJSON = JSON.parse(readFileSync(join(__dirname, '../external-config.json')));
const tag = externalJSON.version;

git.updateExternal('git@github.com:cocos-creator/cocos2d-x-lite-external.git', tag);