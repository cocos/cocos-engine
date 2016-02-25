/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

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
 * Render the TMX layer.
 * @class TiledLayer
 * @extends _RendererBelowSG
 */
var TiledLayer = cc.Class({
    name: 'cc.TiledLayer',
    extends: require('./../core/components/CCRendererBelowSG'),

    editor: CC_EDITOR,

    properties: {},

    onLoad: function () {
        var sgNode = this._sgNode;
        if ( !this.node._sizeProvider ) {
            this.node._sizeProvider = sgNode;
        }
    },

    _createSgNode: function() {
        return null;
    },

    _initSgNode: function() {

    },

    _replaceSgNode: function(sgNode) {
        if (sgNode === this._sgNode) {
            return;
        }

        // Remove the sgNode before
        this._removeSgNode();

        // retain the new sgNode
        if (sgNode && sgNode instanceof _ccsg.TMXLayer) {
            this._sgNode = sgNode;
            this._sgNode.retain();
        } else {
            this._sgNode = null;
        }
    },

    /**
     * Gets the layer name
     * @method getLayerName
     * @return {String}
     */
    getLayerName: function() {
        if (this._sgNode) {
            return this._sgNode.getLayerName();
        }
        return '';
    },

    /**
     * Set the layer name
     * @method SetLayerName
     * @param {String} layerName
     */
    setLayerName:function (layerName) {
        if (this._sgNode) {
            this._sgNode.setLayerName(layerName);
        }
    },

    /**
     * Return the value for the specific property name
     * @method getProperty
     * @param {String} propertyName
     * @return {*}
     */
    getProperty:function (propertyName) {
        if (this._sgNode) {
            return this._sgNode.getProperty(propertyName);
        }

        return null;
    },

    /**
     * Returns the position in pixels of a given tile coordinate
     * @method getPositionAt
     * @param {Vec2|Number} pos position or x
     * @param {Number} [y]
     * @return {Vec2}
     */
    getPositionAt:function (pos, y) {
        if (this._sgNode) {
            return this._sgNode.getPositionAt(pos, y);
        }

        return null;
    },

    /**
     * Removes a tile at given tile coordinate
     * @method removeTileAt
     * @param {Vec2|Number} pos position or x
     * @param {Number} [y]
     */
    removeTileAt:function (pos, y) {
        if (this._sgNode) {
            this._sgNode.removeTileAt(pos, y);
        }
    },

    /**
     * <p>Sets the tile gid (gid = tile global id) at a given tile coordinate.<br />
     * The Tile GID can be obtained by using the method "tileGIDAt" or by using the TMX editor . Tileset Mgr +1.<br />
     * If a tile is already placed at that position, then it will be removed.</p>
     * @method setTileGID
     * @param {Number} gid
     * @param {Vec2|Number} posOrX position or x
     * @param {Number} flagsOrY flags or y
     * @param {Number} [flags]
     */
    setTileGID: function(gid, posOrX, flagsOrY, flags) {
        if (this._sgNode) {
            this._sgNode.setTileGID(gid, posOrX, flagsOrY, flags);
        }
    },

    /**
     *  lipped tiles can be changed dynamically
     * @method getTileFlagsAt
     * @param {Vec2|Number} pos or x
     * @param {Number} [y]
     * @return {Number}
     */
    getTileFlagsAt:function (pos, y) {
        if (this._sgNode) {
            return this._sgNode.getTileFlagsAt(pos, y);
        }
        return 0;
    },

    /**
     * Returns the tile gid at a given tile coordinate. <br />
     * if it returns 0, it means that the tile is empty. <br />
     * This method requires the the tile map has not been previously released (eg. don't call layer.releaseMap())<br />
     * @method getTileGIDAt
     * @param {Vec2|Number} pos or x
     * @param {Number} [y]
     * @return {Number}
     */
    getTileGIDAt:function (pos, y) {
        if (this._sgNode) {
            return this._sgNode.getTileGIDAt(pos, y);
        }
        return 0;
    },

    /**
     * <p>Returns the tile (_ccsg.Sprite) at a given a tile coordinate. <br/>
     * The returned _ccsg.Sprite will be already added to the _ccsg.TMXLayer. Don't add it again.<br/>
     * The _ccsg.Sprite can be treated like any other _ccsg.Sprite: rotated, scaled, translated, opacity, color, etc. <br/>
     * You can remove either by calling: <br/>
     * - layer.removeChild(sprite, cleanup); <br/>
     * - or layer.removeTileAt(ccp(x,y)); </p>
     * @method getTileAt
     * @param {cc.Vec2|Number} pos or x
     * @param {Number} [y]
     * @return {_ccsg.Sprite}
     */
    getTileAt: function (pos, y) {
        if (this._sgNode) {
            return this._sgNode.getTileAt(pos, y);
        }
        return null;
    },

    /**
     * <p>Dealloc the map that contains the tile position from memory. <br />
     * Unless you want to know at runtime the tiles positions, you can safely call this method. <br />
     * If you are going to call layer.getTileGIDAt() then, don't release the map</p>
     * @method releaseMap
     */
    releaseMap:function () {
        if (this._sgNode) {
            this._sgNode.releaseMap();
        }
    },

    /**
     * Sets the untransformed size of the _ccsg.TMXLayer.
     * @method setContentSize
     * @param {cc.Size|Number} size The untransformed size of the _ccsg.TMXLayer or The untransformed size's width of the TMXLayer.
     * @param {Number} [height] The untransformed size's height of the _ccsg.TMXLayer.
     */
    setContentSize:function (size, height) {
        if (this._sgNode) {
            this._sgNode.setContentSize(size, height);
        }
    },

    /**
     * Return texture of cc.SpriteBatchNode
     * @method getTexture
     * @return {cc.Texture2D}
     */
    getTexture: function(){
        if (this._sgNode) {
            return this._sgNode.getTexture();
        }
        return null;
    },

    /**
     * Gets layer size.
     * @method getLayerSize
     * @return {cc.Size}
     */
    getLayerSize:function () {
        if (this._sgNode) {
            return this._sgNode.getLayerSize();
        }
        return cc.size(0, 0);
    },

    /**
     * Set layer size
     * @method setLayerSize
     * @param {cc.Size} layerSize
     */
    setLayerSize:function (layerSize) {
        if (this._sgNode) {
            this._sgNode.setLayerSize(layerSize);
        }
    },

    /**
     * Size of the map's tile (could be different from the tile's size)
     * @method getMapTileSize
     * @return {cc.Size}
     */
    getMapTileSize:function () {
        if (this._sgNode) {
            return this._sgNode.getMapTileSize();
        }
        return cc.size(0, 0);
    },

    /**
     * Set the map tile size.
     * @method setMapTileSize
     * @param {cc.Size} tileSize
     */
    setMapTileSize:function (tileSize) {
        if (this._sgNode) {
            this._sgNode.setMapTileSize(tileSize);
        }
    },

    /**
     * Pointer to the map of tiles
     * @method getTiles
     * @return {Array}
     */
    getTiles:function () {
        if (this._sgNode) {
            return this._sgNode.getTiles();
        }
        return null;
    },

    /**
     * Pointer to the map of tiles
     * @method setTiles
     * @param {Array} tiles
     */
    setTiles:function (tiles) {
        if (this._sgNode) {
            this._sgNode.setTiles(tiles);
        }
    },

    /**
     * Tile set information for the layer
     * @method getTileset
     * @return {cc.TMXTilesetInfo}
     */
    getTileset:function () {
        if (this._sgNode) {
            return this._sgNode.getTileset();
        }
        return null;
    },

    /**
     * Tile set information for the layer
     * @method setTileset
     * @param {cc.TMXTilesetInfo} tileset
     */
    setTileset:function (tileset) {
        if (this._sgNode) {
            this._sgNode.setTileset(tileset);
        }
    },

    /**
     * Layer orientation, which is the same as the map orientation
     * @method getLayerOrientation
     * @return {Number}
     */
    getLayerOrientation:function () {
        if (this._sgNode) {
            return this._sgNode.getLayerOrientation();
        }
        return 0;
    },

    /**
     * Layer orientation, which is the same as the map orientation
     * @method setLayerOrientation
     * @param {Number} orientation
     */
    setLayerOrientation:function (orientation) {
        if (this._sgNode) {
            this._sgNode.setLayerOrientation(orientation);
        }
    },

    /**
     * properties from the layer. They can be added using Tiled
     * @method getProperties
     * @return {Array}
     */
    getProperties:function () {
        if (this._sgNode) {
            return this._sgNode.getProperties();
        }
        return null;
    },

    /**
     * properties from the layer. They can be added using Tiled
     * @method setProperties
     * @param {Array} properties
     */
    setProperties:function (properties) {
        if (this._sgNode) {
            this._sgNode.setProperties(properties);
        }
    },
});

cc.TiledLayer = module.exports = TiledLayer;
