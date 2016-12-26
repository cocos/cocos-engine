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

var SgHelper = require('./scene-graph-helper');
var Flags = require('../platform/CCObject').Flags;
var Misc = require('./misc');
var IdGenerater = require('../platform/id-generater');

var Destroying = Flags.Destroying;
var DontDestroy = Flags.DontDestroy;
var Activating = Flags.Activating;
var POSITION_CHANGED = 'position-changed';
var SIZE_CHANGED = 'size-changed';
var ANCHOR_CHANGED = 'anchor-changed';
var CHILD_ADDED = 'child-added';
var CHILD_REMOVED = 'child-removed';
var CHILD_REORDER = 'child-reorder';

var ERR_INVALID_NUMBER = CC_EDITOR && 'The %s is invalid';

var idGenerater = new IdGenerater('Node');

function getConstructor (typeOrClassName) {
    if ( !typeOrClassName ) {
        cc.errorID(3804);
        return null;
    }
    if (typeof typeOrClassName === 'string') {
        return JS.getClassByName(typeOrClassName);
    }

    return typeOrClassName;
}

function findComponent (node, constructor) {
    for (var i = 0; i < node._components.length; ++i) {
        var comp = node._components[i];
        if (comp instanceof constructor) {
            return comp;
        }
    }
    return null;
}

function findComponents (node, constructor, components) {
    for (var i = 0; i < node._components.length; ++i) {
        var comp = node._components[i];
        if (comp instanceof constructor) {
            components.push(comp);
        }
    }
}

function findChildComponent (children, constructor) {
    for (var i = 0; i < children.length; ++i) {
        var node = children[i];
        var comp = findComponent(node, constructor);
        if (comp) {
            return comp;
        }
        else if (node.children.length > 0) {
            comp = findChildComponent(node.children, constructor);
            if (comp) {
                return comp;
            }
        }
    }
    return null;
}

function findChildComponents (children, constructor, components) {
    for (var i = 0; i < children.length; ++i) {
        var node = children[i];
        findComponents(node, constructor, components);
        if (node._children.length > 0) {
            findChildComponents(node._children, constructor, components);
        }
    }
}

/**
 * A base node for CCNode and CCEScene, it will:
 * - provide the same api with origin cocos2d rendering node (SGNode)
 * - maintains properties of the internal SGNode
 * - retain and release the SGNode
 * - serialize datas for SGNode (but SGNode itself will not being serialized)
 * - notifications if some properties changed
 * - define some interfaces shares between CCNode and CCEScene
 *
 *
 * @class _BaseNode
 * @extends Object
 * @private
 */
