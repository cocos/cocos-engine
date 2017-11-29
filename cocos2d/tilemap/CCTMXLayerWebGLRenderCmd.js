/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var Orientation = null;
var TileFlag = null;
var FLIPPED_MASK = null;
var StaggerAxis = null;
var StaggerIndex = null;

_ccsg.TMXLayer.WebGLRenderCmd = function(renderableObject){
    this._rootCtor(renderableObject);
    this._needDraw = true;
    this._vertices = [
        {x:0, y:0},
        {x:0, y:0},
        {x:0, y:0},
        {x:0, y:0}
    ];
    this._color = new Uint32Array(1);
    this._shaderProgram = cc.shaderCache.programForKey(cc.macro.SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST);

    var radian = Math.PI * 90 / 180;
    this._sin90 = Math.sin(radian);
    this._cos90 = Math.cos(radian);
    radian = radian * 3;
    this._sin270 = Math.sin(radian);
    this._cos270 = Math.cos(radian);

    if (!Orientation) {
        Orientation = cc.TiledMap.Orientation;
        TileFlag = cc.TiledMap.TileFlag;
        FLIPPED_MASK = TileFlag.FLIPPED_MASK;
        StaggerAxis = cc.TiledMap.StaggerAxis;
        StaggerIndex = cc.TiledMap.StaggerIndex;
    }

    // disable DepthTest, local use DepthTest;
    this._disableDepthTestCmd = new cc.CustomRenderCmd(this, _disableDepthTest);
};

function _disableDepthTest () {
    cc.renderer.setDepthTest(false);
}

var proto = _ccsg.TMXLayer.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
proto.constructor = _ccsg.TMXLayer.WebGLRenderCmd;

