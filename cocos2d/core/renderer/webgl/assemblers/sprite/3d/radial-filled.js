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
const assembler = require('../2d/radial-filled');
const fillVertices3D = require('../../utils').fillVertices3D;

module.exports = js.addon({
    fillBuffers (comp, renderer) {
        let node = comp.node,
            color = node._color._val,
            buffer = renderer._meshBuffer3D,
            renderData = comp._renderData;

        let offsetInfo = fillVertices3D(node, buffer, renderData, color);
        let indiceOffset = offsetInfo.indiceOffset,
            vertexId = offsetInfo.vertexOffset;

        // buffer data may be realloc, need get reference after request.
        let ibuf = buffer._iData;
        for (let i = 0; i < renderData.dataLength; i++) {
            ibuf[indiceOffset + i] = vertexId + i;
        }
    },
}, assembler);
