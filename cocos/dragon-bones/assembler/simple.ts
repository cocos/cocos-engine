/**
 * @packageDocumentation
 * @module dragonBones
 */

import { Armature, BlendMode } from '@cocos/dragonbones-js';
import { Color, Mat4, RenderTexture, Node, Texture2D, Vec3 } from '../../core';
import { BlendFactor } from '../../core/gfx';
import { TextureBase } from '../../core/assets/texture-base';
import { MaterialInstance } from '../../core/renderer/core/material-instance';
import { IAssembler } from '../../2d/renderer/base';
import { Batcher2D } from '../../2d/renderer/batcher-2d';
import { ArmatureFrame } from '../ArmatureCache';
import { ArmatureDisplay, ArmatureDisplayMeshData } from '../ArmatureDisplay';
import { CCSlot } from '../CCSlot';
import { legacyCC } from '../../core/global-exports';

const NEED_COLOR = 0x01;
const NEED_BATCH = 0x10;
const STRIDE_FLOAT = 9;
const STRIDE_BYTES = 9 * 4;

const _boneColor = new Color(255, 0, 0, 255);
const _slotColor = new Color(0, 0, 255, 255);
const _originColor = new Color(0, 255, 0, 255);

/** node R [0,1] */
let _nodeR: number;
/** node G [0,1] */
let _nodeG: number;
/** node B [0,1] */
let _nodeB: number;
/** node alpha [0,1] */
let _nodeA: number;

let _premultipliedAlpha: boolean;
let _multiply: number;
let _mustFlush: boolean;
let _buffer: ArmatureDisplayMeshData | undefined;
let _node: Node | undefined;
let _batcher: Batcher2D | undefined;
let _comp: ArmatureDisplay | undefined;
let _vfOffset: number;
let _indexOffset: number;
let _vertexOffset: number;
let _vertexCount: number;
let _indexCount: number;
let _x: number;
let _y: number;
const _c = new Float32Array(4);
let _handleVal: number;
let _m00: number;
let _m04: number;
let _m12: number;
let _m01: number;
let _m05: number;
let _m13: number;
const _vec3u_temp = new Vec3();

function _getSlotMaterial (tex: RenderTexture | TextureBase | null, blendMode: BlendMode) {
    if (!tex) return null;

    let src: BlendFactor;
    let dst: BlendFactor;
    switch (blendMode) {
    case 1:// additive
        src = _premultipliedAlpha ? BlendFactor.ONE : BlendFactor.SRC_ALPHA;
        dst = BlendFactor.ONE;
        break;
    case 10:// multiply
        src = BlendFactor.DST_COLOR;
        dst = BlendFactor.ONE_MINUS_SRC_ALPHA;
        break;
    case 12:// screen
        src = BlendFactor.ONE;
        dst = BlendFactor.ONE_MINUS_SRC_COLOR;
        break;
    case 0:// normal
    default:
        src = _premultipliedAlpha ? BlendFactor.ONE : BlendFactor.SRC_ALPHA;
        dst = BlendFactor.ONE_MINUS_SRC_ALPHA;
        break;
    }

    // const useModel = !_comp!.enableBatch;
    _comp!.setBlendHash();
    return _comp!.getMaterialForBlend(src, dst);
}

function _handleColor (color: {r:number, g:number, b:number, a:number}, parentOpacity: number) {
    const _a = color.a * parentOpacity * _nodeA;
    const _multiply = _premultipliedAlpha ? _a / 255.0 : 1.0;
    const _r = color.r * _nodeR * _multiply / 255.0;
    const _g = color.g * _nodeG * _multiply / 255.0;
    const _b = color.b * _nodeB * _multiply / 255.0;
    _c[0] = _r;
    _c[1] = _g;
    _c[2] = _b;
    _c[3] = _premultipliedAlpha ? 1.0 : _a / 255.0;
}
function _intToColor (v:number) {
    _c[0] = (0xFF & (v >>> 24)) / 255.0;
    _c[1] = (0xFF & (v >>> 16)) / 255.0;
    _c[2] = (0xFF & (v >>> 8)) / 255.0;
    _c[3] = (0xFF & (v >>> 0)) / 255.0;
}
/**
 * simple 组装器
 * 可通过 `UI.simple` 获取该组装器。
 */
