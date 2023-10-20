/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { UIRenderable } from '../../2d';
import { IAssembler } from '../../2d/renderer/base';

import { Batcher2D } from '../../2d/renderer/batcher-2d';
import { StaticVBAccessor } from '../../2d/renderer/static-vb-accessor';
import { vfmtPosUvColor4B, vfmtPosUvTwoColor4B, getAttributeStride } from '../../2d/renderer/vertex-format';
import { Skeleton, SpineMaterialType } from '../skeleton';
import { BlendFactor } from '../../gfx';
import { legacyCC } from '../../core/global-exports';
import { RenderData } from '../../2d/renderer/render-data';
import { director } from '../../game';
import spine from '../lib/spine-core.js';
import { Color, Vec3 } from '../../core';
import { MaterialInstance } from '../../render-scene';

const _slotColor = new Color(0, 0, 255, 255);
const _boneColor = new Color(255, 0, 0, 255);
const _originColor = new Color(0, 255, 0, 255);
const _meshColor = new Color(255, 255, 0, 255);
let _nodeR: number;
let _nodeG: number;
let _nodeB: number;
let _nodeA: number;

let _accessor: StaticVBAccessor = null!;
let _tintAccessor: StaticVBAccessor = null!;

let _premultipliedAlpha = false;
let _useTint = false;

const _byteStrideOneColor = getAttributeStride(vfmtPosUvColor4B);
const _byteStrideTwoColor = getAttributeStride(vfmtPosUvTwoColor4B);

const DEBUG_TYPE_REGION = 0;
const DEBUG_TYPE_MESH = 1;

function _getSlotMaterial (blendMode: number, comp: Skeleton): MaterialInstance {
    let src: BlendFactor;
    let dst: BlendFactor;
    switch (blendMode) {
    case 1:
        src =  _premultipliedAlpha ? BlendFactor.ONE :  BlendFactor.SRC_ALPHA;
        dst = BlendFactor.ONE;
        break;
    case 2:
        src = BlendFactor.DST_COLOR;
        dst = BlendFactor.ONE_MINUS_SRC_ALPHA;
        break;
    case 3:
        src = BlendFactor.ONE;
        dst = BlendFactor.ONE_MINUS_SRC_COLOR;
        break;
    case 0:
    default:
        src = _premultipliedAlpha ? BlendFactor.ONE : BlendFactor.SRC_ALPHA;
        dst = BlendFactor.ONE_MINUS_SRC_ALPHA;
        break;
    }
    return comp.getMaterialForBlendAndTint(src, dst, _useTint ? SpineMaterialType.TWO_COLORED : SpineMaterialType.COLORED_TEXTURED);
}

export const simple: IAssembler = {
    fillBuffers (render: UIRenderable, batcher: Batcher2D) {

    },
    updateColor (render: UIRenderable) {

    },
    vCount: 32767,
    ensureAccessor (useTint: boolean) {
        let accessor = useTint ? _tintAccessor : _accessor;
        if (!accessor) {
            const device = director.root!.device;
            const batcher = director.root!.batcher2D;
            const attributes = useTint ? vfmtPosUvTwoColor4B : vfmtPosUvColor4B;
            if (useTint) {
                accessor = _tintAccessor = new StaticVBAccessor(device, attributes, this.vCount as number);
                // Register to batcher so that batcher can upload buffers after batching process
                batcher.registerBufferAccessor(Number.parseInt('SPINETINT', 36), _tintAccessor);
            } else {
                accessor = _accessor = new StaticVBAccessor(device, attributes, this.vCount as number);
                // Register to batcher so that batcher can upload buffers after batching process
                batcher.registerBufferAccessor(Number.parseInt('SPINE', 36), _accessor);
            }
        }
        return accessor;
    },

    createData (comp: Skeleton) {
        let rd = comp.renderData;
        if (!rd) {
            const useTint = comp.useTint || comp.isAnimationCached();
            const accessor = this.ensureAccessor(useTint) as StaticVBAccessor;
            rd = RenderData.add(useTint ? vfmtPosUvTwoColor4B : vfmtPosUvColor4B, accessor);
        }
        return rd;
    },

    updateRenderData (comp: Skeleton, batcher: Batcher2D) {
        const skeleton = comp._skeleton;
        if (skeleton) {
            updateComponentRenderData(comp, batcher);
        }
    },
};

function updateComponentRenderData (comp: Skeleton, batcher: Batcher2D): void {
    comp.drawList.reset();
    if (comp.color.a === 0) return;
    comp._updateColor();
    _premultipliedAlpha = comp.premultipliedAlpha;
    _useTint = comp.useTint || comp.isAnimationCached();
    if (comp.isAnimationCached()) {
        cacheTraverse(comp);
    } else {
        realTimeTraverse(comp);
    }
    const rd = comp.renderData!;
    const accessor = _useTint ? _tintAccessor : _accessor;
    if (rd.vertexCount > 0 || rd.indexCount > 0) accessor.getMeshBuffer(rd.chunk.bufferId).setDirty();
}

