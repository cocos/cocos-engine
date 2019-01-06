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

// vertex size
let _perVertexSize1 = 5;// x y u v c1
let _perVertexSize2 = 6;// x y u v c1 c2

function _insureVerticesCapacity (data, capacity) {
    let oldVertices = data.vertices;
    if (oldVertices.length < capacity) {
        let newVertices = new Float32Array(_perVertexSize2 * capacity + 128);
        newVertices.set(oldVertices);
        data.vertices = newVertices;
        data.colors = new Uint32Array(data.vertices.buffer);
    }

}

function _insureIndicesCapacity (data, capacity) {
    let oldIndices = data.indices;
    if (oldIndices.length < capacity) {
        let newIndices = new Uint16Array(capacity + 128);
        newIndices.set(oldIndices);
        data.indices = newIndices;
    }
}

function _buildFrameData () {
    let frameData = {
        vertices : new Float32Array(_perVertexSize2 * 1024),
        indices : new Uint16Array(1024),
        segment : [],
        vertexCount : 0,
        indexCount : 0,
    }
    frameData.colors = new Uint32Array(frameData.vertices.buffer);
    return frameData;
}

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

        material.useModel = !comp.useBatch;
        // update texture
        material.texture = tex;
        // update tint
        material.useTint = comp.useTint;

        // update blend function
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
        materialCache[material._hash] = material;
    }
    else if (material.texture !== tex) {
        if (materialCache[material._hash]) {
            delete materialCache[material._hash];
        }
        material.texture = tex;
        material.updateHash(key);
        materialCache[material._hash] = material;
    }
    return material;
}

