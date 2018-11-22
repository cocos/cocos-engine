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

var js = require("../platform/js");

/**
 * !#en Base class of all kinds of events.
 * !#zh 包含事件相关信息的对象。
 * @class Event
 */

/**
 * @method constructor
 * @param {String} type - The name of the event (case-sensitive), e.g. "click", "fire", or "submit"
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */
cc.Event = function(type, bubbles) {
    /**
     * !#en The name of the event (case-sensitive), e.g. "click", "fire", or "submit".
     * !#zh 事件类型。
     * @property type
     * @type {String}
     */
    this.type = type;

    /**
     * !#en Indicate whether the event bubbles up through the tree or not.
     * !#zh 表示该事件是否进行冒泡。
     * @property bubbles
     * @type {Boolean}
     */
    this.bubbles = !!bubbles;

    /**
     * !#en A reference to the target to which the event was originally dispatched.
     * !#zh 最初事件触发的目标
     * @property target
     * @type {Object}
     */
    this.target = null;

    /**
     * !#en A reference to the currently registered target for the event.
     * !#zh 当前目标
     * @property currentTarget
     * @type {Object}
     */
    this.currentTarget = null;

    /**
     * !#en
     * Indicates which phase of the event flow is currently being evaluated.
     * Returns an integer value represented by 4 constants:
     *  - Event.NONE = 0
     *  - Event.CAPTURING_PHASE = 1
     *  - Event.AT_TARGET = 2
     *  - Event.BUBBLING_PHASE = 3
     * The phases are explained in the [section 3.1, Event dispatch and DOM event flow]
     * (http://www.w3.org/TR/DOM-Level-3-Events/#event-flow), of the DOM Level 3 Events specification.
     * !#zh 事件阶段
     * @property eventPhase
     * @type {Number}
     */
    this.eventPhase = 0;

    /*
     * Indicates whether or not event.stopPropagation() has been called on the event.
     * @property _propagationStopped
     * @type {Boolean}
     * @private
     */
    this._propagationStopped = false;

    /*
     * Indicates whether or not event.stopPropagationImmediate() has been called on the event.
     * @property _propagationImmediateStopped
     * @type {Boolean}
     * @private
     */
    this._propagationImmediateStopped = false;
};
cc.Event.prototype = {
    constructor: cc.Event,

    /**
     * !#en Reset the event for being stored in the object pool.
     * !#zh 重置对象池中存储的事件。
     * @method unuse
     * @returns {String}
     */
    unuse: function () {
        this.type = cc.Event.NO_TYPE;
        this.target = null;
        this.currentTarget = null;
        this.eventPhase = cc.Event.NONE;
        this._propagationStopped = false;
        this._propagationImmediateStopped = false;
    },

    /**
     * !#en Reuse the event for being used again by the object pool.
     * !#zh 用于对象池再次使用的事件。
     * @method reuse
     * @returns {String}
     */
    reuse: function (type, bubbles) {
        this.type = type;
        this.bubbles = bubbles || false;
    },

    /**
     * !#en Stops propagation for current event.
     * !#zh 停止传递当前事件。
     * @method stopPropagation
     */
    stopPropagation: function () {
        this._propagationStopped = true;
    },

    /**
     * !#en Stops propagation for current event immediately,
     * the event won't even be dispatched to the listeners attached in the current target.
     * !#zh 立即停止当前事件的传递，事件甚至不会被分派到所连接的当前目标。
     * @method stopPropagationImmediate
     */
    stopPropagationImmediate: function () {
        this._propagationImmediateStopped = true;
    },

    /**
     * !#en Checks whether the event has been stopped.
     * !#zh 检查该事件是否已经停止传递.
     * @method isStopped
     * @returns {Boolean}
     */
    isStopped: function () {
        return this._propagationStopped || this._propagationImmediateStopped;
    },

    /**
     * !#en
     * <p>
     *     Gets current target of the event                                                            <br/>
     *     note: It only be available when the event listener is associated with node.                <br/>
     *          It returns 0 when the listener is associated with fixed priority.
     * </p>
     * !#zh 获取当前目标节点
     * @method getCurrentTarget
     * @returns {Node}  The target with which the event associates.
     */
    getCurrentTarget: function () {
        return this.currentTarget;
    },

    /**
     * !#en Gets the event type.
     * !#zh 获取事件类型
     * @method getType
     * @returns {String}
     */
    getType: function () {
        return this.type;
    }
};

