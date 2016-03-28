/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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
 * !#en cc.TMXObjectGroup represents the TMX object group.
 * !#zh TMXObjectGroup 用来表示 TMX 对象组。
 * @class TMXObjectGroup
 * @extends cc._Class
 *
 * @property {Array}    properties  - Properties from the group. They can be added using tilemap editors
 * @property {String}   groupName   - Name of the group
 */
cc.TMXObjectGroup = cc._Class.extend(/** @lends cc.TMXObjectGroup# */{
	properties: null,
    groupName: "",

    _positionOffset: null,
    _objects: null,

    /**
     * <p>The cc.TMXObjectGroup's constructor. <br/>
     * This function will automatically be invoked when you create a node using new construction: "var node = new cc.TMXObjectGroup()".<br/>
     * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     */
    ctor:function () {
        this.groupName = "";
        this._positionOffset = cc.p(0,0);
        this.properties = [];
        this._objects = [];
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
        this.properties.push(Var);
    },

    /**
     * !#en Gets the Group name.
     * !#zh 获取组名称。
     * @method getGroupName
     * @return {String}
     * @example
     * var groupName = tMXObjectGroup.getGroupName;
     */
    getGroupName:function () {
        return this.groupName.toString();
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
        if (this._objects && this._objects.length > 0) {
            var locObjects = this._objects;
            for (var i = 0, len = locObjects.length; i < len; i++) {
                var name = locObjects[i]["name"];
                if (name && name === objectName)
                    return locObjects[i];
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
    },

    /**
     * !#en Set the objects.
     * !#zh 设置对象数组。
     * @method setObjects
     * @param {Object} objects
     * @example
     * tMXObjectGroup.setObjects(objects);
     */
    setObjects:function (objects) {
        this._objects.push(objects);
    }
});