export const simple: IAssembler = {
    createData () {
    },

    updateRenderData (comp: ArmatureDisplay, ui: Batcher2D) {
        _comp = comp;
        updateComponentRenderData(comp, ui);
    },

    updateColor (comp: ArmatureDisplay) {
        if (!comp) return;
        _comp = comp;
        _comp.markForUpdateRenderData();
    },

    fillBuffers (comp: ArmatureDisplay, renderer: Batcher2D) {
        if (!comp || comp.meshRenderDataArray.length === 0) return;

        const dataArray = comp.meshRenderDataArray;
        const node = comp.node;

        let buffer = renderer.acquireBufferBatch()!;
        let floatOffset = buffer.byteOffset >> 2;
        let indicesOffset = buffer.indicesOffset;
        let vertexOffset = buffer.vertexOffset;

        // 当前渲染的数据
        const data = dataArray[comp._meshRenderDataArrayIdx];
        const renderData = data.renderData;

        const isRecreate = buffer.request(renderData.vertexCount, renderData.indicesCount);
        if (!isRecreate) {
            buffer = renderer.currBufferBatch!;
            floatOffset = 0;
            indicesOffset = 0;
            vertexOffset = 0;
        }

        const vBuf = buffer.vData!;
        const iBuf = buffer.iData!;
        const matrix = node.worldMatrix;

        const srcVBuf = renderData.vData;
        const srcVIdx = renderData.vertexStart;
        const srcIBuf = renderData.iData;

        // copy all vertexData
        vBuf.set(srcVBuf.slice(srcVIdx, srcVIdx + renderData.vertexCount * STRIDE_FLOAT), floatOffset);
        if (!comp._enableBatch) {
            for (let i = 0; i < renderData.vertexCount; i++) {
                const pOffset = floatOffset + i * STRIDE_FLOAT;
                _vec3u_temp.set(vBuf[pOffset], vBuf[pOffset + 1], vBuf[pOffset + 2]);
                _vec3u_temp.transformMat4(matrix);
                vBuf[pOffset] = _vec3u_temp.x;
                vBuf[pOffset + 1] = _vec3u_temp.y;
                vBuf[pOffset + 2] = _vec3u_temp.z;
            }
        }

        const srcIOffset = renderData.indicesStart;
        for (let i = 0; i < renderData.indicesCount; i += 1) {
            iBuf[i + indicesOffset] = srcIBuf[i + srcIOffset] + vertexOffset;
        }
    },
};

function realTimeTraverse (armature: Armature, parentMat: Mat4|undefined, parentOpacity: number) {
    const slots = armature._slots;
    let vbuf: Float32Array;
    let ibuf: Uint16Array;
    let material: MaterialInstance;
    let vertices: number[];
    let indices: number[];
    let slotColor: Color;
    let slot: CCSlot;
    const slotMat = new Mat4();

    for (let i = 0, l = slots.length; i < l; i++) {
        slot = slots[i] as CCSlot;
        slotColor = slot._color;

        if (!slot._visible || !slot._displayData) continue;

        if (parentMat) {
            /* enable batch or recursive armature */
            slot._mulMat(slot._worldMatrix, parentMat, slot._matrix);
        } else {
            Mat4.copy(slot._worldMatrix, slot._matrix);
        }

        if (slot.childArmature) {
            realTimeTraverse(slot.childArmature, slot._worldMatrix, parentOpacity * slotColor.a / 255);
            continue;
        }

        material = _getSlotMaterial(slot.getTexture(), slot._blendMode)!;
        if (!material) {
            continue;
        }

        if (!_buffer!.renderData.material) {
            _buffer!.renderData.material = material;
        }

        if (!_buffer!.texture) {
            _buffer!.texture = slot.getTexture();
        }

        if (_mustFlush || material !== _buffer!.renderData.material
            || _buffer!.texture !== slot.getTexture()
        ) {
            _mustFlush = false;
            _buffer = _comp!.requestMeshRenderData();
            _buffer.renderData.material = material;
            _buffer.texture = slot.getTexture();
        }

        _handleColor(slotColor, parentOpacity);
        slotMat.set(slot._worldMatrix);

        vertices = slot._localVertices;
        _vertexCount = vertices.length >> 2;

        indices = slot._indices;
        _indexCount = indices.length;

        const rd = _buffer!.renderData;
        rd.reserve(_vertexCount, _indexCount);

        _indexOffset = rd.indicesCount;
        _vfOffset = rd.vDataOffset;
        _vertexOffset = rd.vertexCount;
        vbuf = _buffer!.renderData.vData;
        ibuf = _buffer!.renderData.iData;

        _m00 = slotMat.m00;
        _m04 = slotMat.m04;
        _m12 = slotMat.m12;
        _m01 = slotMat.m01;
        _m05 = slotMat.m05;
        _m13 = slotMat.m13;
        // vertext format:
        //       x y z u v r g b a
        for (let vi = 0, vl = vertices.length; vi < vl;) {
            _x = vertices[vi++];
            _y = vertices[vi++];

            vbuf[_vfOffset] = _x * _m00 + _y * _m04 + _m12; // x
            vbuf[_vfOffset + 1] = _x * _m01 + _y * _m05 + _m13; // y

            vbuf[_vfOffset + 3] = vertices[vi++]; // u
            vbuf[_vfOffset + 4] = vertices[vi++]; // v

            vbuf.set(_c, _vfOffset + 5);// color
            _vfOffset += STRIDE_FLOAT;
        }

        for (let ii = 0, il = indices.length; ii < il; ii++) {
            ibuf[_indexOffset++] = _vertexOffset + indices[ii];
        }

        _buffer!.renderData.advance(_vertexCount, _indexCount);
    }
}

