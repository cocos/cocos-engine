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

require('../platform/CCObject');
require('../CCNode');
var idGenerater = new (require('../platform/id-generater'))('Comp');

var Flags = cc.Object.Flags;
var IsOnEnableCalled = Flags.IsOnEnableCalled;
var IsEditorOnEnableCalled = Flags.IsEditorOnEnableCalled;
var IsPreloadCalled = Flags.IsPreloadCalled;
var IsOnLoadStarted = Flags.IsOnLoadStarted;
var IsOnLoadCalled = Flags.IsOnLoadCalled;
var IsStartCalled = Flags.IsStartCalled;

var callPreloadInTryCatch;
var callOnLoadInTryCatch;
var callOnEnableInTryCatch;
var callStartInTryCatch;
var callOnDisableInTryCatch;
var callOnDestroyInTryCatch;
var callOnFocusInTryCatch;
var callOnLostFocusInTryCatch;
var callResetInTryCatch;

if (CC_EDITOR) {
    // yes we use assignment expression here to avoid callerFunctor still being hoisted without CC_EDITOR
    var callerFunctor = function (funcName) {
        function call_FUNC_InTryCatch (comp) {
            try {
                comp._FUNC_();
            }
            catch (e) {
                cc._throw(e);
            }
        }
        return eval(('(' + call_FUNC_InTryCatch + ')').replace(/_FUNC_/g, funcName));
    };
    callPreloadInTryCatch = callerFunctor('__preload');
    callOnLoadInTryCatch = callerFunctor('onLoad');
    callOnEnableInTryCatch = callerFunctor('onEnable');
    callStartInTryCatch = callerFunctor('start');
    callOnDisableInTryCatch = callerFunctor('onDisable');
    callOnDestroyInTryCatch = callerFunctor('onDestroy');
    callOnFocusInTryCatch = callerFunctor('onFocusInEditor');
    callOnLostFocusInTryCatch = callerFunctor('onLostFocusInEditor');
    callResetInTryCatch = callerFunctor('resetInEditor');
}

function callOnEnable (self, enable) {
    
    if (!CC_EDITOR || (cc.engine.isPlaying || self.constructor._executeInEditMode) ) {
        var enableCalled = self._objFlags & IsOnEnableCalled;
        if (enable) {
            if (!enableCalled) {
                if (self.onEnable) {
                    if (CC_EDITOR) {
                        callOnEnableInTryCatch(self);
                    }
                    else {
                        self.onEnable();
                    }
                }

                var deactivatedDuringOnEnable = !self.node._activeInHierarchy;
                if (deactivatedDuringOnEnable) {
                    return;
                }

                cc.director.getScheduler().resumeTarget(self);
                _registerEvent(self);

                self._objFlags |= IsOnEnableCalled;
            }
        }
        else if (enableCalled) {
            if (self.onDisable) {
                if (CC_EDITOR) {
                    callOnDisableInTryCatch(self);
                }
                else {
                    self.onDisable();
                }
            }

            cc.director.getScheduler().pauseTarget(self);
            _unregisterEvent(self);

            self._objFlags &= ~IsOnEnableCalled;
        }
    }

    if (CC_EDITOR) {
        if (enable) {
            if ( !(self._objFlags & IsEditorOnEnableCalled) ) {
                cc.engine.emit('component-enabled', self.uuid);
                self._objFlags |= IsEditorOnEnableCalled;
            }
        }
        else {
            if (self._objFlags & IsEditorOnEnableCalled) {
                cc.engine.emit('component-disabled', self.uuid);
                self._objFlags &= ~IsEditorOnEnableCalled;
            }
        }
    }
}

var Director = cc.Director;

function _registerEvent (self) {
    if (CC_EDITOR && !(self.constructor._executeInEditMode || cc.engine._isPlaying)) {
        return;
    }
    if (self.start && !(self._objFlags & IsStartCalled)) {
        cc.director.__fastOn(Director.EVENT_BEFORE_UPDATE, _callStart, self, self.__eventTargets);
    }
    if (self.update || self.lateUpdate) {
        cc.director.__fastOn(Director.EVENT_BEFORE_UPDATE, _registerUpdateEvent, self, self.__eventTargets);
    }
}

