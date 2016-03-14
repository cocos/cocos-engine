/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

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

/**
 * Render the TMX layer.
 * @class TiledLayer
 * @extends _SGComponent
 */
var TiledLayer = cc.Class({
    name: 'cc.TiledLayer',

    // Inherits from the abstract class directly,
    // because TiledLayer not create or maintains the sgNode by itself. 
    extends: cc._SGComponent,

    onEnable: function() {
        if (this._sgNode) {
            this._sgNode.setVisible(true);
        }
    },
    onDisable: function() {
        if (this._sgNode) {
            this._sgNode.setVisible(false);
        }
    },
    //onDestroy: function () {
    //    if ( this.node._sizeProvider === this._sgNode ) {
    //        this.node._sizeProvider = null;
    //    }
    //    this._removeSgNode();
    //},
    
    _initSgNode: function() {
        var sgNode = this._sgNode;
        if ( !sgNode ) {
            return;
        }
        if ( !this.enabledInHierarchy ) {
            sgNode.setVisible(false);
        }
        if ( !this.node._sizeProvider ) {
            this.node._sizeProvider = sgNode;
        }
        var node = this.node;
        sgNode.setAnchorPoint(node.getAnchorPoint());
    },

    _replaceSgNode: function(sgNode) {
        if (sgNode === this._sgNode) {
            return;
        }

        // Remove the sgNode before
        this._removeSgNode();
        if ( this.node._sizeProvider === this._sgNode ) {
            this.node._sizeProvider = null;
        }

        if (sgNode && sgNode instanceof _ccsg.TMXLayer) {
            this._sgNode = sgNode;
            // retain the new sgNode, it will be released in _removeSgNode
            this._sgNode.retain();
            
            this._initSgNode();
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
            if (y !== undefined)
                pos = cc.p(pos, y);
            return this._sgNode.getPositionAt(pos);
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
            if (y !== undefined)
                pos = cc.p(pos, y);
            this._sgNode.removeTileAt(pos);
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
            if(!posOrX)
                throw new Error("_ccsg.TMXLayer.setTileGID(): pos should be non-null");
            var pos;
            if (flags !== undefined) {
                pos = cc.p(posOrX, flagsOrY);
            } else {
                pos = posOrX;
                flags = flagsOrY;
            }
            this._sgNode.setTileGID(gid, pos, flags);
        }
    },

    // TODO Add this method if necessary
    // This method is removed because it's not existed in native.
    /*
     *  lipped tiles can be changed dynamically
     * @method getTileFlagsAt
     * @param {Vec2|Number} pos or x
     * @param {Number} [y]
     * @return {Number}
     */
    //getTileFlagsAt:function (pos, y) {
    //    if (this._sgNode) {
    //        return this._sgNode.getTileFlagsAt(pos, y);
    //    }
    //    return 0;
    //},

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
            if (y !== undefined)
                pos = cc.p(pos, y);
            return this._sgNode.getTileGIDAt(pos);
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
            if (y !== undefined)
                pos = cc.p(pos, y);
            return this._sgNode.getTileAt(pos);
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
            if (height !== undefined)
                size = cc.size(size, height);
            this._sgNode.setContentSize(size);
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
     * Set the texture of cc.SpriteBatchNode
     * @method setTexture
     * @param {cc.Texture2D} texture
     */
    setTexture: function(texture){
        if (this._sgNode) {
            this._sgNode.setTexture(texture);
        }
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
