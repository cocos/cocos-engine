/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/

/**
 * @packageDocumentation
 * @module ui-assembler
 */

import { Mat4, Size, Vec3 } from '../../core/math';
import { IAssembler } from '../../2d/renderer/base';
import { MeshRenderData } from '../../2d/renderer/render-data';
import { IBatcher } from '../../2d/renderer/i-batcher';
import { TiledLayer, TiledMeshData, TiledTile } from '..';
import { GID, MixedGID, RenderOrder, TiledGrid, TileFlag } from '../tiled-types';
import { Texture2D, Node } from '../../core';

const MaxGridsLimit = Math.ceil(65535 / 6);

const vec3_temps: Vec3[] = [];
for (let i = 0; i < 4; i++) {
    vec3_temps.push(new Vec3());
}

const _mat4_temp = new Mat4();
const _vec3u_temp = new Vec3();
const _leftDown = { row: 0, col: 0 };
let _uva = { x: 0, y: 0 };
let _uvb = { x: 0, y: 0 };
let _uvc = { x: 0, y: 0 };
let _uvd = { x: 0, y: 0 };

let _renderData: { renderData: MeshRenderData, texture: Texture2D | null } | null;
let _fillGrids = 0;
let _vfOffset = 0;
let _moveX = 0;
let _moveY = 0;

let flipTexture: (grid: TiledGrid, gid: MixedGID) => void;

/**
 * simple 组装器
 * 可通过 `UI.simple` 获取该组装器。
 */
export const simple: IAssembler = {
    createData (layer: TiledLayer) {
        const renderData = layer.requestMeshRenderData();
        const maxGrids = layer.rightTop.col * layer.rightTop.row;
        if (maxGrids * 4 > 65535) {
            console.error('Vertex count exceeds 65535');
        }
        return renderData;
    },

    updateRenderData (comp: TiledLayer, ui: IBatcher) {
        comp.updateCulling();
        const renderData = comp.requestMeshRenderData();
        _moveX = comp.leftDownToCenterX;
        _moveY = comp.leftDownToCenterY;
        _renderData = renderData;

        if (comp.colorChanged || comp.isCullingDirty() || comp.isUserNodeDirty() || comp.hasAnimation()
            || comp.hasTiledNode() || comp.node.hasChangedFlags) {
            comp.colorChanged = false;

            comp.destroyRenderData();

            let leftDown: { col: number, row: number };
            let rightTop: { col: number, row: number };
            if (comp.enableCulling) {
                const cullingRect = comp.cullingRect;
                leftDown = cullingRect.leftDown;
                rightTop = cullingRect.rightTop;
            } else {
                leftDown = _leftDown;
                rightTop = comp.rightTop;
            }

            switch (comp.renderOrder) {
            // left top to right down, col add, row sub,
            case RenderOrder.RightDown:
                traverseGrids(leftDown, rightTop, -1, 1, comp);
                break;
                // right top to left down, col sub, row sub
            case RenderOrder.LeftDown:
                traverseGrids(leftDown, rightTop, -1, -1, comp);
                break;
                // left down to right up, col add, row add
            case RenderOrder.RightUp:
                traverseGrids(leftDown, rightTop, 1, 1, comp);
                break;
                // right down to left up, col sub, row add
            case RenderOrder.LeftUp:
            default:
                traverseGrids(leftDown, rightTop, 1, -1, comp);
                break;
            }
            comp.setCullingDirty(false);
            comp.setUserNodeDirty(false);
        }

        _renderData = null;
    },

    updateColor (tiled: TiledLayer) {
        const color = tiled.color;
        const colorV = new Float32Array(4);
        colorV[0] = color.r / 255;
        colorV[1] = color.g / 255;
        colorV[2] = color.b / 255;
        colorV[0] = color.a / 255;
        const rs = tiled.meshRenderDataArray;
        if (rs) {
            for (const r of rs) {
                if (!(r as any).renderData) continue;
                const renderData = (r as any).renderData;
                const vs = renderData.vData;
                for (let i = renderData.vertexStart, l = renderData.vertexCount; i < l; i++) {
                    vs.set(colorV, i * 9 + 5);
                }
            }
        }
    },

    fillBuffers (layer: TiledLayer, renderer: IBatcher) {
        if (!layer || !layer.meshRenderDataArray) return;

        const dataArray = layer.meshRenderDataArray;

        // 当前渲染的数据
        const data = dataArray[layer._meshRenderDataArrayIdx] as TiledMeshData;
        const renderData = data.renderData;
        const iBuf = renderData.iData;

        let indexOffset = 0;
        let vertexId = 0;
        const quadCount = renderData.vertexCount / 4;
        for (let i = 0; i < quadCount; i += 1) {
            iBuf[indexOffset] = vertexId;
            iBuf[indexOffset + 1] = vertexId + 1;
            iBuf[indexOffset + 2] = vertexId + 2;
            iBuf[indexOffset + 3] = vertexId + 2;
            iBuf[indexOffset + 4] = vertexId + 1;
            iBuf[indexOffset + 5] = vertexId + 3;
            indexOffset += 6;
            vertexId += 4;
        }
    },
};

