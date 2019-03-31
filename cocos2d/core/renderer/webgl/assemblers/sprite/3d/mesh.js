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

const js = require('../../../../../platform/js');
const assembler = require('../2d/mesh');
const fillVerticesWithoutCalc3D = require('../../utils').fillVerticesWithoutCalc3D;

const vec3 = cc.vmath.vec3;
let vec3_temp = vec3.create();

module.exports = js.addon({
    updateWorldVerts (sprite) {
        let node = sprite.node,
            renderData = sprite._renderData,
            data = renderData._data;

        let matrix = node._worldMatrix;
        for (let i = 0, l = renderData.vertexCount; i < l; i++) {
            let local = data[i + l];
            let world = data[i];
            vec3.set(vec3_temp, local.x, local.y, 0);
            vec3.transformMat4(world, vec3_temp, matrix);
        }
    },

    fillBuffers (sprite, renderer) {
        let vertices = sprite.spriteFrame.vertices;
        if (!vertices) {
            return;
        }

        // update world verts
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(sprite);
        }

        // buffer
        let buffer = renderer._meshBuffer3D;
        let node = sprite.node;
        let offsetInfo = fillVerticesWithoutCalc3D(node, buffer, sprite._renderData, node._color._val);

        let ibuf = buffer._iData,
            indiceOffset = offsetInfo.indiceOffset,
            vertexId = offsetInfo.vertexOffset;

        let triangles = vertices.triangles;
        for (let i = 0, l = triangles.length; i < l; i++) {
            ibuf[indiceOffset++] = vertexId + triangles[i];
        }
    },
}, assembler);