function cacheTraverse (frame: ArmatureFrame | null, parentMat?: Mat4) {
    if (!frame) return;
    const segments = frame.segments;
    if (segments.length === 0) return;

    let vbuf: Float32Array;
    let ibuf: Uint16Array;
    let material: MaterialInstance;
    // let offsetInfo;
    const vertices = frame.vertices;
    const colorArray = new Uint32Array(vertices.buffer);
    const indices = frame.indices;

    let frameVFOffset = 0; let frameIndexOffset = 0; let segVFCount = 0;
    if (parentMat) {
        _m00 = parentMat.m00;
        _m01 = parentMat.m01;
        _m04 = parentMat.m04;
        _m05 = parentMat.m05;
        _m12 = parentMat.m12;
        _m13 = parentMat.m13;
    }

    const justTranslate = _m00 === 1 && _m01 === 0 && _m04 === 0 && _m05 === 1;
    const needBatch = (_handleVal & NEED_BATCH);
    const calcTranslate = needBatch && justTranslate;

    let colorOffset = 0;
    const colors = frame.colors;
    let nowColor = colors[colorOffset++];
    let maxVFOffset = nowColor.vfOffset!;
    _handleColor(nowColor, 1.0);

    for (let i = 0, n = segments.length; i < n; i++) {
        const segInfo = segments[i];
        material = _getSlotMaterial(segInfo.tex, segInfo.blendMode)!;
        if (!_buffer!.renderData.material) {
            _buffer!.renderData.material = material;
        }
        if (!_buffer!.texture) {
            _buffer!.texture = segInfo.tex as Texture2D;
        }
        if (_mustFlush || _buffer!.renderData.material !== material
        || _buffer!.texture !== segInfo.tex) {
            _mustFlush = false;
            _buffer = _comp!.requestMeshRenderData();
            _buffer.renderData.material = material;
            _buffer.texture = segInfo.tex as Texture2D;
        }

        _vertexCount = segInfo.vertexCount;
        _indexCount = segInfo.indexCount;

        const rd = _buffer!.renderData;
        rd.reserve(_vertexCount, _indexCount);

        _indexOffset = rd.indicesCount;
        _vfOffset = rd.vDataOffset;
        _vertexOffset = rd.vertexCount;
        vbuf = _buffer!.renderData.vData;
        ibuf = _buffer!.renderData.iData;

        for (let ii = _indexOffset, il = _indexOffset + _indexCount; ii < il; ii++) {
            ibuf[ii] = _vertexOffset + indices[frameIndexOffset++];
        }

        segVFCount = segInfo.vfCount;
        // vbuf.set(vertices.subarray(frameVFOffset, frameVFOffset + segVFCount), _vfOffset);
        for (let ii = frameVFOffset, jj = _vfOffset; ii < frameVFOffset + segVFCount;) {
            vbuf[jj] =  vertices[ii++];
            vbuf[jj + 1] =  vertices[ii++];
            vbuf[jj + 3] =  vertices[ii++];
            vbuf[jj + 4] =  vertices[ii++];
            _intToColor(colorArray[ii++]);
            vbuf.set(_c, jj + 5);
            jj += STRIDE_FLOAT;
        }

        frameVFOffset += segVFCount;

        if (calcTranslate) {
            for (let ii = _vfOffset, il = _vfOffset + segVFCount; ii < il; ii += STRIDE_FLOAT) {
                vbuf[ii] += _m12;
                vbuf[ii + 1] += _m13;
            }
        } else if (needBatch) {
            for (let ii = _vfOffset, il = _vfOffset + segVFCount; ii < il; ii += STRIDE_FLOAT) {
                _x = vbuf[ii];
                _y = vbuf[ii + 1];
                vbuf[ii] = _x * _m00 + _y * _m04 + _m12;
                vbuf[ii + 1] = _x * _m01 + _y * _m05 + _m13;
            }
        }

        _buffer!.renderData.advance(_vertexCount, _indexCount);

        if (!(_handleVal & NEED_COLOR)) continue;

        // handle color
        let frameColorOffset = frameVFOffset - segVFCount;
        for (let ii = _vfOffset + 5, il = _vfOffset + 4 + segVFCount; ii < il; ii += STRIDE_FLOAT, frameColorOffset += STRIDE_FLOAT) {
            if (frameColorOffset >= maxVFOffset) {
                nowColor = colors[colorOffset++];
                _handleColor(nowColor, 1.0);
                maxVFOffset = nowColor.vfOffset!;
            }
            vbuf.set(_c, ii);
        }
    }
}

