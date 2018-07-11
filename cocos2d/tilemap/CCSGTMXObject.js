/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

require('../shape-nodes/CCDrawNode');

/**
 * !#en Renders the TMX object.
 * !#zh 渲染 tmx object。
 * @class TMXObject
 */
_ccsg.TMXObject = cc.Class({
    properties : {
        sgNode: null,
        offset: cc.p(0, 0),
        gid: 0,
        name: '',
        type: null,
        id: 0,
        objectVisible: true,
        objectSize: cc.size(0, 0),
        objectRotation: 0,
        _properties: null,
        _groupSize: cc.size(0, 0)
    },

    initWithInfo : function(objInfo, mapInfo, groupSize, color) {
        this.setProperties(objInfo);
        this.setObjectName(objInfo.name);
        this.id = objInfo.id;
        this.gid = objInfo.gid;
        this.type = objInfo.type;
        this.offset = cc.p(objInfo.x, objInfo.y);

        this.objectSize = cc.size(objInfo.width, objInfo.height);
        this.objectVisible = objInfo.visible;
        this.objectRotation = objInfo.rotation;
        this._groupSize = groupSize;

        if (this.type === cc.TiledMap.TMXObjectType.IMAGE) {
            this.sgNode = new _ccsg.TMXObjectImage(this, mapInfo);
        } else {
            this.sgNode = new _ccsg.TMXObjectShape(this, mapInfo, color);
        }
    },

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
     * @param {String} propertyName
     * @return {Object}
     */
    getProperty: function (propName) {
        return this._properties[propName];
    },

    /**
     * !#en Get the properties of object
     * !#zh 获取对象的属性
     * @method getProperties
     * @return {Object}
     */
    getProperties: function () {
        return this._properties;
    },

    /**
     * !#en Set the object name
     * !#zh 设置对象名称
     * @method setObjectName
     * @param {String} name
     */
    setObjectName: function(name) {
        this.name = name;
    },

    /**
     * !#en Set the properties of the object
     * !#zh 设置对象的属性
     * @method setProperties
     * @param {Object} props
     */
    setProperties: function (props) {
        this._properties = props;
    }
});

