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

var JS = cc.js;
var Flags = cc.Object.Flags;
var Destroying = Flags.Destroying;
var DontDestroy = Flags.DontDestroy;
//var RegisteredInEditor = Flags.RegisteredInEditor;



/**
 * Class of all entities in Fireball scenes.
 * @class Node
 * @extends _BaseNode
 */
var Node = cc.Class({
    name: 'cc.Node',
    extends: require('./utils/base-node'),

    properties: {
        /**
         * The local active state of this node.
         * @property active
         * @type {Boolean}
         * @default true
         */
        active: {
            get: function () {
                return this._active;
            },
            set: function (value) {
                value = !!value;
                if (this._active !== value) {
                    this._active = value;
                    var canActiveInHierarchy = (this._parent && this._parent._activeInHierarchy);
                    if (canActiveInHierarchy) {
                        this._onActivatedInHierarchy(value);
                    }
                }
            }
        },

        /**
         * Indicates whether this node is active in the scene.
         * @property activeInHierarchy
         * @type {Boolean}
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
        }
    },

    ctor: function () {
        var name = arguments[0];
        this._name = typeof name !== 'undefined' ? name : 'New Node';
        this._activeInHierarchy = false;

        // cache component
        this._widget = null;

        /**
         * Register all related EventTargets,
         * all event callbacks will be removed in _onPreDestroy
         * @property __eventTargets
         * @type {EventTarget[]}
         * @private
         */
        this.__eventTargets = [];
    },

    statics: {
        _DirtyFlags: require('./utils/misc').DirtyFlags
    },

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

        // Remove all listeners
        for (i = 0, len = this.__eventTargets.length; i < len; ++i) {
            var target = this.__eventTargets[i];
            target && target.targetOff && target.targetOff(this);
        }
        this.__eventTargets.length = 0;

        // remove from persist
        if (this._persistNode) {
            cc.game.removePersistRootNode(this);
        }

        if ( !destroyByParent ) {
            // remove from parent
            if (parent) {
                parent._children.splice(parent._children.indexOf(this), 1);
            }

            this._removeSgNode();

            // simulate some destruct logic to make undo system work correctly
            if (CC_EDITOR) {
                // ensure this node can reattach to scene by undo system
                this._parent = null;
            }
        }
    },

    // COMPONENT

    /**
     * Returns the component of supplied type if the node has one attached, null if it doesn't.
     * You can also get component in the node by passing in the name of the script.
     *
     * @method getComponent
     * @param {Function|String} typeOrClassName
     * @returns {Component}
     */
    getComponent: function (typeOrClassName) {
        if ( !typeOrClassName ) {
            cc.error('getComponent: Type must be non-nil');
            return null;
        }
        var constructor;
        if (typeof typeOrClassName === 'string') {
            constructor = JS.getClassByName(typeOrClassName);
        }
        else {
            constructor = typeOrClassName;
        }
        if (constructor) {
            for (var c = 0; c < this._components.length; ++c) {
                var component = this._components[c];
                if (component instanceof constructor) {
                    return component;
                }
            }
        }
        return null;
    },

    _checkMultipleComp: CC_EDITOR && function (ctor) {
        if (this.getComponent(ctor._disallowMultiple)) {
            cc.error("The component %s can't be added because %s already contains the same (or subtype) component.",
                JS.getClassName(typeOrClassName), this._name);
            return false;
        }
        return true;
    },

    /**
     * Adds a component class to the node. You can also add component to entity by passing in the name of the script.
     *
     * @method addComponent
     * @param {Function|String} typeOrClassName - The constructor or the class name of the component to add
     * @returns {Component} - The newly added component
     */
    addComponent: function (typeOrClassName) {

        if ((this._objFlags & Destroying) && CC_EDITOR) {
            cc.error('isDestroying');
            return null;
        }

        // check component

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
        if (typeof constructor !== 'function') {
            cc.error("addComponent: The component to add must be a constructor");
            return null;
        }
        if (constructor._disallowMultiple && CC_EDITOR) {
            if (!this._checkMultipleComp(constructor)) {
                return null;
            }
        }

        //

        var component = new constructor();
        component.node = this;
        this._components.push(component);

        if (this._activeInHierarchy) {
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
            return cc.error('isDestroying');;
        }
        if (typeof comp !== 'function') {
            return cc.error("_addComponentAt: The component to add must be a constructor");
        }
        if (index > this._components.length) {
            return cc.error("_addComponentAt: Index out of range");
        }

        var ctor = comp.constructor;
        if (ctor._disallowMultiple) {
            if (!this._checkMultipleComp(ctor)) {
                return;
            }
        }

        comp.node = this;
        this._components.splice(index, 0, comp);

        if (this._activeInHierarchy) {
            // call onLoad/onEnable
            comp.__onNodeActivated(true);
        }
    },

    /**
     * Removes a component identified by the given name or removes the component object given.
     * You can also use component.destroy() if you already have the reference.
     * @method removeComponent
     * @param {String|Function|Component} component - The need remove component.
     * @deprecated please destroy the component to remove it.
     */
    removeComponent: function (component) {
        if ( !component ) {
            cc.error('removeComponent: Component must be non-nil');
            return null;
        }
        if (typeof component !== 'object') {
            component = this.getComponent(component);
        }
        if (component) {
            component.destroy();
        }
    },

    /**
     * Removes all components of cc.Node.
     * @method removeAllComponents
     */
    removeAllComponents: function () {
        for (var i = 0; i < this._components.length; i++) {
            var comp = this._components[i];
            comp.destroy();
        }
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
                component.node = null;
            }
            else if (component.node !== this) {
                cc.error("Component not owned by this entity");
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

    _onActivatedInHierarchy: function (newActive) {
        this._activeInHierarchy = newActive;

        // component maybe added during onEnable, and the onEnable of new component is already called
        // so we should record the origin length
        var originCount = this._components.length;
        for (var c = 0; c < originCount; ++c) {
            var component = this._components[c];
            if (! (component instanceof cc.Component) && CC_EDITOR) {
                cc.error('Sorry, the component of entity "%s" which with an index of %s is corrupted! It has been removed.\nSee DevTools for details.', this.name, c);
                console.log('Corrupted component value:', component);
                this._removeComponent(component);
                --c;
                --originCount;
            }
            else {
                component.__onNodeActivated(newActive);
            }
        }
        // activate children recursively
        for (var i = 0, len = this.childrenCount; i < len; ++i) {
            var child = this._children[i];
            if (child._active) {
                child._onActivatedInHierarchy(newActive);
            }
        }
    },

    _onHierarchyChanged: function (oldParent) {
        if (this._persistNode && !(this._parent instanceof cc.Scene)) {
            cc.game.removePersistRootNode(this);
            if (CC_EDITOR) {
                cc.warn('Set "%s" to normal node (not persist root node).');
            }
        }
        var activeInHierarchyBefore = this._active && !!(oldParent && oldParent._activeInHierarchy);
        var shouldActiveNow = this._active && !!(this._parent && this._parent._activeInHierarchy);
        if (activeInHierarchyBefore !== shouldActiveNow) {
            this._onActivatedInHierarchy(shouldActiveNow);
        }
        if (CC_EDITOR || CC_TEST) {
            var scene = cc.director.getScene();
            var inCurrentSceneBefore = oldParent && oldParent.isChildOf(scene);
            var inCurrentSceneNow = this._parent && this._parent.isChildOf(scene);
            if (!inCurrentSceneBefore && inCurrentSceneNow) {
                // attached
                this._registerIfAttached(true);
            }
            else if (inCurrentSceneBefore && !inCurrentSceneNow) {
                // detached
                this._registerIfAttached(false);
            }
        }
    },

    _deactivateChildComponents: function () {
        // 和 _onActivatedInHierarchy 类似但不修改 this._activeInHierarchy
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

    _onColorChanged: function () {
        // update components if also in scene graph
        for (var c = 0; c < this._components.length; ++c) {
            var comp = this._components[c];
            if (comp instanceof cc._ComponentInSG && comp.isValid) {
                comp._sgNode.setColor(this._color);
                if ( !this._cascadeOpacityEnabled ) {
                    comp._sgNode.setOpacity(this._opacity);
                }
            }
        }
    },

    _onCascadeChanged: function () {
        // update components which also in scene graph
        var opacity = this._cascadeOpacityEnabled ? 255 : this._opacity;
        for (var c = 0; c < this._components.length; ++c) {
            var comp = this._components[c];
            if (comp instanceof cc._ComponentInSG && comp.isValid) {
                comp._sgNode.setOpacity(opacity);
            }
        }
    },

    _onAnchorChanged: function () {
        // update components if also in scene graph
        for (var c = 0; c < this._components.length; ++c) {
            var comp = this._components[c];
            if (comp instanceof cc._ComponentInSG && comp.isValid) {
                comp._sgNode.setAnchorPoint(this._anchorPoint);
                comp._sgNode.ignoreAnchorPointForPosition(this._ignoreAnchorPointForPosition);
            }
        }
    },

    _onOpacityModifyRGBChanged: function () {
        for (var c = 0; c < this._components.length; ++c) {
            var comp = this._components[c];
            if (comp instanceof cc._ComponentInSG && comp.isValid) {
                comp._sgNode.setOpacityModifyRGB(this._opacityModifyRGB);
            }
        }
    }

});

// TODO - 这个类名是临时的，之后要改名成 cc.Node，再对外屏蔽原 cc.Node
cc.Node = module.exports = Node;
