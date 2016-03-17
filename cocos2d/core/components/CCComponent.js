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
var IdGenerater = require('../platform/id-generater');

var Flags = cc.Object.Flags;
var IsOnEnableCalled = Flags.IsOnEnableCalled;
var IsOnLoadStarted = Flags.IsOnLoadStarted;
var IsOnLoadCalled = Flags.IsOnLoadCalled;
var IsOnStartCalled = Flags.IsOnStartCalled;

var ExecInTryCatchTmpl = CC_EDITOR && '(function call_FUNC_InTryCatch(c){try{c._FUNC_()}catch(e){cc._throw(e)}})';
if (CC_TEST) {
    ExecInTryCatchTmpl = '(function call_FUNC_InTryCatch (c) { c._FUNC_() })';
}
var callOnEnableInTryCatch = CC_EDITOR && eval(ExecInTryCatchTmpl.replace(/_FUNC_/g, 'onEnable'));
var callOnDisableInTryCatch = CC_EDITOR && eval(ExecInTryCatchTmpl.replace(/_FUNC_/g, 'onDisable'));
var callOnLoadInTryCatch = CC_EDITOR && eval(ExecInTryCatchTmpl.replace(/_FUNC_/g, 'onLoad'));
var callStartInTryCatch = CC_EDITOR && eval(ExecInTryCatchTmpl.replace(/_FUNC_/g, 'start'));
var callOnDestroyInTryCatch = CC_EDITOR && eval(ExecInTryCatchTmpl.replace(/_FUNC_/g, 'onDestroy'));
var callOnFocusInTryCatch = CC_EDITOR && eval(ExecInTryCatchTmpl.replace(/_FUNC_/g, 'onFocusInEditor'));
var callOnLostFocusInTryCatch = CC_EDITOR && eval(ExecInTryCatchTmpl.replace(/_FUNC_/g, 'onLostFocusInEditor'));

function callOnEnable (self, enable) {
    if (CC_EDITOR) {
        //if (enable ) {
        //    if ( !(self._objFlags & IsEditorOnEnabledCalled) ) {
        //        editorCallback.onComponentEnabled(self);
        //        self._objFlags |= IsEditorOnEnabledCalled;
        //    }
        //}
        //else {
        //    if (self._objFlags & IsEditorOnEnabledCalled) {
        //        editorCallback.onComponentDisabled(self);
        //        self._objFlags &= ~IsEditorOnEnabledCalled;
        //    }
        //}
        if ( !(cc.engine.isPlaying || self.constructor._executeInEditMode) ) {
            return;
        }
    }
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

            cc.director.getScheduler().resumeTarget(self);

            _registerEvent(self, true);

            self._objFlags |= IsOnEnableCalled;
        }
    }
    else {
        if (enableCalled) {
            if (self.onDisable) {
                if (CC_EDITOR) {
                    callOnDisableInTryCatch(self);
                }
                else {
                    self.onDisable();
                }
            }

            cc.director.getScheduler().pauseTarget(self);

            _registerEvent(self, false);

            self._objFlags &= ~IsOnEnableCalled;
        }
    }
}

function _registerEvent (self, on) {
    if (CC_EDITOR && !(self.constructor._executeInEditMode || cc.engine._isPlaying)) return;

    if (on && self.start && !(self._objFlags & IsOnStartCalled)) {
        cc.director.once(cc.Director.EVENT_BEFORE_UPDATE, _callStart, self);
    }

    if (self.update) {
        if (on) cc.director.on(cc.Director.EVENT_COMPONENT_UPDATE, _callUpdate, self);
        else cc.director.off(cc.Director.EVENT_COMPONENT_UPDATE, _callUpdate, self);
    }

    if (self.lateUpdate) {
        if (on) cc.director.on(cc.Director.EVENT_COMPONENT_LATE_UPDATE, _callLateUpdate, self);
        else cc.director.off(cc.Director.EVENT_COMPONENT_LATE_UPDATE, _callLateUpdate, self);
    }
}