/*
texture coordinate
a c
b d
*/
function _flipTexture (inGrid: TiledGrid, gid: MixedGID) {
    if (inGrid._rotated) {
        // 2:b   1:a
        // 4:d   3:c
        _uva.x = inGrid.r;
        _uva.y = inGrid.t;
        _uvb.x = inGrid.l;
        _uvb.y = inGrid.t;
        _uvc.x = inGrid.r;
        _uvc.y = inGrid.b;
        _uvd.x = inGrid.l;
        _uvd.y = inGrid.b;
    } else {
        // 1:a  3:c
        // 2:b  4:d
        _uva.x = inGrid.l;
        _uva.y = inGrid.t;
        _uvb.x = inGrid.l;
        _uvb.y = inGrid.b;
        _uvc.x = inGrid.r;
        _uvc.y = inGrid.t;
        _uvd.x = inGrid.r;
        _uvd.y = inGrid.b;
    }

    let tempVal;

    // vice
    if (((gid as unknown as number) & TileFlag.DIAGONAL) >>> 0) {
        tempVal = _uvb;
        _uvb = _uvc;
        _uvc = tempVal;
    }

    // flip x
    if (((gid as unknown as number) & TileFlag.HORIZONTAL) >>> 0) {
        tempVal = _uva;
        _uva = _uvc;
        _uvc = tempVal;

        tempVal = _uvb;
        _uvb = _uvd;
        _uvd = tempVal;
    }

    // flip y
    if (((gid as unknown as number) & TileFlag.VERTICAL) >>> 0) {
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
function _flipDiamondTileTexture (inGrid: TiledGrid, gid: MixedGID) {
    if (inGrid._rotated) {
        //       2:b
        // 4:d         1:a
        //       3:c
        _uva.x = inGrid.r;
        _uva.y = inGrid.cy;
        _uvb.x = inGrid.cx;
        _uvb.y = inGrid.t;
        _uvc.x = inGrid.cx;
        _uvc.y = inGrid.b;
        _uvd.x = inGrid.l;
        _uvd.y = inGrid.cy;
    } else {
        //       1:a
        // 2:b         3:c
        //       4:d
        _uva.x = inGrid.cx;
        _uva.y = inGrid.t;
        _uvb.x = inGrid.l;
        _uvb.y = inGrid.cy;
        _uvc.x = inGrid.r;
        _uvc.y = inGrid.cy;
        _uvd.x = inGrid.cx;
        _uvd.y = inGrid.b;
    }

    let tempVal;

    // vice
    if (((gid as unknown as number) & TileFlag.DIAGONAL) >>> 0) {
        tempVal = _uva;
        _uva = _uvb;
        _uvb = tempVal;

        tempVal = _uvc;
        _uvc = _uvd;
        _uvd = tempVal;
    }

    // flip x
    if (((gid as unknown as number) & TileFlag.HORIZONTAL) >>> 0) {
        tempVal = _uvb;
        _uvb = _uvc;
        _uvc = tempVal;
    }

    // flip y
    if (((gid as unknown as number) & TileFlag.VERTICAL) >>> 0) {
        tempVal = _uva;
        _uva = _uvd;
        _uvd = tempVal;
    }
}

function switchRenderData (curTexIdx: Texture2D | null, grid: TiledGrid, comp: TiledLayer) {
    // need flush
    if (!curTexIdx) curTexIdx = grid.texture;
    if (!_renderData!.texture) {
        _renderData!.texture = curTexIdx;
    }
    // update material
    _renderData = comp.requestMeshRenderData() as any;
    _renderData!.texture = grid.texture;
}

// rowMoveDir is -1 or 1, -1 means decrease, 1 means increase
// colMoveDir is -1 or 1, -1 means decrease, 1 means increase
function traverseGrids (leftDown: { col: number, row: number }, rightTop: { col: number, row: number },
    rowMoveDir: number, colMoveDir: number, comp: TiledLayer) {
    // show nothing
    if (!_renderData || rightTop.row < 0 || rightTop.col < 0) return;

    if (!_renderData.renderData) {
        _renderData = comp.requestMeshRenderData();
    }

    let vertexBuf: Float32Array = _renderData.renderData.vData;
    // let idxBuf: Uint16Array = _renderData!.renderData.iData;

    const matrix = comp.node.worldMatrix;

    _fillGrids = 0;
    _vfOffset = 0;

    const tiledTiles = comp.tiledTiles;

    const texGrids = comp.texGrids!;
    const tiles = comp.tiles;

    const vertStep = 9;
    const vertStep2 = vertStep * 2;
    const vertStep3 = vertStep * 3;

    const vertices = comp.vertices;
    let rowData: { [key: number]: { left: number, bottom: number; index: number }, maxCol: number, minCol: number };
    let col: number;
    let cols: number;
    let row: number;
    let rows: number;
    let colData: { left: number, bottom: number, index: number };
    let tileSize: Size;
    let grid: TiledGrid | undefined;
    let gid: MixedGID = 0 as unknown as any;
    let left = 0;
    let bottom = 0;
    let right = 0;
    let top = 0; // x, y
    let tiledNode: TiledTile | null;
    let curTexIdx: Texture2D | null = null;
    let colNodesCount = 0;
    let checkColRange = true;

    const diamondTile = false; // TODO:comp._diamondTile;

    flipTexture = diamondTile ? _flipDiamondTileTexture : _flipTexture;

    const color: Float32Array = new Float32Array(4);
    color[0] = comp.color.r / 255;
    color[1] = comp.color.g / 255;
    color[2] = comp.color.b / 255;
    color[3] = comp.color.a / 255;

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
        colNodesCount = comp.getNodesCountByRow(row);
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

            if (colNodesCount > 0) {
                const nodes = comp.requestSubNodesData();
                const celData = comp.getNodesByRowCol(row, col);
                if (celData && celData.count > 0) {
                    (nodes as any).subNodes = comp.getNodesByRowCol(row, col)!.list as any;
                    curTexIdx = null;
                    _renderData = comp.requestMeshRenderData() as any;
                }
            }

            if (!colData) {
                // only render users nodes because map data is empty
                continue;
            }

            gid = tiles[colData.index];
            grid = texGrids.get((((gid as unknown as number) & TileFlag.FLIPPED_MASK) >>> 0) as unknown as GID);
            if (!grid) continue;

            // check init or new material
            if (curTexIdx !== grid.texture) {
                switchRenderData(curTexIdx, grid, comp);
                curTexIdx = grid.texture;
            }

            tileSize = grid.tileset._tileSize;

            // calc rect vertex
            left = colData.left - _moveX;
            bottom = colData.bottom - _moveY;
            right = left + tileSize.width;
            top = bottom + tileSize.height;

            // begin to fill vertex buffer
            tiledNode = tiledTiles[colData.index];

            _renderData!.renderData.reserve(4, 0);
            _vfOffset = _renderData!.renderData.vertexCount * 9;
            vertexBuf = _renderData!.renderData.vData;
            if (!tiledNode) {
                if (diamondTile) {
                    const centerX = (left + right) / 2;
                    const centerY = (top + bottom) / 2;
                    // ct
                    vec3_temps[0].x = centerX;
                    vec3_temps[0].y = top;

                    // lc
                    vec3_temps[1].x = left;
                    vec3_temps[1].y = centerY;

                    // rc
                    vec3_temps[2].x = right;
                    vec3_temps[2].y = centerY;

                    // cb
                    vec3_temps[3].x = centerX;
                    vec3_temps[3].y = bottom;
                } else {
                    // lt
                    vec3_temps[0].x = left;
                    vec3_temps[0].y = top;

                    // lb
                    vec3_temps[1].x = left;
                    vec3_temps[1].y = bottom;

                    // rt
                    vec3_temps[2].x = right;
                    vec3_temps[2].y = top;

                    // rb
                    vec3_temps[3].x = right;
                    vec3_temps[3].y = bottom;
                }

                vec3_temps[0].transformMat4(matrix);
                vertexBuf[_vfOffset] = vec3_temps[0].x;
                vertexBuf[_vfOffset + 1] = vec3_temps[0].y;
                vertexBuf[_vfOffset + 2] = vec3_temps[0].z;

                vec3_temps[1].transformMat4(matrix);
                vertexBuf[_vfOffset + vertStep] = vec3_temps[1].x;
                vertexBuf[_vfOffset + vertStep + 1] = vec3_temps[1].y;
                vertexBuf[_vfOffset + vertStep + 2] = vec3_temps[1].z;

                vec3_temps[2].transformMat4(matrix);
                vertexBuf[_vfOffset + vertStep2] = vec3_temps[2].x;
                vertexBuf[_vfOffset + vertStep2 + 1] = vec3_temps[2].y;
                vertexBuf[_vfOffset + vertStep2 + 2] = vec3_temps[2].z;

                vec3_temps[3].transformMat4(matrix);
                vertexBuf[_vfOffset + vertStep3] = vec3_temps[3].x;
                vertexBuf[_vfOffset + vertStep3 + 1] = vec3_temps[3].y;
                vertexBuf[_vfOffset + vertStep3 + 2] = vec3_temps[3].z;

                vertexBuf.set(color, _vfOffset + 5);
                vertexBuf.set(color, _vfOffset + vertStep + 5);
                vertexBuf.set(color, _vfOffset + vertStep2 + 5);
                vertexBuf.set(color, _vfOffset + vertStep3 + 5);
            } else if (tiledNode.node.active) {
                fillByTiledNode(tiledNode.node, color, vertexBuf, left, right, top, bottom, diamondTile);
            }

            flipTexture(grid, gid);

            // lt/ct -> a
            vertexBuf[_vfOffset + 3] = _uva.x;
            vertexBuf[_vfOffset + 4] = _uva.y;

            // lb/lc -> b
            vertexBuf[_vfOffset + vertStep + 3] = _uvb.x;
            vertexBuf[_vfOffset + vertStep + 4] = _uvb.y;

            // rt/rc -> c
            vertexBuf[_vfOffset + vertStep2 + 3] = _uvc.x;
            vertexBuf[_vfOffset + vertStep2 + 4] = _uvc.y;

            // rt/cb -> d
            vertexBuf[_vfOffset + vertStep3 + 3] = _uvd.x;
            vertexBuf[_vfOffset + vertStep3 + 4] = _uvd.y;

            _fillGrids++;

            _renderData!.renderData.relocate(4, 6);

            // check render users node
            // if (colNodesCount > 0) _renderNodes(row, col);

            // vertices count exceed 66635, buffer must be switched
            if (_fillGrids >= MaxGridsLimit) {
                switchRenderData(curTexIdx, grid, comp);
                curTexIdx = grid.texture;
            }
        }
    }
}

function fillByTiledNode (tiledNode: Node, color: Float32Array, vbuf: Float32Array,
    left: number, right: number, top: number, bottom: number, diamondTile: boolean) {
    const vertStep = 9;
    const vertStep2 = vertStep * 2;
    const vertStep3 = vertStep * 3;

    tiledNode.updateWorldTransform();
    Mat4.fromRTS(_mat4_temp, tiledNode.getRotation(), tiledNode.getPosition(), tiledNode.getScale());
    Vec3.set(_vec3u_temp, -(left + _moveX), -(bottom + _moveY), 0);
    Mat4.transform(_mat4_temp, _mat4_temp, _vec3u_temp);
    const m = _mat4_temp;
    const tx = m.m12;
    const ty = m.m13;

    const a = m.m00;
    const b = m.m01;
    const c = m.m04;
    const d = m.m05;

    const justTranslate = a === 1 && b === 0 && c === 0 && d === 1;

    if (diamondTile) {
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
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

    vbuf.set(color, _vfOffset + 5);
    vbuf.set(color, _vfOffset + vertStep + 5);
    vbuf.set(color, _vfOffset + vertStep2 + 5);
    vbuf.set(color, _vfOffset + vertStep3 + 5);
}
