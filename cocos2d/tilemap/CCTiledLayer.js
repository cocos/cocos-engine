var TiledLayer = cc.Class({
    name: 'cc.TiledLayer',
    extends: require('./../core/components/CCComponent'),

    editor: CC_EDITOR,

    properties: {
        _sgLayer: null
    },

    /**
     * bind a _ccsg.TMXLayer for the component
     * @param {_ccsg.TMXLayer} sgLayer
     */
    bindSgLayer: function(sgLayer) {
        if (sgLayer && sgLayer instanceof _ccsg.TMXLayer) {
            this._sgLayer = sgLayer;
        } else {
            this._sgLayer = null;
        }
    },

    /**
     * get the _ccsg.TMXLayer of the component
     * @return {_ccsg.TMXLayer}
     */
    getSgLayer: function() {
        return this.getSgLayer();
    },

    /**
     * Gets the layer name
     * @return {String}
     */
    getLayerName: function() {
        if (this._sgLayer) {
            return this._sgLayer.getLayerName();
        }

        return '';
    },

    /**
     * Set the layer name
     * @param {String} layerName
     */
    setLayerName:function (layerName) {
        if (this._sgLayer) {
            this._sgLayer.setLayerName(layerName);
        }
    },

    /**
     * Return the value for the specific property name
     * @param {String} propertyName
     * @return {*}
     */
    getProperty:function (propertyName) {
        if (this._sgLayer) {
            return this._sgLayer.getProperty(propertyName);
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
        if (this._sgLayer) {
            return this._sgLayer.getPositionAt(pos, y);
        }

        return null;
    },

    /**
     * Removes a tile at given tile coordinate
     * @param {cc.Vec2|Number} pos position or x
     * @param {Number} [y]
     */
    removeTileAt:function (pos, y) {
        if (this._sgLayer) {
            this._sgLayer.removeTileAt(pos, y);
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
        if (this._sgLayer) {
            this._sgLayer.setTileGID(gid, posOrX, flagsOrY, flags);
        }
    },

    /**
     *  lipped tiles can be changed dynamically
     * @param {cc.Vec2|Number} pos or x
     * @param {Number} [y]
     * @return {Number}
     */
    getTileFlagsAt:function (pos, y) {
        if (this._sgLayer) {
            return this._sgLayer.getTileFlagsAt(pos, y);
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
        if (this._sgLayer) {
            return this._sgLayer.getTileGIDAt(pos, y);
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
        if (this._sgLayer) {
            return this._sgLayer.getTileAt(pos, y);
        }
        return null;
    },

    /**
     * <p>Dealloc the map that contains the tile position from memory. <br />
     * Unless you want to know at runtime the tiles positions, you can safely call this method. <br />
     * If you are going to call layer.getTileGIDAt() then, don't release the map</p>
     */
    releaseMap:function () {
        if (this._sgLayer) {
            this._sgLayer.releaseMap();
        }
    },

    /**
     * Sets the untransformed size of the _ccsg.TMXLayer.
     * @override
     * @param {cc.Size|Number} size The untransformed size of the _ccsg.TMXLayer or The untransformed size's width of the TMXLayer.
     * @param {Number} [height] The untransformed size's height of the _ccsg.TMXLayer.
     */
    setContentSize:function (size, height) {
        if (this._sgLayer) {
            this._sgLayer.setContentSize(size, height);
        }
    },

    /**
     * Return texture of cc.SpriteBatchNode
     * @function
     * @return {cc.Texture2D}
     */
    getTexture: function(){
        if (this._sgLayer) {
            return this._sgLayer.getTexture();
        }
        return null;
    },

    /**
     * Gets layer size.
     * @return {cc.Size}
     */
    getLayerSize:function () {
        if (this._sgLayer) {
            return this._sgLayer.getLayerSize();
        }
        return cc.size(0, 0);
    },

    /**
     * Set layer size
     * @param {cc.Size} Var
     */
    setLayerSize:function (Var) {
        if (this._sgLayer) {
            this._sgLayer.setLayerSize(Var);
        }
    },

    /**
     * Size of the map's tile (could be different from the tile's size)
     * @return {cc.Size}
     */
    getMapTileSize:function () {
        if (this._sgLayer) {
            return this._sgLayer.getMapTileSize();
        }
        return cc.size(0, 0);
    },

    /**
     * Set the map tile size.
     * @param {cc.Size} Var
     */
    setMapTileSize:function (Var) {
        if (this._sgLayer) {
            this._sgLayer.setMapTileSize(Var);
        }
    },

    /**
     * Pointer to the map of tiles
     * @return {Array}
     */
    getTiles:function () {
        if (this._sgLayer) {
            return this._sgLayer.getTiles();
        }
        return null;
    },

    /**
     * Pointer to the map of tiles
     * @param {Array} Var
     */
    setTiles:function (Var) {
        if (this._sgLayer) {
            this._sgLayer.setTiles(Var);
        }
    },

    /**
     * Tile set information for the layer
     * @return {cc.TMXTilesetInfo}
     */
    getTileset:function () {
        if (this._sgLayer) {
            return this._sgLayer.getTileset();
        }
        return null;
    },

    /**
     * Tile set information for the layer
     * @param {cc.TMXTilesetInfo} Var
     */
    setTileset:function (Var) {
        if (this._sgLayer) {
            this._sgLayer.setTileset(Var);
        }
    },

    /**
     * Layer orientation, which is the same as the map orientation
     * @return {Number}
     */
    getLayerOrientation:function () {
        if (this._sgLayer) {
            return this._sgLayer.getLayerOrientation();
        }
        return 0;
    },

    /**
     * Layer orientation, which is the same as the map orientation
     * @param {Number} Var
     */
    setLayerOrientation:function (Var) {
        if (this._sgLayer) {
            this._sgLayer.setLayerOrientation(Var);
        }
    },

    /**
     * properties from the layer. They can be added using Tiled
     * @return {Array}
     */
    getProperties:function () {
        if (this._sgLayer) {
            return this._sgLayer.getProperties();
        }
        return null;
    },

    /**
     * properties from the layer. They can be added using Tiled
     * @param {Array} Var
     */
    setProperties:function (Var) {
        if (this._sgLayer) {
            this._sgLayer.setProperties(Var);
        }
    },
});

cc.TiledLayer = module.exports = TiledLayer;
