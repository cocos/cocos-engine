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

/**
 * Define gfx global classes here.
 */

export class Rect {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public x: number = 0,
        public y: number = 0,
        public width: number = 1,
        public height: number = 1,
    ) {}
}

export class Viewport {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public left: number = 0,
        public top: number = 0,
        public width: number = 0,
        public height: number = 0,
        public minDepth: number = 0,
        public maxDepth: number = 1,
    ) {}
}

export class Color {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
        public w: number = 0,
    ) {}
}

export class Offset {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
    ) {}
}

export class Extent {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public width: number = 0,
        public height: number = 0,
        public depth: number = 1,
    ) {}
}

export class TextureSubres {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public mipLevel: number = 0,
        public baseArrayLayer: number = 0,
        public layerCount: number = 1,
    ) {}
}

export class TextureCopy {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public srcSubres = new TextureSubres(),
        public srcOffset = new Offset(),
        public dstSubres = new TextureSubres(),
        public dstOffset = new Offset(),
        public extent = new Extent(),
    ) {}
}

export class BufferTextureCopy {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public buffStride: number = 0,
        public buffTexHeight: number = 0,
        public texOffset = new Offset(),
        public texExtent = new Extent(),
        public texSubres = new TextureSubres(),
    ) {}
}
