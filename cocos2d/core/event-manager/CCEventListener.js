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

var js = require('../platform/js');

/**
 * !#en
 * <p>
 *     The base class of event listener.                                                                        <br/>
 *     If you need custom listener which with different callback, you need to inherit this class.               <br/>
 *     For instance, you could refer to EventListenerAcceleration, EventListenerKeyboard,                       <br/>
 *      EventListenerTouchOneByOne, EventListenerCustom.
 * </p>
 *
 * !#zh
 * 封装用户的事件处理逻辑。
 * 注意：这是一个抽象类，开发者不应该直接实例化这个类，请参考 {{#crossLink "EventListener/create:method"}}cc.EventListener.create{{/crossLink}}。
 *
 * @class EventListener
 */

/**
 * Constructor
 * @method constructor
 * @param {Number} type
 * @param {Number} listenerID
 * @param {Number} callback
 */
cc.EventListener = function (type, listenerID, callback) {
    this._onEvent = callback;   // Event callback function
    this._type = type || 0;     // Event listener type
    this._listenerID = listenerID || "";    // Event listener ID
    this._registered = false;   // Whether the listener has been added to dispatcher.

    this._fixedPriority = 0;    // The higher the number, the higher the priority, 0 is for scene graph base priority.
    this._node = null;          // scene graph based priority
    this._target = null;
    this._paused = true;        // Whether the listener is paused
    this._isEnabled = true;     // Whether the listener is enabled
};

