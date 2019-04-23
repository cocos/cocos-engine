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

const TiledLayer = require('./CCTiledLayer');
const TiledMap = require('./CCTiledMap');
const TileFlag = TiledMap.TileFlag;
const FLIPPED_MASK = TileFlag.FLIPPED_MASK;

import IARenderData from '../renderer/render-data/ia-render-data';

const renderer = require('../core/renderer/');
const vfmtPosUvColor = require('../core/renderer/webgl/vertex-format').vfmtPosUvColor;

import InputAssembler from '../renderer/core/input-assembler';

const Orientation = TiledMap.Orientation;
const maxGridsLimit = parseInt(65535 / 6);
const RenderOrder = TiledMap.RenderOrder;

import { mat4, vec3 } from '../core/vmath';

const RenderFlow = require('../core/renderer/render-flow');
const TiledMapBuffer = require('./tiledmap-buffer');

let _mat4_temp = mat4.create();
let _vec3_temp = vec3.create();
let _leftDown = {row:0, col:0};
let _tempUV = {r:0, l:0, t:0, b:0};

let RenderDataList = cc.Class({
    name: 'cc.TiledMapRenderDataList',

    ctor () {
        this._dataList = [];
        this._offset = 0;
    },

    _pushRenderData () {
        let renderData = new IARenderData();
        renderData.ia = new InputAssembler();
        renderData.nodesRenderList = [];
        this._dataList.push(renderData);
    },

    popRenderData (vb, ib, start, count) {
        if (this._offset >= this._dataList.length) {
            this._pushRenderData();
        }
        let renderData = this._dataList[this._offset];
        renderData.nodesRenderList.length = 0;
        let ia = renderData.ia;
        ia._vertexBuffer = vb;
        ia._indexBuffer = ib;
        ia._start = start;
        ia._count = count;
        this._offset++;
        return renderData;
    },

    reset () {
        this._offset = 0;
    }
});

function _visitUserNode (userNode, layerMat, moveX, moveY) {
    userNode._updateLocalMatrix();
    mat4.mul(userNode._worldMatrix, layerMat, userNode._matrix);
    vec3.set(_vec3_temp, -moveX, -moveY, 0);
    mat4.translate(userNode._worldMatrix, userNode._worldMatrix, _vec3_temp);
    userNode._renderFlag &= ~(RenderFlow.FLAG_TRANSFORM | RenderFlow.FLAG_BREAK_FLOW);
    RenderFlow.visitRootNode(userNode);
    userNode._renderFlag |= RenderFlow.FLAG_BREAK_FLOW;
}

