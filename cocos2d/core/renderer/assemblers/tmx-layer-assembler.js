const TiledLayer = require('../../../tilemap/CCTiledLayer');
const TiledMap = require('../../../tilemap/CCTiledMap');

const renderEngine = require('../render-engine');
const RenderData = renderEngine.RenderData;
const math = renderEngine.math;

const Orientation = TiledMap.Orientation;
const TileFlag = TiledMap.TileFlag;
const FLIPPED_MASK = TileFlag.FLIPPED_MASK;
const StaggerAxis = TiledMap.StaggerAxis;
const StaggerIndex = TiledMap.StaggerIndex;

let _matrix = math.mat4.create();
let _v3 = cc.v3();

let assembler = {
    createData (comp) {
        return RenderData.alloc();
    },

    updateRenderData (comp) {
        let renderData = comp._renderData;
        if (!renderData) {
            renderData = comp._renderData = this.createData(comp);
        }

        let size = comp.node._contentSize;
        let anchor = comp.node._anchorPoint;
        renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);
    },

    fillVertexBuffer (comp, index, vbuf, uintbuf) {
        let off = index * comp._vertexFormat._bytes / 4;
        let node = comp.node;
        let renderData = comp._renderData;
        let data = renderData._data;
        let z = node._position.z;
        let color = node._color._val;

        renderData.vertexCount = 0;
        renderData.indiceCount = 0;

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
            tilew = comp._tileset._tileSize.width / cc.director._contentScaleFactor,
            tileh = comp._tileset._tileSize.height / cc.director._contentScaleFactor,
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
            // if (this._cameraFlag > 0) {
            //     let tmpt = cc.affineTransformConcat(wt, cc.Camera.main.viewMatrix);
            //     cullingA = tmpt.a;
            //     cullingD = tmpt.d;
            //     cullingMapx = ox * cullingA + oy * tmpt.c + tmpt.tx;
            //     cullingMapy = ox * tmpt.b + oy * cullingD + tmpt.ty;
            //     cullingW = tilew * cullingA;
            //     cullingH = tileh * cullingD;
            // }

            if (layerOrientation === Orientation.ORTHO) {
                cc.vmath.mat4.invert(_matrix, matrix);

                let rect = cc.visibleRect;
                let a = _matrix.m00, b = _matrix.m01, c = _matrix.m04, d = _matrix.m05, 
                    tx = _matrix.m12, ty = _matrix.m13;
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
                    cc.vmath.mat4.copy(_matrix, tiledNode._matrix);
                    _v3.x = -left; _v3.y = -bottom; _v3.z = 0;
                    cc.vmath.mat4.translate(_matrix, _matrix, _v3);
                    cc.vmath.mat4.multiply(_matrix, matrix, _matrix);
                    a = _matrix.m00; b = _matrix.m01; c = _matrix.m04; d = _matrix.m05;
                    tx = _matrix.m12; ty = _matrix.m13;
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

                // tl
                vbuf[off + 0] = left * a + top * c + tx;
                vbuf[off + 1] = left * b + top * d + ty;
                vbuf[off + 2] = z;
                vbuf[off + 4] = flippedX ? grid.r : grid.l;
                vbuf[off + 5] = flippedY ? grid.b : grid.t;
                uintbuf[off + 3] = color;
                off += 6;

                // bl
                vbuf[off + 0] = left * a + bottom * c + tx;
                vbuf[off + 1] = left * b + bottom * d + ty;
                vbuf[off + 2] = z;
                vbuf[off + 4] = flippedX ? grid.r : grid.l;
                vbuf[off + 5] = flippedY ? grid.t : grid.b;
                uintbuf[off + 3] = color;
                off += 6;

                // tr
                vbuf[off + 0] = right * a + top * c + tx;
                vbuf[off + 1] = right * b + top * d + ty;
                vbuf[off + 2] = z;
                vbuf[off + 4] = flippedX ? grid.l : grid.r;
                vbuf[off + 5] = flippedY ? grid.b : grid.t;
                uintbuf[off + 3] = color;
                off += 6;

                // br
                vbuf[off + 0] = right * a + bottom * c + tx;
                vbuf[off + 1] = right * b + bottom * d + ty;
                vbuf[off + 2] = z;
                vbuf[off + 4] = flippedX ? grid.l : grid.r;
                vbuf[off + 5] = flippedY ? grid.t : grid.b;
                uintbuf[off + 3] = color;
                off += 6;

                renderData.vertexCount += 4;
                renderData.indiceCount += 6;

                if (tiledTile) {
                    color = color2;
                    a = a2; b = b2; c = c2; d = d2; tx = tx2; ty = ty2;
                }
            }
            colOffset += cols;
        }
    },

    fillIndexBuffer (comp, offset, vertexId, ibuf) {
        let renderData = comp._renderData;
        let length = renderData.indiceCount;
        for (let i = 0; i < length; i+=6) {
            ibuf[offset++] = vertexId;
            ibuf[offset++] = vertexId+1;
            ibuf[offset++] = vertexId+2;
            ibuf[offset++] = vertexId+1;
            ibuf[offset++] = vertexId+3;
            ibuf[offset++] = vertexId+2;
            vertexId += 4;
        }
    },
}

TiledLayer._assembler = assembler;

module.exports = assembler;