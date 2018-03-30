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

const js = require('../../../platform/js');
const assembler = require('../assembler');
const Label = require('../../../components/CCLabel');
const ttfAssembler = require('./ttf');
const bmfontAssembler = require('./bmfont');

var labelAssembler = js.addon({

    getAssembler (comp) {
        let assembler = ttfAssembler;
        
        if (comp.font instanceof cc.BitmapFont) {
            assembler = bmfontAssembler;
        }

        return assembler;
    },

    updateRenderData (comp) {
        this.datas.length = 0;

        if (comp.string === undefined || 
            comp.string === null || 
            comp.string === "" ||
            !comp._assembler) {
            return this.datas;
        } 

        let renderData = comp._renderData;

        // let size = comp.node._contentSize;
        // let anchor = comp.node._anchorPoint;
        // renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);

        comp._assembler.update(comp);

        renderData.material = comp.getMaterial();
        this.datas.push(renderData);
        return this.datas;
    },

    fillBuffers (comp, batchData, vertexId, vbuf, uintbuf, ibuf) {
        let assembler = comp._assembler;
        if (!assembler) return;

        let vertexOffset = batchData.byteOffset / 4,
            indiceOffset = batchData.indiceOffset;
        
        assembler.fillVertexBuffer(comp, vertexOffset, vbuf, uintbuf);
        assembler.fillIndexBuffer(comp, indiceOffset, vertexId, ibuf);
    }
}, assembler);

Label._assembler = labelAssembler;

module.exports = labelAssembler;