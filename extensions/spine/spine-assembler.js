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
const renderer = require('../../cocos2d/core/renderer');
const RenderFlow = require('../../cocos2d/core/renderer/render-flow');
const renderEngine = renderer.renderEngine;
const gfx = renderEngine.gfx;
const SpineMaterial = renderEngine.SpineMaterial;
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

let premultipliedAlpha;
let multiplier;
let slotRangeStart;
let slotRangeEnd;
let useTint;
let debugSlots;
let debugBones;
let nodeR,
    nodeG,
    nodeB,
    nodeA;
let finalColor32, darkColor32;
let vertexFormat;
let perVertexSize;
let perClipVertexSize;
let vertexFloatCount = 0, vertexFloatOffset = 0, vertexOffset = 0,
    indexCount = 0, indexOffset = 0;
let tempr, tempg, tempb, tempa;
let inRange;

function _getSlotMaterial (comp, slot, tex, premultipliedAlpha) {
    let src, dst;
    switch (slot.data.blendMode) {
        case spine.BlendMode.Additive:
            src = premultipliedAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
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
            src = premultipliedAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
            dst = cc.macro.ONE_MINUS_SRC_ALPHA;
            break;
    }

    let key = tex.url + src + dst;
    comp._material = comp._material || new SpineMaterial();
    let baseMaterial = comp._material;
    let materialCache = comp._materialCache;
    let material = materialCache[key];
    if (!material) {

        var baseKey = baseMaterial._hash;
        if (!materialCache[baseKey]) {
            material = baseMaterial;
        } else {
            material = baseMaterial.clone();
        }

        material.useModel = true;
        // Update texture.
        material.texture = tex;
        // Update tint.
        material.useTint = comp.useTint;

        // Update blend function.
        let pass = material._mainTech.passes[0];
        pass.setBlend(
            gfx.BLEND_FUNC_ADD,
            src, dst,
            gfx.BLEND_FUNC_ADD,
            src, dst
        );
        if (materialCache[material._hash]) {
            delete materialCache[material._hash];
        }
        material.updateHash(key);
        materialCache[key] = material;
    }
    else if (material.texture !== tex) {
        if (materialCache[material._hash]) {
            delete materialCache[material._hash];
        }
        material.texture = tex;
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

        tempa = slotColor.a * attachmentColor.a * skeletonColor.a * 255;
        multiplier = premultipliedAlpha? tempa : 255;
        tempr = nodeR * attachmentColor.r * skeletonColor.r * multiplier;
        tempg = nodeG * attachmentColor.g * skeletonColor.g * multiplier;
        tempb = nodeB * attachmentColor.b * skeletonColor.b * multiplier;
        
        _finalColor.r = tempr * slotColor.r;
        _finalColor.g = tempg * slotColor.g;
        _finalColor.b = tempb * slotColor.b;
        _finalColor.a = tempa * nodeA;

        if (slot.darkColor == null) {
            _darkColor.set(0.0, 0, 0, 1.0);
        } else {
            _darkColor.r = slot.darkColor.r * tempr;
            _darkColor.g = slot.darkColor.g * tempg;
            _darkColor.b = slot.darkColor.b * tempb;
        }
        _darkColor.a = premultipliedAlpha ? 255 : 0;

        if (!clipper.isClipping()) {

            finalColor32 = ((_finalColor.a<<24) >>> 0) + (_finalColor.b<<16) + (_finalColor.g<<8) + _finalColor.r;
            darkColor32 = ((_darkColor.a<<24) >>> 0) + (_darkColor.b<<16) + (_darkColor.g<<8) + _darkColor.r;

            if (!useTint) {
                for (let v = vertexFloatOffset, n = vertexFloatOffset + vertexFloatCount, u = 0; v < n; v += perVertexSize, u += 2) {
                    uintVData[v + 4] = finalColor32;
                }
            } else {
                for (let v = vertexFloatOffset, n = vertexFloatOffset + vertexFloatCount, u = 0; v < n; v += perVertexSize, u += 2) {
                    uintVData[v + 4]  = finalColor32;     // light color
                    uintVData[v + 5]  = darkColor32;      // dark color
                }
            }

        } else {
            let uvs = vbuf.subarray(vertexFloatOffset + 2);
            clipper.clipTriangles(vbuf.subarray(vertexFloatOffset), vertexFloatCount, ibuf.subarray(indexOffset), indexCount, uvs, _finalColor, _darkColor, useTint, perVertexSize);
            let clippedVertices = new Float32Array(clipper.clippedVertices);
            let clippedTriangles = clipper.clippedTriangles;
            
            // insure capacity
            indexCount = clippedTriangles.length;
            vertexFloatCount = clippedVertices.length / perClipVertexSize * perVertexSize;

            buffer.request(vertexFloatCount / perVertexSize, indexCount);
            vbuf = buffer._vData,
            ibuf = buffer._iData;
            uintVData = buffer._uintVData;

            // fill indices
            ibuf.set(clippedTriangles, indexOffset);

            // fill vertices contain x y u v light color dark color
            if (!useTint) {
                for (let v = 0, n = clippedVertices.length, offset = vertexFloatOffset; v < n; v += 8, offset += perVertexSize) {
                    vbuf[offset]     = clippedVertices[v];        // x
                    vbuf[offset + 1] = clippedVertices[v + 1];    // y
                    vbuf[offset + 2] = clippedVertices[v + 6];    // u
                    vbuf[offset + 3] = clippedVertices[v + 7];    // v

                    finalColor32 = ((clippedVertices[v + 5]<<24) >>> 0) + (clippedVertices[v + 4]<<16) + (clippedVertices[v + 3]<<8) + clippedVertices[v + 2];
                    uintVData[offset + 4] = finalColor32;
                }
            } else {
                for (let v = 0, n = clippedVertices.length, offset = vertexFloatOffset; v < n; v += 12, offset += perVertexSize) {
                    vbuf[offset] = clippedVertices[v];                 // x
                    vbuf[offset + 1] = clippedVertices[v + 1];         // y
                    vbuf[offset + 2] = clippedVertices[v + 6];         // u
                    vbuf[offset + 3] = clippedVertices[v + 7];         // v

                    finalColor32 = ((clippedVertices[v + 5]<<24) >>> 0) + (clippedVertices[v + 4]<<16) + (clippedVertices[v + 3]<<8) + clippedVertices[v + 2];
                    uintVData[offset + 4] = finalColor32;

                    darkColor32 = ((clippedVertices[v + 11]<<24) >>> 0) + (clippedVertices[v + 10]<<16) + (clippedVertices[v + 9]<<8) + clippedVertices[v + 8];
                    uintVData[offset + 5] = darkColor32;
                }
            }
        }
    },

    fillBuffers (comp, renderer) {
        
        let node = comp.node;
        node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;

        let nodeColor = node._color;
        nodeR = nodeColor.r / 255;
        nodeG = nodeColor.g / 255;
        nodeB = nodeColor.b / 255;
        nodeA = nodeColor.a / 255;

        useTint = comp.useTint;
        vertexFormat = useTint? VFTwoColor : VFOneColor;
        let buffer = renderer.getBuffer('spine', vertexFormat);
        let vbuf;
        let ibuf;

        let locSkeleton = comp._skeleton;
        let skeletonColor = locSkeleton.color;
        let graphics = comp._debugRenderer;
        let clipper = comp._clipper;
        let material = null;
        let attachment, attachmentColor, slotColor, uvs, triangles;

        premultipliedAlpha = comp.premultipliedAlpha;
        multiplier = 1.0;

        slotRangeStart = comp._startSlotIndex;
        slotRangeEnd = comp._endSlotIndex;
        inRange = false;
        if (slotRangeStart == -1) inRange = true;

        debugSlots = comp.debugSlots;
        debugBones = comp.debugBones;
        if (graphics && (debugBones || debugSlots)) {
            graphics.clear();
            graphics.strokeColor = _slotColor;
            graphics.lineWidth = 5;
        }
    
        // x y u v color1 color2 or x y u v color
        perVertexSize = useTint ? 6 : 5;
        // x y u v r1 g1 b1 a1 r2 g2 b2 a2 or x y u v r g b a 
        perClipVertexSize = useTint ? 12 : 8;
    
        vertexFloatCount = 0;
        vertexFloatOffset = 0;
        vertexOffset = 0;
        indexCount = 0;
        indexOffset = 0;

        for (let slotIdx = 0, slotCount = locSkeleton.drawOrder.length; slotIdx < slotCount; slotIdx++) {
            slot = locSkeleton.drawOrder[slotIdx];
    
            if (slotRangeStart >= 0 && slotRangeStart == slot.data.index) {
                inRange = true;
            }
            
            if (!inRange) {
                clipper.clipEndWithSlot(slot);
                continue;
            }
    
            if (slotRangeEnd >= 0 && slotRangeEnd == slot.data.index) {
                inRange = false;
            }
    
            vertexFloatCount = 0;
            indexCount = 0;
    
            indexOffset = buffer.indiceOffset,
            vertexOffset = buffer.vertexOffset,
            vertexFloatOffset = buffer.byteOffset >> 2;

            attachment = slot.getAttachment();
            if (!attachment) continue;

            if (attachment instanceof spine.RegionAttachment) {
                
                triangles = _quadTriangles;
    
                // insure capacity
                vertexFloatCount = 4 * perVertexSize;
                indexCount = 6;

                buffer.request(4, 6);
                vbuf = buffer._vData,
                ibuf = buffer._iData;
                uintVData = buffer._uintVData;
    
                // compute vertex and fill x y
                attachment.computeWorldVertices(slot.bone, vbuf, vertexFloatOffset, perVertexSize);
    
                // draw debug slots if enabled graphics
                if (graphics && debugSlots) {
                    graphics.moveTo(vbuf[vertexFloatOffset], vbuf[vertexFloatOffset + 1]);
                    for (let ii = vertexFloatOffset + perVertexSize, nn = vertexFloatOffset + vertexFloatCount; ii < nn; ii += perVertexSize) {
                        graphics.lineTo(vbuf[ii], vbuf[ii + 1]);
                    }
                    graphics.close();
                    graphics.stroke();
                }
            }
            else if (attachment instanceof spine.MeshAttachment) {
                
                triangles = attachment.triangles;
    
                // insure capacity
                vertexFloatCount = (attachment.worldVerticesLength >> 1) * perVertexSize;
                indexCount = triangles.length;

                buffer.request(vertexFloatCount / perVertexSize, indexCount);
                vbuf = buffer._vData,
                ibuf = buffer._iData;
                uintVData = buffer._uintVData;
    
                // compute vertex and fill x y
                attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, vbuf, vertexFloatOffset, perVertexSize);
            }
            else if (attachment instanceof spine.ClippingAttachment) {
                clipper.clipStart(slot, attachment);
                continue;
            }
            else {
                continue;
            }
    
            if (vertexFloatCount == 0 || indexCount == 0) {
                continue;
            }
    
            // fill indices
            ibuf.set(triangles, indexOffset);

            // fill u v
            uvs = attachment.uvs;
            for (let v = vertexFloatOffset, n = vertexFloatOffset + vertexFloatCount, u = 0; v < n; v += perVertexSize, u += 2) {
                vbuf[v + 2] = uvs[u];           // u
                vbuf[v + 3] = uvs[u + 1];       // v
            }

            material = _getSlotMaterial(comp, slot, attachment.region.texture._texture, premultipliedAlpha);
            if (!material) {
                continue;
            }
    
            if (slotIdx == 0 || material._hash !== renderer.material._hash) {
                renderer._flush();
                renderer.node = node;
                renderer.material = material;
            }

            attachmentColor = attachment.color,
            slotColor = slot.color;

            this.fillVertices(skeletonColor, attachmentColor, slotColor, clipper, buffer);
    
            if (indexCount > 0) {
                for (let ii = indexOffset, nn = indexOffset + indexCount; ii < nn; ii++) {
                    ibuf[ii] += vertexOffset;
                }
                buffer.adjust(vertexFloatCount / perVertexSize, indexCount);
            }
    
            clipper.clipEndWithSlot(slot);
        }
    
        clipper.clipEnd();
    
        if (graphics && debugBones) {
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
