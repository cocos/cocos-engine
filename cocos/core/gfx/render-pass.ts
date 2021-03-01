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
import { murmurhash2_32_gc } from '../utils/murmurhash2_gc';
import {
    Format,
    LoadOp,
    Obj,
    ObjectType,
    PipelineBindPoint,
    StoreOp,
    TextureLayout,
} from './define';

/**
 * @en Color attachment.
 * @zh GFX 颜色附件。
 */
export class ColorAttachment {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public format: Format = Format.UNKNOWN,
        public sampleCount: number = 1,
        public loadOp: LoadOp = LoadOp.CLEAR,
        public storeOp: StoreOp = StoreOp.STORE,
        public beginLayout: TextureLayout = TextureLayout.UNDEFINED,
        public endLayout: TextureLayout = TextureLayout.PRESENT_SRC,
    ) {}
}

/**
 * @en Depth stencil attachment.
 * @zh GFX 深度模板附件。
 */
export class DepthStencilAttachment {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public format: Format = Format.UNKNOWN,
        public sampleCount: number = 1,
        public depthLoadOp: LoadOp = LoadOp.CLEAR,
        public depthStoreOp: StoreOp = StoreOp.STORE,
        public stencilLoadOp: LoadOp = LoadOp.CLEAR,
        public stencilStoreOp: StoreOp = StoreOp.STORE,
        public beginLayout: TextureLayout = TextureLayout.UNDEFINED,
        public endLayout: TextureLayout = TextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
    ) {}
}

export class SubPassInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public bindPoint: PipelineBindPoint = PipelineBindPoint.GRAPHICS,
        public inputs: number[] = [],
        public colors: number[] = [],
        public resolves: number[] = [],
        public depthStencil: number = -1,
        public preserves: number[] = [],
    ) {}
}

export class RenderPassInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public colorAttachments: ColorAttachment[] = [],
        public depthStencilAttachment: DepthStencilAttachment | null = null,
        public subPasses: SubPassInfo[] = [],
    ) {}
}

/**
 * @en GFX render pass.
 * @zh GFX 渲染过程。
 */
export abstract class RenderPass extends Obj {
    protected _device: Device;

    protected _colorInfos: ColorAttachment[] = [];

    protected _depthStencilInfo: DepthStencilAttachment | null = null;

    protected _subPasses: SubPassInfo[] = [];

    protected _hash = 0;

    get colorAttachments () { return this._colorInfos; }
    get depthStencilAttachment () { return this._depthStencilInfo; }
    get subPasses () { return this._subPasses; }
    get hash () { return this._hash; }

    constructor (device: Device) {
        super(ObjectType.RENDER_PASS);
        this._device = device;
    }

    // Based on render pass compatibility
    protected computeHash (): number {
        let res = '';
        if (this._subPasses.length) {
            for (let i = 0; i < this._subPasses.length; ++i) {
                const subpass = this._subPasses[i];
                if (subpass.inputs.length) {
                    res += 'ia';
                    for (let j = 0; j < subpass.inputs.length; ++j) {
                        const ia = this._colorInfos[subpass.inputs[j]];
                        res += `,${ia.format},${ia.sampleCount}`;
                    }
                }
                if (subpass.colors.length) {
                    res += 'ca';
                    for (let j = 0; j < subpass.inputs.length; ++j) {
                        const ca = this._colorInfos[subpass.inputs[j]];
                        res += `,${ca.format},${ca.sampleCount}`;
                    }
                }
                if (subpass.depthStencil >= 0) {
                    const ds = this._colorInfos[subpass.depthStencil];
                    res += `ds,${ds.format},${ds.sampleCount}`;
                }
            }
        } else {
            res += 'ca';
            for (let i = 0; i < this._colorInfos.length; ++i) {
                const ca = this._colorInfos[i];
                res += `,${ca.format},${ca.sampleCount}`;
            }
            const ds = this._depthStencilInfo;
            if (ds) {
                res += `ds,${ds.format},${ds.sampleCount}`;
            }
        }

        return murmurhash2_32_gc(res, 666);
    }

    public abstract initialize (info: RenderPassInfo): boolean;

    public abstract destroy (): void;
}
