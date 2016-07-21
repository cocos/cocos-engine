/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

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
var TiledObjectGroup = cc.Class({
    name: 'cc.TiledObjectGroup',

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

        if (sgNode && sgNode instanceof _ccsg.TMXObjectGroup) {
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
     * !#en Offset position of child objects.
     * !#zh 获取子对象的偏移位置。
     * @method getPositionOffset
     * @return {Vec2}
     * @example
     * var offset = tMXObjectGroup.getPositionOffset();
     */
    getPositionOffset:function () {
        if (this._sgNode) {
            return this._sgNode.getPositionOffset();
        }

        return cc.p(0, 0);
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
        if (this._sgNode) {
            this._sgNode.setPositionOffset(offset);
        }
    },

    /**
     * !#en List of properties stored in a dictionary.
     * !#zh 以映射的形式获取属性列表。
     * @method getProperties
     * @return {Object}
     * @example
     * var offset = tMXObjectGroup.getProperties();
     */
    getProperties:function () {
        if (this._sgNode) {
            return this._sgNode.getProperties();
        }
        return null;
    },

    /**
     * !#en Set the properties of the object group.
     * !#zh 设置属性列表。
     * @method setProperties
     * @param {Object} Var
     * @example
     * tMXObjectGroup.setProperties(obj);
     */
    setProperties:function (Var) {
        if (this._sgNode) {
            this._sgNode.setProperties(Var);
        }
    },

    /**
     * !#en Gets the Group name.
     * !#zh 获取组名称。
     * @method getGroupName
     * @return {String}
     * @example
     * var groupName = tMXObjectGroup.getGroupName;
     */
    getGroupName: function () {
        if (this._sgNode) {
            return this._sgNode.getGroupName();
        }
        return '';
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
        if (this._sgNode) {
            this._sgNode.setGroupName(groupName);
        }
    },

    /**
     * Return the value for the specific property name
     * @param {String} propertyName
     * @return {Object}
     */
    getProperty: function (propertyName) {
        if (this._sgNode) {
            return this._sgNode.propertyNamed(propertyName);
        }
        return null;
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
        var logicChildren = this.node.children;
        for (var i = 0, n = logicChildren.length; i < n; i++) {
            var child = logicChildren[i];
            var tmxObject = child.getComponent(cc.TiledObject);
            if (tmxObject && tmxObject.getObjectName() === objectName) {
                return tmxObject;
            }
        }

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
        var logicChildren = this.node.children;
        var ret = [];
        for (var i = 0, n = logicChildren.length; i < n; i++) {
            var child = logicChildren[i];
            var tmxObject = child.getComponent(cc.TiledObject);
            if (tmxObject) {
                ret.push(tmxObject);
            }
        }

        return ret;
    },
});

cc.TiledObjectGroup = module.exports = TiledObjectGroup;