cc.EventListener.prototype = {
    constructor: cc.EventListener,
    /*
     * <p>
     *     Sets paused state for the listener
     *     The paused state is only used for scene graph priority listeners.
     *     `EventDispatcher::resumeAllEventListenersForTarget(node)` will set the paused state to `true`,
     *     while `EventDispatcher::pauseAllEventListenersForTarget(node)` will set it to `false`.
     *     @note 1) Fixed priority listeners will never get paused. If a fixed priority doesn't want to receive events,
     *              call `setEnabled(false)` instead.
     *            2) In `Node`'s onEnter and onExit, the `paused state` of the listeners which associated with that node will be automatically updated.
     * </p>
     * @param {Boolean} paused
     * @private
     */
    _setPaused: function (paused) {
        this._paused = paused;
    },

    /*
     * Checks whether the listener is paused.
     * @returns {Boolean}
     * @private
     */
    _isPaused: function () {
        return this._paused;
    },

    /*
     * Marks the listener was registered by EventDispatcher.
     * @param {Boolean} registered
     * @private
     */
    _setRegistered: function (registered) {
        this._registered = registered;
    },

    /*
     * Checks whether the listener was registered by EventDispatcher
     * @returns {Boolean}
     * @private
     */
    _isRegistered: function () {
        return this._registered;
    },

    /*
     * Gets the type of this listener
     * @note It's different from `EventType`, e.g. TouchEvent has two kinds of event listeners - EventListenerOneByOne, EventListenerAllAtOnce
     * @returns {Number}
     * @private
     */
    _getType: function () {
        return this._type;
    },

    /*
     *  Gets the listener ID of this listener
     *  When event is being dispatched, listener ID is used as key for searching listeners according to event type.
     * @returns {String}
     * @private
     */
    _getListenerID: function () {
        return this._listenerID;
    },

    /*
     * Sets the fixed priority for this listener
     *  @note This method is only used for `fixed priority listeners`, it needs to access a non-zero value. 0 is reserved for scene graph priority listeners
     * @param {Number} fixedPriority
     * @private
     */
    _setFixedPriority: function (fixedPriority) {
        this._fixedPriority = fixedPriority;
    },

    /*
     * Gets the fixed priority of this listener
     * @returns {Number} 0 if it's a scene graph priority listener, non-zero for fixed priority listener
     * @private
     */
    _getFixedPriority: function () {
        return this._fixedPriority;
    },

    /*
     * Sets scene graph priority for this listener
     * @param {cc.Node} node
     * @private
     */
    _setSceneGraphPriority: function (node) {
        this._target = node;
        this._node = node;
    },

    /*
     * Gets scene graph priority of this listener
     * @returns {cc.Node} if it's a fixed priority listener, non-null for scene graph priority listener
     * @private
     */
    _getSceneGraphPriority: function () {
        return this._node;
    },

    /**
     * !#en Checks whether the listener is available.
     * !#zh 检测监听器是否有效
     * @method checkAvailable
     * @returns {Boolean}
     */
    checkAvailable: function () {
        return this._onEvent !== null;
    },

    /**
     * !#en Clones the listener, its subclasses have to override this method.
     * !#zh 克隆监听器,它的子类必须重写此方法。
     * @method clone
     * @returns {EventListener}
     */
    clone: function () {
        return null;
    },

    /**
     *  !#en Enables or disables the listener
     *  !#zh 启用或禁用监听器。
     *  @method setEnabled
     *  @param {Boolean} enabled
     *  @note Only listeners with `enabled` state will be able to receive events.
     *          When an listener was initialized, it's enabled by default.
     *          An event listener can receive events when it is enabled and is not paused.
     *          paused state is always false when it is a fixed priority listener.
     */
    setEnabled: function(enabled){
        this._isEnabled = enabled;
    },

    /**
     * !#en Checks whether the listener is enabled
     * !#zh 检查监听器是否可用。
     * @method isEnabled
     * @returns {Boolean}
     */
    isEnabled: function(){
        return this._isEnabled;
    },

    /*
     * <p>Currently JavaScript Bindings (JSB), in some cases, needs to use retain and release. This is a bug in JSB,
     * and the ugly workaround is to use retain/release. So, these 2 methods were added to be compatible with JSB.
     * This is a hack, and should be removed once JSB fixes the retain/release bug<br/>
     * You will need to retain an object if you created a listener and haven't added it any target node during the same frame.<br/>
     * Otherwise, JSB's native autorelease pool will consider this object a useless one and release it directly,<br/>
     * when you want to use it later, a "Invalid Native Object" error will be raised.<br/>
     * The retain function can increase a reference count for the native object to avoid it being released,<br/>
     * you need to manually invoke release function when you think this object is no longer needed, otherwise, there will be memory learks.<br/>
     * retain and release function call should be paired in developer's game code.</p>
     *
     * @method retain
     * @see cc.EventListener#release
     */
    retain:function () {
    },
    /*
     * <p>Currently JavaScript Bindings (JSB), in some cases, needs to use retain and release. This is a bug in JSB,
     * and the ugly workaround is to use retain/release. So, these 2 methods were added to be compatible with JSB.
     * This is a hack, and should be removed once JSB fixes the retain/release bug<br/>
     * You will need to retain an object if you created a listener and haven't added it any target node during the same frame.<br/>
     * Otherwise, JSB's native autorelease pool will consider this object a useless one and release it directly,<br/>
     * when you want to use it later, a "Invalid Native Object" error will be raised.<br/>
     * The retain function can increase a reference count for the native object to avoid it being released,<br/>
     * you need to manually invoke release function when you think this object is no longer needed, otherwise, there will be memory learks.<br/>
     * retain and release function call should be paired in developer's game code.</p>
     *
     * @method release
     * @see cc.EventListener#retain
     */
    release:function () {
    }
};

// event listener type
/**
 * !#en The type code of unknown event listener.
 * !#zh 未知的事件监听器类型
 * @property UNKNOWN
 * @type {Number}
 * @static
 */
cc.EventListener.UNKNOWN = 0;
/*
 * !#en The type code of one by one touch event listener.
 * !#zh 触摸事件监听器类型，触点会一个一个得分开被派发
 * @property TOUCH_ONE_BY_ONE
 * @type {Number}
 * @static
 */
cc.EventListener.TOUCH_ONE_BY_ONE = 1;
/*
 * !#en The type code of all at once touch event listener.
 * !#zh 触摸事件监听器类型，触点会被一次性全部派发
 * @property TOUCH_ALL_AT_ONCE
 * @type {Number}
 * @static
 */
cc.EventListener.TOUCH_ALL_AT_ONCE = 2;
/**
 * !#en The type code of keyboard event listener.
 * !#zh 键盘事件监听器类型
 * @property KEYBOARD
 * @type {Number}
 * @static
 */
cc.EventListener.KEYBOARD = 3;
/*
 * !#en The type code of mouse event listener.
 * !#zh 鼠标事件监听器类型
 * @property MOUSE
 * @type {Number}
 * @static
 */
