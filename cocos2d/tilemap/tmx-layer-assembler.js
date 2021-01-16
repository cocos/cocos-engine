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
const vfmtPosUv = require('../core/renderer/webgl/vertex-format').vfmtPosUv;


const MaxGridsLimit = parseInt(65535 / 6);
const RenderOrder = TiledMap.RenderOrder;

import { Mat4, Vec3 } from '../core/value-types';

const RenderFlow = require('../core/renderer/render-flow');

let _mat4_temp = cc.mat4();
let _vec3_temp = cc.v3();
let _leftDown = {row:0, col:0};
let _uva = {x:0, y:0};
let _uvb = {x:0, y:0};
let _uvc = {x:0, y:0};
let _uvd = {x:0, y:0};

let _renderData = null, _ia = null, _fillGrids = 0,
    _vfOffset = 0, _moveX = 0, _moveY = 0, _layerMat = null,
    _renderer = null, _renderDataList = null, _buffer = null,
    _curMaterial = null, _comp = null, _vbuf = null, _uintbuf = null;

function _visitUserNode (userNode) {
    if (CC_NATIVERENDERER) return;
    userNode._updateLocalMatrix();
    Mat4.mul(userNode._worldMatrix, _layerMat, userNode._matrix);
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
    if (!nodesInfo || nodesInfo.count === 0) return;
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

/*
texture coordinate
a c
b d
*/
function _flipTexture (inGrid, gid, shrink) {
    const px = shrink * inGrid._px;
    const py = shrink * inGrid._py;
    const l = inGrid.l + px;
    const r = inGrid.r - px;
    const t = inGrid.t + py;
    const b = inGrid.b - py;
    if (inGrid._rotated) {
        // 2:b   1:a
        // 4:d   3:c
        _uva.x = r;
        _uva.y = t;
        _uvb.x = l;
        _uvb.y = t;
        _uvc.x = r;
        _uvc.y = b;
        _uvd.x = l;
        _uvd.y = b;
    } else {
        // 1:a  3:c
        // 2:b  4:d
        _uva.x = l;
        _uva.y = t;
        _uvb.x = l;
        _uvb.y = b;
        _uvc.x = r;
        _uvc.y = t;
        _uvd.x = r;
        _uvd.y = b;
    }

    let tempVal;

    // vice
    if ((gid & TileFlag.DIAGONAL) >>> 0) {
        tempVal = _uvb;
        _uvb = _uvc;
        _uvc = tempVal;
    }

    // flip x
    if ((gid & TileFlag.HORIZONTAL) >>> 0) {
        tempVal = _uva;
        _uva = _uvc;
        _uvc = tempVal;

        tempVal = _uvb;
        _uvb = _uvd;
        _uvd = tempVal;
    }

    // flip y
    if ((gid & TileFlag.VERTICAL) >>> 0) {
        tempVal = _uva;
        _uva = _uvb;
        _uvb = tempVal;

        tempVal = _uvc;
        _uvc = _uvd;
        _uvd = tempVal;
    }
}

/*
texture coordinate
   a
b     c
   d
*/
function _flipDiamondTileTexture (inGrid, gid, shrink) {
    const px = shrink * inGrid._px * inGrid._whr;
    const py = shrink * inGrid._py;
    const l = inGrid.l + px;
    const r = inGrid.r - px;
    const t = inGrid.t + py;
    const b = inGrid.b - py;
    const cx = inGrid.cx;
    const cy = inGrid.cy;

    if (inGrid._rotated) {
        //       2:b
        // 4:d         1:a
        //       3:c
        _uva.x = r;
        _uva.y = cy;
        _uvb.x = cx;
        _uvb.y = t;
        _uvc.x = cx;
        _uvc.y = b;
        _uvd.x = l;
        _uvd.y = cy;
    } else {
        //       1:a
        // 2:b         3:c
        //       4:d
        _uva.x = cx;
        _uva.y = t;
        _uvb.x = l;
        _uvb.y = cy;
        _uvc.x = r;
        _uvc.y = cy;
        _uvd.x = cx;
        _uvd.y = b;
    }

    let tempVal;

    // vice
    if ((gid & TileFlag.DIAGONAL) >>> 0) {
        tempVal = _uva;
        _uva = _uvb;
        _uvb = tempVal;

        tempVal = _uvc;
        _uvc = _uvd;
        _uvd = tempVal;
    }

    // flip x
    if ((gid & TileFlag.HORIZONTAL) >>> 0) {
        tempVal = _uvb;
        _uvb = _uvc;
        _uvc = tempVal;
    }

    // flip y
    if ((gid & TileFlag.VERTICAL) >>> 0) {
        tempVal = _uva;
        _uva = _uvd;
        _uvd = tempVal;
    }
}

export default class TmxAssembler extends Assembler {

    updateRenderData (comp) {
        if (!comp._renderDataList) {
            if (comp._buffer) {
                comp._buffer.destroy();
            }
            comp._buffer = new cc.TiledMapBuffer(renderer._handle, comp._withColor ? vfmtPosUvColor : vfmtPosUv);
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

        if (comp._tileChanged || comp._isCullingDirty() || comp._isUserNodeDirty() || comp._hasAnimation() || comp._hasTiledNode()) {
            comp._tileChanged = false;

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

            switch (comp.renderOrder) {
                // left top to right down, col add, row sub,
                case RenderOrder.RightDown:
                    this.traverseGrids(leftDown, rightTop, -1, 1, comp);
                    break;
                // right top to left down, col sub, row sub
                case RenderOrder.LeftDown:
                    this.traverseGrids(leftDown, rightTop, -1, -1, comp);
                    break;
                // left down to right up, col add, row add
                case RenderOrder.RightUp:
                    this.traverseGrids(leftDown, rightTop, 1, 1, comp);
                    break;
                // right down to left up, col sub, row add
                case RenderOrder.LeftUp:
                    this.traverseGrids(leftDown, rightTop, 1, -1, comp);
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

    _flipTexture = null

    // rowMoveDir is -1 or 1, -1 means decrease, 1 means increase
    // colMoveDir is -1 or 1, -1 means decrease, 1 means increase
    traverseGrids (leftDown, rightTop, rowMoveDir, colMoveDir, comp) {
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
        let pOpacity = layerNode.parent ? layerNode.parent._opacity / 255 : 1.0;
        let opacity = pOpacity * layerNode._opacity;
        layerNode._color._fastSetA(opacity);

        let color = layerNode._color._val;
        let tiledTiles = _comp._tiledTiles;
        let texGrids = _comp._texGrids;
        let tiles = _comp._tiles;
        let texIdToMatIdx = _comp._texIdToMatIndex;
        let mats = _comp._materials;

        const withColor = _comp._withColor;
        const vertStep = withColor ? 5 : 4;
        const vertStep2 = vertStep * 2;
        const vertStep3 = vertStep * 3;

        let vertices = _comp._vertices;
        let rowData, col, cols, row, rows, colData, tileSize, grid = null, gid = 0;
        let left = 0, bottom = 0, right = 0, top = 0; // x, y
        let tiledNode = null, curTexIdx = -1, matIdx;
        let colNodesCount = 0, checkColRange = true;

        let diamondTile = comp._diamondTile;

        this._flipTexture = diamondTile ? _flipDiamondTileTexture : _flipTexture;

        if (rowMoveDir === -1) {
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
            checkColRange = rowData && colNodesCount === 0;

            // limit min col and max col
            if (colMoveDir === 1) {
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
                if (!grid) continue;

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

                tileSize = grid.tileset._tileSize;

                // calc rect vertex
                left = colData.left - _moveX;
                bottom = colData.bottom - _moveY;
                top = bottom + tileSize.height;
                right = left + tileSize.width;

                // begin to fill vertex buffer
                tiledNode = tiledTiles[colData.index];
                if (!tiledNode) {
                    if (diamondTile) {
                        let centerX = (left + right) / 2;
                        let centerY = (top + bottom) / 2;
                        // ct
                        _vbuf[_vfOffset] = centerX;
                        _vbuf[_vfOffset + 1] = top;

                        // lc
                        _vbuf[_vfOffset + vertStep] = left;
                        _vbuf[_vfOffset + vertStep + 1] = centerY;

                        // rc
                        _vbuf[_vfOffset + vertStep2] = right;
                        _vbuf[_vfOffset + vertStep2 + 1] = centerY;

                        // cb
                        _vbuf[_vfOffset + vertStep3] = centerX;
                        _vbuf[_vfOffset + vertStep3 + 1] = bottom;
                    } else {
                        // lt
                        _vbuf[_vfOffset] = left;
                        _vbuf[_vfOffset + 1] = top;

                        // lb
                        _vbuf[_vfOffset + vertStep] = left;
                        _vbuf[_vfOffset + vertStep + 1] = bottom;

                        // rt
                        _vbuf[_vfOffset + vertStep2] = right;
                        _vbuf[_vfOffset + vertStep2 + 1] = top;

                        // rb
                        _vbuf[_vfOffset + vertStep3] = right;
                        _vbuf[_vfOffset + vertStep3 + 1] = bottom;
                    }

                    if (withColor) {
                        _uintbuf[_vfOffset + 4] = color;
                        _uintbuf[_vfOffset + vertStep + 4] = color;
                        _uintbuf[_vfOffset + vertStep2 + 4] = color;
                        _uintbuf[_vfOffset + vertStep3 + 4] = color;
                    }

                } else {
                    if (tiledNode.node._active) {
                        tiledNode.node._color._fastSetA(tiledNode.node._opacity * opacity / 255);
                        this.fillByTiledNode(tiledNode.node, _vbuf, _uintbuf, left, right, top, bottom, diamondTile, withColor);
                    }
                }

                this._flipTexture(grid, gid, comp.shrink || 0);

                // lt/ct -> a
                _vbuf[_vfOffset + 2] = _uva.x;
                _vbuf[_vfOffset + 3] = _uva.y;

                // lb/lc -> b
                _vbuf[_vfOffset + vertStep + 2] = _uvb.x;
                _vbuf[_vfOffset + vertStep + 3] = _uvb.y;

                // rt/rc -> c
                _vbuf[_vfOffset + vertStep2 + 2] = _uvc.x;
                _vbuf[_vfOffset + vertStep2 + 3] = _uvc.y;

                // rt/cb -> d
                _vbuf[_vfOffset + vertStep3 + 2] = _uvd.x;
                _vbuf[_vfOffset + vertStep3 + 3] = _uvd.y;

                // modify buffer all kinds of offset
                _vfOffset += 4 * vertStep;
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

    fillByTiledNode (tiledNode, vbuf, uintbuf, left, right, top, bottom, diamondTile, withColor) {
        const vertStep = withColor ? 5 : 4;
        const vertStep2 = vertStep * 2;
        const vertStep3 = vertStep * 3;

        tiledNode._updateLocalMatrix();
        Mat4.copy(_mat4_temp, tiledNode._matrix);
        Vec3.set(_vec3_temp, -(left + _moveX), -(bottom + _moveY), 0);
        Mat4.transform(_mat4_temp, _mat4_temp, _vec3_temp);
        let m = _mat4_temp.m;
        let tx = m[12];
        let ty = m[13];

        let a = m[0];
        let b = m[1];
        let c = m[4];
        let d = m[5];

        let justTranslate = a === 1 && b === 0 && c === 0 && d === 1;

        if (diamondTile) {
            let centerX = (left + right) / 2;
            let centerY = (top + bottom) / 2;
            if (justTranslate) {
                // ct
                vbuf[_vfOffset] = centerX + tx;
                vbuf[_vfOffset + 1] = top + ty;

                // lc
                vbuf[_vfOffset + vertStep] = left + tx;
                vbuf[_vfOffset + vertStep + 1] = centerY + ty;

                // rc
                vbuf[_vfOffset + vertStep2] = right + tx;
                vbuf[_vfOffset + vertStep2 + 1] = centerY + ty;

                // cb
                vbuf[_vfOffset + vertStep3] = centerX + tx;
                vbuf[_vfOffset + vertStep3 + 1] = bottom + ty;
            } else {
                // ct
                vbuf[_vfOffset] = centerX * a + top * c + tx;
                vbuf[_vfOffset + 1] = centerX * b + top * d + ty;

                // lc
                vbuf[_vfOffset + vertStep] = left * a + centerY * c + tx;
                vbuf[_vfOffset + vertStep + 1] = left * b + centerY * d + ty;

                // rc
                vbuf[_vfOffset + vertStep2] = right * a + centerY * c + tx;
                vbuf[_vfOffset + vertStep2 + 1] = right * b + centerY * d + ty;

                // cb
                vbuf[_vfOffset + vertStep3] = centerX * a + bottom * c + tx;
                vbuf[_vfOffset + vertStep3 + 1] = centerX * b + bottom * d + ty;
            }
        } else if (justTranslate) {
            vbuf[_vfOffset] = left + tx;
            vbuf[_vfOffset + 1] = top + ty;

            vbuf[_vfOffset + vertStep] = left + tx;
            vbuf[_vfOffset + vertStep + 1] = bottom + ty;

            vbuf[_vfOffset + vertStep2] = right + tx;
            vbuf[_vfOffset + vertStep2 + 1] = top + ty;

            vbuf[_vfOffset + vertStep3] = right + tx;
            vbuf[_vfOffset + vertStep3 + 1] = bottom + ty;
        } else {
            // lt
            vbuf[_vfOffset] = left * a + top * c + tx;
            vbuf[_vfOffset + 1] = left * b + top * d + ty;

            // lb
            vbuf[_vfOffset + vertStep] = left * a + bottom * c + tx;
            vbuf[_vfOffset + vertStep + 1] = left * b + bottom * d + ty;

            // rt
            vbuf[_vfOffset + vertStep2] = right * a + top * c + tx;
            vbuf[_vfOffset + vertStep2 + 1] = right * b + top * d + ty;

            // rb
            vbuf[_vfOffset + vertStep3] = right * a + bottom * c + tx;
            vbuf[_vfOffset + vertStep3 + 1] = right * b + bottom * d + ty;
        }

        if (withColor) {
            let color = tiledNode._color._val;
            uintbuf[_vfOffset + 4] = color;
            uintbuf[_vfOffset + vertStep + 4] = color;
            uintbuf[_vfOffset + vertStep2 + 4] = color;
            uintbuf[_vfOffset + vertStep3 + 4] = color;
        }
    }
}

Assembler.register(TiledLayer, TmxAssembler);
