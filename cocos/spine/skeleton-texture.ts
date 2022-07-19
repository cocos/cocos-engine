/*
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

import { Material, Texture2D } from '../core';
import { Filter, WrapMode } from '../core/assets/asset-enum';
import spine from './lib/spine-core.js';

export class SkeletonTexture extends spine.Texture {
    name = 'sp.SkeletonTexture';
    _texture: Texture2D | null = null;
    _material: Material | null = null;

    constructor (opt:ImageBitmap|HTMLImageElement) {
        super(opt);
        // TODO
    }

    setRealTexture (tex:Texture2D) {
        this._texture = tex;
    }

    getRealTexture (): Texture2D|null {
        return this._texture;
    }

    setFilters (minFilter: spine.TextureFilter, magFilter: spine.TextureFilter) {
        if (this._texture) {
            this.getRealTexture()!.setFilters(convertFilter(minFilter), convertFilter(magFilter));
        }
    }

    setWraps (uWrap: spine.TextureWrap, vWrap: spine.TextureWrap) {
        if (this._texture) {
            this.getRealTexture()!.setWrapMode(convertWraps(uWrap), convertWraps(vWrap));
        }
    }

    dispose () { }
}

export function convertFilter (filter: spine.TextureFilter): Filter {
    switch (filter) {
    case spine.TextureFilter.Nearest:
    case spine.TextureFilter.MipMapNearestNearest:
    case spine.TextureFilter.MipMapLinearNearest:
        return Filter.NEAREST;
    case spine.TextureFilter.MipMap:
    case spine.TextureFilter.MipMapNearestLinear:
    case spine.TextureFilter.MipMapLinearLinear:
    case spine.TextureFilter.Linear:
    default:
        return Filter.LINEAR;
    }
}

export function convertWraps (wrap: spine.TextureWrap): WrapMode {
    switch (wrap) {
    case spine.TextureWrap.MirroredRepeat:
        return WrapMode.MIRRORED_REPEAT;
    case spine.TextureWrap.ClampToEdge:
        return WrapMode.CLAMP_TO_EDGE;
    case spine.TextureWrap.Repeat:
    default:
        return WrapMode.REPEAT;
    }
}
