/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/

import { EDITOR } from 'internal:constants';
import { legacyCC } from '../../global-exports';

/**
 *
 */
let requiringFrames: any = [];  // the requiring frame infos

export function push (module, uuid: string, script, importMeta?) {
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

export function pop () {
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

export function peek () {
    return requiringFrames[requiringFrames.length - 1];
}

legacyCC._RF = {
    push,
    pop,
    peek,
};

if (EDITOR) {
    legacyCC._RF.reset = () => {
        requiringFrames = [];
    };
}