var _callStart = CC_EDITOR ? function () {
    callStartInTryCatch(this);
    this._objFlags |= IsOnStartCalled;
} : function () {
    this.start();
    this._objFlags |= IsOnStartCalled;
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

//var createInvoker = function (timerFunc, timerWithKeyFunc, errorInfo) {
//    return function (functionOrMethodName, time) {
//        var ms = (time || 0) * 1000;
//        var self = this;
//        if (typeof functionOrMethodName === "function") {
//            return timerFunc(function () {
//                if (self.isValid) {
//                    functionOrMethodName.call(self);
//                }
//            }, ms);
//        }
//        else {
//            var method = this[functionOrMethodName];
//            if (typeof method === 'function') {
//                var key = this.id + '.' + functionOrMethodName;
//                timerWithKeyFunc(function () {
//                    if (self.isValid) {
//                        method.call(self);
//                    }
//                }, ms, key);
//            }
//            else {
//                cc.error('Can not %s %s.%s because it is not a valid function.', errorInfo, JS.getClassName(this), functionOrMethodName);
//            }
//        }
//    };
//};

var idGenerater = new IdGenerater('Comp');

/**
 * Base class for everything attached to Node(Entity).
 *
 * NOTE: Not allowed to use construction parameters for Component's subclasses,
 *       because Component is created by the engine.
 *
 * @class Component
 * @extends Object
 * @constructor
 */
var Component = cc.Class({
    name: 'cc.Component',
    extends: cc.Object,

    ctor: function () {
        if (CC_EDITOR && !CC_TEST && window._Scene) {
            _Scene.AssetsWatcher.initComponent(this);
        }

        // dont reset _id when destroyed
        Object.defineProperty(this, '_id', {
            value: '',
            enumerable: false
        });

        // Support for Scheduler
        this.__instanceId = cc.ClassManager.getNewInstanceId();
    },

    properties: {
        /**
         * The node this component is attached to. A component is always attached to a node.
         * @property node
         * @type {Node}
         */
        node: {
            default: null,
            visible: false
        },

        name: {
            get: function () {
                return this._name || this.node.name;
                //var className = cc.js.getClassName(this);
                //var index = className.lastIndexOf('.');
                //if (index >= 0) {
                //    // strip prefix
                //    className = className.slice(index + 1);
                //}
                //return this.node.name + '<' + className + '>';
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
         * The uuid for editor
         * @property uuid
         * @type {String}
         * @readOnly
         */
        uuid: {
            get: function () {
                var id = this._id;
                if ( !id ) {
                    id = this._id = idGenerater.getNewId();
                    if (CC_DEV) {
                        cc.engine.attachedObjsForEditor[id] = this;
                    }
                }
                return id;
            },
            visible: false
        },

        __scriptAsset: CC_EDITOR && {
            get: function () {},
            set: function (value) {
                if (this.__scriptUuid !== value) {
                    if (value && Editor.UuidUtils.isUuid(value._uuid)) {
                        var classId = Editor.UuidUtils.compressUuid(value._uuid);
                        var NewComp = cc.js._getClassById(classId);
                        if (cc.isChildClassOf(NewComp, cc.Component)) {
                            cc.warn('Sorry, replacing component script is not yet implemented.');
                            //Editor.sendToWindows('reload:window-scripts', Editor._Sandbox.compiled);
                        }
                        else {
                            cc.error('Can not find a component in the script which uuid is "%s".', value._uuid);
                        }
                    }
                    else {
                        cc.error('Invalid Script');
                    }
                }
            },
            displayName: 'Script',
            type: cc._Script,
            tooltip: 'i18n:INSPECTOR.component.script'
        },

        /**
         * @property _enabled
         * @type {Boolean}
         * @private
         */
        _enabled: true,

        /**
         * indicates whether this component is enabled or not.
         * @property enabled
         * @type {Boolean}
         * @default true
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
         * indicates whether this component is enabled and its node is also active in the hierarchy.
         * @property enabledInHierarchy
         * @type {Boolean}
         * @readOnly
         */
        enabledInHierarchy: {
            get: function () {
                return this._enabled && this.node._activeInHierarchy;
            },
            visible: false
        },

        /**
         * @property _isOnLoadCalled
         * @type {Boolean}
         * @readOnly
         */
        _isOnLoadCalled: {
            get: function () {
                return this._objFlags & IsOnLoadCalled;
            }
        },

        /**
         * Register all related EventTargets,
         * all event callbacks will be removed in _onPreDestroy
         * @property __eventTargets
         * @type {Array}
         * @private
         */
        __eventTargets: {
            default: [],
            serializable: false
        }
    },

    // LIFECYCLE METHODS

    // Fireball provides lifecycle methods that you can specify to hook into this process.
    // We provide Pre methods, which are called right before something happens, and Post methods which are called right after something happens.

    /**
     * Update is called every frame, if the Component is enabled.
     * @method update
     */
    update: null,

    /**
     * LateUpdate is called every frame, if the Component is enabled.
     * @method lateUpdate
     */
    lateUpdate: null,

    /**
     * When attaching to an active node or its node first activated
     * @method onLoad
     */
    onLoad: null,

    /**
     * Called before all scripts' update if the Component is enabled
     * @method start
     */
    start: null,

    /**
     * Called when this component becomes enabled and its node becomes active
     * @method onEnable
     */
    onEnable: null,

    /**
     * Called when this component becomes disabled or its node becomes inactive
     * @method onDisable
     */
    onDisable: null,

    /**
     * Called when this component will be destroyed.
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

    // PUBLIC

    /**
     * Adds a component class to the node. You can also add component to node by passing in the name of the
     * script.
     *
     * @method addComponent
     * @param {Function|String} typeOrTypename - the constructor or the class name of the component to add
     * @return {Component} - the newly added component
     */
    addComponent: function (typeOrTypename) {
        return this.node.addComponent(typeOrTypename);
    },

    /**
     * Returns the component of supplied type if the node has one attached, null if it doesn't. You can also get
     * component in the node by passing in the name of the script.
     *
     * @method getComponent
     * @param {Function|String} typeOrClassName
     * @return {Component}
     */
    getComponent: function (typeOrClassName) {
        return this.node.getComponent(typeOrClassName);
    },

    /**
     * Returns all components of supplied Type in the node.
     *
     * @method getComponents
     * @param {Function|String} typeOrClassName
     * @return {Component[]}
     */
    getComponents: function (typeOrClassName) {
        return this.node.getComponents(typeOrClassName);
    },

    /**
     * Returns the component of supplied type in any of its children using depth first search.
     *
     * @method getComponentInChildren
     * @param {Function|String} typeOrClassName
     * @returns {Component}
     */
    getComponentInChildren: function (typeOrClassName) {
        return this.node.getComponentInChildren(typeOrClassName);
    },

    /**
     * Returns the components of supplied type in any of its children using depth first search.
     *
     * @method getComponentsInChildren
     * @param {Function|String} typeOrClassName
     * @returns {Component[]}
     */
    getComponentsInChildren: function (typeOrClassName) {
        return this.node.getComponentsInChildren(typeOrClassName);
    },

    ///**
    // * Invokes the method on this component after a specified delay.
    // * The method will be invoked even if this component is disabled, but will not invoked if this component is
    // * destroyed.
    // *
    // * @method invoke
    // * @param {function|string} functionOrMethodName
    // * @param {number} [delay=0] - The number of seconds that the function call should be delayed by. If omitted, it defaults to 0. The actual delay may be longer.
    // * @return {number} - Will returns a new InvokeID if the functionOrMethodName is type function. InvokeID is the numerical ID of the invoke, which can be used later with cancelInvoke().
    // * @example {@link examples/Fire/Component/invoke.js }
    // */
    //invoke: createInvoker(Timer.setTimeout, Timer.setTimeoutWithKey, 'invoke'),
    //
    ///**
    // * Invokes the method on this component repeatedly, with a fixed time delay between each call.
    // * The method will be invoked even if this component is disabled, but will not invoked if this component is
    // * destroyed.
    // *
    // * @method repeat
    // * @param {function|string} functionOrMethodName
    // * @param {number} [delay=0] - The number of seconds that the function call should wait before each call to the method. If omitted, it defaults to 0. The actual delay may be longer.
    // * @return {number} - Will returns a new RepeatID if the method is type function. RepeatID is the numerical ID of the repeat, which can be used later with cancelRepeat().
    // * @example {@link examples/Fire/Component/repeat.js}
    // */
    //repeat: createInvoker(Timer.setInterval, Timer.setIntervalWithKey, 'repeat'),
    //
    ///**
    // * Cancels previous invoke calls with methodName or InvokeID on this component.
    // * When using methodName, all calls with the same methodName will be canceled.
    // * InvokeID is the identifier of the invoke action you want to cancel, as returned by invoke().
    // *
    // * @method cancelInvoke
    // * @param {string|number} methodNameOrInvokeId
    // * @example {@link examples/Fire/Component/cancelInvoke.js}
    // */
    //cancelInvoke: function (methodNameOrInvokeId) {
    //    if (typeof methodNameOrInvokeId === 'string') {
    //        var key = this.id + '.' + methodNameOrInvokeId;
    //        Timer.clearTimeoutByKey(key);
    //    }
    //    else {
    //        Timer.clearTimeout(methodNameOrInvokeId);
    //    }
    //},
    //
    ///**
    // * Cancels previous repeat calls with methodName or RepeatID on this component.
    // * When using methodName, all calls with the same methodName will be canceled.
    // * RepeatID is the identifier of the repeat action you want to cancel, as returned by repeat().
    // *
    // * @method cancelRepeat
    // * @param {string|number} methodNameOrRepeatId
    // * @example {@link examples/Fire/Component/cancelRepeat.js}
    // */
    //cancelRepeat: function (methodNameOrRepeatId) {
    //    if (typeof methodNameOrRepeatId === 'string') {
    //        var key = this.id + '.' + methodNameOrRepeatId;
    //        Timer.clearIntervalByKey(key);
    //    }
    //    else {
    //        Timer.clearInterval(methodNameOrRepeatId);
    //    }
    //},
    //
    //isInvoking: function (methodName) {
    //    var key = this.id + '.' + methodName;
    //    return Timer.hasTimeoutKey(key);
    //},

    // VIRTUAL

    /**
     * If the component's bounding box is different from the node's, you can implement this method to supply
     * a custom axis aligned bounding box (AABB), so the editor's scene view can perform hit test properly.
     *
     * @method _getLocalBounds
     * @param {Rect} out_rect - the Rect to receive the bounding box
     */
    _getLocalBounds: null,

    /**
     * onRestore is called after the user clicks the Reset item in the Inspector's context menu or performs
     * an undo operation on this component.
     *
     * If the component contains the "internal state", short for "temporary member variables which not included
     * in its CCClass properties", then you may need to implement this function.
     *
     * The editor will call the getset accessors of your component to record/restore the component's state
     * for undo/redo operation. However, in extreme cases, it may not works well. Then you should implement
     * this function to manually synchronize your component's "internal states" with its public properties.
     * Once you implement this function, all the getset accessors of your component will not be called when
     * the user performs an undo/redo operation. Which means that only the properties with default value
     * will be recorded or restored by editor.
     *
     * Similarly, the editor may failed to reset your component correctly in extreme cases. Then if you need
     * to support the reset menu, you should manually synchronize your component's "internal states" with its
     * properties in this function. Once you implement this function, all the getset accessors of your component
     * will not be called during reset operation. Which means that only the properties with default value
     * will be reset by editor.
     *
     * This function is only called in editor mode.
     *
     * @method onRestore
     */
    onRestore: null,

    // OVERRIDE

    destroy: function () {
        if (CC_EDITOR) {
            var depend = this.node._getDependComponent(this);
            if (depend) {
                return cc.error("Can't remove '%s' because '%s' depends on it.",
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
        if (!(this._objFlags & IsOnLoadStarted) &&
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
            callOnEnable(this, active);
        }
    } : function (active) {
        if (!(this._objFlags & IsOnLoadStarted)) {
            this._objFlags |= IsOnLoadStarted;
            if (this.onLoad) {
                this.onLoad();
            }
            this._objFlags |= IsOnLoadCalled;
        }

        if (this._enabled) {
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

        // Remove all listeners
        cc.eventManager.removeListeners(this);

        // onDestroy
        if (CC_EDITOR) {
            if ( !CC_TEST ) {
                _Scene.AssetsWatcher.stop(this);
            }
            if (cc.engine._isPlaying || this.constructor._executeInEditMode) {
                if (this.onDestroy) {
                    callOnDestroyInTryCatch(this);
                }
            }
        }
        else if (this.onDestroy) {
            this.onDestroy();
        }
        // do remove component
        this.node._removeComponent(this);

        if (CC_DEV) {
            delete cc.engine.attachedObjsForEditor[this._id];
        }
    },

    _instantiate: function () {
        var clone = cc.instantiate._clone(this, this);
        clone.node = null;
        return clone;
    },

// Scheduler

    isRunning: function () {
        return this.enabledInHierarchy;
    },

    /**
     * <p>Schedules a custom selector.         <br/>
     * If the selector is already scheduled, then the interval parameter will be updated without scheduling it again.</p>
     * @method schedule
     * @param {function} callback The callback function
     * @param {Number} [interval=0]  Tick interval in seconds. 0 means tick every frame. If interval = 0, it's recommended to use scheduleUpdate() instead.
     * @param {Number} [repeat=cc.macro.REPEAT_FOREVER]    The selector will be executed (repeat + 1) times, you can use kCCRepeatForever for tick infinitely.
     * @param {Number} [delay=0]     The amount of time that the first tick will wait before execution.
     */
    schedule: function (callback, interval, repeat, delay) {
        cc.assert(callback, cc._LogInfos.Node.schedule);
        cc.assert(interval >= 0, cc._LogInfos.Node.schedule_2);

        interval = interval || 0;
        repeat = isNaN(repeat) ? cc.macro.REPEAT_FOREVER : repeat;
        delay = delay || 0;

        cc.director.getScheduler().schedule(callback, this, interval, repeat, delay, !this.enabledInHierarchy);
    },

    /**
     * Schedules a callback function that runs only once, with a delay of 0 or larger
     * @method scheduleOnce
     * @see cc.Node#schedule
     * @param {function} callback  A function wrapped as a selector
     * @param {Number} [delay=0]  The amount of time that the first tick will wait before execution.
     */
    scheduleOnce: function (callback, delay) {
        this.schedule(callback, 0, 0, delay);
    },

    /**
     * Unschedules a custom callback function.
     * @method unschedule
     * @see cc.Node#schedule
     * @param {function} callback_fn  A function wrapped as a selector
     */
    unschedule: function (callback_fn) {
        if (!callback_fn)
            return;

        cc.director.getScheduler().unschedule(callback_fn, this);
    },

    /**
     * <p>unschedule all scheduled callback functions: custom callback functions, and the 'update' callback function.<br/>
     * Actions are not affected by this method.</p>
     * @method unscheduleAllCallbacks
     */
    unscheduleAllCallbacks: function () {
        cc.director.getScheduler().unscheduleAllForTarget(this);
    },
});

Component._requireComponent = null;

if (CC_DEV) {

    // INHERITABLE STATIC MEMBERS

    Component._executeInEditMode = false;
    Component._playOnFocus = false;
    Component._disallowMultiple = null;
    Component._help = '';

    // NON-INHERITED STATIC MEMBERS

    Object.defineProperty(Component, '_inspector', { value: '', enumerable: false });
    Object.defineProperty(Component, '_icon', { value: '', enumerable: false });

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
        if (CC_DEV) {
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
                                cc.warn('The editor property "playOnFocus" should be used with "executeInEditMode" in class "%s".', name);
                            }
                        }
                        break;

                    case 'inspector':
                        Object.defineProperty(cls, '_inspector', { value: val });
                        break;

                    case 'icon':
                        Object.defineProperty(cls, '_icon', { value: val });
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
                        cc.warn('Unknown editor property "%s" in class "%s".', key, name);
                        break;
                }
            }
        }
    }
});

Component.prototype.__scriptUuid = '';

cc.Component = module.exports = Component;
