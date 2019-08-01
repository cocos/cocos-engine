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
import InputAssembler from '../renderer/core/input-assembler';

let TiledMapRenderDataList = cc.Class({
    name: 'cc.TiledMapRenderDataList',

    ctor () {
        this._dataList = [];
        this._offset = 0;
    },

    _pushRenderData () {
        let renderData = {};
        renderData.ia = new InputAssembler();
        renderData.nodesRenderList = [];
        this._dataList.push(renderData);
    },

    popRenderData (buffer) {
        if (this._offset >= this._dataList.length) {
            this._pushRenderData();
        }
        let renderData = this._dataList[this._offset];
        renderData.nodesRenderList.length = 0;
        let ia = renderData.ia;
        ia._vertexBuffer = buffer._vb;
        ia._indexBuffer = buffer._ib;
        ia._start = buffer.indiceOffset;
        ia._count = 0;
        this._offset++;
        return renderData;
    },

    pushNodesList (renderData, nodesList) {
        renderData.nodesRenderList.push(nodesList);
    },

    reset () {
        this._offset = 0;
    }
});

cc.TiledMapRenderDataList = module.exports = TiledMapRenderDataList;