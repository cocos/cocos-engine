/****************************************************************************
 Copyright (c) 2017-2018 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const js = require('../../platform/js');
const assembler = require('./assembler');
const Skeleton = require('../../../../extensions/spine/skeleton');
const spine = require('../../../../extensions/spine/lib/spine');
const renderer = require('../');
const renderEngine = require('../render-engine');
const gfx = renderEngine.gfx;
const SpriteMaterial = renderEngine.SpriteMaterial;
const RenderData = renderEngine.RenderData;

const Node = require('../../CCNode');
const Graphics = require('../../graphics/graphics');
const graphicsAssembler = require('./graphics/graphics-assembler');

let _sharedMaterials = {};

let _slotColor = cc.color(0, 0, 255, 255);
let _boneColor = cc.color(255, 0, 0, 255);
let _originColor = cc.color(0, 255, 0, 255);
let _graphicsNode = new Node();
let _graphics = _graphicsNode.addComponent(Graphics);
let _debugMaterial = new SpriteMaterial();
_debugMaterial.useModel = true;
_debugMaterial.useTexture = false;

function _getSlotMaterial (slot, tex, premultiAlpha) {
    let src, dst;
    switch (slot.data.blendMode) {
        case spine.BlendMode.Additive:
            src = premultiAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
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
            src = premultiAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
            dst = cc.macro.ONE_MINUS_SRC_ALPHA;
            break;
    }
    let key = tex.url + src + dst;
    let material = _sharedMaterials[key];
    let texImpl = tex.getImpl();
    if (!material) {
        material = new SpriteMaterial();
        material.useModel = true;
        // update texture
        material.texture = texImpl;
        // update blend function
        let pass = material._mainTech.passes[0];
        pass.setBlend(
            gfx.BLEND_FUNC_ADD,
            src, dst,
            gfx.BLEND_FUNC_ADD,
            src, dst
        );
        _sharedMaterials[key] = material;
    }
    else if (material.texture !== texImpl) {
        material.texture = texImpl;
    }
    return material;
}

var spineAssembler = js.addon({
    // Use model to avoid per vertex transform
    useModel: true,

    _readAttachmentData (comp, attachment, slot, premultipliedAlpha, renderData, dataOffset) {
        // the vertices in format:
        // X1, Y1, C1R, C1G, C1B, C1A, U1, V1
        // get the vertex data
        let vertices = attachment.updateWorldVertices(slot, premultipliedAlpha);
        let vertexCount = vertices.length / 8;
        // augment render data size to ensure capacity
        renderData.dataLength += vertexCount;
        let data = renderData._data;
        let nodeColor = comp.node._color;
        let nodeR = nodeColor.r,
            nodeG = nodeColor.g,
            nodeB = nodeColor.b,
            nodeA = comp.node._opacity;
        for (var i = 0, n = vertices.length; i < n; i += 8) {
            let r = vertices[i + 2] * nodeR,
                g = vertices[i + 3] * nodeG,
                b = vertices[i + 4] * nodeB,
                a = vertices[i + 5] * nodeA;
            let color = ((a<<24) >>> 0) + (b<<16) + (g<<8) + r;
            let content = data[dataOffset];
            content.x = vertices[i];
            content.y = vertices[i + 1];
            content.color = color;
            content.u = vertices[i + 6];
            content.v = vertices[i + 7];
            dataOffset++;
        }

        if (comp.debugSlots && vertexCount === 4) {
            // Debug Slot
            let VERTEX = spine.RegionAttachment;
            _graphics.strokeColor = _slotColor;
            _graphics.lineWidth = 1;
            _graphics.moveTo(vertices[VERTEX.X1], vertices[VERTEX.Y1]);
            _graphics.lineTo(vertices[VERTEX.X2], vertices[VERTEX.Y2]);
            _graphics.lineTo(vertices[VERTEX.X3], vertices[VERTEX.Y3]);
            _graphics.lineTo(vertices[VERTEX.X4], vertices[VERTEX.Y4]);
            _graphics.close();
            _graphics.stroke();
        }

        return vertexCount;
    },

    genRenderDatas (comp, batchData) {
        let locSkeleton = comp._skeleton;
        let premultiAlpha = comp.premultipliedAlpha;

        if (comp.debugBones || comp.debugSlots) {
            _graphics.clear();
        }

        let attachment, slot;
        let dataId = 0, datas = comp._renderDatas, data = datas[dataId], newData = false;
        if (!data) {
            data = datas[dataId] = RenderData.alloc();
        }
        data.dataLength = 0;
        let indices;
        let material = null, currEffect = null, effect = null;
        let vertexCount = 0, vertexOffset = 0, maxVertex = batchData.MAX_VERTEX - batchData.vertexOffset;
        let indiceCount = 0, indiceOffset = 0, maxIndice = batchData.MAX_INDICE - batchData.indiceOffset;
        for (let i = 0, n = locSkeleton.drawOrder.length; i < n; i++) {
            slot = locSkeleton.drawOrder[i];
            if (!slot.attachment)
                continue;
            attachment = slot.attachment;

            // get the vertices length
            vertexCount = 0;
            if (attachment instanceof spine.RegionAttachment) {
                vertexCount = 4;
                indiceCount = 6;
            }
            else if (attachment instanceof spine.MeshAttachment) {
                vertexCount = attachment.regionUVs.length / 2;
                indiceCount = attachment.triangles.length;
            }
            else {
                continue;
            }

            // no vertices to render
            if (vertexCount === 0) {
                continue;
            }

            newData = false;
            material = _getSlotMaterial(slot, attachment.region.texture._texture, premultiAlpha);
            effect = material.effect;
            // Check break
            if (currEffect !== effect) {
                if (currEffect) {
                    newData = true;
                }
                data.effect = currEffect = effect;
            }
            if (vertexOffset + vertexCount > maxVertex || indiceOffset + vertexCount > maxIndice) {
                currEffect = null;
                newData = true;
            }

            // Request new render data and new vertex content
            if (newData) {
                // set old data vertex indice
                data.vertexCount = vertexOffset;
                data.indiceCount = indiceOffset;
                // gen new data
                dataId++;
                if (!datas[dataId]) {
                    data = datas[dataId] = RenderData.alloc();
                }
                data.dataLength = vertexCount;
                data.effect = currEffect;
                // reset offset
                vertexOffset = 0;
                indiceOffset = 0;
                // reset max because initial max is depending on batchData.vertexOffset & indiceOffset
                maxVertex = batchData.MAX_VERTEX;
                maxIndice = batchData.MAX_INDICE;
            }

            // Fill up indices
            if (attachment instanceof spine.RegionAttachment) {
                indices = data._indices;
                indices[indiceOffset] = vertexOffset;
                indices[indiceOffset + 1] = vertexOffset + 1;
                indices[indiceOffset + 2] = vertexOffset + 2;
                indices[indiceOffset + 3] = vertexOffset + 0;
                indices[indiceOffset + 4] = vertexOffset + 2;
                indices[indiceOffset + 5] = vertexOffset + 3;
            } else {
                let triangles = attachment.triangles;
                for (let t = 0; t < triangles.length; t++) {
                    indices[indiceOffset + t] = vertexOffset + triangles[t];
                }
            }
            indiceOffset += indiceCount;
            // Fill up vertex render data
            vertexOffset += this._readAttachmentData(comp, attachment, slot, premultiAlpha, data, vertexOffset);
        }

        data.vertexCount = vertexOffset;
        data.indiceCount = indiceOffset;
        datas.length = dataId + 1;

        if (comp.debugBones) {
            let bone;
            _graphics.lineWidth = 2;
            _graphics.strokeColor = _boneColor;
            _graphics.fillColor = _slotColor; // Root bone color is same as slot color.

            for (let i = 0, n = locSkeleton.bones.length; i < n; i++) {
                bone = locSkeleton.bones[i];
                let x = bone.data.length * bone.a + bone.worldX;
                let y = bone.data.length * bone.c + bone.worldY;

                // Bone lengths.
                _graphics.moveTo(bone.worldX, bone.worldY);
                _graphics.lineTo(x, y);
                _graphics.stroke();
                
                // Bone origins.
                _graphics.circle(bone.worldX, bone.worldY, 2);
                _graphics.fill();
                if (i == 0) {
                    _graphics.fillColor = _originColor;
                }
            }
        }
        if (comp.debugBones || comp.debugSlots) {
            let renderDatas = _graphics._renderDatas;
            for (let i = 0; i < renderDatas.length; i++) {
                renderDatas[i].effect = _debugMaterial.effect;
                datas.push(renderDatas[i]);
            }
        }
    },

    updateRenderData (comp, batchData) {
        let skeleton = comp._skeleton;
        let state = comp._state;
        if (skeleton) {
            let dt = cc.director.getDeltaTime();
            skeleton.update(dt);

            if (state) {
                dt *= comp.timeScale;
                state.update(dt);
                state.apply(skeleton);
            }

            skeleton.updateWorldTransform();
            this.genRenderDatas(comp, batchData);
        }
        else {
            comp._renderDatas.length = 0;
        }

        return comp._renderDatas;
    },

    fillBuffers (batchData, vertexId, vbuf, uintbuf, ibuf) {
        let data = batchData.data;
        let vertexs = data._data;
        let indices = data._indices;
        let z = batchData.comp.node._position.z;

        // fill vertex buffer
        let offset = batchData.byteOffset / 4;
        let vert;
        for (let i = 0, l = data.dataLength; i < l; i++) {
            vert = vertexs[i];
            vbuf[offset + 0] = vert.x;
            vbuf[offset + 1] = vert.y;
            vbuf[offset + 2] = z;
            vbuf[offset + 4] = vert.u;
            vbuf[offset + 5] = vert.v;
            uintbuf[offset + 3] = vert.color;
            offset += 6;
        }

        // index buffer
        offset = batchData.indiceOffset;
        for (let i = 0, l = indices.length; i < l; i ++) {
            ibuf[offset++] = vertexId + indices[i];
        }
    }
}, assembler);

Skeleton._assembler = spineAssembler;

module.exports = spineAssembler;