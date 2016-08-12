/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

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

'use strict';

var EventTarget = require('./event/event-target');

var JS = cc.js;
var Flags = cc.Object.Flags;
var Destroying = Flags.Destroying;
var DontDestroy = Flags.DontDestroy;
var Activating = Flags.Activating;
//var RegisteredInEditor = Flags.RegisteredInEditor;

/**
 * !#en The event type supported by Node
 * !#zh Node 支持的事件类型
 * @enum Node.EventType
 * @static
 * @namespace Node
 */
var EventType = cc.Enum({
    /**
     * !#en The event type for touch start event, you can use its value directly: 'touchstart'
     * !#zh 当手指触摸到屏幕时。
     * @property TOUCH_START
     * @type {String}
     * @static
     */
    TOUCH_START: 'touchstart',
    /**
     * !#en The event type for touch move event, you can use its value directly: 'touchmove'
     * !#zh 当手指在屏幕上目标节点区域内移动时。
     * @property TOUCH_MOVE
     * @type {String}
     * @value 1
     * @static
     */
    TOUCH_MOVE: 'touchmove',
    /**
     * !#en The event type for touch end event, you can use its value directly: 'touchend'
     * !#zh 当手指在目标节点区域内离开屏幕时。
     * @property TOUCH_END
     * @type {String}
     * @static
     */
    TOUCH_END: 'touchend',
    /**
     * !#en The event type for touch end event, you can use its value directly: 'touchcancel'
     * !#zh 当手指在目标节点区域外离开屏幕时。
     * @property TOUCH_CANCEL
     * @type {String}
     * @static
     */
    TOUCH_CANCEL: 'touchcancel',

    /**
     * !#en The event type for mouse down events, you can use its value directly: 'mousedown'
     * !#zh 当鼠标按下时触发一次。
     * @property MOUSE_DOWN
     * @type {String}
     * @static
     */
    MOUSE_DOWN: 'mousedown',
    /**
     * !#en The event type for mouse move events, you can use its value directly: 'mousemove'
     * !#zh 当鼠标在目标节点在目标节点区域中移动时，不论是否按下。
     * @property MOUSE_MOVE
     * @type {String}
     * @static
     */
    MOUSE_MOVE: 'mousemove',
    /**
     * !#en The event type for mouse enter target events, you can use its value directly: 'mouseenter'
     * !#zh 当鼠标移入目标节点区域时，不论是否按下。
     * @property MOUSE_ENTER
     * @type {String}
     * @static
     */
    MOUSE_ENTER: 'mouseenter',
    /**
     * !#en The event type for mouse leave target events, you can use its value directly: 'mouseleave'
     * !#zh 当鼠标移出目标节点区域时，不论是否按下。
     * @property MOUSE_LEAVE
     * @type {String}
     * @static
     */
    MOUSE_LEAVE: 'mouseleave',
    /**
     * !#en The event type for mouse up events, you can use its value directly: 'mouseup'
     * !#zh 当鼠标从按下状态松开时触发一次。
     * @property MOUSE_UP
     * @type {String}
     * @static
     */
    MOUSE_UP: 'mouseup',
    /**
     * !#en The event type for mouse wheel events, you can use its value directly: 'mousewheel'
     * !#zh 当鼠标滚轮滚动时。
     * @property MOUSE_WHEEL
     * @type {String}
     * @static
     */
    MOUSE_WHEEL: 'mousewheel',
});

var _touchEvents = [
    EventType.TOUCH_START,
    EventType.TOUCH_MOVE,
    EventType.TOUCH_END,
    EventType.TOUCH_CANCEL,
];
var _mouseEvents = [
    EventType.MOUSE_DOWN,
    EventType.MOUSE_ENTER,
    EventType.MOUSE_MOVE,
    EventType.MOUSE_LEAVE,
    EventType.MOUSE_UP,
    EventType.MOUSE_WHEEL,
];

var currentHovered = null;

