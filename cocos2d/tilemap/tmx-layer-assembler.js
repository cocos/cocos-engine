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

import Assembler from '../core/renderer/assembler';

const TiledLayer = require('./CCTiledLayer');
const TiledMap = require('./CCTiledMap');
const TileFlag = TiledMap.TileFlag;
const FLIPPED_MASK = TileFlag.FLIPPED_MASK;

const renderer = require('../core/renderer/');
const vfmtPosUvColor = require('../core/renderer/webgl/vertex-format').vfmtPosUvColor;

const MaxGridsLimit = parseInt(65535 / 6);
const RenderOrder = TiledMap.RenderOrder;

import { mat4, vec3 } from '../core/vmath';

const RenderFlow = require('../core/renderer/render-flow');

let _mat4_temp = mat4.create();
let _vec3_temp = vec3.create();
let _leftDown = {row:0, col:0};
let _tempUV = {r:0, l:0, t:0, b:0};

let _renderData = null, _ia = null, _fillGrids = 0,
    _vfOffset = 0, _moveX = 0, _moveY = 0, _layerMat = null,
    _renderer = null, _renderDataList = null, _buffer = null, 
    _curMaterial = null, _comp = null, _vbuf = null, _uintbuf = null;

function _visitUserNode (userNode) {
    if (CC_NATIVERENDERER) return;
    userNode._updateLocalMatrix();
    mat4.mul(userNode._worldMatrix, _layerMat, userNode._matrix);
    userNode._renderFlag &= ~(RenderFlow.FLAG_TRANSFORM | RenderFlow.FLAG_BREAK_FLOW);
    RenderFlow.visitRootNode(userNode);
    userNode._renderFlag |= RenderFlow.FLAG_BREAK_FLOW;
}

function _flush () {
    if (_ia._count === 0) {
        return;
    }

    _renderer.material = _renderData.material;
    _renderer.node = _comp.node;
    _renderer._flushIA(_renderData.ia);

    let needSwitchBuffer = (_fillGrids >= MaxGridsLimit);
    if (needSwitchBuffer) {
        _buffer.uploadData();
        _buffer.switchBuffer();
        _vbuf = _buffer._vData;
        _uintbuf = _buffer._uintVData;
        _renderData = _renderDataList.popRenderData(_buffer);
        _ia = _renderData.ia;
        _vfOffset = 0;
        _fillGrids = 0;
    } else {
        _renderData = _renderDataList.popRenderData(_buffer);
        _ia = _renderData.ia;
    }
    _renderData.material = _curMaterial;
}

function _renderNodes (nodeRow, nodeCol) {
    let nodesInfo = _comp._getNodesByRowCol(nodeRow, nodeCol);
    if (!nodesInfo || nodesInfo.count == 0) return;
    let nodesList = nodesInfo.list;
    let newIdx = 0, oldIdx = 0;
    // flush map render data
    _flush();

    _renderer.worldMatDirty++;
    // begin to render nodes
    for (; newIdx < nodesInfo.count; ) {
        let dataComp = nodesList[oldIdx];
        oldIdx++;
        if (!dataComp) continue;
        _visitUserNode(dataComp.node);
        if (newIdx !== oldIdx) {
            nodesList[newIdx] = dataComp;
            dataComp._index = newIdx;
        }
        newIdx++;
    }
    nodesList.length = newIdx;
    _renderer.worldMatDirty--;

    _renderDataList.pushNodesList(_renderData, nodesList);

    // flush user nodes render data
    _renderer._flush();
    _renderer.node = _comp.node;
}

function _flipTexture (outGrid, inGrid, gid) {
    outGrid.r = inGrid.r;
    outGrid.l = inGrid.l;
    outGrid.b = inGrid.b;
    outGrid.t = inGrid.t;

    let tempVal = 0;

    // flip x
    if ((gid & TileFlag.HORIZONTAL) >>> 0) {
        tempVal = inGrid.r;
        outGrid.r = inGrid.l;
        outGrid.l = tempVal;
    }

    // flip y
    if ((gid & TileFlag.HORIZONTAL) >>> 0) {
        tempVal = inGrid.b;
        outGrid.b = inGrid.t;
        outGrid.t = tempVal;
    }
};

export default class TmxAssembler extends Assembler {
    updateRenderData (comp) {
        if (!comp._renderDataList) {
            comp._buffer = new cc.TiledMapBuffer(renderer._handle, vfmtPosUvColor);
            comp._renderDataList = new cc.TiledMapRenderDataList();
        }
    }

