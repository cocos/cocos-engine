var TiledLayer = cc.Class({
    name: 'cc.TiledLayer',
    extends: require('./../core/components/CCComponentInSG'),

    editor: CC_EDITOR,

    properties: {},

    onLoad: function () {
        var sgNode = this._sgNode;
        if ( !this.node._sizeProvider ) {
            this.node._sizeProvider = sgNode;
        }
    },

    _createSgNode: function() {
        return new _ccsg.TMXLayer();
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
     * @param {String} layerName
     */
    setLayerName:function (layerName) {
        if (this._sgNode) {
            this._sgNode.setLayerName(layerName);
        }
    },

    /**
     * Return the value for the specific property name
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
     * @param {cc.Vec2|Number} pos position or x
     * @param {Number} [y]
     * @return {cc.Vec2}
     */
    getPositionAt:function (pos, y) {
        if (this._sgNode) {
            return this._sgNode.getPositionAt(pos, y);
        }

        return null;
    },

    /**
     * Removes a tile at given tile coordinate
     * @param {cc.Vec2|Number} pos position or x
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
     * @param {Number} gid
     * @param {cc.Vec2|Number} posOrX position or x
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
     * @param {cc.Vec2|Number} pos or x
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
     * @param {cc.Vec2|Number} pos or x
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
     */
    releaseMap:function () {
        if (this._sgNode) {
            this._sgNode.releaseMap();
        }
    },

    /**
     * Sets the untransformed size of the _ccsg.TMXLayer.
     * @override
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
     * @function
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
     * @param {cc.Size} Var
     */
    setLayerSize:function (Var) {
        if (this._sgNode) {
            this._sgNode.setLayerSize(Var);
        }
    },

    /**
     * Size of the map's tile (could be different from the tile's size)
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
     * @param {cc.Size} Var
     */
    setMapTileSize:function (Var) {
        if (this._sgNode) {
            this._sgNode.setMapTileSize(Var);
        }
    },

    /**
     * Pointer to the map of tiles
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
     * @param {Array} Var
     */
    setTiles:function (Var) {
        if (this._sgNode) {
            this._sgNode.setTiles(Var);
        }
    },

    /**
     * Tile set information for the layer
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
     * @param {cc.TMXTilesetInfo} Var
     */
    setTileset:function (Var) {
        if (this._sgNode) {
            this._sgNode.setTileset(Var);
        }
    },

    /**
     * Layer orientation, which is the same as the map orientation
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
     * @param {Number} Var
     */
    setLayerOrientation:function (Var) {
        if (this._sgNode) {
            this._sgNode.setLayerOrientation(Var);
        }
    },

    /**
     * properties from the layer. They can be added using Tiled
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
     * @param {Array} Var
     */
    setProperties:function (Var) {
        if (this._sgNode) {
            this._sgNode.setProperties(Var);
        }
    },
});

cc.TiledLayer = module.exports = TiledLayer;
