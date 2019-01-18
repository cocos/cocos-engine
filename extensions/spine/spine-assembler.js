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

const Skeleton = require('./Skeleton');
const spine = require('./lib/spine');
const RenderFlow = require('../../cocos2d/core/renderer/render-flow');
const Material = require('../../cocos2d/core/assets/material/CCMaterial');
import gfx from '../../cocos2d/renderer/gfx';
const VertexFormat = require('../../cocos2d/core/renderer/webgl/vertex-format')
const VFOneColor = VertexFormat.vfmtPosUvColor;
const VFTwoColor = VertexFormat.vfmtPosUvTwoColor;

let _quadTriangles = [0, 1, 2, 2, 3, 0];
let _slotColor = cc.color(0, 0, 255, 255);
let _boneColor = cc.color(255, 0, 0, 255);
let _originColor = cc.color(0, 255, 0, 255);

let _finalColor = undefined;
let _darkColor = undefined;
if (!CC_JSB) {
    _finalColor = new spine.Color(1, 1, 1, 1);
    _darkColor = new spine.Color(1, 1, 1, 1);
}

let _premultipliedAlpha;
let _multiplier;
let _slotRangeStart;
let _slotRangeEnd;
let _useTint;
let _debugSlots;
let _debugBones;
let _nodeR,
    _nodeG,
    _nodeB,
    _nodeA;
let _finalColor32, _darkColor32;
let _vertexFormat;
let _perVertexSize;
let _perClipVertexSize;
let _vertexFloatCount = 0, _vertexFloatOffset = 0, _vertexOffset = 0,
    _indexCount = 0, _indexOffset = 0;
let _tempr, _tempg, _tempb, _tempa;
let _inRange;