cc.EventListener.MOUSE = 4;
/**
 * !#en The type code of acceleration event listener.
 * !#zh 加速器事件监听器类型
 * @property ACCELERATION
 * @type {Number}
 * @static
 */
cc.EventListener.ACCELERATION = 6;
/*
 * !#en The type code of custom event listener.
 * !#zh 自定义事件监听器类型
 * @property CUSTOM
 * @type {Number}
 * @static
 */
cc.EventListener.CUSTOM = 8;

var ListenerID = cc.EventListener.ListenerID = {
    MOUSE: '__cc_mouse',
    TOUCH_ONE_BY_ONE: '__cc_touch_one_by_one',
    TOUCH_ALL_AT_ONCE: '__cc_touch_all_at_once',
    KEYBOARD: '__cc_keyboard',
    ACCELERATION: '__cc_acceleration',
};

var Custom = function (listenerId, callback) {
    this._onCustomEvent = callback;
    cc.EventListener.call(this, cc.EventListener.CUSTOM, listenerId, this._callback);
};
js.extend(Custom, cc.EventListener);
js.mixin(Custom.prototype, {
    _onCustomEvent: null,
    
    _callback: function (event) {
        if (this._onCustomEvent !== null)
            this._onCustomEvent(event);
    },

    checkAvailable: function () {
        return (cc.EventListener.prototype.checkAvailable.call(this) && this._onCustomEvent !== null);
    },

    clone: function () {
        return new Custom(this._listenerID, this._onCustomEvent);
    }
});

var Mouse = function () {
    cc.EventListener.call(this, cc.EventListener.MOUSE, ListenerID.MOUSE, this._callback);
};
js.extend(Mouse, cc.EventListener);
js.mixin(Mouse.prototype, {
    onMouseDown: null,
    onMouseUp: null,
    onMouseMove: null,
    onMouseScroll: null,

    _callback: function (event) {
        var eventType = cc.Event.EventMouse;
        switch (event._eventType) {
            case eventType.DOWN:
                if (this.onMouseDown)
                    this.onMouseDown(event);
                break;
            case eventType.UP:
                if (this.onMouseUp)
                    this.onMouseUp(event);
                break;
            case eventType.MOVE:
                if (this.onMouseMove)
                    this.onMouseMove(event);
                break;
            case eventType.SCROLL:
                if (this.onMouseScroll)
                    this.onMouseScroll(event);
                break;
            default:
                break;
        }
    },

    clone: function () {
        var eventListener = new Mouse();
        eventListener.onMouseDown = this.onMouseDown;
        eventListener.onMouseUp = this.onMouseUp;
        eventListener.onMouseMove = this.onMouseMove;
        eventListener.onMouseScroll = this.onMouseScroll;
        return eventListener;
    },

    checkAvailable: function () {
        return true;
    }
});

var TouchOneByOne = function () {
    cc.EventListener.call(this, cc.EventListener.TOUCH_ONE_BY_ONE, ListenerID.TOUCH_ONE_BY_ONE, null);
    this._claimedTouches = [];
};
js.extend(TouchOneByOne, cc.EventListener);
js.mixin(TouchOneByOne.prototype, {
    constructor: TouchOneByOne,
    _claimedTouches: null,
    swallowTouches: false,
    onTouchBegan: null,
    onTouchMoved: null,
    onTouchEnded: null,
    onTouchCancelled: null,

    setSwallowTouches: function (needSwallow) {
        this.swallowTouches = needSwallow;
    },

    isSwallowTouches: function(){
        return this.swallowTouches;
    },

    clone: function () {
        var eventListener = new TouchOneByOne();
        eventListener.onTouchBegan = this.onTouchBegan;
        eventListener.onTouchMoved = this.onTouchMoved;
        eventListener.onTouchEnded = this.onTouchEnded;
        eventListener.onTouchCancelled = this.onTouchCancelled;
        eventListener.swallowTouches = this.swallowTouches;
        return eventListener;
    },

    checkAvailable: function () {
        if(!this.onTouchBegan){
            cc.logID(1801);
            return false;
        }
        return true;
    }
});

