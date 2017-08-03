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
require('./CCSGTMXLayer');
require('./CCTMXLayerCanvasRenderCmd');
require('./CCTMXLayerWebGLRenderCmd');
/**
 * !#en Render the TMX layer.
 * !#zh 渲染 TMX layer。
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

    onDestroy: function () {
        if ( this.node._sizeProvider === this._sgNode ) {
            this.node._sizeProvider = null;
        }
    },

    _initSgNode: function() {
        var sgNode = this._sgNode;
        if ( !sgNode ) {
            return;
        }
        if ( !this.enabledInHierarchy ) {
            sgNode.setVisible(false);
        }
        this._registSizeProvider();
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
            if (CC_JSB) {
                // retain the new sgNode, it will be released in _removeSgNode
                sgNode.retain();
            }

            this._initSgNode();
        } else {
            this._sgNode = null;
        }
    },

    /**
     * !#en Gets the layer name.
     * !#zh 获取层的名称。
     * @method getLayerName
     * @return {String}
     * @example
     * var layerName = tiledLayer.getLayerName();
     * cc.log(layerName);
     */
    getLayerName: function() {
        if (this._sgNode) {
            return this._sgNode.getLayerName();
        }
        return '';
    },

    /**
     * !#en Set the layer name.
     * !#zh 设置层的名称
     * @method SetLayerName
     * @param {String} layerName
     * @example
     * tiledLayer.setLayerName("New Layer");
     */
    setLayerName:function (layerName) {
        if (this._sgNode) {
            this._sgNode.setLayerName(layerName);
        }
    },

    /**
     * !#en Return the value for the specific property name.
     * !#zh 获取指定属性名的值。
     * @method getProperty
     * @param {String} propertyName
     * @return {*}
     * @example
     * var property = tiledLayer.getProperty("info");
     * cc.log(property);
     */
    getProperty:function (propertyName) {
        if (this._sgNode) {
            return this._sgNode.getProperty(propertyName);
        }

        return null;
    },

    /**
     * !#en Returns the position in pixels of a given tile coordinate.
     * !#zh 获取指定 tile 的像素坐标。
     * @method getPositionAt
     * @param {Vec2|Number} pos position or x
     * @param {Number} [y]
     * @return {Vec2}
     * @example
     * var pos = tiledLayer.getPositionAt(cc.v2(0, 0));
     * cc.log("Pos: " + pos);
     * var pos = tiledLayer.getPositionAt(0, 0);
     * cc.log("Pos: " + pos);
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
     * !#en Removes a tile at given tile coordinate.
     * !#zh 删除指定坐标上的 tile。
     * @method removeTileAt
     * @param {Vec2|Number} pos position or x
     * @param {Number} [y]
     * @example
     * tiledLayer.removeTileAt(cc.v2(0, 0));
     * tiledLayer.removeTileAt(0, 0);
     */
    removeTileAt:function (pos, y) {
        if (this._sgNode) {
            if (y !== undefined)
                pos = cc.p(pos, y);
            this._sgNode.removeTileAt(pos);
        }
    },

    /**
     * !#en
     * Sets the tile gid (gid = tile global id) at a given tile coordinate.<br />
     * The Tile GID can be obtained by using the method "tileGIDAt" or by using the TMX editor . Tileset Mgr +1.<br />
     * If a tile is already placed at that position, then it will be removed.
     * !#zh
     * 设置给定坐标的 tile 的 gid (gid = tile 全局 id)，
     * tile 的 GID 可以使用方法 “tileGIDAt” 来获得。<br />
     * 如果一个 tile 已经放在那个位置，那么它将被删除。
     * @method setTileGID
     * @param {Number} gid
     * @param {Vec2|Number} posOrX position or x
     * @param {Number} flagsOrY flags or y
     * @param {Number} [flags]
     * @example
     * tiledLayer.setTileGID(1001, 10, 10, 1)
     */
    setTileGID: function(gid, posOrX, flagsOrY, flags) {
        if (this._sgNode) {
            if(posOrX === undefined)
                throw new Error("_ccsg.TMXLayer.setTileGID(): pos should be non-null");
            var pos;
            if (flags !== undefined || !(posOrX instanceof cc.Vec2)) {
                // four parameters or posOrX is not a Vec2 object
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
     * !#en
     * Returns the tile gid at a given tile coordinate. <br />
     * if it returns 0, it means that the tile is empty. <br />
     * This method requires the the tile map has not been previously released (eg. don't call layer.releaseMap())<br />
     * !#zh
     * 通过给定的 tile 坐标、flags（可选）返回 tile 的 GID. <br />
     * 如果它返回 0，则表示该 tile 为空。<br />
     * 该方法要求 tile 地图之前没有被释放过(如：没有调用过layer.releaseMap()).
     * @method getTileGIDAt
     * @param {Vec2|Number} pos or x
     * @param {Number} [y]
     * @return {Number}
     * @example
     * var tileGid = tiledLayer.getTileGIDAt(0, 0);
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
     * !#en
     * Returns the tile (_ccsg.Sprite) at a given a tile coordinate. <br/>
     * The returned _ccsg.Sprite will be already added to the _ccsg.TMXLayer. Don't add it again.<br/>
     * The _ccsg.Sprite can be treated like any other _ccsg.Sprite: rotated, scaled, translated, opacity, color, etc. <br/>
     * You can remove either by calling: <br/>
     * - layer.removeChild(sprite, cleanup); <br/>
     * - or layer.removeTileAt(ccp(x,y));
     * !#zh
     * 通过指定的 tile 坐标获取对应的 tile(Sprite)。 返回的 tile(Sprite) 应是已经添加到 TMXLayer，请不要重复添加。<br/>
     * 这个 tile(Sprite) 如同其他的 Sprite 一样，可以旋转、缩放、翻转、透明化、设置颜色等。<br/>
     * 你可以通过调用以下方法来对它进行删除:<br/>
     * 1. layer.removeChild(sprite, cleanup);<br/>
     * 2. 或 layer.removeTileAt(cc.v2(x,y));
     * @method getTileAt
     * @param {Vec2|Number} pos or x
     * @param {Number} [y]
     * @return {_ccsg.Sprite}
     * @example
     * var title = tiledLayer.getTileAt(100, 100);
     * cc.log(title);
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
     * !#en
     * Dealloc the map that contains the tile position from memory. <br />
     * Unless you want to know at runtime the tiles positions, you can safely call this method. <br />
     * If you are going to call layer.getTileGIDAt() then, don't release the map.
     * !#zh
     * 从内存中释放包含 tile 位置信息的地图。<br />
     * 除了在运行时想要知道 tiles 的位置信息外，你都可安全的调用此方法。<br />
     * 如果你之后还要调用 layer.tileGIDAt(), 请不要释放地图.
     * @method releaseMap
     * @example
     * tiledLayer.releaseMap();
     */
    releaseMap:function () {
        if (this._sgNode) {
            this._sgNode.releaseMap();
        }
    },

    /**
     * !#en Sets the untransformed size of the _ccsg.TMXLayer.
     * !#zh 设置未转换的 layer 大小。
     * @method setContentSize
     * @param {Size|Number} size The untransformed size of the _ccsg.TMXLayer or The untransformed size's width of the TMXLayer.
     * @param {Number} [height] The untransformed size's height of the _ccsg.TMXLayer.
     * @example
     * tiledLayer.setContentSize(100, 100);
     */
    setContentSize:function (size, height) {
        if (this._sgNode) {
            if (height !== undefined)
                size = cc.size(size, height);
            this._sgNode.setContentSize(size);
        }
    },

    /**
     * !#en Return texture of cc.SpriteBatchNode.
     * !#zh 获取纹理。
     * @method getTexture
     * @return {Texture2D}
     * @example
     * var texture = tiledLayer.getTexture();
     * cc.log("Texture: " + texture);
     */
    getTexture: function(){
        if (this._sgNode) {
            return this._sgNode.getTexture();
        }
        return null;
    },

    /**
     * !#en Set the texture of cc.SpriteBatchNode.
     * !#zh 设置纹理。
     * @method setTexture
     * @param {Texture2D} texture
     * @example
     * tiledLayer.setTexture(texture);
     */
    setTexture: function(texture){
        if (this._sgNode) {
            this._sgNode.setTexture(texture);
        }
    },

    /**
     * !#en Set the opacity of all tiles
     * !#zh 设置所有 Tile 的透明度
     * @method setTileOpacity
     * @param {Number} opacity
     * @example
     * tiledLayer.setTileOpacity(128);
     */
    setTileOpacity: function(opacity) {
        if (this._sgNode) {
            if (CC_JSB) {
                this._sgNode.setTileOpacity(opacity);
            } else {
                this._sgNode._opacity = opacity;
            }
        }
    },

    /**
     * !#en Gets layer size.
     * !#zh 获得层大小。
     * @method getLayerSize
     * @return {Size}
     * @example
     * var size = tiledLayer.getLayerSize();
     * cc.log("layer size: " + size);
     */
    getLayerSize:function () {
        if (this._sgNode) {
            return this._sgNode.getLayerSize();
        }
        return cc.size(0, 0);
    },

    /**
     * !#en Set layer size.
     * !#zh 设置层大小。
     * @method setLayerSize
     * @param {Size} layerSize
     * @example
     * tiledLayer.setLayerSize(new cc.size(5, 5));
     */
    setLayerSize:function (layerSize) {
        if (this._sgNode) {
            this._sgNode.setLayerSize(layerSize);
        }
    },

    /**
     * !#en Size of the map's tile (could be different from the tile's size).
     * !#zh 获取 tile 的大小( tile 的大小可能会有所不同)。
     * @method getMapTileSize
     * @return {Size}
     * @example
     * var mapTileSize = tiledLayer.getMapTileSize();
     * cc.log("MapTile size: " + mapTileSize);
     */
    getMapTileSize:function () {
        if (this._sgNode) {
            return this._sgNode.getMapTileSize();
        }
        return cc.size(0, 0);
    },

    /**
     * !#en Set the map tile size.
     * !#zh 设置 tile 的大小。
     * @method setMapTileSize
     * @param {Size} tileSize
     * @example
     * tiledLayer.setMapTileSize(new cc.size(10, 10));
     */
    setMapTileSize:function (tileSize) {
        if (this._sgNode) {
            this._sgNode.setMapTileSize(tileSize);
        }
    },

    /**
     * !#en Pointer to the map of tiles.
     * !#zh 获取地图 tiles。
     * @method getTiles
     * @return {Array}
     * @example
     * var tiles = tiledLayer.getTiles();
     */
    getTiles:function () {
        if (this._sgNode) {
            return this._sgNode.getTiles();
        }
        return null;
    },

    /**
     * !#en Pointer to the map of tiles.
     * !#zh 设置地图 tiles
     * @method setTiles
     * @param {Array} tiles
     * @example
     * tiledLayer.setTiles(tiles);
     */
    setTiles:function (tiles) {
        if (this._sgNode) {
            this._sgNode.setTiles(tiles);
        }
    },

    /**
     * !#en Tile set information for the layer.
     * !#zh 获取 layer 的 Tileset 信息。
     * @method getTileSet
     * @return {TMXTilesetInfo}
     * @example
     * var tileset = tiledLayer.getTileSet();
     */
    getTileSet:function () {
        if (this._sgNode) {
            return this._sgNode.getTileSet();
        }
        return null;
    },

    /**
     * !#en Tile set information for the layer.
     * !#zh 设置 layer 的 Tileset 信息。
     * @method setTileSet
     * @param {TMXTilesetInfo} tileset
     * @example
     * tiledLayer.setTileSet(tileset);
     */
    setTileSet:function (tileset) {
        if (this._sgNode) {
            this._sgNode.setTileSet(tileset);
        }
    },

    /**
     * !#en Layer orientation, which is the same as the map orientation.
     * !#zh 获取 Layer 方向(同地图方向)。
     * @method getLayerOrientation
     * @return {Number}
     * @example
     * var orientation = tiledLayer.getLayerOrientation();
     * cc.log("Layer Orientation: " + orientation);
     */
    getLayerOrientation:function () {
        if (this._sgNode) {
            return this._sgNode.getLayerOrientation();
        }
        return 0;
    },

    /**
     * !#en Layer orientation, which is the same as the map orientation.
     * !#zh 设置 Layer 方向(同地图方向)。
     * @method setLayerOrientation
     * @param {TiledMap.Orientation} orientation
     * @example
     * tiledLayer.setLayerOrientation(TiledMap.Orientation.ORTHO);
     */
    setLayerOrientation:function (orientation) {
        if (this._sgNode) {
            this._sgNode.setLayerOrientation(orientation);
        }
    },

    /**
     * !#en properties from the layer. They can be added using Tiled.
     * !#zh 获取 layer 的属性，可以使用 Tiled 编辑器添加属性。
     * @method getProperties
     * @return {Array}
     * @example
     * var properties = tiledLayer.getProperties();
     * cc.log("Properties: " + properties);
     */
    getProperties:function () {
        if (this._sgNode) {
            return this._sgNode.getProperties();
        }
        return null;
    },

    /**
     * !#en properties from the layer. They can be added using Tiled.
     * !#zh 设置层属性。
     * @method setProperties
     * @param {Array} properties
     * @example
     * tiledLayer.setLayerOrientation(properties);
     */
    setProperties:function (properties) {
        if (this._sgNode) {
            this._sgNode.setProperties(properties);
        }
    },

    // The method will remove self component from the node,
    // and try to remove the node from scene graph.
    // It should only be invoked by cc.TiledMap
    // DO NOT use it manually.
    _tryRemoveNode: function() {
        this.node.removeComponent(cc.TiledLayer);
        if (this.node._components.length === 1 &&
            this.node.getChildren().length === 0) {
            this.node.removeFromParent();
        }
    }
});

cc.TiledLayer = module.exports = TiledLayer;
