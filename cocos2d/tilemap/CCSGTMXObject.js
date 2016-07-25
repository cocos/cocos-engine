/**
 * Created by cocos2d-x on 16/7/7.
 */

_ccsg.TMXObjectImage = _ccsg.Sprite.extend(/** @lends cc.TMXObjectImage# */{
    ctor:function (objInfo, mapInfo) {
        _ccsg.Sprite.prototype.ctor.call(this);
        this._setProperties(objInfo);
        this.initWithMapInfo(objInfo, mapInfo);
    },

    initWithMapInfo: function (objInfo, mapInfo) {
        this._setObjectName(objInfo.name);
        this.id = objInfo.id;
        this.gid = objInfo.gid;
        this.type = objInfo.type;
        this.offset = cc.p(objInfo.x, objInfo.y);

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

        this.setVisible(objInfo.visible);

        // init the image
        var rect = useTileset.rectForGID(this.gid);
        var texture = cc.textureCache.addImage(cc.path._normalize(useTileset.sourceImage));
        var initRet = this.initWithTexture(texture, rect);
        if (!initRet) {
            return false;
        }

        // init the position & anchor point with map info
        this._initPosWithMapInfo(objInfo, mapInfo);

        // set scale
        this.setScaleX(objInfo.width / rect.size.width);
        this.setScaleY(objInfo.height / rect.size.height);

        // set rotation
        this.setRotation(objInfo.rotation);

        // set flip
        if ((this.gid & cc.TiledMap.TileFlag.HORIZONTAL) >>> 0) {
            this.setFlippedX(true);
        }
        if ((this.gid & cc.TiledMap.TileFlag.VERTICAL) >>> 0) {
            this.setFlippedY(true);
        }

        return true;
    },

    _initPosWithMapInfo: function (objInfo, mapInfo) {
        var mapOri = mapInfo.getOrientation();
        switch(mapOri) {
        case cc.TiledMap.Orientation.ORTHO:
            this.setAnchorPoint(cc.p(0, 0));
            this.setPosition(objInfo.x, mapInfo._mapSize.height * mapInfo._tileSize.height - objInfo.y);
            break;
        case cc.TiledMap.Orientation.ISO:
            this.setAnchorPoint(cc.p(0.5, 0));
            var posIdx = cc.p(objInfo.x / mapInfo._tileSize.width * 2, objInfo.y / mapInfo._tileSize.height);
            var pos = cc.p(mapInfo._tileSize.width / 2 * ( mapInfo._mapSize.width + posIdx.x - posIdx.y),
                           mapInfo._tileSize.height / 2 * ( mapInfo._mapSize.height * 2 - posIdx.x - posIdx.y));
            this.setPosition(pos);
            break;
        case cc.TiledMap.Orientation.HEX:
            this.setAnchorPoint(cc.p(0, 0));
            var x = objInfo.x;
            var y = 0;
            if (mapInfo.getStaggerAxis() === cc.TiledMap.StaggerAxis.STAGGERAXIS_X) {
                y = mapInfo._tileSize.height * (mapInfo._mapSize.height + 0.5) - objInfo.y;
            }
            else if (mapInfo.getStaggerAxis() === cc.TiledMap.StaggerAxis.STAGGERAXIS_Y) {
                y = (mapInfo._tileSize.height + mapInfo.getHexSideLength()) * Math.floor(mapInfo._mapSize.height / 2) + mapInfo._tileSize.height * (mapInfo._mapSize.height % 2) - objInfo.y;
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
        this._setProperties(objInfo);
        this._setObjectName(objInfo.name);
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
    type: '',
    id: 0,
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

    _setObjectName: function(name) {
        this.name = name;
    },

    _setProperties: function (props) {
        this._properties = props;
    }
};

cc.js.mixin(_ccsg.TMXObjectImage.prototype, cc.TMXObjectHelper);
cc.js.mixin(_ccsg.TMXObjectShape.prototype, cc.TMXObjectHelper);
