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
const ttfUtls = require('../../../../utils/label/ttf');
const LabelShadow = require('../../../../../components/CCLabelShadow');
const fillMeshVertices = require('../../utils').fillMeshVertices;
const WHITE = cc.color(255, 255, 255, 255);

module.exports = js.addon({
    createData (comp) {
        let renderData = comp.requestRenderData();

        renderData.dataLength = 4;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;

        return renderData;
    },

    fillBuffers (comp, renderer) {
        let node = comp.node;
        WHITE._fastSetA(node.color.a);
        fillMeshVertices(node, renderer._meshBuffer, comp._renderData, WHITE._val);
    },

    _updateVerts (comp) {
        let renderData = comp._renderData;
        let uv = comp._frame.uv;

        let node = comp.node,
            canvasWidth = comp._ttfTexture.width,
            canvasHeight = comp._ttfTexture.height,
            appx = node.anchorX * node.width,
            appy = node.anchorY * node.height;

        let shadow = LabelShadow && comp.getComponent(LabelShadow);
        if (shadow && shadow._enabled) {
            // adapt size changed caused by shadow
            let offsetX = (canvasWidth - node.width) / 2;
            let offsetY = (canvasHeight - node.height) / 2;

            let shadowOffset = shadow.offset;
            if (-shadowOffset.x > offsetX) {
                // expand to left
                appx += (canvasWidth - node.width);
            }
            else if (offsetX > shadowOffset.x) {
                // expand to left and right
                appx += (offsetX - shadowOffset.x);
            }
            else {
                // expand to right, no need to change render position
            }

            if (-shadowOffset.y > offsetY) {
                // expand to top
                appy += (canvasHeight - node.height);
            }
            else if (offsetY > shadowOffset.y) {
                // expand to top and bottom
                appy += (offsetY - shadowOffset.y);
            }
            else {
                // expand to bottom, no need to change render position
            }
        }

        let verts = renderData.vertices;
        verts[0].x = -appx;
        verts[0].y = -appy;
        verts[1].x = canvasWidth - appx;
        verts[1].y = -appy;
        verts[2].x = -appx;
        verts[2].y = canvasHeight - appy;
        verts[3].x = canvasWidth - appx;
        verts[3].y = canvasHeight - appy;

        verts[0].u = uv[0];
        verts[0].v = uv[1];
        verts[1].u = uv[2];
        verts[1].v = uv[3];
        verts[2].u = uv[4];
        verts[2].v = uv[5];
        verts[3].u = uv[6];
        verts[3].v = uv[7];
    }
}, ttfUtls);
