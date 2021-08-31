const fs = require('fs');
const fsJetpack = require('fs-jetpack');

const ignoreList = [
    'cocos/renderer/gfx-vulkan/volk.h',
    'cocos/renderer/gfx-vulkan/volk.c',
    'cocos/renderer/gfx-vulkan/thsvs_simpler_vulkan_synchronization.h',
    'cocos/renderer/gfx-vulkan/vk_mem_alloc.h',
    'cocos/network/Uri.h',
    'cocos/network/Uri.cpp',
    'cocos/platform/win32/inet_pton_mingw.h',
    'cocos/platform/win32/inet_pton_mingw.cpp',
    // directories
    'cocos/editor-support/dragonbones',
    'cocos/editor-support/spine',
    'cocos/audio/android/',
    'cocos/math/',
    'cocos/renderer/pipeline/deferred/',
    'cocos/bindings/jswrapper/v8/debugger/',
];

const genHeader = (history) => {
    let output = `/****************************************************************************\n`;

    for (const info of history) {
        const period = info.period[1] ? `${info.period[0]}-${info.period[1]}` : info.period[0];
        output += ` Copyright (c) ${period} ${info.owner}\n`;
    }

    output += `
 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/\n\n`;

    return output;
};


const headerRE = /\/\*{5,}.*?\*{5,}\/\s*/s;
const ownerRE = /^\s*Copyright\s*\(c\)\s*([0-9]+)(?:-([0-9]+))?\s*(.*)/gm;
const curYear = new Date().getFullYear();
const companyName = 'Xiamen Yaji Software Co., Ltd.';
const update = (path) => {
    const cmpPath = path.replace(/\\/g, '/');
    if (ignoreList.some((p) => cmpPath.includes(p))) { return; }

    let content = fs.readFileSync(path, { encoding: 'utf8' });
    const history = [];

    let hasLicense = false;
    const headerCap = content.match(headerRE);
    if (headerCap) {
        content = content.slice(headerCap.index + headerCap[0].length);
        // extract
        let ownerCap = ownerRE.exec(headerCap[0]);
        while (ownerCap) {
            history.push({ period: [ownerCap[1], ownerCap[2]], owner: ownerCap[3] });
            ownerCap = ownerRE.exec(headerCap[0]);
        }
        if (history.length) {
            // update
            hasLicense = true;
            let ownerUpToDate = false;
            for (const info of history) {
                if (info.owner === companyName) {
                    if (Number.parseInt(info.period[0]) !== curYear) {
                        info.period[1] = curYear;
                    }
                    ownerUpToDate = true;
                }
            }
            if (!ownerUpToDate) {
                const lastValidYear = history[history.length - 1].period[1];
                history.push({ period: [lastValidYear, curYear], owner: companyName });
            }
        }
    }

    // caveat: we don't actually know when exactly these files are created
    // so the beginning year may not be accurate
    // can be overriden manually anytime
    if (!hasLicense) {
        history.push({ period: [curYear], owner: companyName });
    }

    fs.writeFileSync(path, genHeader(history) + content.replace(/\r\n/g, '\n'));
};

const files = fsJetpack.find(`${__dirname}/../../cocos`, { matching: ['**/*.h', '**/*.cpp', '**/*.mm'] });
for (const path of files) { update(path); }
