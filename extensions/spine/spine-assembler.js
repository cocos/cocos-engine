/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

import Assembler from '../../cocos2d/core/renderer/assembler';

const Skeleton = require('./Skeleton');
const spine = require('./lib/spine');
const RenderFlow = require('../../cocos2d/core/renderer/render-flow');
const VertexFormat = require('../../cocos2d/core/renderer/webgl/vertex-format')
const VFOneColor = VertexFormat.vfmtPosUvColor;
const VFTwoColor = VertexFormat.vfmtPosUvTwoColor;
const gfx = cc.gfx;

const FLAG_BATCH = 0x10;
const FLAG_TWO_COLOR = 0x01;
const NOT_BATCH_ONE_COLOR = 0x00;
const NOT_BATCH_TWO_COLOR = 0x01;
const BATCH_ONE_COLOR = 0x10;
const BATCH_TWO_COLOR = 0x11;

let _handleVal = 0x00;
let _quadTriangles = [0, 1, 2, 2, 3, 0];
let _slotColor = cc.color(0, 0, 255, 255);
let _boneColor = cc.color(255, 0, 0, 255);
let _originColor = cc.color(0, 255, 0, 255);
let _meshColor = cc.color(255, 255, 0, 255);

let _finalColor = null;
let _darkColor = null;
let _tempPos = null, _tempUv = null;
if (!CC_NATIVERENDERER) {
    _finalColor = new spine.Color(1, 1, 1, 1);
    _darkColor = new spine.Color(1, 1, 1, 1);
    _tempPos = new spine.Vector2();
    _tempUv = new spine.Vector2();
}

let _premultipliedAlpha;
let _multiplier;
let _slotRangeStart;
let _slotRangeEnd;
let _useTint;
let _debugSlots;
let _debugBones;
let _debugMesh;
let _nodeR,
    _nodeG,
    _nodeB,
    _nodeA;
let _finalColor32, _darkColor32;
let _vertexFormat;
let _perVertexSize;
let _perClipVertexSize;

let _vertexFloatCount = 0, _vertexCount = 0, _vertexFloatOffset = 0, _vertexOffset = 0,
    _indexCount = 0, _indexOffset = 0, _vfOffset = 0;
let _tempr, _tempg, _tempb;
let _inRange;
let _mustFlush;
let _x, _y, _m00, _m04, _m12, _m01, _m05, _m13;
let _r, _g, _b, _fr, _fg, _fb, _fa, _dr, _dg, _db, _da;
let _comp, _buffer, _renderer, _node, _needColor, _vertexEffect;

function _getSlotMaterial (tex, blendMode) {
    let src, dst;
    switch (blendMode) {
        case spine.BlendMode.Additive:
            src = _premultipliedAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
            dst = cc.macro.ONE;
            break;
        case spine.BlendMode.Multiply:
            src = cc.macro.DST_COLOR;
            dst = cc.macro.ONE_MINUS_SRC_ALPHA;
            break;
        case spine.BlendMode.Screen:
            src = cc.macro.ONE;
            dst = cc.macro.ONE_MINUS_SRC_COLOR;
            break;
        case spine.BlendMode.Normal:
        default:
            src = _premultipliedAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
            dst = cc.macro.ONE_MINUS_SRC_ALPHA;
            break;
    }

    let useModel = !_comp.enableBatch;
    let key = tex.getId() + src + dst + _useTint + useModel;
    let baseMaterial = _comp.sharedMaterials[0];
    if (!baseMaterial) return null;

    let materialCache = _comp._materialCache;
    let material = materialCache[key];
    if (!material) {
        let baseKey = baseMaterial._hash;
        if (!materialCache[baseKey]) {
            material = baseMaterial;
        } else {
            material = new cc.Material();
            material.copy(baseMaterial);
        }
        
        material.define('CC_USE_MODEL', useModel);
        material.define('USE_TINT', _useTint);
        // update texture
        material.setProperty('texture', tex);

        // update blend function
        material.effect.setBlend(
            true,
            gfx.BLEND_FUNC_ADD,
            src, dst,
            gfx.BLEND_FUNC_ADD,
            src, dst
        );
        material.updateHash(key);
        materialCache[key] = material;
    }
    else if (material.getProperty('texture') !== tex) {
        material.setProperty('texture', tex);
        material.updateHash(key);
    }
    return material;
}

