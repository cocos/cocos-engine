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

import { Device } from './device';
import {
    Format,
    Obj,
    ObjectType,
    SampleCount,
    TextureFlagBit,
    TextureFlags,
    TextureType,
    TextureUsage,
    TextureUsageBit,
    TextureInfo,
    TextureViewInfo,
    ISwapchainTextureInfo,
} from './define';

/**
 * @en GFX texture.
 * @zh GFX 纹理。
 */
export abstract class Texture extends Obj {
    /**
     * @en Get texture type.
     * @zh 纹理类型。
     */
    get type (): TextureType {
        return this._type;
    }

    /**
     * @en Get texture usage.
     * @zh 纹理使用方式。
     */
    get usage (): TextureUsage {
        return this._usage;
    }

    /**
     * @en Get texture format.
     * @zh 纹理格式。
     */
    get format (): Format {
        return this._format;
    }

    /**
     * @en Get texture width.
     * @zh 纹理宽度。
     */
    get width (): number {
        return this._width;
    }

    /**
     * @en Get texture height.
     * @zh 纹理高度。
     */
    get height (): number {
        return this._height;
    }

    /**
     * @en Get texture depth.
     * @zh 纹理深度。
     */
    get depth (): number {
        return this._depth;
    }

    /**
     * @en Get texture array layer.
     * @zh 纹理数组层数。
     */
    get layerCount (): number {
        return this._layerCount;
    }

    /**
     * @en Get texture mip level.
     * @zh 纹理 mip 层级数。
     */
    get levelCount (): number {
        return this._levelCount;
    }

    /**
     * @en Get texture samples.
     * @zh 纹理采样数。
     */
    get samples (): SampleCount {
        return this._samples;
    }

    /**
     * @en Get texture flags.
     * @zh 纹理标识位。
     */
    get flags (): TextureFlags {
        return this._flags;
    }

    /**
     * @en Get texture size.
     * @zh 纹理大小。
     */
    get size (): number {
        return this._size;
    }

    protected _device: Device;

    protected _type: TextureType = TextureType.TEX2D;
    protected _usage: TextureUsage = TextureUsageBit.NONE;
    protected _format: Format = Format.UNKNOWN;
    protected _width = 0;
    protected _height = 0;
    protected _depth = 1;
    protected _layerCount = 1;
    protected _levelCount = 1;
    protected _samples: SampleCount = SampleCount.ONE;
    protected _flags: TextureFlags = TextureFlagBit.NONE;
    protected _isPowerOf2 = false;
    protected _size = 0;

    constructor (device: Device) {
        super(ObjectType.TEXTURE);
        this._device = device;
    }

    public abstract initialize (info: TextureInfo | TextureViewInfo): boolean;

    public abstract destroy (): void;

    /**
     * @en Resize texture.
     * @zh 重置纹理大小。
     * @param width The new width.
     * @param height The new height.
     */
    public abstract resize (width: number, height: number): void;

    protected abstract initAsSwapchainTexture (info: ISwapchainTextureInfo): boolean;
}