//event type
/**
 * !#en Code for event without type.
 * !#zh 没有类型的事件
 * @property NO_TYPE
 * @static
 * @type {string}
 */
cc.Event.NO_TYPE = 'no_type';

/**
 * !#en The type code of Touch event.
 * !#zh 触摸事件类型
 * @property TOUCH
 * @static
 * @type {String}
 */
cc.Event.TOUCH = 'touch';
/**
 * !#en The type code of Mouse event.
 * !#zh 鼠标事件类型
 * @property MOUSE
 * @static
 * @type {String}
 */
cc.Event.MOUSE = 'mouse';
/**
 * !#en The type code of Keyboard event.
 * !#zh 键盘事件类型
 * @property KEYBOARD
 * @static
 * @type {String}
 */
cc.Event.KEYBOARD = 'keyboard';
/**
 * !#en The type code of Acceleration event.
 * !#zh 加速器事件类型
 * @property ACCELERATION
 * @static
 * @type {String}
 */
cc.Event.ACCELERATION = 'acceleration';

//event phase
/**
 * !#en Events not currently dispatched are in this phase
 * !#zh 尚未派发事件阶段
 * @property NONE
 * @type {Number}
 * @static
 */
cc.Event.NONE = 0;
/**
 * !#en
 * The capturing phase comprises the journey from the root to the last node before the event target's node
 * see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
 * !#zh 捕获阶段，包括事件目标节点之前从根节点到最后一个节点的过程。
 * @property CAPTURING_PHASE
 * @type {Number}
 * @static
 */
cc.Event.CAPTURING_PHASE = 1;
/**
 * !#en
 * The target phase comprises only the event target node
 * see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
 * !#zh 目标阶段仅包括事件目标节点。
 * @property AT_TARGET
 * @type {Number}
 * @static
 */
cc.Event.AT_TARGET = 2;
/**
 * !#en
 * The bubbling phase comprises any subsequent nodes encountered on the return trip to the root of the hierarchy
 * see http://www.w3.org/TR/DOM-Level-3-Events/#event-flow
 * !#zh 冒泡阶段， 包括回程遇到到层次根节点的任何后续节点。
 * @property BUBBLING_PHASE
 * @type {Number}
 * @static
 */
cc.Event.BUBBLING_PHASE = 3;

/**
 * !#en The Custom event
 * !#zh 自定义事件
 * @class Event.EventCustom
 *
 * @extends Event
 */

/**
 * @method constructor
 * @param {String} type - The name of the event (case-sensitive), e.g. "click", "fire", or "submit"
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */
var EventCustom = function (type, bubbles) {
    cc.Event.call(this, type, bubbles);

    /**
     * !#en A reference to the detailed data of the event
     * !#zh 事件的详细数据
     * @property detail
     * @type {Object}
     */
    this.detail = null;
};

js.extend(EventCustom, cc.Event);

EventCustom.prototype.reset = EventCustom;

/**
 * !#en Sets user data
 * !#zh 设置用户数据
 * @method setUserData
 * @param {*} data
 */
EventCustom.prototype.setUserData = function (data) {
    this.detail = data;
};

/**
 * !#en Gets user data
 * !#zh 获取用户数据
 * @method getUserData
 * @returns {*}
 */
EventCustom.prototype.getUserData = function () {
    return this.detail;
};

/**
 * !#en Gets event name
 * !#zh 获取事件名称
 * @method getEventName
 * @returns {String}
 */
EventCustom.prototype.getEventName = cc.Event.prototype.getType;

var MAX_POOL_SIZE = 10;
var _eventPool = new js.Pool(MAX_POOL_SIZE);
EventCustom.put = function (event) {
    _eventPool.put(event);
};
EventCustom.get = function (type, bubbles) {
    var event = _eventPool._get();
    if (event) {
        event.reset(type, bubbles);
    }
    else {
        event = new EventCustom(type, bubbles);
    }
    return event;
};

cc.Event.EventCustom = EventCustom;

module.exports = cc.Event;
