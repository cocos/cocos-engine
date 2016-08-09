/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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

/**
 * <p>_ccsg.TMXLayer represents the TMX layer. </p>
 *
 * <p>It is a subclass of cc.SpriteBatchNode. By default the tiles are rendered using a cc.TextureAtlas. <br />
 * If you modify a tile on runtime, then, that tile will become a _ccsg.Sprite, otherwise no _ccsg.Sprite objects are created. <br />
 * The benefits of using _ccsg.Sprite objects as tiles are: <br />
 * - tiles (_ccsg.Sprite) can be rotated/scaled/moved with a nice API </p>
 *
 * <p>If the layer contains a property named "cc.vertexz" with an integer (in can be positive or negative), <br />
 * then all the tiles belonging to the layer will use that value as their OpenGL vertex Z for depth. </p>
 *
 * <p>On the other hand, if the "cc.vertexz" property has the "automatic" value, then the tiles will use an automatic vertex Z value. <br />
 * Also before drawing the tiles, GL_ALPHA_TEST will be enabled, and disabled after drawing them. The used alpha func will be:  </p>
 *
 * glAlphaFunc( GL_GREATER, value ) <br />
 *
 * <p>"value" by default is 0, but you can change it from Tiled by adding the "cc_alpha_func" property to the layer. <br />
 * The value 0 should work for most cases, but if you have tiles that are semi-transparent, then you might want to use a different value, like 0.5.</p>
 * @class
 * @extends cc.SpriteBatchNode
 *
 * @property {Array}                tiles               - Tiles for layer
 * @property {cc.TMXTilesetInfo}    tileset             - Tileset for layer
 * @property {Number}               layerOrientation    - Layer orientation
 * @property {Array}                properties          - Properties from the layer. They can be added using tilemap editors
 * @property {String}               layerName           - Name of the layer
 * @property {Number}               layerWidth          - Width of the layer
 * @property {Number}               layerHeight         - Height of the layer
 * @property {Number}               tileWidth           - Width of a tile
 * @property {Number}               tileHeight          - Height of a tile
 */
