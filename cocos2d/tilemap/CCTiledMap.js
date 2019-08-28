/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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
    FLIPPED_ALL: (0x80000000 | 0x40000000 | 0x20000000 | 0x10000000) >>> 0,

    /**
     * @property FLIPPED_MASK
     * @type {Number}
     * @static
     */
    FLIPPED_MASK: (~(0x80000000 | 0x40000000 | 0x20000000 | 0x10000000)) >>> 0
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
 * @enum TiledMap.RenderOrder
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

/*
 * !#en The render order of tiled map.
 * !#zh 地图的渲染顺序
 * @enum TiledMap.RenderOrder
 * @static
 */
let RenderOrder = cc.Enum({
    /**
     * @property STAGGERINDEX_ODD
     * @type {Number}
     * @static
     */
    RightDown : 0,
    RightUp : 1,
    LeftDown: 2,
    LeftUp: 3,
});

/**
 * !#en TiledMap Object Type
 * !#zh 地图物体类型
 * @enum TiledMap.TMXObjectType
 * @static
 */
let TMXObjectType = cc.Enum({
    /**
     * @property RECT
     * @type {Number}
     * @static
     */
    RECT : 0,

    /**
     * @property ELLIPSE
     * @type {Number}
     * @static
     */
    ELLIPSE : 1,

    /**
     * @property POLYGON
     * @type {Number}
     * @static
     */
    POLYGON : 2,

    /**
     * @property POLYLINE
     * @type {Number}
     * @static
     */
    POLYLINE : 3,
    
    /**
     * @property IMAGE
     * @type {Number}
     * @static
     */
    IMAGE : 4,

    /**
     * @property TEXT
     * @type {Number}
     * @static
     */
    TEXT: 5,
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
        // store all layer gid corresponding texture info, index is gid, format likes '[gid0]=tex-info,[gid1]=tex-info, ...'
        this._texGrids = [];
        // store all tileset texture, index is tileset index, format likes '[0]=texture0, [1]=texture1, ...'
        this._textures = [];
        this._tilesets = [];

        this._animations = [];
        this._imageLayers = [];
        this._layers = [];
        this._groups = [];
        this._images = [];
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
        TMXObjectType: TMXObjectType,
        RenderOrder: RenderOrder
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
     * !#en enable or disable culling
     * !#zh 开启或关闭裁剪。
     * @method enableCulling
     * @param value
     */
    enableCulling (value) {
        let layers = this._layers;
        for (let i = 0; i < layers.length; ++i) {
            layers[i].enableCulling(value);
        }
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
     * @method getLayers
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

    _changeLayer (layerName, replaceLayer) {
        let layers = this._layers;
        for (let i = 0, l = layers.length; i < l; i++) {
            let layer = layers[i];
            if (layer && layer.getLayerName() === layerName) {
                layers[i] = replaceLayer;
                return;
            }
        }
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

    __preload () {
        if (this._tmxFile) {
            // refresh layer entities
            this._applyFile();
        }
    },

    onEnable () {
        this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._syncAnchorPoint, this);
    },

    onDisable () {
        this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this._syncAnchorPoint, this);
    },

    _applyFile () {
        let file = this._tmxFile;
        if (file) {
            let texValues = file.textures;
            let texKeys = file.textureNames;
            let textures = {};
            for (let i = 0; i < texValues.length; ++i) {
                textures[texKeys[i]] = texValues[i];
            }

            let imageLayerTextures = {};
            texValues = file.imageLayerTextures;
            texKeys = file.imageLayerTextureNames;
            for (let i = 0; i < texValues.length; ++i) {
                imageLayerTextures[texKeys[i]] = texValues[i];
            }

            let tsxFileNames = file.tsxFileNames;
            let tsxFiles = file.tsxFiles;
            let tsxMap = {};
            for (let i = 0; i < tsxFileNames.length; ++i) {
                if (tsxFileNames[i].length > 0) {
                    tsxMap[tsxFileNames[i]] = tsxFiles[i].text;
                }
            }

            let mapInfo = new cc.TMXMapInfo(file.tmxXmlStr, tsxMap, textures, imageLayerTextures);
            let tilesets = mapInfo.getTilesets();
            if(!tilesets || tilesets.length === 0)
                cc.logID(7241);

            this._buildWithMapInfo(mapInfo);
        }
        else {
            this._releaseMapInfo();
        }
    },

    _releaseMapInfo () {
        // remove the layers & object groups added before
        let layers = this._layers;
        for (let i = 0, l = layers.length; i < l; i++) {
            layers[i].node.removeFromParent(true);
            layers[i].node.destroy();
        }
        layers.length = 0;

        let groups = this._groups;
        for (let i = 0, l = groups.length; i < l; i++) {
            groups[i].node.removeFromParent(true);
            groups[i].node.destroy();
        }
        groups.length = 0;

        let images = this._images;
        for (let i = 0, l = images.length; i < l; i++) {
            images[i].removeFromParent(true);
            images[i].destroy();
        }
        images.length = 0;
    },

    _syncAnchorPoint () {
        let anchor = this.node.getAnchorPoint();
        let leftTopX = this.node.width * anchor.x;
        let leftTopY = this.node.height * (1 - anchor.y);
        let i, l;
        for (i = 0, l = this._layers.length; i < l; i++) {
            let layerInfo = this._layers[i];
            let layerNode = layerInfo.node;
            // Tiled layer sync anchor to map because it's old behavior,
            // do not change the behavior avoid influence user's existed logic.
            layerNode.setAnchorPoint(anchor);
        }

        for (i = 0, l = this._groups.length; i < l; i++) {
            let groupInfo = this._groups[i];
            let groupNode = groupInfo.node;
            // Group layer not sync anchor to map because it's old behavior,
            // do not change the behavior avoid influence user's existing logic.
            groupNode.anchorX = 0.5;
            groupNode.anchorY = 0.5;
            groupNode.x = groupInfo._offset.x - leftTopX + groupNode.width * groupNode.anchorX;
            groupNode.y = groupInfo._offset.y + leftTopY - groupNode.height * groupNode.anchorY;
        }

        for (i = 0, l = this._images.length; i < l; i++) {
            let image = this._images[i];
            image.anchorX = 0.5;
            image.anchorY = 0.5;
            image.x = image._offset.x - leftTopX + image.width * image.anchorX;
            image.y = image._offset.y + leftTopY - image.height * image.anchorY;
        }
    },

    _fillAniGrids (texGrids, animations) {
        for (let i in animations) {
            let animation = animations[i];
            if (!animation) continue;
            let frames = animation.frames;
            for (let j = 0; j < frames.length; j++) {
                let frame = frames[j];
                frame.grid = texGrids[frame.tileid];
            }
        }
    },

    _buildLayerAndGroup () {
        let tilesets = this._tilesets;
        let texGrids = this._texGrids;
        let animations = this._animations;
        texGrids.length = 0;
        for (let i = 0, l = tilesets.length; i < l; ++i) {
            let tilesetInfo = tilesets[i];
            if (!tilesetInfo) continue;
            cc.TiledMap.fillTextureGrids(tilesetInfo, texGrids, i);
        }
        this._fillAniGrids(texGrids, animations);

        let layers = this._layers;
        let groups = this._groups;
        let images = this._images;
        let oldNodeNames = {};
        for (let i = 0, n = layers.length; i < n; i++) {
            oldNodeNames[layers[i].node._name] = true;
        }
        for (let i = 0, n = groups.length; i < n; i++) {
            oldNodeNames[groups[i].node._name] = true;
        }
        for (let i = 0, n = images.length; i < n; i++) {
            oldNodeNames[images[i]._name] = true;
        }

        layers = this._layers = [];
        groups = this._groups = [];
        images = this._images = [];

        let mapInfo = this._mapInfo;
        let node = this.node;
        let layerInfos = mapInfo.getAllChildren();
        let textures = this._textures;

        if (layerInfos && layerInfos.length > 0) {
            for (let i = 0, len = layerInfos.length; i < len; i++) {
                let layerInfo = layerInfos[i];
                let name = layerInfo.name;

                let child = this.node.getChildByName(name);
                oldNodeNames[name] = false;

                if (!child) {
                    child = new cc.Node();
                    child.name = name;
                    node.addChild(child);
                }

                child.active = layerInfo.visible;

                if (layerInfo instanceof cc.TMXLayerInfo) {
                    let layer = child.getComponent(cc.TiledLayer);
                    if (!layer) {
                        layer = child.addComponent(cc.TiledLayer);
                    }
                    
                    layer._init(layerInfo, mapInfo, tilesets, textures, texGrids);

                    // tell the layerinfo to release the ownership of the tiles map.
                    layerInfo.ownTiles = false;
                    layers.push(layer);
                }
                else if (layerInfo instanceof cc.TMXObjectGroupInfo) {
                    let group = child.getComponent(cc.TiledObjectGroup);
                    if (!group) {
                        group = child.addComponent(cc.TiledObjectGroup);
                    }
                    group._init(layerInfo, mapInfo, texGrids);
                    groups.push(group);
                }
                else if (layerInfo instanceof cc.TMXImageLayerInfo) {
                    let texture = layerInfo.sourceImage;
                    child.opacity = layerInfo.opacity;
                    child.layerInfo = layerInfo;
                    child._offset = cc.v2(layerInfo.offset.x, -layerInfo.offset.y);

                    let image = child.getComponent(cc.Sprite);
                    if (!image) {
                        image = child.addComponent(cc.Sprite);
                    }
                    image.spriteFrame = new cc.SpriteFrame();
                    image.spriteFrame.setTexture(texture);

                    child.width = texture.width;
                    child.height = texture.height;
                    images.push(child);
                }
            }
        }

        let children = node.children;
        for (let i = 0, n = children.length; i < n; i++) {
            let c = children[i];
            if (oldNodeNames[c._name]) {
                c.destroy();
            }
        }

        this.node.width = this._mapSize.width * this._tileSize.width;
        this.node.height = this._mapSize.height * this._tileSize.height;
        this._syncAnchorPoint();
    },

    _buildWithMapInfo (mapInfo) {
        this._mapInfo = mapInfo;
        this._mapSize = mapInfo.getMapSize();
        this._tileSize = mapInfo.getTileSize();
        this._mapOrientation = mapInfo.orientation;
        this._properties = mapInfo.properties;
        this._tileProperties = mapInfo.getTileProperties();
        this._imageLayers = mapInfo.getImageLayers();
        this._animations = mapInfo.getTileAnimations();
        this._tilesets = mapInfo.getTilesets();

        let tilesets = this._tilesets;
        this._textures.length = 0;

        let totalTextures = [];
        for (let i = 0, l = tilesets.length; i < l; ++i) {
            let tilesetInfo = tilesets[i];
            if (!tilesetInfo || !tilesetInfo.sourceImage) continue;
            this._textures[i] = tilesetInfo.sourceImage;
            totalTextures.push(tilesetInfo.sourceImage);
        }

        for (let i = 0; i < this._imageLayers.length; i++) {
            let imageLayer = this._imageLayers[i];
            if (!imageLayer || !imageLayer.sourceImage) continue;
            totalTextures.push(imageLayer.sourceImage);
        }

        cc.TiledMap.loadAllTextures (totalTextures, function () {
            this._buildLayerAndGroup();
        }.bind(this));
    },

    update (dt) {
        let animations = this._animations;
        let texGrids = this._texGrids;
        for (let aniGID in animations) {
            let animation = animations[aniGID];
            let frames = animation.frames;
            let frame = frames[animation.frameIdx];
            animation.dt += dt;
            if (frame.duration < animation.dt) {
                animation.dt = 0;
                animation.frameIdx++;
                if (animation.frameIdx >= frames.length) {
                    animation.frameIdx = 0;
                }
                frame = frames[animation.frameIdx];
            }
            texGrids[aniGID] = frame.grid;
        }
    },
});