function updateComponentRenderData (comp: ArmatureDisplay, batcher: Batcher2D) {
    // comp.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;

    const armature = comp._armature;
    if (!armature) return;

    comp.markForUpdateRenderData();
    comp.destroyRenderData();

    // Init temp var.
    _mustFlush = true;
    _premultipliedAlpha = comp.premultipliedAlpha;
    _node = comp.node;
    _buffer = comp.requestMeshRenderData();
    _batcher = batcher;
    _comp = comp;
    _handleVal = 0;

    const nodeColor = comp.color;
    _nodeR = nodeColor.r / 255;
    _nodeG = nodeColor.g / 255;
    _nodeB = nodeColor.b / 255;
    _nodeA = nodeColor.a / 255;
    if (nodeColor._val !== 0xffffffff) {
        _handleVal |= NEED_COLOR;
    }

    let worldMat: Mat4 | undefined;
    if (_comp._enableBatch) {
        worldMat = _node.worldMatrix as Mat4;
        _mustFlush = false;
        _handleVal |= NEED_BATCH;
    }

    if (comp.isAnimationCached()) {
        // Traverse input assembler.
        cacheTraverse(comp._curFrame, worldMat);
    } else {
        // Traverse all armature.
        realTimeTraverse(armature, worldMat, 1.0);

        const graphics = comp._debugDraw;
        if (comp.debugBones && graphics) {
            graphics.clear();

            graphics.lineWidth = 5;
            graphics.strokeColor = _boneColor;
            graphics.fillColor = _slotColor; // Root bone color is same as slot color.

            const bones = armature.getBones();
            for (let i = 0, l = bones.length; i < l; i++) {
                const bone = bones[i];
                const boneLength = Math.max(bone.boneData.length, 5);
                const startX = bone.globalTransformMatrix.tx;
                const startY = bone.globalTransformMatrix.ty;
                const endX = startX + bone.globalTransformMatrix.a * boneLength;
                const endY = startY + bone.globalTransformMatrix.b * boneLength;

                graphics.moveTo(startX, startY);
                graphics.lineTo(endX, endY);
                graphics.stroke();

                // Bone origins.
                graphics.circle(startX, startY, Math.PI * 2);
                graphics.fill();
                if (i === 0) {
                    graphics.fillColor = _originColor;
                }
            }
        }
    }

    // sync attached node matrix
    // renderer.worldMatDirty++;
    comp.attachUtil._syncAttachedNode();

    // Clear temp var.
    _node = undefined;
    _buffer = undefined;
    _batcher = undefined;
    _comp = undefined;
}

legacyCC.internal.DragonBonesAssembler = simple;