function _unregisterEvent (self) {
    if (CC_EDITOR && !(self.constructor._executeInEditMode || cc.engine._isPlaying)) {
        return;
    }
    if (self.start && !(self._objFlags & IsStartCalled)) {
        cc.director.__fastOff(Director.EVENT_BEFORE_UPDATE, _callStart, self, self.__eventTargets);
    }
    var hasUpdate = self.update;
    var hasLateUpdate = self.lateUpdate;
    if (hasUpdate || hasLateUpdate) {
        cc.director.__fastOff(Director.EVENT_BEFORE_UPDATE, _registerUpdateEvent, self, self.__eventTargets);
        if (hasUpdate) {
            cc.director.__fastOff(Director.EVENT_COMPONENT_UPDATE, _callUpdate, self, self.__eventTargets);
        }
        if (hasLateUpdate) {
            cc.director.__fastOff(Director.EVENT_COMPONENT_LATE_UPDATE, _callLateUpdate, self, self.__eventTargets);
        }
    }
}

function _registerUpdateEvent () {
    var eventTargets = this.__eventTargets;
    var director = cc.director;
    director.__fastOff(Director.EVENT_BEFORE_UPDATE, _registerUpdateEvent, this, eventTargets);
    if (this.update) {
        director.__fastOn(Director.EVENT_COMPONENT_UPDATE, _callUpdate, this, eventTargets);
    }
    if (this.lateUpdate) {
        director.__fastOn(Director.EVENT_COMPONENT_LATE_UPDATE, _callLateUpdate, this, eventTargets);
    }
}

var _callStart = CC_EDITOR ? function () {
    cc.director.__fastOff(Director.EVENT_BEFORE_UPDATE, _callStart, this, this.__eventTargets);
    callStartInTryCatch(this);
    this._objFlags |= IsStartCalled;
} : function () {
    cc.director.__fastOff(Director.EVENT_BEFORE_UPDATE, _callStart, this, this.__eventTargets);
    this.start();
    this._objFlags |= IsStartCalled;
};

var _callUpdate = CC_EDITOR ? function (event) {
    try {
        this.update(event.detail);
    }
    catch (e) {
        cc._throw(e);
    }
} : function (event) {
    this.update(event.detail);
};

var _callLateUpdate = CC_EDITOR ? function (event) {
    try {
        this.lateUpdate(event.detail);
    }
    catch (e) {
        cc._throw(e);
    }
} : function (event) {
    this.lateUpdate(event.detail);
};

function _callPreloadOnNode (node) {
    // set _activeInHierarchy to true before invoking onLoad
    // to allow preload triggered on nodes which created in parent's onLoad dynamically.
    node._activeInHierarchy = true;

    var comps = node._components;
    var i = 0, len = comps.length;
    for (; i < len; ++i) {
        var component = comps[i];
        if (component && !(component._objFlags & IsPreloadCalled) && typeof component.__preload === 'function') {
            if (CC_EDITOR) {
                callPreloadInTryCatch(component);
            }
            else {
                component.__preload();
            }
            component._objFlags |= IsPreloadCalled;
        }
    }
    var children = node._children;
    for (i = 0, len = children.length; i < len; ++i) {
        var child = children[i];
        if (child._active) {
            _callPreloadOnNode(child);
        }
    }
}

/**
 * !#en
 * Base class for everything attached to Node(Entity).<br/>
 * <br/>
 * NOTE: Not allowed to use construction parameters for Component's subclasses,
 *       because Component is created by the engine.
 * !#zh
 * 所有附加到节点的基类。<br/>
 * <br/>
 * 注意：不允许使用组件的子类构造参数，因为组件是由引擎创建的。
 *
 * @class Component
 * @extends Object
 */
