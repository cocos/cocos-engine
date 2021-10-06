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

const Flags = require('../platform/CCObject').Flags;
const misc = require('./misc');
const js = require('../platform/js');
const IdGenerater = require('../platform/id-generater');
const eventManager = require('../event-manager');
const RenderFlow = require('../renderer/render-flow');

const Destroying = Flags.Destroying;
const DontDestroy = Flags.DontDestroy;
const Deactivating = Flags.Deactivating; 

const CHILD_ADDED = 'child-added';
const CHILD_REMOVED = 'child-removed';

var idGenerater = new IdGenerater('Node');

function getConstructor(typeOrClassName) {
    if (!typeOrClassName) {
        cc.errorID(3804);
        return null;
    }
    if (typeof typeOrClassName === 'string') {
        return js.getClassByName(typeOrClassName);
    }

    return typeOrClassName;
}

function findComponent(node, constructor) {
    if (constructor._sealed) {
        for (let i = 0; i < node._components.length; ++i) {
            let comp = node._components[i];
            if (comp.constructor === constructor) {
                return comp;
            }
        }
    }
    else {
        for (let i = 0; i < node._components.length; ++i) {
            let comp = node._components[i];
            if (comp instanceof constructor) {
                return comp;
            }
        }
    }
    return null;
}

function findComponents(node, constructor, components) {
    if (constructor._sealed) {
        for (let i = 0; i < node._components.length; ++i) {
            let comp = node._components[i];
            if (comp.constructor === constructor) {
                components.push(comp);
            }
        }
    }
    else {
        for (let i = 0; i < node._components.length; ++i) {
            let comp = node._components[i];
            if (comp instanceof constructor) {
                components.push(comp);
            }
        }
    }
}

function findChildComponent(children, constructor) {
    for (var i = 0; i < children.length; ++i) {
        var node = children[i];
        var comp = findComponent(node, constructor);
        if (comp) {
            return comp;
        }
        else if (node._children.length > 0) {
            comp = findChildComponent(node._children, constructor);
            if (comp) {
                return comp;
            }
        }
    }
    return null;
}

function findChildComponents(children, constructor, components) {
    for (var i = 0; i < children.length; ++i) {
        var node = children[i];
        findComponents(node, constructor, components);
        if (node._children.length > 0) {
            findChildComponents(node._children, constructor, components);
        }
    }
}

/**
 * A base node for CCNode, it will:
 * - maintain scene hierarchy and active logic
 * - notifications if some properties changed
 * - define some interfaces shares between CCNode
 * - define machanisms for Enity Component Systems
 * - define prefab and serialize functions
 *
 * @class _BaseNode
 * @extends Object
 * @uses EventTarget
 * @constructor
 * @param {String} [name]
 * @private
 */
