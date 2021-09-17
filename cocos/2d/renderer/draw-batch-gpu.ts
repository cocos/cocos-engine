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
import { Vec3, Vec2, Vec4, Color } from '../../core/math';
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
    private _dcIndex = -1;

    constructor () {
        super();
        this._device = legacyCC.director.root.device;
    }

    private tiledCache = new Vec4(1, 1, 1, 1);
    private slicedCache = [];
    private col = new Color();
    public fillBuffers (renderComp: Renderable2D, UBOManager: UILocalUBOManger, material: Material, batcher: IBatcher) {
        // 将一个 drawBatch 分割为多个 drawCall
        // 分割条件， uboHash 要一致，buffer View 要一致
        renderComp.node.updateWorldTransform();
        // @ts-expect-error using private members
        const { _pos: t, _rot: r, _scale: s } = renderComp.node;
        this._tempRect = renderComp.node._uiProps.uiTransformComp!;
        // 更新 size 和 anchor 利用 dirty
        this._tempRect.checkAndUpdateRect(s);

        this._tempAnchor.set(this._tempRect._anchorCache);
        this._tempPosition.x = t.x + this._tempAnchor.x;
        this._tempPosition.y = t.y + this._tempAnchor.y;
        this._tempPosition.z = t.z;

        let mode = 0;
        let fillType = 0;
        let frame;
        let to;
        if (renderComp instanceof Sprite || renderComp instanceof Label) {
            frame = renderComp.spriteFrame;
            to = frame.tillingOffset;
        }

        if (renderComp instanceof Sprite) {
            mode = renderComp.type;
            if (mode !== SpriteType.SIMPLE) {
                if (mode === SpriteType.SLICED) {
                    renderComp._calculateSlicedData(this.slicedCache);
                    this._packageSlicedData(this.slicedCache, frame.slicedData, frame.rotated);
                } else if (mode === SpriteType.TILED) {
                    renderComp.calculateTiledData(this.tiledCache);
                } else if (mode === SpriteType.FILLED) {
                    let start = renderComp.fillStart;
                    const range = renderComp.fillRange;
                    let end;
                    if (renderComp.fillType === 2) { // RADIAL
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
                    fillType = renderComp.fillType / 10 + 0.01;
                }
            }
        }

        const c = renderComp.color;
        this.col.set(c.r, c.g, c.b, renderComp.node._uiProps.opacity * 255);

        // 每个 UBO 能够容纳的 UI 数量
        if (this.UICapacityDirty) {
            this._UIPerUBO = Math.floor((this._device.capabilities.maxVertexUniformVectors
                 - material.passes[0].shaderInfo.builtins.statistics.CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS) / this._vec4PerUI);
            this.UICapacityDirty = false;
        }
        const localBuffer = UBOManager.upload(this._tempPosition, r, this._tempRect._rectWithScale, to, this.col, mode,
            this._UIPerUBO, this._vec4PerUI, this.tiledCache, fillType);
        return localBuffer;
    }

    public fillDrawCall (localBuffer: UILocalBuffer) {
        // 能同 drawCall 的条件： UBOIndex 相同，ubohash 相同
        let dc = this._drawCalls[this._dcIndex];
        if (dc && (dc.bufferHash !== localBuffer.hash || dc.bufferUboIndex !== localBuffer.prevUBOIndex)) { // 存在但不能合批
            this._dcIndex++;
            dc = this._drawCalls[this._dcIndex];
        }
        if (!dc) {
            dc = DrawBatch2DGPU.drawcallPool.add();
            // make sure to assign initial values to all members here
            dc.bufferHash = localBuffer.hash;
            dc.bufferUboIndex = localBuffer.prevUBOIndex;
            dc.bufferView = localBuffer.getBufferView();
            dc.dynamicOffsets[0] = localBuffer.prevUBOIndex * localBuffer.uniformBufferStride;
            dc.drawInfo.firstIndex = localBuffer.prevInstanceID * 6;
            dc.drawInfo.indexCount = 0;
            this._dcIndex = this._drawCalls.length;

            this._drawCalls.push(dc);
        }
        dc.drawInfo.indexCount += 6;
    }

    // for updateBuffer
    public updateBuffer (renderComp: Renderable2D, bufferInfo, localBuffer: UILocalBuffer) {
        if (renderComp.node.hasChangedFlags || renderComp.node._uiProps.uiTransformComp!._rectDirty) {
            const node = renderComp.node;
            node.updateWorldTransform();
            this._tempRect = node._uiProps.uiTransformComp!;
            // @ts-expect-error using private members
            const { _pos: t, _rot: r, _scale: s } = renderComp.node;
            this._tempRect.checkAndUpdateRect(s);
            this._tempAnchor.set(this._tempRect._anchorCache);
            this._tempPosition.x = t.x + this._tempAnchor.x;
            this._tempPosition.y = t.y + this._tempAnchor.y;
            this._tempPosition.z = t.z;

            if (node.hasChangedFlags & TransformBit.RS || this._tempRect._rectDirty) {
                localBuffer.updateDataTRSByDirty(bufferInfo.instanceID, bufferInfo.UBOIndex, this._tempPosition, r, this._tempRect._rectWithScale);
            } else {
                localBuffer.updateDataTRSByDirty(bufferInfo.instanceID, bufferInfo.UBOIndex, this._tempPosition);
            }
        }

        let mode = 0;
        let fillType = 0;
        let frame;
        let to;
        if (renderComp instanceof Sprite || renderComp instanceof Label) {
            frame = renderComp.spriteFrame;
            to = frame.tillingOffset;
        }
        if (renderComp instanceof Sprite) {
            mode = renderComp.type;
            if (mode !== SpriteType.SIMPLE) {
                if (mode === SpriteType.SLICED) {
                    renderComp._calculateSlicedData(this.slicedCache);
                    this._packageSlicedData(this.slicedCache, frame.slicedData, frame.rotated);
                } else if (mode === SpriteType.TILED) {
                    renderComp.calculateTiledData(this.tiledCache);
                } else if (mode === SpriteType.FILLED) {
                    let start = renderComp.fillStart;
                    const range = renderComp.fillRange;
                    let end;
                    if (renderComp.fillType === 2) { // RADIAL
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
                    fillType = renderComp.fillType / 10 + 0.01;
                }
            }
        }
        const c = renderComp.color;
        this.col.set(c.r, c.g, c.b, renderComp.node._uiProps.opacity * 255);
        localBuffer.updateDataByDirty(bufferInfo.instanceID, bufferInfo.UBOIndex, this.col, mode, to, this.tiledCache, fillType);
    }

    // Need Dirty
    private _packageSlicedData (spriteData: number[], frameData: number[], rotated: boolean) { // LTRB
        if (rotated) {
            this.tiledCache.x = 1 - spriteData[3] + Math.floor((1 - frameData[3]) * 2048.0);
            this.tiledCache.y = spriteData[0] + Math.floor(frameData[0] * 2048.0);
            this.tiledCache.z = Math.min(1 - spriteData[1], 1 - EPSILON) + Math.floor((1 - frameData[1]) * 2048.0);
            this.tiledCache.w = Math.min(spriteData[2], 1 - EPSILON) + Math.floor(frameData[2] * 2048.0);
        } else {
            this.tiledCache.x = spriteData[0] + Math.floor(frameData[0] * 2048.0);
            this.tiledCache.y = spriteData[1] + Math.floor(frameData[1] * 2048.0);
            this.tiledCache.z = Math.min(spriteData[2], 1 - EPSILON) + Math.floor(frameData[2] * 2048.0);
            this.tiledCache.w = Math.min(spriteData[3], 1 - EPSILON) + Math.floor(frameData[3] * 2048.0);
        }
    }
}
