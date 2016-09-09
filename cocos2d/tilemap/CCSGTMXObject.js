/**
 * Created by cocos2d-x on 16/7/7.
 */

_ccsg.TMXObjectImage = _ccsg.Sprite.extend(/** @lends cc.TMXObjectImage# */{
    ctor:function (objInfo, mapInfo) {
        _ccsg.Sprite.prototype.ctor.call(this);
        this._initWithObjectInfo(objInfo);
        this.initWithMapInfo(mapInfo);
    },

    initWithMapInfo: function (mapInfo) {
        if (!this.gid) {
            return false;
        }

        var useTileset;
        var tilesets = mapInfo.getTilesets();
        for (var i = tilesets.length - 1; i >= 0; i--) {
            var tileset = tilesets[i];
            if (((this.gid & cc.TiledMap.TileFlag.FLIPPED_MASK)>>>0) >= tileset.firstGid) {
                useTileset = tileset;
                break;
            }
        }

        if (!useTileset) {
            return false;
        }

        this.setVisible(this.objectVisible);

        // init the image
        var texture = cc.textureCache.addImage(cc.path._normalize(tileset.sourceImage));
        this._initWithTileset(texture, useTileset);

        // init the position & anchor point with map info
        this._initPosWithMapInfo(mapInfo);

        // set rotation
        this.setRotation(this.objectRotation);

        // set flip
        if ((this.gid & cc.TiledMap.TileFlag.HORIZONTAL) >>> 0) {
            this.setFlippedX(true);
        }
        if ((this.gid & cc.TiledMap.TileFlag.VERTICAL) >>> 0) {
            this.setFlippedY(true);
        }

        return true;
    },

    _initWithTileset: function(texture, tileset) {
        if (!texture.isLoaded()) {
            texture.once('load', function () {
                this._initWithTileset(texture, tileset);
            }, this);
            return;
        }

        tileset.imageSize.width = texture.width;
        tileset.imageSize.height = texture.height;
        var rect = tileset.rectForGID(this.gid);
        this.initWithTexture(texture, rect);

        // set scale
        this.setScaleX(this.objectSize.width / rect.size.width);
        this.setScaleY(this.objectSize.height / rect.size.height);
    },

    _initPosWithMapInfo: function (mapInfo) {
        var mapOri = mapInfo.getOrientation();
        switch(mapOri) {
        case cc.TiledMap.Orientation.ORTHO:
            this.setAnchorPoint(cc.p(0, 0));
            this.setPosition(this.offset.x, mapInfo._mapSize.height * mapInfo._tileSize.height - this.offset.y);
            break;
        case cc.TiledMap.Orientation.ISO:
            this.setAnchorPoint(cc.p(0.5, 0));
            var posIdx = cc.p(this.offset.x / mapInfo._tileSize.width * 2, this.offset.y / mapInfo._tileSize.height);
            var pos = cc.p(mapInfo._tileSize.width / 2 * ( mapInfo._mapSize.width + posIdx.x - posIdx.y),
                           mapInfo._tileSize.height / 2 * ( mapInfo._mapSize.height * 2 - posIdx.x - posIdx.y));
            this.setPosition(pos);
            break;
        case cc.TiledMap.Orientation.HEX:
            this.setAnchorPoint(cc.p(0, 0));
            var x = this.offset.x;
            var y = 0;
            if (mapInfo.getStaggerAxis() === cc.TiledMap.StaggerAxis.STAGGERAXIS_X) {
                y = mapInfo._tileSize.height * (mapInfo._mapSize.height + 0.5) - this.offset.y;
            }
            else if (mapInfo.getStaggerAxis() === cc.TiledMap.StaggerAxis.STAGGERAXIS_Y) {
                y = (mapInfo._tileSize.height + mapInfo.getHexSideLength()) * Math.floor(mapInfo._mapSize.height / 2) + mapInfo._tileSize.height * (mapInfo._mapSize.height % 2) - this.offset.y;
            }
            this.setPosition(cc.p(x, y));
            break;
        default:
            break;
        }
    }
});

// TODO Add _ccsg.TMXObjectShape for draw the shape object
_ccsg.TMXObjectShape = _ccsg.Node.extend(/** @lends cc.TMXObjectShape# */{
    ctor:function (objInfo, mapInfo) {
        _ccsg.Node.prototype.ctor.call(this);
        this._initWithObjectInfo(objInfo);
    }
});

/**
 * !#en Renders the TMX object.
 * !#zh 渲染 tmx object。
 * @class TMXObject
 * @extends _ccsg.Node
 */
cc.TMXObject = {
    isTmxObject: true,
    offset: cc.p(0, 0),
    gid: 0,
    name: '',
    type: null,
    id: 0,
    objectVisible: true,
    objectSize : cc.size(0, 0),
    objectRotation : 0,
    _properties: null,

    /**
     * !#en Get the name of object
     * !#zh 获取对象的名称
     * @method getObjectName
     * @return {String}
     */
    getObjectName: function() {
        return this.name;
    },

    /**
     * !#en Get the property of object
     * !#zh 获取对象的属性
     * @method getProperty
     * @return {Object}
     */
    getProperty: function (propName) {
        return this._properties[propName];
    },

    setObjectName: function(name) {
        this.name = name;
    },

    setProperties: function (props) {
        this._properties = props;
    },

    _initWithObjectInfo: function (objInfo) {
        this.setProperties(objInfo);
        this.setObjectName(objInfo.name);
        this.id = objInfo.id;
        this.gid = objInfo.gid;
        this.type = objInfo.type;
        this.offset = cc.p(objInfo.x, objInfo.y);

        this.objectSize = cc.size(objInfo.width, objInfo.height);
        this.objectVisible = objInfo.visible;
        this.objectRotation = objInfo.rotation;
    }
};

cc.js.mixin(_ccsg.TMXObjectImage.prototype, cc.TMXObject);
cc.js.mixin(_ccsg.TMXObjectShape.prototype, cc.TMXObject);
