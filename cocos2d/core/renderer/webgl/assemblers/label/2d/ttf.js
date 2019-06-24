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

import TTFAssembler from '../../../../utils/label/ttf';

const LabelShadow = require('../../../../../components/CCLabelShadow');
const WHITE = cc.color(255, 255, 255, 255);

export default class WebglTTFAssembler extends TTFAssembler {
    updateUVs (comp) {
        let verts = this._renderData.vDatas[0];
        let uv = comp._frame.uv;
        let uvOffset = this.uvOffset;
        let floatsPerVert = this.floatsPerVert;
        for (let i = 0; i < 4; i++) {
            let srcOffset = i * 2;
            let dstOffset = floatsPerVert * i + uvOffset;
            verts[dstOffset] = uv[srcOffset];
            verts[dstOffset + 1] = uv[srcOffset + 1];
        }
    }

    updateColor (comp) {
        WHITE._fastSetA(comp.node.color.a);
        let color = WHITE._val;

        super.updateColor(comp, color);
    }

    updateVerts (comp) {
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

        let local = this._local;
        local[0] = -appx;
        local[1] = -appy;
        local[2] = canvasWidth - appx;
        local[3] = canvasHeight - appy;

        this.updateUVs(comp);
        this.updateWorldVerts(comp);
    }
}

