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

import { JSB } from 'internal:constants';
import { MeshBuffer } from './mesh-buffer';
import { Material } from '../../core/assets/material';
import { Texture, Sampler, DrawInfo, Buffer, Device, InputAssembler, DescriptorSet, Shader } from '../../core/gfx';
import { Node } from '../../core/scene-graph';
import { Camera } from '../../core/renderer/scene/camera';
import { RenderScene } from '../../core/renderer/scene/render-scene';
import { Model } from '../../core/renderer/scene/model';
import { Batcher2D } from './batcher-2d';
import { Layers } from '../../core/scene-graph/layers';
import { legacyCC } from '../../core/global-exports';
import { UILocalBuffer, UILocalUBOManger } from './render-uniform-buffer';
import { Pass } from '../../core/renderer/core/pass';
import { Renderable2D, UITransform } from '../framework';
import { Sprite } from '../components';
import { director, RecyclePool, Vec2, Vec4 } from '../../core';
import { Vec3 } from '../../core/math/vec3';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { SpriteType } from '../components/sprite';
import { NativeDrawBatch2D, NativePass } from '../../core/renderer/scene';

const UI_VIS_FLAG = Layers.Enum.NONE | Layers.Enum.UI_3D;
const EPSILON = 1/4096; // ulp(2049)

export class DrawCall {
    // UBO info
    public bufferHash = 0;
    public bufferUboIndex = 0;
    public bufferView!: Buffer; // 直接存 ubo

    // actual draw call info
    public descriptorSet: DescriptorSet = null!;
    public dynamicOffsets = [0]; // 偏移用 // uboindex * _uniformBufferStride
    public drawInfo = new DrawInfo();
}

export class DrawBatch2D {
    static drawcallPool = new RecyclePool(() => new DrawCall(), 100);

    public get native (): NativeDrawBatch2D {
        return this._nativeObj!;
    }

    public get inputAssembler () {
        return this._inputAssember;
    }
    public set inputAssembler (ia: InputAssembler | null) {
        this._inputAssember = ia;
        if (JSB) {
            this._nativeObj!.inputAssembler = ia;
        }
    }
    public get descriptorSet () {
        return this._descriptorSet;
    }
    public set descriptorSet (ds: DescriptorSet | null) {
        this._descriptorSet = ds;
        if (JSB) {
            this._nativeObj!.descriptorSet = ds;
        }
    }
    public get visFlags () {
        return this._visFlags;
    }
    public set visFlags (vis) {
        this._visFlags = vis;

        if (JSB) {
            this._nativeObj!.visFlags = vis;
        }
    }

    get passes () {
        return this._passes;
    }

    set vec4PerUI (val: number) {
        this._vec4PerUI = val;
        this.UICapacityDirty = true;
    }

    get vec4PerUI () {
        return this._vec4PerUI;
    }

    public get shaders () {
        return this._shaders;
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
    private _passes: Pass[] = [];
    private _shaders: Shader[] = [];
    private _visFlags: number = UI_VIS_FLAG;
    private _inputAssember: InputAssembler | null = null;
    private _descriptorSet: DescriptorSet | null = null;
    private declare _nativeObj: NativeDrawBatch2D | null;

    private _tempRect: UITransform | null = null;
    private _tempScale = new Vec3();
    private _tempPosition = new Vec3();
    private _tempAnchor = new Vec2();

    private _vec4PerUI = 5;
    private _UIPerUBO = 0;
    public UICapacityDirty = true;

    private _device: Device;

    // 这里有两个情况
    // 1、batches 放不下的情况
    // 2、batches 放不满的情况
    protected _drawcalls: DrawCall[] = []; // 意味着一个 batch 里会有多个 DC
    private _dcIndex = -1;

    get drawcalls () { return this._drawcalls; }

    constructor () {
        this._device = legacyCC.director.root.device;

        if (JSB) {
            this._nativeObj = new NativeDrawBatch2D();
            this._nativeObj.visFlags = this._visFlags;
        }
    }

    public destroy (ui: Batcher2D) {
        this._passes = [];
        if (JSB) {
            this._nativeObj = null;
        }
    }

    public clear () {
        this.bufferBatch = null;
        this.inputAssembler = null;
        this.descriptorSet = null;
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

            let hashFactor = 0;
            let dirty = false;

            this._shaders.length = passes.length;

            for (let i = 0; i < passes.length; i++) {
                if (!this._passes[i]) {
                    this._passes[i] = new Pass(legacyCC.director.root);
                }
                const mtlPass = passes[i];
                const passInUse = this._passes[i];

                mtlPass.update();

                if (mtlPass.hash === passInUse.hash) {
                    continue;
                }

                if (!dss) { dss = mtlPass.depthStencilState; dssHash = 0; }
                if (!bs) { bs = mtlPass.blendState; bsHash = 0; }
                if (bsHash === -1) { bsHash = 0; }

                hashFactor = (dssHash << 16) | bsHash;
                // @ts-expect-error hack for UI use pass object
                passInUse._initPassFromTarget(mtlPass, dss, bs, hashFactor);

                this._shaders[i] = passInUse.getShaderVariant()!;

                dirty = true;
            }

            if (JSB) {
                if (dirty) {
                    const nativePasses: NativePass[] = [];
                    const passes = this._passes;
                    for (let i = 0; i < passes.length; i++) {
                        nativePasses.push(passes[i].native);
                    }
                    this._nativeObj!.passes = nativePasses;
                    this._nativeObj!.shaders = this._shaders;
                }
            }
        }
    }