function _handleColor (color) {
    // temp rgb has multiply 255, so need divide 255;
    _fa = color.fa * _nodeA;
    _multiplier = _premultipliedAlpha ? _fa / 255 : 1;
    _r = _nodeR * _multiplier;
    _g = _nodeG * _multiplier;
    _b = _nodeB * _multiplier;

    _fr = color.fr * _r;
    _fg = color.fg * _g;
    _fb = color.fb * _b;
    _finalColor32 = ((_fa<<24) >>> 0) + (_fb<<16) + (_fg<<8) + _fr;

    _dr = color.dr * _r;
    _dg = color.dg * _g;
    _db = color.db * _b;
    _da = _premultipliedAlpha ? 255 : 0;
    _darkColor32 = ((_da<<24) >>> 0) + (_db<<16) + (_dg<<8) + _dr;
}

function _spineColorToInt32 (spineColor) {
    return ((spineColor.a<<24) >>> 0) + (spineColor.b<<16) + (spineColor.g<<8) + spineColor.r;
}

export default class SpineAssembler extends Assembler {
    updateRenderData (comp) {
        let skeleton = comp._skeleton;
        if (skeleton) {
            skeleton.updateWorldTransform();
        }
    }

    fillVertices (skeletonColor, attachmentColor, slotColor, clipper, slot) {

        let vbuf = _buffer._vData,
            ibuf = _buffer._iData,
            uintVData = _buffer._uintVData;
        let offsetInfo;

        _finalColor.a = slotColor.a * attachmentColor.a * skeletonColor.a * _nodeA * 255;
        _multiplier = _premultipliedAlpha? _finalColor.a : 255;
        _tempr = _nodeR * attachmentColor.r * skeletonColor.r * _multiplier;
        _tempg = _nodeG * attachmentColor.g * skeletonColor.g * _multiplier;
        _tempb = _nodeB * attachmentColor.b * skeletonColor.b * _multiplier;
        
        _finalColor.r = _tempr * slotColor.r;
        _finalColor.g = _tempg * slotColor.g;
        _finalColor.b = _tempb * slotColor.b;

        if (slot.darkColor == null) {
            _darkColor.set(0.0, 0.0, 0.0, 1.0);
        } else {
            _darkColor.r = slot.darkColor.r * _tempr;
            _darkColor.g = slot.darkColor.g * _tempg;
            _darkColor.b = slot.darkColor.b * _tempb;
        }
        _darkColor.a = _premultipliedAlpha ? 255 : 0;

        if (!clipper.isClipping()) {
            if (_vertexEffect) {
                for (let v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount; v < n; v += _perVertexSize) {
                    _tempPos.x = vbuf[v];
                    _tempPos.y = vbuf[v + 1];
                    _tempUv.x = vbuf[v + 2];
                    _tempUv.y = vbuf[v + 3];
                    _vertexEffect.transform(_tempPos, _tempUv, _finalColor, _darkColor);

                    vbuf[v]     = _tempPos.x;        // x
                    vbuf[v + 1] = _tempPos.y;        // y
                    vbuf[v + 2] = _tempUv.x;         // u
                    vbuf[v + 3] = _tempUv.y;         // v
                    uintVData[v + 4]  = _spineColorToInt32(_finalColor);                  // light color
                    _useTint && (uintVData[v + 5] = _spineColorToInt32(_darkColor));      // dark color
                }
            } else {
                _finalColor32 = _spineColorToInt32(_finalColor);
                _darkColor32 = _spineColorToInt32(_darkColor);
                
                for (let v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount; v < n; v += _perVertexSize) {
                    uintVData[v + 4]  = _finalColor32;                   // light color
                    _useTint && (uintVData[v + 5]  = _darkColor32);      // dark color
                }
            }
        } else {
            let uvs = vbuf.subarray(_vertexFloatOffset + 2);
            clipper.clipTriangles(vbuf.subarray(_vertexFloatOffset), _vertexFloatCount, ibuf.subarray(_indexOffset), _indexCount, uvs, _finalColor, _darkColor, _useTint, _perVertexSize);
            let clippedVertices = new Float32Array(clipper.clippedVertices);
            let clippedTriangles = clipper.clippedTriangles;
            
            // insure capacity
            _indexCount = clippedTriangles.length;
            _vertexFloatCount = clippedVertices.length / _perClipVertexSize * _perVertexSize;

            offsetInfo = _buffer.request(_vertexFloatCount / _perVertexSize, _indexCount);
            _indexOffset = offsetInfo.indiceOffset,
            _vertexOffset = offsetInfo.vertexOffset,
            _vertexFloatOffset = offsetInfo.byteOffset >> 2;
            vbuf = _buffer._vData,
            ibuf = _buffer._iData;
            uintVData = _buffer._uintVData;

            // fill indices
            ibuf.set(clippedTriangles, _indexOffset);

            // fill vertices contain x y u v light color dark color
            if (_vertexEffect) {
                for (let v = 0, n = clippedVertices.length, offset = _vertexFloatOffset; v < n; v += _perClipVertexSize, offset += _perVertexSize) {
                    _tempPos.x = clippedVertices[v];
                    _tempPos.y = clippedVertices[v + 1];
                    _finalColor.set(clippedVertices[v + 2], clippedVertices[v + 3], clippedVertices[v + 4], clippedVertices[v + 5]);
                    _tempUv.x = clippedVertices[v + 6];
                    _tempUv.y = clippedVertices[v + 7];
                    if (_useTint) {
                        _darkColor.set(clippedVertices[v + 8], clippedVertices[v + 9], clippedVertices[v + 10], clippedVertices[v + 11]);
                    } else {
                        _darkColor.set(0, 0, 0, 0);
                    }
                    _vertexEffect.transform(_tempPos, _tempUv, _finalColor, _darkColor);

                    vbuf[offset] = _tempPos.x;             // x
                    vbuf[offset + 1] = _tempPos.y;         // y
                    vbuf[offset + 2] = _tempUv.x;          // u
                    vbuf[offset + 3] = _tempUv.y;          // v
                    uintVData[offset + 4] = _spineColorToInt32(_finalColor);
                    if (_useTint) {
                        uintVData[offset + 5] = _spineColorToInt32(_darkColor);
                    }
                }
            } else {
                for (let v = 0, n = clippedVertices.length, offset = _vertexFloatOffset; v < n; v += _perClipVertexSize, offset += _perVertexSize) {
                    vbuf[offset]     = clippedVertices[v];         // x
                    vbuf[offset + 1] = clippedVertices[v + 1];     // y
                    vbuf[offset + 2] = clippedVertices[v + 6];     // u
                    vbuf[offset + 3] = clippedVertices[v + 7];     // v

                    _finalColor32 = ((clippedVertices[v + 5]<<24) >>> 0) + (clippedVertices[v + 4]<<16) + (clippedVertices[v + 3]<<8) + clippedVertices[v + 2];
                    uintVData[offset + 4] = _finalColor32;

                    if (_useTint) {
                        _darkColor32 = ((clippedVertices[v + 11]<<24) >>> 0) + (clippedVertices[v + 10]<<16) + (clippedVertices[v + 9]<<8) + clippedVertices[v + 8];
                        uintVData[offset + 5] = _darkColor32;
                    }
                }
            }
        }
    }