cc.TiledMap = module.exports = TiledMap;

cc.TiledMap.loadAllTextures = function (textures, loadedCallback) {
    let totalNum = textures.length;
    if (totalNum === 0) {
        loadedCallback();
        return;
    }

    let curNum = 0;
    let itemCallback = function () {
        curNum ++;
        if (curNum >= totalNum) {
            loadedCallback();
        }
    };

    for (let i = 0; i < totalNum; i++) {
        let tex = textures[i];
        if (!tex.loaded) {
            tex.once('load', function () {
                itemCallback();
            });
        } else {
            itemCallback();
        }
    }
};

cc.TiledMap.fillTextureGrids = function (tileset, texGrids, texId) {
    let tex = tileset.sourceImage;

    if (!tileset.imageSize.width || !tileset.imageSize.height) {
        tileset.imageSize.width = tex.width;
        tileset.imageSize.height = tex.height;
    }

    let tw = tileset._tileSize.width,
        th = tileset._tileSize.height,
        imageW = tex.width,
        imageH = tex.height,
        spacing = tileset.spacing,
        margin = tileset.margin,

        cols = Math.floor((imageW - margin*2 + spacing) / (tw + spacing)),
        rows = Math.floor((imageH - margin*2 + spacing) / (th + spacing)),
        count = rows * cols,

        gid = tileset.firstGid,
        maxGid = tileset.firstGid + count,
        grid = null,
        override = texGrids[gid] ? true : false,
        texelCorrect = cc.macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX ? 0.5 : 0;

    for (; gid < maxGid; ++gid) {
        // Avoid overlapping
        if (override && !texGrids[gid]) {
            override = false;
        }
        if (!override && texGrids[gid]) {
            break;
        }

        grid = {
            // record texture id
            texId: texId, 
            // record belong to which tileset
            tileset: tileset,
            x: 0, y: 0, width: tw, height: th,
            t: 0, l: 0, r: 0, b: 0,
            gid: gid,
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
        texGrids[gid] = grid;
    }
};

cc.js.obsolete(cc.TiledMap.prototype, 'cc.TiledMap.tmxFile', 'tmxAsset', true);
cc.js.get(cc.TiledMap.prototype, 'mapLoaded', function () {
    cc.errorID(7203);
    return [];
}, false);