var Component = cc.Class({
    name: 'cc.Component',
    extends: cc.Object,

    ctor: CC_EDITOR ? function () {
        if (window._Scene && _Scene.AssetsWatcher) {
            _Scene.AssetsWatcher.initComponent(this);
        }
        // Support for Scheduler
        this.__instanceId = cc.ClassManager.getNewInstanceId();

        /**
         * Register all related EventTargets,
         * all event callbacks will be removed in _onPreDestroy
         * @property {Array} __eventTargets
         * @private
         */
        this.__eventTargets = [];
    } : function () {
        // Support for Scheduler
        this.__instanceId = cc.ClassManager.getNewInstanceId();
        this.__eventTargets = [];
    },

    properties: {
        /**
         * !#en The node this component is attached to. A component is always attached to a node.
         * !#zh 该组件被附加到的节点。组件总会附加到一个节点。
         * @property node
         * @type {Node}
         * @example
         * cc.log(comp.node);
         */
        node: {
            default: null,
            visible: false
        },

        name: {
            get: function () {
                if (this._name) {
                    return this._name;
                }
                var className = cc.js.getClassName(this);
                var trimLeft = className.lastIndexOf('.');
                if (trimLeft >= 0) {
                    className = className.slice(trimLeft + 1);
                }
                return this.node.name + '<' + className + '>';
            },
            set: function (value) {
                this._name = value;
            },
            visible: false
        },

        _id: {
            default: '',
            serializable: false
        },

        /**
         * !#en The uuid for editor.
         * !#zh 组件的 uuid，用于编辑器。
         * @property uuid
         * @type {String}
         * @readOnly
         * @example
         * cc.log(comp.uuid);
         */
        uuid: {
            get: function () {
                var id = this._id;
                if ( !id ) {
                    id = this._id = idGenerater.getNewId();
                    if (CC_EDITOR || CC_TEST) {
                        cc.engine.attachedObjsForEditor[id] = this;
                    }
                }
                return id;
            },
            visible: false
        },

        __scriptAsset: CC_EDITOR && {
            get: function () {},
            //set: function (value) {
            //    if (this.__scriptUuid !== value) {
            //        if (value && Editor.Utils.UuidUtils.isUuid(value._uuid)) {
            //            var classId = Editor.Utils.UuidUtils.compressUuid(value._uuid);
            //            var NewComp = cc.js._getClassById(classId);
            //            if (cc.isChildClassOf(NewComp, cc.Component)) {
            //                cc.warn('Sorry, replacing component script is not yet implemented.');
            //                //Editor.Ipc.sendToWins('reload:window-scripts', Editor._Sandbox.compiled);
            //            }
            //            else {
            //                cc.error('Can not find a component in the script which uuid is "%s".', value._uuid);
            //            }
            //        }
            //        else {
            //            cc.error('Invalid Script');
            //        }
            //    }
            //},
            displayName: 'Script',
            type: cc._Script,
            tooltip: CC_DEV && 'i18n:INSPECTOR.component.script'
        },

        /**
         * @property _enabled
         * @type {Boolean}
         * @private
         */
        _enabled: true,

        /**
         * !#en indicates whether this component is enabled or not.
         * !#zh 表示该组件自身是否启用。
         * @property enabled
         * @type {Boolean}
         * @default true
         * @example
         * comp.enabled = true;
         * cc.log(comp.enabled);
         */
        enabled: {
            get: function () {
                return this._enabled;
            },
            set: function (value) {
                if (this._enabled !== value) {
                    this._enabled = value;
                    if (this.node._activeInHierarchy) {
                        callOnEnable(this, value);
                    }
                }
            },
            visible: false
        },

        /**
         * !#en indicates whether this component is enabled and its node is also active in the hierarchy.
         * !#zh 表示该组件是否被启用并且所在的节点也处于激活状态。。
         * @property enabledInHierarchy
         * @type {Boolean}
         * @readOnly
         * @example
         * cc.log(comp.enabledInHierarchy);
         */
        enabledInHierarchy: {
            get: function () {
                return (this._objFlags & IsOnEnableCalled) > 0;
            },
            visible: false
        },

        /**
         * !#en TODO
         * !#zh onLoad 是否被调用。
         * @property _isOnLoadCalled
         * @type {Boolean}
         * @readOnly
         * @example
         * cc.log(_isOnLoadCalled);
         */
        _isOnLoadCalled: {
            get: function () {
                return this._objFlags & IsOnLoadCalled;
            }
        },
    },

    // LIFECYCLE METHODS

    // Fireball provides lifecycle methods that you can specify to hook into this process.
    // We provide Pre methods, which are called right before something happens, and Post methods which are called right after something happens.

    /**
     * !#en Update is called every frame, if the Component is enabled.
     * !#zh 如果该组件启用，则每帧调用 update。
     * @method update
     */
    update: null,

    /**
     * !#en LateUpdate is called every frame, if the Component is enabled.
     * !#zh 如果该组件启用，则每帧调用 LateUpdate。
     * @method lateUpdate
     */
    lateUpdate: null,

    /**
     * `__preload` is called before every onLoad.
     * It is used to initialize the builtin components internally,
     * to avoid checking whether onLoad is called before every public method calls.
     * This method should be removed if script priority is supported.
     *
     * @method __preload
     * @private
     */
    __preload: null,

    /**
     * !#en When attaching to an active node or its node first activated.
     * !#zh 当附加到一个激活的节点上或者其节点第一次激活时候调用。
     * @method onLoad
     */
    onLoad: null,

    /**
     * !#en Called before all scripts' update if the Component is enabled the first time.
     * !#zh 如果该组件第一次启用，则在所有组件的 update 之前调用。
     * @method start
     */
    start: null,

    /**
     * !#en Called when this component becomes enabled and its node is active.
     * !#zh 当该组件被启用，并且它的节点也激活时。
     * @method onEnable
     */
    onEnable: null,

    /**
     * !#en Called when this component becomes disabled or its node becomes inactive.
     * !#zh 当该组件被禁用或节点变为无效时调用。
     * @method onDisable
     */
    onDisable: null,

    /**
     * !#en Called when this component will be destroyed.
     * !#zh 当该组件被销毁时调用
     * @method onDestroy
     */
    onDestroy: null,

    /**
     * @method onFocusInEditor
     */
    onFocusInEditor: null,
    /**
     * @method onLostFocusInEditor
     */
    onLostFocusInEditor: null,
    /**
     * !#en Called to initialize the component or node’s properties when adding the component the first time or when the Reset command is used. This function is only called in editor.
     * !#zh 用来初始化组件或节点的一些属性，当该组件被第一次添加到节点上或用户点击了它的 Reset 菜单时调用。这个回调只会在编辑器下调用。
     * @method resetInEditor
     */
    resetInEditor: null,

    // PUBLIC

    /**
     * !#en Adds a component class to the node. You can also add component to node by passing in the name of the script.
     * !#zh 向节点添加一个组件类，你还可以通过传入脚本的名称来添加组件。
     *
     * @method addComponent
     * @param {Function|String} typeOrTypename - the constructor or the class name of the component to add
     * @return {Component} - the newly added component
     * @example
     * var sprite = node.addComponent(cc.Sprite);
     * var test = node.addComponent("Test");
     */
    addComponent: function (typeOrTypename) {
        return this.node.addComponent(typeOrTypename);
    },

    /**
     * !#en
     * Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
     * You can also get component in the node by passing in the name of the script.
     * !#zh
     * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
     * 传入参数也可以是脚本的名称。
     *
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
        return this.node.getComponent(typeOrClassName);
    },

    /**
     * !#en Returns all components of supplied Type in the node.
     * !#zh 返回节点上指定类型的所有组件。
     *
     * @method getComponents
     * @param {Function|String} typeOrClassName
     * @return {Component[]}
     * @example
     * var sprites = node.getComponents(cc.Sprite);
     * var tests = node.getComponents("Test");
     */
    getComponents: function (typeOrClassName) {
        return this.node.getComponents(typeOrClassName);
    },

    /**
     * !#en Returns the component of supplied type in any of its children using depth first search.
     * !#zh 递归查找所有子节点中第一个匹配指定类型的组件。
     *
     * @method getComponentInChildren
     * @param {Function|String} typeOrClassName
     * @returns {Component}
     * @example
     * var sprite = node.getComponentInChildren(cc.Sprite);
     * var Test = node.getComponentInChildren("Test");
     */
    getComponentInChildren: function (typeOrClassName) {
        return this.node.getComponentInChildren(typeOrClassName);
    },

    /**
     * !#en Returns the components of supplied type in self or any of its children using depth first search.
     * !#zh 递归查找自身或所有子节点中指定类型的组件
     *
     * @method getComponentsInChildren
     * @param {Function|String} typeOrClassName
     * @returns {Component[]}
     * @example
     * var sprites = node.getComponentsInChildren(cc.Sprite);
     * var tests = node.getComponentsInChildren("Test");
     */
    getComponentsInChildren: function (typeOrClassName) {
        return this.node.getComponentsInChildren(typeOrClassName);
    },

    // VIRTUAL

    /**
     * !#en
     * If the component's bounding box is different from the node's, you can implement this method to supply
     * a custom axis aligned bounding box (AABB), so the editor's scene view can perform hit test properly.
     * !#zh
     * 如果组件的包围盒与节点不同，您可以实现该方法以提供自定义的轴向对齐的包围盒（AABB），
     * 以便编辑器的场景视图可以正确地执行点选测试。
     *
     * @method _getLocalBounds
     * @param {Rect} out_rect - the Rect to receive the bounding box
     */
    _getLocalBounds: null,

    /**
     * !#en
     * onRestore is called after the user clicks the Reset item in the Inspector's context menu or performs
     * an undo operation on this component.<br/>
     * <br/>
     * If the component contains the "internal state", short for "temporary member variables which not included<br/>
     * in its CCClass properties", then you may need to implement this function.<br/>
     * <br/>
     * The editor will call the getset accessors of your component to record/restore the component's state<br/>
     * for undo/redo operation. However, in extreme cases, it may not works well. Then you should implement<br/>
     * this function to manually synchronize your component's "internal states" with its public properties.<br/>
     * Once you implement this function, all the getset accessors of your component will not be called when<br/>
     * the user performs an undo/redo operation. Which means that only the properties with default value<br/>
     * will be recorded or restored by editor.<br/>
     * <br/>
     * Similarly, the editor may failed to reset your component correctly in extreme cases. Then if you need<br/>
     * to support the reset menu, you should manually synchronize your component's "internal states" with its<br/>
     * properties in this function. Once you implement this function, all the getset accessors of your component<br/>
     * will not be called during reset operation. Which means that only the properties with default value<br/>
     * will be reset by editor.
     *
     * This function is only called in editor mode.
     * !#zh
     * onRestore 是用户在检查器菜单点击 Reset 时，对此组件执行撤消操作后调用的。<br/>
     * <br/>
     * 如果组件包含了“内部状态”（不在 CCClass 属性中定义的临时成员变量），那么你可能需要实现该方法。<br/>
     * <br/>
     * 编辑器执行撤销/重做操作时，将调用组件的 get set 来录制和还原组件的状态。
     * 然而，在极端的情况下，它可能无法良好运作。<br/>
     * 那么你就应该实现这个方法，手动根据组件的属性同步“内部状态”。
     * 一旦你实现这个方法，当用户撤销或重做时，组件的所有 get set 都不会再被调用。
     * 这意味着仅仅指定了默认值的属性将被编辑器记录和还原。<br/>
     * <br/>
     * 同样的，编辑可能无法在极端情况下正确地重置您的组件。<br/>
     * 于是如果你需要支持组件重置菜单，你需要在该方法中手工同步组件属性到“内部状态”。<br/>
     * 一旦你实现这个方法，组件的所有 get set 都不会在重置操作时被调用。
     * 这意味着仅仅指定了默认值的属性将被编辑器重置。
     * <br/>
     * 此方法仅在编辑器下会被调用。
     * @method onRestore
     */
    onRestore: null,

    // OVERRIDE

    destroy: function () {
        if (CC_EDITOR) {
            var depend = this.node._getDependComponent(this);
            if (depend) {
                return cc.errorID(3626,
                    cc.js.getClassName(this), cc.js.getClassName(depend));
            }
        }
        if (this._super()) {
            if (this._enabled && this.node._activeInHierarchy) {
                callOnEnable(this, false);
            }
        }
    },

    __onNodeActivated: CC_EDITOR ? function (active) {
        if (active && !(this._objFlags & IsOnLoadStarted) &&
            (cc.engine._isPlaying || this.constructor._executeInEditMode)) {
            this._objFlags |= IsOnLoadStarted;

            if (this.onLoad) {
                callOnLoadInTryCatch(this);
            }

            this._objFlags |= IsOnLoadCalled;

            if (this.onLoad && !cc.engine._isPlaying) {
                var focused = Editor.Selection.curActivate('node') === this.node.uuid;
                if (focused && this.onFocusInEditor) {
                    callOnFocusInTryCatch(this);
                }
                else if (this.onLostFocusInEditor) {
                    callOnLostFocusInTryCatch(this);
                }
            }
            if ( !CC_TEST ) {
                _Scene.AssetsWatcher.start(this);
            }
        }
        if (this._enabled) {
            if (active) {
                var deactivatedOnLoading = !this.node._activeInHierarchy;
                if (deactivatedOnLoading) {
                    return;
                }
            }
            callOnEnable(this, active);
        }
    } : function (active) {
        if (active && !(this._objFlags & IsOnLoadStarted)) {
            this._objFlags |= IsOnLoadStarted;
            if (this.onLoad) {
                this.onLoad();
            }
            this._objFlags |= IsOnLoadCalled;
        }
        if (this._enabled) {
            if (active) {
                var deactivatedOnLoading = !this.node._activeInHierarchy;
                if (deactivatedOnLoading) {
                    return;
                }
            }
            callOnEnable(this, active);
        }
    },

    _onPreDestroy: function () {
        var i, l, target;
        // ensure onDisable called
        callOnEnable(this, false);

        // Schedules
        this.unscheduleAllCallbacks();

        // Remove all listeners
        for (i = 0, l = this.__eventTargets.length; i < l; ++i) {
            target = this.__eventTargets[i];
            target && target.targetOff(this);
        }
        this.__eventTargets.length = 0;

        //
        if (CC_EDITOR && !CC_TEST) {
            _Scene.AssetsWatcher.stop(this);
        }

        // onDestroy
        if (this.onDestroy && (this._objFlags & IsOnLoadCalled)) {
            if (CC_EDITOR) {
                if (cc.engine._isPlaying || this.constructor._executeInEditMode) {
                    callOnDestroyInTryCatch(this);
                }
            }
            else {
                this.onDestroy();
            }
        }

        // do remove component
        this.node._removeComponent(this);

        if (CC_EDITOR || CC_TEST) {
            delete cc.engine.attachedObjsForEditor[this._id];
        }
    },

    _instantiate: function (cloned) {
        if (!cloned) {
            cloned = cc.instantiate._clone(this, this);
        }
        cloned.node = null;
        return cloned;
    },

// Scheduler

    isRunning: function () {
        return this.enabledInHierarchy;
    },

    /**
     * !#en
     * Schedules a custom selector.<br/>
     * If the selector is already scheduled, then the interval parameter will be updated without scheduling it again.
     * !#zh
     * 调度一个自定义的回调函数。<br/>
     * 如果回调函数已调度，那么将不会重复调度它，只会更新时间间隔参数。
     * @method schedule
     * @param {function} callback The callback function
     * @param {Number} [interval=0]  Tick interval in seconds. 0 means tick every frame. If interval = 0, it's recommended to use scheduleUpdate() instead.
     * @param {Number} [repeat=cc.macro.REPEAT_FOREVER]    The selector will be executed (repeat + 1) times, you can use kCCRepeatForever for tick infinitely.
     * @param {Number} [delay=0]     The amount of time that the first tick will wait before execution.
     * @example
     * var timeCallback = function (dt) {
     *   cc.log("time: " + dt);
     * }
     * this.schedule(timeCallback, 1);
     */
    schedule: function (callback, interval, repeat, delay) {
        cc.assertID(callback, 1619);
        cc.assertID(interval >= 0, 1620);

        interval = interval || 0;
        repeat = isNaN(repeat) ? cc.macro.REPEAT_FOREVER : repeat;
        delay = delay || 0;

        cc.director.getScheduler().schedule(callback, this, interval, repeat, delay, !this.enabledInHierarchy);
    },

    /**
     * !#en Schedules a callback function that runs only once, with a delay of 0 or larger.
     * !#zh 调度一个只运行一次的回调函数，可以指定 0 让回调函数在下一帧立即执行或者在一定的延时之后执行。
     * @method scheduleOnce
     * @see cc.Node#schedule
     * @param {function} callback  A function wrapped as a selector
     * @param {Number} [delay=0]  The amount of time that the first tick will wait before execution.
     * @example
     * var timeCallback = function (dt) {
     *   cc.log("time: " + dt);
     * }
     * this.scheduleOnce(timeCallback, 2);
     */
    scheduleOnce: function (callback, delay) {
        this.schedule(callback, 0, 0, delay);
    },

    /**
     * !#en Unschedules a custom callback function.
     * !#zh 取消调度一个自定义的回调函数。
     * @method unschedule
     * @see cc.Node#schedule
     * @param {function} callback_fn  A function wrapped as a selector
     * @example
     * this.unschedule(_callback);
     */
    unschedule: function (callback_fn) {
        if (!callback_fn)
            return;

        cc.director.getScheduler().unschedule(callback_fn, this);
    },

    /**
     * !#en
     * unschedule all scheduled callback functions: custom callback functions, and the 'update' callback function.<br/>
     * Actions are not affected by this method.
     * !#zh 取消调度所有已调度的回调函数：定制的回调函数以及 'update' 回调函数。动作不受此方法影响。
     * @method unscheduleAllCallbacks
     * @example
     * this.unscheduleAllCallbacks();
     */
    unscheduleAllCallbacks: function () {
        cc.director.getScheduler().unscheduleAllForTarget(this);
    },
});

