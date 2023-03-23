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

import { Material, Texture2D } from '../asset/assets';
import { Filter, WrapMode } from '../asset/assets/asset-enum';
import spine from './lib/spine-core.js';

/**
 * @en The texture of spine.
 * @zh 骨骼贴图。
 * @class SkeletonTexture
 */
export class SkeletonTexture extends spine.Texture {
    /**
     * @deprecated Since v3.7.2, this property will be removed in the future.
     */
    name = 'sp.SkeletonTexture';
    /**
     * @en Use a Texture2D type object to Store and rendering spine.Texture data.
     * @zh cocos 中使用 Texture2D 存储和渲染 spine.Texture 的数据。
     */
    _texture: Texture2D | null = null;
    /**
     * @internal
     * @deprecated Since v3.7.2, this will be removed in the future.
     */
    _material: Material | null = null;

    constructor (opt: ImageBitmap|HTMLImageElement) {
        super(opt);
        // TODO
    }

    /**
     * @en Sets Texture2D resource.
     * @zh 设置 Texture2D 资源。
     * @param tex @en Texture2D asset. @zh Texture2D 资源。
     */
    setRealTexture (tex: Texture2D) {
        this._texture = tex;
    }

    /**
     * @en Gets Texture2D resource.
     * @zh 获取 Texture2D 资源。
     */
    getRealTexture (): Texture2D|null {
        return this._texture;
    }

    /**
     * @en Sets the texture's filter mode.
     * @zh 设置此贴图的过滤算法。
     * @param minFilter @en Filter mode for scale down.
     *                  @zh 控制向下采样方式。
     * @param magFilter @en Filter mode for scale up.
     *                  @zh 控制向上采样方式。
     */
    setFilters (minFilter: spine.TextureFilter, magFilter: spine.TextureFilter) {
        if (this._texture) {
            this.getRealTexture()!.setFilters(convertFilter(minFilter), convertFilter(magFilter));
        }
    }

    /**
     * @en Sets the wrap mode of the texture.
     * @zh 设置此贴图的缠绕模式。
     * @param uWrap U coordinate wrap mode.
     * @param vWrap V coordinate wrap mode.
     */
    setWraps (uWrap: spine.TextureWrap, vWrap: spine.TextureWrap) {
        if (this._texture) {
            this.getRealTexture()!.setWrapMode(convertWraps(uWrap), convertWraps(vWrap));
        }
    }
    /**
     * @en Just for adapter interface.
     * @zh 空函数为了适配接口。
     */
    dispose () { }
}

/**
 * @internal Since v3.7.2, this is an engine private function.
 */
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

/**
 * @internal Since v3.7.2, this is an engine private function.
 */
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
