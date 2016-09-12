/**
 * Created by cocos2d-x on 16/7/7.
 */

_ccsg.TMXObjectImage = _ccsg.Sprite.extend(/** @lends cc.TMXObjectImage# */{
    _groupSize : cc.size(0,0),

    ctor:function (objInfo, mapInfo, groupSize) {
        _ccsg.Sprite.prototype.ctor.call(this);
        this._groupSize = groupSize;
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
        case cc.TiledMap.Orientation.HEX:
            this.setAnchorPoint(cc.p(0, 0));
            this.setPosition(this.offset.x, this._groupSize.height - this.offset.y);
            break;
        case cc.TiledMap.Orientation.ISO:
            this.setAnchorPoint(cc.p(0.5, 0));
            var posIdx = cc.p(this.offset.x / mapInfo._tileSize.width * 2, this.offset.y / mapInfo._tileSize.height);
            var pos = cc.p(mapInfo._tileSize.width / 2 * ( mapInfo._mapSize.width + posIdx.x - posIdx.y),
                           mapInfo._tileSize.height / 2 * ( mapInfo._mapSize.height * 2 - posIdx.x - posIdx.y));
            this.setPosition(pos);
            break;
        default:
            break;
        }
    }
});

_ccsg.TMXObjectShape = cc.DrawNode.extend(/** @lends cc.TMXObjectShape# */{
    _groupSize : cc.size(0,0),
    _color : cc.Color.WHITE,
    _mapOrientation : 0,
    _mapInfo : null,

    ctor:function (objInfo, mapInfo, groupSize, color) {
        cc.DrawNode.prototype.ctor.call(this);
        this.setLineWidth(1);
        this._groupSize = groupSize;
        this._color = color;
        this._mapInfo = mapInfo;
        this._mapOrientation = mapInfo.getOrientation();
        this._initWithObjectInfo(objInfo);
        this._initShape(objInfo);
    },

    _initShape : function (objInfo) {
        var originPos;
        if (cc.TiledMap.Orientation.ISO !== this._mapOrientation) {
            var startPos = cc.p(0, this._groupSize.height);
            originPos = cc.p(startPos.x + this.offset.x, startPos.y - this.offset.y);
        } else {
            originPos = this._getPosByOffset(cc.p(0, 0));
        }
        this.setPosition(originPos);
        this.setRotation(this.objectRotation);

        switch (this.type) {
            case cc.TiledMap.TMXObjectType.RECT:
                this._drawRect();
                break;
            case cc.TiledMap.TMXObjectType.ELLIPSE:
                this._drawEllipse();
                break;
            case cc.TiledMap.TMXObjectType.POLYGON:
                this._drawPoly(objInfo, originPos, true);
                break;
            case cc.TiledMap.TMXObjectType.POLYLINE:
                this._drawPoly(objInfo, originPos, false);
                break;
            default:
                break;
        }
        this.setVisible(this.objectVisible);
    },

    _getPosByOffset : function(offset)
    {
        var mapSize = this._mapInfo.getMapSize();
        var tileSize = this._mapInfo.getTileSize();
        var posIdx = cc.p((this.offset.x + offset.x) / tileSize.width * 2, (this.offset.y + offset.y) / tileSize.height);
        return cc.p(tileSize.width / 2 * (mapSize.width + posIdx.x - posIdx.y),
                    tileSize.height / 2 * (mapSize.height * 2 - posIdx.x - posIdx.y));
    },

    _drawRect : function () {
        if (cc.TiledMap.Orientation.ISO !== this._mapOrientation) {
            var objSize = this.objectSize;
            if (objSize.equals(cc.Size.ZERO)) {
                objSize = cc.size(20, 20);
                this.setAnchorPoint(cc.p(0.5, 0.5));
            } else {
                this.setAnchorPoint(cc.p(0, 1));
            }
            var bl = cc.p(0, 0);
            var tr = cc.p(objSize.width, objSize.height);
            this.drawRect(bl, tr, null, this.getLineWidth(), this._color);

            this.setContentSize(objSize);
        } else {
            if (this.objectSize.equals(cc.Size.ZERO)) {
                return;
            }

            var pos1 = this._getPosByOffset(cc.p(0, 0));
            var pos2 = this._getPosByOffset(cc.p(this.objectSize.width, 0));
            var pos3 = this._getPosByOffset(cc.p(this.objectSize.width, this.objectSize.height));
            var pos4 = this._getPosByOffset(cc.p(0, this.objectSize.height));

            var width = pos2.x - pos4.x, height = pos1.y - pos3.y;
            this.setContentSize(cc.size(width, height));
            this.setAnchorPoint(cc.p((pos1.x - pos4.x) / width, 1));

            var origin = cc.p(pos4.x, pos3.y);
            pos1.subSelf(origin);
            pos2.subSelf(origin);
            pos3.subSelf(origin);
            pos4.subSelf(origin);
            if (this.objectSize.width > 0) {
                this.drawSegment(pos1, pos2, this.getLineWidth(), this._color);
                this.drawSegment(pos3, pos4, this.getLineWidth(), this._color);
            }

            if (this.objectSize.height > 0) {
                this.drawSegment(pos1, pos4, this.getLineWidth(), this._color);
                this.drawSegment(pos3, pos2, this.getLineWidth(), this._color);
            }
        }
    },

    _drawEllipse : function() {
        var scaleX = 1.0, scaleY = 1.0, radius = 0.0;
        var center = cc.p(0, 0);
        var ellipseNode = null;
        if (cc.TiledMap.Orientation.ISO !== this._mapOrientation) {
            var objSize = this.objectSize;
            if (objSize.equals(cc.Size.ZERO)) {
                objSize = cc.size(20, 20);
                this.setAnchorPoint(cc.p(0.5, 0.5));
            } else {
                this.setAnchorPoint(cc.p(0, 1));
            }

            center = cc.p(objSize.width / 2, objSize.height / 2);
            if (objSize.width > objSize.height) {
                scaleX = objSize.width / objSize.height;
                radius = objSize.height / 2;
            } else {
                scaleY = objSize.height / objSize.width;
                radius = objSize.width / 2;
            }
            ellipseNode = this;

            this.setContentSize(objSize);
        } else {
            if (this.objectSize.equals(cc.Size.ZERO)) {
                return;
            }

            // draw the rect
            var pos1 = this._getPosByOffset(cc.p(0, 0));
            var pos2 = this._getPosByOffset(cc.p(this.objectSize.width, 0));
            var pos3 = this._getPosByOffset(cc.p(this.objectSize.width, this.objectSize.height));
            var pos4 = this._getPosByOffset(cc.p(0, this.objectSize.height));

            var width = pos2.x - pos4.x, height = pos1.y - pos3.y;
            this.setContentSize(cc.size(width, height));
            this.setAnchorPoint(cc.p((pos1.x - pos4.x) / width, 1));

            var origin = cc.p(pos4.x, pos3.y);
            pos1.subSelf(origin);
            pos2.subSelf(origin);
            pos3.subSelf(origin);
            pos4.subSelf(origin);
            if (this.objectSize.width > 0) {
                this.drawSegment(pos1, pos2, this.getLineWidth(), this._color);
                this.drawSegment(pos3, pos4, this.getLineWidth(), this._color);
            }

            if (this.objectSize.height > 0) {
                this.drawSegment(pos1, pos4, this.getLineWidth(), this._color);
                this.drawSegment(pos3, pos2, this.getLineWidth(), this._color);
            }

            // add a drawnode to draw the ellipse
            center = this._getPosByOffset(cc.p(this.objectSize.width / 2, this.objectSize.height / 2));
            center.subSelf(origin);

            ellipseNode = new cc.DrawNode();
            ellipseNode.setLineWidth(this.getLineWidth());
            ellipseNode.setContentSize(cc.size(width, height));
            ellipseNode.setAnchorPoint(cc.p(0.5, 0.5));
            ellipseNode.setPosition(center);
            this.addChild(ellipseNode);

            if (this.objectSize.width > this.objectSize.height) {
                scaleX = this.objectSize.width / this.objectSize.height;
                radius = this.objectSize.height / 2;
            } else {
                scaleY = this.objectSize.height / this.objectSize.width;
                radius = this.objectSize.width / 2;
            }
            var tileSize = this._mapInfo.getTileSize();
            var rotateDegree = Math.atan(tileSize.width / tileSize.height);
            radius /= Math.sin(rotateDegree);

            // should rotate the ellipse
            ellipseNode.setRotationX(cc.radiansToDegrees(rotateDegree));
            ellipseNode.setRotationY(90 - cc.radiansToDegrees(rotateDegree));
        }
        ellipseNode.drawCircle(center, radius, 0, 50, false, this.getLineWidth(), this._color);
        ellipseNode.setScaleX(scaleX);
        ellipseNode.setScaleY(scaleY);
    },

    _drawPoly : function (objectInfo, originPos, isPolygon) {
        // parse the data
        var pointsData;
        if (isPolygon)
            pointsData = objectInfo.points;
        else
            pointsData = objectInfo.polylinePoints;

        var points = [];
        var minX = 0, minY = 0, maxX = 0, maxY = 0;
        for (var i = 0, n = pointsData.length; i < n; i++) {
            var pointData = pointsData[i];
            points.push(cc.p(pointData.x, pointData.y));
            minX = Math.min(minX, pointData.x);
            minY = Math.min(minY, pointData.y);
            maxX = Math.max(maxX, pointData.x);
            maxY = Math.max(maxY, pointData.y);
        }

        var width = 0, height = 0;
        if (cc.TiledMap.Orientation.ISO !== this._mapOrientation) {
            // set the content size & anchor point
            width = maxX - minX, height = maxY - minY;
            this.setAnchorPoint(cc.p(-minX / width, maxY / height));

            // correct the points data
            for (var j = 0; j < points.length; j++) {
                points[j] = cc.p(points[j].x - minX, -points[j].y + maxY);
            }
        } else {
            var bl = this._getPosByOffset(cc.p(minX, maxY));
            var tr = this._getPosByOffset(cc.p(maxX, minY));
            var origin = this._getPosByOffset(cc.p(0 ,0));
            width = tr.x - bl.x, height = tr.y - bl.y;
            this.setAnchorPoint(cc.p((origin.x - bl.x) / width, (origin.y - bl.y) / height));

            // correct the points data
            for (var idx = 0; idx < points.length; idx++) {
                var tempPoint = this._getPosByOffset(points[idx]);
                points[idx] = cc.p(tempPoint.x - bl.x, tempPoint.y - bl.y);
            }
        }
        this.setContentSize(cc.size(width, height));

        this.drawPoly(points, null, this.getLineWidth(), this._color, !isPolygon);
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
