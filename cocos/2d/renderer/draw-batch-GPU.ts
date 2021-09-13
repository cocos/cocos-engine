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

import { Material } from '../../core/assets/material';
import { Device } from '../../core/gfx';
import { legacyCC } from '../../core/global-exports';
import { UILocalBuffer, UILocalUBOManger } from './render-uniform-buffer';
import { Renderable2D, UITransform } from '../framework';
import { Label, Sprite } from '../components';
import { Vec3, Vec2, Vec4 } from '../../core/math';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { SpriteType } from '../components/sprite';
import { DrawBatch2D, DrawCall } from './draw-batch';
import { IBatcher } from './i-batcher';

const EPSILON = 1 / 4096; // ulp(2049)

export class DrawBatch2DGPU extends DrawBatch2D {
    set vec4PerUI (val: number) {
        this._vec4PerUI = val;
        this.UICapacityDirty = true;
    }

    get vec4PerUI () {
        return this._vec4PerUI;
    }

    private _tempRect: UITransform | null = null;
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
        super();
        this._device = legacyCC.director.root.device;
    }

    // private toCache = [1, 1, 0, 0];
    private tiledCache = new Vec4(1, 1, 1, 1);
    private slicedCache = [];
    // simple version
    public fillBuffers (renderComp: Renderable2D, UBOManager: UILocalUBOManger, material: Material, batcher: IBatcher) {
        // 将一个 drawBatch 分割为多个 drawCall
        // 分割条件， uboHash 要一致，buffer View 要一致
        // 从 Node 里取 TRS，comp 上取 to 和 color， 计算出 tiled 和其他
        renderComp.node.updateWorldTransform();
        // 需要加工锚点和 rect
        // @ts-expect-error using private members
        const { _pos: t, _rot: r, _scale: s } = renderComp.node;
        this._tempRect = renderComp.node._uiProps.uiTransformComp!;

        // 由于此处没有 renderData 的 dirty，所以此处需要针对 Rect 进行更新
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
            // 确保已经更新了 contextSize
            sprite._calculateSlicedData(this.slicedCache); // 会被 rect 影响
            this._packageSlicedData(this.slicedCache, frame.slicedData);
        } else if (mode === SpriteType.TILED) {
            sprite.calculateTiledData(this.tiledCache); // 会被 rect 影响
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
        // 这儿得处理一个级联
        const c = renderComp.color;

        // 每个对象占用的 vec4 数量
        // const vec4PerUI = 5; // 替换为了 this._vec4PerUI
        // 每个 UBO 能够容纳的 UI 数量
        // const UIPerUBO = Math.floor((this._device.capabilities.maxVertexUniformVectors - material.passes[0].shaderInfo.builtins.statistics.CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS) / vec4PerUI);
        if (this.UICapacityDirty) {
            // 这儿好像没处理多 pass 的情况？？？
            this._UIPerUBO = Math.floor((this._device.capabilities.maxVertexUniformVectors - material.passes[0].shaderInfo.builtins.statistics.CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS) / this._vec4PerUI);
            this.UICapacityDirty = false;
        }
        // const UIPerUBO = 16; // 调试用 16
        // 上传数据
        const localBuffer = UBOManager.upload(this._tempPosition, r, this._tempRect._rectWithScale, to, c, mode, this._UIPerUBO, this._vec4PerUI, this.tiledCache, fillType);
        return localBuffer;
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

    // DrawCall 很难进行缓存，双层结构导致了它的上下层变化都需要 dirty
    public fillDrawCall (localBuffer: UILocalBuffer) {
        // 能同 drawCall 的条件： UBOIndex 相同，ubohash 相同
        let dc = this._drawcalls[this._dcIndex];
        if (dc && (dc.bufferHash !== localBuffer.hash || dc.bufferUboIndex !== localBuffer.prevUBOIndex)) { // 存在但不能合批
            this._dcIndex++; // 索引加一
            dc = this._drawcalls[this._dcIndex]; // 再取取不到
        }
        if (!dc) {
            dc = DrawBatch2DGPU.drawcallPool.add();
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
    // 宗旨是将 node 上的 TRS 和其他的数据分离开
    public updateBuffer (renderComp: Renderable2D, bufferInfo, localBuffer: UILocalBuffer) {
        // 更新 TRS
        if (renderComp.node.hasChangedFlags || renderComp.node._uiProps.uiTransformComp!._rectDirty) {
            // 更新之前是可以知道哪个更了的
            const node = renderComp.node;
            node.updateWorldTransform();
            // 更新完成 node 上的节点之后，希望能够进行 render 中的数据更新
            // 有哪些呢，看 fillBuffer
            // 这个 dirty 由其他一个 dirty 组成，UIRect 的 rectDirty（需要）
            // rectDirty 比较烦，甚至在之后的 uvEX 中都会使用
            // 合成没问题，但是可能需要能够反解
            // renderData 延迟到帧末尾执行的原因是避免在同一帧内多次变更
            // 还可以保留这个机制，然后更新时不做置位，最后用完了之后才进行置位
            this._tempRect = node._uiProps.uiTransformComp!;
            // 开始的偏移量 可以根据需求来填充了
            // @ts-expect-error using private members
            const { _pos: t, _rot: r, _scale: s } = renderComp.node;
            // dirty 的条件就到这里为止了
            // 更新可以放到类里

            this._tempRect.checkAndUpdateRect(s); // 检查下要不要更新
            this._tempAnchor.set(this._tempRect._anchorCache);
            this._tempPosition.x = t.x + this._tempAnchor.x;
            this._tempPosition.y = t.y + this._tempAnchor.y;
            this._tempPosition.z = t.z;
            // 这个条件判断不了 UITransform 带来的属性变化 // 或者说这里不能直接使用 node 的 dirty
            if (node.hasChangedFlags & TransformBit.RS || this._tempRect._rectDirty) {
                localBuffer.updateDataTRSByDirty(bufferInfo.instanceID, bufferInfo.UBOIndex, this._tempPosition, r, this._tempRect._rectWithScale);
            } else {
                // 只更新position
                localBuffer.updateDataTRSByDirty(bufferInfo.instanceID, bufferInfo.UBOIndex, this._tempPosition);
            }
        }
        // 更新 RenderData
        // 问题是颜色的更新未能添加到这个flag中
        // if (renderComp._renderDataDirty) {
        // 这儿得处理一个级联 // 这里有个dirty 的更新问题
        const c = renderComp.color;
        let mode = 0;
        let fillType = 0;
        let frame;
        let to;
        if (renderComp instanceof Sprite || renderComp instanceof Label) {
            frame = renderComp.spriteFrame;
            to = frame.tillingOffset;
        }
        if (renderComp instanceof Sprite) {
            fillType = renderComp.fillType / 10 + 0.01;
            mode = renderComp.type;
            if (mode === SpriteType.SLICED) {
                // 确保已经更新了 contextSize
                renderComp._calculateSlicedData(this.slicedCache); // 会被 rect 影响
                this._packageSlicedData(this.slicedCache, frame.slicedData);
            } else if (mode === SpriteType.TILED) {
                renderComp.calculateTiledData(this.tiledCache); // 会被 rect 影响
            } else if (mode === SpriteType.FILLED) {
                let start = renderComp.fillStart;
                const range = renderComp.fillRange;
                let end;
                if (renderComp.fillType === 2) { // RADIAL
                    // 范围界定到 0-1 start < end
                    // start 取值为 [-1,1] 先处理下
                    this.tiledCache.x = start > 0.5 ? start * 2 - 2 : start * 2;
                    this.tiledCache.y = range * 2;
                    this.tiledCache.z = renderComp.fillCenter.x;
                    this.tiledCache.w = 1 - renderComp.fillCenter.y;
                } else {
                    end = Math.min(1, start + range);
                    if (range < 0) {
                        end = start;
                        start = Math.max(0, renderComp.fillStart + range);
                    }
                    this.tiledCache.x = start;
                    this.tiledCache.y = end;
                }
            }
        }
        localBuffer.updateDataByDirty(bufferInfo.instanceID, bufferInfo.UBOIndex, c, mode, to, this.tiledCache, fillType);
        // }
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
