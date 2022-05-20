/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { PhysicsGroup } from './physics-enum';

export class CollisionMatrix {
    constructor (strategy?: number) {
        if (strategy === 1) {
            const self = (this as any);
            for (let i = 0; i < 32; i++) {
                const key = `_${1 << i}`;
                self[key] = 0;
                self.updateArray = [];
                Object.defineProperty(self, 1 << i, {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    get () { return this[key]; },
                    set (v) {
                        if (this[key] !== v) {
                            this[key] = v;
                            if (this.updateArray.indexOf(i) < 0) {
                                this.updateArray.push(i);
                            }
                        }
                    },
                });
            }
            // eslint-disable-next-line dot-notation
            this['_1'] = PhysicsGroup.DEFAULT;
        } else {
            for (let i = 0; i < 32; i++) {
                const key = 1 << i;
                this[`${key}`] = 0;
            }
            this['1'] = PhysicsGroup.DEFAULT;
        }
    }
}
