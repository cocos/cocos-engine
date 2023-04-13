const fs = require('fs');
const path = require('path');


const pkgCfg = path.join(__dirname, '../../../package.json');

if (!fs.existsSync(pkgCfg)) {
    console.error(`Can not find package.json: ${pkgCfg}`);
    process.exit(1);
}

let pkgJson = {};
try {
    pkgJson = JSON.parse(fs.readFileSync(pkgCfg, 'utf8'));
} catch (err) {
    console.error(`Error parsing ${pkgCfg}`);
    console.error(err);
    process.exit(1);
}

if (!pkgJson.version) {
    console.error(`Can not find field 'version' in file ${pkgCfg}`);
    process.exit(1);
}

const version_regex = /(\d+)\.(\d+)(\.(\d+))?(-(\w+))?/;
const version_str = pkgJson.version;
const version_result = version_str.match(version_regex);

if (!version_result) {
    console.error(`Failed to parse version string: '${version_str}'`);
    process.exit(1);
}
const majorVersion = parseInt(version_result[1]);
const minorVersion = parseInt(version_result[2]);
const patchVersion = version_result[4] ? parseInt(version_result[4]) : 0;
const preRelease = version_result[6] ? version_result[6] : 'release';
const versionIntValue = majorVersion * 10000 + minorVersion * 100 + patchVersion;
const fullYear = (new Date).getFullYear();
const version_header = `/****************************************************************************
Copyright (c) ${fullYear <= 2022 ? "2022" : "2022-"+fullYear} Xiamen Yaji Software Co., Ltd.

http://www.cocos.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
#pragma once

#define COCOS_MAJOR_VERSION     ${majorVersion}
#define COCOS_MINJOR_VERSION    ${minorVersion}
#define COCOS_PATCH_VERSION     ${patchVersion}
#define COCOS_VERSION_STRING    "${majorVersion}.${minorVersion}.${patchVersion}"
#define COCOS_VERSION_DEFINED   1
#define COCOS_VERSION           ${versionIntValue}

// #define COCOS_PRE_RELEASE       "${preRelease}"
`;

const outputVersionFile = path.join(__dirname, '../../cocos/cocos-version.h');

if(!fs.existsSync(outputVersionFile) || !compareFileContent(outputVersionFile, version_header)) {
    console.log(`Update cocos-version.h to ${version_str}`);
    fs.writeFileSync(outputVersionFile, version_header);   
} else {
    console.log(`cocos-version.h is up to date`);
}

function compareFileContent(file, content) {
    const srcLines = fs.readFileSync(file, 'utf8').split('\n').map(x=>x.trim());
    const dstLines = content.split('\n').map(x => x.trim());
    if(srcLines.length !== dstLines.length) {
        return false;
    }
    for(let i = 0, l = srcLines.length; i < l; i++) {
        if(srcLines[i] != dstLines[i]) {
            return false;
        }
    }
    return true;
}