_ccsg.TMXObjectImage = _ccsg.Sprite.extend(/** @lends cc.TMXObjectImage# */{
    _container : null,

    ctor:function (container, mapInfo) {
        _ccsg.Sprite.prototype.ctor.call(this);
        this._container = container;
        this.initWithMapInfo(mapInfo);
    },

    initWithMapInfo: function (mapInfo) {
        if (!this._container.gid) {
            return false;
        }

        var useTileset;
        var tilesets = mapInfo.getTilesets();
        for (var i = tilesets.length - 1; i >= 0; i--) {
            var tileset = tilesets[i];
            if (((this._container.gid & cc.TiledMap.TileFlag.FLIPPED_MASK)>>>0) >= tileset.firstGid) {
                useTileset = tileset;
                break;
            }
        }

        if (!useTileset) {
            return false;
        }

        this.setVisible(this._container.objectVisible);

        // init the image
        var texture = tileset.sourceImage;
        if (texture) {
            this._initWithTileset(texture, useTileset);
        }

        // init the position & anchor point with map info
        this._initPosWithMapInfo(mapInfo);

        // set rotation
        this.setRotation(this._container.objectRotation);

        // set flip
        if ((this._container.gid & cc.TiledMap.TileFlag.HORIZONTAL) >>> 0) {
            this.setFlippedX(true);
        }
        if ((this._container.gid & cc.TiledMap.TileFlag.VERTICAL) >>> 0) {
            this.setFlippedY(true);
        }

        return true;
    },

    _initWithTileset: function(texture, tileset) {
        if (!texture.loaded) {
            texture.once('load', function () {
                this._initWithTileset(texture, tileset);
            }, this);
            return;
        }

        tileset.imageSize.width = texture.width;
        tileset.imageSize.height = texture.height;
        var rect = tileset.rectForGID(this._container.gid);
        this.initWithTexture(texture, rect);

        // set scale
        this.setScaleX(this._container.objectSize.width / rect.size.width);
        this.setScaleY(this._container.objectSize.height / rect.size.height);
    },

    _initPosWithMapInfo: function (mapInfo) {
        var mapOri = mapInfo.getOrientation();
        switch(mapOri) {
        case cc.TiledMap.Orientation.ORTHO:
        case cc.TiledMap.Orientation.HEX:
            this.setAnchorPoint(cc.p(0, 0));
            this.setPosition(this._container.offset.x, this._container._groupSize.height - this._container.offset.y);
            break;
        case cc.TiledMap.Orientation.ISO:
            this.setAnchorPoint(cc.p(0.5, 0));
            var posIdx = cc.p(this._container.offset.x / mapInfo._tileSize.height, this._container.offset.y / mapInfo._tileSize.height);
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
    _container : null,
    _color : cc.Color.WHITE,
    _mapOrientation : 0,
    _mapInfo : null,

    ctor:function (container, mapInfo, color) {
        cc.DrawNode.prototype.ctor.call(this);
        this.setLineWidth(1);
        this._container = container;
        this._color = color;
        this._mapInfo = mapInfo;
        this._mapOrientation = mapInfo.getOrientation();
        this._initShape();
    },

    _initShape : function () {
        var originPos;
        if (cc.TiledMap.Orientation.ISO !== this._mapOrientation) {
            var startPos = cc.p(0, this._container._groupSize.height);
            originPos = cc.p(startPos.x + this._container.offset.x, startPos.y - this._container.offset.y);
        } else {
            originPos = this._getPosByOffset(cc.p(0, 0));
        }
        this.setPosition(originPos);
        this.setRotation(this._container.objectRotation);

        switch (this._container.type) {
            case cc.TiledMap.TMXObjectType.RECT:
                this._drawRect();
                break;
            case cc.TiledMap.TMXObjectType.ELLIPSE:
                this._drawEllipse();
                break;
            case cc.TiledMap.TMXObjectType.POLYGON:
                this._drawPoly(originPos, true);
                break;
            case cc.TiledMap.TMXObjectType.POLYLINE:
                this._drawPoly(originPos, false);
                break;
            default:
                break;
        }
        this.setVisible(this._container.objectVisible);
    },

    _getPosByOffset : function(offset)
    {
        var mapSize = this._mapInfo.getMapSize();
        var tileSize = this._mapInfo.getTileSize();
        var posIdx = cc.p((this._container.offset.x + offset.x) / tileSize.width * 2, (this._container.offset.y + offset.y) / tileSize.height);
        return cc.p(tileSize.width / 2 * (mapSize.width + posIdx.x - posIdx.y),
                    tileSize.height / 2 * (mapSize.height * 2 - posIdx.x - posIdx.y));
    },

    _drawRect : function () {
        if (cc.TiledMap.Orientation.ISO !== this._mapOrientation) {
            var objSize = this._container.objectSize;
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
            if (this._container.objectSize.equals(cc.Size.ZERO)) {
                return;
            }

            var pos1 = this._getPosByOffset(cc.p(0, 0));
            var pos2 = this._getPosByOffset(cc.p(this._container.objectSize.width, 0));
            var pos3 = this._getPosByOffset(cc.p(this._container.objectSize.width, this._container.objectSize.height));
            var pos4 = this._getPosByOffset(cc.p(0, this._container.objectSize.height));

            var width = pos2.x - pos4.x, height = pos1.y - pos3.y;
            this.setContentSize(cc.size(width, height));
            this.setAnchorPoint(cc.p((pos1.x - pos4.x) / width, 1));

            var origin = cc.p(pos4.x, pos3.y);
            pos1.subSelf(origin);
            pos2.subSelf(origin);
            pos3.subSelf(origin);
            pos4.subSelf(origin);
            if (this._container.objectSize.width > 0) {
                this.drawSegment(pos1, pos2, this.getLineWidth(), this._color);
                this.drawSegment(pos3, pos4, this.getLineWidth(), this._color);
            }

            if (this._container.objectSize.height > 0) {
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
            var objSize = this._container.objectSize;
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
            if (this._container.objectSize.equals(cc.Size.ZERO)) {
                return;
            }

            // draw the rect
            var pos1 = this._getPosByOffset(cc.p(0, 0));
            var pos2 = this._getPosByOffset(cc.p(this._container.objectSize.width, 0));
            var pos3 = this._getPosByOffset(cc.p(this._container.objectSize.width, this._container.objectSize.height));
            var pos4 = this._getPosByOffset(cc.p(0, this._container.objectSize.height));

            var width = pos2.x - pos4.x, height = pos1.y - pos3.y;
            this.setContentSize(cc.size(width, height));
            this.setAnchorPoint(cc.p((pos1.x - pos4.x) / width, 1));

            var origin = cc.p(pos4.x, pos3.y);
            pos1.subSelf(origin);
            pos2.subSelf(origin);
            pos3.subSelf(origin);
            pos4.subSelf(origin);
            if (this._container.objectSize.width > 0) {
                this.drawSegment(pos1, pos2, this.getLineWidth(), this._color);
                this.drawSegment(pos3, pos4, this.getLineWidth(), this._color);
            }

            if (this._container.objectSize.height > 0) {
                this.drawSegment(pos1, pos4, this.getLineWidth(), this._color);
                this.drawSegment(pos3, pos2, this.getLineWidth(), this._color);
            }

            // add a drawnode to draw the ellipse
            center = this._getPosByOffset(cc.p(this._container.objectSize.width / 2, this._container.objectSize.height / 2));
            center.subSelf(origin);

            ellipseNode = new cc.DrawNode();
            ellipseNode.setLineWidth(this.getLineWidth());
            ellipseNode.setContentSize(cc.size(width, height));
            ellipseNode.setAnchorPoint(cc.p(0.5, 0.5));
            ellipseNode.setPosition(center);
            this.addChild(ellipseNode);

            if (this._container.objectSize.width > this._container.objectSize.height) {
                scaleX = this._container.objectSize.width / this._container.objectSize.height;
                radius = this._container.objectSize.height / 2;
            } else {
                scaleY = this._container.objectSize.height / this._container.objectSize.width;
                radius = this._container.objectSize.width / 2;
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

    _drawPoly : function (originPos, isPolygon) {
        // parse the data
        var pointsData;
        var objectInfo = this._container.getProperties();
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