function realTimeTraverse (comp: Skeleton): void {
    const floatStride = (_useTint ?  _byteStrideTwoColor : _byteStrideOneColor) / Float32Array.BYTES_PER_ELEMENT;
    const model = comp.updateRenderData();
    if (!model) return;
    const vc = model.vCount as number;
    const ic = model.iCount as number;
    const rd = comp.renderData!;

    if (rd.vertexCount !== vc || rd.indexCount !== ic) {
        rd.resize(vc, ic);
        rd.indices = new Uint16Array(ic);
    }
    if (vc < 1 || ic < 1) return;

    const vbuf = rd.chunk.vb;
    const vUint8Buf = new Uint8Array(vbuf.buffer, vbuf.byteOffset, Float32Array.BYTES_PER_ELEMENT * vbuf.length);

    const vPtr = model.vPtr;
    const vLength = vc * Float32Array.BYTES_PER_ELEMENT * floatStride;
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const vData = spine.wasmUtil.wasm.HEAPU8.subarray(vPtr, vPtr + vLength);
    vUint8Buf.set(vData as TypedArray);

    const iPtr = model.iPtr;
    const ibuf = rd.indices!;
    const iLength = Uint16Array.BYTES_PER_ELEMENT * ic;
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const iData = spine.wasmUtil.wasm.HEAPU8.subarray(iPtr, iPtr + iLength);
    const iUint8Buf = new Uint8Array(ibuf.buffer);
    iUint8Buf.set(iData as TypedArray);
    const chunkOffset = rd.chunk.vertexOffset;
    for (let i = 0; i < ic; i++) {
        ibuf[i] += chunkOffset;
    }

    const meshes = model.getMeshes();
    const count = meshes.size();
    let indexOffset = 0;
    let indexCount = 0;
    for (let i = 0; i < count; i++) {
        const mesh = meshes.get(i);
        const material = _getSlotMaterial(mesh.blendMode as number, comp);
        const textureID = mesh.textureID as number;
        indexCount = mesh.iCount;
        comp.requestDrawData(material, textureID, indexOffset, indexCount);
        indexOffset += indexCount;
    }
    // if enableBatch apply worldMatrix
    if (comp.enableBatch) {
        const worldMat = comp.node.worldMatrix;
        let index = 0;
        const tempVecPos = new Vec3(0, 0, 0);
        for (let i = 0; i < vc; i++) {
            index = i * floatStride;
            tempVecPos.x = vbuf[index];
            tempVecPos.y = vbuf[index + 1];
            tempVecPos.z = 0;
            tempVecPos.transformMat4(worldMat);
            vbuf[index] = tempVecPos.x;
            vbuf[index + 1] = tempVecPos.y;
            vbuf[index + 2] = tempVecPos.z;
        }
    }

    // debug renderer
    const graphics = comp._debugRenderer;
    const locSkeleton = comp._skeleton;
    if (graphics && (comp.debugBones || comp.debugSlots || comp.debugMesh)) {
        graphics.clear();

        const debugShapes = comp.getDebugShapes();
        const shapeCount = debugShapes.size();
        for (let i = 0; i < shapeCount; i++) {
            const shape = debugShapes.get(i);
            if (shape.type === DEBUG_TYPE_REGION && comp.debugSlots) {
                graphics.strokeColor = _slotColor;
                const vertexFloatOffset = shape.vOffset * floatStride;
                const vertexFloatCount = shape.vCount * floatStride;
                graphics.moveTo(vbuf[vertexFloatOffset], vbuf[vertexFloatOffset + 1]);
                for (let ii = vertexFloatOffset + floatStride, nn = vertexFloatOffset + vertexFloatCount; ii < nn; ii += floatStride) {
                    graphics.lineTo(vbuf[ii], vbuf[ii + 1]);
                }
                graphics.close();
                graphics.stroke();
            } else if (shape.type === DEBUG_TYPE_MESH && comp.debugMesh) {
                // draw debug mesh if enabled graphics
                graphics.strokeColor = _meshColor;
                const iCount = shape.iCount as number;
                const iOffset = shape.iOffset as number;

                for (let ii = iOffset, nn = iOffset + iCount; ii < nn; ii += 3) {
                    const v1 = ibuf[ii] * floatStride;
                    const v2 = ibuf[ii + 1] * floatStride;
                    const v3 = ibuf[ii + 2] * floatStride;

                    graphics.moveTo(vbuf[v1], vbuf[v1 + 1]);
                    graphics.lineTo(vbuf[v2], vbuf[v2 + 1]);
                    graphics.lineTo(vbuf[v3], vbuf[v3 + 1]);
                    graphics.close();
                    graphics.stroke();
                }
            }
        }

        if (comp.debugBones) {
            graphics.strokeColor = _boneColor;
            graphics.fillColor = _slotColor; // Root bone color is same as slot color.

            for (let i = 0, n = locSkeleton.bones.length; i < n; i++) {
                const bone = locSkeleton.bones[i];
                const x = bone.data.length * bone.a + bone.worldX;
                const y = bone.data.length * bone.c + bone.worldY;

                // Bone lengths.
                graphics.moveTo(bone.worldX, bone.worldY);
                graphics.lineTo(x, y);
                graphics.stroke();

                // Bone origins.
                graphics.circle(bone.worldX, bone.worldY, Math.PI * 1.5);
                graphics.fill();
                if (i === 0) {
                    graphics.fillColor = _originColor;
                }
            }
        }
    }
}

