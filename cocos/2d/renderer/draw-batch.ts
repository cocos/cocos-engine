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
 * @hidden
 */

import { MeshBuffer } from './mesh-buffer';
import { Material } from '../../core/assets/material';
import { Texture, Sampler, DrawInfo, Buffer, Device } from '../../core/gfx';
import { Node } from '../../core/scene-graph';
import { Camera } from '../../core/renderer/scene/camera';
import { RenderScene } from '../../core/renderer/scene/render-scene';
import { Model } from '../../core/renderer/scene/model';
import { Batcher2D } from './batcher-2d';
import { NULL_HANDLE, BatchHandle2D, BatchPool2D, BatchView2D, PassPool, DescriptorSetHandle, InputAssemblerHandle } from '../../core/renderer/core/memory-pools';
import { Layers } from '../../core/scene-graph/layers';
import { legacyCC } from '../../core/global-exports';
import { UILocalUBOManger } from './render-uniform-buffer';
import { Pass } from '../../core/renderer/core/pass';
import { Renderable2D } from '../framework';
import { Sprite } from '../components';
import { director, RecyclePool, Vec2 } from '../../core';
import { Vec3 } from '../../core/math/vec3';

const UI_VIS_FLAG = Layers.Enum.NONE | Layers.Enum.UI_3D;

class DrawCall {
    // UBO info
    public bufferHash = 0;
    public bufferUboIndex = 0;
    public bufferView!: Buffer; // 直接存 ubo

    // actual draw call info
    public hDescriptorSet: DescriptorSetHandle = NULL_HANDLE;
    public dynamicOffsets = [0]; // 偏移用 // uboindex * _uniformBufferStride
    public drawInfo = new DrawInfo();
}

export class DrawBatch2D {
    static drawcallPool = new RecyclePool(() => new DrawCall(), 100);

    get handle () {
        return this._handle;
    }

    get hInputAssembler () {
        return BatchPool2D.get(this._handle, BatchView2D.INPUT_ASSEMBLER);
    }

    set hInputAssembler (handle) {
        BatchPool2D.set(this._handle, BatchView2D.INPUT_ASSEMBLER, handle);
    }

    get visFlags () {
        return BatchPool2D.get(this._handle, BatchView2D.VIS_FLAGS);
    }

    set visFlags (vis) {
        BatchPool2D.set(this._handle, BatchView2D.VIS_FLAGS, vis);
    }

    get passes () {
        return this._passes;
    }

    public bufferBatch: MeshBuffer | null = null;
    public camera: Camera | null = null;
    public renderScene: RenderScene | null = null;
    public model: Model | null = null;
    public texture: Texture | null = null;
    public sampler: Sampler | null = null;
    public useLocalData: Node | null = null;
    public isStatic = false;
    public textureHash = 0;
    public samplerHash = 0;
    private _handle: BatchHandle2D = NULL_HANDLE;
    private _passes: Pass[] = [];

    private _tempRect;
    private _tempScale = new Vec3();

    private _device:Device;

    // 这里有两个情况
    // 1、batches 放不下的情况
    // 2、batches 放不满的情况
    protected _drawcalls: DrawCall[] = []; // 意味着一个 batch 里会有多个 DC
    private _dcIndex = -1;

    get drawcalls () { return this._drawcalls; }

    constructor () {
        this._handle = BatchPool2D.alloc();
        this._device = director.root!.device;
        BatchPool2D.set(this._handle, BatchView2D.VIS_FLAGS, UI_VIS_FLAG);
        BatchPool2D.set(this._handle, BatchView2D.INPUT_ASSEMBLER, NULL_HANDLE);
        BatchPool2D.set(this._handle, BatchView2D.DESCRIPTOR_SET, NULL_HANDLE);
    }

    public destroy (ui: Batcher2D) {
        if (this._handle) {
            const length = this.passes.length;
            for (let i = 0; i < length; i++) {
                // @ts-expect-error hack for UI destroyHandle
                this.passes[i]._destroyHandle();
            }
            this._passes = [];
            BatchPool2D.free(this._handle);
            this._handle = NULL_HANDLE;
        }
    }

    public clear () {
        this.bufferBatch = null;
        this.hInputAssembler = NULL_HANDLE;
        // this.hDescriptorSet = NULL_HANDLE;
        this.camera = null;
        this.texture = null;
        this.sampler = null;
        this.model = null;
        this.isStatic = false;
        this.useLocalData = null;
        this.visFlags = UI_VIS_FLAG;
        this._drawcalls.length = 0;
    }