    realTimeTraverse (worldMat) {
        let vbuf;
        let ibuf;

        let locSkeleton = _comp._skeleton;
        let skeletonColor = locSkeleton.color;
        let graphics = _comp._debugRenderer;
        let clipper = _comp._clipper;
        let material = null;
        let attachment, attachmentColor, slotColor, uvs, triangles;
        let isRegion, isMesh, isClip;
        let offsetInfo;
        let slot;
        let worldMatm;

        _slotRangeStart = _comp._startSlotIndex;
        _slotRangeEnd = _comp._endSlotIndex;
        _inRange = false;
        if (_slotRangeStart == -1) _inRange = true;

        _debugSlots = _comp.debugSlots;
        _debugBones = _comp.debugBones;
        _debugMesh = _comp.debugMesh;
        if (graphics && (_debugBones || _debugSlots || _debugMesh)) {
            graphics.clear();
            graphics.lineWidth = 2;
        }
    
        // x y u v r1 g1 b1 a1 r2 g2 b2 a2 or x y u v r g b a 
        _perClipVertexSize = _useTint ? 12 : 8;
    
        _vertexFloatCount = 0;
        _vertexFloatOffset = 0;
        _vertexOffset = 0;
        _indexCount = 0;
        _indexOffset = 0;

        for (let slotIdx = 0, slotCount = locSkeleton.drawOrder.length; slotIdx < slotCount; slotIdx++) {
            slot = locSkeleton.drawOrder[slotIdx];
    
            if (_slotRangeStart >= 0 && _slotRangeStart == slot.data.index) {
                _inRange = true;
            }
            
            if (!_inRange) {
                clipper.clipEndWithSlot(slot);
                continue;
            }
    
            if (_slotRangeEnd >= 0 && _slotRangeEnd == slot.data.index) {
                _inRange = false;
            }
    
            _vertexFloatCount = 0;
            _indexCount = 0;

            attachment = slot.getAttachment();
            if (!attachment) {
                clipper.clipEndWithSlot(slot);
                continue;
            }

            isRegion = attachment instanceof spine.RegionAttachment;
            isMesh = attachment instanceof spine.MeshAttachment;
            isClip = attachment instanceof spine.ClippingAttachment;

            if (isClip) {
                clipper.clipStart(slot, attachment);
                continue;
            }

            if (!isRegion && !isMesh) {
                clipper.clipEndWithSlot(slot);
                continue;
            }

            material = _getSlotMaterial(attachment.region.texture._texture, slot.data.blendMode);
            if (!material) {
                clipper.clipEndWithSlot(slot);
                continue;
            }

            if (_mustFlush || material._hash !== _renderer.material._hash) {
                _mustFlush = false;
                _renderer._flush();
                _renderer.node = _node;
                _renderer.material = material;
            }

            if (isRegion) {
                
                triangles = _quadTriangles;
    
                // insure capacity
                _vertexFloatCount = 4 * _perVertexSize;
                _indexCount = 6;

                offsetInfo = _buffer.request(4, 6);
                _indexOffset = offsetInfo.indiceOffset,
                _vertexOffset = offsetInfo.vertexOffset,
                _vertexFloatOffset = offsetInfo.byteOffset >> 2;
                vbuf = _buffer._vData,
                ibuf = _buffer._iData;
    
                // compute vertex and fill x y
                attachment.computeWorldVertices(slot.bone, vbuf, _vertexFloatOffset, _perVertexSize);
    
                // draw debug slots if enabled graphics
                if (graphics && _debugSlots) {
                    graphics.strokeColor = _slotColor;
                    graphics.moveTo(vbuf[_vertexFloatOffset], vbuf[_vertexFloatOffset + 1]);
                    for (let ii = _vertexFloatOffset + _perVertexSize, nn = _vertexFloatOffset + _vertexFloatCount; ii < nn; ii += _perVertexSize) {
                        graphics.lineTo(vbuf[ii], vbuf[ii + 1]);
                    }
                    graphics.close();
                    graphics.stroke();
                }
            }
            else if (isMesh) {
                
                triangles = attachment.triangles;
    
                // insure capacity
                _vertexFloatCount = (attachment.worldVerticesLength >> 1) * _perVertexSize;
                _indexCount = triangles.length;

                offsetInfo = _buffer.request(_vertexFloatCount / _perVertexSize, _indexCount);
                _indexOffset = offsetInfo.indiceOffset,
                _vertexOffset = offsetInfo.vertexOffset,
                _vertexFloatOffset = offsetInfo.byteOffset >> 2;
                vbuf = _buffer._vData,
                ibuf = _buffer._iData;
    
                // compute vertex and fill x y
                attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, vbuf, _vertexFloatOffset, _perVertexSize);

                // draw debug mesh if enabled graphics
                if (graphics && _debugMesh) {
                    graphics.strokeColor = _meshColor;

                    for (let ii = 0, nn = triangles.length; ii < nn; ii += 3) {
                        let v1 = triangles[ii] * _perVertexSize + _vertexFloatOffset;
                        let v2 = triangles[ii + 1] * _perVertexSize + _vertexFloatOffset;
                        let v3 = triangles[ii + 2] * _perVertexSize + _vertexFloatOffset;
                        
                        graphics.moveTo(vbuf[v1], vbuf[v1 + 1]);
                        graphics.lineTo(vbuf[v2], vbuf[v2 + 1]);
                        graphics.lineTo(vbuf[v3], vbuf[v3 + 1]);
                        graphics.close();
                        graphics.stroke();
                    }
                }
            }
    
            if (_vertexFloatCount == 0 || _indexCount == 0) {
                clipper.clipEndWithSlot(slot);
                continue;
            }
    
            // fill indices
            ibuf.set(triangles, _indexOffset);

            // fill u v
            uvs = attachment.uvs;
            for (let v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount, u = 0; v < n; v += _perVertexSize, u += 2) {
                vbuf[v + 2] = uvs[u];           // u
                vbuf[v + 3] = uvs[u + 1];       // v
            }

            attachmentColor = attachment.color,
            slotColor = slot.color;

            this.fillVertices(skeletonColor, attachmentColor, slotColor, clipper, slot);
    
            if (_indexCount > 0) {
                for (let ii = _indexOffset, nn = _indexOffset + _indexCount; ii < nn; ii++) {
                    ibuf[ii] += _vertexOffset;
                }

                if (worldMat) {
                    worldMatm = worldMat.m;
                    _m00 = worldMatm[0];
                    _m04 = worldMatm[4];
                    _m12 = worldMatm[12];
                    _m01 = worldMatm[1];
                    _m05 = worldMatm[5];
                    _m13 = worldMatm[13];
                    for (let ii = _vertexFloatOffset, nn = _vertexFloatOffset + _vertexFloatCount; ii < nn; ii += _perVertexSize) {
                        _x = vbuf[ii];
                        _y = vbuf[ii + 1];
                        vbuf[ii] = _x * _m00 + _y * _m04 + _m12;
                        vbuf[ii + 1] = _x * _m01 + _y * _m05 + _m13;
                    }
                }
                _buffer.adjust(_vertexFloatCount / _perVertexSize, _indexCount);
            }
    
            clipper.clipEndWithSlot(slot);
        }
    