let tmxAssembler = {
    updateRenderData (comp) {
        if (!comp._renderDataList) {
            comp._buffer = new TiledMapBuffer(renderer._handle, vfmtPosUvColor);
            comp._renderDataList = new RenderDataList();
        }
    },

    renderIA (comp, renderer) {
        let vertices = comp._vertices;
        if (vertices.length === 0 ) return;

        let buffer = comp._buffer;
        if (comp._isCullingDirty() || comp._isUserNodeDirty() || comp._hasAnimation()) {
            buffer.reset();

            let leftDown, rightTop;
            if (comp._enableCulling) {
               let cullingRect = comp._cullingRect;
               leftDown = cullingRect.leftDown;
               rightTop = cullingRect.rightTop;
            } else {
                leftDown = _leftDown;
                rightTop = comp._rightTop;
            }

            let maxRows = rightTop.row - leftDown.row + 1;
            let maxCols = rightTop.col - leftDown.col + 1;
            let maxGrids = maxRows * maxCols;
            if (maxGrids > maxGridsLimit) {
                maxGrids = maxGridsLimit;
            }

            buffer.request(maxGrids * 4, maxGrids * 6);

            switch (comp._renderOrder) {
                // left top to right down, col add, row sub, 
                case RenderOrder.RightDown:
                    this.traverseGrids(comp, renderer, leftDown, rightTop, -1, 1);
                    break;
                // right top to left down, col sub, row sub
                case RenderOrder.LeftDown:
                    this.traverseGrids(comp, renderer, leftDown, rightTop, -1, -1);
                    break;
                // left down to right up, col add, row add
                case RenderOrder.RightUp:
                    this.traverseGrids(comp, renderer, leftDown, rightTop, 1, 1);
                    break;
                // right down to left up, col sub, row add
                case RenderOrder.LeftUp:
                    this.traverseGrids(comp, renderer, leftDown, rightTop, 1, -1);
                    break;
            }
            comp._setCullingDirty(false);
            comp._setUserNodeDirty(false);

        } else {
            let renderDataList = comp._renderDataList;
            let renderData = null;
            let nodesRenderList = null;
            let nodesList = null;

            let moveX = comp._leftDownToCenterX;
            let moveY = comp._leftDownToCenterY;
            let layerNode = comp.node;
            let layerMat = layerNode._worldMatrix;

            for (let i = 0; i < renderDataList._offset; i++) {
                renderData = renderDataList._dataList[i];
                nodesRenderList = renderData.nodesRenderList;
                if (nodesRenderList.length > 0) {
                    renderer.worldMatDirty++;
                    for (let j = 0; j < nodesRenderList.length; j++) {
                        nodesList = nodesRenderList[j];
                        if (!nodesList) continue;
                        for (let idx = 0; idx < nodesList.length; idx++) {
                            let dataComp = nodesList[idx];
                            if (!dataComp) continue;
                            _visitUserNode(dataComp.node, layerMat, moveX, moveY);
                        }
                    }
                    renderer.worldMatDirty--;
                    renderer._flush();
                    renderer.node = layerNode;
                }
                if (renderData.ia._count > 0) {
                    renderer._flushIA(renderData);
                }
            }
        }
    },

    // rowMoveDir is -1 or 1, -1 means decrease, 1 means increase
    // colMoveDir is -1 or 1, -1 means decrease, 1 means increase
    traverseGrids (comp, renderer, leftDown, rightTop, rowMoveDir, colMoveDir) {
        let renderDataList = comp._renderDataList;
        renderDataList.reset();

        // show nothing
        if (rightTop.row < 0 || rightTop.col < 0) return;

        let buffer = comp._buffer;
        let vbuf = buffer._vData;
        let uintbuf = buffer._uintVData;
        let renderData = renderDataList.popRenderData(buffer._vb, buffer._ib, 0, 0);
        let ia = renderData.ia;

        let layerNode = comp.node;
        let color = layerNode._color._val;
        let tiledTiles = comp._tiledTiles;
        let texGrids = comp._texGrids;
        let tiles = comp._tiles;
        let texIdToMatIdx = comp._texIdToMatIndex;
        let mats = comp.sharedMaterials, curMaterial = null;
        let moveX = comp._leftDownToCenterX;
        let moveY = comp._leftDownToCenterY;
        let layerMat = layerNode._worldMatrix;

        let vertices = comp._vertices;
        let rowData, col, cols, row, rows, colData, tileSize,
            vfOffset = 0, grid = null, gid = 0;
        let fillGrids = 0;
        let left = 0, bottom = 0, right = 0, top = 0; // x, y
        let tiledNode = null, curTexIdx = -1, matIdx;
        let ul, ur, vt, vb;// u, v
        let colNodesCount = 0, checkColRange = true;

        // flush map data inner function
        let flush = function () {
            if (ia._count === 0) {
                return;
            }

            renderer._flushIA(renderData);

            let needSwitchBuffer = (fillGrids >= maxGridsLimit);
            if (needSwitchBuffer) {
                buffer.uploadData();
                buffer.switchBuffer();
                renderData = renderDataList.popRenderData(buffer._vb, buffer._ib, 0, 0);
                ia = renderData.ia;
                vfOffset = 0;
                fillGrids = 0;
            } else {
                renderData = renderDataList.popRenderData(buffer._vb, buffer._ib, buffer.indiceOffset, 0);
                ia = renderData.ia;
            }
            renderData.material = curMaterial;
        }

        // render user nodes inner function
        let renderNodes = function (nodeRow, nodeCol) {
            let nodesInfo = comp._getNodesByRowCol(nodeRow, nodeCol);
            if (!nodesInfo || nodesInfo.count == 0) return;
            let nodesList = nodesInfo.list;
            let newIdx = 0, oldIdx = 0;
            // flush map render data
            flush();
            renderData.nodesRenderList.push(nodesList);

            renderer.worldMatDirty++;
            // begin to render nodes
            for (; newIdx < nodesInfo.count; ) {
                let dataComp = nodesList[oldIdx];
                oldIdx++;
                if (!dataComp) continue;
                _visitUserNode(dataComp.node, layerMat, moveX, moveY);
                if (newIdx !== oldIdx) {
                    nodesList[newIdx] = dataComp;
                    dataComp._index = newIdx;
                }
                newIdx++;
            }
            nodesList.length = newIdx;
            renderer.worldMatDirty--;

            // flush user nodes render data
            renderer._flush();
            renderer.node = layerNode;
        }

        if (rowMoveDir == -1) {
            row = rightTop.row;
            rows = leftDown.row;
        } else {
            row = leftDown.row;
            rows = rightTop.row;
        }

        // traverse row
        for (; (rows - row) * rowMoveDir >= 0; row += rowMoveDir) {
            rowData = vertices[row];
            colNodesCount = comp._getNodesCountByRow(row);
            checkColRange = (colNodesCount == 0 && rowData != undefined);

            // limit min col and max col
            if (colMoveDir == 1) {
                col = checkColRange && leftDown.col < rowData.minCol ? rowData.minCol : leftDown.col;
                cols = checkColRange && rightTop.col > rowData.maxCol ? rowData.maxCol : rightTop.col;
            } else {
                col = checkColRange && rightTop.col > rowData.maxCol ? rowData.maxCol : rightTop.col;
                cols = checkColRange && leftDown.col < rowData.minCol ? rowData.minCol : leftDown.col;
            }

            // traverse col
            for (; (cols - col) * colMoveDir >= 0; col += colMoveDir) {
                colData = rowData && rowData[col];
                if (!colData) {
                    // only render users nodes because map data is empty
                    if (colNodesCount > 0) renderNodes(row, col);
                    continue;
                }

                gid = tiles[colData.index];
                grid = texGrids[(gid & FLIPPED_MASK) >>> 0];
                
                // check init or new material
                if (curTexIdx !== grid.texId) {
                    // need flush
                    if (curTexIdx !== -1) {
                        flush();
                    }
                    // update material
                    curTexIdx = grid.texId;
                    matIdx = texIdToMatIdx[curTexIdx];
                    curMaterial = mats[matIdx];
                    renderData.material = curMaterial;
                }
                if (!curMaterial) continue;

                // calc rect vertex
                left = colData.left - moveX;
                bottom = colData.bottom - moveY;
                tileSize = grid.tileset._tileSize;
                right = left + tileSize.width;
                top = bottom + tileSize.height;

                // begin to fill vertex buffer
                tiledNode = tiledTiles[colData.index];
                if (!tiledNode) {
                    // tl
                    vbuf[vfOffset] = left;
                    vbuf[vfOffset + 1] = top;
                    uintbuf[vfOffset + 4] = color;

                    // bl
                    vbuf[vfOffset + 5] = left;
                    vbuf[vfOffset + 6] = bottom;
                    uintbuf[vfOffset + 9] = color;

                    // tr
                    vbuf[vfOffset + 10] = right;
                    vbuf[vfOffset + 11] = top;
                    uintbuf[vfOffset + 14] = color;

                    // br
                    vbuf[vfOffset + 15] = right;
                    vbuf[vfOffset + 16] = bottom;
                    uintbuf[vfOffset + 19] = color;
                } else {
                    this.fillByTiledNode(tiledNode.node, layerMat, vbuf, uintbuf, vfOffset, left, right, top, bottom);
                }

                TiledMap.flipTexture(_tempUV, grid, gid);
                // calc rect uv
                ul = _tempUV.l;
                ur = _tempUV.r;
                vt = _tempUV.t;
                vb = _tempUV.b;

                // tl
                vbuf[vfOffset + 2] = ul;
                vbuf[vfOffset + 3] = vt;

                // diagonal
                if ((gid & TileFlag.DIAGONAL) >>> 0) {
                    // bl
                    vbuf[vfOffset + 7] = ur;
                    vbuf[vfOffset + 8] = vt;

                    // tr
                    vbuf[vfOffset + 12] = ul;
                    vbuf[vfOffset + 13] = vb;
                } else {
                    // bl
                    vbuf[vfOffset + 7] = ul;
                    vbuf[vfOffset + 8] = vb;

                    // tr
                    vbuf[vfOffset + 12] = ur;
                    vbuf[vfOffset + 13] = vt;
                }

                // br
                vbuf[vfOffset + 17] = ur;
                vbuf[vfOffset + 18] = vb;

                // modify buffer all kinds of offset
                vfOffset += 20;
                buffer.adjust(4, 6);
                ia._count += 6;
                fillGrids++;

                // check render users node
                if (colNodesCount > 0) renderNodes(row, col);

                // vertices count exceed 66635, buffer must be switched
                if (fillGrids >= maxGridsLimit) {
                    flush();
                }
            }
        }

        // upload buffer data
        buffer.uploadData();

        // last flush
        if (ia._count > 0) {
            renderer._flushIA(renderData);
        }
    },

    fillByTiledNode (tiledNode, layerMat, vbuf, uintbuf, vfOffset, left, right, top, bottom) {
        tiledNode._updateLocalMatrix();
        mat4.copy(_mat4_temp, tiledNode._matrix);
        vec3.set(_vec3_temp, -left, -bottom, 0);
        mat4.translate(_mat4_temp, _mat4_temp, _vec3_temp);
        mat4.mul(_mat4_temp, layerMat, _mat4_temp);
        let a = _mat4_temp.m00;
        let b = _mat4_temp.m01;
        let c = _mat4_temp.m04;
        let d = _mat4_temp.m05;
        let tx = _mat4_temp.m12;
        let ty = _mat4_temp.m13;
        let color = tiledNode._color._val;

        // tl
        vbuf[vfOffset] = left * a + top * c + tx;
        vbuf[vfOffset + 1] = left * b + top * d + ty;
        uintbuf[vfOffset + 4] = color;

        // bl
        vbuf[vfOffset + 5] = left * a + bottom * c + tx;
        vbuf[vfOffset + 6] = left * b + bottom * d + ty;
        uintbuf[vfOffset + 9] = color;

        // tr
        vbuf[vfOffset + 10] = right * a + top * c + tx;
        vbuf[vfOffset + 11] = right * b + top * d + ty;
        uintbuf[vfOffset + 14] = color;

        // br
        vbuf[vfOffset + 15] = right * a + bottom * c + tx;
        vbuf[vfOffset + 16] = right * b + bottom * d + ty;
        uintbuf[vfOffset + 19] = color;
    }
};

module.exports = TiledLayer._assembler = tmxAssembler;