function cacheTraverse (comp: Skeleton): void {
    const model = comp.updateRenderData();
    if (!model) return;

    const vc = model.vCount as number;
    const ic = model.iCount as number;
    const rd = comp.renderData!;
    if (rd.vertexCount !== vc || rd.indexCount !== ic) {
        rd.resize(vc, ic);
        rd.indices = new Uint16Array(ic);
    }
    if (vc < 1 || ic < 1) return;

    const vbuf = rd.chunk.vb;
    const vUint8Buf = new Uint8Array(vbuf.buffer, vbuf.byteOffset, Float32Array.BYTES_PER_ELEMENT * vbuf.length);
    vUint8Buf.set(model.vData as TypedArray);

    const nodeColor = comp.color;
    if (nodeColor._val !== 0xffffffff ||  _premultipliedAlpha) {
        _nodeR = nodeColor.r / 255;
        _nodeG = nodeColor.g / 255;
        _nodeB = nodeColor.b / 255;
        _nodeA = nodeColor.a / 255;
        for (let i = 0; i < vc; i++) {
            const index = i * _byteStrideTwoColor + 5 * Float32Array.BYTES_PER_ELEMENT;
            const R = vUint8Buf[index];
            const G = vUint8Buf[index + 1];
            const B = vUint8Buf[index + 2];
            const A = vUint8Buf[index + 3];
            const fA = A * _nodeA;
            const multiplier = _premultipliedAlpha ? fA / 255 :  1;
            vUint8Buf[index] = Math.floor(multiplier * R * _nodeR);
            vUint8Buf[index + 1] = Math.floor(multiplier * G * _nodeG);
            vUint8Buf[index + 2] = Math.floor(multiplier * B * _nodeB);
            vUint8Buf[index + 3] = Math.floor(fA);

            vUint8Buf[index + 4] = Math.floor(vUint8Buf[index + 4] * _nodeR);
            vUint8Buf[index + 5] = Math.floor(vUint8Buf[index + 5] * _nodeG);
            vUint8Buf[index + 6] = Math.floor(vUint8Buf[index + 6] * _nodeB);
            vUint8Buf[index + 7] = _premultipliedAlpha ? 255 : 0;
        }
    }

    const iUint16Buf = rd.indices!;
    iUint16Buf.set(model.iData as TypedArray);
    const chunkOffset = rd.chunk.vertexOffset;
    for (let i = 0; i < ic; i++) {
        iUint16Buf[i] += chunkOffset;
    }

    const meshes = model.meshes;
    const count = meshes.length;
    let indexOffset = 0;
    let indexCount = 0;
    for (let i = 0; i < count; i++) {
        const mesh = meshes[i];
        const material = _getSlotMaterial(mesh.blendMode as number, comp);
        const textureID = mesh.textureID;
        indexCount = mesh.iCount;
        comp.requestDrawData(material, textureID as number, indexOffset, indexCount);
        indexOffset += indexCount;
    }

    const floatStride = _byteStrideTwoColor / Float32Array.BYTES_PER_ELEMENT;
    if (comp.enableBatch) {
        const worldMat = comp.node.worldMatrix;
        let index = 0;
        const tempVecPos = new Vec3(0, 0, 0);
        for (let i = 0; i < vc; i++) {
            index = i * floatStride;
            tempVecPos.x = vbuf[index];
            tempVecPos.y = vbuf[index + 1];
            tempVecPos.z = 0;
            tempVecPos.transformMat4(worldMat);
            vbuf[index] = tempVecPos.x;
            vbuf[index + 1] = tempVecPos.y;
            vbuf[index + 2] = tempVecPos.z;
        }
    }
}

legacyCC.internal.SpineAssembler = simple;
