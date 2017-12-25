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

require('./CCTMXXMLParser');
require('./CCTiledMapAsset');
require('./CCTiledLayer');
require('./CCTiledTile');
require('./CCTiledObjectGroup');

/**
 * !#en The orientation of tiled map.
 * !#zh Tiled Map 地图方向。
 * @enum TiledMap.Orientation
 * @static
 */
let Orientation = cc.Enum({
    /**
     * !#en Orthogonal orientation.
     * !#zh 直角鸟瞰地图（90°地图）。
     * @property ORTHO
     * @type {Number}
     * @static
     */
    ORTHO: 0,

    /**
     * !#en Hexagonal orientation.
     * !#zh 六边形地图
     * @property HEX
     * @type {Number}
     * @static
     */
    HEX: 1,

    /**
     * Isometric orientation.
     * 等距斜视地图（斜45°地图）。
     * @property ISO
     * @type {Number}
     * @static
     */
    ISO: 2
});

/*
 * The property type of tiled map.
 * @enum TiledMap.Property
 * @static
 */
let Property = cc.Enum({
    /**
     * @property NONE
     * @type {Number}
     * @static
     */
    NONE: 0,

    /**
     * @property MAP
     * @type {Number}
     * @static
     */
    MAP: 1,

    /**
     * @property LAYER
     * @type {Number}
     * @static
     */
    LAYER: 2,

    /**
     * @property OBJECTGROUP
     * @type {Number}
     * @static
     */
    OBJECTGROUP: 3,

    /**
     * @property OBJECT
     * @type {Number}
     * @static
     */
    OBJECT: 4,

    /**
     * @property TILE
     * @type {Number}
     * @static
     */
    TILE: 5
});

/*
 * The tile flags of tiled map.
 * @enum TiledMap.TileFlag
 * @static
 */
let TileFlag = cc.Enum({
    /**
     * @property HORIZONTAL
     * @type {Number}
     * @static
     */
    HORIZONTAL: 0x80000000,

    /**
     * @property VERTICAL
     * @type {Number}
     * @static
     */
    VERTICAL: 0x40000000,

    /**
     * @property DIAGONAL
     * @type {Number}
     * @static
     */
    DIAGONAL: 0x20000000,

    /**
     * @property FLIPPED_ALL
     * @type {Number}
     * @static
     */
    FLIPPED_ALL: (0x80000000 | 0x40000000 | 0x20000000) >>> 0,

    /**
     * @property FLIPPED_MASK
     * @type {Number}
     * @static
     */
    FLIPPED_MASK: (~((0x80000000 | 0x40000000 | 0x20000000) >>> 0)) >>> 0
});

/*
 * !#en The stagger axis of Hex tiled map.
 * !#zh 六边形地图的 stagger axis 值
 * @enum TiledMap.StaggerAxis
 * @static
 */
let StaggerAxis = cc.Enum({
    /**
     * @property STAGGERAXIS_X
     * @type {Number}
     * @static
     */
    STAGGERAXIS_X : 0,

    /**
     * @property STAGGERAXIS_Y
     * @type {Number}
     * @static
     */
    STAGGERAXIS_Y : 1
});

/*
 * !#en The stagger index of Hex tiled map.
 * !#zh 六边形地图的 stagger index 值
 * @enum TiledMap.StaggerIndex
 * @static
 */
let StaggerIndex = cc.Enum({
    /**
     * @property STAGGERINDEX_ODD
     * @type {Number}
     * @static
     */
    STAGGERINDEX_ODD : 0,

    /**
     * @property STAGGERINDEX_EVEN
     * @type {Number}
     * @static
     */
    STAGGERINDEX_EVEN : 1
});

let TMXObjectType = cc.Enum({
    RECT : 0,
    ELLIPSE : 1,
    POLYGON : 2,
    POLYLINE : 3,
    IMAGE : 4
});

/**
 * !#en Renders a TMX Tile Map in the scene.
 * !#zh 在场景中渲染一个 tmx 格式的 Tile Map。
 * @class TiledMap
 * @extends Component
 */
