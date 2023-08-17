/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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
*/

import { EDITOR } from 'internal:constants';
import { legacyCC } from '../../global-exports';

/**
 *
 */
let requiringFrames: any = [];  // the requiring frame infos

export function push (module, uuid: string, script, importMeta?): void {
    if (script === undefined) {
        script = uuid;
        uuid = '';
    }
    requiringFrames.push({
        uuid,
        script,
        module,
        exports: module.exports,    // original exports
        beh: null,
        importMeta,
    });
}

export function pop (): void {
    const frameInfo = requiringFrames.pop();
    // check exports
    const module = frameInfo.module;
    let exports = module.exports;
    if (exports === frameInfo.exports) {
        for (const anykey in exports) {
            // exported
            return;
        }
        // auto export component
        module.exports = exports = frameInfo.cls;
    }
}

export function peek (): any {
    return requiringFrames[requiringFrames.length - 1];
}

legacyCC._RF = {
    push,
    pop,
    peek,
};

if (EDITOR) {
    legacyCC._RF.reset = (): void => {
        requiringFrames = [];
    };
}
