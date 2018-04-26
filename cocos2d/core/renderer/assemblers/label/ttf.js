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

const macro = require('../../../platform/CCMacro');
const renderEngine = require('../../render-engine');

const js = require('../../../platform/js');
const ttfUtls = require('../../utils/label/ttf');
const assembler = require('../assembler');

const simpleAssembler = require('../sprite/simple');

module.exports = js.addon({
    createData (comp) {
        let renderData = comp.requestRenderData();

        renderData.dataLength = 4;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;

        let data = renderData._data;
        data[0].u = 0;
        data[0].v = 1;
        data[1].u = 1;
        data[1].v = 1;
        data[2].u = 0;
        data[2].v = 0;
        data[3].u = 1;
        data[3].v = 0;
        return renderData;
    },

    updateRenderData (comp) {
        let datas = this.datas;
        datas.length = 0;

        if (!comp.string) {
            return datas;
        } 

        let renderData = comp._renderData;
        this.update(comp);

        renderData.material = comp.getMaterial();
        datas.push(renderData);
        return datas;
    },

    fillBuffers: simpleAssembler.fillBuffers,

    _updateVerts (comp) {
        let renderData = comp._renderData;

        let node = comp.node,
            width = node.width,
            height = node.height,
            appx = node.anchorX * width,
            appy = node.anchorY * height;

        let data = renderData._data;
        data[0].x = -appx;
        data[0].y = -appy;
        data[1].x = width - appx;
        data[1].y = -appy;
        data[2].x = -appx;
        data[2].y = height - appy;
        data[3].x = width - appx;
        data[3].y = height - appy;
    }
}, ttfUtls, assembler);