        clipper.clipEnd();
    
        if (graphics && _debugBones) {
            let bone;
            graphics.strokeColor = _boneColor;
            graphics.fillColor = _slotColor; // Root bone color is same as slot color.
    
            for (let i = 0, n = locSkeleton.bones.length; i < n; i++) {
                bone = locSkeleton.bones[i];
                let x = bone.data.length * bone.a + bone.worldX;
                let y = bone.data.length * bone.c + bone.worldY;
    
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

    cacheTraverse (worldMat) {
        
        let frame = _comp._curFrame;
        if (!frame) return;

        let segments = frame.segments;
        if (segments.length == 0) return;

        let vbuf, ibuf, uintbuf;
        let material;
        let offsetInfo;
        let vertices = frame.vertices;
        let indices = frame.indices;
        let uintVert = frame.uintVert;
        let worldMatm;

        let frameVFOffset = 0, frameIndexOffset = 0, segVFCount = 0;
        if (worldMat) {
            worldMatm = worldMat.m;
            _m00 = worldMatm[0];
            _m04 = worldMatm[4];
            _m12 = worldMatm[12];
            _m01 = worldMatm[1];
            _m05 = worldMatm[5];
            _m13 = worldMatm[13];
        }

        let colorOffset = 0;
        let colors = frame.colors;
        let nowColor = colors[colorOffset++];
        let maxVFOffset = nowColor.vfOffset;
        _handleColor(nowColor);

        for (let i = 0, n = segments.length; i < n; i++) {
            let segInfo = segments[i];
            material = _getSlotMaterial(segInfo.tex, segInfo.blendMode);
            if (!material) continue;

            if (_mustFlush || material._hash !== _renderer.material._hash) {
                _mustFlush = false;
                _renderer._flush();
                _renderer.node = _node;
                _renderer.material = material;
            }

            _vertexCount = segInfo.vertexCount;
            _indexCount = segInfo.indexCount;
            _vertexFloatCount = _vertexCount * _perVertexSize;

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
            
            switch (_handleVal) {
                case NOT_BATCH_ONE_COLOR:
                    for (let ii = _vfOffset, il = _vfOffset + _vertexFloatCount; ii < il;) {
                        vbuf[ii++] = vertices[frameVFOffset++];  // x
                        vbuf[ii++] = vertices[frameVFOffset++];  // y
                        vbuf[ii++] = vertices[frameVFOffset++];     // u
                        vbuf[ii++] = vertices[frameVFOffset++];     // v
                        uintbuf[ii++] = uintVert[frameVFOffset++];  // final color
                        frameVFOffset++; // jump dark color
                    }
                break;
                case NOT_BATCH_TWO_COLOR:
                    vbuf.set(vertices.subarray(frameVFOffset, frameVFOffset + _vertexFloatCount), _vfOffset);
                    frameVFOffset += _vertexFloatCount;
                break;
                case BATCH_ONE_COLOR:
                    for (let ii = _vfOffset, il = _vfOffset + _vertexFloatCount; ii < il;) {
                        _x = vertices[frameVFOffset++];
                        _y = vertices[frameVFOffset++];
                        vbuf[ii++] = _x * _m00 + _y * _m04 + _m12;  // x
                        vbuf[ii++] = _x * _m01 + _y * _m05 + _m13;  // y
                        vbuf[ii++] = vertices[frameVFOffset++];     // u
                        vbuf[ii++] = vertices[frameVFOffset++];     // v
                        uintbuf[ii++] = uintVert[frameVFOffset++];  // final color
                        frameVFOffset++;                            // dark color
                    }
                break;
                case BATCH_TWO_COLOR:
                    for (let ii = _vfOffset, il = _vfOffset + _vertexFloatCount; ii < il;) {
                        _x = vertices[frameVFOffset++];
                        _y = vertices[frameVFOffset++];
                        vbuf[ii++] = _x * _m00 + _y * _m04 + _m12;  // x
                        vbuf[ii++] = _x * _m01 + _y * _m05 + _m13;  // y
                        vbuf[ii++] = vertices[frameVFOffset++];     // u
                        vbuf[ii++] = vertices[frameVFOffset++];     // v
                        uintbuf[ii++] = uintVert[frameVFOffset++];  // final color
                        uintbuf[ii++] = uintVert[frameVFOffset++];  // dark color
                    }
                break;
            }

            _buffer.adjust(_vertexCount, _indexCount);
            if ( !_needColor ) continue;

            // handle color
            let frameColorOffset = frameVFOffset - segVFCount;
            for (let ii = _vfOffset + 4, il = _vfOffset + 4 + _vertexFloatCount; ii < il; ii += _perVertexSize, frameColorOffset += 6) {
                if (frameColorOffset >= maxVFOffset) {
                    nowColor = colors[colorOffset++];
                    _handleColor(nowColor);
                    maxVFOffset = nowColor.vfOffset;
                }
                uintbuf[ii] = _finalColor32;
                _useTint && (uintbuf[ii + 1] = _darkColor32);
            }
        }
    }

    fillBuffers (comp, renderer) {
        
        let node = comp.node;
        node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
        if (!comp._skeleton) return;

        let nodeColor = node._color;
        _nodeR = nodeColor.r / 255;
        _nodeG = nodeColor.g / 255;
        _nodeB = nodeColor.b / 255;
        _nodeA = nodeColor.a / 255;

        _useTint = comp.useTint;
        _vertexFormat = _useTint? VFTwoColor : VFOneColor;
        // x y u v color1 color2 or x y u v color
        _perVertexSize = _useTint ? 6 : 5;

        _node = comp.node;
        _buffer = renderer.getBuffer('spine', _vertexFormat);
        _renderer = renderer;
        _comp = comp;

        _mustFlush = true;
        _premultipliedAlpha = comp.premultipliedAlpha;
        _multiplier = 1.0;
        _handleVal = 0x00;
        _needColor = false;
        _vertexEffect = comp._effectDelegate && comp._effectDelegate._vertexEffect;

        if (nodeColor._val !== 0xffffffff || _premultipliedAlpha) {
            _needColor = true;
        }

        if (_useTint) {
            _handleVal |= FLAG_TWO_COLOR;
        }

        let worldMat = undefined;
        if (_comp.enableBatch) {
            worldMat = _node._worldMatrix;
            _mustFlush = false;
            _handleVal |= FLAG_BATCH;
        }

        if (comp.isAnimationCached()) {
            // Traverse input assembler.
            this.cacheTraverse(worldMat);
        } else {
            if (_vertexEffect) _vertexEffect.begin(comp._skeleton);
            this.realTimeTraverse(worldMat);
            if (_vertexEffect) _vertexEffect.end();
        }

        // Clear temp var.
        _node = undefined;
        _buffer = undefined;
        _renderer = undefined;
        _comp = undefined;
        _vertexEffect = null;
    }
}

Assembler.register(Skeleton, SpineAssembler);
