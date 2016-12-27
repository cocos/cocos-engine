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

var JS = cc.js;
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

    ctor: function (name) {

        this._name = typeof name !== 'undefined' ? name : 'New Node';

        this._activeInHierarchy = false;
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

    // COMPONENT

    /**
     * !#en
     * Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
     * You can also get component in the node by passing in the name of the script.
     * !#zh
     * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
     * 传入参数也可以是脚本的名称。
     * @method getComponent
     * @param {Function|String} typeOrClassName
     * @return {Component}
     * @example
     * // get sprite component.
     * var sprite = node.getComponent(cc.Sprite);
     * // get custom test calss.
     * var test = node.getComponent("Test");
     */
    getComponent: function (typeOrClassName) {
        var constructor = getConstructor(typeOrClassName);
        if (constructor) {
            return findComponent(this, constructor);
        }
        return null;
    },

    /**
     * !#en Returns all components of supplied type in the node.
     * !#zh 返回节点上指定类型的所有组件。
     * @method getComponents
     * @param {Function|String} typeOrClassName
     * @return {Component[]}
     * @example
     * var sprites = node.getComponents(cc.Sprite);
     * var tests = node.getComponents("Test");
     */
    getComponents: function (typeOrClassName) {
        var constructor = getConstructor(typeOrClassName), components = [];
        if (constructor) {
            findComponents(this, constructor, components);
        }
        return components;
    },

    /**
     * !#en Returns the component of supplied type in any of its children using depth first search.
     * !#zh 递归查找所有子节点中第一个匹配指定类型的组件。
     * @method getComponentInChildren
     * @param {Function|String} typeOrClassName
     * @return {Component}
     * @example
     * var sprite = node.getComponentInChildren(cc.Sprite);
     * var Test = node.getComponentInChildren("Test");
     */
    getComponentInChildren: function (typeOrClassName) {
        var constructor = getConstructor(typeOrClassName);
        if (constructor) {
            return findChildComponent(this._children, constructor);
        }
        return null;
    },

    /**
     * !#en Returns all components of supplied type in self or any of its children.
     * !#zh 递归查找自身或所有子节点中指定类型的组件
     * @method getComponentsInChildren
     * @param {Function|String} typeOrClassName
     * @return {Component[]}
     * @example
     * var sprites = node.getComponentsInChildren(cc.Sprite);
     * var tests = node.getComponentsInChildren("Test");
     */
    getComponentsInChildren: function (typeOrClassName) {
        var constructor = getConstructor(typeOrClassName), components = [];
        if (constructor) {
            findComponents(this, constructor, components);
            findChildComponents(this._children, constructor, components);
        }
        return components;
    },

    _checkMultipleComp: CC_EDITOR && function (ctor) {
        var existing = this.getComponent(ctor._disallowMultiple);
        if (existing) {
            if (existing.constructor === ctor) {
                cc.errorID(3805, JS.getClassName(ctor), this._name);
            }
            else {
                cc.errorID(3806, JS.getClassName(ctor), this._name, JS.getClassName(existing));
            }
            return false;
        }
        return true;
    },

    /**
     * !#en Adds a component class to the node. You can also add component to node by passing in the name of the script.
     * !#zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
     * @method addComponent
     * @param {Function|String} typeOrClassName - The constructor or the class name of the component to add
     * @return {Component} - The newly added component
     * @example
     * var sprite = node.addComponent(cc.Sprite);
     * var test = node.addComponent("Test");
     */
    addComponent: function (typeOrClassName) {

        if (CC_EDITOR && (this._objFlags & Destroying)) {
            cc.error('isDestroying');
            return null;
        }

        // get component

        var constructor;
        if (typeof typeOrClassName === 'string') {
            constructor = JS.getClassByName(typeOrClassName);
            if ( !constructor ) {
                cc.errorID(3807, typeOrClassName);
                if (cc._RFpeek()) {
                    cc.errorID(3808, typeOrClassName);
                }
                return null;
            }
        }
        else {
            if ( !typeOrClassName ) {
                cc.errorID(3804);
                return null;
            }
            constructor = typeOrClassName;
        }

        // check component

        if (typeof constructor !== 'function') {
            cc.errorID(3809);
            return null;
        }
        if (!cc.isChildClassOf(constructor, cc.Component)) {
            cc.errorID(3810);
            return null;
        }

        if (CC_EDITOR && constructor._disallowMultiple) {
            if (!this._checkMultipleComp(constructor)) {
                return null;
            }
        }

        // check requirement

        var ReqComp = constructor._requireComponent;
        if (ReqComp && !this.getComponent(ReqComp)) {
            var depended = this.addComponent(ReqComp);
            if (!depended) {
                // depend conflicts
                return null;
            }
        }

        //// check conflict
        //
        //if (CC_EDITOR && !_Scene.DetectConflict.beforeAddComponent(this, constructor)) {
        //    return null;
        //}

        //

        var component = new constructor();
        component.node = this;
        this._components.push(component);

        if (this._activeInHierarchy) {
            if (typeof component.__preload === 'function') {
                cc.Component._callPreloadOnComponent(component);
            }
            // call onLoad/onEnable
            component.__onNodeActivated(true);
        }

        return component;
    },

    /**
     * This api should only used by undo system
     * @method _addComponentAt
     * @param {Component} comp
     * @param {Number} index
     * @private
     */
    _addComponentAt: CC_EDITOR && function (comp, index) {
        if (this._objFlags & Destroying) {
            return cc.error('isDestroying');
        }
        if ( !(comp instanceof cc.Component) ) {
            return cc.errorID(3811);
        }
        if (index > this._components.length) {
            return cc.errorID(3812);
        }

        // recheck attributes because script may changed
        var ctor = comp.constructor;
        if (ctor._disallowMultiple) {
            if (!this._checkMultipleComp(ctor)) {
                return;
            }
        }
        var ReqComp = ctor._requireComponent;
        if (ReqComp && !this.getComponent(ReqComp)) {
            if (index === this._components.length) {
                // If comp should be last component, increase the index because required component added
                ++index;
            }
            var depended = this.addComponent(ReqComp);
            if (!depended) {
                // depend conflicts
                return null;
            }
        }

        comp.node = this;
        this._components.splice(index, 0, comp);

        if (this._activeInHierarchy) {
            if (typeof comp.__preload === 'function' &&
                !(comp._objFlags & cc.Object.Flags.IsPreloadCalled)) {
                cc.Component._callPreloadOnComponent(comp);
            }
            // call onLoad/onEnable
            comp.__onNodeActivated(true);
        }
    },

    /**
     * !#en
     * Removes a component identified by the given name or removes the component object given.
     * You can also use component.destroy() if you already have the reference.
     * !#zh
     * 删除节点上的指定组件，传入参数可以是一个组件构造函数或组件名，也可以是已经获得的组件引用。
     * 如果你已经获得组件引用，你也可以直接调用 component.destroy()
     * @method removeComponent
     * @param {String|Function|Component} component - The need remove component.
     * @deprecated please destroy the component to remove it.
     * @example
     * node.removeComponent(cc.Sprite);
     * var Test = require("Test");
     * node.removeComponent(Test);
     */
    removeComponent: function (component) {
        if ( !component ) {
            cc.errorID(3813);
            return;
        }
        if (typeof component !== 'object') {
            component = this.getComponent(component);
        }
        if (component) {
            component.destroy();
        }
    },

    /**
     * @method _getDependComponent
     * @param {Component} depended
     * @return {Component}
     * @private
     */
    _getDependComponent: CC_EDITOR && function (depended) {
        for (var i = 0; i < this._components.length; i++) {
            var comp = this._components[i];
            if (comp !== depended && comp.isValid && !cc.Object._willDestroy(comp)) {
                var depend = comp.constructor._requireComponent;
                if (depend && depended instanceof depend) {
                    return comp;
                }
            }
        }
        return null;
    },

    // do remove component, only used internally
    _removeComponent: function (component) {
        if (!component) {
            cc.errorID(3814);
            return;
        }

        if (!(this._objFlags & Destroying)) {
            var i = this._components.indexOf(component);
            if (i !== -1) {
                this._components.splice(i, 1);
            }
            else if (component.node !== this) {
                cc.errorID(3815);
            }
        }
    },

    _deactivateChildComponents: function () {
        // 和 _activeRecursively 类似但不修改 this._activeInHierarchy
        var originCount = this._components.length;
        for (var c = 0; c < originCount; ++c) {
            var component = this._components[c];
            component.__onNodeActivated(false);
        }
        // deactivate children recursively
        for (var i = 0, len = this.childrenCount; i < len; ++i) {
            var entity = this._children[i];
            if (entity._active) {
                entity._deactivateChildComponents();
            }
        }
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