    // private toCache = [1, 1, 0, 0];
    private tiledCache = new Vec4(1, 1, 1, 1);
    // simple version
    public fillBuffers (renderComp: Renderable2D, UBOManager: UILocalUBOManger, material: Material, batcher: Batcher2D) {
        // 将一个 drawBatch 分割为多个 drawCall
        // 分割条件， uboHash 要一致，buffer View 要一致
        // 从 Node 里取 TRS，comp 上取 to 和 color， 计算出 tiled 和其他
        renderComp.node.updateWorldTransform();
        // 需要加工锚点和 rect
        // @ts-expect-error using private members
        const { _pos: t, _rot: r, _scale: s } = renderComp.node;
        this._tempRect = renderComp.node._uiProps.uiTransformComp!;

        // 更新 size 和 anchor 利用 dirty
        this._tempRect.checkAndUpdateRect(s);
        // this._tempScale = this._tempRect._rectWithScale;

        this._tempAnchor.set(this._tempRect._anchorCache);
        this._tempPosition.x = t.x + this._tempAnchor.x;
        this._tempPosition.y = t.y + this._tempAnchor.y;
        this._tempPosition.z = t.z;

        // 下面的逻辑几乎是针对于 sprite 的
        const sprite = renderComp as Sprite;
        // this.toCache.length = 0;
        const mode = sprite.type;
        const frame = sprite.spriteFrame!;

        // 对于 fillBuffer 来说实际上是不需要 dirty 的，fillBuffer 的 dirty 即为全部更新的 dirty
        // 且在 fillBuffer 结束之后，全部的 dirty 为 false 状态
        if (mode === SpriteType.SLICED) {
            sprite._calculateSlicedData();
            this._packageSlicedData(sprite.slicedData, frame.slicedData);
        } else if (mode === SpriteType.TILED) {
            sprite.calculateTiledData();
            this.tiledCache.x = sprite.tiledData.x;
            this.tiledCache.y = sprite.tiledData.y;
        } else if (mode === SpriteType.FILLED) {
            // TODO: 填充模式所需要的数据
            let start = sprite.fillStart;
            const range = sprite.fillRange;
            let end;
            if (sprite.fillType === 2) { // RADIAL
                // 范围界定到 0-1 start < end
                // start 取值为 [-1,1] 先处理下
                this.tiledCache.x = start > 0.5 ? start * 2 - 2 : start * 2;
                this.tiledCache.y = range * 2;
                this.tiledCache.z = sprite.fillCenter.x;
                this.tiledCache.w = 1 - sprite.fillCenter.y;
            } else {
                end = Math.min(1, start + range);
                if (range < 0) {
                    end = start;
                    start = Math.max(0, sprite.fillStart + range);
                }
                this.tiledCache.x = start;
                this.tiledCache.y = end;
            }
            // this.tiledCache.z = sprite.fillType;
        }

        // tillingOffset 缓存到了 spriteFrame 中
        // T 为 w h O 为右上的 XY 四个数字
        const to = frame.tillingOffset;
        const fillType = sprite.fillType / 10 + 0.01; // 给 progress 预留 // 处理浮点数误差
        const c = renderComp.color;

        // 每个对象占用的 vec4 数量
        // const vec4PerUI = 5; // 替换为了 this._vec4PerUI
        // 每个 UBO 能够容纳的 UI 数量
        // const UIPerUBO = Math.floor((this._device.capabilities.maxVertexUniformVectors - material.passes[0].shaderInfo.builtins.statistics.CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS) / vec4PerUI);
        if (this.UICapacityDirty) {
            this._UIPerUBO = Math.floor((this._device.capabilities.maxVertexUniformVectors - material.passes[0].shaderInfo.builtins.statistics.CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS) / this._vec4PerUI);
            this.UICapacityDirty = false;
        }
        // const UIPerUBO = 16; // 调试用 16
        // 上传数据
        const localBuffer = UBOManager.upload(this._tempPosition, r, this._tempRect._rectWithScale, to, c, mode, this._UIPerUBO, this._vec4PerUI, this.tiledCache, fillType);
        // 执行完了之后，uboindex 已经更新了 hash 也是确定的 indtanceID 也是更新过后的，这几个值能够找到 localBuffer 中具体是哪一段
        // 所以这几个值是和数组的顺序严格绑定的，需要缓存下来，更新的话就是 一个指针，每次到了这里就 +1 ，要更新就这个指针取出这些值，然后将对应的 buffer 找到，然后更新，最后上传
        // 录制 渲染缓存数组
        batcher.renderQueue.push({
            localBuffer,
            bufferHash: localBuffer.hash,
            UBOIndex: localBuffer.prevUBOIndex,
            instanceID: localBuffer.prevInstanceID,
        });
        // // 能同 drawCall 的条件： UBOIndex 相同，ubohash 相同
        // let dc = this._drawcalls[this._dcIndex];
        // if (dc && (dc.bufferHash !== localBuffer.hash || dc.bufferUboIndex !== localBuffer.prevUBOIndex)) { // 存在但不能合批
        //     this._dcIndex++; // 索引加一
        //     dc = this._drawcalls[this._dcIndex]; // 再取取不到
        // }
        // if (!dc) {
        //     dc = DrawBatch2D.drawcallPool.add();
        //     // make sure to assign initial values to all members here
        //     dc.bufferHash = localBuffer.hash;
        //     dc.bufferUboIndex = localBuffer.prevUBOIndex;
        //     dc.bufferView = localBuffer.getBufferView();
        //     dc.dynamicOffsets[0] = localBuffer.prevUBOIndex * localBuffer.uniformBufferStride;
        //     dc.drawInfo.firstIndex = localBuffer.prevInstanceID * 6; // 每个 UI 是个索引
        //     dc.drawInfo.indexCount = 0;
        //     this._dcIndex = this._drawcalls.length;

        //     this._drawcalls.push(dc);
        // }
        // dc.drawInfo.indexCount += 6;
    }