var spineAssembler = {
    // Use model to avoid per vertex transform
    useModel: true,

    genRenderDatas (comp, batchData) {
        if (CC_EDITOR) return;
        let locSkeleton = comp._skeleton;
        let premultipliedAlpha = comp.premultipliedAlpha;
        let graphics = comp._debugRenderer;
        let clipper = comp._clipper;
        let slotRangeStart = comp._startSlotIndex;
        let slotRangeEnd = comp._endSlotIndex;
        let useTint = comp.useTint;
        let debugSlots = comp.debugSlots;
        let debugBones = comp.debugBones;
        let nodeColor = comp.node._color;
        let nodeR = nodeColor.r / 255,
            nodeG = nodeColor.g / 255,
            nodeB = nodeColor.b / 255,
            nodeA = nodeColor.a / 255;
        let finalColor32, darkColor32;

        let renderDatas = comp._renderDatas;
        if (!renderDatas.curFrame) {
            renderDatas.curFrame = _buildFrameData();
        }

        let curFrame = renderDatas.curFrame;
        let vertices = curFrame.vertices;
        let indices = curFrame.indices;
        let colors = curFrame.colors;
        let segment = curFrame.segment;
        
        segment.length = 0;

        if (comp.debugBones || comp.debugSlots) {
            graphics.clear();
            graphics.strokeColor = _slotColor;
            graphics.lineWidth = 5;
        }

        let attachment, attachmentColor, slotColor, uvs, triangles, clippedVertices, clippedTriangles;
        let perVertexSize = useTint ? _perVertexSize2 : _perVertexSize1;

        let material = null, currMaterial = null;
        let vertexCount = 0, vertexOffset = 0,
            indexCount = 0, indexOffset = 0, segmentICount = 0, segmentVCount = 0;
        let inRange = false;
        if (slotRangeStart == -1) inRange = true;

        for (let i = 0, n = locSkeleton.drawOrder.length; i < n; i++) {
            slot = locSkeleton.drawOrder[i];
            attachment = slot.getAttachment();
            if (!attachment) continue;

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

            vertexCount = 0;
            indexCount = 0;

            if (attachment instanceof spine.RegionAttachment) {
                
                triangles = _quadTriangles;

                // insure capacity
                vertexCount = 4 * perVertexSize;
                indexCount = 6;
                _insureIndicesCapacity(curFrame, indexCount + indexOffset);
                _insureVerticesCapacity(curFrame, vertexCount + vertexOffset);
                vertices = curFrame.vertices;
                indices = curFrame.indices;
                colors = curFrame.colors;

                // fill indices
                indices.set(triangles, indexOffset);

                // compute vertex and fill x y
                attachment.computeWorldVertices(slot.bone, vertices, vertexOffset, perVertexSize);

                // draw debug slots if enabled graphics
                if (debugSlots) {
                    graphics.moveTo(vertices[vertexOffset], vertices[vertexOffset + 1]);
                    for (let ii = vertexOffset + perVertexSize, nn = vertexOffset + vertexCount; ii < nn; ii += perVertexSize) {
                        graphics.lineTo(vertices[ii], vertices[ii + 1]);
                    }
                    graphics.close();
                    graphics.stroke();
                }
            }
            else if (attachment instanceof spine.MeshAttachment) {
                
                triangles = attachment.triangles;

                // insure capacity
                vertexCount = (attachment.worldVerticesLength >> 1) * perVertexSize;
                indexCount = triangles.length;
                _insureIndicesCapacity(curFrame, indexCount + indexOffset);
                _insureVerticesCapacity(curFrame, vertexCount + vertexOffset);
                vertices = curFrame.vertices;
                indices = curFrame.indices;
                colors = curFrame.colors;

                // fill indices
                indices.set(triangles, indexOffset);

                // compute vertex and fill x y
                attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, vertices, vertexOffset, perVertexSize);
            }
            else if (attachment instanceof spine.ClippingAttachment) {
                clipper.clipStart(slot, attachment);
                continue;
            }
            else {
                continue;
            }

            if (vertexCount == 0 || indexCount == 0) {
                continue;
            }

            material = _getSlotMaterial(comp, slot, attachment.region.texture._texture, premultipliedAlpha);
            if (!material) {
                continue;
            }

            // Request new render data and new vertex content.
            if (!currMaterial || currMaterial != material) {
                // Push pre segment index and vertex count.
                if (currMaterial) {
                    segment.push(segmentVCount);
                    segment.push(segmentICount);
                }
                currMaterial = material;
                segment.push(currMaterial._hash);
                // Clear next segment index and segmentVCount count.
                segmentICount = 0;
                segmentVCount = 0;
            }

            uvs = attachment.uvs;
            attachmentColor = attachment.color;
            slotColor = slot.color;

            _finalColor.r = nodeR * slotColor.r * attachmentColor.r;
            _finalColor.g = nodeG * slotColor.g * attachmentColor.g;
            _finalColor.b = nodeB * slotColor.b * attachmentColor.b;
            _finalColor.a = nodeA * slotColor.a * attachmentColor.a;
            if (premultipliedAlpha) {
                _finalColor.r *= _finalColor.a;
                _finalColor.g *= _finalColor.a;
                _finalColor.b *= _finalColor.a;
            }

            if (slot.darkColor == null) {
                _darkColor.set(0, 0, 0, 1.0);
            } else {
                if (premultipliedAlpha) {
                    _darkColor.r = slot.darkColor.r * _finalColor.a;
                    _darkColor.g = slot.darkColor.g * _finalColor.a;
                    _darkColor.b = slot.darkColor.b * _finalColor.a;
                } else {
                    _darkColor.setFromColor(slot.darkColor);
                }
                _darkColor.a = premultipliedAlpha ? 1.0 : 0.0;
            }

            _finalColor.r *= 255;
            _finalColor.g *= 255;
            _finalColor.b *= 255;
            _finalColor.a *= 255;

            _darkColor.r *= 255;
            _darkColor.g *= 255;
            _darkColor.b *= 255;
            _darkColor.a *= 255;

            if (clipper.isClipping()) {

                clipper.clipTriangles(vertices.subarray(vertexOffset, vertexOffset + vertexCount), vertexCount, indices.subarray(indexOffset, indexOffset + indexCount), indexCount, uvs, _finalColor, _darkColor, useTint, perVertexSize);
                clippedVertices = new Float32Array(clipper.clippedVertices);
                clippedTriangles = clipper.clippedTriangles;
                
                // insure capacity
                vertexCount = clippedVertices.length;
                indexCount = clippedTriangles.length;
                _insureIndicesCapacity(curFrame, indexCount + indexOffset);
                _insureVerticesCapacity(curFrame, vertexCount + vertexOffset);
                vertices = curFrame.vertices;
                indices = curFrame.indices;
                colors = curFrame.colors;

                // fill indices
                indices.set(clippedTriangles, indexOffset);

                // fill vertices contain x y u v light color dark color
                if (!useTint) {
                    for (let v = 0, n = clippedVertices.length, offset = vertexOffset; v < n; v += 8, offset += perVertexSize) {
                        vertices[offset]     = clippedVertices[v];        // x
                        vertices[offset + 1] = clippedVertices[v + 1];    // y
                        vertices[offset + 2] = clippedVertices[v + 6];    // u
                        vertices[offset + 3] = clippedVertices[v + 7];    // v

                        finalColor32 = ((clippedVertices[v + 5]<<24) >>> 0) + (clippedVertices[v + 4]<<16) + (clippedVertices[v + 3]<<8) + clippedVertices[v + 2];
                        colors[offset + 4] = finalColor32;
                    }
                } else {
                    for (let v = 0, n = clippedVertices.length, offset = vertexOffset; v < n; v += 12, offset += perVertexSize) {
                        vertices[v] = clippedVertices[v];                 // x
                        vertices[v + 1] = clippedVertices[v + 1];         // y
                        vertices[v + 2] = clippedVertices[v + 6];         // u
                        vertices[v + 3] = clippedVertices[v + 7];         // v

                        finalColor32 = ((clippedVertices[v + 5]<<24) >>> 0) + (clippedVertices[v + 4]<<16) + (clippedVertices[v + 3]<<8) + clippedVertices[v + 2];
                        colors[v + 4] = finalColor32;

                        darkColor32 = ((clippedVertices[v + 11]<<24) >>> 0) + (clippedVertices[v + 10]<<16) + (clippedVertices[v + 9]<<8) + clippedVertices[v + 8];
                        colors[v + 5] = darkColor32;
                    }
                }
            } else {
                finalColor32 = ((_finalColor.a<<24) >>> 0) + (_finalColor.b<<16) + (_finalColor.g<<8) + _finalColor.r;
                darkColor32 = ((_darkColor.a<<24) >>> 0) + (_darkColor.b<<16) + (_darkColor.g<<8) + _darkColor.r;

                if (!useTint) {
                    for (let v = vertexOffset, n = vertexOffset + vertexCount, u = 0; v < n; v += perVertexSize, u += 2) {
                        vertices[v + 2] = uvs[u];           // u
                        vertices[v + 3] = uvs[u + 1];       // v
                        colors[v + 4] = finalColor32;
                    }
                } else {
                    for (let v = vertexOffset, n = vertexOffset + vertexCount, u = 0; v < n; v += perVertexSize, u += 2) {
                        vertices[v + 2]  = uvs[u];           // u
                        vertices[v + 3]  = uvs[u + 1];       // v
                        colors[v + 4]  = finalColor32;     // lr
                        colors[v + 5]  = darkColor32;      // lg
                    }
                }
            }

            if (indexCount > 0 && vertexCount > 0) {
                let vertexNum = segmentVCount / perVertexSize;
                for (let ii = indexOffset, nn = indexOffset + indexCount; ii < nn; ii++) {
                    indices[ii] += vertexNum;
                }
                indexOffset += indexCount;
                vertexOffset += vertexCount;
                segmentICount += indexCount;
                segmentVCount += vertexCount;
            }

            clipper.clipEndWithSlot(slot);
        }

        clipper.clipEnd();

        // push last indice offset
        if (segmentVCount > 0 && segmentICount > 0) {
            segment.push(segmentVCount);
            segment.push(segmentICount);
        }
        
        curFrame.vertexCount = vertexOffset;
        curFrame.indexCount = indexOffset;

        if (debugBones) {
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
                graphics.circle(bone.worldX, bone.worldY, Math.PI * 2);
                graphics.fill();
                if (i === 0) {
                    graphics.fillColor = _originColor;
                }
            }
        }
    },

    updateRenderData (comp, batchData) {
        let skeleton = comp._skeleton;
        if (skeleton) {
            skeleton.updateWorldTransform();
            this.genRenderDatas(comp, batchData);
        }
        else {
            comp._renderDatas.length = 0;
        }
    },

    fillBuffers (comp, renderer) {
        if (CC_EDITOR) return;
        let renderDatas = comp._renderDatas;
        let curFrame = renderDatas.curFrame;
        if (!curFrame) return;

        let vertexCount = curFrame.vertexCount;
        let indexCount = curFrame.indexCount;
        if (vertexCount == 0 || indexCount == 0) return;

        let vertices = curFrame.vertices;
        let indices = curFrame.indices;
        let vframeOffset = 0, iframeOffset = 0;
        let segment = curFrame.segment;
        let materialCache = comp._materialCache;
        let matLen = segment.length;
        let matHash, segmentICount = 0, segmentVCount = 0, material;
        let useBatch = comp.useBatch;
        let node = comp.node;
        let useTint = comp.useTint;
        let vertexFormat = useTint? VFTwoColor : VFOneColor;
        var vertexSize = vertexFormat._bytes >> 2;
        let buffer = renderer.getBuffer('mesh', vertexFormat);

        if (!useBatch) {
            renderer._flush();
        }

        for (let index = 0; index < matLen; index +=3) {
            matHash = segment[index];
            segmentVCount = segment[index + 1];
            segmentICount = segment[index + 2];
            material = materialCache[matHash];

            if (!material) continue;

            if (material._hash !== renderer.material._hash) {
                renderer._flush();
                renderer.node = useBatch? renderer._dummyNode : node;
                renderer.material = material;
            }

            let ibufOffset = buffer.indiceOffset,
                vbufOffset = buffer.byteOffset >> 2,
                vertexId = buffer.vertexOffset;

            buffer.request(segmentVCount / vertexSize, segmentICount);
            let vbuf = buffer._vData,
                ibuf = buffer._iData;

            // fill vertex buffer
            vbuf.set(vertices.subarray(vframeOffset, vframeOffset + segmentVCount), vbufOffset);
            vframeOffset += segmentVCount;

            // fill index buffer
            for (let i = 0; i < segmentICount; i ++) {
                ibuf[ibufOffset + i] = vertexId + indices[iframeOffset++];
            }
        }

        comp.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
    }
};

Skeleton._assembler = spineAssembler;

module.exports = spineAssembler;
