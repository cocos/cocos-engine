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

/**
 * @packageDocumentation
 * @module gfx
 */

import { GFXObject, ObjectType, SamplerInfo } from '../define';

/**
 * @en GFX sampler.
 * @zh GFX 采样器。
 */
export abstract class Sampler extends GFXObject {
    get info (): Readonly<SamplerInfo> { return this._info; }

    protected _info: SamplerInfo = new SamplerInfo();

    constructor (info: SamplerInfo) {
        super(ObjectType.SAMPLER);
        this._info.copy(info);
    }

    static computeHash (info: SamplerInfo) {
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
}