Component._requireComponent = null;

if (CC_EDITOR || CC_TEST) {

    // INHERITABLE STATIC MEMBERS

    Component._executeInEditMode = false;
    Component._playOnFocus = false;
    Component._disallowMultiple = null;
    Component._help = '';

    // NON-INHERITED STATIC MEMBERS

    Object.defineProperty(Component, '_inspector', { value: '', writable: true });
    Object.defineProperty(Component, '_icon', { value: '', writable: true });

    // COMPONENT HELPERS

    cc._componentMenuItems = [];

    Component._addMenuItem = function (cls, path, priority) {
        cc._componentMenuItems.push({
            component: cls,
            menuPath: path,
            priority: priority
        });
    };
}

// use defineProperty to prevent inherited by sub classes
Object.defineProperty(Component, '_registerEditorProps', {
    value: function (cls, props) {
        var reqComp = props.requireComponent;
        if (reqComp) {
            cls._requireComponent = reqComp;
        }
        if (CC_EDITOR || CC_TEST) {
            var name = cc.js.getClassName(cls);
            for (var key in props) {
                var val = props[key];
                switch (key) {

                    case 'executeInEditMode':
                        cls._executeInEditMode = !!val;
                        break;

                    case 'playOnFocus':
                        if (val) {
                            var willExecuteInEditMode = ('executeInEditMode' in props) ? props.executeInEditMode : cls._executeInEditMode;
                            if (willExecuteInEditMode) {
                                cls._playOnFocus = true;
                            }
                            else {
                                cc.warnID(3601, name);
                            }
                        }
                        break;

                    case 'inspector':
                        Object.defineProperty(cls, '_inspector', { value: val, writable: true });
                        break;

                    case 'icon':
                        Object.defineProperty(cls, '_icon', { value: val, writable: true });
                        break;

                    case 'menu':
                        Component._addMenuItem(cls, val, props.menuPriority);
                        break;

                    case 'disallowMultiple':
                        cls._disallowMultiple = cls;
                        break;

                    case 'requireComponent':
                        // skip here
                        break;

                    case 'help':
                        cls._help = val;
                        break;

                    default:
                        cc.warnID(3602, key, name);
                        break;
                }
            }
        }
    }
});

Object.defineProperties(Component, {
    _callPreloadOnNode: {
        value: _callPreloadOnNode
    },
    _callPreloadOnComponent: {
        value: function (component) {
            if (CC_EDITOR) {
                callPreloadInTryCatch(component);
            }
            else {
                component.__preload();
            }
            component._objFlags |= IsPreloadCalled;
        }
    },
    _callResetOnComponent: {
        value: CC_EDITOR && function (comp) {
            if (typeof comp.resetInEditor === 'function') {
                callResetInTryCatch(comp);
            }
        }
    }
});

Component.prototype.__scriptUuid = '';

cc.Component = module.exports = Component;
