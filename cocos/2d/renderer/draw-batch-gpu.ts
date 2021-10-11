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
import { DrawBatch2D } from './draw-batch';
import { IBatcher } from './i-batcher';

const EPSILON = 1 / 4096; // ulp(2049)

export class DrawBatch2DGPU extends DrawBatch2D {
    static _tempRect: UITransform | null = null;
    static _tempPosition = new Vec3();
    static _tempAnchor = new Vec2();
    static _tempcolor = new Color();
    static _tiledCache = new Vec4(1, 1, 1, 1);
    static _slicedCache = [];

    set vec4PerUI (val: number) {
        this._vec4PerUI = val;
        this.capacityDirty = true;
    }

    get vec4PerUI () {
        return this._vec4PerUI;
    }

    private _vec4PerUI = 5;
    private _numPerUBO = 0;
    public capacityDirty = true;

    private _device: Device;
    private _dcIndex = -1;

    constructor () {
        super();
        this._device = legacyCC.director.root.device;
    }

    public fillBuffers (renderComp: Renderable2D, UBOManager: UILocalUBOManger, material: Material, batcher: IBatcher) {
        renderComp.node.updateWorldTransform();
        // @ts-expect-error using private members
        const { _pos: t, _rot: r, _scale: s } = renderComp.node;
        DrawBatch2DGPU._tempRect = renderComp.node._uiProps.uiTransformComp!;
        DrawBatch2DGPU._tempRect.checkAndUpdateRect(r, s);
        Vec3.add(DrawBatch2DGPU._tempPosition, t, DrawBatch2DGPU._tempRect._anchorCache);

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
                    renderComp._calculateSlicedData(DrawBatch2DGPU._slicedCache);
                    this._packageSlicedData(DrawBatch2DGPU._slicedCache, frame.slicedData, frame.rotated);
                } else if (mode === SpriteType.TILED) {
                    renderComp.calculateTiledData(DrawBatch2DGPU._tiledCache);
                } else if (mode === SpriteType.FILLED) {
                    let start = renderComp.fillStart;
                    const range = renderComp.fillRange;
                    let end;
                    if (renderComp.fillType === 2) { // RADIAL
                        DrawBatch2DGPU._tiledCache.x = start > 0.5 ? start * 2 - 2 : start * 2;
                        DrawBatch2DGPU._tiledCache.y = range * 2;
                        DrawBatch2DGPU._tiledCache.z = renderComp.fillCenter.x;
                        DrawBatch2DGPU._tiledCache.w = 1 - renderComp.fillCenter.y;
                    } else {
                        end = Math.min(1, start + range);
                        if (range < 0) {
                            end = start;
                            start = Math.max(0, renderComp.fillStart + range);
                        }
                        DrawBatch2DGPU._tiledCache.x = start;
                        DrawBatch2DGPU._tiledCache.y = end;
                    }
                    fillType = renderComp.fillType / 10 + 0.01;
                }
            }
        }

        const c = renderComp.color;
        DrawBatch2DGPU._tempcolor.set(c.r, c.g, c.b, renderComp.node._uiProps.opacity * 255);

        if (this.capacityDirty) {
            this._numPerUBO = Math.floor((this._device.capabilities.maxVertexUniformVectors
                 - material.passes[0].shaderInfo.builtins.statistics.CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS) / this._vec4PerUI);
            this.capacityDirty = false;
        }
        const localBuffer = UBOManager.upload(DrawBatch2DGPU._tempPosition, r, DrawBatch2DGPU._tempRect._rectWithScale, to,
            DrawBatch2DGPU._tempcolor, mode, this._numPerUBO, this._vec4PerUI, DrawBatch2DGPU._tiledCache, fillType);
        return localBuffer;
    }

    public fillDrawCall (localBuffer: UILocalBuffer) {
        let dc = this._drawCalls[this._dcIndex];
        if (dc && (dc.bufferHash !== localBuffer.hash || dc.bufferUboIndex !== localBuffer.prevUBOIndex)) { // merge check
            this._dcIndex++;
            dc = this._drawCalls[this._dcIndex];
        }
        if (!dc) {
            dc = DrawBatch2DGPU.drawcallPool.add();
            // make sure to assign initial values to all members here
            dc.bufferHash = localBuffer.hash;
            dc.bufferUboIndex = localBuffer.prevUBOIndex;
            dc.bufferView = localBuffer.getBufferView();
            // hack
            dc.setDynamicOffsets(localBuffer.prevUBOIndex * localBuffer.uniformBufferStride);
            dc.drawInfo!.firstIndex = localBuffer.prevInstanceID * 6;
            dc.drawInfo!.indexCount = 0;
            this._dcIndex = this._drawCalls.length;

            this._pushDrawCall(dc);
        }
        dc.drawInfo!.indexCount += 6;
    }

    // for updateBuffer
    public updateBuffer (renderComp: Renderable2D, bufferInfo, localBuffer: UILocalBuffer) {
        if (renderComp.node.hasChangedFlags || renderComp.node._uiProps.uiTransformComp!._rectDirty) {
            const node = renderComp.node;
            node.updateWorldTransform();
            DrawBatch2DGPU._tempRect = node._uiProps.uiTransformComp!;
            // @ts-expect-error using private members
            const { _pos: t, _rot: r, _scale: s } = renderComp.node;
            DrawBatch2DGPU._tempRect.checkAndUpdateRect(r, s);
            Vec3.add(DrawBatch2DGPU._tempPosition, t, DrawBatch2DGPU._tempRect._anchorCache);

            if (node.hasChangedFlags & TransformBit.RS || DrawBatch2DGPU._tempRect._rectDirty) {
                localBuffer.updateDataTRSByDirty(bufferInfo.instanceID, bufferInfo.UBOIndex,
                    DrawBatch2DGPU._tempPosition, r, DrawBatch2DGPU._tempRect._rectWithScale);
            } else {
                localBuffer.updateDataTRSByDirty(bufferInfo.instanceID, bufferInfo.UBOIndex, DrawBatch2DGPU._tempPosition);
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
                    renderComp._calculateSlicedData(DrawBatch2DGPU._slicedCache);
                    this._packageSlicedData(DrawBatch2DGPU._slicedCache, frame.slicedData, frame.rotated);
                } else if (mode === SpriteType.TILED) {
                    renderComp.calculateTiledData(DrawBatch2DGPU._tiledCache);
                } else if (mode === SpriteType.FILLED) {
                    let start = renderComp.fillStart;
                    const range = renderComp.fillRange;
                    let end;
                    if (renderComp.fillType === 2) { // RADIAL
                        DrawBatch2DGPU._tiledCache.x = start > 0.5 ? start * 2 - 2 : start * 2;
                        DrawBatch2DGPU._tiledCache.y = range * 2;
                        DrawBatch2DGPU._tiledCache.z = renderComp.fillCenter.x;
                        DrawBatch2DGPU._tiledCache.w = 1 - renderComp.fillCenter.y;
                    } else {
                        end = Math.min(1, start + range);
                        if (range < 0) {
                            end = start;
                            start = Math.max(0, renderComp.fillStart + range);
                        }
                        DrawBatch2DGPU._tiledCache.x = start;
                        DrawBatch2DGPU._tiledCache.y = end;
                    }
                    fillType = renderComp.fillType / 10 + 0.01;
                }
            }
        }
        const c = renderComp.color;
        DrawBatch2DGPU._tempcolor.set(c.r, c.g, c.b, renderComp.node._uiProps.opacity * 255);
        localBuffer.updateDataByDirty(bufferInfo.instanceID, bufferInfo.UBOIndex,
            DrawBatch2DGPU._tempcolor, mode, to, DrawBatch2DGPU._tiledCache, fillType);
    }

    // Need Dirty
    private _packageSlicedData (spriteData: number[], frameData: number[], rotated: boolean) { // LTRB
        if (rotated) {
            DrawBatch2DGPU._tiledCache.x = 1 - spriteData[3] + Math.floor((1 - frameData[3]) * 2048.0);
            DrawBatch2DGPU._tiledCache.y = spriteData[0] + Math.floor(frameData[0] * 2048.0);
            DrawBatch2DGPU._tiledCache.z = Math.min(1 - spriteData[1], 1 - EPSILON) + Math.floor((1 - frameData[1]) * 2048.0);
            DrawBatch2DGPU._tiledCache.w = Math.min(spriteData[2], 1 - EPSILON) + Math.floor(frameData[2] * 2048.0);
        } else {
            DrawBatch2DGPU._tiledCache.x = spriteData[0] + Math.floor(frameData[0] * 2048.0);
            DrawBatch2DGPU._tiledCache.y = spriteData[1] + Math.floor(frameData[1] * 2048.0);
            DrawBatch2DGPU._tiledCache.z = Math.min(spriteData[2], 1 - EPSILON) + Math.floor(frameData[2] * 2048.0);
            DrawBatch2DGPU._tiledCache.w = Math.min(spriteData[3], 1 - EPSILON) + Math.floor(frameData[3] * 2048.0);
        }
    }
}