var BaseNode = cc.Class(/** @lends cc.Node# */{
    name: 'cc._BaseNode',
    extends: cc.Object,
    mixins: [cc.EventTarget],

    properties: {

        // SERIALIZABLE

        _parent: null,
        _children: [],

        _tag: cc.macro.NODE_TAG_INVALID,

        _active: true,

        /**
         * @property _components
         * @type {Component[]}
         * @default []
         * @readOnly
         * @private
         */
        _components: [],

        /**
         * The PrefabInfo object
         * @property _prefab
         * @type {PrefabInfo}
         * @private
         */
        _prefab: null,

        /**
         * If true, the node is an persist node which won't be destroyed during scene transition.
         * If false, the node will be destroyed automatically when loading a new scene. Default is false.
         * @property _persistNode
         * @type {Boolean}
         * @default false
         * @private
         */
        _persistNode: {
            get: function () {
                return (this._objFlags & DontDestroy) > 0;
            },
            set: function (value) {
                if (value) {
                    this._objFlags |= DontDestroy;
                }
                else {
                    this._objFlags &= ~DontDestroy;
                }
            }
        },

        // API

        /**
         * !#en Name of node.
         * !#zh 该节点名称。
         * @property name
         * @type {String}
         * @example
         * node.name = "New Node";
         * cc.log("Node Name: " + node.name);
         */
        name: {
            get: function () {
                return this._name;
            },
            set: function (value) {
                if (CC_DEV && value.indexOf('/') !== -1) {
                    cc.errorID(1632);
                    return;
                }
                this._name = value;
            },
        },

        /**
         * !#en The parent of the node.
         * !#zh 该节点的父节点。
         * @property parent
         * @type {Node}
         * @default null
         * @example
         * node.parent = newNode;
         */

        _id: {
            default: '',
            editorOnly: true
        },

        /**
         * !#en The uuid for editor, will be stripped before building project.
         * !#zh 用于编辑器使用的 uuid，在构建项目之前将会被剔除。
         * @property uuid
         * @type {String}
         * @readOnly
         * @example
         * cc.log("Node Uuid: " + node.uuid);
         */
        uuid: {
            get: function () {
                var id = this._id;
                if ( !id ) {
                    id = this._id = CC_EDITOR ? Editor.Utils.UuidUtils.uuid() : idGenerater.getNewId();
                }
                return id;
            }
        },

        /**
         * !#en All children nodes.
         * !#zh 节点的所有子节点。
         * @property children
         * @type {Node[]}
         * @readOnly
         * @example
         * var children = node.children;
         * for (var i = 0; i < children.length; ++i) {
         *     cc.log("Node: " + children[i]);
         * }
         */
        children: {
            get: function () {
                return this._children;
            }
        },

        /**
         * !#en All children nodes.
         * !#zh 节点的子节点数量。
         * @property childrenCount
         * @type {Number}
         * @readOnly
         * @example
         * var count = node.childrenCount;
         * cc.log("Node Children Count: " + count);
         */
        childrenCount: {
            get: function () {
                return this._children.length;
            }
        },

        /**
         * !#en Tag of node.
         * !#zh 节点标签。
         * @property tag
         * @type {Number}
         * @example
         * node.tag = 1001;
         */

    },

    ctor: function () {

        // Support for ActionManager and EventManager
        this.__instanceId = this._id || cc.ClassManager.getNewInstanceId();

        /**
         * Register all related EventTargets,
         * all event callbacks will be removed in _onPreDestroy
         * @property __eventTargets
         * @type {EventTarget[]}
         * @private
         */
        this.__eventTargets = [];
    },

    getTag: function () {
        return this._tag;
    },

    setTag: function (tag) {
        this._tag = tag;
    },

    getParent: function() {
        return this._parent;
    },

    //interface need to be implemented in derived classes
    setParent: null,


    // ABSTRACT INTERFACES

    // called when the node's parent changed
    _onHierarchyChanged: null,

    _onPreDestroy: null,
    /*
     * Initializes the instance of cc.Node
     * @method init
     * @returns {Boolean} Whether the initialization was successful.
     * @deprecated, no need anymore
     */
    init: function () {
        return true;
    },

    /**
     * !#en
     * Properties configuration function </br>
     * All properties in attrs will be set to the node, </br>
     * when the setter of the node is available, </br>
     * the property will be set via setter function.</br>
     * !#zh 属性配置函数。在 attrs 的所有属性将被设置为节点属性。
     * @method attr
     * @param {Object} attrs - Properties to be set to node
     * @example
     * var attrs = { key: 0, num: 100 };
     * node.attr(attrs);
     */
    attr: function (attrs) {
        for (var key in attrs) {
            this[key] = attrs[key];
        }
    },

    // composition: GET

    /**
     * !#en Returns a child from the container given its tag.
     * !#zh 通过标签获取节点的子节点。
     * @method getChildByTag
     * @param {Number} aTag - An identifier to find the child node.
     * @return {Node} a CCNode object whose tag equals to the input parameter
     * @example
     * var child = node.getChildByTag(1001);
     */
    getChildByTag: function (aTag) {
        var children = this._children;
        if (children !== null) {
            for (var i = 0; i < children.length; i++) {
                var node = children[i];
                if (node && node._tag === aTag)
                    return node;
            }
        }
        return null;
    },

    /**
     * !#en Returns a child from the container given its uuid.
     * !#zh 通过 uuid 获取节点的子节点。
     * @method getChildByUuid
     * @param {String} uuid - The uuid to find the child node.
     * @return {Node} a Node whose uuid equals to the input parameter
     * @example
     * var child = node.getChildByUuid(uuid);
     */
    getChildByUuid: function(uuid){
        if(!uuid){
            cc.log("Invalid uuid");
            return null;
        }

        var locChildren = this._children;
        for(var i = 0, len = locChildren.length; i < len; i++){
            if(locChildren[i]._id === uuid)
                return locChildren[i];
        }
        return null;
    },

    /**
     * !#en Returns a child from the container given its name.
     * !#zh 通过名称获取节点的子节点。
     * @method getChildByName
     * @param {String} name - A name to find the child node.
     * @return {Node} a CCNode object whose name equals to the input parameter
     * @example
     * var child = node.getChildByName("Test Node");
     */
    getChildByName: function(name){
        if(!name){
            cc.log("Invalid name");
            return null;
        }

        var locChildren = this._children;
        for(var i = 0, len = locChildren.length; i < len; i++){
           if(locChildren[i]._name === name)
            return locChildren[i];
        }
        return null;
    },

    // composition: ADD
    addChild: null,
    removeFromParent: null,
    removeChild: null,
    removeChildByTag: null,
    removeAllChildren: null,

    getNodeToParentTransform: null,
    getNodeToWorldTransform: null,
    getParentToNodeTransform: null,
    getWorldToNodeTransform: null,

    // HIERARCHY METHODS

    /**
     * !#en Get the sibling index.
     * !#zh 获取同级索引。
     * @method getSiblingIndex
     * @return {number}
     * @example
     * var index = node.getSiblingIndex();
     */
    getSiblingIndex: function () {
        if (this._parent) {
            return this._parent._children.indexOf(this);
        }
        else {
            return 0;
        }
    },

    /**
     * !#en Set the sibling index of this node.
     * !#zh 设置节点同级索引。
     * @method setSiblingIndex
     * @param {Number} index
     * @example
     * node.setSiblingIndex(1);
     */
    setSiblingIndex: null,
    /**
     * !#en Is this node a child of the given node?
     * !#zh 是否是指定节点的子节点？
     * @method isChildOf
     * @param {Node} parent
     * @return {Boolean} - Returns true if this node is a child, deep child or identical to the given node.
     * @example
     * node.isChildOf(newNode);
     */
    isChildOf: function (parent) {
        var child = this;
        do {
            if (child === parent) {
                return true;
            }
            child = child._parent;
        }
        while (child);
        return false;
    },

});


// Define public getter and setter methods to ensure api compatibility.

var SameNameGetSets = ['name', 'children', 'childrenCount',];
var DiffNameGetSets = {
    //// privates
    //width: ['_getWidth', '_setWidth'],
    //height: ['_getHeight', '_setHeight'],
    //anchorX: ['_getAnchorX', '_setAnchorX'],
    //anchorY: ['_getAnchorY', '_setAnchorY'],
};
Misc.propertyDefine(BaseNode, SameNameGetSets, DiffNameGetSets);

cc._BaseNode = module.exports = BaseNode;