function _getSlotMaterial (comp, slot, tex) {
    let src, dst;
    switch (slot.data.blendMode) {
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

    let key = tex.url + src + dst;
    comp._material = comp._material || new Material();
    let baseMaterial = comp._material;
    let materialCache = comp._materialCache;
    let material = materialCache[key];
    if (!material) {
        var baseKey = baseMaterial.getHash();
        if (!materialCache[baseKey]) {
            material = baseMaterial;
        } else {
            material = new Material();
            material.copy(baseMaterial);
        }

        material.define('_USE_MODEL', true);
        material.define('USE_TEXTURE', true);
        // update texture
        material.setProperty('texture', tex);

        // update blend function
        let pass = material.effect.getDefaultTechnique().passes[0];
        pass.setBlend(
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
        materialCache[key] = material;
    }
    return material;
}

var spineAssembler = {
    // Use model to avoid per vertex transform.
    useModel: true,

    updateRenderData (comp, batchData) {
        let skeleton = comp._skeleton;
        if (skeleton) {
            skeleton.updateWorldTransform();
        }
    },

    fillVertices (skeletonColor, attachmentColor, slotColor, clipper, buffer) {

        let vbuf = buffer._vData,
            ibuf = buffer._iData,
            uintVData = buffer._uintVData;

        _tempa = slotColor.a * attachmentColor.a * skeletonColor.a * 255;
        _multiplier = _premultipliedAlpha? _tempa : 255;
        _tempr = _nodeR * attachmentColor.r * skeletonColor.r * _multiplier;
        _tempg = _nodeG * attachmentColor.g * skeletonColor.g * _multiplier;
        _tempb = _nodeB * attachmentColor.b * skeletonColor.b * _multiplier;
        
        _finalColor.r = _tempr * slotColor.r;
        _finalColor.g = _tempg * slotColor.g;
        _finalColor.b = _tempb * slotColor.b;
        _finalColor.a = _tempa * _nodeA;

        if (slot.darkColor == null) {
            _darkColor.set(0.0, 0, 0, 1.0);
        } else {
            _darkColor.r = slot.darkColor.r * _tempr;
            _darkColor.g = slot.darkColor.g * _tempg;
            _darkColor.b = slot.darkColor.b * _tempb;
        }
        _darkColor.a = _premultipliedAlpha ? 255 : 0;

        if (!clipper.isClipping()) {

            _finalColor32 = ((_finalColor.a<<24) >>> 0) + (_finalColor.b<<16) + (_finalColor.g<<8) + _finalColor.r;
            _darkColor32 = ((_darkColor.a<<24) >>> 0) + (_darkColor.b<<16) + (_darkColor.g<<8) + _darkColor.r;

            if (!_useTint) {
                for (let v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount, u = 0; v < n; v += _perVertexSize, u += 2) {
                    uintVData[v + 4] = _finalColor32;
                }
            } else {
                for (let v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount, u = 0; v < n; v += _perVertexSize, u += 2) {
                    uintVData[v + 4]  = _finalColor32;     // light color
                    uintVData[v + 5]  = _darkColor32;      // dark color
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

            buffer.request(_vertexFloatCount / _perVertexSize, _indexCount);
            vbuf = buffer._vData,
            ibuf = buffer._iData;
            uintVData = buffer._uintVData;

            // fill indices
            ibuf.set(clippedTriangles, _indexOffset);

            // fill vertices contain x y u v light color dark color
            if (!_useTint) {
                for (let v = 0, n = clippedVertices.length, offset = _vertexFloatOffset; v < n; v += 8, offset += _perVertexSize) {
                    vbuf[offset]     = clippedVertices[v];        // x
                    vbuf[offset + 1] = clippedVertices[v + 1];    // y
                    vbuf[offset + 2] = clippedVertices[v + 6];    // u
                    vbuf[offset + 3] = clippedVertices[v + 7];    // v

                    _finalColor32 = ((clippedVertices[v + 5]<<24) >>> 0) + (clippedVertices[v + 4]<<16) + (clippedVertices[v + 3]<<8) + clippedVertices[v + 2];
                    uintVData[offset + 4] = _finalColor32;
                }
            } else {
                for (let v = 0, n = clippedVertices.length, offset = _vertexFloatOffset; v < n; v += 12, offset += _perVertexSize) {
                    vbuf[offset] = clippedVertices[v];                 // x
                    vbuf[offset + 1] = clippedVertices[v + 1];         // y
                    vbuf[offset + 2] = clippedVertices[v + 6];         // u
                    vbuf[offset + 3] = clippedVertices[v + 7];         // v

                    _finalColor32 = ((clippedVertices[v + 5]<<24) >>> 0) + (clippedVertices[v + 4]<<16) + (clippedVertices[v + 3]<<8) + clippedVertices[v + 2];
                    uintVData[offset + 4] = _finalColor32;

                    _darkColor32 = ((clippedVertices[v + 11]<<24) >>> 0) + (clippedVertices[v + 10]<<16) + (clippedVertices[v + 9]<<8) + clippedVertices[v + 8];
                    uintVData[offset + 5] = _darkColor32;
                }
            }
        }
    },

    fillBuffers (comp, renderer) {
        
        let node = comp.node;
        node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;

        let nodeColor = node._color;
        _nodeR = nodeColor.r / 255;
        _nodeG = nodeColor.g / 255;
        _nodeB = nodeColor.b / 255;
        _nodeA = nodeColor.a / 255;

        _useTint = comp.useTint;
        _vertexFormat = _useTint? VFTwoColor : VFOneColor;
        let buffer = renderer.getBuffer('spine', _vertexFormat);
        let vbuf;
        let ibuf;

        let locSkeleton = comp._skeleton;
        let skeletonColor = locSkeleton.color;
        let graphics = comp._debugRenderer;
        let clipper = comp._clipper;
        let material = null;
        let attachment, attachmentColor, slotColor, uvs, triangles;
        let hasFlush = false;
        let isRegion, isMesh, isClip;

        _premultipliedAlpha = comp.premultipliedAlpha;
        _multiplier = 1.0;

        _slotRangeStart = comp._startSlotIndex;
        _slotRangeEnd = comp._endSlotIndex;
        _inRange = false;
        if (_slotRangeStart == -1) _inRange = true;

        _debugSlots = comp.debugSlots;
        _debugBones = comp.debugBones;
        if (graphics && (_debugBones || _debugSlots)) {
            graphics.clear();
            graphics.strokeColor = _slotColor;
            graphics.lineWidth = 5;
        }
    
        // x y u v color1 color2 or x y u v color
        _perVertexSize = _useTint ? 6 : 5;
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
    
            _indexOffset = buffer.indiceOffset,
            _vertexOffset = buffer.vertexOffset,
            _vertexFloatOffset = buffer.byteOffset >> 2;

            attachment = slot.getAttachment();
            if (!attachment) continue;

            isRegion = attachment instanceof spine.RegionAttachment;
            isMesh = attachment instanceof spine.MeshAttachment;
            isClip = attachment instanceof spine.ClippingAttachment;

            if (isClip) {
                clipper.clipStart(slot, attachment);
                continue;
            }

            if (!isRegion && !isMesh) continue;

            material = _getSlotMaterial(comp, slot, attachment.region.texture._texture);
            if (!material) {
                continue;
            }
    
            if (!hasFlush || material._hash !== renderer.material._hash) {
                hasFlush = true;
                renderer._flush();
                renderer.node = node;
                renderer.material = material;
            }

            if (isRegion) {
                
                triangles = _quadTriangles;
    
                // insure capacity
                _vertexFloatCount = 4 * _perVertexSize;
                _indexCount = 6;

                buffer.request(4, 6);
                vbuf = buffer._vData,
                ibuf = buffer._iData;
                uintVData = buffer._uintVData;
    
                // compute vertex and fill x y
                attachment.computeWorldVertices(slot.bone, vbuf, _vertexFloatOffset, _perVertexSize);
    
                // draw debug slots if enabled graphics
                if (graphics && _debugSlots) {
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

                buffer.request(_vertexFloatCount / _perVertexSize, _indexCount);
                vbuf = buffer._vData,
                ibuf = buffer._iData;
                uintVData = buffer._uintVData;
    
                // compute vertex and fill x y
                attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, vbuf, _vertexFloatOffset, _perVertexSize);
            }
    
            if (_vertexFloatCount == 0 || _indexCount == 0) {
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

            this.fillVertices(skeletonColor, attachmentColor, slotColor, clipper, buffer);
    
            if (_indexCount > 0) {
                for (let ii = _indexOffset, nn = _indexOffset + _indexCount; ii < nn; ii++) {
                    ibuf[ii] += _vertexOffset;
                }
                buffer.adjust(_vertexFloatCount / _perVertexSize, _indexCount);
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
                if (bone.parent == null) continue;
                let x = bone.data.length * bone.a + bone.worldX;
                let y = bone.data.length * bone.c + bone.worldY;
    
                // Bone lengths.
                graphics.moveTo(bone.worldX, bone.worldY);
                graphics.lineTo(x, y);
                graphics.stroke();
    
                // Bone origins.
                graphics.circle(bone.worldX, bone.worldY, Math.PI * 2);
                graphics.fill();
                if (i === 0) {
                    graphics.fillColor = _originColor;
                }
            }
        }
    
    }
};

Skeleton._assembler = spineAssembler;

module.exports = spineAssembler;
