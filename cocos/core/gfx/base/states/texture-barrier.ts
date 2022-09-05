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

import { murmurhash2_32_gc } from '../../../utils/murmurhash2_gc';
import { GFXObject, ObjectType, TextureBarrierInfo } from '../define';

/**
 * @en GFX texture barrier.
 * @zh GFX 贴图内存屏障。
 */
export class TextureBarrier extends GFXObject {
    get info (): Readonly<TextureBarrierInfo> { return this._info; }
    get hash (): number { return this._hash; }

    protected _info: TextureBarrierInfo = new TextureBarrierInfo();
    protected _hash = 0;

    constructor (info: Readonly<TextureBarrierInfo>, hash: number) {
        super(ObjectType.TEXTURE_BARRIER);
        this._info.copy(info);
        this._hash = hash;
    }

    static computeHash (info: Readonly<TextureBarrierInfo>) {
        let res = `${info.prevAccesses} ${info.nextAccesses}`;
        res += info.type;
        res += info.baseMipLevel;
        res += info.levelCount;
        res += info.baseSlice;
        res += info.sliceCount;
        res += info.discardContents;
        res += info.srcQueue ? info.srcQueue.type : 0;
        res += info.dstQueue ? info.dstQueue.type : 0;

        return murmurhash2_32_gc(res, 666);
    }
}
