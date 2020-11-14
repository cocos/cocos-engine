import { Color, Component, GFXBlendFactor, macro, Mat4, RenderTexture,Node } from '../../core';
import { TextureBase } from '../../core/assets/texture-base';
import { IAssembler } from '../../core/renderer/ui/base';
import { UI } from '../../core/renderer/ui/ui';
import { ArmatureFrame, ArmatureFrameColor } from '../ArmatureCache';
import { ArmatureDisplay as Armature, ArmatureDisplay } from '../ArmatureDisplay';
import { CCSlot } from '../CCSlot';
import dragonBones from '../lib/dragonBones';


const NEED_COLOR = 0x01;
const NEED_BATCH = 0x10;

const _boneColor = new Color(255, 0, 0, 255);
const _slotColor = new Color(0, 0, 255, 255);
const _originColor = new Color(0, 255, 0, 255);

let _nodeR: number;
let _nodeG: number;
let _nodeB: number;
let _nodeA: number;
let _premultipliedAlpha: boolean;
let _multiply: number;
let _mustFlush: boolean;
let _buffer;
let _node: Node|undefined;
let _renderer;
let _comp: ArmatureDisplay|undefined;
let _vfOffset: number;
let _indexOffset: number;
let _vertexOffset: number;
let _vertexCount: number;
let _indexCount: number;
let _x: number;
let _y: number;
let _c: number;
let _r: number;
let _g: number;
let _b: number;
let _a: number;
let _handleVal: number;
let _m00: number;
let _m04: number;
let _m12: number;
let _m01: number;
let _m05: number;
let _m13: number;

function _getSlotMaterial (tex: RenderTexture | TextureBase | null, blendMode: dragonBones.BlendMode) {
    if (!tex) return null;

    let src: GFXBlendFactor;
    let dst: GFXBlendFactor;
    switch (blendMode) {
        case 1:// additive
            src = _premultipliedAlpha ? GFXBlendFactor.ONE : GFXBlendFactor.SRC_ALPHA;
            dst = GFXBlendFactor.ONE;
            break;
        case 10:// multiply
            src = GFXBlendFactor.DST_COLOR;
            dst = GFXBlendFactor.ONE_MINUS_SRC_ALPHA;
            break;
        case 12:// screen
            src = GFXBlendFactor.ONE;
            dst = GFXBlendFactor.ONE_MINUS_SRC_COLOR;
            break;
        case 0:// normal
        default:
            src = _premultipliedAlpha ? GFXBlendFactor.ONE : GFXBlendFactor.SRC_ALPHA;
            dst = GFXBlendFactor.ONE_MINUS_SRC_ALPHA;
            break;
    }

    const useModel = !_comp!.enableBatch;
    const baseMaterial = _comp!._materials[0];
    if (!baseMaterial) {
        return null;
    }
    const materialCache = _comp!._materialCache;

    // The key use to find corresponding material
    const key = `${tex.id} ${src} ${dst} ${useModel}`;
    let material = materialCache[key];
    if (!material) {
        if (!materialCache.baseMaterial) {
            material = baseMaterial;
            materialCache.baseMaterial = baseMaterial;
        } else {
            material = cc.MaterialVariant.create(baseMaterial);
        }

        material.define('CC_USE_MODEL', useModel);
        material.setProperty('texture', tex);

        // update blend function
        material.setBlend(
            true,
            gfx.BLEND_FUNC_ADD,
            src, dst,
            gfx.BLEND_FUNC_ADD,
            src, dst
        );
        materialCache[key] = material;
    }
    return material;
}

function _handleColor (color: ArmatureFrameColor, parentOpacity: number) {
    _a = color.a * parentOpacity * _nodeA;
    _multiply = _premultipliedAlpha ? _a / 255.0 : 1.0;
    _r = color.r * _nodeR * _multiply;
    _g = color.g * _nodeG * _multiply;
    _b = color.b * _nodeB * _multiply;
    _c = ((_a << 24) >>> 0) + (_b << 16) + (_g << 8) + _r;
}

/**
 * simple 组装器
 * 可通过 `UI.simple` 获取该组装器。
 */
export const simple: IAssembler = {
    createData () {
    },

    updateRenderData (comp: ArmatureDisplay, ui: UI) {
        _comp = comp;
        // if (comp.isAnimationCached()) return;
        const skeleton = comp._skeleton;
        if (skeleton) {
            skeleton.updateWorldTransform();
            updateComponentRenderData(comp, ui);
        }
    },

    updateColor (comp: ArmatureDisplay) {
    },

    fillBuffers (comp: ArmatureDisplay, renderer: UI) {
    },
};