var _touchStartHandler = function (touch, event) {
    var pos = touch.getLocation();
    var node = this.owner;

    if (node._hitTest(pos, this)) {
        event.type = EventType.TOUCH_START;
        event.touch = touch;
        event.bubbles = true;
        node.dispatchEvent(event);
        return true;
    }
    return false;
};
var _touchMoveHandler = function (touch, event) {
    var node = this.owner;
    event.type = EventType.TOUCH_MOVE;
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
};
var _touchEndHandler = function (touch, event) {
    var pos = touch.getLocation();
    var node = this.owner;

    if (node._hitTest(pos, this)) {
        event.type = EventType.TOUCH_END;
    }
    else {
        event.type = EventType.TOUCH_CANCEL;
    }
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
};

var _mouseDownHandler = function (event) {
    var pos = event.getLocation();
    var node = this.owner;

    if (node._hitTest(pos, this)) {
        event.type = EventType.MOUSE_DOWN;
        node.dispatchEvent(event);
        event.stopPropagation();
    }
};
var _mouseMoveHandler = function (event) {
    var pos = event.getLocation();
    var node = this.owner;
    if (node._hitTest(pos, this)) {
        event.stopPropagation();
        if (!this._previousIn) {
            // Fix issue when hover node switched, previous hovered node won't get MOUSE_LEAVE notification
            if (currentHovered) {
                event.type = EventType.MOUSE_LEAVE;
                currentHovered.owner.dispatchEvent(event);
                currentHovered._previousIn = false;
            }
            currentHovered = this;
            event.type = EventType.MOUSE_ENTER;
            node.dispatchEvent(event);
            this._previousIn = true;
        }
        event.type = EventType.MOUSE_MOVE;
        node.dispatchEvent(event);
    }
    else if (this._previousIn) {
        event.type = EventType.MOUSE_LEAVE;
        node.dispatchEvent(event);
        this._previousIn = false;
        currentHovered = null;
    }
};
var _mouseUpHandler = function (event) {
    var pos = event.getLocation();
    var node = this.owner;

    if (node._hitTest(pos, this)) {
        event.type = EventType.MOUSE_UP;
        node.dispatchEvent(event);
        event.stopPropagation();
    }
};
var _mouseWheelHandler = function (event) {
    var pos = event.getLocation();
    var node = this.owner;

    if (node._hitTest(pos, this)) {
        event.type = EventType.MOUSE_WHEEL;
        node.dispatchEvent(event);
        //FIXME: separate wheel event and other mouse event.
        // event.stopPropagation();
    }
};

var _searchMaskParent = function (node) {
    if (cc.Mask) {
        var index = 0;
        var mask = null;
        for (var curr = node; curr && curr instanceof cc.Node; curr = curr.parent, ++index) {
            mask = curr.getComponent(cc.Mask);
            if (mask) {
                return {
                    index: index,
                    node: curr
                };
            }
        }
    }

    return null;
};