let TiledMap = cc.Class({
    name: 'cc.TiledMap',
    extends: cc.Component,

    editor: CC_EDITOR && {
        executeInEditMode: true,
        menu: 'i18n:MAIN_MENU.component.renderers/TiledMap',
    },

    ctor () {
        this._layers = [];
        this._groups = [];
        this._properties = [];
        this._tileProperties = [];
        
        this._mapSize = cc.size(0, 0);
        this._tileSize = cc.size(0, 0);
    },

    statics: {
        Orientation: Orientation,
        Property: Property,
        TileFlag: TileFlag,
        StaggerAxis: StaggerAxis,
        StaggerIndex: StaggerIndex,
        TMXObjectType: TMXObjectType
    },

    properties: {
        _tmxFile: {
            default: null,
            type: cc.TiledMapAsset
        },
        /**
         * !#en The TiledMap Asset.
         * !#zh TiledMap 资源。
         * @property {TiledMapAsset} tmxAsset
         * @default ""
         */
        tmxAsset : {
            get () {
                return this._tmxFile;
            },
            set (value, force) {
                if (this._tmxFile !== value || (CC_EDITOR && force)) {
                    this._tmxFile = value;
                    this._applyFile();
                }
            },
            type: cc.TiledMapAsset
        }
    },

    /**
     * !#en Gets the map size.
     * !#zh 获取地图大小。
     * @method getMapSize
     * @return {Size}
     * @example
     * let mapSize = tiledMap.getMapSize();
     * cc.log("Map Size: " + mapSize);
     */
    getMapSize () {
        return this._mapSize;
    },

    /**
     * !#en Gets the tile size.
     * !#zh 获取地图背景中 tile 元素的大小。
     * @method getTileSize
     * @return {Size}
     * @example
     * let tileSize = tiledMap.getTileSize();
     * cc.log("Tile Size: " + tileSize);
     */
    getTileSize () {
        return this._tileSize;
    },

    /**
     * !#en map orientation.
     * !#zh 获取地图方向。
     * @method getMapOrientation
     * @return {Number}
     * @example
     * let mapOrientation = tiledMap.getMapOrientation();
     * cc.log("Map Orientation: " + mapOrientation);
     */
    getMapOrientation () {
        return this._mapOrientation;
    },

    /**
     * !#en object groups.
     * !#zh 获取所有的对象层。
     * @method getObjectGroups
     * @return {TiledObjectGroup[]}
     * @example
     * let objGroups = titledMap.getObjectGroups();
     * for (let i = 0; i < objGroups.length; ++i) {
     *     cc.log("obj: " + objGroups[i]);
     * }
     */
    getObjectGroups () {
        return this._groups;
    },

    /**
     * !#en Return the TMXObjectGroup for the specific group.
     * !#zh 获取指定的 TMXObjectGroup。
     * @method getObjectGroup
     * @param {String} groupName
     * @return {TiledObjectGroup}
     * @example
     * let group = titledMap.getObjectGroup("Players");
     * cc.log("ObjectGroup: " + group);
     */
    getObjectGroup (groupName) {
        let groups = this._groups;
        for (let i = 0, l = groups.length; i < l; i++) {
            let group = groups[i];
            if (group && group.getGroupName() === groupName) {
                return group;
            }
        }

        return null;
    },

    /**
     * !#en Gets the map properties.
     * !#zh 获取地图的属性。
     * @method getProperties
     * @return {Object[]}
     * @example
     * let properties = titledMap.getProperties();
     * for (let i = 0; i < properties.length; ++i) {
     *     cc.log("Properties: " + properties[i]);
     * }
     */
    getProperties () {
        return this._properties;
    },

    /**
     * !#en Return All layers array.
     * !#zh 返回包含所有 layer 的数组。
     * @method allLayers
     * @returns {TiledLayer[]}
     * @example
     * let layers = titledMap.allLayers();
     * for (let i = 0; i < layers.length; ++i) {
     *     cc.log("Layers: " + layers[i]);
     * }
     */
    getLayers () {
        return this._layers;
    },

    /**
     * !#en return the cc.TiledLayer for the specific layer.
     * !#zh 获取指定名称的 layer。
     * @method getLayer
     * @param {String} layerName
     * @return {TiledLayer}
     * @example
     * let layer = titledMap.getLayer("Player");
     * cc.log(layer);
     */
    getLayer (layerName) {
        let layers = this._layers;
        for (let i = 0, l = layers.length; i < l; i++) {
            let layer = layers[i];
            if (layer && layer.getLayerName() === layerName) {
                return layer;
            }
        }

        return null;
    },

    /**
     * !#en Return the value for the specific property name.
     * !#zh 通过属性名称，获取指定的属性。
     * @method getProperty
     * @param {String} propertyName
     * @return {String}
     * @example
     * let property = titledMap.getProperty("info");
     * cc.log("Property: " + property);
     */
    getProperty (propertyName) {
        return this._properties[propertyName.toString()];
    },

    /**
     * !#en Return properties dictionary for tile GID.
     * !#zh 通过 GID ，获取指定的属性。
     * @method getPropertiesForGID
     * @param {Number} GID
     * @return {Object}
     * @example
     * let properties = titledMap.getPropertiesForGID(GID);
     * cc.log("Properties: " + properties);
     */
    getPropertiesForGID (GID) {
        return this._tileProperties[GID];
    },

    onEnable () {
        if (this._tmxFile) {
            // refresh layer entities
            this._applyFile();
        }
    },

    _applyFile () {
        let sgNode = this._sgNode;
        let file = this._tmxFile;
        let self = this;
        if (file) {
            let resPath = cc.url._rawAssets + file.tmxFolderPath;
            resPath = cc.path.stripSep(resPath);

            if (CC_EDITOR && cc.sys.os === cc.sys.OS_WINDOWS) {
                // In windows editor, the key of loaded textures are using '/'.
                // But the value of cc.url._rawAssets is using '\'
                // So, here should change the separater.
                resPath = resPath.replace(/\\/g, '/');
            }

            let mapInfo = new cc.TMXMapInfo(file.tmxXmlStr, resPath);
            let tilesets = mapInfo.getTilesets();
            if(!tilesets || tilesets.length === 0)
                cc.logID(7213);

            this._buildWithMapInfo(mapInfo);
        }
    },
    
    _buildWithMapInfo (mapInfo) {
        this._mapSize = mapInfo.getMapSize();
        this._tileSize = mapInfo.getTileSize();
        this._mapOrientation = mapInfo.orientation;
        this._properties = mapInfo.properties;
        this._tileProperties = mapInfo.getTileProperties();

        // remove the layers & object groups added before
        let layers = this._layers;
        for (let i = 0, l = layers.length; i < l; i++) {
            layers[i].node.removeFromParent();
        }
        layers.length = 0;

        let groups = this._groups;
        for (let i = 0, l = groups.length; i < l; i++) {
            groups[i].node.removeFromParent();
        }
        groups.length = 0;

        let node = this.node;
        let layerInfos = mapInfo.getAllChildren();
        if (layerInfos && layerInfos.length > 0) {
            for (let i = 0, len = layerInfos.length; i < len; i++) {
                let layerInfo = layerInfos[i];
                let name = layerInfo.name;

                let child = this.node.getChildByName(name);
                if (!child) {
                    child = new cc.Node();
                    child.name = name;
                    child.setAnchorPoint(0,0);
                    
                    node.addChild(child);
                }

                if (layerInfo instanceof cc.TMXLayerInfo && layerInfo.visible) {
                    let layer = child.getComponent(cc.TiledLayer);
                    if (!layer) {
                        layer = child.addComponent(cc.TiledLayer);
                    }

                    let tileset = this._tilesetForLayer(layerInfo, mapInfo);
                    layer._init(tileset, layerInfo, mapInfo);

                    // tell the layerinfo to release the ownership of the tiles map.
                    layerInfo.ownTiles = false;

                    // update content size with the max size
                    this.width = Math.max(this.width, child.width);
                    this.height = Math.max(this.height, child.height);

                    layers.push(layer);
                }
                else if (layerInfo instanceof  cc.TMXObjectGroupInfo) {
                    let group = child.getComponent(cc.TiledObjectGroup);
                    if (!group) {
                        group = child.addComponent(cc.TiledObjectGroup);
                    }

                    group._init(layerInfo, mapInfo);
                    groups.push(group);
                }
            }
        }
    },

    _parseLayer (layerInfo, mapInfo) {
        let node = new cc.Node();
        let layer = node.addComponent(cc.TiledLayer);
        let tileset = this._tilesetForLayer(layerInfo, mapInfo);
        // tell the layerinfo to release the ownership of the tiles map.
        layer.init(tileset, layerInfo, mapInfo);
        layerInfo.ownTiles = false;
        
        return node;
    },

    _tilesetForLayer (layerInfo, mapInfo) {
        let size = layerInfo._layerSize;
        let tilesets = mapInfo.getTilesets();
        if (tilesets) {
            for (let i = tilesets.length - 1; i >= 0; i--) {
                let tileset = tilesets[i];
                if (tileset) {
                    for (let y = 0; y < size.height; y++) {
                        for (let x = 0; x < size.width; x++) {
                            let pos = x + size.width * y;
                            let gid = layerInfo._tiles[pos];
                            if (gid !== 0) {
                                // Optimization: quick return
                                // if the layer is invalid (more than 1 tileset per layer) an cc.assert will be thrown later
                                if (((gid & cc.TiledMap.TileFlag.FLIPPED_MASK)>>>0) >= tileset.firstGid) {
                                    return tileset;
                                }
                            }

                        }
                    }
                }
            }
        }

        // If all the tiles are 0, return empty tileset
        cc.logID(7215, layerInfo.name);
        return null;
    }
});

cc.TiledMap = module.exports = TiledMap;
cc.js.obsolete(cc.TiledMap.prototype, 'cc.TiledMap.tmxFile', 'tmxAsset', true);
cc.js.get(cc.TiledMap.prototype, 'mapLoaded', function () {
    cc.errorID(7203);
    return [];
}, false);