    public fillDrawCall (bufferInfo, localBuffer: UILocalBuffer) {
        // 能同 drawCall 的条件： UBOIndex 相同，ubohash 相同
        let dc = this._drawcalls[this._dcIndex];
        if (dc && (dc.bufferHash !== bufferInfo.bufferHash || dc.bufferUboIndex !== bufferInfo.UBOIndex)) { // 存在但不能合批
            this._dcIndex++; // 索引加一
            dc = this._drawcalls[this._dcIndex]; // 再取取不到
        }
        if (!dc) {
            dc = DrawBatch2D.drawcallPool.add();
            // make sure to assign initial values to all members here
            dc.bufferHash = bufferInfo.bufferHash;
            dc.bufferUboIndex = bufferInfo.UBOIndex;
            dc.bufferView = localBuffer.getBufferView();
            dc.dynamicOffsets[0] = bufferInfo.UBOIndex * localBuffer.uniformBufferStride;
            dc.drawInfo.firstIndex = bufferInfo.instanceID * 6; // 每个 UI 是个索引
            dc.drawInfo.indexCount = 0;
            this._dcIndex = this._drawcalls.length;

            this._drawcalls.push(dc);
        }
        dc.drawInfo.indexCount += 6;
    }

    // 需要针对片段进行 localBuffer 更新
    // 先考虑 dataDirty 机制
    // 针对 uniformBuffer 中的数据进行dirty
    // 这个 dirty 是针对每个节点的
    // 需要递归标记
    // trs
    // rect 的 size 和 anchor
    // sprite 的 type
    // tillingOffset （UV）
    // progress
    // color
    // tiledCache
    public updateBuffer (renderComp: Renderable2D, bufferInfo, localBuffer: UILocalBuffer) {
        // 更新之前是可以知道哪个更了的
        // 不过可能需要用事件，因为可能被编辑器先更新了
        renderComp.node.updateWorldTransform();
        this._tempRect = renderComp.node._uiProps.uiTransformComp!;
        // 开始的偏移量 可以根据需求来填充了
        // @ts-expect-error using private members
        const { _pos: t, _rot: r, _scale: s } = renderComp.node;
        // dirty 的条件就到这里为止了
        // 更新可以放到类里

        const dirty = this._tempRect._renderdataDirty;
        this._tempRect.checkAndUpdateRect(s); // 检查下要不要更新
        this._tempAnchor.set(this._tempRect._anchorCache);
        this._tempPosition.x = t.x + this._tempAnchor.x;
        this._tempPosition.y = t.y + this._tempAnchor.y;
        this._tempPosition.z = t.z;
        if (dirty & TransformBit.RS) {
            localBuffer.updateDataByDirty(bufferInfo.instanceID, bufferInfo.UBOIndex, this._tempPosition, r, this._tempRect._rectWithScale);
        } else {
            // 只更新position
            localBuffer.updateDataByDirty(bufferInfo.instanceID, bufferInfo.UBOIndex, this._tempPosition);
        }
    }

    private _packageSlicedData (spriteData: number[], frameData: number[]) { // LTRB
        this.tiledCache.x = spriteData[0] + Math.floor(frameData[0] * 2048.0);
        this.tiledCache.y = spriteData[1] + Math.floor(frameData[1] * 2048.0);
        // for sprite frames with 0 borders we have to clamp this
        // EPSILON should be at least ulp(2049) to avoid being rounded up again
        this.tiledCache.z = Math.min(spriteData[2], 1 - EPSILON) + Math.floor(frameData[2] * 2048.0);
        this.tiledCache.w = Math.min(spriteData[3], 1 - EPSILON) + Math.floor(frameData[3] * 2048.0);
    }
}