function realTimeTraverse (armature: dragonBones.Armature, parentMat: Mat4, parentOpacity: number) {
    const slots = armature._slots;
    let vbuf:number[];
    let ibuf:number[];
    let uintbuf:number[];
    let material;
    let vertices:number[];
    let indices:number[];
    let slotColor;
    let slot:CCSlot;
    let slotMat:Mat4;
    let offsetInfo;

    for (let i = 0, l = slots.length; i < l; i++) {
        slot = slots[i] as CCSlot;
        slotColor = slot._color;

        if (!slot._visible || !slot._displayData) continue;

        if (parentMat) {
            slot._mulMat(slot._worldMatrix, parentMat, slot._matrix);
        } else {
            Mat4.copy(slot._worldMatrix, slot._matrix);
        }

        if (slot.childArmature) {
            realTimeTraverse(slot.childArmature, slot._worldMatrix, parentOpacity * slotColor.a / 255);
            continue;
        }

        material = _getSlotMaterial(slot.getTexture(), slot._blendMode);
        if (!material) {
            continue;
        }

        if (_mustFlush || material.getHash() !== _renderer.material.getHash()) {
            _mustFlush = false;
            _renderer._flush();
            _renderer.node = _node;
            _renderer.material = material;
        }

        _handleColor(slotColor, parentOpacity);
        slotMat = slot._worldMatrix;

        vertices = slot._localVertices;
        _vertexCount = vertices.length >> 2;

        indices = slot._indices;
        _indexCount = indices.length;

        offsetInfo = _buffer.request(_vertexCount, _indexCount);
        _indexOffset = offsetInfo.indiceOffset;
        _vfOffset = offsetInfo.byteOffset >> 2;
        _vertexOffset = offsetInfo.vertexOffset;
        vbuf = _buffer._vData;
        ibuf = _buffer._iData;
        uintbuf = _buffer._uintVData;

        _m00 = slotMat.m00;
        _m04 = slotMat.m04;
        _m12 = slotMat.m12;
        _m01 = slotMat.m01;
        _m05 = slotMat.m05;
        _m13 = slotMat.m13;

        for (let vi = 0, vl = vertices.length; vi < vl;) {
            _x = vertices[vi++];
            _y = vertices[vi++];

            vbuf[_vfOffset++] = _x * _m00 + _y * _m04 + _m12; // x
            vbuf[_vfOffset++] = _x * _m01 + _y * _m05 + _m13; // y

            vbuf[_vfOffset++] = vertices[vi++]; // u
            vbuf[_vfOffset++] = vertices[vi++]; // v
            uintbuf[_vfOffset++] = _c; // color
        }

        for (let ii = 0, il = indices.length; ii < il; ii++) {
            ibuf[_indexOffset++] = _vertexOffset + indices[ii];
        }
    }
}

function cacheTraverse (frame: ArmatureFrame|null, parentMat?: Mat4) {
    if (!frame) return;
    const segments = frame.segments;
    if (segments.length === 0) return;

    let vbuf:Float32Array;
    let ibuf:Uint16Array;
    let uintbuf:Uint32Array;
    let material;
    let offsetInfo;
    const vertices = frame.vertices;
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
    let maxVFOffset = nowColor.vfOffset;
    _handleColor(nowColor, 1.0);

    for (let i = 0, n = segments.length; i < n; i++) {
        const segInfo = segments[i];
        material = _getSlotMaterial(segInfo.tex, segInfo.blendMode);
        if (_mustFlush || material.getHash() !== _renderer.material.getHash()) {
            _mustFlush = false;
            _renderer._flush();
            _renderer.node = _node;
            _renderer.material = material;
        }

        _vertexCount = segInfo.vertexCount;
        _indexCount = segInfo.indexCount;

        offsetInfo = _buffer.request(_vertexCount, _indexCount);
        _indexOffset = offsetInfo.indiceOffset;
        _vertexOffset = offsetInfo.vertexOffset;
        _vfOffset = offsetInfo.byteOffset >> 2;
        vbuf = _buffer._vData;
        ibuf = _buffer._iData;
        uintbuf = _buffer._uintVData;

        for (let ii = _indexOffset, il = _indexOffset + _indexCount; ii < il; ii++) {
            ibuf[ii] = _vertexOffset + indices[frameIndexOffset++];
        }

        segVFCount = segInfo.vfCount;
        vbuf.set(vertices.subarray(frameVFOffset, frameVFOffset + segVFCount), _vfOffset);
        frameVFOffset += segVFCount;

        if (calcTranslate) {
            for (let ii = _vfOffset, il = _vfOffset + segVFCount; ii < il; ii += 5) {
                vbuf[ii] += _m12;
                vbuf[ii + 1] += _m13;
            }
        } else if (needBatch) {
            for (let ii = _vfOffset, il = _vfOffset + segVFCount; ii < il; ii += 5) {
                _x = vbuf[ii];
                _y = vbuf[ii + 1];
                vbuf[ii] = _x * _m00 + _y * _m04 + _m12;
                vbuf[ii + 1] = _x * _m01 + _y * _m05 + _m13;
            }
        }

        if (!(_handleVal & NEED_COLOR)) continue;

        // handle color
        let frameColorOffset = frameVFOffset - segVFCount;
        for (let ii = _vfOffset + 4, il = _vfOffset + 4 + segVFCount; ii < il; ii += 5, frameColorOffset += 5) {
            if (frameColorOffset >= maxVFOffset) {
                nowColor = colors[colorOffset++];
                _handleColor(nowColor, 1.0);
                maxVFOffset = nowColor.vfOffset;
            }
            uintbuf[ii] = _c;
        }
    }
}

function fillBuffers (comp: ArmatureDisplay, renderer:UI) {
    // comp.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;

    const armature = comp._armature;
    if (!armature) return;

    // Init temp var.
    _mustFlush = true;
    _premultipliedAlpha = comp.premultipliedAlpha;
    _node = comp.node;
    _buffer = renderer._meshBuffer;
    _renderer = renderer;
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

    let worldMat:Mat4;
    if (_comp.enableBatch) {
        worldMat = _node.worldMatrix;
        _mustFlush = false;
        _handleVal |= NEED_BATCH;
    }

    if (comp.isAnimationCached()) {
        // Traverse input assembler.
        cacheTraverse(comp._curFrame, worldMat!);
    } else {
        // Traverse all armature.
        realTimeTraverse(armature, worldMat!, 1.0);

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
    _renderer = undefined;
    _comp = undefined;
}
