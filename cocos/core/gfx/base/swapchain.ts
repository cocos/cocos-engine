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

import { GFXObject, ObjectType, SurfaceTransform, SwapchainInfo } from './define';
import { Texture } from './texture';

/**
 * @en GFX Swapchain.
 * @zh GFX 交换链。
 */
export abstract class Swapchain extends GFXObject {
    /**
     * @en The color texture of this swapchain.
     * @zh 当前交换链的颜色缓冲。
     */
    get colorTexture () {
        return this._colorTexture;
    }

    /**
     * @en The depth stencil texture of this swapchain.
     * @zh 当前交换链的深度模板缓冲。
     */
    get depthStencilTexture () {
        return this._depthStencilTexture;
    }

    /**
     * @en The surface transform to be applied in projection matrices.
     * @zh 需要在投影矩阵中应用的表面变换。
     */
    get surfaceTransform () {
        return this._transform;
    }

    get width () {
        return this._colorTexture.width;
    }

    get height () {
        return this._colorTexture.height;
    }

    protected _transform = SurfaceTransform.IDENTITY;
    protected _colorTexture: Texture = null!;
    protected _depthStencilTexture: Texture = null!;

    constructor () {
        super(ObjectType.SWAPCHAIN);
    }

    public abstract initialize (info: SwapchainInfo): boolean;
    public abstract resize (width: number, height: number): void;
    public abstract destroy (): void;
}
