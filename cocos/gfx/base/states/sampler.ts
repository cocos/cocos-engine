/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { GFXObject, ObjectType, SamplerInfo } from '../define';

/**
 * @en GFX sampler.
 * @zh GFX 采样器。
 */
export class Sampler extends GFXObject {
    get info (): Readonly<SamplerInfo> { return this._info; }
    get hash (): number { return this._hash; }

    protected _info: SamplerInfo = new SamplerInfo();
    protected _hash = 0;

    constructor (info: Readonly<SamplerInfo>, hash: number) {
        super(ObjectType.SAMPLER);
        this._info.copy(info);
        this._hash = hash;
    }

    static computeHash (info: Readonly<SamplerInfo>) {
        let hash = info.minFilter;
        hash |= (info.magFilter << 2);
        hash |= (info.mipFilter << 4);
        hash |= (info.addressU << 6);
        hash |= (info.addressV << 8);
        hash |= (info.addressW << 10);
        hash |= (info.maxAnisotropy << 12);
        hash |= (info.cmpFunc << 16);
        return hash;
    }

    static unpackFromHash (hash: number) {
        const info = new SamplerInfo();
        info.minFilter = (hash & ((1 << 2) - 1)) >> 0;
        info.magFilter = (hash & ((1 << 2) - 1)) >> 2;
        info.mipFilter = (hash & ((1 << 2) - 1)) >> 4;
        info.addressU = (hash & ((1 << 2) - 1)) >> 6;
        info.addressV = (hash & ((1 << 2) - 1)) >> 8;
        info.addressW = (hash & ((1 << 2) - 1)) >> 10;
        info.maxAnisotropy = (hash & ((1 << 4) - 1)) >> 12;
        info.cmpFunc = (hash & ((1 << 3) - 1)) >> 16;
        return info;
    }
}