function getConstructor (typeOrClassName) {
    if ( !typeOrClassName ) {
        cc.error('getComponent: Type must be non-nil');
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
 * !#en
 * Class of all entities in Cocos Creator scenes.<br/>
 * Node also inherits from {{#crossLink "EventTarget"}}Event Target{{/crossLink}}, it permits Node to dispatch events.
 * For events supported by Node, please refer to {{#crossLink "Node.EventType"}}{{/crossLink}}
 * !#zh
 * Cocos Creator 场景中的所有节点类。节点也继承了 {{#crossLink "EventTarget"}}EventTarget{{/crossLink}}，它允许节点发送事件。<br/>
 * 支持的节点事件，请参阅 {{#crossLink "Node.EventType"}}{{/crossLink}}。
 * @class Node
 * @extends _BaseNode
 */
var Node = cc.Class({
    name: 'cc.Node',
    extends: require('./utils/base-node'),
    mixins: [EventTarget],

    properties: {
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
            get: function () {
                return this._active;
            },
            set: function (value) {
                value = !!value;
                if (this._active !== value) {
                    this._active = value;
                    var couldActiveInHierarchy = (this._parent && this._parent._activeInHierarchy);
                    if (couldActiveInHierarchy) {
                        this._onActivatedInHierarchy(value);
                        this.emit('active-in-hierarchy-changed', this);
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
            get: function () {
                return this._activeInHierarchy;
            }
        },

        // internal properties

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
        _prefab: {
            default: null,
            editorOnly: true
        },

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

        /**
         * !#en
         * Group index of node.<br/>
         * Which Group this node belongs to will resolve that this node's collision components can collide with which other collision componentns.<br/>
         * !#zh
         * 节点的分组索引。<br/>
         * 节点的分组将关系到节点的碰撞组件可以与哪些碰撞组件相碰撞。<br/>
         * @property groupIndex
         * @type {Integer}
         * @default 0
         */
        groupIndex: {
            default: 0,
            type: cc.Integer
        },

        /**
         * !#en
         * Group of node.<br/>
         * Which Group this node belongs to will resolve that this node's collision components can collide with which other collision componentns.<br/>
         * !#zh
         * 节点的分组。<br/>
         * 节点的分组将关系到节点的碰撞组件可以与哪些碰撞组件相碰撞。<br/>
         * @property group
         * @type {String}
         */
        group: {
            get: function () {
                return cc.game.groupList[this.groupIndex] || '';
            },

            set: function (value) {
                this.groupIndex = cc.game.groupList.indexOf(value);
                this.emit('group-changed');
            }
        }
    },

    ctor: function () {
        var name = arguments[0];
        this._name = typeof name !== 'undefined' ? name : 'New Node';
        this._activeInHierarchy = false;

        // cache component
        this._widget = null;

        // Touch event listener
        this._touchListener = null;

        // Mouse event listener
        this._mouseListener = null;

        // Retained actions for JSB
        if (CC_JSB) {
            this._retainedActions = [];
        }
    },

    //statics: {
    //    _DirtyFlags: require('./utils/misc').DirtyFlags
    //},

    // OVERRIDES

    destroy: function () {
        if (cc.Object.prototype.destroy.call(this)) {
            // disable hierarchy
            if (this._activeInHierarchy) {
                this._deactivateChildComponents();
            }
        }
    },

    _onPreDestroy: function () {
        var i, len;

        // marked as destroying
        this._objFlags |= Destroying;

        // detach self and children from editor
        var parent = this._parent;
        var destroyByParent = parent && (parent._objFlags & Destroying);
        if ( !destroyByParent ) {
            if (CC_EDITOR || CC_TEST) {
                this._registerIfAttached(false);
            }
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
        
        // Actions
        this.stopAllActions();
        this._releaseAllActions();

        // Remove Node.currentHovered
        if (currentHovered === this) {
            currentHovered = null;
        }

        // Remove all listeners
        if (CC_JSB && this._touchListener) {
            this._touchListener.release();
            this._touchListener.owner = null;
            this._touchListener.mask = null;
            this._touchListener = null;
        }
        if (CC_JSB && this._mouseListener) {
            this._mouseListener.release();
            this._mouseListener.owner = null;
            this._mouseListener.mask = null;
            this._mouseListener = null;
        }
        cc.eventManager.removeListeners(this);
        for (i = 0, len = this.__eventTargets.length; i < len; ++i) {
            var target = this.__eventTargets[i];
            target && target.targetOff(this);
        }
        this.__eventTargets.length = 0;

        // remove from persist
        if (this._persistNode) {
            cc.game.removePersistRootNode(this);
        }

        if ( !destroyByParent ) {
            // remove from parent
            if (parent) {
                var childIndex = parent._children.indexOf(this);
                parent._children.splice(childIndex, 1);
                parent.emit('child-removed', this);
            }

            this._removeSgNode();

            // simulate some destruct logic to make undo system work correctly
            if (CC_EDITOR) {
                // ensure this node can reattach to scene by undo system
                this._parent = null;
            }
        }
        else if (CC_JSB) {
            this._sgNode.release();
            this._sgNode._entity = null;
            this._sgNode = null;
        }
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
        var err, existing = this.getComponent(ctor._disallowMultiple);
        if (existing) {
            if (existing.constructor === ctor) {
                err = 'Can\'t add component "%s" because %s already contains the same component.';
                cc.error(err, JS.getClassName(ctor), this._name);
            }
            else {
                err = 'Can\'t add component "%s" to %s because it conflicts with the existing "%s" derived component.';
                cc.error(err, JS.getClassName(ctor), this._name, JS.getClassName(existing));
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
                cc.error('addComponent: Failed to get class "%s"', typeOrClassName);
                if (cc._RFpeek()) {
                    cc.error('addComponent: Should not add component ("%s") when the scripts are still loading.', typeOrClassName);
                }
                return null;
            }
        }
        else {
            if ( !typeOrClassName ) {
                cc.error('addComponent: Type must be non-nil');
                return null;
            }
            constructor = typeOrClassName;
        }

        // check component

        if (typeof constructor !== 'function') {
            cc.error('addComponent: The component to add must be a constructor');
            return null;
        }
        if (!cc.isChildClassOf(constructor, cc.Component)) {
            cc.error('addComponent: The component to add must be child class of cc.Component');
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
            return cc.error('_addComponentAt: The component to add must be a constructor');
        }
        if (index > this._components.length) {
            return cc.error('_addComponentAt: Index out of range');
        }

        // recheck attributes because script may changed
        var ctor = comp.constructor;
        if (ctor._disallowMultiple) {
            if (!this._checkMultipleComp(ctor)) {
                return;
            }
        }
        if (ctor._requireComponent) {
            if (index === this._components.length) {
                // If comp should be last component, increase the index because required component added
                ++index;
            }
            var depend = this.addComponent(ctor._requireComponent);
            if (!depend) {
                // depend conflicts
                return null;
            }
        }

        comp.node = this;
        this._components.splice(index, 0, comp);

        if (this._activeInHierarchy) {
            if (typeof comp.__preload === 'function') {
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
            cc.error('removeComponent: Component must be non-nil');
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
            cc.error('Argument must be non-nil');
            return;
        }

        if (!(this._objFlags & Destroying)) {
            var i = this._components.indexOf(component);
            if (i !== -1) {
                this._components.splice(i, 1);
            }
            else if (component.node !== this) {
                cc.error('Component not owned by this entity');
            }
        }
    },

    // INTERNAL

    _registerIfAttached: (CC_EDITOR || CC_TEST) && function (register) {
        if (register) {
            cc.engine.attachedObjsForEditor[this.uuid] = this;
            cc.engine.emit('node-attach-to-scene', {target: this});
            //this._objFlags |= RegisteredInEditor;
        }
        else {
            cc.engine.emit('node-detach-from-scene', {target: this});
            delete cc.engine.attachedObjsForEditor[this._id];
        }
        var children = this._children;
        for (var i = 0, len = children.length; i < len; ++i) {
            var child = children[i];
            child._registerIfAttached(register);
        }
    },

    _activeRecursively: function (newActive) {
        var cancelActivation = false;
        if (this._objFlags & Activating) {
            if (newActive) {
                cc.error('Node "%s" is already activating', this.name);
                return;
            }
            else {
                cancelActivation = true;
            }
        }
        else if (newActive) {
            this._objFlags |= Activating;
        }

        this._activeInHierarchy = newActive;

        // component maybe added during onEnable, and the onEnable of new component is already called
        // so we should record the origin length
        var originCount = this._components.length;
        for (var c = 0; c < originCount; ++c) {
            var component = this._components[c];
            if (component instanceof cc.Component) {
                component.__onNodeActivated(newActive);
                if (newActive && !this._activeInHierarchy) {
                    // deactivated during activating
                    this._objFlags &= ~Activating;
                    return;
                }
            }
            else {
                if (CC_DEV) {
                    cc.error('Sorry, the component of "%s" which with an index of %s is corrupted! It has been removed.',
                             this.name, c);
                    console.log('Corrupted component value:', component);
                }
                if (component) {
                    this._removeComponent(component);
                }
                else {
                    JS.array.removeAt(this._components, c);
                }
                --c;
                --originCount;
            }
        }

        // activate children recursively
        for (var i = 0, len = this._children.length; i < len; ++i) {
            var child = this._children[i];
            if (child._active) {
                child._activeRecursively(newActive);
                if (newActive && !this._activeInHierarchy) {
                    // deactivated during activating
                    this._objFlags &= ~Activating;
                    return;
                }
            }
        }

        if (cancelActivation) {
            this._objFlags &= ~Activating;
            return;
        }

        // ActionManager, EventManager
        if (newActive) {
            // activate
            cc.director.getActionManager().resumeTarget(this);
            cc.eventManager.resumeTarget(this);
        }
        else {
            // deactivate
            cc.director.getActionManager().pauseTarget(this);
            cc.eventManager.pauseTarget(this);
        }

        //
        this._objFlags &= ~Activating;
    },

    _onActivatedInHierarchy: function (newActive) {
        if (newActive) {
            cc.Component._callPreloadOnNode(this);
        }
        this._activeRecursively(newActive);
    },

    _onHierarchyChanged: function (oldParent) {
        var newParent = this._parent;
        if (this._persistNode && !(newParent instanceof cc.Scene)) {
            cc.game.removePersistRootNode(this);
            if (CC_EDITOR) {
                cc.warn('Set "%s" to normal node (not persist root node).');
            }
        }
        var activeInHierarchyBefore = this._active && !!(oldParent && oldParent._activeInHierarchy);
        var shouldActiveNow = this._active && !!(newParent && newParent._activeInHierarchy);
        if (activeInHierarchyBefore !== shouldActiveNow) {
            this._onActivatedInHierarchy(shouldActiveNow);
        }
        cc._widgetManager._nodesOrderDirty = true;
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
            if (myPrefabInfo) {
                if (newPrefabRoot) {
                    // change prefab
                    _Scene.PrefabUtils.linkPrefab(newPrefabRoot._prefab.asset, newPrefabRoot, this);
                }
                else if (myPrefabInfo.root !== this) {
                    // detach from prefab
                    _Scene.PrefabUtils.unlinkPrefab(this);
                }
            }
            else if (newPrefabRoot) {
                // attach to prefab
                _Scene.PrefabUtils.linkPrefab(newPrefabRoot._prefab.asset, newPrefabRoot, this);
            }

            // conflict detection
            _Scene.DetectConflict.afterAddChild(this);
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

    _instantiate: function () {
        var clone = cc.instantiate._clone(this, this);
        clone._parent = null;

        // init
        if (CC_EDITOR && cc.engine._isPlaying) {
            this._name += ' (Clone)';
        }
        clone._onBatchCreated();

        return clone;
    },

// EVENTS
    /**
     * !#en
     * Register a callback of a specific event type on Node.<br/>
     * Use this method to register touch or mouse event permit propagation based on scene graph,
     * you can propagate the event to the parents or swallow it by calling stopPropagation on the event.<br/>
     * It's the recommended way to register touch/mouse event for Node,
     * please do not use cc.eventManager directly for Node.
     * !#zh
     * 在节点上注册指定类型的回调函数，也可以设置 target 用于绑定响应函数的调用者。<br/>
     * 同时您可以将事件派发到父节点或者通过调用 stopPropagation 拦截它。<br/>
     * 推荐使用这种方式来监听节点上的触摸或鼠标事件，请不要在节点上直接使用 cc.eventManager。
     * @method on
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {Event} callback.param event
     * @param {Object} [target] - The target to invoke the callback, can be null
     * @param {Boolean} useCapture - When set to true, the capture argument prevents callback
     *                              from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE.
     *                              When false, callback will NOT be invoked when event's eventPhase attribute value is CAPTURING_PHASE.
     *                              Either way, callback will be invoked when event's eventPhase attribute value is AT_TARGET.
     * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
     * @example
     * // add Node Touch Event
     * node.on(cc.Node.EventType.TOUCH_START, callback, this.node);
     * node.on(cc.Node.EventType.TOUCH_MOVE, callback, this.node);
     * node.on(cc.Node.EventType.TOUCH_END, callback, this.node);
     * node.on(cc.Node.EventType.TOUCH_CANCEL, callback, this.node);
     */
    on: function (type, callback, target, useCapture) {
        if (_touchEvents.indexOf(type) !== -1) {
            if (!this._touchListener) {
                this._touchListener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    owner: this,
                    mask: _searchMaskParent(this),
                    onTouchBegan: _touchStartHandler,
                    onTouchMoved: _touchMoveHandler,
                    onTouchEnded: _touchEndHandler
                });
                if (CC_JSB) {
                    this._touchListener.retain();
                }
                cc.eventManager.addListener(this._touchListener, this);
            }
        }
        else if (_mouseEvents.indexOf(type) !== -1) {
            if (!this._mouseListener) {
                this._mouseListener = cc.EventListener.create({
                    event: cc.EventListener.MOUSE,
                    _previousIn: false,
                    owner: this,
                    mask: _searchMaskParent(this),
                    onMouseDown: _mouseDownHandler,
                    onMouseMove: _mouseMoveHandler,
                    onMouseUp: _mouseUpHandler,
                    onMouseScroll: _mouseWheelHandler,
                });
                if (CC_JSB) {
                    this._mouseListener.retain();
                }
                cc.eventManager.addListener(this._mouseListener, this);
            }
        }
        this._EventTargetOn(type, callback, target, useCapture);
    },

    /**
     * !#en
     * Removes the callback previously registered with the same type, callback, target and or useCapture.
     * This method is merely an alias to removeEventListener.
     * !#zh 删除之前与同类型，回调，目标或 useCapture 注册的回调。
     * @method off
     * @param {String} type - A string representing the event type being removed.
     * @param {Function} callback - The callback to remove.
     * @param {Object} [target] - The target to invoke the callback, if it's not given, only callback without target will be removed
     * @param {Boolean} useCapture - Specifies whether the callback being removed was registered as a capturing callback or not.
     *                              If not specified, useCapture defaults to false. If a callback was registered twice,
     *                              one with capture and one without, each must be removed separately. Removal of a capturing callback
     *                              does not affect a non-capturing version of the same listener, and vice versa.
     * @example
     * // remove Node TOUCH_START Event.
     * node.on(cc.Node.EventType.TOUCH_START, callback, this.node);
     * node.off(cc.Node.EventType.TOUCH_START, callback, this.node);
     */
    off: function (type, callback, target, useCapture) {
        this._EventTargetOff(type, callback, target, useCapture);

        if (_touchEvents.indexOf(type) !== -1) {
            this._checkTouchListeners();
        }
        else if (_mouseEvents.indexOf(type) !== -1) {
            this._checkMouseListeners();
        }
    },

    /**
     * !#en Removes all callbacks previously registered with the same target.
     * !#zh 移除目标上的所有注册事件。
     * @method targetOff
     * @param {Object} target - The target to be searched for all related callbacks
     * @example
     * node.targetOff(target);
     */
    targetOff: function (target) {
        this._EventTargetTargetOff(target);

        this._checkTouchListeners();
        this._checkMouseListeners();
    },

    _checkTouchListeners: function () {
        if (!(this._objFlags & Destroying) && this._bubblingListeners && this._touchListener) {
            for (var i = 0; i < _touchEvents.length; ++i) {
                if (this._bubblingListeners.has(_touchEvents[i])) {
                    return;
                }
            }

            cc.eventManager.removeListener(this._touchListener);
            this._touchListener = null;
        }
    },
    _checkMouseListeners: function () {
        if (!(this._objFlags & Destroying) && this._bubblingListeners && this._mouseListener) {
            for (var i = 0; i < _mouseEvents.length; ++i) {
                if (this._bubblingListeners.has(_mouseEvents[i])) {
                    return;
                }
            }

            cc.eventManager.removeListener(this._mouseListener);
            this._mouseListener = null;
        }
    },

    _hitTest: function (point, listener) {
        var w = this.width,
            h = this.height;
        var rect = cc.rect(0, 0, w, h);
        var trans = this.getNodeToWorldTransform();
        cc._rectApplyAffineTransformIn(rect, trans);
        var left = point.x - rect.x,
            right = rect.x + rect.width - point.x,
            bottom = point.y - rect.y,
            top = rect.y + rect.height - point.y;
        if (left >= 0 && right >= 0 && top >= 0 && bottom >= 0) {
            if (listener && listener.mask) {
                var mask = listener.mask;
                var parent = this;
                for (var i = 0; parent && i < mask.index; ++i, parent = parent.parent) {}
                // find mask parent, should hit test it
                if (parent === mask.node) {
                    var comp = parent.getComponent(cc.Mask);
                    return (comp && comp.enabledInHierarchy) ? comp._hitTest(point) : true;
                }
                // mask parent no longer exists
                else {
                    listener.mask = null;
                    return true;
                }
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    },

    // Store all capturing parents that are listening to the same event in the array
    _getCapturingTargets: function (type, array) {
        var parent = this.parent;
        while (parent) {
            if (parent.hasEventListener(type, true)) {
                array.push(parent);
            }
            parent = parent.parent;
        }
    },

    // Store all bubbling parents that are listening to the same event in the array
    _getBubblingTargets: function (type, array) {
        var parent = this.parent;
        while (parent) {
            if (parent.hasEventListener(type)) {
                array.push(parent);
            }
            parent = parent.parent;
        }
    },

    isRunning: function () {
        return this._activeInHierarchy;
    },

// ACTIONS
    /**
     * !#en
     * Executes an action, and returns the action that is executed.<br/>
     * The node becomes the action's target. Refer to cc.Action's getTarget() <br/>
     * Calling runAction while the node is not active won't have any effect. <br/>
     * Note：You shouldn't modify the action after runAction, that won't take any effect.<br/>
     * if you want to modify, when you define action plus.
     * !#zh
     * 执行并返回该执行的动作。该节点将会变成动作的目标。<br/>
     * 调用 runAction 时，节点自身处于不激活状态将不会有任何效果。<br/>
     * 注意：你不应该修改 runAction 后的动作，将无法发挥作用，如果想进行修改，请在定义 action 时加入。
     * @method runAction
     * @param {Action} action
     * @return {Action} An Action pointer
     * @example
     * var action = cc.scaleTo(0.2, 1, 0.6);
     * node.runAction(action);
     * node.runAction(action).repeatForever(); // fail
     * node.runAction(action.repeatForever()); // right
     */
    runAction: function (action) {
        if (!this.active)
            return;
        cc.assert(action, cc._LogInfos.Node.runAction);

        if (CC_JSB) {
            this._retainAction(action);
            this._sgNode._owner = this;
        }
        cc.director.getActionManager().addAction(action, this, false);
        return action;
    },

    /**
     * !#en Stops and removes all actions from the running action list .
     * !#zh 停止并且移除所有正在运行的动作列表。
     * @method stopAllActions
     * @example
     * node.stopAllActions();
     */
    stopAllActions: function () {
        cc.director.getActionManager().removeAllActionsFromTarget(this);
    },

    /**
     * !#en Stops and removes an action from the running action list.
     * !#zh 停止并移除指定的动作。
     * @method stopAction
     * @param {Action} action An action object to be removed.
     * @example
     * var action = cc.scaleTo(0.2, 1, 0.6);
     * node.stopAction(action);
     */
    stopAction: function (action) {
        cc.director.getActionManager().removeAction(action);
    },

    /**
     * !#en Removes an action from the running action list by its tag.
     * !#zh 停止并且移除指定标签的动作。
     * @method stopActionByTag
     * @param {Number} tag A tag that indicates the action to be removed.
     * @example
     * node.stopAction(1);
     */
    stopActionByTag: function (tag) {
        if (tag === cc.Action.TAG_INVALID) {
            cc.log(cc._LogInfos.Node.stopActionByTag);
            return;
        }
        cc.director.getActionManager().removeActionByTag(tag, this);
    },

    /**
     * !#en Returns an action from the running action list by its tag.
     * !#zh 通过标签获取指定动作。
     * @method getActionByTag
     * @see cc.Action#getTag and cc.Action#setTag
     * @param {Number} tag
     * @return {Action} The action object with the given tag.
     * @example
     * var action = node.getActionByTag(1);
     */
    getActionByTag: function (tag) {
        if (tag === cc.Action.TAG_INVALID) {
            cc.log(cc._LogInfos.Node.getActionByTag);
            return null;
        }
        cc.director.getActionManager().getActionByTag(tag, this);
    },

    /**
     * !#en
     * Returns the numbers of actions that are running plus the ones that are schedule to run (actions in actionsToAdd and actions arrays).<br/>
     *    Composable actions are counted as 1 action. Example:<br/>
     *    If you are running 1 Sequence of 7 actions, it will return 1. <br/>
     *    If you are running 7 Sequences of 2 actions, it will return 7.</p>
     * !#zh
     * 获取运行着的动作加上正在调度运行的动作的总数。<br/>
     * 例如：<br/>
     * - 如果你正在运行 7 个动作中的 1 个 Sequence，它将返回 1。<br/>
     * - 如果你正在运行 2 个动作中的 7 个 Sequence，它将返回 7。<br/>
     *
     * @method getNumberOfRunningActions
     * @return {Number} The number of actions that are running plus the ones that are schedule to run
     * @example
     * var count = node.getNumberOfRunningActions();
     * cc.log("Running Action Count: " + count);
     */
    getNumberOfRunningActions: function () {
        cc.director.getActionManager().numberOfRunningActionsInTarget(this);
    },

    _retainAction: function (action) {
        if (CC_JSB && action instanceof cc.Action && this._retainedActions.indexOf(action) === -1) {
            this._retainedActions.push(action);
            action.retain();
        }
    },

    _releaseAllActions: function () {
        if (CC_JSB) {
            for (var i = 0; i < this._retainedActions.length; ++i) {
                this._retainedActions[i].release();
            }
            this._retainedActions.length = 0;
        }
    },

});

// In JSB, when inner sg node being replaced, the system event listeners will be cleared.
// We need a mechanisme to guarentee the persistence of system event listeners.
if (CC_JSB) {
    var updateListeners = function () {
        if (!this._activeInHierarchy) {
            cc.eventManager.pauseTarget(this);
        }
    };

    cc.js.getset(Node.prototype, '_sgNode',
        function () {
            return this.__sgNode;
        },
        function (value) {
            this.__sgNode = value;
            if (this._touchListener || this._mouseListener) {
                if (this._touchListener) {
                    this._touchListener.retain();
                    cc.eventManager.removeListener(this._touchListener);
                    cc.eventManager.addListener(this._touchListener, this);
                    this._touchListener.release();
                }
                if (this._mouseListener) {
                    this._mouseListener.retain();
                    cc.eventManager.removeListener(this._mouseListener);
                    cc.eventManager.addListener(this._mouseListener, this);
                    this._mouseListener.release();
                }
                cc.director.once(cc.Director.EVENT_BEFORE_UPDATE, updateListeners, this);
            }
        },
        true
    );
}

/**
 * @event position-changed
 * @param {Event} event
 * @param {Vec2} event.detail - The old position, but this parameter is only available in editor!
 */
/**
/**
 * @event size-changed
 * @param {Event} event
 * @param {Size} event.detail - The old size, but this parameter is only available in editor!
 */
/**
 * @event anchor-changed
 * @param {Event} event
 */
/**
 * @event child-added
 * @param {Event} event
 * @param {Node} event.detail - child
 */
/**
 * @event child-removed
 * @param {Event} event
 * @param {Node} event.detail - child
 */
/**
 * @event child-reorder
 * @param {Event} event
 */
/**
 * @event group-changed
 * @param {Event} event
 */
/**
 * !#en
 * Note: This event is only emitted from the top most node whose active value did changed,
 * not including its child nodes.
 * !#zh
 * 注意：此节点激活时，此事件仅从最顶部的节点发出。
 * @event active-in-hierarchy-changed
 * @param {Event} event
 */

/**
 *
 * @event touchstart
 *
 */

Node.EventType = EventType;

cc.Node = module.exports = Node;
