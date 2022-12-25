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

import { Material, Texture2D } from '../asset/assets';
import { Filter, WrapMode } from '../asset/assets/asset-enum';
import spine from './lib/spine-core.js';

/**
 * @en
 * The texture of spine.
 * @zh
 * 骨骼贴图。
 * @class SkeletonTexture
 */
export class SkeletonTexture extends spine.Texture {
    name = 'sp.SkeletonTexture';
    _texture: Texture2D | null = null;
    /**
     * @internal
     * @deprecated since v3.7.0, this will be removed in the future.
     */
    _material: Material | null = null;

    constructor (opt: ImageBitmap|HTMLImageElement) {
        super(opt);
        // TODO
    }

    /**
     * @en Sets Texture2D resource.
     * @zh 设置Texture2D资源。
     * @param tex @en Texture2D asset @zh Texture2D资源
     */
    setRealTexture (tex: Texture2D) {
        this._texture = tex;
    }

    /**
     * @en Gets Texture2D resource.
     * @zh 获取Texture2D资源。
     */
    getRealTexture (): Texture2D|null {
        return this._texture;
    }

    /**
     * @en Sets the filtering options for the texture. Filtering options control how the
     * texture is sampled when it is drawn to the screen at different scales or angles
     * @zh 用于设置纹理的过滤选项, 过滤选项控制纹理在不同比例或角度绘制到屏幕时的采样方式。
     */
    setFilters (minFilter: spine.TextureFilter, magFilter: spine.TextureFilter) {
        if (this._texture) {
            this.getRealTexture()!.setFilters(convertFilter(minFilter), convertFilter(magFilter));
        }
    }

    /**
     * @en Sets the wrap mode for a texture resource. The wrap mode determines how the texture
     * is repeated or stretched when it is applied to a surface that is larger than the texture itself.
     * @zh 设置纹理资源的包装模式的函数。包装模式确定当纹理应用于大于纹理本身的表面时，纹理如何重复或拉伸。
     */
    setWraps (uWrap: spine.TextureWrap, vWrap: spine.TextureWrap) {
        if (this._texture) {
            this.getRealTexture()!.setWrapMode(convertWraps(uWrap), convertWraps(vWrap));
        }
    }

    /**
    * @internal
    */
    dispose () { }
}

/**
 * @internal since v3.7.0, this is an engine private function.
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
 * @internal since v3.7.0, this is an engine private function.
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