    fillBuffers (comp, renderer) {
        let vertices = comp._vertices;
        if (vertices.length === 0 ) return;

        comp._updateCulling();

        let layerNode = comp.node;
        _moveX = comp._leftDownToCenterX;
        _moveY = comp._leftDownToCenterY;
        _layerMat = layerNode._worldMatrix;
        _renderer = renderer;
        _comp = comp;
        _renderDataList = comp._renderDataList;
        _buffer = comp._buffer;

        if (comp._isCullingDirty() || comp._isUserNodeDirty() || comp._hasAnimation() || comp._hasTiledNode()) {
            _buffer.reset();

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
            if (maxGrids > MaxGridsLimit) {
                maxGrids = MaxGridsLimit;
            }

            _buffer.request(maxGrids * 4, maxGrids * 6);

            switch (comp._renderOrder) {
                // left top to right down, col add, row sub, 
                case RenderOrder.RightDown:
                    this.traverseGrids(leftDown, rightTop, -1, 1);
                    break;
                // right top to left down, col sub, row sub
                case RenderOrder.LeftDown:
                    this.traverseGrids(leftDown, rightTop, -1, -1);
                    break;
                // left down to right up, col add, row add
                case RenderOrder.RightUp:
                    this.traverseGrids(leftDown, rightTop, 1, 1);
                    break;
                // right down to left up, col sub, row add
                case RenderOrder.LeftUp:
                    this.traverseGrids(leftDown, rightTop, 1, -1);
                    break;
            }
            comp._setCullingDirty(false);
            comp._setUserNodeDirty(false);

        } else if (!CC_NATIVERENDERER) {
            let renderData = null;
            let nodesRenderList = null;
            let nodesList = null;

            for (let i = 0; i < _renderDataList._offset; i++) {
                renderData = _renderDataList._dataList[i];
                nodesRenderList = renderData.nodesRenderList;
                if (nodesRenderList.length > 0) {
                    renderer.worldMatDirty++;
                    for (let j = 0; j < nodesRenderList.length; j++) {
                        nodesList = nodesRenderList[j];
                        if (!nodesList) continue;
                        for (let idx = 0; idx < nodesList.length; idx++) {
                            let dataComp = nodesList[idx];
                            if (!dataComp) continue;
                            _visitUserNode(dataComp.node);
                        }
                    }
                    renderer.worldMatDirty--;
                    renderer._flush();
                }
                if (renderData.ia._count > 0) {
                    renderer.material = renderData.material;
                    renderer.node = layerNode;
                    renderer._flushIA(renderData.ia);
                }
            }
        }

        _renderData = null;
        _ia = null;
        _layerMat = null;
        _renderer = null;
        _renderDataList = null;
        _buffer = null;
        _curMaterial = null;
        _comp = null;

        _vbuf = null;
        _uintbuf = null;
    }

    // rowMoveDir is -1 or 1, -1 means decrease, 1 means increase
    // colMoveDir is -1 or 1, -1 means decrease, 1 means increase
    traverseGrids (leftDown, rightTop, rowMoveDir, colMoveDir) {
        _renderDataList.reset();

        // show nothing
        if (rightTop.row < 0 || rightTop.col < 0) return;

        _renderData = _renderDataList.popRenderData(_buffer);
        _ia = _renderData.ia;
        _vbuf = _buffer._vData;
        _uintbuf = _buffer._uintVData;
        _fillGrids = 0;
        _vfOffset = 0;
        _curMaterial = null;

        let layerNode = _comp.node;
        let color = layerNode._color._val;
        let tiledTiles = _comp._tiledTiles;
        let texGrids = _comp._texGrids;
        let tiles = _comp._tiles;
        let texIdToMatIdx = _comp._texIdToMatIndex;
        let mats = _comp.sharedMaterials;
    
        let vertices = _comp._vertices;
        let rowData, col, cols, row, rows, colData, tileSize, grid = null, gid = 0;
        let left = 0, bottom = 0, right = 0, top = 0; // x, y
        let tiledNode = null, curTexIdx = -1, matIdx;
        let ul, ur, vt, vb;// u, v
        let colNodesCount = 0, checkColRange = true;

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
            colNodesCount = _comp._getNodesCountByRow(row);
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
                    if (colNodesCount > 0) _renderNodes(row, col);
                    continue;
                }

                gid = tiles[colData.index];
                grid = texGrids[(gid & FLIPPED_MASK) >>> 0];
                
                // check init or new material
                if (curTexIdx !== grid.texId) {
                    // need flush
                    if (curTexIdx !== -1) {
                        _flush();
                    }
                    // update material
                    curTexIdx = grid.texId;
                    matIdx = texIdToMatIdx[curTexIdx];
                    _curMaterial = mats[matIdx];
                    _renderData.material = _curMaterial;
                }
                if (!_curMaterial) continue;

