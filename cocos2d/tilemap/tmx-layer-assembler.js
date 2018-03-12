/****************************************************************************
 Copyright (c) 2017-2018 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

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

const js = require('../core/platform/js');
const assembler = require('../core/renderer/assemblers/assembler');
const renderEngine = require('render-engine');

const Orientation = TiledMap.Orientation;
const TileFlag = TiledMap.TileFlag;
const FLIPPED_MASK = TileFlag.FLIPPED_MASK;
const StaggerAxis = TiledMap.StaggerAxis;
const StaggerIndex = TiledMap.StaggerIndex;

const math = renderEngine.math;
const mat4 = math.mat4;
const vec3 = math.vec3;

let _mat4_temp = mat4.create();
let _vec3_temp = vec3.create();

let tmxAssembler = js.addon({
    updateRenderData (comp) {
        let renderData = comp._renderData;
        if (!renderData) {
            renderData = comp._renderData = comp.requestRenderData();
        }

        let size = comp.node._contentSize;
        let anchor = comp.node._anchorPoint;
        renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);
        renderData.effect = comp.getEffect();
        
        this.updateVertices(comp);

        this.datas.length = 0;
        this.datas.push(renderData);
        return this.datas;
    },

    fillBuffers (comp, batchData, vertexId, vbuf, uintbuf, ibuf) {
        let renderData = comp._renderData;
        let data = renderData._data;
        
        let vertexOffset = batchData.byteOffset / 4;
        let indiceOffset = batchData.indiceOffset;
        
        let z = comp.node._position.z;
        for (let i = 0, l = renderData.vertexCount; i < l; i++) {
            let vert = data[i];
            vbuf[vertexOffset++] = vert.x;
            vbuf[vertexOffset++] = vert.y;
            vbuf[vertexOffset++] = z;
            uintbuf[vertexOffset++] = vert.color;
            vbuf[vertexOffset++] = vert.u;
            vbuf[vertexOffset++] = vert.v;
        }

        for (let i = 0, l = renderData.indiceCount; i < l; i+=6) {
            ibuf[indiceOffset++] = vertexId;
            ibuf[indiceOffset++] = vertexId+1;
            ibuf[indiceOffset++] = vertexId+2;
            ibuf[indiceOffset++] = vertexId+1;
            ibuf[indiceOffset++] = vertexId+3;
            ibuf[indiceOffset++] = vertexId+2;
            vertexId += 4;
        }
    },

    updateVertices (comp) {
        let node = comp.node;
        let renderData = comp._renderData;
        let data = renderData._data;
        let color = node._color._val;

        renderData.dataLength = renderData.vertexCount = renderData.indiceCount = 0;

        let layerOrientation = comp._layerOrientation,
        tiles = comp._tiles;

        if (!tiles || !comp._tileset) {
            return;
        }
                
        node._updateWorldMatrix();
        let matrix = node._worldMatrix;
        let a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;

        let appx = node._anchorPoint.x * node._contentSize.width,
            appy = node._anchorPoint.y * node._contentSize.height;

        let maptw = comp._mapTileSize.width,
            mapth = comp._mapTileSize.height,
            tilew = comp._tileset._tileSize.width,
            tileh = comp._tileset._tileSize.height,
            extw = tilew - maptw,
            exth = tileh - mapth,
            winw = cc.winSize.width,
            winh = cc.winSize.height,
            rows = comp._layerSize.height,
            cols = comp._layerSize.width,
            grids = comp._texGrids,
            tiledTiles = comp._tiledTiles,
            ox = node._position.x + comp._offset.x,
            oy = node._position.y + comp._offset.y,
            mapx = ox * a + oy * c + tx,
            mapy = ox * b + oy * d + ty,
            w = tilew * a, h = tileh * d;

        // Culling
        let startCol = 0, startRow = 0,
            maxCol = cols, maxRow = rows;

        let cullingA = a, cullingD = d, 
            cullingMapx = mapx, cullingMapy = mapy,
            cullingW = w, cullingH = h;
        let enabledCulling = cc.macro.ENABLE_TILEDMAP_CULLING;
        
        if (enabledCulling) {
            let camera = cc.Camera.findCamera(comp.node);
            if (camera) {
                camera.getWorldToCameraMatrix(_mat4_temp);
                mat4.mul(_mat4_temp, matrix, _mat4_temp);
                cullingA = _mat4_temp.m00;
                cullingD = _mat4_temp.m05;
                cullingMapx = ox * cullingA + oy * _mat4_temp.m04 + _mat4_temp.m12;
                cullingMapy = ox * _mat4_temp.m01 + oy * cullingD + _mat4_temp.m13;
                cullingW = tilew * cullingA;
                cullingH = tileh * cullingD;
            }
                
            if (layerOrientation === Orientation.ORTHO) {
                cc.vmath.mat4.invert(_mat4_temp, matrix);

                let rect = cc.visibleRect;
                let a = _mat4_temp.m00, b = _mat4_temp.m01, c = _mat4_temp.m04, d = _mat4_temp.m05, 
                    tx = _mat4_temp.m12, ty = _mat4_temp.m13;
                let v0x = rect.topLeft.x * a + rect.topLeft.y * c + tx;
                let v0y = rect.topLeft.x * b + rect.topLeft.y * d + ty;
                let v1x = rect.bottomLeft.x * a + rect.bottomLeft.y * c + tx;
                let v1y = rect.bottomLeft.x * b + rect.bottomLeft.y * d + ty;
                let v2x = rect.topRight.x * a + rect.topRight.y * c + tx;
                let v2y = rect.topRight.x * b + rect.topRight.y * d + ty;
                let v3x = rect.bottomRight.x * a + rect.bottomRight.y * c + tx;
                let v3y = rect.bottomRight.x * b + rect.bottomRight.y * d + ty;
                let minx = Math.min(v0x, v1x, v2x, v3x),
                    maxx = Math.max(v0x, v1x, v2x, v3x),
                    miny = Math.min(v0y, v1y, v2y, v3y),
                    maxy = Math.max(v0y, v1y, v2y, v3y);
                
                startCol = Math.floor(minx / maptw);
                startRow = rows - Math.ceil(maxy / mapth);
                maxCol = Math.ceil((maxx + extw) / maptw);
                maxRow = rows - Math.floor((miny - exth) / mapth);

                // Adjustment
                if (startCol < 0) startCol = 0;
                if (startRow < 0) startRow = 0;
                if (maxCol > cols) maxCol = cols;
                if (maxRow > rows) maxRow = rows;
            }
        }

        let colOffset = startRow * cols, gid, grid,
            top, left, bottom, right, 
            gt, gl, gb, gr,
            axis, tileOffset, diffX1, diffY1, odd_even;

        if (layerOrientation === Orientation.HEX) {
            let hexSideLength = comp._hexSideLength;
            axis = comp._staggerAxis;
            tileOffset = comp._tileset.tileOffset;
            odd_even = (comp._staggerIndex === StaggerIndex.STAGGERINDEX_ODD) ? 1 : -1;
            diffX1 = (axis === StaggerAxis.STAGGERAXIS_X) ? ((maptw - hexSideLength)/2) : 0;
            diffY1 = (axis === StaggerAxis.STAGGERAXIS_Y) ? ((mapth - hexSideLength)/2) : 0;
        }

        let dataOffset = 0;
        let a2, b2, c2, d2, tx2, ty2, color2;
        for (let row = startRow; row < maxRow; ++row) {
            for (let col = startCol; col < maxCol; ++col) {
                let index = colOffset + col;
                let flippedX = false, flippedY = false;

                let tiledTile = tiledTiles[index];
                if (tiledTile) {
                    gid = tiledTile.gid;
                }
                else {
                    gid = comp._tiles[index];
                }
                
                grid = grids[(gid & FLIPPED_MASK) >>> 0];
                if (!grid) {
                    continue;
                }

                switch (layerOrientation) {
                    case Orientation.ORTHO:
                        left = col * maptw;
                        bottom = (rows - row - 1) * mapth;
                        break;
                    case Orientation.ISO:
                        left = maptw / 2 * ( cols + col - row - 1);
                        bottom = mapth / 2 * ( rows * 2 - col - row - 2);
                        break;
                    case Orientation.HEX:
                        let diffX2 = (axis === StaggerAxis.STAGGERAXIS_Y && row % 2 === 1) ? (maptw / 2 * odd_even) : 0;
                        left = col * (maptw - diffX1) + diffX2 + tileOffset.x;
                        let diffY2 = (axis === StaggerAxis.STAGGERAXIS_X && col % 2 === 1) ? (mapth/2 * -odd_even) : 0;
                        bottom = (rows - row - 1) * (mapth -diffY1) + diffY2 - tileOffset.y;
                        break;
                }

                if (tiledTile) {
                    let tiledNode = tiledTile.node;

                    // use tiled tile properties

                    // color
                    color2 = color;
                    color = tiledNode.color._val;

                    // transform
                    a2 = a; b2 = b; c2 = c; d2 = d; tx2 = tx; ty2 = ty;
                    tiledNode._updateLocalMatrix();
                    cc.vmath.mat4.copy(_mat4_temp, tiledNode._mat4_temp);
                    _vec3_temp.x = -left; _vec3_temp.y = -bottom; _vec3_temp.z = 0;
                    cc.vmath.mat4.translate(_mat4_temp, _mat4_temp, _vec3_temp);
                    cc.vmath.mat4.multiply(_mat4_temp, matrix, _mat4_temp);
                    a = _mat4_temp.m00; b = _mat4_temp.m01; c = _mat4_temp.m04; d = _mat4_temp.m05;
                    tx = _mat4_temp.m12; ty = _mat4_temp.m13;
                }
                
                left -= appx;
                bottom -= appy;

                right = left + tilew;
                top = bottom + tileh;

                // TMX_ORIENTATION_ISO trim
                if (enabledCulling && layerOrientation === Orientation.ISO) {
                    gb = cullingMapy + bottom*cullingD;
                    if (gb > winh+cullingH) {
                        col += Math.floor((gb-winh)*2/cullingH) - 1;
                        continue;
                    }
                    gr = cullingMapx + right*cullingA;
                    if (gr < -cullingW) {
                        col += Math.floor((-gr)*2/cullingW) - 1;
                        continue;
                    }
                    gl = cullingMapx + left*cullingA;
                    gt = cullingMapy + top*cullingD;
                    if (gl > winw || gt < 0) {
                        col = maxCol;
                        continue;
                    }
                }

                // Rotation and Flip
                if (gid > TileFlag.DIAGONAL) {
                    flippedX = (gid & TileFlag.HORIZONTAL) >>> 0;
                    flippedY = (gid & TileFlag.VERTICAL) >>> 0;
                }

                renderData.vertexCount += 4;
                renderData.indiceCount += 6;
                renderData.dataLength = renderData.vertexCount;

                // tl
                data[dataOffset].x = left * a + top * c + tx;
                data[dataOffset].y = left * b + top * d + ty;
                data[dataOffset].u = flippedX ? grid.r : grid.l;
                data[dataOffset].v = flippedY ? grid.b : grid.t;
                data[dataOffset].color = color;
                dataOffset++;

                // bl
                data[dataOffset].x = left * a + bottom * c + tx;
                data[dataOffset].y = left * b + bottom * d + ty;
                data[dataOffset].u = flippedX ? grid.r : grid.l;
                data[dataOffset].v = flippedY ? grid.t : grid.b;
                data[dataOffset].color = color;
                dataOffset++;

                // tr
                data[dataOffset].x = right * a + top * c + tx;
                data[dataOffset].y = right * b + top * d + ty;
                data[dataOffset].u = flippedX ? grid.l : grid.r;
                data[dataOffset].v = flippedY ? grid.b : grid.t;
                data[dataOffset].color = color;
                dataOffset++;

                // br
                data[dataOffset].x = right * a + bottom * c + tx;
                data[dataOffset].y = right * b + bottom * d + ty;
                data[dataOffset].u = flippedX ? grid.l : grid.r;
                data[dataOffset].v = flippedY ? grid.t : grid.b;
                data[dataOffset].color = color;
                dataOffset++;

                if (tiledTile) {
                    color = color2;
                    a = a2; b = b2; c = c2; d = d2; tx = tx2; ty = ty2;
                }
            }
            colOffset += cols;
        }
    },
}, assembler);

module.exports = TiledLayer._assembler = tmxAssembler;
