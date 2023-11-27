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
import { cclegacy } from '@base/global';

interface IRequiringFrame {
    uuid: string,
    script: string,
    module: { exports: AnyFunction },
    exports: this['module']['exports'],
    beh: unknown,
    importMeta?: Record<string, unknown>,
    cls?: AnyFunction,
}

let requiringFrames: IRequiringFrame[] = [];  // the requiring frame infos

export function push (module: IRequiringFrame['module'], uuid: IRequiringFrame['uuid'], scriptName: IRequiringFrame['script'], importMeta?: IRequiringFrame['importMeta']): void {
    if (scriptName === undefined) {
        scriptName = uuid;
        uuid = '';
    }
    requiringFrames.push({
        uuid,
        script: scriptName,
        module,
        exports: module.exports,    // original exports
        beh: null,
        importMeta,
    });
}

export function pop (): void {
    const frameInfo = requiringFrames.pop()!;
    // check exports
    const module = frameInfo.module;
    let exports = module.exports;
    if (exports === frameInfo.exports) {
        // eslint-disable-next-line no-unreachable-loop
        for (const anykey in exports) {
            // exported
            return;
        }
        // auto export component
        module.exports = exports = frameInfo.cls!;
    }
}

export function peek (): IRequiringFrame {
    return requiringFrames[requiringFrames.length - 1];
}

cclegacy._RF = {
    push,
    pop,
    peek,
};

if (EDITOR) {
    cclegacy._RF.reset = (): void => {
        requiringFrames = [];
    };
}