proto.uploadData = function (f32buffer, ui32buffer, vertexDataOffset) {
    // enable Depth Test
    cc.renderer.setDepthTest(true);

    var node = this._node,
        layerOrientation = node.layerOrientation,
        tiles = node.tiles,
        alpha = node._opacity / 255;

    if (!tiles || alpha <= 0 || !node.tileset) {
        return 0;
    }

    var maptw = node._mapTileSize.width,
        mapth = node._mapTileSize.height,
        tilew = node.tileset._tileSize.width / cc.director._contentScaleFactor,
        tileh = node.tileset._tileSize.height / cc.director._contentScaleFactor,
        extw = tilew - maptw,
        exth = tileh - mapth,
        winw = cc.winSize.width,
        winh = cc.winSize.height,
        rows = node._layerSize.height,
        cols = node._layerSize.width,
        grids = node._texGrids,
        spTiles = node._spriteTiles,
        wt = this._worldTransform,
        a = wt.a, b = wt.b, c = wt.c, d = wt.d, tx = wt.tx, ty = wt.ty,
        ox = node._position.x,
        oy = node._position.y,
        mapx = ox * a + oy * c + tx,
        mapy = ox * b + oy * d + ty,
        w = tilew * a, h = tileh * d;

    var opacity = node._opacity,
        cr = this._displayedColor.r,
        cg = this._displayedColor.g,
        cb = this._displayedColor.b;
    if (node._opacityModifyRGB) {
        var ca = opacity / 255;
        cr *= ca;
        cg *= ca;
        cb *= ca;
    }
    this._color[0] = ((opacity<<24) | (cb<<16) | (cg<<8) | cr);

    // Culling
    var startCol = 0, startRow = 0,
        maxCol = cols, maxRow = rows;

    var cullingA = a, cullingD = d, 
        cullingMapx = mapx, cullingMapy = mapy,
        cullingW = w, cullingH = h;
    var enabledCulling = cc.macro.ENABLE_TILEDMAP_CULLING,
        vertices = this._vertices;
    
    if (enabledCulling) {
        var trans;
        if (this._cameraFlag > 0) {
            trans = cc.affineTransformConcat(wt, cc.Camera.main.viewMatrix);
            cullingA = trans.a;
            cullingD = trans.d;
            cullingMapx = ox * cullingA + oy * trans.c + trans.tx;
            cullingMapy = ox * trans.b + oy * cullingD + trans.ty;
            cullingW = tilew * cullingA;
            cullingH = tileh * cullingD;
        }

        if (layerOrientation === Orientation.ORTHO) {
            // In case trans is not created yet
            if (this._cameraFlag <= 0) {
                trans = cc.affineTransformClone(wt);
            }
            cc.affineTransformInvertOut(trans, trans);
            var world = cc.visibleRect;
            vertices[0].x = world.topLeft.x * trans.a + world.topLeft.y * trans.c + trans.tx;
            vertices[0].y = world.topLeft.x * trans.b + world.topLeft.y * trans.d + trans.ty;
            vertices[1].x = world.bottomLeft.x * trans.a + world.bottomLeft.y * trans.c + trans.tx;
            vertices[1].y = world.bottomLeft.x * trans.b + world.bottomLeft.y * trans.d + trans.ty;
            vertices[2].x = world.topRight.x * trans.a + world.topRight.y * trans.c + trans.tx;
            vertices[2].y = world.topRight.x * trans.b + world.topRight.y * trans.d + trans.ty;
            vertices[3].x = world.bottomRight.x * trans.a + world.bottomRight.y * trans.c + trans.tx;
            vertices[3].y = world.bottomRight.x * trans.b + world.bottomRight.y * trans.d + trans.ty;
            var minx = Math.min(vertices[0].x, vertices[1].x, vertices[2].x, vertices[3].x),
                maxx = Math.max(vertices[0].x, vertices[1].x, vertices[2].x, vertices[3].x),
                miny = Math.min(vertices[0].y, vertices[1].y, vertices[2].y, vertices[3].y),
                maxy = Math.max(vertices[0].y, vertices[1].y, vertices[2].y, vertices[3].y);

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

    var row, col,
        offset = vertexDataOffset,
        colOffset = startRow * cols, z, gid, grid,
        i, top, left, bottom, right, 
        gt, gl, gb, gr,
        wa = a, wb = b, wc = c, wd = d, 
        wtx = Math.floor(tx) + 0.5, wty = Math.floor(ty) + 0.5, // world
        flagged = false, flippedX = false, flippedY = false,
        axis, tileOffset, diffX1, diffY1, odd_even;

    if (layerOrientation === Orientation.HEX) {
        var index = node._staggerIndex,
            hexSideLength = node._hexSideLength;
        axis = node._staggerAxis;
        tileOffset = node.tileset.tileOffset;
        odd_even = (index === StaggerIndex.STAGGERINDEX_ODD) ? 1 : -1;
        diffX1 = (axis === StaggerAxis.STAGGERAXIS_X) ? ((maptw - hexSideLength)/2) : 0;
        diffY1 = (axis === StaggerAxis.STAGGERAXIS_Y) ? ((mapth - hexSideLength)/2) : 0;
    }

    for (row = startRow; row < maxRow; ++row) {
        for (col = startCol; col < maxCol; ++col) {
            // No more buffer
            if (offset + 24 > f32buffer.length) {
                cc.renderer._increaseBatchingSize((offset - vertexDataOffset) / 6, cc.renderer.VertexType.QUAD);
                cc.renderer._batchRendering();
                vertexDataOffset = 0;
                offset = 0;
            }

            z = colOffset + col;
            // Skip sprite tiles
            if (spTiles[z]) {
                spTiles[z]._vertexZ = node._vertexZ + cc.renderer.assignedZStep * z / tiles.length;
                continue;
            }

            gid = node.tiles[z];
            grid = grids[(gid & FLIPPED_MASK) >>> 0];
            if (!grid) {
                continue;
            }

            // Vertices
            switch (layerOrientation) {
            case Orientation.ORTHO:
                left = col * maptw;
                bottom = (rows - row - 1) * mapth;
                z = node._vertexZ + cc.renderer.assignedZStep * z / tiles.length;
                break;
            case Orientation.ISO:
                left = maptw / 2 * ( cols + col - row - 1);
                bottom = mapth / 2 * ( rows * 2 - col - row - 2);
                z = node._vertexZ + cc.renderer.assignedZStep * (node.height - bottom) / node.height;
                break;
            case Orientation.HEX:
                var diffX2 = (axis === StaggerAxis.STAGGERAXIS_Y && row % 2 === 1) ? (maptw / 2 * odd_even) : 0;
                left = col * (maptw - diffX1) + diffX2 + tileOffset.x;
                var diffY2 = (axis === StaggerAxis.STAGGERAXIS_X && col % 2 === 1) ? (mapth/2 * -odd_even) : 0;
                bottom = (rows - row - 1) * (mapth -diffY1) + diffY2 - tileOffset.y;
                z = node._vertexZ + cc.renderer.assignedZStep * (node.height - bottom) / node.height;
                break;
            }
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
                flagged = true;
                flippedX = (gid & TileFlag.HORIZONTAL) >>> 0;
                flippedY = (gid & TileFlag.VERTICAL) >>> 0;
                // if ((gid & TileFlag.DIAGONAL) >>> 0) {
                //     var flag = (gid & (TileFlag.HORIZONTAL | TileFlag.VERTICAL) >>> 0) >>> 0;
                //     // handle the 4 diagonally flipped states.
                //     var la, lb, lc, ld;
                //     if (flag === TileFlag.HORIZONTAL || flag === (TileFlag.VERTICAL | TileFlag.HORIZONTAL) >>> 0) {
                //         lb = -(lc = this._sin90);
                //         la = ld = this._cos90;
                //     }
                //     else {
                //         lb = -(lc = this._sin270);
                //         la = ld = this._cos270;
                //     }
                //     left += grid.width * scalex / 2;
                //     bottom += grid.height * scaley / 2;
                //     wa = la * a + lb * c;
                //     wb = la * b + lb * d;
                //     wc = lc * a + ld * c;
                //     wd = lc * b + ld * d;
                //     wtx = a * left + c * bottom + tx;
                //     wty = d * bottom + ty + b * left;
                //     right = right - left;
                //     top = top - bottom;
                //     left = -right;
                //     bottom = -top;
                // }
            }

            vertices[0].x = left * wa + top * wc + wtx; // tl
            vertices[0].y = left * wb + top * wd + wty;
            vertices[1].x = left * wa + bottom * wc + wtx; // bl
            vertices[1].y = left * wb + bottom * wd + wty;
            vertices[2].x = right * wa + top * wc + wtx; // tr
            vertices[2].y = right * wb + top * wd + wty;
            vertices[3].x = right * wa + bottom * wc + wtx; // br
            vertices[3].y = right * wb + bottom * wd + wty;

            for (i = 0; i < 4; ++i) {
                f32buffer[offset] = vertices[i].x;
                f32buffer[offset + 1] = vertices[i].y;
                f32buffer[offset + 2] = z;
                ui32buffer[offset + 3] = this._color[0];
                switch (i) {
                case 0: // tl
                f32buffer[offset + 4] = flippedX ? grid.r : grid.l;
                f32buffer[offset + 5] = flippedY ? grid.b : grid.t;
                break;
                case 1: // bl
                f32buffer[offset + 4] = flippedX ? grid.r : grid.l;
                f32buffer[offset + 5] = flippedY ? grid.t : grid.b;
                break;
                case 2: // tr
                f32buffer[offset + 4] = flippedX ? grid.l : grid.r;
                f32buffer[offset + 5] = flippedY ? grid.b : grid.t;
                break;
                case 3: // br
                f32buffer[offset + 4] = flippedX ? grid.l : grid.r;
                f32buffer[offset + 5] = flippedY ? grid.t : grid.b;
                break;
                }

                offset += 6;
            }
            if (flagged) {
                wa = a;
                wb = b;
                wc = c;
                wd = d;
                wtx = tx;
                wty = ty;
                flippedX = false;
                flippedY = false;
                flagged = false;
            }
        }
        colOffset += cols;
    }
    return (offset - vertexDataOffset) / 6;
};