_ccsg.TMXLayer = _ccsg.Node.extend(/** @lends _ccsg.TMXLayer# */{
    tiles: null,
    tileset: null,
    layerOrientation: null,
    properties: null,
    layerName: "",

    _texture: null,
    _textures: null,
    _texGrids: null,
    _spriteTiles: null,

    //size of the layer in tiles
    _layerSize: null,
    _mapTileSize: null,
    //TMX Layer supports opacity
    _opacity: 255,
    _minGID: null,
    _maxGID: null,
    //Only used when vertexZ is used
    _vertexZvalue: null,
    _useAutomaticVertexZ: null,
    //used for optimization
    _reusedTile: null,
    _atlasIndexArray: null,
    //used for retina display
    _contentScaleFactor: null,

    // used for hex map
    _staggerAxis: null,
    _staggerIndex: null,
    _hexSideLength: 0,

    _className:"TMXLayer",

    /**
     * Creates a _ccsg.TMXLayer with an tile set info, a layer info and a map info   <br/>
     * Constructor of _ccsg.TMXLayer
     * @param {cc.TMXTilesetInfo} tilesetInfo
     * @param {_ccsg.TMXLayerInfo} layerInfo
     * @param {cc.TMXMapInfo} mapInfo
     */
    ctor:function (tilesetInfo, layerInfo, mapInfo) {
        cc.SpriteBatchNode.prototype.ctor.call(this);
        this._descendants = [];

        this._layerSize = cc.size(0, 0);
        this._mapTileSize = cc.size(0, 0);
        this._spriteTiles = {};
        this._staggerAxis = cc.TiledMap.StaggerAxis.STAGGERAXIS_Y;
        this._staggerIndex = cc.TiledMap.StaggerIndex.STAGGERINDEX_EVEN;

        if(mapInfo !== undefined)
            this.initWithTilesetInfo(tilesetInfo, layerInfo, mapInfo);
    },

    _createRenderCmd: function(){
        if(cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new _ccsg.TMXLayer.CanvasRenderCmd(this);
        else
            return new _ccsg.TMXLayer.WebGLRenderCmd(this);
    },

    _fillTextureGrids: function (tileset, texId) {
        var tex = this._textures[texId];
        if (!tex.isLoaded()) {
            tex.once('load', function () {
                this._fillTextureGrids(tileset, texId);
            }, this);
            return;
        }
        if (!tileset.imageSize.width || !tileset.imageSize.height) {
            tileset.imageSize.width = tex.width;
            tileset.imageSize.height = tex.height;
        }
        var tw = tileset._tileSize.width,
            th = tileset._tileSize.height,
            imageW = tex._contentSize.width,
            imageH = tex._contentSize.height,
            spacing = tileset.spacing,
            margin = tileset.margin,

            cols = Math.floor((imageW - margin*2 + spacing) / (tw + spacing)),
            rows = Math.floor((imageH - margin*2 + spacing) / (th + spacing)),
            count = rows * cols,

            gid = tileset.firstGid,
            maxGid = tileset.firstGid + count,
            grids = this._texGrids,
            grid = null,
            override = grids[gid] ? true : false,
            texelCorrect = cc.macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL ? 0.5 : 0;

        for (; gid < maxGid; ++gid) {
            // Avoid overlapping
            if (override && !grids[gid]) {
                override = false;
            }
            if (!override && grids[gid]) {
                break;
            }

            grid = {
                texId: texId,
                x: 0, y: 0, width: tw, height: th,
                t: 0, l: 0, r: 0, b: 0
            };
            tileset.rectForGID(gid, grid);
            grid.x += texelCorrect;
            grid.y += texelCorrect;
            grid.width -= texelCorrect*2;
            grid.height -= texelCorrect*2;
            grid.t = (grid.y) / imageH;
            grid.l = (grid.x) / imageW;
            grid.r = (grid.x + grid.width) / imageW;
            grid.b = (grid.y + grid.height) / imageH;
            grids[gid] = grid;
        }
    },

    /**
     * Initializes a cc.TMXLayer with a tileset info, a layer info and a map info
     * @param {cc.TMXTilesetInfo} tilesetInfo
     * @param {cc.TMXLayerInfo} layerInfo
     * @param {cc.TMXMapInfo} mapInfo
     * @return {Boolean}
     */
    initWithTilesetInfo:function (tilesetInfo, layerInfo, mapInfo) {
        var size = layerInfo._layerSize;

        // layerInfo
        this.layerName = layerInfo.name;
        this.tiles = layerInfo._tiles;
        this.properties = layerInfo.properties;
        this._layerSize = size;
        this._minGID = layerInfo._minGID;
        this._maxGID = layerInfo._maxGID;
        this._opacity = layerInfo._opacity;
        this._staggerAxis = mapInfo.getStaggerAxis();
        this._staggerIndex = mapInfo.getStaggerIndex();
        this._hexSideLength = mapInfo.getHexSideLength();

        // tilesetInfo
        this.tileset = tilesetInfo;

        // mapInfo
        this.layerOrientation = mapInfo.orientation;
        this._mapTileSize = mapInfo.getTileSize();

        var tilesets = mapInfo._tilesets;
        if (tilesets) {
            var i, len = tilesets.length, tileset, tex;
            this._textures = new Array(len);
            this._texGrids = [];
            for (i = 0; i < len; ++i) {
                tileset = tilesets[i];
                tex = cc.textureCache.addImage(tileset.sourceImage);
                this._textures[i] = tex;
                this._fillTextureGrids(tileset, i);
                if (tileset === tilesetInfo) {
                    this._texture = tex;
                }
            }
        }

        // offset (after layer orientation is set);
        var offset = this._calculateLayerOffset(layerInfo.offset);
        this.setPosition(offset);

        // Parse cocos2d properties
        this._parseInternalProperties();

        if (this.layerOrientation === cc.TiledMap.Orientation.HEX) {
            var width = 0, height = 0;
            if (this._staggerAxis === cc.TiledMap.StaggerAxis.STAGGERAXIS_X) {
                height = mapInfo._tileSize.height * (this._layerSize.height + 0.5);
                width = (mapInfo._tileSize.width + this._hexSideLength) * Math.floor(this._layerSize.width / 2) + mapInfo._tileSize.width * (this._layerSize.width % 2);
            } else {
                width = mapInfo._tileSize.width * (this._layerSize.width + 0.5);
                height = (mapInfo._tileSize.height + this._hexSideLength) * Math.floor(this._layerSize.height / 2) + mapInfo._tileSize.height * (this._layerSize.height % 2);
            }
            this.setContentSize(width, height);
        } else {
            this.setContentSize(this._layerSize.width * this._mapTileSize.width,
                this._layerSize.height * this._mapTileSize.height);
        }
        this._useAutomaticVertexZ = false;
        this._vertexZvalue = 0;
        return true;
    },

    /**
     * Gets layer size.
     * @return {Size}
     */
    getLayerSize:function () {
        return cc.size(this._layerSize.width, this._layerSize.height);
    },

    /**
     * Set layer size
     * @param {Size} Var
     */
    setLayerSize:function (Var) {
        this._layerSize.width = Var.width;
        this._layerSize.height = Var.height;
    },

    _getLayerWidth: function () {
        return this._layerSize.width;
    },
    _setLayerWidth: function (width) {
        this._layerSize.width = width;
    },
    _getLayerHeight: function () {
        return this._layerSize.height;
    },
    _setLayerHeight: function (height) {
        this._layerSize.height = height;
    },

    /**
     * Size of the map's tile (could be different from the tile's size)
     * @return {Size}
     */
    getMapTileSize:function () {
        return cc.size(this._mapTileSize.width,this._mapTileSize.height);
    },

    /**
     * Set the map tile size.
     * @param {Size} Var
     */
    setMapTileSize:function (Var) {
        this._mapTileSize.width = Var.width;
        this._mapTileSize.height = Var.height;
    },

    _getTileWidth: function () {
        return this._mapTileSize.width;
    },
    _setTileWidth: function (width) {
        this._mapTileSize.width = width;
    },
    _getTileHeight: function () {
        return this._mapTileSize.height;
    },
    _setTileHeight: function (height) {
        this._mapTileSize.height = height;
    },

    /**
     * Pointer to the map of tiles
     * @return {Array}
     */
    getTiles:function () {
        return this.tiles;
    },

    /**
     * Pointer to the map of tiles
     * @param {Array} Var
     */
    setTiles:function (Var) {
        this.tiles = Var;
    },

    /**
     * Tile set information for the layer
     * @return {cc.TMXTilesetInfo}
     */
    getTileSet:function () {
        return this.tileset;
    },

    /**
     * Tile set information for the layer
     * @param {cc.TMXTilesetInfo} Var
     */
    setTileSet:function (Var) {
        this.tileset = Var;
    },

    /**
     * Layer orientation, which is the same as the map orientation
     * @return {Number}
     */
    getLayerOrientation:function () {
        return this.layerOrientation;
    },

    /**
     * Layer orientation, which is the same as the map orientation
     * @param {Number} Var
     */
    setLayerOrientation:function (Var) {
        this.layerOrientation = Var;
    },

    /**
     * properties from the layer. They can be added using Tiled
     * @return {Array}
     */
    getProperties:function () {
        return this.properties;
    },

    /**
     * properties from the layer. They can be added using Tiled
     * @param {Array} Var
     */
    setProperties:function (Var) {
        this.properties = Var;
    },

    /**
     * Return the value for the specific property name
     * @param {String} propertyName
     * @return {*}
     */
    getProperty:function (propertyName) {
        return this.properties[propertyName];
    },

    /**
     * Gets the layer name
     * @return {String}
     */
    getLayerName:function () {
        return this.layerName;
    },

    /**
     * Set the layer name
     * @param {String} layerName
     */
    setLayerName:function (layerName) {
        this.layerName = layerName;
    },

    /**
     * <p>Dealloc the map that contains the tile position from memory. <br />
     * Unless you want to know at runtime the tiles positions, you can safely call this method. <br />
     * If you are going to call layer.getTileGIDAt() then, don't release the map</p>
     */
    releaseMap:function () {
        this._spriteTiles = {};
    },

    /**
     * <p>Returns the tile (_ccsg.Sprite) at a given a tile coordinate. <br/>
     * The returned _ccsg.Sprite will be already added to the _ccsg.TMXLayer. Don't add it again.<br/>
     * The _ccsg.Sprite can be treated like any other _ccsg.Sprite: rotated, scaled, translated, opacity, color, etc. <br/>
     * You can remove either by calling: <br/>
     * - layer.removeChild(sprite, cleanup); <br/>
     * - or layer.removeTileAt(ccp(x,y)); </p>
     * @param {Vec2|Number} pos or x
     * @param {Number} [y]
     * @return {_ccsg.Sprite}
     */
    getTileAt: function (pos, y) {
        if (pos === undefined) {
            throw new Error("_ccsg.TMXLayer.getTileAt(): pos should be non-null");
        }
        var x = pos;
        if (y === undefined) {
            x = pos.x;
            y = pos.y;
        }
        if (x >= this._layerSize.width || y >= this._layerSize.height || x < 0 || y < 0) {
            throw new Error("_ccsg.TMXLayer.getTileAt(): invalid position");
        }
        if (!this.tiles) {
            cc.log("_ccsg.TMXLayer.getTileAt(): TMXLayer: the tiles map has been released");
            return null;
        }

        var tile = null, gid = this.getTileGIDAt(x, y);

        // if GID == 0, then no tile is present
        if (gid === 0) {
            return tile;
        }

        var z = Math.floor(x) + Math.floor(y) * this._layerSize.width;
        tile = this._spriteTiles[z];
        // tile not created yet. create it
        if (!tile) {
            var rect = this._texGrids[gid];
            var tex = this._textures[rect.texId];

            tile = new _ccsg.Sprite(tex, rect);
            tile.setPosition(this.getPositionAt(x, y));
            var vertexZ = this._vertexZForPos(x, y);
            tile.setVertexZ(vertexZ);
            tile.setAnchorPoint(0, 0);
            tile.setOpacity(this._opacity);
            this.addChild(tile, vertexZ, z);
        }
        return tile;
    },

    /**
     * Returns the tile gid at a given tile coordinate. <br />
     * if it returns 0, it means that the tile is empty. <br />
     * This method requires the the tile map has not been previously released (eg. don't call layer.releaseMap())<br />
     * @param {cc.Vec2|Number} pos or x
     * @param {Number} [y]
     * @return {Number}
     */
    getTileGIDAt:function (pos, y) {
        if (pos === undefined) {
            throw new Error("_ccsg.TMXLayer.getTileGIDAt(): pos should be non-null");
        }
        var x = pos;
        if (y === undefined) {
            x = pos.x;
            y = pos.y;
        }
        if (x >= this._layerSize.width || y >= this._layerSize.height || x < 0 || y < 0) {
            throw new Error("_ccsg.TMXLayer.getTileGIDAt(): invalid position");
        }
        if (!this.tiles) {
            cc.log("_ccsg.TMXLayer.getTileGIDAt(): TMXLayer: the tiles map has been released");
            return null;
        }

        var idx = Math.floor(x) + Math.floor(y) * this._layerSize.width;
        // Bits on the far end of the 32-bit global tile ID are used for tile flags
        var tile = this.tiles[idx];

        return (tile & cc.TiledMap.TileFlag.FLIPPED_MASK) >>> 0;
    },
    // XXX: deprecated
    // tileGIDAt:getTileGIDAt,

    /**
     * <p>Sets the tile gid (gid = tile global id) at a given tile coordinate.<br />
     * The Tile GID can be obtained by using the method "tileGIDAt" or by using the TMX editor . Tileset Mgr +1.<br />
     * If a tile is already placed at that position, then it will be removed.</p>
     * @param {Number} gid
     * @param {cc.Vec2|Number} posOrX position or x
     * @param {Number} flagsOrY flags or y
     * @param {Number} [flags]
     */
    setTileGID: function(gid, posOrX, flagsOrY, flags) {
        if (posOrX === undefined) {
            throw new Error("_ccsg.TMXLayer.setTileGID(): pos should be non-null");
        }
        var pos;
        if (flags !== undefined) {
            pos = cc.p(posOrX, flagsOrY);
        } else {
            pos = posOrX;
            flags = flagsOrY;
        }

        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);
        if(pos.x >= this._layerSize.width || pos.y >= this._layerSize.height || pos.x < 0 || pos.y < 0) {
            throw new Error("_ccsg.TMXLayer.setTileGID(): invalid position");
        }
        if (!this.tiles) {
            cc.log("_ccsg.TMXLayer.setTileGID(): TMXLayer: the tiles map has been released");
            return;
        }
        if (gid !== 0 && gid < this.tileset.firstGid) {
            cc.log( "_ccsg.TMXLayer.setTileGID(): invalid gid:" + gid);
            return;
        }

        flags = flags || 0;
        var currentFlags = this.getTileFlagsAt(pos);
        var currentGID = this.getTileGIDAt(pos);

        if (currentGID !== gid || currentFlags !== flags) {
            var gidAndFlags = (gid | flags) >>> 0;
            // setting gid=0 is equal to remove the tile
            if (gid === 0)
                this.removeTileAt(pos);
            else if (currentGID === 0)            // empty tile. create a new one
                this._updateTileForGID(gidAndFlags, pos);
            else {                // modifying an existing tile with a non-empty tile
                var z = pos.x + pos.y * this._layerSize.width;
                var sprite = this.getChildByTag(z);
                if (sprite) {
                    var rect = this._texGrids[gid];
                    var tex = this._textures[rect.texId];
                    sprite.setTexture(tex);
                    sprite.setTextureRect(rect, false);
                    if (flags != null)
                        this._setupTileSprite(sprite, pos, gidAndFlags);

                    this.tiles[z] = gidAndFlags;
                } else {
                    this._updateTileForGID(gidAndFlags, pos);
                }
            }
        }
    },

    addChild: function (child, localZOrder, tag) {
        _ccsg.Node.prototype.addChild.call(this, child, localZOrder, tag);
        if (tag !== undefined) {
            this._spriteTiles[tag] = child;
            child._vertexZ = this._vertexZ + cc.renderer.assignedZStep * tag / this.tiles.length;
            // child._renderCmd._needDraw = false;
        }
    },

    removeChild: function (child, cleanup) {
        if (this._spriteTiles[child.tag]) {
            this._spriteTiles[child.tag] = null;
            // child._renderCmd._needDraw = true;
        }
        _ccsg.Node.prototype.removeChild.call(this, child, cleanup);
    },

    /**
     * Flipped tiles can be changed dynamically
     * @param {cc.Point|Number} pos or x
     * @param {Number} [y]
     * @return {Number}
     */
    getTileFlagsAt:function (pos, y) {
        if(!pos)
            throw new Error("_ccsg.TMXLayer.getTileFlagsAt(): pos should be non-null");
        if(y !== undefined)
            pos = cc.p(pos, y);
        if(pos.x >= this._layerSize.width || pos.y >= this._layerSize.height || pos.x < 0 || pos.y < 0)
            throw new Error("_ccsg.TMXLayer.getTileFlagsAt(): invalid position");
        if(!this.tiles){
            cc.log("_ccsg.TMXLayer.getTileFlagsAt(): TMXLayer: the tiles map has been released");
            return null;
        }

        var idx = Math.floor(pos.x) + Math.floor(pos.y) * this._layerSize.width;
        // Bits on the far end of the 32-bit global tile ID are used for tile flags
        var tile = this.tiles[idx];

        return (tile & cc.TiledMap.TileFlag.FLIPPED_ALL) >>> 0;
    },
    // XXX: deprecated
    // tileFlagAt:getTileFlagsAt,

    /**
     * Removes a tile at given tile coordinate
     * @param {cc.Point|Number} pos position or x
     * @param {Number} [y]
     */
    removeTileAt:function (pos, y) {
        if (!pos) {
            throw new Error("_ccsg.TMXLayer.removeTileAt(): pos should be non-null");
        }
        if (y !== undefined) {
            pos = cc.p(pos, y);
        }
        if (pos.x >= this._layerSize.width || pos.y >= this._layerSize.height || pos.x < 0 || pos.y < 0) {
            throw new Error("_ccsg.TMXLayer.removeTileAt(): invalid position");
        }
        if (!this.tiles) {
            cc.log("_ccsg.TMXLayer.removeTileAt(): TMXLayer: the tiles map has been released");
            return;
        }

        var gid = this.getTileGIDAt(pos);
        if (gid !== 0) {
            var z = Math.floor(pos.x) + Math.floor(pos.y) * this._layerSize.width;
            // remove tile from GID map
            this.tiles[z] = 0;

            // remove it from sprites and/or texture atlas
            var sprite = this._spriteTiles[z];
            if (sprite) {
                this.removeChild(sprite, true);
            }
        }
    },

    /**
     * Returns the position in pixels of a given tile coordinate
     * @param {cc.Vec2|Number} pos position or x
     * @param {Number} [y]
     * @return {cc.Vec2}
     */
    getPositionAt:function (pos, y) {
        if (y !== undefined)
            pos = cc.p(pos, y);
        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);
        var ret = cc.p(0,0);
        switch (this.layerOrientation) {
            case cc.TiledMap.Orientation.ORTHO:
                ret = this._positionForOrthoAt(pos);
                break;
            case cc.TiledMap.Orientation.ISO:
                ret = this._positionForIsoAt(pos);
                break;
            case cc.TiledMap.Orientation.HEX:
                ret = this._positionForHexAt(pos);
                break;
        }
        return ret;
    },
    // XXX: Deprecated. For backward compatibility only
    // positionAt:getPositionAt,

    _positionForIsoAt:function (pos) {
        return cc.p(this._mapTileSize.width / 2 * ( this._layerSize.width + pos.x - pos.y - 1),
            this._mapTileSize.height / 2 * (( this._layerSize.height * 2 - pos.x - pos.y) - 2));
    },

    _positionForOrthoAt:function (pos) {
        return cc.p(pos.x * this._mapTileSize.width,
            (this._layerSize.height - pos.y - 1) * this._mapTileSize.height);
    },

    _positionForHexAt:function (pos) {
        var xy = cc.p(0, 0);
        var offset = this.tileset.tileOffset;

        var odd_even = (this._staggerIndex === cc.TiledMap.StaggerIndex.STAGGERINDEX_ODD) ? 1 : -1;
        switch (this._staggerAxis)
        {
            case cc.TiledMap.StaggerAxis.STAGGERAXIS_Y:
            {
                var diffX = 0;
                if (pos.y % 2 === 1)
                {
                    diffX = this._mapTileSize.width/2 * odd_even;
                }
                xy = cc.p(pos.x * this._mapTileSize.width+diffX+offset.x,
                    (this._layerSize.height - pos.y - 1) * (this._mapTileSize.height-(this._mapTileSize.height-this._hexSideLength)/2)-offset.y);
                break;
            }
            case cc.TiledMap.StaggerAxis.STAGGERAXIS_X:
            {
                var diffY = 0;
                if (pos.x % 2 === 1)
                {
                    diffY = this._mapTileSize.height/2 * -odd_even;
                }

                xy = cc.p(pos.x * (this._mapTileSize.width-(this._mapTileSize.width-this._hexSideLength)/2)+offset.x,
                    (this._layerSize.height - pos.y - 1) * this._mapTileSize.height + diffY-offset.y);
                break;
            }
        }
        return xy;
    },

    _calculateLayerOffset:function (pos) {
        var ret = cc.p(0,0);
        switch (this.layerOrientation) {
            case cc.TiledMap.Orientation.ORTHO:
                ret = cc.p(pos.x * this._mapTileSize.width, -pos.y * this._mapTileSize.height);
                break;
            case cc.TiledMap.Orientation.ISO:
                ret = cc.p((this._mapTileSize.width / 2) * (pos.x - pos.y),
                    (this._mapTileSize.height / 2 ) * (-pos.x - pos.y));
                break;
            case cc.TiledMap.Orientation.HEX:
                if(this._staggerAxis === cc.TiledMap.StaggerAxis.STAGGERAXIS_Y)
                {
                    var diffX = (this._staggerIndex === cc.TiledMap.StaggerIndex.STAGGERINDEX_EVEN) ? this._mapTileSize.width/2 : 0;
                    ret = cc.p(pos.x * this._mapTileSize.width + diffX,
                               -pos.y * (this._mapTileSize.height - (this._mapTileSize.width - this._hexSideLength) / 2));
                }
                else if(this._staggerAxis === cc.TiledMap.StaggerAxis.STAGGERAXIS_X)
                {
                    var diffY = (this._staggerIndex === cc.TiledMap.StaggerIndex.STAGGERINDEX_ODD) ? this._mapTileSize.height/2 : 0;
                    ret = cc.p(pos.x * (this._mapTileSize.width - (this._mapTileSize.width - this._hexSideLength) / 2),
                               -pos.y * this._mapTileSize.height + diffY);
                }
                break;
        }
        return ret;
    },

    _updateTileForGID:function (gid, pos) {
        if (!this._texGrids[gid]) {
            return;
        }

        var idx = 0 | (pos.x + pos.y * this._layerSize.width);
        if (idx < this.tiles.length) {
            this.tiles[idx] = gid;
        }
    },

    //The layer recognizes some special properties, like cc_vertez
    _parseInternalProperties:function () {
        // if cc_vertex=automatic, then tiles will be rendered using vertexz
        var vertexz = this.getProperty("cc_vertexz");
        if (vertexz) {
            if (vertexz === "automatic") {
                this._useAutomaticVertexZ = true;
                var alphaFuncVal = this.getProperty("cc_alpha_func");
                var alphaFuncValue = 0;
                if (alphaFuncVal)
                    alphaFuncValue = parseFloat(alphaFuncVal);

                if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {        //todo: need move to WebGL render cmd
                    this.shaderProgram = cc.shaderCache.programForKey(cc.macro.SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST);
                    // NOTE: alpha test shader is hard-coded to use the equivalent of a glAlphaFunc(GL_GREATER) comparison
                    this.shaderProgram.use();
                    this.shaderProgram.setUniformLocationWith1f(cc.UNIFORM_ALPHA_TEST_VALUE_S, alphaFuncValue);
                }
            } else
                this._vertexZvalue = parseInt(vertexz, 10);
        }
    },

    _setupTileSprite:function (sprite, pos, gid) {
        var posInPixel = this.getPositionAt(pos);
        sprite.setPosition(posInPixel);
        sprite.setVertexZ(this._vertexZForPos(pos));
        sprite.setAnchorPoint(0, 0);
        sprite.setOpacity(this._opacity);
        sprite.setFlippedX(false);
        sprite.setFlippedY(false);
        sprite.setRotation(0.0);

        // Rotation in tiled is achieved using 3 flipped states, flipping across the horizontal, vertical, and diagonal axes of the tiles.
        if ((gid & cc.TiledMap.TileFlag.DIAGONAL) >>> 0) {
            // put the anchor in the middle for ease of rotation.
            sprite.setAnchorPoint(0.5, 0.5);
            sprite.setPosition(posInPixel.x + sprite.width/2, posInPixel.y + sprite.height/2);

            var flag = (gid & (cc.TiledMap.TileFlag.HORIZONTAL | cc.TiledMap.TileFlag.VERTICAL) >>> 0) >>> 0;
            // handle the 4 diagonally flipped states.
            if (flag === cc.TiledMap.TileFlag.HORIZONTAL)
                sprite.setRotation(90);
            else if (flag === cc.TiledMap.TileFlag.VERTICAL)
                sprite.setRotation(270);
            else if (flag === (cc.TiledMap.TileFlag.VERTICAL | cc.TiledMap.TileFlag.HORIZONTAL) >>> 0) {
                sprite.setRotation(90);
                sprite.setFlippedX(true);
            } else {
                sprite.setRotation(270);
                sprite.setFlippedX(true);
            }
        } else {
            if ((gid & cc.TiledMap.TileFlag.HORIZONTAL) >>> 0) {
                sprite.setFlippedX(true);
            }

            if ((gid & cc.TiledMap.TileFlag.VERTICAL) >>> 0) {
                sprite.setFlippedY(true);
            }
        }
    },

    _vertexZForPos:function (x, y) {
        if (y === undefined) {
            y = x.y;
            x = x.x;
        }
        var ret = 0;
        var maxVal = 0;
        if (this._useAutomaticVertexZ) {
            switch (this.layerOrientation) {
                case cc.TiledMap.Orientation.ISO:
                    maxVal = this._layerSize.width + this._layerSize.height;
                    ret = -(maxVal - (x + y));
                    break;
                case cc.TiledMap.Orientation.ORTHO:
                    ret = -(this._layerSize.height - y);
                    break;
                case cc.TiledMap.Orientation.HEX:
                    cc.log("TMX Hexa zOrder not supported");
                    break;
                default:
                    cc.log("TMX invalid value");
                    break;
            }
        } else {
            ret = this._vertexZvalue;
        }
        return ret;
    }
});