    // object version
    public fillPasses (mat: Material | null, dss, dssHash, bs, bsHash, patches, batcher: Batcher2D) {
        if (mat) {
            const passes = mat.passes;
            if (!passes) { return; }

            BatchPool2D.set(this._handle, BatchView2D.PASS_COUNT, passes.length);
            let passOffset = BatchView2D.PASS_0;
            let shaderOffset = BatchView2D.SHADER_0;
            let hashFactor = 0;
            for (let i = 0; i < passes.length; i++, passOffset++, shaderOffset++) {
                if (!this._passes[i]) {
                    this._passes[i] = new Pass(legacyCC.director.root);
                    // @ts-expect-error hack for UI use pass object
                    this._passes[i]._handle = PassPool.alloc();
                }
                const mtlPass = passes[i];
                const passInUse = this._passes[i];
                if (!dss) { dss = mtlPass.depthStencilState; dssHash = 0; }
                if (!bs) { bs = mtlPass.blendState; bsHash = 0; }
                if (bsHash === -1) { bsHash = 0; }

                hashFactor = (dssHash << 16) | bsHash;

                mtlPass.update();
                // @ts-expect-error hack for UI use pass object
                passInUse._initPassFromTarget(mtlPass, dss, bs, hashFactor);
                BatchPool2D.set(this._handle, passOffset, passInUse.handle);
                BatchPool2D.set(this._handle, shaderOffset, passInUse.getShaderVariant(patches));
            }
        }
    }

    private toCache = [1, 1, 0, 0];
    private tiledCache = new Vec2(1, 1);
    // simple version
    public fillBuffers (renderComp: Renderable2D, UBOManager: UILocalUBOManger, material: Material) {
        // 将一个 drawBatch 分割为多个 drawCall
        // 分割条件， uboHash 要一致，buffer View 要一致
        // 从 Node 里取 TRS，comp 上取 to 和 color， 计算出 tiled 和其他
        renderComp.node.updateWorldTransform();
        // 需要加工锚点和 rect
        // @ts-expect-error using private members
        const { _pos: t, _rot: r, _scale: s } = renderComp.node;
        // anchor 未添加 // todo
        // size 的 dirty // todo
        this._tempRect = renderComp.node._uiProps.uiTransformComp!;
        this._tempScale.x = s.x * this._tempRect.width; // Rect 应该可以进行缓存 // Todo
        this._tempScale.y = s.y * this._tempRect.height;
        // 下面的逻辑几乎是针对于 sprite 的
        const sprite = renderComp as Sprite;
        this.toCache.length = 0;
        const mode = sprite.type;

        // 针对 tiled 的处理，可缓存 // Todo
        // const rect = sprite.spriteFrame?.rect;
        // if (mode === 2) {
        //     this.tiledCache.x = this._tempRect.width / rect?.width;
        //     this.tiledCache.y = this._tempRect.height / rect?.height;
        // }

        // tillingOffset 缓存到了 spriteFrame 中
        // T 为 w h O 为右上的 XY 四个数字
        const to = sprite.spriteFrame?.tillingOffset;
        const progress = 0; // 给 progress 预留
        const c = renderComp.color;

        // 每个对象占用的 vec4 数量
        const vec4PerUI = 5;
        // 每个 UBO 能够容纳的 UI 数量
        const UIPerUBO = Math.floor((this._device.capabilities.maxVertexUniformVectors - material.passes[0].shaderInfo.builtins.statistics.CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS) / vec4PerUI);
        // const UIPerUBO = 16; // 调试用 16
        // 上传数据
        const localBuffer = UBOManager.upload(t, r, this._tempScale, to!, c, mode, UIPerUBO, vec4PerUI, this.tiledCache, progress);

        // 能同 drawCall 的条件： UBOIndex 相同，ubohash 相同
        let dc = this._drawcalls[this._dcIndex];
        if (dc && (dc.bufferHash !== localBuffer.hash || dc.bufferUboIndex !== localBuffer.prevUBOIndex)) { // 存在但不能合批
            this._dcIndex++; // 索引加一
            dc = this._drawcalls[this._dcIndex]; // 再取取不到
        }
        if (!dc) {
            dc = DrawBatch2D.drawcallPool.add();
            // make sure to assign initial values to all members here
            dc.bufferHash = localBuffer.hash;
            dc.bufferUboIndex = localBuffer.prevUBOIndex;
            dc.bufferView = localBuffer.getBufferView();
            dc.dynamicOffsets[0] = localBuffer.prevUBOIndex * localBuffer.uniformBufferStride;
            dc.drawInfo.firstIndex = localBuffer.prevInstanceID * 6; // 每个 UI 是个索引
            dc.drawInfo.indexCount = 0;
            this._dcIndex = this._drawcalls.length;

            this._drawcalls.push(dc);
        }
        dc.drawInfo.indexCount += 6;
    }
}
