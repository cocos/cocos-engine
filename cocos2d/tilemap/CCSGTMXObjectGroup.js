/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * !#en _ccsg.TMXObjectGroup represents the TMX object group.
 * !#zh TMXObjectGroup 用来表示 TMX 对象组。
 * @class TMXObjectGroup
 * @extends _ccsg.Node
 *
 * @property {Array}    properties  - Properties from the group. They can be added using tilemap editors
 * @property {String}   groupName   - Name of the group
 */
_ccsg.TMXObjectGroup = _ccsg.Node.extend(/** @lends cc.TMXObjectGroup# */{
	  properties: null,
    groupName: "",

    _positionOffset: null,
    _mapInfo: null,
    _objects : [],

    /**
     * <p>The _ccsg.TMXObjectGroup's constructor. <br/>
     * This function will automatically be invoked when you create a node using new construction: "var node = new cc.TMXObjectGroup()".<br/>
     * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     * @method ctor
     */
    ctor:function (groupInfo, mapInfo) {
        _ccsg.Node.prototype.ctor.call(this);
        this._initGroup(groupInfo, mapInfo);
    },

    _initGroup: function (groupInfo, mapInfo) {
        this.groupName = groupInfo.name;
        this._positionOffset = groupInfo.offset;
        this._mapInfo = mapInfo;
        this.properties = groupInfo.getProperties();

        var mapSize = mapInfo._mapSize;
        var tileSize = mapInfo._tileSize;
        if (mapInfo.orientation === cc.TiledMap.Orientation.HEX) {
            var width = 0, height = 0;
            if (mapInfo.getStaggerAxis() === cc.TiledMap.StaggerAxis.STAGGERAXIS_X) {
                height = tileSize.height * (mapSize.height + 0.5);
                width = (tileSize.width + mapInfo.getHexSideLength()) * Math.floor(mapSize.width / 2) + tileSize.width * (mapSize.width % 2);
            } else {
                width = tileSize.width * (mapSize.width + 0.5);
                height = (tileSize.height + mapInfo.getHexSideLength()) * Math.floor(mapSize.height / 2) + tileSize.height * (mapSize.height % 2);
            }
            this.setContentSize(width, height);
        } else {
            this.setContentSize(mapSize.width * tileSize.width, mapSize.height * tileSize.height);
        }
        this.setAnchorPoint(cc.p(0, 0));
        this.setPosition(this._positionOffset.x, -this._positionOffset.y);
        this.setVisible(groupInfo.visible);

        var objects = [];
        if (groupInfo._objects instanceof Array) {
            objects = groupInfo._objects;
        }

        // create objects
        this._objects = [];
        for (var i = 0, n = objects.length; i < n; i++) {
            var objInfo = objects[i];
            var object = new _ccsg.TMXObject();
            object.initWithInfo(objInfo, mapInfo, this.getContentSize(), groupInfo._color);
            this._objects.push(object);
            if (object.sgNode) {
                object.sgNode.setOpacity(groupInfo._opacity);
                // TODO addChild in order with property cc.TMXObjectGroupInfo._draworder
                this.addChild(object.sgNode, i, i);
            }
        }
    },

    /**
     * !#en Offset position of child objects.
     * !#zh 获取子对象的偏移位置。
     * @method getPositionOffset
     * @return {Vec2}
     * @example
     * var offset = tMXObjectGroup.getPositionOffset();
     */
    getPositionOffset:function () {
        return cc.p(this._positionOffset);
    },

    /**
     * !#en Offset position of child objects.
     * !#zh 设置子对象的偏移位置。
     * @method setPositionOffset
     * @param {Vec2} offset
     * @example
     * tMXObjectGroup.setPositionOffset(cc.v2(5, 5));
     */
    setPositionOffset:function (offset) {
        this._positionOffset.x = offset.x;
        this._positionOffset.y = offset.y;
    },

    /**
     * !#en List of properties stored in a dictionary.
     * !#zh 以映射的形式获取属性列表。
     * @method getProperties
     * @return {Array}
     * @example
     * var offset = tMXObjectGroup.getProperties();
     */
    getProperties:function () {
        return this.properties;
    },

    /**
     * !#en List of properties stored in a dictionary.
     * !#zh 设置属性列表。
     * @method setProperties
     * @param {Object} Var
     * @example
     * tMXObjectGroup.setProperties(obj);
     */
    setProperties:function (Var) {
        this.properties = Var;
    },

    /**
     * !#en Gets the Group name.
     * !#zh 获取组名称。
     * @method getGroupName
     * @return {String}
     * @example
     * var groupName = tMXObjectGroup.getGroupName();
     */
    getGroupName:function () {
        return this.groupName;
    },

    /**
     * !#en Set the Group name.
     * !#zh 设置组名称。
     * @method setGroupName
     * @param {String} groupName
     * @example
     * tMXObjectGroup.setGroupName("New Group");
     */
    setGroupName:function (groupName) {
        this.groupName = groupName;
    },

    /**
     * Return the value for the specific property name
     * @param {String} propertyName
     * @return {Object}
     */
    propertyNamed:function (propertyName) {
        return this.properties[propertyName];
    },

    /**
     * <p>Return the dictionary for the specific object name. <br />
     * It will return the 1st object found on the array for the given name.</p>
     * @deprecated since v3.4 please use .getObject
     * @param {String} objectName
     * @return {object|Null}
     */
    objectNamed:function (objectName) {
        return this.getObject(objectName);
    },

    /**
     * !#en
     * Return the object for the specific object name. <br />
     * It will return the 1st object found on the array for the given name.
     * !#zh 获取指定的对象。
     * @method getObject
     * @param {String} objectName
     * @return {Object|Null}
     * @example
     * var object = tMXObjectGroup.getObject("Group");
     */
    getObject: function(objectName){
        for (var i = 0, len = this._objects.length; i < len; i++) {
            var obj = this._objects[i];
            if (obj && obj.getObjectName() === objectName) {
                return obj;
            }
        }
        // object not found
        return null;
    },

    /**
     * !#en Gets the objects.
     * !#zh 获取对象数组。
     * @method getObjects
     * @return {Array}
     * @example
     * var objects = tMXObjectGroup.getObjects();
     */
    getObjects:function () {
        return this._objects;
    }
});