                // calc rect vertex
                left = colData.left - _moveX;
                bottom = colData.bottom - _moveY;
                tileSize = grid.tileset._tileSize;
                right = left + tileSize.width;
                top = bottom + tileSize.height;

                // begin to fill vertex buffer
                tiledNode = tiledTiles[colData.index];
                if (!tiledNode) {
                    // tl
                    _vbuf[_vfOffset] = left;
                    _vbuf[_vfOffset + 1] = top;
                    _uintbuf[_vfOffset + 4] = color;

                    // bl
                    _vbuf[_vfOffset + 5] = left;
                    _vbuf[_vfOffset + 6] = bottom;
                    _uintbuf[_vfOffset + 9] = color;

                    // tr
                    _vbuf[_vfOffset + 10] = right;
                    _vbuf[_vfOffset + 11] = top;
                    _uintbuf[_vfOffset + 14] = color;

                    // br
                    _vbuf[_vfOffset + 15] = right;
                    _vbuf[_vfOffset + 16] = bottom;
                    _uintbuf[_vfOffset + 19] = color;
                } else {
                    this.fillByTiledNode(tiledNode.node, _vbuf, _uintbuf, left, right, top, bottom);
                }

                _flipTexture(_tempUV, grid, gid);
                // calc rect uv
                ul = _tempUV.l;
                ur = _tempUV.r;
                vt = _tempUV.t;
                vb = _tempUV.b;
                
                // vice diagonal
                if ((gid & TileFlag.DIAGONAL) >>> 0) {
                    // bl
                    _vbuf[_vfOffset + 7] = ur;
                    _vbuf[_vfOffset + 8] = vt;

                    // tr
                    _vbuf[_vfOffset + 12] = ul;
                    _vbuf[_vfOffset + 13] = vb;
                } else {
                    // bl
                    _vbuf[_vfOffset + 7] = ul;
                    _vbuf[_vfOffset + 8] = vb;

                    // tr
                    _vbuf[_vfOffset + 12] = ur;
                    _vbuf[_vfOffset + 13] = vt;
                }

                // tl
                _vbuf[_vfOffset + 2] = ul;
                _vbuf[_vfOffset + 3] = vt;

                // br
                _vbuf[_vfOffset + 17] = ur;
                _vbuf[_vfOffset + 18] = vb;

                // modify buffer all kinds of offset
                _vfOffset += 20;
                _buffer.adjust(4, 6);
                _ia._count += 6;
                _fillGrids++;

                // check render users node
                if (colNodesCount > 0) _renderNodes(row, col);

                // vertices count exceed 66635, buffer must be switched
                if (_fillGrids >= MaxGridsLimit) {
                    _flush();
                }
            }
        }

        // upload buffer data
        _buffer.uploadData();

        // last flush
        if (_ia._count > 0) {
            _renderer.material = _renderData.material;
            _renderer.node = _comp.node;
            _renderer._flushIA(_renderData.ia);
        }
    }

    fillByTiledNode (tiledNode, vbuf, uintbuf, left, right, top, bottom) {
        tiledNode._updateLocalMatrix();
        mat4.copy(_mat4_temp, tiledNode._matrix);
        vec3.set(_vec3_temp, -(left + _moveX), -(bottom + _moveY), 0);
        mat4.translate(_mat4_temp, _mat4_temp, _vec3_temp);
        let m = _mat4_temp.m;
        let a = m[0];
        let b = m[1];
        let c = m[4];
        let d = m[5];
        let tx = m[12];
        let ty = m[13];
        let color = tiledNode._color._val;

        // tl
        vbuf[_vfOffset] = left * a + top * c + tx;
        vbuf[_vfOffset + 1] = left * b + top * d + ty;
        uintbuf[_vfOffset + 4] = color;

        // bl
        vbuf[_vfOffset + 5] = left * a + bottom * c + tx;
        vbuf[_vfOffset + 6] = left * b + bottom * d + ty;
        uintbuf[_vfOffset + 9] = color;

        // tr
        vbuf[_vfOffset + 10] = right * a + top * c + tx;
        vbuf[_vfOffset + 11] = right * b + top * d + ty;
        uintbuf[_vfOffset + 14] = color;

        // br
        vbuf[_vfOffset + 15] = right * a + bottom * c + tx;
        vbuf[_vfOffset + 16] = right * b + bottom * d + ty;
        uintbuf[_vfOffset + 19] = color;
    }
}

Assembler.register(TiledLayer, TmxAssembler);