var TouchAllAtOnce = function () {
    cc.EventListener.call(this, cc.EventListener.TOUCH_ALL_AT_ONCE, ListenerID.TOUCH_ALL_AT_ONCE, null);
};
js.extend(TouchAllAtOnce, cc.EventListener);
js.mixin(TouchAllAtOnce.prototype, {
    constructor: TouchAllAtOnce,
    onTouchesBegan: null,
    onTouchesMoved: null,
    onTouchesEnded: null,
    onTouchesCancelled: null,

    clone: function(){
        var eventListener = new TouchAllAtOnce();
        eventListener.onTouchesBegan = this.onTouchesBegan;
        eventListener.onTouchesMoved = this.onTouchesMoved;
        eventListener.onTouchesEnded = this.onTouchesEnded;
        eventListener.onTouchesCancelled = this.onTouchesCancelled;
        return eventListener;
    },

    checkAvailable: function(){
        if (this.onTouchesBegan === null && this.onTouchesMoved === null
            && this.onTouchesEnded === null && this.onTouchesCancelled === null) {
            cc.logID(1802);
            return false;
        }
        return true;
    }
});

//Acceleration
var Acceleration = function (callback) {
    this._onAccelerationEvent = callback;
    cc.EventListener.call(this, cc.EventListener.ACCELERATION, ListenerID.ACCELERATION, this._callback);
};
js.extend(Acceleration, cc.EventListener);
js.mixin(Acceleration.prototype, {
    constructor: Acceleration,
    _onAccelerationEvent: null,

    _callback: function (event) {
        this._onAccelerationEvent(event.acc, event);
    },

    checkAvailable: function () {
        cc.assertID(this._onAccelerationEvent, 1803);

        return true;
    },

    clone: function () {
        return new Acceleration(this._onAccelerationEvent);
    }
});


//Keyboard
var Keyboard = function () {
    cc.EventListener.call(this, cc.EventListener.KEYBOARD, ListenerID.KEYBOARD, this._callback);
};
js.extend(Keyboard, cc.EventListener);
js.mixin(Keyboard.prototype, {
    constructor: Keyboard,
    onKeyPressed: null,
    onKeyReleased: null,

    _callback: function (event) {
        if (event.isPressed) {
            if (this.onKeyPressed)
                this.onKeyPressed(event.keyCode, event);
        } else {
            if (this.onKeyReleased)
                this.onKeyReleased(event.keyCode, event);
        }
    },

    clone: function () {
        var eventListener = new Keyboard();
        eventListener.onKeyPressed = this.onKeyPressed;
        eventListener.onKeyReleased = this.onKeyReleased;
        return eventListener;
    },

    checkAvailable: function () {
        if (this.onKeyPressed === null && this.onKeyReleased === null) {
            cc.logID(1800);
            return false;
        }
        return true;
    }
});

/**
 * !#en
 * Create a EventListener object with configuration including the event type, handlers and other parameters.
 * In handlers, this refer to the event listener object itself.
 * You can also pass custom parameters in the configuration object,
 * all custom parameters will be polyfilled into the event listener object and can be accessed in handlers.
 * !#zh 通过指定不同的 Event 对象来设置想要创建的事件监听器。
 * @method create
 * @param {Object} argObj a json object
 * @returns {EventListener}
 * @static
 * @example {@link cocos2d/core/event-manager/CCEventListener/create.js}
 */
cc.EventListener.create = function (argObj) {
    cc.assertID(argObj&&argObj.event, 1900);

    var listenerType = argObj.event;
    delete argObj.event;

    var listener = null;
    if(listenerType === cc.EventListener.TOUCH_ONE_BY_ONE)
        listener = new TouchOneByOne();
    else if(listenerType === cc.EventListener.TOUCH_ALL_AT_ONCE)
        listener = new TouchAllAtOnce();
    else if(listenerType === cc.EventListener.MOUSE)
        listener = new Mouse();
    else if(listenerType === cc.EventListener.CUSTOM){
        listener = new Custom(argObj.eventName, argObj.callback);
        delete argObj.eventName;
        delete argObj.callback;
    } else if(listenerType === cc.EventListener.KEYBOARD)
        listener = new Keyboard();
    else if(listenerType === cc.EventListener.ACCELERATION){
        listener = new Acceleration(argObj.callback);
        delete argObj.callback;
    }

    for(var key in argObj) {
        listener[key] = argObj[key];
    }
    return listener;
};

module.exports = cc.EventListener;