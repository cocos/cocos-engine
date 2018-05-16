/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

const js = require('../../cocos2d/core/platform/js');
const Skeleton = require('./skeleton');
const spine = require('./lib/spine');
const renderer = require('../../cocos2d/core/renderer');
const RenderFlow = require('../../cocos2d/core/renderer/render-flow');
const vfmtPosColorUv = require('../../cocos2d/core/renderer/webgl/vertex-format').vfmtPosColorUv;
const renderEngine = renderer.renderEngine;
const gfx = renderEngine.gfx;
const SpriteMaterial = renderEngine.SpriteMaterial;

let _sharedMaterials = {};

let _slotColor = cc.color(0, 0, 255, 255);
let _boneColor = cc.color(255, 0, 0, 255);
let _originColor = cc.color(0, 255, 0, 255);
let _debugMaterial = new SpriteMaterial();
_debugMaterial.useModel = true;
_debugMaterial.useColor = false;
_debugMaterial.useTexture = false;
_debugMaterial.updateHash();

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
    if (!material) {
        material = new SpriteMaterial();
        material.useModel = true;
        // update texture
        material.texture = tex;
        material.useColor = false;
        
        // update blend function
        let pass = material._mainTech.passes[0];
        pass.setBlend(
            gfx.BLEND_FUNC_ADD,
            src, dst,
            gfx.BLEND_FUNC_ADD,
            src, dst
        );
        _sharedMaterials[key] = material;
        material.updateHash();
    }
    else if (material.texture !== tex) {
        material.texture = tex;
        material.updateHash();
    }
    return material;
}

var spineAssembler = {
    // Use model to avoid per vertex transform
    useModel: true,

    _readAttachmentData (comp, attachment, slot, premultipliedAlpha, renderData, dataOffset) {
        // the vertices in format:
        // X1, Y1, C1R, C1G, C1B, C1A, U1, V1
        // get the vertex data
        let vertices = attachment.updateWorldVertices(slot, premultipliedAlpha);
        let vertexCount = vertices.length / 8;
        let graphics = comp._debugRenderer;
        // augment render data size to ensure capacity
        renderData.dataLength += vertexCount;
        let data = renderData._data;
        let nodeColor = comp.node._color;
        let nodeR = nodeColor.r,
            nodeG = nodeColor.g,
            nodeB = nodeColor.b,
            nodeA = nodeColor.a;
        for (let i = 0, n = vertices.length; i < n; i += 8) {
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
            graphics.strokeColor = _slotColor;
            graphics.lineWidth = 5;
            graphics.moveTo(vertices[VERTEX.X1], vertices[VERTEX.Y1]);
            graphics.lineTo(vertices[VERTEX.X2], vertices[VERTEX.Y2]);
            graphics.lineTo(vertices[VERTEX.X3], vertices[VERTEX.Y3]);
            graphics.lineTo(vertices[VERTEX.X4], vertices[VERTEX.Y4]);
            graphics.close();
            graphics.stroke();
        }

        return vertexCount;
    },

    genRenderDatas (comp, batchData) {
        let locSkeleton = comp._skeleton;
        let premultiAlpha = comp.premultipliedAlpha;
        let graphics = comp._debugRenderer;

        if (comp.debugBones || comp.debugSlots) {
            graphics.clear();
        }

        let attachment, slot;
        let dataId = 0, datas = comp._renderDatas, data = datas[dataId], newData = false;
        if (!data) {
            data = datas[dataId] = comp.requestRenderData();
        }
        data.dataLength = 0;
        let indices;
        let material = null, currMaterial = null;
        let vertexCount = 0, vertexOffset = 0;
        let indiceCount = 0, indiceOffset = 0;
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
            // Check break
            if (currMaterial !== material) {
                if (currMaterial) {
                    newData = true;
                }
                data.material = currMaterial = material;
            }

            // Request new render data and new vertex content
            if (newData) {
                // set old data vertex indice
                data.vertexCount = vertexOffset;
                data.indiceCount = indiceOffset;
                // gen new data
                dataId++;
                if (!datas[dataId]) {
                    data = datas[dataId] = comp.requestRenderData();
                }
                data.dataLength = vertexCount;
                data.material = currMaterial;
                // reset offset
                vertexOffset = 0;
                indiceOffset = 0;
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
            graphics.lineWidth = 5;
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

        if (comp.debugBones || comp.debugSlots) {
            let renderDatas = graphics._impl._renderDatas;
            for (let i = 0; i < renderDatas.length; i++) {
                renderDatas[i].material = _debugMaterial;
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
    },

    fillBuffers (comp, renderer) {
        let renderDatas = comp._renderDatas;
        for (let index = 0, length = renderDatas.length; index < length; index++) {
            let data = renderDatas[index];

            if (data.material !== renderer.material) {
                renderer._flush();
                renderer.node = comp.node;
                renderer.material = data.material;
            }

            let vertexs = data._data;
            let indices = data._indices;

            let buffer = renderer.getBuffer('mesh', vfmtPosColorUv),
                vertexOffset = buffer.byteOffset >> 2,
                vbuf = buffer._vData,
                uintbuf = buffer._uintVData,
                vertexCount = data.vertexCount;
            
            let ibuf = buffer._iData,
                indiceOffset = buffer.indiceOffset,
                vertexId = buffer.vertexOffset;
                
            buffer.request(vertexCount, data.indiceCount);

            // fill vertex buffer
            let vert;
            for (let i = 0, l = data.dataLength; i < l; i++) {
                vert = vertexs[i];
                vbuf[vertexOffset++] = vert.x;
                vbuf[vertexOffset++] = vert.y;
                vbuf[vertexOffset++] = vert.u;
                vbuf[vertexOffset++] = vert.v;
                uintbuf[vertexOffset++] = vert.color;
            }

            // index buffer
            for (let i = 0, l = indices.length; i < l; i ++) {
                ibuf[indiceOffset++] = vertexId + indices[i];
            }
        }

        comp.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
    }
};

Skeleton._assembler = spineAssembler;

module.exports = spineAssembler;