var BaseNode = cc.Class({
    name: 'cc._BaseNode',
    extends: cc.Object,

    properties: {
        // SERIALIZABLE

        _parent: null,
        _children: [],

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
            get () {
                return (this._objFlags & DontDestroy) > 0;
            },
            set (value) {
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
            get () {
                return this._name;
            },
            set (value) {
                if (CC_DEV && value.indexOf('/') !== -1) {
                    cc.errorID(1632);
                    return;
                }
                this._name = value;
                if (CC_JSB && CC_NATIVERENDERER) {
                    this._proxy.setName(this._name);
                }
            },
        },

        /**
         * !#en The uuid for editor, will be stripped before building project.
         * !#zh 主要用于编辑器的 uuid，在编辑器下可用于持久化存储，在项目构建之后将变成自增的 id。
         * @property uuid
         * @type {String}
         * @readOnly
         * @example
         * cc.log("Node Uuid: " + node.uuid);
         */
        uuid: {
            get () {
                return this._id;
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
            get () {
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
            get () {
                return this._children.length;
            }
        },

        /**
         * !#en
         * The local active state of this node.<br/>
         * Note that a Node may be inactive because a parent is not active, even if this returns true.<br/>
         * Use {{#crossLink "Node/activeInHierarchy:property"}}{{/crossLink}} if you want to check if the Node is actually treated as active in the scene.
         * !#zh
         * 当前节点的自身激活状态。<br/>
         * 值得注意的是，一个节点的父节点如果不被激活，那么即使它自身设为激活，它仍然无法激活。<br/>
         * 如果你想检查节点在场景中实际的激活状态可以使用 {{#crossLink "Node/activeInHierarchy:property"}}{{/crossLink}}。
         * @property active
         * @type {Boolean}
         * @default true
         * @example
         * node.active = false;
         */
        active: {
            get () {
                return this._active;
            },
            set (value) {
                value = !!value;
                if (this._active !== value) {
                    this._active = value;
                    var parent = this._parent;
                    if (parent) {
                        var couldActiveInScene = parent._activeInHierarchy;
                        if (couldActiveInScene) {
                            cc.director._nodeActivator.activateNode(this, value);
                        }
                    }
                }
            }
        },

        /**
         * !#en Indicates whether this node is active in the scene.
         * !#zh 表示此节点是否在场景中激活。
         * @property activeInHierarchy
         * @type {Boolean}
         * @example
         * cc.log("activeInHierarchy: " + node.activeInHierarchy);
         */
        activeInHierarchy: {
            get () {
                return this._activeInHierarchy;
            }
        },
    },

    /**
     * @method constructor
     * @param {String} [name]
     */
    ctor (name) {
        this._name = name !== undefined ? name : 'New Node';
        this._activeInHierarchy = false;
        this._id = CC_EDITOR ? Editor.Utils.UuidUtils.uuid() : idGenerater.getNewId();

        cc.director._scheduler && cc.director._scheduler.enableForTarget(this);

        /**
         * Register all related EventTargets,
         * all event callbacks will be removed in _onPreDestroy
         * @property __eventTargets
         * @type {EventTarget[]}
         * @private
         */
        this.__eventTargets = [];
    },
    /** 
     * !#en The parent of the node.
     * !#zh 该节点的父节点。
     * @property {Node} parent
     * @example 
     * cc.log("Node Parent: " + node.parent);
     */

    /**
     * !#en Get parent of the node.
     * !#zh 获取该节点的父节点。
     * @method getParent
     * @return {Node}
     * @example
     * var parent = this.node.getParent();
     */
    getParent () {
        return this._parent;
    },

    /**
     * !#en Set parent of the node.
     * !#zh 设置该节点的父节点。
     * @method setParent
     * @param {Node} value
     * @example
     * node.setParent(newNode);
     */
    setParent (value) {
        if (this._parent === value) {
            return;
        }
        if (CC_EDITOR && cc.engine && !cc.engine.isPlaying) {
            if (_Scene.DetectConflict.beforeAddChild(this, value)) {
                return;
            }
        }
        var oldParent = this._parent;
        if (CC_DEBUG && oldParent && (oldParent._objFlags & Deactivating)) {
            cc.errorID(3821);
        }
        this._parent = value || null;

        this._onSetParent(value);

        if (value) {
            if (CC_DEBUG && (value._objFlags & Deactivating)) {
                cc.errorID(3821);
            }
            eventManager._setDirtyForNode(this);
            value._children.push(this);
            value.emit && value.emit(CHILD_ADDED, this);
            value._renderFlag |= RenderFlow.FLAG_CHILDREN;
        }
        if (oldParent) {
            if (!(oldParent._objFlags & Destroying)) {
                var removeAt = oldParent._children.indexOf(this);
                if (CC_DEV && removeAt < 0) {
                    return cc.errorID(1633);
                }
                oldParent._children.splice(removeAt, 1);
                oldParent.emit && oldParent.emit(CHILD_REMOVED, this);
                this._onHierarchyChanged(oldParent);

                if (oldParent._children.length === 0) {
                    oldParent._renderFlag &= ~RenderFlow.FLAG_CHILDREN;
                }
            }
        }
        else if (value) {
            this._onHierarchyChanged(null);
        }
    },

    // ABSTRACT INTERFACES

    /**
     * !#en
     * Properties configuration function <br/>
     * All properties in attrs will be set to the node, <br/>
     * when the setter of the node is available, <br/>
     * the property will be set via setter function.<br/>
     * !#zh 属性配置函数。在 attrs 的所有属性将被设置为节点属性。
     * @method attr
     * @param {Object} attrs - Properties to be set to node
     * @example
     * var attrs = { key: 0, num: 100 };
     * node.attr(attrs);
     */
    attr (attrs) {
        js.mixin(this, attrs);
    },

    // composition: GET

    /**
     * !#en Returns a child from the container given its uuid.
     * !#zh 通过 uuid 获取节点的子节点。
     * @method getChildByUuid
     * @param {String} uuid - The uuid to find the child node.
     * @return {Node} a Node whose uuid equals to the input parameter
     * @example
     * var child = node.getChildByUuid(uuid);
     */
    getChildByUuid (uuid) {
        if (!uuid) {
            cc.log("Invalid uuid");
            return null;
        }

        var locChildren = this._children;
        for (var i = 0, len = locChildren.length; i < len; i++) {
            if (locChildren[i]._id === uuid)
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
    getChildByName (name) {
        if (!name) {
            cc.log("Invalid name");
            return null;
        }

        var locChildren = this._children;
        for (var i = 0, len = locChildren.length; i < len; i++) {
            if (locChildren[i]._name === name)
                return locChildren[i];
        }
        return null;
    },

    // composition: ADD

    addChild (child) {

        if (CC_DEV && !(child instanceof cc._BaseNode)) {
            return cc.errorID(1634, cc.js.getClassName(child));
        }
        cc.assertID(child, 1606);
        cc.assertID(child._parent === null, 1605);

        // invokes the parent setter
        child.setParent(this);

    },

    /**
     * !#en
     * Inserts a child to the node at a specified index.
     * !#zh
     * 插入子节点到指定位置
     * @method insertChild
     * @param {Node} child - the child node to be inserted
     * @param {Number} siblingIndex - the sibling index to place the child in
     * @example
     * node.insertChild(child, 2);
     */
    insertChild (child, siblingIndex) {
        child.parent = this;
        child.setSiblingIndex(siblingIndex);
    },

    // HIERARCHY METHODS

    /**
     * !#en Get the sibling index.
     * !#zh 获取同级索引。
     * @method getSiblingIndex
     * @return {Number}
     * @example
     * var index = node.getSiblingIndex();
     */
    getSiblingIndex () {
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
    setSiblingIndex (index) {
        if (!this._parent) {
            return;
        }
        if (this._parent._objFlags & Deactivating) {
            cc.errorID(3821);
            return;
        }
        var siblings = this._parent._children;
        index = index !== -1 ? index : siblings.length - 1;
        var oldIndex = siblings.indexOf(this);
        if (index !== oldIndex) {
            siblings.splice(oldIndex, 1);
            if (index < siblings.length) {
                siblings.splice(index, 0, this);
            }
            else {
                siblings.push(this);
            }
            this._onSiblingIndexChanged && this._onSiblingIndexChanged(index);
        }
    },

    /**
     * !#en Walk though the sub children tree of the current node.
     * Each node, including the current node, in the sub tree will be visited two times, before all children and after all children.
     * This function call is not recursive, it's based on stack.
     * Please don't walk any other node inside the walk process.
     * !#zh 遍历该节点的子树里的所有节点并按规则执行回调函数。
     * 对子树中的所有节点，包含当前节点，会执行两次回调，prefunc 会在访问它的子节点之前调用，postfunc 会在访问所有子节点之后调用。
     * 这个函数的实现不是基于递归的，而是基于栈展开递归的方式。
     * 请不要在 walk 过程中对任何其他的节点嵌套执行 walk。
     * @method walk
     * @param {Function} prefunc The callback to process node when reach the node for the first time
     * @param {_BaseNode} prefunc.target The current visiting node
     * @param {Function} postfunc The callback to process node when re-visit the node after walked all children in its sub tree
     * @param {_BaseNode} postfunc.target The current visiting node
     * @example
     * node.walk(function (target) {
     *     console.log('Walked through node ' + target.name + ' for the first time');
     * }, function (target) {
     *     console.log('Walked through node ' + target.name + ' after walked all children in its sub tree');
     * });
     */
    walk (prefunc, postfunc) {
        var BaseNode = cc._BaseNode;
        var index = 1;
        var children, child, curr, i, afterChildren;
        var stack = BaseNode._stacks[BaseNode._stackId];
        if (!stack) {
            stack = [];
            BaseNode._stacks.push(stack);
        }
        BaseNode._stackId++;

        stack.length = 0;
        stack[0] = this;
        var parent = null;
        afterChildren = false;
        while (index) {
            index--;
            curr = stack[index];
            if (!curr) {
                continue;
            }
            if (!afterChildren && prefunc) {
                // pre call
                prefunc(curr);
            }
            else if (afterChildren && postfunc) {
                // post call
                postfunc(curr);
            }
            
            // Avoid memory leak
            stack[index] = null;
            // Do not repeatly visit child tree, just do post call and continue walk
            if (afterChildren) {
                if (parent === this._parent) break;
                afterChildren = false;
            }
            else {
                // Children not proceeded and has children, proceed to child tree
                if (curr._children.length > 0) {
                    parent = curr;
                    children = curr._children;
                    i = 0;
                    stack[index] = children[i];
                    index++;
                }
                // No children, then repush curr to be walked for post func
                else {
                    stack[index] = curr;
                    index++;
                    afterChildren = true;
                }
                continue;
            }
            // curr has no sub tree, so look into the siblings in parent children
            if (children) {
                i++;
                // Proceed to next sibling in parent children
                if (children[i]) {
                    stack[index] = children[i];
                    index++;
                }
                // No children any more in this sub tree, go upward
                else if (parent) {
                    stack[index] = parent;
                    index++;
                    // Setup parent walk env
                    afterChildren = true;
                    if (parent._parent) {
                        children = parent._parent._children;
                        i = children.indexOf(parent);
                        parent = parent._parent;
                    }
                    else {
                        // At root
                        parent = null;
                        children = null;
                    }

                    // ERROR
                    if (i < 0) {
                        break;
                    }
                }
            }
        }
        stack.length = 0;
        BaseNode._stackId--;
    },

    cleanup () {

    },

    /**
     * !#en
     * Remove itself from its parent node. If cleanup is `true`, then also remove all events and actions. <br/>
     * If the cleanup parameter is not passed, it will force a cleanup, so it is recommended that you always pass in the `false` parameter when calling this API.<br/>
     * If the node orphan, then nothing happens.
     * !#zh
     * 从父节点中删除该节点。如果不传入 cleanup 参数或者传入 `true`，那么这个节点上所有绑定的事件、action 都会被删除。<br/>
     * 因此建议调用这个 API 时总是传入 `false` 参数。<br/>
     * 如果这个节点是一个孤节点，那么什么都不会发生。
     * @method removeFromParent
     * @param {Boolean} [cleanup=true] - true if all actions and callbacks on this node should be removed, false otherwise.
     * @example
     * node.removeFromParent();
     * node.removeFromParent(false);
     */
    removeFromParent (cleanup) {
        if (this._parent) {
            if (cleanup === undefined)
                cleanup = true;
            this._parent.removeChild(this, cleanup);
        }
    },

    /**
     * !#en
     * Removes a child from the container. It will also cleanup all running actions depending on the cleanup parameter. </p>
     * If the cleanup parameter is not passed, it will force a cleanup. <br/>
     * "remove" logic MUST only be on this method  <br/>
     * If a class wants to extend the 'removeChild' behavior it only needs <br/>
     * to override this method.
     * !#zh
     * 移除节点中指定的子节点，是否需要清理所有正在运行的行为取决于 cleanup 参数。<br/>
     * 如果 cleanup 参数不传入，默认为 true 表示清理。<br/>
     * @method removeChild
     * @param {Node} child - The child node which will be removed.
     * @param {Boolean} [cleanup=true] - true if all running actions and callbacks on the child node will be cleanup, false otherwise.
     * @example
     * node.removeChild(newNode);
     * node.removeChild(newNode, false);
     */
    removeChild (child, cleanup) {
        if (this._children.indexOf(child) > -1) {
            // If you don't do cleanup, the child's actions will not get removed and the
            if (cleanup || cleanup === undefined) {
                child.cleanup();
            }
            // invoke the parent setter
            child.parent = null;
        }
    },

    /**
     * !#en
     * Removes all children from the container and do a cleanup all running actions depending on the cleanup parameter. <br/>
     * If the cleanup parameter is not passed, it will force a cleanup.
     * !#zh
     * 移除节点所有的子节点，是否需要清理所有正在运行的行为取决于 cleanup 参数。<br/>
     * 如果 cleanup 参数不传入，默认为 true 表示清理。
     * @method removeAllChildren
     * @param {Boolean} [cleanup=true] - true if all running actions on all children nodes should be cleanup, false otherwise.
     * @example
     * node.removeAllChildren();
     * node.removeAllChildren(false);
     */
    removeAllChildren (cleanup) {
        // not using detachChild improves speed here
        var children = this._children;
        if (cleanup === undefined)
            cleanup = true;
        for (var i = children.length - 1; i >= 0; i--) {
            var node = children[i];
            if (node) {
                // If you don't do cleanup, the node's actions will not get removed and the
                if (cleanup)
                    node.cleanup();

                node.parent = null;
            }
        }
        this._children.length = 0;
    },

    /**
     * !#en Is this node a child of the given node?
     * !#zh 是否是指定节点的子节点？
     * @method isChildOf
     * @param {Node} parent
     * @return {Boolean} - Returns true if this node is a child, deep child or identical to the given node.
     * @example
     * node.isChildOf(newNode);
     */
    isChildOf (parent) {
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
     * // get sprite component
     * var sprite = node.getComponent(cc.Sprite);
     * // get custom test class
     * var test = node.getComponent("Test");
     * @typescript
     * getComponent<T extends Component>(type: {prototype: T}): T
     * getComponent(className: string): any
     */
    getComponent (typeOrClassName) {
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
     * @typescript
     * getComponents<T extends Component>(type: {prototype: T}): T[]
     * getComponents(className: string): any[]
     */
    getComponents (typeOrClassName) {
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
     * @typescript
     * getComponentInChildren<T extends Component>(type: {prototype: T}): T
     * getComponentInChildren(className: string): any
     */
    getComponentInChildren (typeOrClassName) {
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
     * @typescript
     * getComponentsInChildren<T extends Component>(type: {prototype: T}): T[]
     * getComponentsInChildren(className: string): any[]
     */
    getComponentsInChildren (typeOrClassName) {
        var constructor = getConstructor(typeOrClassName), components = [];
        if (constructor) {
            findComponents(this, constructor, components);
            findChildComponents(this._children, constructor, components);
        }
        return components;
    },

    _checkMultipleComp: (CC_EDITOR || CC_PREVIEW) && function (ctor) {
        var existing = this.getComponent(ctor._disallowMultiple);
        if (existing) {
            if (existing.constructor === ctor) {
                cc.errorID(3805, js.getClassName(ctor), this._name);
            }
            else {
                cc.errorID(3806, js.getClassName(ctor), this._name, js.getClassName(existing));
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
     * @typescript
     * addComponent<T extends Component>(type: {new(): T}): T
     * addComponent(className: string): any
     */
    addComponent (typeOrClassName) {
        if (CC_EDITOR && (this._objFlags & Destroying)) {
            cc.error('isDestroying');
            return null;
        }

        // get component

        var constructor;
        if (typeof typeOrClassName === 'string') {
            constructor = js.getClassByName(typeOrClassName);
            if (!constructor) {
                cc.errorID(3807, typeOrClassName);
                if (cc._RFpeek()) {
                    cc.errorID(3808, typeOrClassName);
                }
                return null;
            }
        }
        else {
            if (!typeOrClassName) {
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
        if (!js.isChildClassOf(constructor, cc.Component)) {
            cc.errorID(3810);
            return null;
        }

        if ((CC_EDITOR || CC_PREVIEW) && constructor._disallowMultiple) {
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
        if ((CC_EDITOR || CC_TEST) && cc.engine && (this._id in cc.engine.attachedObjsForEditor)) {
            cc.engine.attachedObjsForEditor[component._id] = component;
        }
        if (this._activeInHierarchy) {
            cc.director._nodeActivator.activateComp(component);
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
        if (!(comp instanceof cc.Component)) {
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
        if ((CC_EDITOR || CC_TEST) && cc.engine && (this._id in cc.engine.attachedObjsForEditor)) {
            cc.engine.attachedObjsForEditor[comp._id] = comp;
        }
        if (this._activeInHierarchy) {
            cc.director._nodeActivator.activateComp(comp);
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
    removeComponent (component) {
        if (!component) {
            cc.errorID(3813);
            return;
        }
        if (!(component instanceof cc.Component)) {
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
    _removeComponent (component) {
        if (!component) {
            cc.errorID(3814);
            return;
        }

        if (!(this._objFlags & Destroying)) {
            var i = this._components.indexOf(component);
            if (i !== -1) {
                this._components.splice(i, 1);
                if ((CC_EDITOR || CC_TEST) && cc.engine) {
                    delete cc.engine.attachedObjsForEditor[component._id];
                }
            }
            else if (component.node !== this) {
                cc.errorID(3815);
            }
        }
    },

    destroy () {
        if (cc.Object.prototype.destroy.call(this)) {
            this.active = false;
        }
    },

    /**
     * !#en
     * Destroy all children from the node, and release all their own references to other objects.<br/>
     * Actual destruct operation will delayed until before rendering.
     * !#zh
     * 销毁所有子节点，并释放所有它们对其它对象的引用。<br/>
     * 实际销毁操作会延迟到当前帧渲染前执行。
     * @method destroyAllChildren
     * @example
     * node.destroyAllChildren();
     */
    destroyAllChildren () {
        var children = this._children;
        for (var i = 0; i < children.length; ++i) {
            children[i].destroy();
        }
    },

    _onSetParent (value) {},
    _onPostActivated () {},
    _onBatchCreated (dontSyncChildPrefab) {},

    _onHierarchyChanged (oldParent) {
        var newParent = this._parent;
        if (this._persistNode && !(newParent instanceof cc.Scene)) {
            cc.game.removePersistRootNode(this);
            if (CC_EDITOR) {
                cc.warnID(1623);
            }
        }

        if (CC_EDITOR || CC_TEST) {
            var scene = cc.director.getScene();
            var inCurrentSceneBefore = oldParent && oldParent.isChildOf(scene);
            var inCurrentSceneNow = newParent && newParent.isChildOf(scene);
            if (!inCurrentSceneBefore && inCurrentSceneNow) {
                // attached
                this._registerIfAttached(true);
            }
            else if (inCurrentSceneBefore && !inCurrentSceneNow) {
                // detached
                this._registerIfAttached(false);
            }

            // update prefab
            var newPrefabRoot = newParent && newParent._prefab && newParent._prefab.root;
            var myPrefabInfo = this._prefab;
            var PrefabUtils = Editor.require('scene://utils/prefab');
            if (myPrefabInfo) {
                if (newPrefabRoot) {
                    if (myPrefabInfo.root !== newPrefabRoot) {
                        if (myPrefabInfo.root === this) {
                            // nest prefab
                            myPrefabInfo.fileId || (myPrefabInfo.fileId = Editor.Utils.UuidUtils.uuid());
                            PrefabUtils.checkCircularReference(myPrefabInfo.root);
                        }
                        else {
                            // change prefab
                            PrefabUtils.linkPrefab(newPrefabRoot._prefab.asset, newPrefabRoot, this);
                            PrefabUtils.checkCircularReference(newPrefabRoot);
                        }
                    }
                }
                else if (myPrefabInfo.root === this) {
                    // nested prefab to root prefab
                    myPrefabInfo.fileId = '';   // root prefab doesn't have fileId
                }
                else {
                    // detach from prefab
                    PrefabUtils.unlinkPrefab(this);
                }
            }
            else if (newPrefabRoot) {
                // attach to prefab
                PrefabUtils.linkPrefab(newPrefabRoot._prefab.asset, newPrefabRoot, this);
                PrefabUtils.checkCircularReference(newPrefabRoot);
            }

            // conflict detection
            _Scene.DetectConflict.afterAddChild(this);
        }

        var shouldActiveNow = this._active && !!(newParent && newParent._activeInHierarchy);
        if (this._activeInHierarchy !== shouldActiveNow) {
            cc.director._nodeActivator.activateNode(this, shouldActiveNow);
        }
    },

    _instantiate (cloned, isSyncedNode) {
        if (!cloned) {
            cloned = cc.instantiate._clone(this, this);
        }

        var newPrefabInfo = cloned._prefab;
        if (CC_EDITOR && newPrefabInfo) {
            if (cloned === newPrefabInfo.root) {
                newPrefabInfo.fileId = '';
            }
            else {
                var PrefabUtils = Editor.require('scene://utils/prefab');
                PrefabUtils.unlinkPrefab(cloned);
            }
        }
        if (CC_EDITOR && cc.engine._isPlaying) {
            let syncing = newPrefabInfo && cloned === newPrefabInfo.root && newPrefabInfo.sync;
            if (!syncing) {
                cloned._name += ' (Clone)';
            }
        }

        // reset and init
        cloned._parent = null;
        cloned._onBatchCreated(isSyncedNode);

        return cloned;
    },

    _registerIfAttached: (CC_EDITOR || CC_TEST) && function (register) {
        var attachedObjsForEditor = cc.engine.attachedObjsForEditor;
        if (register) {
            attachedObjsForEditor[this._id] = this;
            for (let i = 0; i < this._components.length; i++) {
                let comp = this._components[i];
                attachedObjsForEditor[comp._id] = comp;
            }
            cc.engine.emit('node-attach-to-scene', this);
        }
        else {
            cc.engine.emit('node-detach-from-scene', this);
            delete attachedObjsForEditor[this._id];
            for (let i = 0; i < this._components.length; i++) {
                let comp = this._components[i];
                delete attachedObjsForEditor[comp._id];
            }
        }
        var children = this._children;
        for (let i = 0, len = children.length; i < len; ++i) {
            var child = children[i];
            child._registerIfAttached(register);
        }
    },

    _onPreDestroy () {
        var i, len;

        // marked as destroying
        this._objFlags |= Destroying;

        // detach self and children from editor
        var parent = this._parent;
        var destroyByParent = parent && (parent._objFlags & Destroying);
        if (!destroyByParent && (CC_EDITOR || CC_TEST)) {
            this._registerIfAttached(false);
        }

        // destroy children
        var children = this._children;
        for (i = 0, len = children.length; i < len; ++i) {
            // destroy immediate so its _onPreDestroy can be called
            children[i]._destroyImmediate();
        }

        // destroy self components
        for (i = 0, len = this._components.length; i < len; ++i) {
            var component = this._components[i];
            // destroy immediate so its _onPreDestroy can be called
            component._destroyImmediate();
        }

        var eventTargets = this.__eventTargets;
        for (i = 0, len = eventTargets.length; i < len; ++i) {
            var target = eventTargets[i];
            target && target.targetOff(this);
        }
        eventTargets.length = 0;

        // remove from persist
        if (this._persistNode) {
            cc.game.removePersistRootNode(this);
        }

        if (!destroyByParent) {
            // remove from parent
            if (parent) {
                var childIndex = parent._children.indexOf(this);
                parent._children.splice(childIndex, 1);
                parent.emit && parent.emit('child-removed', this);
            }
        }

        return destroyByParent;
    },

    onRestore: CC_EDITOR && function () {
        // check activity state
        var shouldActiveNow = this._active && !!(this._parent && this._parent._activeInHierarchy);
        if (this._activeInHierarchy !== shouldActiveNow) {
            cc.director._nodeActivator.activateNode(this, shouldActiveNow);
        }
    },
});

BaseNode.idGenerater = idGenerater;

// For walk
BaseNode._stacks = [[]];
BaseNode._stackId = 0;

BaseNode.prototype._onPreDestroyBase = BaseNode.prototype._onPreDestroy;
if (CC_EDITOR) {
    BaseNode.prototype._onPreDestroy = function () {
       var destroyByParent = this._onPreDestroyBase();
       if (!destroyByParent) {
           // ensure this node can reattach to scene by undo system
           // (simulate some destruct logic to make undo system work correctly)
           this._parent = null;
       }
       return destroyByParent;
   };
}

BaseNode.prototype._onHierarchyChangedBase = BaseNode.prototype._onHierarchyChanged;

if(CC_EDITOR) {
    BaseNode.prototype._onRestoreBase = BaseNode.prototype.onRestore;
}

// Define public getter and setter methods to ensure api compatibility.
var SameNameGetSets = ['parent', 'name', 'children', 'childrenCount',];
misc.propertyDefine(BaseNode, SameNameGetSets, {});

if (CC_DEV) {
    // promote debug info
    js.get(BaseNode.prototype, ' INFO ', function () {
        var path = '';
        var node = this;
        while (node && !(node instanceof cc.Scene)) {
            if (path) {
                path = node.name + '/' + path;
            }
            else {
                path = node.name;
            }
            node = node._parent;
        }
        return this.name + ', path: ' + path;
    });
}

/**
 * !#en
 * Note: This event is only emitted from the top most node whose active value did changed,
 * not including its child nodes.
 * !#zh
 * 注意：此节点激活时，此事件仅从最顶部的节点发出。
 * @event active-in-hierarchy-changed
 * @param {Event.EventCustom} event
 */

cc._BaseNode = module.exports = BaseNode;
