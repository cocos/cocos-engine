/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

const BaseNode = require('./utils/base-node');
const PrefabHelper = require('./utils/prefab-helper');
const mathPools = require('./utils/math-pools');
const math = require('./renderer/render-engine').math;
const AffineTrans = require('./utils/affine-transform');
const eventManager = require('./event-manager');
const macro = require('./platform/CCMacro');
const misc = require('./utils/misc');
const js = require('./platform/js');
const Event = require('./event/event');
const EventTarget = require('./event/event-target');
const RenderFlow = require('./renderer/render-flow');

const Flags = cc.Object.Flags;
const Destroying = Flags.Destroying;

const ERR_INVALID_NUMBER = CC_EDITOR && 'The %s is invalid';
const ONE_DEGREE = Math.PI / 180;

var ActionManagerExist = !!cc.ActionManager;
var emptyFunc = function () {};
var _vec2a = cc.v2();
var _vec2b = cc.v2();
var _mat4_temp = math.mat4.create();
var _vec3_temp = math.vec3.create();
var _quat_temp = math.quat.create();
var _globalOrderOfArrival = 1;
var _cachedArray = new Array(16);
_cachedArray.length = 0;

const POSITION_ON = 1 << 0;
const SCALE_ON = 1 << 1;
const ROTATION_ON = 1 << 2;
const SIZE_ON = 1 << 3;
const ANCHOR_ON = 1 << 4;
const COLOR_ON = 1 << 5;


let BuiltinGroupIndex = cc.Enum({
    DEBUG: 31
});

/**
 * !#en Node's local dirty properties flag
 * !#zh Node 的本地属性 dirty 状态位
 * @enum Node._LocalDirtyFlag
 * @static
 * @private
 * @namespace Node
 */
var LocalDirtyFlag = cc.Enum({
    /**
     * !#en Flag for position dirty
     * !#zh 位置 dirty 的标记位
     * @property {Number} POSITION
     * @static
     */
    POSITION: 1 << 0,
    /**
     * !#en Flag for scale dirty
     * !#zh 缩放 dirty 的标记位
     * @property {Number} SCALE
     * @static
     */
    SCALE: 1 << 1,
    /**
     * !#en Flag for rotation dirty
     * !#zh 旋转 dirty 的标记位
     * @property {Number} ROTATION
     * @static
     */
    ROTATION: 1 << 2,
    /**
     * !#en Flag for skew dirty
     * !#zh skew dirty 的标记位
     * @property {Number} SKEW
     * @static
     */
    SKEW: 1 << 3,
    /**
     * !#en Flag for position or rotation dirty
     * !#zh 旋转或位置 dirty 的标记位
     * @property {Number} RT
     * @static
     */
    RT: 1 << 0 | 1 << 1 | 1 << 2,
    /**
     * !#en Flag for all dirty properties
     * !#zh 覆盖所有 dirty 状态的标记位
     * @property {Number} ALL
     * @static
     */
    ALL: 0xffff,
});

/**
 * !#en The event type supported by Node
 * !#zh Node 支持的事件类型
 * @class Node.EventType
 * @static
 * @namespace Node
 */
var EventType = cc.Enum({
    /**
     * !#en The event type for touch start event, you can use its value directly: 'touchstart'
     * !#zh 当手指触摸到屏幕时。
     * @property {String} TOUCH_START
     * @static
     */
    TOUCH_START: 'touchstart',
    /**
     * !#en The event type for touch move event, you can use its value directly: 'touchmove'
     * !#zh 当手指在屏幕上移动时。
     * @property {String} TOUCH_MOVE
     * @static
     */
    TOUCH_MOVE: 'touchmove',
    /**
     * !#en The event type for touch end event, you can use its value directly: 'touchend'
     * !#zh 当手指在目标节点区域内离开屏幕时。
     * @property {String} TOUCH_END
     * @static
     */
    TOUCH_END: 'touchend',
    /**
     * !#en The event type for touch end event, you can use its value directly: 'touchcancel'
     * !#zh 当手指在目标节点区域外离开屏幕时。
     * @property {String} TOUCH_CANCEL
     * @static
     */
    TOUCH_CANCEL: 'touchcancel',

    /**
     * !#en The event type for mouse down events, you can use its value directly: 'mousedown'
     * !#zh 当鼠标按下时触发一次。
     * @property {String} MOUSE_DOWN
     * @static
     */
    MOUSE_DOWN: 'mousedown',
    /**
     * !#en The event type for mouse move events, you can use its value directly: 'mousemove'
     * !#zh 当鼠标在目标节点在目标节点区域中移动时，不论是否按下。
     * @property {String} MOUSE_MOVE
     * @static
     */
    MOUSE_MOVE: 'mousemove',
    /**
     * !#en The event type for mouse enter target events, you can use its value directly: 'mouseenter'
     * !#zh 当鼠标移入目标节点区域时，不论是否按下。
     * @property {String} MOUSE_ENTER
     * @static
     */
    MOUSE_ENTER: 'mouseenter',
    /**
     * !#en The event type for mouse leave target events, you can use its value directly: 'mouseleave'
     * !#zh 当鼠标移出目标节点区域时，不论是否按下。
     * @property {String} MOUSE_LEAVE
     * @static
     */
    MOUSE_LEAVE: 'mouseleave',
    /**
     * !#en The event type for mouse up events, you can use its value directly: 'mouseup'
     * !#zh 当鼠标从按下状态松开时触发一次。
     * @property {String} MOUSE_UP
     * @static
     */
    MOUSE_UP: 'mouseup',
    /**
     * !#en The event type for mouse wheel events, you can use its value directly: 'mousewheel'
     * !#zh 当鼠标滚轮滚动时。
     * @property {String} MOUSE_WHEEL
     * @static
     */
    MOUSE_WHEEL: 'mousewheel',

    /**
     * !#en The event type for position change events.
     * Performance note, this event will be triggered every time corresponding properties being changed,
     * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
     * !#zh 当节点位置改变时触发的事件。
     * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
     * @property {String} POSITION_CHANGED
     * @static
     */
    POSITION_CHANGED: 'position-changed',
    /**
     * !#en The event type for rotation change events.
     * Performance note, this event will be triggered every time corresponding properties being changed,
     * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
     * !#zh 当节点旋转改变时触发的事件。
     * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
     * @property {String} ROTATION_CHANGED
     * @static
     */
    ROTATION_CHANGED: 'rotation-changed',
    /**
     * !#en The event type for scale change events.
     * Performance note, this event will be triggered every time corresponding properties being changed,
     * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
     * !#zh 当节点缩放改变时触发的事件。
     * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
     * @property {String} SCALE_CHANGED
     * @static
     */
    SCALE_CHANGED: 'scale-changed',
    /**
     * !#en The event type for size change events.
     * Performance note, this event will be triggered every time corresponding properties being changed,
     * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
     * !#zh 当节点尺寸改变时触发的事件。
     * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
     * @property {String} SIZE_CHANGED
     * @static
     */
    SIZE_CHANGED: 'size-changed',
    /**
     * !#en The event type for anchor point change events.
     * Performance note, this event will be triggered every time corresponding properties being changed,
     * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
     * !#zh 当节点锚点改变时触发的事件。
     * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
     * @property {String} ANCHOR_CHANGED
     * @static
     */
    ANCHOR_CHANGED: 'anchor-changed',
    /**
    * !#en The event type for color change events.
    * Performance note, this event will be triggered every time corresponding properties being changed,
    * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
    * !#zh 当节点颜色改变时触发的事件。
    * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
    * @property {String} COLOR_CHANGED
    * @static
    */
    COLOR_CHANGED: 'color-changed',
    /**
     * !#en The event type for new child added events.
     * !#zh 当新的子节点被添加时触发的事件。
     * @property {String} CHILD_ADDED
     * @static
     */
    CHILD_ADDED: 'child-added',
    /**
     * !#en The event type for child removed events.
     * !#zh 当子节点被移除时触发的事件。
     * @property {String} CHILD_REMOVED
     * @static
     */
    CHILD_REMOVED: 'child-removed',
    /**
     * !#en The event type for children reorder events.
     * !#zh 当子节点顺序改变时触发的事件。
     * @property {String} CHILD_REORDER
     * @static
     */
    CHILD_REORDER: 'child-reorder',
    /**
     * !#en The event type for node group changed events.
     * !#zh 当节点归属群组发生变化时触发的事件。
     * @property {String} GROUP_CHANGED
     * @static
     */
    GROUP_CHANGED: 'group-changed',
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

var _currentHovered = null;

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
var _touchCancelHandler = function (touch, event) {
    var pos = touch.getLocation();
    var node = this.owner;

    event.type = EventType.TOUCH_CANCEL;
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
};

var _mouseDownHandler = function (event) {
    var pos = event.getLocation();
    var node = this.owner;

    if (node._hitTest(pos, this)) {
        event.type = EventType.MOUSE_DOWN;
        event.bubbles = true;
        node.dispatchEvent(event);
    }
};
var _mouseMoveHandler = function (event) {
    var pos = event.getLocation();
    var node = this.owner;
    var hit = node._hitTest(pos, this);
    if (hit) {
        if (!this._previousIn) {
            // Fix issue when hover node switched, previous hovered node won't get MOUSE_LEAVE notification
            if (_currentHovered && _currentHovered._mouseListener) {
                event.type = EventType.MOUSE_LEAVE;
                _currentHovered.dispatchEvent(event);
                _currentHovered._mouseListener._previousIn = false;
            }
            _currentHovered = this.owner;
            event.type = EventType.MOUSE_ENTER;
            node.dispatchEvent(event);
            this._previousIn = true;
        }
        event.type = EventType.MOUSE_MOVE;
        event.bubbles = true;
        node.dispatchEvent(event);
    }
    else if (this._previousIn) {
        event.type = EventType.MOUSE_LEAVE;
        node.dispatchEvent(event);
        this._previousIn = false;
        _currentHovered = null;
    }
    else {
        // continue dispatching
        return;
    }

    // Event processed, cleanup
    event.stopPropagation();
};
var _mouseUpHandler = function (event) {
    var pos = event.getLocation();
    var node = this.owner;

    if (node._hitTest(pos, this)) {
        event.type = EventType.MOUSE_UP;
        event.bubbles = true;
        node.dispatchEvent(event);
        event.stopPropagation();
    }
};
var _mouseWheelHandler = function (event) {
    var pos = event.getLocation();
    var node = this.owner;

    if (node._hitTest(pos, this)) {
        event.type = EventType.MOUSE_WHEEL;
        event.bubbles = true;
        node.dispatchEvent(event);
        event.stopPropagation();
    }
};

function _searchMaskInParent (node) {
    var Mask = cc.Mask;
    if (Mask) {
        var index = 0;
        for (var curr = node; curr && cc.Node.isNode(curr); curr = curr._parent, ++index) {
            if (curr.getComponent(Mask)) {
                return {
                    index: index,
                    node: curr
                };
            }
        }
    }
    return null;
}

function _checkListeners (node, events) {
    if (!(node._objFlags & Destroying)) {
        var i = 0;
        if (node._bubblingListeners) {
            for (; i < events.length; ++i) {
                if (node._bubblingListeners.hasEventListener(events[i])) {
                    return true;
                }
            }
        }
        if (node._capturingListeners) {
            for (; i < events.length; ++i) {
                if (node._capturingListeners.hasEventListener(events[i])) {
                    return true;
                }
            }
        }
        return false;
    }
    return true;
}

function _doDispatchEvent (owner, event) {
    var target, i;
    event.target = owner;

    // Event.CAPTURING_PHASE
    _cachedArray.length = 0;
    owner._getCapturingTargets(event.type, _cachedArray);
    // capturing
    event.eventPhase = 1;
    for (i = _cachedArray.length - 1; i >= 0; --i) {
        target = _cachedArray[i];
        if (target._capturingListeners) {
            event.currentTarget = target;
            // fire event
            target._capturingListeners.emit(event.type, event, _cachedArray);
            // check if propagation stopped
            if (event._propagationStopped) {
                _cachedArray.length = 0;
                return;
            }
        }
    }
    _cachedArray.length = 0;

    // Event.AT_TARGET
    // checks if destroyed in capturing callbacks
    event.eventPhase = 2;
    event.currentTarget = owner;
    if (owner._capturingListeners) {
        owner._capturingListeners.emit(event.type, event);
    }
    if (!event._propagationImmediateStopped && owner._bubblingListeners) {
        owner._bubblingListeners.emit(event.type, event);
    }

    if (!event._propagationStopped && event.bubbles) {
        // Event.BUBBLING_PHASE
        owner._getBubblingTargets(event.type, _cachedArray);
        // propagate
        event.eventPhase = 3;
        for (i = 0; i < _cachedArray.length; ++i) {
            target = _cachedArray[i];
            if (target._bubblingListeners) {
                event.currentTarget = target;
                // fire event
                target._bubblingListeners.emit(event.type, event);
                // check if propagation stopped
                if (event._propagationStopped) {
                    _cachedArray.length = 0;
                    return;
                }
            }
        }
    }
    _cachedArray.length = 0;
}

/**
 * !#en
 * Class of all entities in Cocos Creator scenes.<br/>
 * For events supported by Node, please refer to {{#crossLink "Node.EventType"}}{{/crossLink}}
 * !#zh
 * Cocos Creator 场景中的所有节点类。<br/>
 * 支持的节点事件，请参阅 {{#crossLink "Node.EventType"}}{{/crossLink}}。
 * @class Node
 * @extends _BaseNode
 */
let NodeDefines = {
    name: 'cc.Node',
    extends: BaseNode,

    properties: {
        // SERIALIZABLE
        _opacity: 255,
        _color: cc.Color.WHITE,
        _contentSize: cc.Size,
        _anchorPoint: cc.v2(0.5, 0.5),
        _position: cc.Vec3,
        _scale: cc.Vec3,
        _quat: cc.Quat,
        _skewX: 0.0,
        _skewY: 0.0,
        _localZOrder: {
            default: 0,
            serializable: false
        },
        _zIndex: 0,

        _is3DNode: false,

        // internal properties

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
            get () {
                return cc.game.groupList[this.groupIndex] || '';
            },

            set (value) {
                this.groupIndex = cc.game.groupList.indexOf(value);
                this.emit(EventType.GROUP_CHANGED, this);
            }
        },

        //properties moved from base node begin

        /**
         * !#en The position (x, y) of the node in its parent's coordinates.
         * !#zh 节点在父节点坐标系中的位置（x, y）。
         * @property {Vec2} position
         * @example
         * cc.log("Node Position: " + node.position);
         */

        /**
         * !#en x axis position of node.
         * !#zh 节点 X 轴坐标。
         * @property x
         * @type {Number}
         * @example
         * node.x = 100;
         * cc.log("Node Position X: " + node.x);
         */
        x: {
            get () {
                return this._position.x;
            },
            set (value) {
                var localPosition = this._position;
                if (value !== localPosition.x) {
                    if (!CC_EDITOR || isFinite(value)) {
                        if (CC_EDITOR) {
                            var oldValue = localPosition.x;
                        }

                        localPosition.x = value;
                        this.setLocalDirty(LocalDirtyFlag.POSITION);
                        this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM;
                        
                        // fast check event
                        if (this._eventMask & POSITION_ON) {
                            // send event
                            if (CC_EDITOR) {
                                this.emit(EventType.POSITION_CHANGED, new cc.Vec3(oldValue, localPosition.y, localPosition.z));
                            }
                            else {
                                this.emit(EventType.POSITION_CHANGED);
                            }
                        }
                    }
                    else {
                        cc.error(ERR_INVALID_NUMBER, 'new x');
                    }
                }
            },
        },

        /**
         * !#en y axis position of node.
         * !#zh 节点 Y 轴坐标。
         * @property y
         * @type {Number}
         * @example
         * node.y = 100;
         * cc.log("Node Position Y: " + node.y);
         */
        y: {
            get () {
                return this._position.y;
            },
            set (value) {
                var localPosition = this._position;
                if (value !== localPosition.y) {
                    if (!CC_EDITOR || isFinite(value)) {
                        if (CC_EDITOR) {
                            var oldValue = localPosition.y;
                        }

                        localPosition.y = value;
                        this.setLocalDirty(LocalDirtyFlag.POSITION);
                        this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM;

                        // fast check event
                        if (this._eventMask & POSITION_ON) {
                            // send event
                            if (CC_EDITOR) {
                                this.emit(EventType.POSITION_CHANGED, new cc.Vec3(localPosition.x, oldValue, localPosition.z));
                            }
                            else {
                                this.emit(EventType.POSITION_CHANGED);
                            }
                        }
                    }
                    else {
                        cc.error(ERR_INVALID_NUMBER, 'new y');
                    }
                }
            },
        },

        /**
         * !#en z axis position of node.
         * !#zh 节点 Z 轴坐标。
         * @property z
         * @type {Number}
         */

        /**
         * !#en Rotation of node.
         * !#zh 该节点旋转角度。
         * @property rotation
         * @type {Number}
         * @deprecated since v2.1
         * @example
         * node.rotation = 90;
         * cc.log("Node Rotation: " + node.rotation);
         */
        rotation: {
            get () {
                return -this.angle;
            },
            set (value) {
                this.angle = -value;
            }
        },

        /**
         * !#en
         * Angle of node, the positive value is anti-clockwise direction.
         * !#zh
         * 该节点的旋转角度，正值为逆时针方向。
         * @property angle
         * @type {Number}
         */
        angle: {
            get () {
                return this._eulerAngles.z;
            },
            set (value) {
                this._eulerAngles.z = value;
                math.quat.fromEuler(this._quat, 0, 0, value);
                this.setLocalDirty(LocalDirtyFlag.ROTATION);
                this._renderFlag |= RenderFlow.FLAG_TRANSFORM;

                if (this._eventMask & ROTATION_ON) {
                    this.emit(EventType.ROTATION_CHANGED);
                }
            }
        },

        /**
         * !#en The rotation as Euler angles in degrees, used in 2.5D project.
         * !#zh 该节点的欧拉角度，用于 2.5D 项目。
         * @property eulerAngles
         * @type {Vec3}
         */

        /**
         * !#en Rotation on x axis.
         * !#zh 该节点 X 轴旋转角度。
         * @property rotationX
         * @type {Number}
         * @example
         * @deprecated since v2.1
         * node.rotationX = 45;
         * cc.log("Node Rotation X: " + node.rotationX);
         */
        rotationX: {
            get () {
                return this._eulerAngles.x;
            },
            set (value) {
                if (this._eulerAngles.x !== value) {
                    this._eulerAngles.x = value;
                    // Update quaternion from rotation
                    if (this._eulerAngles.x === this._eulerAngles.y) {
                        math.quat.fromEuler(this._quat, 0, 0, -value);
                    }
                    else {
                        math.quat.fromEuler(this._quat, value, this._eulerAngles.y, 0);
                    }
                    this.setLocalDirty(LocalDirtyFlag.ROTATION);
                    this._renderFlag |= RenderFlow.FLAG_TRANSFORM;

                    if (this._eventMask & ROTATION_ON) {
                        this.emit(EventType.ROTATION_CHANGED);
                    }
                }
            },
        },

        /**
         * !#en Rotation on y axis.
         * !#zh 该节点 Y 轴旋转角度。
         * @property rotationY
         * @type {Number}
         * @example
         * @deprecated since v2.1
         * node.rotationY = 45;
         * cc.log("Node Rotation Y: " + node.rotationY);
         */
        rotationY: {
            get () {
                return this._eulerAngles.y;
            },
            set (value) {
                if (this._eulerAngles.y !== value) {
                    this._eulerAngles.y = value;
                    // Update quaternion from rotation
                    if (this._eulerAngles.x === this._eulerAngles.y) {
                        math.quat.fromEuler(this._quat, 0, 0, -value);
                    }
                    else {
                        math.quat.fromEuler(this._quat, this._eulerAngles.x, value, 0);
                    }
                    this.setLocalDirty(LocalDirtyFlag.ROTATION);
                    this._renderFlag |= RenderFlow.FLAG_TRANSFORM;

                    if (this._eventMask & ROTATION_ON) {
                        this.emit(EventType.ROTATION_CHANGED);
                    }
                }
            },
        },

        /**
         * !#en The local scale relative to the parent.
         * !#zh 节点相对父节点的缩放。
         * @property scale
         * @type {Number}
         * @example
         * node.scale = 1;
         */
        scale: {
            get () {
                return this._scale.x;
            },
            set (v) {
                this.setScale(v);
            }
        },

        /**
         * !#en Scale on x axis.
         * !#zh 节点 X 轴缩放。
         * @property scaleX
         * @type {Number}
         * @example
         * node.scaleX = 0.5;
         * cc.log("Node Scale X: " + node.scaleX);
         */
        scaleX: {
            get () {
                return this._scale.x;
            },
            set (value) {
                if (this._scale.x !== value) {
                    this._scale.x = value;
                    this.setLocalDirty(LocalDirtyFlag.SCALE);
                    this._renderFlag |= RenderFlow.FLAG_TRANSFORM;

                    if (this._eventMask & SCALE_ON) {
                        this.emit(EventType.SCALE_CHANGED);
                    }
                }
            },
        },

        /**
         * !#en Scale on y axis.
         * !#zh 节点 Y 轴缩放。
         * @property scaleY
         * @type {Number}
         * @example
         * node.scaleY = 0.5;
         * cc.log("Node Scale Y: " + node.scaleY);
         */
        scaleY: {
            get () {
                return this._scale.y;
            },
            set (value) {
                if (this._scale.y !== value) {
                    this._scale.y = value;
                    this.setLocalDirty(LocalDirtyFlag.SCALE);
                    this._renderFlag |= RenderFlow.FLAG_TRANSFORM;

                    if (this._eventMask & SCALE_ON) {
                        this.emit(EventType.SCALE_CHANGED);
                    }
                }
            },
        },

        /**
         * !#en Scale on z axis.
         * !#zh 节点 Z 轴缩放。
         * @property scaleZ
         * @type {Number}
         */

        /**
         * !#en Skew x
         * !#zh 该节点 X 轴倾斜角度。
         * @property skewX
         * @type {Number}
         * @example
         * node.skewX = 0;
         * cc.log("Node SkewX: " + node.skewX);
         */
        skewX: {
            get () {
                return this._skewX;
            },
            set (value) {
                this._skewX = value;
                this.setLocalDirty(LocalDirtyFlag.SKEW);
                this._renderFlag |= RenderFlow.FLAG_TRANSFORM;
            }
        },

        /**
         * !#en Skew y
         * !#zh 该节点 Y 轴倾斜角度。
         * @property skewY
         * @type {Number}
         * @example
         * node.skewY = 0;
         * cc.log("Node SkewY: " + node.skewY);
         */
        skewY: {
            get () {
                return this._skewY;
            },
            set (value) {
                this._skewY = value;
                this.setLocalDirty(LocalDirtyFlag.SKEW);
                this._renderFlag |= RenderFlow.FLAG_TRANSFORM;
            }
        },

        /**
         * !#en Opacity of node, default value is 255.
         * !#zh 节点透明度，默认值为 255。
         * @property opacity
         * @type {Number}
         * @example
         * node.opacity = 255;
         */
        opacity: {
            get () {
                return this._opacity;
            },
            set (value) {
                if (this._opacity !== value) {
                    this._opacity = value;
                    this._renderFlag |= RenderFlow.FLAG_OPACITY | RenderFlow.FLAG_COLOR;
                }
            },
            range: [0, 255]
        },

        /**
         * !#en Color of node, default value is white: (255, 255, 255).
         * !#zh 节点颜色。默认为白色，数值为：（255，255，255）。
         * @property color
         * @type {Color}
         * @example
         * node.color = new cc.Color(255, 255, 255);
         */
        color: {
            get () {
                return this._color.clone()
            },
            set (value) {
                if (!this._color.equals(value)) {
                    this._color.set(value);
                    if (CC_DEV && value.a !== 255) {
                        cc.warnID(1626);
                    }
                    
                    if (this._renderComponent) {
                        this._renderFlag |= RenderFlow.FLAG_COLOR;
                    }

                    if (this._eventMask & COLOR_ON) {
                        this.emit(EventType.COLOR_CHANGED, value);
                    }
                }
            },
        },

        /**
         * !#en Anchor point's position on x axis.
         * !#zh 节点 X 轴锚点位置。
         * @property anchorX
         * @type {Number}
         * @example
         * node.anchorX = 0;
         */
        anchorX: {
            get () {
                return this._anchorPoint.x;
            },
            set (value) {
                var anchorPoint = this._anchorPoint;
                if (anchorPoint.x !== value) {
                    anchorPoint.x = value;
                    if (this._eventMask & ANCHOR_ON) {
                        this.emit(EventType.ANCHOR_CHANGED);
                    }
                }
            },
        },

        /**
         * !#en Anchor point's position on y axis.
         * !#zh 节点 Y 轴锚点位置。
         * @property anchorY
         * @type {Number}
         * @example
         * node.anchorY = 0;
         */
        anchorY: {
            get () {
                return this._anchorPoint.y;
            },
            set (value) {
                var anchorPoint = this._anchorPoint;
                if (anchorPoint.y !== value) {
                    anchorPoint.y = value;
                    if (this._eventMask & ANCHOR_ON) {
                        this.emit(EventType.ANCHOR_CHANGED);
                    }
                }
            },
        },

        /**
         * !#en Width of node.
         * !#zh 节点宽度。
         * @property width
         * @type {Number}
         * @example
         * node.width = 100;
         */
        width: {
            get () {
                return this._contentSize.width;
            },
            set (value) {
                if (value !== this._contentSize.width) {
                    if (CC_EDITOR) {
                        var clone = cc.size(this._contentSize.width, this._contentSize.height);
                    }
                    this._contentSize.width = value;
                    if (this._eventMask & SIZE_ON) {
                        if (CC_EDITOR) {
                            this.emit(EventType.SIZE_CHANGED, clone);
                        }
                        else {
                            this.emit(EventType.SIZE_CHANGED);
                        }
                    }
                }
            },
        },

        /**
         * !#en Height of node.
         * !#zh 节点高度。
         * @property height
         * @type {Number}
         * @example
         * node.height = 100;
         */
        height: {
            get () {
                return this._contentSize.height;
            },
            set (value) {
                if (value !== this._contentSize.height) {
                    if (CC_EDITOR) {
                        var clone = cc.size(this._contentSize.width, this._contentSize.height);
                    }
                    this._contentSize.height = value;
                    if (this._eventMask & SIZE_ON) {
                        if (CC_EDITOR) {
                            this.emit(EventType.SIZE_CHANGED, clone);
                        }
                        else {
                            this.emit(EventType.SIZE_CHANGED);
                        }
                    }
                }
            },
        },

        /**
         * !#en zIndex is the 'key' used to sort the node relative to its siblings.<br/>
         * The value of zIndex should be in the range between cc.macro.MIN_ZINDEX and cc.macro.MAX_ZINDEX.<br/>
         * The Node's parent will sort all its children based on the zIndex value and the arrival order.<br/>
         * Nodes with greater zIndex will be sorted after nodes with smaller zIndex.<br/>
         * If two nodes have the same zIndex, then the node that was added first to the children's array will be in front of the other node in the array.<br/>
         * Node's order in children list will affect its rendering order. Parent is always rendering before all children.
         * !#zh zIndex 是用来对节点进行排序的关键属性，它决定一个节点在兄弟节点之间的位置。<br/>
         * zIndex 的取值应该介于 cc.macro.MIN_ZINDEX 和 cc.macro.MAX_ZINDEX 之间
         * 父节点主要根据节点的 zIndex 和添加次序来排序，拥有更高 zIndex 的节点将被排在后面，如果两个节点的 zIndex 一致，先添加的节点会稳定排在另一个节点之前。<br/>
         * 节点在 children 中的顺序决定了其渲染顺序。父节点永远在所有子节点之前被渲染
         * @property zIndex
         * @type {Number}
         * @example
         * node.zIndex = 1;
         * cc.log("Node zIndex: " + node.zIndex);
         */
        zIndex: {
            get () {
                return this._zIndex;
            },
            set (value) {
                if (value > macro.MAX_ZINDEX) {
                    cc.warnID(1636);
                    value = macro.MAX_ZINDEX;
                }
                else if (value < macro.MIN_ZINDEX) {
                    cc.warnID(1637);
                    value = macro.MIN_ZINDEX;
                }

                if (this._zIndex !== value) {
                    this._zIndex = value;
                    this._localZOrder = (this._localZOrder & 0x0000ffff) | (value << 16);

                    if (this._parent) {
                        this._parent._delaySort();
                    }
                }
            }
        },
    },

    /**
     * @method constructor
     * @param {String} [name]
     */
    ctor () {
        this._reorderChildDirty = false;
        
        // cache component
        this._widget = null;
        // fast render component access
        this._renderComponent = null;
        // Event listeners
        this._capturingListeners = null;
        this._bubblingListeners = null;
        // Touch event listener
        this._touchListener = null;
        // Mouse event listener
        this._mouseListener = null;

        // default scale
        this._scale.x = 1;
        this._scale.y = 1;
        this._scale.z = 1;

        this._matrix = mathPools.mat4.get();
        this._worldMatrix = mathPools.mat4.get();
        this._localMatDirty = LocalDirtyFlag.ALL;
        this._worldMatDirty = true;

        this._eventMask = 0;
        this._cullingMask = 1 << this.groupIndex;

        this._eulerAngles = cc.v3();
    },

    statics: {
        EventType,
        _LocalDirtyFlag: LocalDirtyFlag,
        // is node but not scene
        isNode (obj) {
            return obj instanceof Node && (obj.constructor === Node || !(obj instanceof cc.Scene));
        },

        BuiltinGroupIndex
    },

    // OVERRIDES

    _onSiblingIndexChanged (index) {
        // update rendering scene graph, sort them by arrivalOrder
        var parent = this._parent;
        var siblings = parent._children;
        var i = 0, len = siblings.length, sibling;
        for (; i < len; i++) {
            sibling = siblings[i];
            sibling._updateOrderOfArrival();
            eventManager._setDirtyForNode(sibling);
        }
        parent._delaySort();
    },

    _onPreDestroy () {
        var destroyByParent = this._onPreDestroyBase();

        // Actions
        if (ActionManagerExist) {
            cc.director.getActionManager().removeAllActionsFromTarget(this);
        }

        // Remove Node.currentHovered
        if (_currentHovered === this) {
            _currentHovered = null;
        }

        // Remove all event listeners if necessary
        if (this._touchListener || this._mouseListener) {
            eventManager.removeListeners(this);
            if (this._touchListener) {
                this._touchListener.owner = null;
                this._touchListener.mask = null;
                this._touchListener = null;
            }
            if (this._mouseListener) {
                this._mouseListener.owner = null;
                this._mouseListener.mask = null;
                this._mouseListener = null;
            }
        }

        // Recycle math objects
        mathPools.mat4.put(this._matrix);
        mathPools.mat4.put(this._worldMatrix);
        this._matrix = this._worldMatrix = null;

        if (this._reorderChildDirty) {
            cc.director.__fastOff(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
        }

        if (!destroyByParent) {
            // simulate some destruct logic to make undo system work correctly
            if (CC_EDITOR) {
                // ensure this node can reattach to scene by undo system
                this._parent = null;
            }
        }
    },

    _onPostActivated (active) {
        var actionManager = ActionManagerExist ? cc.director.getActionManager() : null;
        if (active) {
            // Refresh transform
            this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM;
            // ActionManager & EventManager
            actionManager && actionManager.resumeTarget(this);
            eventManager.resumeTarget(this);
            if (this._touchListener) {
                var mask = this._touchListener.mask = _searchMaskInParent(this);
                if (this._mouseListener) {
                    this._mouseListener.mask = mask;
                }
            }
            else if (this._mouseListener) {
                this._mouseListener.mask = _searchMaskInParent(this);
            }
        }
        else {
            // deactivate
            actionManager && actionManager.pauseTarget(this);
            eventManager.pauseTarget(this);
        }
    },

    _onHierarchyChanged (oldParent) {
        this._updateOrderOfArrival();
        if (this._parent) {
            this._parent._delaySort();
        }
        this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM;
        this._onHierarchyChangedBase(oldParent);
        if (cc._widgetManager) {
            cc._widgetManager._nodesOrderDirty = true;
        }
    },

    // INTERNAL

    _upgrade_1x_to_2x () {
        // Upgrade scaleX, scaleY from v1.x
        // TODO: remove in future version, 3.0 ?
        if (this._scaleX !== undefined) {
            this._scale.x = this._scaleX;
            this._scaleX = undefined;
        }
        if (this._scaleY !== undefined) {
            this._scale.y = this._scaleY;
            this._scaleY = undefined;
        }

        if (this._localZOrder !== 0) {
            this._zIndex = (this._localZOrder & 0xffff0000) >> 16;
        }

        // TODO: remove _rotationX & _rotationY in future version, 3.0 ?
        // Update quaternion from rotation, when upgrade from 1.x to 2.0
        // If rotation x & y is 0 in old version, then update rotation from default quaternion is ok too
        let quat = this._quat;
        if ((this._rotationX || this._rotationY) && 
            (quat.x === 0 && quat.y === 0 && quat.z === 0 && quat.w === 1)) {
            if (this._rotationX === this._rotationY) {
                math.quat.fromEuler(quat, 0, 0, -this._rotationX);
            }
            else {
                math.quat.fromEuler(quat, this._rotationX, this._rotationY, 0);
            }
            this._rotationX = this._rotationY = undefined;
        }
        
        this._quat.getEulerAngles(this._eulerAngles);

        // Upgrade from 2.0.0 preview 4 & earlier versions
        // TODO: Remove after final version
        if (this._color.a < 255 && this._opacity === 255) {
            this._opacity = this._color.a;
            this._color.a = 255;
        }
    },

    /*
     * The initializer for Node which will be called before all components onLoad
     */
    _onBatchCreated () {
        this._upgrade_1x_to_2x();

        this._updateOrderOfArrival();

        let prefabInfo = this._prefab;
        if (prefabInfo && prefabInfo.sync && prefabInfo.root === this) {
            if (CC_DEV) {
                // TODO - remove all usage of _synced
                cc.assert(!prefabInfo._synced, 'prefab should not synced');
            }
            PrefabHelper.syncWithPrefab(this);
        }

        if (!this._activeInHierarchy) {
            // deactivate ActionManager and EventManager by default
            if (ActionManagerExist) {
                cc.director.getActionManager().pauseTarget(this);
            }
            eventManager.pauseTarget(this);
        }

        let children = this._children;
        for (let i = 0, len = children.length; i < len; i++) {
            children[i]._onBatchCreated();
        }

        if (children.length > 0) {
            this._renderFlag |= RenderFlow.FLAG_CHILDREN;
        }
    },

    // the same as _onBatchCreated but untouch prefab
    _onBatchRestored () {
        this._upgrade_1x_to_2x();

        if (!this._activeInHierarchy) {
            // deactivate ActionManager and EventManager by default

            // ActionManager may not be inited in the editor worker.
            let manager = cc.director.getActionManager();
            manager && manager.pauseTarget(this);

            eventManager.pauseTarget(this);
        }

        var children = this._children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i]._onBatchRestored();
        }

        if (children.length > 0) {
            this._renderFlag |= RenderFlow.FLAG_CHILDREN;
        }
    },

    // EVENT TARGET

    _checknSetupSysEvent (type) {
        let newAdded = false;
        let forDispatch = false;
        if (_touchEvents.indexOf(type) !== -1) {
            if (!this._touchListener) {
                this._touchListener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    owner: this,
                    mask: _searchMaskInParent(this),
                    onTouchBegan: _touchStartHandler,
                    onTouchMoved: _touchMoveHandler,
                    onTouchEnded: _touchEndHandler,
                    onTouchCancelled: _touchCancelHandler
                });
                eventManager.addListener(this._touchListener, this);
                newAdded = true;
            }
            forDispatch = true;
        }
        else if (_mouseEvents.indexOf(type) !== -1) {
            if (!this._mouseListener) {
                this._mouseListener = cc.EventListener.create({
                    event: cc.EventListener.MOUSE,
                    _previousIn: false,
                    owner: this,
                    mask: _searchMaskInParent(this),
                    onMouseDown: _mouseDownHandler,
                    onMouseMove: _mouseMoveHandler,
                    onMouseUp: _mouseUpHandler,
                    onMouseScroll: _mouseWheelHandler,
                });
                eventManager.addListener(this._mouseListener, this);
                newAdded = true;
            }
            forDispatch = true;
        }
        if (newAdded && !this._activeInHierarchy) {
            cc.director.getScheduler().schedule(function () {
                if (!this._activeInHierarchy) {
                    eventManager.pauseTarget(this);
                }
            }, this, 0, 0, 0, false);
        }
        return forDispatch;
    },

    /**
     * !#en
     * Register a callback of a specific event type on Node.<br/>
     * Use this method to register touch or mouse event permit propagation based on scene graph,<br/>
     * These kinds of event are triggered with dispatchEvent, the dispatch process has three steps:<br/>
     * 1. Capturing phase: dispatch in capture targets (`_getCapturingTargets`), e.g. parents in node tree, from root to the real target<br/>
     * 2. At target phase: dispatch to the listeners of the real target<br/>
     * 3. Bubbling phase: dispatch in bubble targets (`_getBubblingTargets`), e.g. parents in node tree, from the real target to root<br/>
     * In any moment of the dispatching process, it can be stopped via `event.stopPropagation()` or `event.stopPropagationImmidiate()`.<br/>
     * It's the recommended way to register touch/mouse event for Node,<br/>
     * please do not use cc.eventManager directly for Node.<br/>
     * You can also register custom event and use `emit` to trigger custom event on Node.<br/>
     * For such events, there won't be capturing and bubbling phase, your event will be dispatched directly to its listeners registered on the same node.<br/>
     * You can also pass event callback parameters with `emit` by passing parameters after `type`.
     * !#zh
     * 在节点上注册指定类型的回调函数，也可以设置 target 用于绑定响应函数的 this 对象。<br/>
     * 鼠标或触摸事件会被系统调用 dispatchEvent 方法触发，触发的过程包含三个阶段：<br/>
     * 1. 捕获阶段：派发事件给捕获目标（通过 `_getCapturingTargets` 获取），比如，节点树中注册了捕获阶段的父节点，从根节点开始派发直到目标节点。<br/>
     * 2. 目标阶段：派发给目标节点的监听器。<br/>
     * 3. 冒泡阶段：派发事件给冒泡目标（通过 `_getBubblingTargets` 获取），比如，节点树中注册了冒泡阶段的父节点，从目标节点开始派发知道根节点。<br/>
     * 同时您可以将事件派发到父节点或者通过调用 stopPropagation 拦截它。<br/>
     * 推荐使用这种方式来监听节点上的触摸或鼠标事件，请不要在节点上直接使用 cc.eventManager。<br/>
     * 你也可以注册自定义事件到节点上，并通过 emit 方法触发此类事件，对于这类事件，不会发生捕获冒泡阶段，只会直接派发给注册在该节点上的监听器<br/>
     * 你可以通过在 emit 方法调用时在 type 之后传递额外的参数作为事件回调的参数列表
     * @method on
     * @param {String|Node.EventType} type - A string representing the event type to listen for.<br>See {{#crossLink "Node/EventTyupe/POSITION_CHANGED"}}Node Events{{/crossLink}} for all builtin events.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched. The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {Event|any} [callback.event] event or first argument when emit
     * @param {any} [callback.arg2] arg2
     * @param {any} [callback.arg3] arg3
     * @param {any} [callback.arg4] arg4
     * @param {any} [callback.arg5] arg5
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null
     * @param {Boolean} [useCapture=false] - When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit, otherwise it will be triggered during bubbling phase.
     * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
     * @typescript
     * on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
     * @example
     * this.node.on(cc.Node.EventType.TOUCH_START, this.memberFunction, this);  // if "this" is component and the "memberFunction" declared in CCClass.
     * node.on(cc.Node.EventType.TOUCH_START, callback, this);
     * node.on(cc.Node.EventType.TOUCH_MOVE, callback, this);
     * node.on(cc.Node.EventType.TOUCH_END, callback, this);
     * node.on(cc.Node.EventType.TOUCH_CANCEL, callback, this);
     * node.on(cc.Node.EventType.ANCHOR_CHANGED, callback);
     * node.on(cc.Node.EventType.COLOR_CHANGED, callback);
     */
    on (type, callback, target, useCapture) {
        let forDispatch = this._checknSetupSysEvent(type);
        if (forDispatch) {
            return this._onDispatch(type, callback, target, useCapture);
        }
        else {
            switch (type) {
                case EventType.POSITION_CHANGED:
                this._eventMask |= POSITION_ON;
                break;
                case EventType.SCALE_CHANGED:
                this._eventMask |= SCALE_ON;
                break;
                case EventType.ROTATION_CHANGED:
                this._eventMask |= ROTATION_ON;
                break;
                case EventType.SIZE_CHANGED:
                this._eventMask |= SIZE_ON;
                break;
                case EventType.ANCHOR_CHANGED:
                this._eventMask |= ANCHOR_ON;
                break;
                case EventType.COLOR_CHANGED:
                this._eventMask |= COLOR_ON;
                break;
            }
            if (!this._bubblingListeners) {
                this._bubblingListeners = new EventTarget();
            }
            return this._bubblingListeners.on(type, callback, target);
        }
    },

    /**
     * !#en
     * Register an callback of a specific event type on the Node,
     * the callback will remove itself after the first time it is triggered.
     * !#zh
     * 注册节点的特定事件类型回调，回调会在第一时间被触发后删除自身。
     *
     * @method once
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {Event|any} [callback.event] event or first argument when emit
     * @param {any} [callback.arg2] arg2
     * @param {any} [callback.arg3] arg3
     * @param {any} [callback.arg4] arg4
     * @param {any} [callback.arg5] arg5
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null
     * @typescript
     * once<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
     * @example
     * node.once(cc.Node.EventType.ANCHOR_CHANGED, callback);
     */
    once (type, callback, target, useCapture) {
        let forDispatch = this._checknSetupSysEvent(type);
        let eventType_hasOnceListener = '__ONCE_FLAG:' + type;

        let listeners = null;
        if (forDispatch && useCapture) {
            listeners = this._capturingListeners = this._capturingListeners || new EventTarget();
        }
        else {
            listeners = this._bubblingListeners = this._bubblingListeners || new EventTarget();
        }

        let hasOnceListener = listeners.hasEventListener(eventType_hasOnceListener, callback, target);
        if (!hasOnceListener) {
            let self = this;
            let onceWrapper = function (arg1, arg2, arg3, arg4, arg5) {
                self.off(type, onceWrapper, target);
                listeners.remove(eventType_hasOnceListener, callback, target);
                callback.call(this, arg1, arg2, arg3, arg4, arg5);
            };
            this.on(type, onceWrapper, target);
            listeners.add(eventType_hasOnceListener, callback, target);
        }
    },

    _onDispatch (type, callback, target, useCapture) {
        // Accept also patameters like: (type, callback, useCapture)
        if (typeof target === 'boolean') {
            useCapture = target;
            target = undefined;
        }
        else useCapture = !!useCapture;
        if (!callback) {
            cc.errorID(6800);
            return;
        }

        var listeners = null;
        if (useCapture) {
            listeners = this._capturingListeners = this._capturingListeners || new EventTarget();
        }
        else {
            listeners = this._bubblingListeners = this._bubblingListeners || new EventTarget();
        }

        if ( !listeners.hasEventListener(type, callback, target) ) {
            listeners.add(type, callback, target);

            if (target && target.__eventTargets)
                target.__eventTargets.push(this);
        }

        return callback;
    },

    /**
     * !#en
     * Removes the callback previously registered with the same type, callback, target and or useCapture.
     * This method is merely an alias to removeEventListener.
     * !#zh 删除之前与同类型，回调，目标或 useCapture 注册的回调。
     * @method off
     * @param {String} type - A string representing the event type being removed.
     * @param {Function} [callback] - The callback to remove.
     * @param {Object} [target] - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
     * @param {Boolean} [useCapture=false] - When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit, otherwise it will be triggered during bubbling phase.
     * @example
     * this.node.off(cc.Node.EventType.TOUCH_START, this.memberFunction, this);
     * node.off(cc.Node.EventType.TOUCH_START, callback, this.node);
     * node.off(cc.Node.EventType.ANCHOR_CHANGED, callback, this);
     */
    off (type, callback, target, useCapture) {
        let touchEvent = _touchEvents.indexOf(type) !== -1;
        let mouseEvent = !touchEvent && _mouseEvents.indexOf(type) !== -1;
        if (touchEvent || mouseEvent) {
            this._offDispatch(type, callback, target, useCapture);

            if (touchEvent) {
                if (this._touchListener && !_checkListeners(this, _touchEvents)) {
                    eventManager.removeListener(this._touchListener);
                    this._touchListener = null;
                }
            }
            else if (mouseEvent) {
                if (this._mouseListener && !_checkListeners(this, _mouseEvents)) {
                    eventManager.removeListener(this._mouseListener);
                    this._mouseListener = null;
                }
            }
        }
        else if (this._bubblingListeners) {
            this._bubblingListeners.off(type, callback, target);

            var hasListeners = this._bubblingListeners.hasEventListener(type);
            // All listener removed
            if (!hasListeners) {
                switch (type) {
                    case EventType.POSITION_CHANGED:
                    this._eventMask &= ~POSITION_ON;
                    break;
                    case EventType.SCALE_CHANGED:
                    this._eventMask &= ~SCALE_ON;
                    break;
                    case EventType.ROTATION_CHANGED:
                    this._eventMask &= ~ROTATION_ON;
                    break;
                    case EventType.SIZE_CHANGED:
                    this._eventMask &= ~SIZE_ON;
                    break;
                    case EventType.ANCHOR_CHANGED:
                    this._eventMask &= ~ANCHOR_ON;
                    break;
                    case EventType.COLOR_CHANGED:
                    this._eventMask &= ~COLOR_ON;
                    break;
                }
            }
        }
    },

    _offDispatch (type, callback, target, useCapture) {
        // Accept also patameters like: (type, callback, useCapture)
        if (typeof target === 'boolean') {
            useCapture = target;
            target = undefined;
        }
        else useCapture = !!useCapture;
        if (!callback) {
            this._capturingListeners && this._capturingListeners.removeAll(type);
            this._bubblingListeners && this._bubblingListeners.removeAll(type);
        }
        else {
            var listeners = useCapture ? this._capturingListeners : this._bubblingListeners;
            if (listeners) {
                listeners.remove(type, callback, target);
    
                if (target && target.__eventTargets) {
                    js.array.fastRemove(target.__eventTargets, this);
                }
            }
            
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
    targetOff (target) {
        let listeners = this._bubblingListeners;
        if (listeners) {
            listeners.targetOff(target);

            // Check for event mask reset
            if ((this._eventMask & POSITION_ON) && !listeners.hasEventListener(EventType.POSITION_CHANGED)) {
                this._eventMask &= ~POSITION_ON;
            }
            if ((this._eventMask & SCALE_ON) && !listeners.hasEventListener(EventType.SCALE_CHANGED)) {
                this._eventMask &= ~SCALE_ON;
            }
            if ((this._eventMask & ROTATION_ON) && !listeners.hasEventListener(EventType.ROTATION_CHANGED)) {
                this._eventMask &= ~ROTATION_ON;
            }
            if ((this._eventMask & SIZE_ON) && !listeners.hasEventListener(EventType.SIZE_CHANGED)) {
                this._eventMask &= ~SIZE_ON;
            }
            if ((this._eventMask & ANCHOR_ON) && !listeners.hasEventListener(EventType.ANCHOR_CHANGED)) {
                this._eventMask &= ~ANCHOR_ON;
            }
            if ((this._eventMask & COLOR_ON) && !listeners.hasEventListener(EventType.COLOR_CHANGED)) {
                this._eventMask &= ~COLOR_ON;
            }
        }
        if (this._capturingListeners) {
            this._capturingListeners.targetOff(target);
        }

        if (this._touchListener && !_checkListeners(this, _touchEvents)) {
            eventManager.removeListener(this._touchListener);
            this._touchListener = null;
        }
        if (this._mouseListener && !_checkListeners(this, _mouseEvents)) {
            eventManager.removeListener(this._mouseListener);
            this._mouseListener = null;
        }
    },

    /**
     * !#en Checks whether the EventTarget object has any callback registered for a specific type of event.
     * !#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
     * @method hasEventListener
     * @param {String} type - The type of event.
     * @return {Boolean} True if a callback of the specified type is registered; false otherwise.
     */
    hasEventListener (type) {
        let has = false;
        if (this._bubblingListeners) {
            has = this._bubblingListeners.hasEventListener(type);
        }
        if (!has && this._capturingListeners) {
            has = this._capturingListeners.hasEventListener(type);
        }
        return has;
    },

    /**
     * !#en
     * Trigger an event directly with the event name and necessary arguments.
     * !#zh
     * 通过事件名发送自定义事件
     *
     * @method emit
     * @param {String} type - event type
     * @param {*} [arg1] - First argument in callback
     * @param {*} [arg2] - Second argument in callback
     * @param {*} [arg3] - Third argument in callback
     * @param {*} [arg4] - Fourth argument in callback
     * @param {*} [arg5] - Fifth argument in callback
     * @example
     * 
     * eventTarget.emit('fire', event);
     * eventTarget.emit('fire', message, emitter);
     */
    emit (type, arg1, arg2, arg3, arg4, arg5) {
        if (this._bubblingListeners) {
            this._bubblingListeners.emit(type, arg1, arg2, arg3, arg4, arg5);
        }
    },

    /**
     * !#en
     * Dispatches an event into the event flow.
     * The event target is the EventTarget object upon which the dispatchEvent() method is called.
     * !#zh 分发事件到事件流中。
     *
     * @method dispatchEvent
     * @param {Event} event - The Event object that is dispatched into the event flow
     */
    dispatchEvent (event) {
        _doDispatchEvent(this, event);
        _cachedArray.length = 0;
    },

    /**
     * !#en Pause node related system events registered with the current Node. Node system events includes touch and mouse events.
     * If recursive is set to true, then this API will pause the node system events for the node and all nodes in its sub node tree.
     * Reference: http://docs.cocos2d-x.org/editors_and_tools/creator-chapters/scripting/internal-events/
     * !#zh 暂停当前节点上注册的所有节点系统事件，节点系统事件包含触摸和鼠标事件。
     * 如果传递 recursive 为 true，那么这个 API 将暂停本节点和它的子树上所有节点的节点系统事件。
     * 参考：https://www.cocos.com/docs/creator/scripting/internal-events.html
     * @method pauseSystemEvents
     * @param {Boolean} recursive - Whether to pause node system events on the sub node tree.
     * @example
     * node.pauseSystemEvents(true);
     */
    pauseSystemEvents (recursive) {
        eventManager.pauseTarget(this, recursive);
    },

    /**
     * !#en Resume node related system events registered with the current Node. Node system events includes touch and mouse events.
     * If recursive is set to true, then this API will resume the node system events for the node and all nodes in its sub node tree.
     * Reference: http://docs.cocos2d-x.org/editors_and_tools/creator-chapters/scripting/internal-events/
     * !#zh 恢复当前节点上注册的所有节点系统事件，节点系统事件包含触摸和鼠标事件。
     * 如果传递 recursive 为 true，那么这个 API 将恢复本节点和它的子树上所有节点的节点系统事件。
     * 参考：https://www.cocos.com/docs/creator/scripting/internal-events.html
     * @method resumeSystemEvents
     * @param {Boolean} recursive - Whether to resume node system events on the sub node tree.
     * @example
     * node.resumeSystemEvents(true);
     */
    resumeSystemEvents (recursive) {
        eventManager.resumeTarget(this, recursive);
    },

    _hitTest (point, listener) {
        let w = this._contentSize.width,
            h = this._contentSize.height,
            cameraPt = _vec2a,
            testPt = _vec2b;
        
        let camera = cc.Camera.findCamera(this);
        if (camera) {
            camera.getCameraToWorldPoint(point, cameraPt);
        }
        else {
            cameraPt.set(point);
        }

        this._updateWorldMatrix();
        math.mat4.invert(_mat4_temp, this._worldMatrix);
        math.vec2.transformMat4(testPt, cameraPt, _mat4_temp);
        testPt.x += this._anchorPoint.x * w;
        testPt.y += this._anchorPoint.y * h;

        if (testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h) {
            if (listener && listener.mask) {
                var mask = listener.mask;
                var parent = this;
                for (var i = 0; parent && i < mask.index; ++i, parent = parent.parent) {
                }
                // find mask parent, should hit test it
                if (parent === mask.node) {
                    var comp = parent.getComponent(cc.Mask);
                    return (comp && comp.enabledInHierarchy) ? comp._hitTest(cameraPt) : true;
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

    /**
     * Get all the targets listening to the supplied type of event in the target's capturing phase.
     * The capturing phase comprises the journey from the root to the last node BEFORE the event target's node.
     * The result should save in the array parameter, and MUST SORT from child nodes to parent nodes.
     *
     * Subclasses can override this method to make event propagable.
     * @method _getCapturingTargets
     * @private
     * @param {String} type - the event type
     * @param {Array} array - the array to receive targets
     * @example {@link cocos2d/core/event/_getCapturingTargets.js}
     */
    _getCapturingTargets (type, array) {
        var parent = this.parent;
        while (parent) {
            if (parent._capturingListeners && parent._capturingListeners.hasEventListener(type)) {
                array.push(parent);
            }
            parent = parent.parent;
        }
    },
    
    /**
     * Get all the targets listening to the supplied type of event in the target's bubbling phase.
     * The bubbling phase comprises any SUBSEQUENT nodes encountered on the return trip to the root of the tree.
     * The result should save in the array parameter, and MUST SORT from child nodes to parent nodes.
     *
     * Subclasses can override this method to make event propagable.
     * @method _getBubblingTargets
     * @private
     * @param {String} type - the event type
     * @param {Array} array - the array to receive targets
     */
    _getBubblingTargets (type, array) {
        var parent = this.parent;
        while (parent) {
            if (parent._bubblingListeners && parent._bubblingListeners.hasEventListener(type)) {
                array.push(parent);
            }
            parent = parent.parent;
        }
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
    runAction: ActionManagerExist ? function (action) {
        if (!this.active)
            return;
        cc.assertID(action, 1618);

        cc.director.getActionManager().addAction(action, this, false);
        return action;
    } : emptyFunc,

    /**
     * !#en Pause all actions running on the current node. Equals to `cc.director.getActionManager().pauseTarget(node)`.
     * !#zh 暂停本节点上所有正在运行的动作。和 `cc.director.getActionManager().pauseTarget(node);` 等价。
     * @method pauseAllActions
     * @example
     * node.pauseAllActions();
     */
    pauseAllActions: ActionManagerExist ? function () {
        cc.director.getActionManager().pauseTarget(this);
    } : emptyFunc,

    /**
     * !#en Resume all paused actions on the current node. Equals to `cc.director.getActionManager().resumeTarget(node)`.
     * !#zh 恢复运行本节点上所有暂停的动作。和 `cc.director.getActionManager().resumeTarget(node);` 等价。
     * @method resumeAllActions
     * @example
     * node.resumeAllActions();
     */
    resumeAllActions: ActionManagerExist ? function () {
        cc.director.getActionManager().resumeTarget(this);
    } : emptyFunc,

    /**
     * !#en Stops and removes all actions from the running action list .
     * !#zh 停止并且移除所有正在运行的动作列表。
     * @method stopAllActions
     * @example
     * node.stopAllActions();
     */
    stopAllActions: ActionManagerExist ? function () {
        cc.director.getActionManager().removeAllActionsFromTarget(this);
    } : emptyFunc,

    /**
     * !#en Stops and removes an action from the running action list.
     * !#zh 停止并移除指定的动作。
     * @method stopAction
     * @param {Action} action An action object to be removed.
     * @example
     * var action = cc.scaleTo(0.2, 1, 0.6);
     * node.stopAction(action);
     */
    stopAction: ActionManagerExist ? function (action) {
        cc.director.getActionManager().removeAction(action);
    } : emptyFunc,

    /**
     * !#en Removes an action from the running action list by its tag.
     * !#zh 停止并且移除指定标签的动作。
     * @method stopActionByTag
     * @param {Number} tag A tag that indicates the action to be removed.
     * @example
     * node.stopAction(1);
     */
    stopActionByTag: ActionManagerExist ? function (tag) {
        if (tag === cc.Action.TAG_INVALID) {
            cc.logID(1612);
            return;
        }
        cc.director.getActionManager().removeActionByTag(tag, this);
    } : emptyFunc,

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
    getActionByTag: ActionManagerExist ? function (tag) {
        if (tag === cc.Action.TAG_INVALID) {
            cc.logID(1613);
            return null;
        }
        return cc.director.getActionManager().getActionByTag(tag, this);
    } : function () {
        return null;
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
    getNumberOfRunningActions: ActionManagerExist ? function () {
        return cc.director.getActionManager().getNumberOfRunningActionsInTarget(this);
    } : function () {
        return 0;
    },


// TRANSFORM RELATED
    /**
     * !#en 
     * Returns a copy of the position (x, y, z) of the node in its parent's coordinates.
     * You can pass a cc.Vec2 or cc.Vec3 as the argument to receive the return values.
     * !#zh 
     * 获取节点在父节点坐标系中的位置（x, y, z）。
     * 你可以传一个 cc.Vec2 或者 cc.Vec3 作为参数来接收返回值。
     * @method getPosition
     * @param {Vec2|Vec3} [out] - The return value to receive position
     * @return {Vec2|Vec3} The position (x, y, z) of the node in its parent's coordinates
     * @example
     * cc.log("Node Position: " + node.getPosition());
     */
    getPosition (out) {
        out = out || cc.v3();
        return out.set(this._position);
    },

    /**
     * !#en
     * Sets the position (x, y, z) of the node in its parent's coordinates.<br/>
     * Usually we use cc.v2(x, y) to compose cc.Vec2 object,<br/>
     * and passing two numbers (x, y) is more efficient than passing cc.Vec2 object.
     * For 3D node we can use cc.v3(x, y, z) to compose cc.Vec3 object,<br/>
     * and passing three numbers (x, y, z) is more efficient than passing cc.Vec3 object.
     * !#zh
     * 设置节点在父节点坐标系中的位置。<br/>
     * 可以通过下面的方式设置坐标点：<br/>
     * 1. 传入 2 个数值 x, y。<br/>
     * 2. 传入 cc.v2(x, y) 类型为 cc.Vec2 的对象。
     * 3. 对于 3D 节点可以传入 3 个数值 x, y, z。<br/>
     * 4. 对于 3D 节点可以传入 cc.v3(x, y, z) 类型为 cc.Vec3 的对象。
     * @method setPosition
     * @param {Vec2|Vec3|Number} newPosOrX - X coordinate for position or the position (x, y, z) of the node in coordinates
     * @param {Number} [y] - Y coordinate for position
     * @param {Number} [z] - Z coordinate for position
     */
    setPosition (newPosOrX, y) {
        var x;
        if (y === undefined) {
            x = newPosOrX.x;
            y = newPosOrX.y;
        }
        else {
            x = newPosOrX;
        }

        var locPosition = this._position;
        if (locPosition.x === x && locPosition.y === y) {
            return;
        }

        if (CC_EDITOR) {
            var oldPosition = new cc.Vec3(locPosition);
        }
        if (!CC_EDITOR || isFinite(x)) {
            locPosition.x = x;
        }
        else {
            return cc.error(ERR_INVALID_NUMBER, 'x of new position');
        }
        if (!CC_EDITOR || isFinite(y)) {
            locPosition.y = y;
        }
        else {	
            return cc.error(ERR_INVALID_NUMBER, 'y of new position');
        }
        this.setLocalDirty(LocalDirtyFlag.POSITION);
        this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM;

        // fast check event
        if (this._eventMask & POSITION_ON) {
            // send event
            if (CC_EDITOR) {
                this.emit(EventType.POSITION_CHANGED, oldPosition);
            }
            else {
                this.emit(EventType.POSITION_CHANGED);
            }
        }
    },

    /**
     * !#en
     * Returns the scale factor of the node.
     * Need pass a cc.Vec2 or cc.Vec3 as the argument to receive the return values.
     * !#zh 获取节点的缩放，需要传一个 cc.Vec2 或者 cc.Vec3 作为参数来接收返回值。
     * @method getScale
     * @param {Vec2|Vec3} out
     * @return {Vec2|Vec3} The scale factor
     * @example
     * cc.log("Node Scale: " + node.getScale(cc.v3()));
     */
    getScale (out) {
        if (out !== undefined) {
            return out.set(this._scale);
        }
        else {
            cc.warnID(1400, 'cc.Node.getScale', 'cc.Node.scale or cc.Node.getScale(cc.Vec3)');
            return this._scale.x;
        }
    },

    /**
     * !#en 
     * Sets the scale of axis in local coordinates of the node.
     * You can operate 2 axis in 2D node, and 3 axis in 3D node.
     * !#zh 
     * 设置节点在本地坐标系中坐标轴上的缩放比例。
     * 2D 节点可以操作两个坐标轴，而 3D 节点可以操作三个坐标轴。
     * @method setScale
     * @param {Number|Vec2|Vec3} x - scaleX or scale object
     * @param {Number} [y]
     * @param {Number} [z]
     * @example
     * node.setScale(cc.v2(2, 2));
     * node.setScale(cc.v3(2, 2, 2)); // for 3D node
     * node.setScale(2);
     */
    setScale (x, y) {
        if (x && typeof x !== 'number') {
            y = x.y;
            x = x.x;
        }
        else if (y === undefined) {
            y = x;
        }
        if (this._scale.x !== x || this._scale.y !== y) {
            this._scale.x = x;
            this._scale.y = y;
            this.setLocalDirty(LocalDirtyFlag.SCALE);
            this._renderFlag |= RenderFlow.FLAG_TRANSFORM;

            if (this._eventMask & SCALE_ON) {
                this.emit(EventType.SCALE_CHANGED);
            }
        }
    },

    /**
     * !#en 
     * Get rotation of node (in quaternion). 
     * Need pass a cc.Quat as the argument to receive the return values.
     * !#zh 
     * 获取该节点的 quaternion 旋转角度，需要传一个 cc.Quat 作为参数来接收返回值。
     * @method getRotation
     * @param {Quat} out
     * @return {Quat} Quaternion object represents the rotation
     */
    getRotation (out) {
        if (out instanceof cc.Quat) {
            return out.set(this._quat);
        }
        else {
            cc.warnID(1400, 'cc.Node.getRotation', 'cc.Node.angle or cc.Node.getRotation(cc.Quat)');
            return -this.angle;
        }
    },

    /**
     * !#en Set rotation of node (in quaternion).
     * !#zh 设置该节点的 quaternion 旋转角度。
     * @method setRotation
     * @param {cc.Quat|Number} quat Quaternion object represents the rotation or the x value of quaternion	
     * @param {Number} y y value of quternion	
     * @param {Number} z z value of quternion	
     * @param {Number} w w value of quternion
     */
    setRotation (quat, y, z, w) {
        if (typeof quat === 'number' && y === undefined) {
            cc.warnID(1400, 'cc.Node.setRotation(Number)', 'cc.Node.angle or cc.Node.setRotation(quat)')
            this.angle = -quat;
        }
        else {
            let x = quat;
            if (y === undefined) {
                x = quat.x;
                y = quat.y;
                z = quat.z;
                w = quat.w;
            }

            let old = this._quat;
            if (old.x !== x || old.y !== y || old.z !== z || old.w !== w) {
                old.x = x;
                old.y = y;
                old.z = z;
                old.w = w;
                this.setLocalDirty(LocalDirtyFlag.ROTATION);
                this._renderFlag |= RenderFlow.FLAG_TRANSFORM;

                if (this._eventMask & ROTATION_ON) {
                    this.emit(EventType.ROTATION_CHANGED);
                }

                if (CC_EDITOR) {
                    old.getEulerAngles(this._eulerAngles);
                }
            }
        }
    },

    /**
     * !#en
     * Returns a copy the untransformed size of the node. <br/>
     * The contentSize remains the same no matter the node is scaled or rotated.<br/>
     * All nodes has a size. Layer and Scene has the same size of the screen by default. <br/>
     * !#zh 获取节点自身大小，不受该节点是否被缩放或者旋转的影响。
     * @method getContentSize
     * @return {Size} The untransformed size of the node.
     * @example
     * cc.log("Content Size: " + node.getContentSize());
     */
    getContentSize () {
        return cc.size(this._contentSize.width, this._contentSize.height);
    },

    /**
     * !#en
     * Sets the untransformed size of the node.<br/>
     * The contentSize remains the same no matter the node is scaled or rotated.<br/>
     * All nodes has a size. Layer and Scene has the same size of the screen.
     * !#zh 设置节点原始大小，不受该节点是否被缩放或者旋转的影响。
     * @method setContentSize
     * @param {Size|Number} size - The untransformed size of the node or The untransformed size's width of the node.
     * @param {Number} [height] - The untransformed size's height of the node.
     * @example
     * node.setContentSize(cc.size(100, 100));
     * node.setContentSize(100, 100);
     */
    setContentSize (size, height) {
        var locContentSize = this._contentSize;
        var clone;
        if (height === undefined) {
            if ((size.width === locContentSize.width) && (size.height === locContentSize.height))
                return;
            if (CC_EDITOR) {
                clone = cc.size(locContentSize.width, locContentSize.height);
            }
            locContentSize.width = size.width;
            locContentSize.height = size.height;
        } else {
            if ((size === locContentSize.width) && (height === locContentSize.height))
                return;
            if (CC_EDITOR) {
                clone = cc.size(locContentSize.width, locContentSize.height);
            }
            locContentSize.width = size;
            locContentSize.height = height;
        }
        if (this._eventMask & SIZE_ON) {
            if (CC_EDITOR) {
                this.emit(EventType.SIZE_CHANGED, clone);
            }
            else {
                this.emit(EventType.SIZE_CHANGED);
            }
        }
    },

    /**
     * !#en
     * Returns a copy of the anchor point.<br/>
     * Anchor point is the point around which all transformations and positioning manipulations take place.<br/>
     * It's like a pin in the node where it is "attached" to its parent. <br/>
     * The anchorPoint is normalized, like a percentage. (0,0) means the bottom-left corner and (1,1) means the top-right corner. <br/>
     * But you can use values higher than (1,1) and lower than (0,0) too.  <br/>
     * The default anchor point is (0.5,0.5), so it starts at the center of the node.
     * !#zh
     * 获取节点锚点，用百分比表示。<br/>
     * 锚点应用于所有变换和坐标点的操作，它就像在节点上连接其父节点的大头针。<br/>
     * 锚点是标准化的，就像百分比一样。(0，0) 表示左下角，(1，1) 表示右上角。<br/>
     * 但是你可以使用比（1，1）更高的值或者比（0，0）更低的值。<br/>
     * 默认的锚点是（0.5，0.5），因此它开始于节点的中心位置。<br/>
     * 注意：Creator 中的锚点仅用于定位所在的节点，子节点的定位不受影响。
     * @method getAnchorPoint
     * @return {Vec2} The anchor point of node.
     * @example
     * cc.log("Node AnchorPoint: " + node.getAnchorPoint());
     */
    getAnchorPoint () {
        return cc.v2(this._anchorPoint);
    },

    /**
     * !#en
     * Sets the anchor point in percent. <br/>
     * anchor point is the point around which all transformations and positioning manipulations take place. <br/>
     * It's like a pin in the node where it is "attached" to its parent. <br/>
     * The anchorPoint is normalized, like a percentage. (0,0) means the bottom-left corner and (1,1) means the top-right corner.<br/>
     * But you can use values higher than (1,1) and lower than (0,0) too.<br/>
     * The default anchor point is (0.5,0.5), so it starts at the center of the node.
     * !#zh
     * 设置锚点的百分比。<br/>
     * 锚点应用于所有变换和坐标点的操作，它就像在节点上连接其父节点的大头针。<br/>
     * 锚点是标准化的，就像百分比一样。(0，0) 表示左下角，(1，1) 表示右上角。<br/>
     * 但是你可以使用比（1，1）更高的值或者比（0，0）更低的值。<br/>
     * 默认的锚点是（0.5，0.5），因此它开始于节点的中心位置。<br/>
     * 注意：Creator 中的锚点仅用于定位所在的节点，子节点的定位不受影响。
     * @method setAnchorPoint
     * @param {Vec2|Number} point - The anchor point of node or The x axis anchor of node.
     * @param {Number} [y] - The y axis anchor of node.
     * @example
     * node.setAnchorPoint(cc.v2(1, 1));
     * node.setAnchorPoint(1, 1);
     */
    setAnchorPoint (point, y) {
        var locAnchorPoint = this._anchorPoint;
        if (y === undefined) {
            if ((point.x === locAnchorPoint.x) && (point.y === locAnchorPoint.y))
                return;
            locAnchorPoint.x = point.x;
            locAnchorPoint.y = point.y;
        } else {
            if ((point === locAnchorPoint.x) && (y === locAnchorPoint.y))
                return;
            locAnchorPoint.x = point;
            locAnchorPoint.y = y;
        }
        this.setLocalDirty(LocalDirtyFlag.POSITION);
        if (this._eventMask & ANCHOR_ON) {
            this.emit(EventType.ANCHOR_CHANGED);
        }
    },

    /*
     * Transforms position from world space to local space.
     * @method _invTransformPoint
     * @param {Vec3} out
     * @param {Vec3} vec3
     */
    _invTransformPoint (out, pos) {
        if (this._parent) {
            this._parent._invTransformPoint(out, pos);
        } else {
            math.vec3.copy(out, pos);
        }

        // out = parent_inv_pos - pos
        math.vec3.sub(out, out, this._position);

        // out = inv(rot) * out
        math.quat.conjugate(_quat_temp, this._quat);
        math.vec3.transformQuat(out, out, _quat_temp);

        // out = (1/scale) * out
        math.vec3.inverseSafe(_vec3_temp, this._scale);
        math.vec3.mul(out, out, _vec3_temp);

        return out;
    },
    
    /*
     * Calculate and return world position.
     * This is not a public API yet, its usage could be updated
     * @method getWorldPosition
     * @param {Vec3} out
     * @return {Vec3}
     */
    getWorldPosition (out) {
        math.vec3.copy(out, this._position);
        let curr = this._parent;
        while (curr) {
            // out = parent_scale * pos
            math.vec3.mul(out, out, curr._scale);
            // out = parent_quat * out
            math.vec3.transformQuat(out, out, curr._quat);
            // out = out + pos
            math.vec3.add(out, out, curr._position);
            curr = curr._parent;
        }
        return out;
    },

    /*
     * Set world position.
     * This is not a public API yet, its usage could be updated
     * @method setWorldPosition
     * @param {Vec3} pos
     */
    setWorldPosition (pos) {
        if (CC_EDITOR) {
            var oldPosition = new cc.Vec3(this._position);
        }
        // NOTE: this is faster than invert world matrix and transform the point
        if (this._parent) {
            this._parent._invTransformPoint(this._position, pos);
        }
        else {
            math.vec3.copy(this._position, pos);
        }
        this.setLocalDirty(LocalDirtyFlag.POSITION);

        // fast check event
        if (this._eventMask & POSITION_ON) {
            // send event
            if (CC_EDITOR) {
                this.emit(EventType.POSITION_CHANGED, oldPosition);
            }
            else {
                this.emit(EventType.POSITION_CHANGED);
            }
        }
    },

    /*
     * Calculate and return world rotation
     * This is not a public API yet, its usage could be updated
     * @method getWorldRotation
     * @param {Quat} out
     * @return {Quat}
     */
    getWorldRotation (out) {
        math.quat.copy(out, this._quat);
        let curr = this._parent;
        while (curr) {
            math.quat.mul(out, curr._quat, out);
            curr = curr._parent;
        }
        return out;
    },

    /*
     * Set world rotation with quaternion
     * This is not a public API yet, its usage could be updated
     * @method setWorldRotation
     * @param {Quat} rot
     */
    setWorldRotation (quat) {
        if (this._parent) {
            this._parent.getWorldRotation(this._quat);
            math.quat.conjugate(this._quat, this._quat);
            math.quat.mul(this._quat, this._quat, quat);
        }
        else {
            math.quat.copy(this._quat, quat);
        }
        this._quat.getEulerAngles(this._eulerAngles);
        this.setLocalDirty(LocalDirtyFlag.ROTATION);
    },

    /*
     * Calculate and return world scale
     * This is not a public API yet, its usage could be updated
     * @method getWorldScale
     * @param {Vec3} out
     * @return {Vec3}
     */
    getWorldScale (out) {
        math.vec3.copy(out, this._scale);
        let curr = this._parent;
        while (curr) {
            math.vec3.mul(out, out, curr._scale);
            curr = curr._parent;
        }
        return out;
    },

    /*
     * Set world scale with vec3
     * This is not a public API yet, its usage could be updated
     * @method setWorldScale
     * @param {Vec3} scale
     */
    setWorldScale (scale) {
        if (this._parent) {
            this._parent.getWorldScale(this._scale);
            math.vec3.div(this._scale, scale, this._scale);
        }
        else {
            math.vec3.copy(this._scale, scale);
        }
        this.setLocalDirty(LocalDirtyFlag.SCALE);
    },

    getWorldRT (out) {
        let opos = _vec3_temp;
        let orot = _quat_temp;
        math.vec3.copy(opos, this._position);
        math.quat.copy(orot, this._quat);

        let curr = this._parent;
        while (curr) {
            // opos = parent_lscale * lpos
            math.vec3.mul(opos, opos, curr._scale);
            // opos = parent_lrot * opos
            math.vec3.transformQuat(opos, opos, curr._quat);
            // opos = opos + lpos
            math.vec3.add(opos, opos, curr._position);
            // orot = lrot * orot
            math.quat.mul(orot, curr._quat, orot);
            curr = curr._parent;
        }
        math.mat4.fromRT(out, orot, opos);
        return out;
    },

    /**
     * !#en Set rotation by lookAt target point, normally used by Camera Node
     * !#zh 通过观察目标来设置 rotation，一般用于 Camera Node 上
     * @method lookAt
     * @param {Vec3} pos
     * @param {Vec3} [up] - default is (0,1,0)
     */
    lookAt (pos, up) {
        this.getWorldPosition(_vec3_temp);
        math.vec3.sub(_vec3_temp, _vec3_temp, pos); // NOTE: we use -z for view-dir
        math.vec3.normalize(_vec3_temp, _vec3_temp);
        math.quat.fromViewUp(_quat_temp, _vec3_temp, up);
    
        this.setWorldRotation(_quat_temp);
    },

    _updateLocalMatrix () {
        let dirtyFlag = this._localMatDirty;
        if (!dirtyFlag) return;

        // Update transform
        let t = this._matrix;
        //math.mat4.fromRTS(t, this._quat, this._position, this._scale);

        if (dirtyFlag & (LocalDirtyFlag.RT | LocalDirtyFlag.SKEW)) {
            let rotation = -this._eulerAngles.z;
            let hasSkew = this._skewX || this._skewY;
            let sx = this._scale.x, sy = this._scale.y;

            if (rotation || hasSkew) {
                let a = 1, b = 0, c = 0, d = 1;
                // rotation
                if (rotation) {
                    let rotationRadians = rotation * ONE_DEGREE;
                    c = Math.sin(rotationRadians);
                    d = Math.cos(rotationRadians);
                    a = d;
                    b = -c;
                }
                // scale
                t.m00 = a *= sx;
                t.m01 = b *= sx;
                t.m04 = c *= sy;
                t.m05 = d *= sy;
                // skew
                if (hasSkew) {
                    let a = t.m00, b = t.m01, c = t.m04, d = t.m05;
                    let skx = Math.tan(this._skewX * ONE_DEGREE);
                    let sky = Math.tan(this._skewY * ONE_DEGREE);
                    if (skx === Infinity)
                        skx = 99999999;
                    if (sky === Infinity)
                        sky = 99999999;
                    t.m00 = a + c * sky;
                    t.m01 = b + d * sky;
                    t.m04 = c + a * skx;
                    t.m05 = d + b * skx;
                }
            }
            else {
                t.m00 = sx;
                t.m01 = 0;
                t.m04 = 0;
                t.m05 = sy;
            }
        }

        // position
        t.m12 = this._position.x;
        t.m13 = this._position.y;
        
        this._localMatDirty = 0;
        // Register dirty status of world matrix so that it can be recalculated
        this._worldMatDirty = true;
    },

    _calculWorldMatrix () {
        // Avoid as much function call as possible
        if (this._localMatDirty) {
            this._updateLocalMatrix();
        }
        
        // Assume parent world matrix is correct
        let parent = this._parent;
        if (parent) {
            this._mulMat(this._worldMatrix, parent._worldMatrix, this._matrix);
        }
        else {
            math.mat4.copy(this._worldMatrix, this._matrix);
        }
        this._worldMatDirty = false;
    },

    _mulMat (out, a, b) {
        let aa=a.m00, ab=a.m01, ac=a.m04, ad=a.m05, atx=a.m12, aty=a.m13;
        let ba=b.m00, bb=b.m01, bc=b.m04, bd=b.m05, btx=b.m12, bty=b.m13;
        if (ab !== 0 || ac !== 0) {
            out.m00 = ba * aa + bb * ac;
            out.m01 = ba * ab + bb * ad;
            out.m04 = bc * aa + bd * ac;
            out.m05 = bc * ab + bd * ad;
            out.m12 = aa * btx + ac * bty + atx;
            out.m13 = ab * btx + ad * bty + aty;
        }
        else {
            out.m00 = ba * aa;
            out.m01 = bb * ad;
            out.m04 = bc * aa;
            out.m05 = bd * ad;
            out.m12 = aa * btx + atx;
            out.m13 = ad * bty + aty;
        }
    },

    _updateWorldMatrix () {
        if (this._parent) {
            this._parent._updateWorldMatrix();
        }
        if (this._worldMatDirty) {
            this._calculWorldMatrix();
            // Sync dirty to children
            let children = this._children;
            for (let i = 0, l = children.length; i < l; i++) {
                children[i]._worldMatDirty = true;
            }
        }
    },

    setLocalDirty (flag) {
        this._localMatDirty = this._localMatDirty | flag;
        this._worldMatDirty = true;
    },

    setWorldDirty () {
        this._worldMatDirty = true;
    },

    /**
     * !#en
     * Get the local transform matrix (4x4), based on parent node coordinates
     * !#zh 返回局部空间坐标系的矩阵，基于父节点坐标系。
     * @method getLocalMatrix
     * @param {Mat4} out The matrix object to be filled with data
     * @return {Mat4} Same as the out matrix object
     * @example
     * let mat4 = cc.mat4();
     * node.getLocalMatrix(mat4);
     */
    getLocalMatrix (out) {
        this._updateLocalMatrix();
        return math.mat4.copy(out, this._matrix);
    },
    
    /**
     * !#en
     * Get the world transform matrix (4x4)
     * !#zh 返回世界空间坐标系的矩阵。
     * @method getWorldMatrix
     * @param {Mat4} out The matrix object to be filled with data
     * @return {Mat4} Same as the out matrix object
     * @example
     * let mat4 = cc.mat4();
     * node.getWorldMatrix(mat4);
     */
    getWorldMatrix (out) {
        this._updateWorldMatrix();
        return math.mat4.copy(out, this._worldMatrix);
    },

    /**
     * !#en Converts a Point to node (local) space coordinates then add the anchor point position.
     * So the return position will be related to the left bottom corner of the node's bounding box.
     * This equals to the API behavior of cocos2d-x, you probably want to use convertToNodeSpaceAR instead
     * !#zh 将一个点转换到节点 (局部) 坐标系，并加上锚点的坐标。<br/>
     * 也就是说返回的坐标是相对于节点包围盒左下角的坐标。<br/>
     * 这个 API 的设计是为了和 cocos2d-x 中行为一致，更多情况下你可能需要使用 convertToNodeSpaceAR。
     * @method convertToNodeSpace
     * @param {Vec2} worldPoint
     * @return {Vec2}
     * @example
     * var newVec2 = node.convertToNodeSpace(cc.v2(100, 100));
     */
    convertToNodeSpace (worldPoint) {
        this._updateWorldMatrix();
        math.mat4.invert(_mat4_temp, this._worldMatrix);
        let out = new cc.Vec2();
        math.vec2.transformMat4(out, worldPoint, _mat4_temp);
        out.x += this._anchorPoint.x * this._contentSize.width;
        out.y += this._anchorPoint.y * this._contentSize.height;
        return out;
    },

    /**
     * !#en Converts a Point related to the left bottom corner of the node's bounding box to world space coordinates.
     * This equals to the API behavior of cocos2d-x, you probably want to use convertToWorldSpaceAR instead
     * !#zh 将一个相对于节点左下角的坐标位置转换到世界空间坐标系。
     * 这个 API 的设计是为了和 cocos2d-x 中行为一致，更多情况下你可能需要使用 convertToWorldSpaceAR
     * @method convertToWorldSpace
     * @param {Vec2} nodePoint
     * @return {Vec2}
     * @example
     * var newVec2 = node.convertToWorldSpace(cc.v2(100, 100));
     */
    convertToWorldSpace (nodePoint) {
        this._updateWorldMatrix();
        let out = new cc.Vec2(
            nodePoint.x - this._anchorPoint.x * this._contentSize.width,
            nodePoint.y - this._anchorPoint.y * this._contentSize.height
        );
        return math.vec2.transformMat4(out, out, this._worldMatrix);
    },

    /**
     * !#en
     * Converts a Point to node (local) space coordinates in which the anchor point is the origin position.
     * !#zh
     * 将一个点转换到节点 (局部) 空间坐标系，这个坐标系以锚点为原点。
     * @method convertToNodeSpaceAR
     * @param {Vec2} worldPoint
     * @return {Vec2}
     * @example
     * var newVec2 = node.convertToNodeSpaceAR(cc.v2(100, 100));
     */
    convertToNodeSpaceAR (worldPoint) {
        this._updateWorldMatrix();
        math.mat4.invert(_mat4_temp, this._worldMatrix);
        let out = new cc.Vec2();
        return math.vec2.transformMat4(out, worldPoint, _mat4_temp);
    },

    /**
     * !#en
     * Converts a Point in node coordinates to world space coordinates.
     * !#zh
     * 将节点坐标系下的一个点转换到世界空间坐标系。
     * @method convertToWorldSpaceAR
     * @param {Vec2} nodePoint
     * @return {Vec2}
     * @example
     * var newVec2 = node.convertToWorldSpaceAR(cc.v2(100, 100));
     */
    convertToWorldSpaceAR (nodePoint) {
        this._updateWorldMatrix();
        let out = new cc.Vec2();
        return math.vec2.transformMat4(out, nodePoint, this._worldMatrix);
    },

// OLD TRANSFORM ACCESS APIs
    /**
     * !#en
     * Returns the matrix that transform the node's (local) space coordinates into the parent's space coordinates.<br/>
     * The matrix is in Pixels.
     * !#zh 返回这个将节点（局部）的空间坐标系转换成父节点的空间坐标系的矩阵。这个矩阵以像素为单位。
     * @method getNodeToParentTransform
     * @deprecated since v2.0
     * @param {AffineTransform} [out] The affine transform object to be filled with data
     * @return {AffineTransform} Same as the out affine transform object
     * @example
     * let affineTransform = cc.AffineTransform.create();
     * node.getNodeToParentTransform(affineTransform);
     */
    getNodeToParentTransform (out) {
        if (!out) {
            out = AffineTrans.identity();
        }
        this._updateLocalMatrix();
               
        var contentSize = this._contentSize;
        _vec3_temp.x = -this._anchorPoint.x * contentSize.width;
        _vec3_temp.y = -this._anchorPoint.y * contentSize.height;

        math.mat4.copy(_mat4_temp, this._matrix);
        math.mat4.translate(_mat4_temp, _mat4_temp, _vec3_temp);
        return AffineTrans.fromMat4(out, _mat4_temp);
    },

    /**
     * !#en
     * Returns the matrix that transform the node's (local) space coordinates into the parent's space coordinates.<br/>
     * The matrix is in Pixels.<br/>
     * This method is AR (Anchor Relative).
     * !#zh
     * 返回这个将节点（局部）的空间坐标系转换成父节点的空间坐标系的矩阵。<br/>
     * 这个矩阵以像素为单位。<br/>
     * 该方法基于节点坐标。
     * @method getNodeToParentTransformAR
     * @deprecated since v2.0
     * @param {AffineTransform} [out] The affine transform object to be filled with data
     * @return {AffineTransform} Same as the out affine transform object
     * @example
     * let affineTransform = cc.AffineTransform.create();
     * node.getNodeToParentTransformAR(affineTransform);
     */
    getNodeToParentTransformAR (out) {
        if (!out) {
            out = AffineTrans.identity();
        }
        this._updateLocalMatrix();
        return AffineTrans.fromMat4(out, this._matrix);
    },

    /**
     * !#en Returns the world affine transform matrix. The matrix is in Pixels.
     * !#zh 返回节点到世界坐标系的仿射变换矩阵。矩阵单位是像素。
     * @method getNodeToWorldTransform
     * @deprecated since v2.0
     * @param {AffineTransform} [out] The affine transform object to be filled with data
     * @return {AffineTransform} Same as the out affine transform object
     * @example
     * let affineTransform = cc.AffineTransform.create();
     * node.getNodeToWorldTransform(affineTransform);
     */
    getNodeToWorldTransform (out) {
        if (!out) {
            out = AffineTrans.identity();
        }
        this._updateWorldMatrix();
        
        var contentSize = this._contentSize;
        _vec3_temp.x = -this._anchorPoint.x * contentSize.width;
        _vec3_temp.y = -this._anchorPoint.y * contentSize.height;

        math.mat4.copy(_mat4_temp, this._worldMatrix);
        math.mat4.translate(_mat4_temp, _mat4_temp, _vec3_temp);

        return AffineTrans.fromMat4(out, _mat4_temp);
    },

    /**
     * !#en
     * Returns the world affine transform matrix. The matrix is in Pixels.<br/>
     * This method is AR (Anchor Relative).
     * !#zh
     * 返回节点到世界坐标仿射变换矩阵。矩阵单位是像素。<br/>
     * 该方法基于节点坐标。
     * @method getNodeToWorldTransformAR
     * @deprecated since v2.0
     * @param {AffineTransform} [out] The affine transform object to be filled with data
     * @return {AffineTransform} Same as the out affine transform object
     * @example
     * let affineTransform = cc.AffineTransform.create();
     * node.getNodeToWorldTransformAR(affineTransform);
     */
    getNodeToWorldTransformAR (out) {
        if (!out) {
            out = AffineTrans.identity();
        }
        this._updateWorldMatrix();
        return AffineTrans.fromMat4(out, this._worldMatrix);
    },

    /**
     * !#en
     * Returns the matrix that transform parent's space coordinates to the node's (local) space coordinates.<br/>
     * The matrix is in Pixels. The returned transform is readonly and cannot be changed.
     * !#zh
     * 返回将父节点的坐标系转换成节点（局部）的空间坐标系的矩阵。<br/>
     * 该矩阵以像素为单位。返回的矩阵是只读的，不能更改。
     * @method getParentToNodeTransform
     * @deprecated since v2.0
     * @param {AffineTransform} [out] The affine transform object to be filled with data
     * @return {AffineTransform} Same as the out affine transform object
     * @example
     * let affineTransform = cc.AffineTransform.create();
     * node.getParentToNodeTransform(affineTransform);
     */
    getParentToNodeTransform (out) {
        if (!out) {
            out = AffineTrans.identity();
        }
        this._updateLocalMatrix();
        math.mat4.invert(_mat4_temp, this._matrix);
        return AffineTrans.fromMat4(out, _mat4_temp);
    },

    /**
     * !#en Returns the inverse world affine transform matrix. The matrix is in Pixels.
     * !#en 返回世界坐标系到节点坐标系的逆矩阵。
     * @method getWorldToNodeTransform
     * @deprecated since v2.0
     * @param {AffineTransform} [out] The affine transform object to be filled with data
     * @return {AffineTransform} Same as the out affine transform object
     * @example
     * let affineTransform = cc.AffineTransform.create();
     * node.getWorldToNodeTransform(affineTransform);
     */
    getWorldToNodeTransform (out) {
        if (!out) {
            out = AffineTrans.identity();
        }
        this._updateWorldMatrix();
        math.mat4.invert(_mat4_temp, this._worldMatrix);
        return AffineTrans.fromMat4(out, _mat4_temp);
    },

    /**
     * !#en convenience methods which take a cc.Touch instead of cc.Vec2.
     * !#zh 将触摸点转换成本地坐标系中位置。
     * @method convertTouchToNodeSpace
     * @deprecated since v2.0
     * @param {Touch} touch - The touch object
     * @return {Vec2}
     * @example
     * var newVec2 = node.convertTouchToNodeSpace(touch);
     */
    convertTouchToNodeSpace (touch) {
        return this.convertToNodeSpace(touch.getLocation());
    },

    /**
     * !#en converts a cc.Touch (world coordinates) into a local coordinate. This method is AR (Anchor Relative).
     * !#zh 转换一个 cc.Touch（世界坐标）到一个局部坐标，该方法基于节点坐标。
     * @method convertTouchToNodeSpaceAR
     * @deprecated since v2.0
     * @param {Touch} touch - The touch object
     * @return {Vec2}
     * @example
     * var newVec2 = node.convertTouchToNodeSpaceAR(touch);
     */
    convertTouchToNodeSpaceAR (touch) {
        return this.convertToNodeSpaceAR(touch.getLocation());
    },
    
    /**
     * !#en
     * Returns a "local" axis aligned bounding box of the node. <br/>
     * The returned box is relative only to its parent.
     * !#zh 返回父节坐标系下的轴向对齐的包围盒。
     * @method getBoundingBox
     * @return {Rect} The calculated bounding box of the node
     * @example
     * var boundingBox = node.getBoundingBox();
     */
    getBoundingBox () {
        this._updateLocalMatrix();
        let width = this._contentSize.width;
        let height = this._contentSize.height;
        let rect = cc.rect(
            -this._anchorPoint.x * width, 
            -this._anchorPoint.y * height, 
            width, 
            height);
        return rect.transformMat4(rect, this._matrix);
    },

    /**
     * !#en
     * Returns a "world" axis aligned bounding box of the node.<br/>
     * The bounding box contains self and active children's world bounding box.
     * !#zh
     * 返回节点在世界坐标系下的对齐轴向的包围盒（AABB）。<br/>
     * 该边框包含自身和已激活的子节点的世界边框。
     * @method getBoundingBoxToWorld
     * @return {Rect}
     * @example
     * var newRect = node.getBoundingBoxToWorld();
     */
    getBoundingBoxToWorld () {
        if (this._parent) {
            this._parent._updateWorldMatrix();
            return this._getBoundingBoxTo(this._parent._worldMatrix);
        }
        else {
            return this.getBoundingBox();
        }
    },

    _getBoundingBoxTo (parentMat) {
        this._updateLocalMatrix();
        let width = this._contentSize.width;
        let height = this._contentSize.height;
        let rect = cc.rect(
            -this._anchorPoint.x * width, 
            -this._anchorPoint.y * height, 
            width, 
            height);

        var parentMat = math.mat4.mul(this._worldMatrix, parentMat, this._matrix);
        rect.transformMat4(rect, parentMat);

        //query child's BoundingBox
        if (!this._children)
            return rect;

        var locChildren = this._children;
        for (var i = 0; i < locChildren.length; i++) {
            var child = locChildren[i];
            if (child && child.active) {
                var childRect = child._getBoundingBoxTo(parentMat);
                if (childRect)
                    rect.union(rect, childRect);
            }
        }
        return rect;
    },

    _updateOrderOfArrival () {
        var arrivalOrder = ++_globalOrderOfArrival;
        this._localZOrder = (this._localZOrder & 0xffff0000) | arrivalOrder;
    },

    /**
     * !#en
     * Adds a child to the node with z order and name.
     * !#zh
     * 添加子节点，并且可以修改该节点的 局部 Z 顺序和名字。
     * @method addChild
     * @param {Node} child - A child node
     * @param {Number} [zIndex] - Z order for drawing priority. Please refer to zIndex property
     * @param {String} [name] - A name to identify the node easily. Please refer to name property
     * @example
     * node.addChild(newNode, 1, "node");
     */
    addChild (child, zIndex, name) {
        if (CC_DEV && !cc.Node.isNode(child)) {
            return cc.errorID(1634, cc.js.getClassName(child));
        }
        cc.assertID(child, 1606);
        cc.assertID(child._parent === null, 1605);

        // invokes the parent setter
        child.parent = this;

        if (zIndex !== undefined) {
            child.zIndex = zIndex;
        }
        if (name !== undefined) {
            child.name = name;
        }
    },

    /**
     * !#en Stops all running actions and schedulers.
     * !#zh 停止所有正在播放的动作和计时器。
     * @method cleanup
     * @example
     * node.cleanup();
     */
    cleanup () {
        // actions
        ActionManagerExist && cc.director.getActionManager().removeAllActionsFromTarget(this);
        // event
        eventManager.removeListeners(this);

        // children
        var i, len = this._children.length, node;
        for (i = 0; i < len; ++i) {
            node = this._children[i];
            if (node)
                node.cleanup();
        }
    },

    /**
     * !#en Sorts the children array depends on children's zIndex and arrivalOrder,
     * normally you won't need to invoke this function.
     * !#zh 根据子节点的 zIndex 和 arrivalOrder 进行排序，正常情况下开发者不需要手动调用这个函数。
     *
     * @method sortAllChildren
     */
    sortAllChildren () {
        if (this._reorderChildDirty) {
            this._reorderChildDirty = false;
            var _children = this._children;
            if (_children.length > 1) {
                // insertion sort
                var len = _children.length, i, j, child;
                for (i = 1; i < len; i++) {
                    child = _children[i];
                    j = i - 1;

                    //continue moving element downwards while zOrder is smaller or when zOrder is the same but mutatedIndex is smaller
                    while (j >= 0) {
                        if (child._localZOrder < _children[j]._localZOrder) {
                            _children[j + 1] = _children[j];
                        } else {
                            break;
                        }
                        j--;
                    }
                    _children[j + 1] = child;
                }
                this.emit(EventType.CHILD_REORDER, this);
            }
            cc.director.__fastOff(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
        }
    },

    _delaySort () {
        if (!this._reorderChildDirty) {
            this._reorderChildDirty = true;
            cc.director.__fastOn(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
        }
    },

    _restoreProperties: CC_EDITOR && function () {
        /*
         * TODO: Refine this code after completing undo/redo 2.0.
         * The node will be destroyed when deleting in the editor,
         * but it will be reserved and reused for undo.
        */
        if (!this._matrix) {
            this._matrix = mathPools.mat4.get();
        }
        if (!this._worldMatrix) {
            this._worldMatrix = mathPools.mat4.get();
        }

        this._localMatDirty = LocalDirtyFlag.ALL;
        this._worldMatDirty = true;

        this._quat.getEulerAngles(this._eulerAngles);

        this._renderFlag |= RenderFlow.FLAG_TRANSFORM;
        if (this._renderComponent) {
            if (this._renderComponent.enabled) {
                this._renderFlag |= RenderFlow.FLAG_COLOR;
                this._renderComponent.markForUpdateRenderData(true);
            }
            else {
                this._renderComponent.disableRender();
            }
        }

        if (this._children.length > 0) {
            this._renderFlag |= RenderFlow.FLAG_CHILDREN;
        }
    },

    onRestore: CC_EDITOR && function () {
        this._onRestoreBase();

        this._restoreProperties();

        var actionManager = cc.director.getActionManager();
        if (this._activeInHierarchy) {
            actionManager && actionManager.resumeTarget(this);
            eventManager.resumeTarget(this);
        }
        else {
            actionManager && actionManager.pauseTarget(this);
            eventManager.pauseTarget(this);
        }
    },
};

if (CC_EDITOR) {
    // deprecated, only used to import old data in editor
    js.mixin(NodeDefines.properties, {
        _scaleX: {
            default: undefined,
            type: cc.Float,
            editorOnly: true
        },
        _scaleY: {
            default: undefined,
            type: cc.Float,
            editorOnly: true
        },
        _rotationX: {
            default: undefined,
            type: cc.Float,
            editorOnly: true
        },
        _rotationY: {
            default: undefined,
            type: cc.Float,
            editorOnly: true
        },
    });
}

let Node = cc.Class(NodeDefines);

// 3D Node Property

/**
 * !en
 * Switch 2D/3D node. The 2D nodes will run faster.
 * !zh
 * 切换 2D/3D 节点，2D 节点会有更高的运行效率
 * @property {Boolean} is3DNode
 * @default false
*/

// Node Event

/**
 * @event position-changed
 * @param {Vec2} oldPos - The old position, but this parameter is only available in editor!
 */
/**
 * @event size-changed
 * @param {Size} oldSize - The old size, but this parameter is only available in editor!
 */
/**
 * @event anchor-changed
 */
/**
 * @event child-added
 * @param {Node} child - child which have been added
 */
/**
 * @event child-removed
 * @param {Node} child - child which have been removed
 */
/**
 * @event child-reorder
 * @param {Node} node - node whose children have been reordered
 */
/**
 * @event group-changed
 * @param {Node} node - node whose group has changed
 */

// Deprecated APIs

/**
 * !#en
 * Returns the displayed opacity of Node,
 * the difference between displayed opacity and opacity is that displayed opacity is calculated based on opacity and parent node's opacity when cascade opacity enabled.
 * !#zh
 * 获取节点显示透明度，
 * 显示透明度和透明度之间的不同之处在于当启用级连透明度时，
 * 显示透明度是基于自身透明度和父节点透明度计算的。
 *
 * @method getDisplayedOpacity
 * @returns {number} displayed opacity
 * @deprecated since v2.0, please use opacity property, cascade opacity is removed
 */

/**
 * !#en
 * Returns the displayed color of Node,
 * the difference between displayed color and color is that displayed color is calculated based on color and parent node's color when cascade color enabled.
 * !#zh
 * 获取节点的显示颜色，
 * 显示颜色和颜色之间的不同之处在于当启用级连颜色时，
 * 显示颜色是基于自身颜色和父节点颜色计算的。
 *
 * @method getDisplayedColor
 * @returns {Color}
 * @deprecated since v2.0, please use color property, cascade color is removed
 */

/**
 * !#en Cascade opacity is removed from v2.0
 * Indicate whether node's opacity value affect its child nodes, default value is true.
 * !#zh 透明度级联功能从 v2.0 开始已移除
 * 节点的不透明度值是否影响其子节点，默认值为 true。
 * @property cascadeOpacity
 * @deprecated since v2.0
 * @type {Boolean}
 */

/**
 * !#en Cascade opacity is removed from v2.0
 * Returns whether node's opacity value affect its child nodes.
 * !#zh 透明度级联功能从 v2.0 开始已移除
 * 返回节点的不透明度值是否影响其子节点。
 * @method isCascadeOpacityEnabled
 * @deprecated since v2.0
 * @returns {Boolean}
 */

/**
 * !#en Cascade opacity is removed from v2.0
 * Enable or disable cascade opacity, if cascade enabled, child nodes' opacity will be the multiplication of parent opacity and its own opacity.
 * !#zh 透明度级联功能从 v2.0 开始已移除
 * 启用或禁用级连不透明度，如果级连启用，子节点的不透明度将是父不透明度乘上它自己的不透明度。
 * @method setCascadeOpacityEnabled
 * @deprecated since v2.0
 * @param {Boolean} cascadeOpacityEnabled
 */

/**
 * !#en Opacity modify RGB have been removed since v2.0
 * Set whether color should be changed with the opacity value,
 * useless in ccsg.Node, but this function is override in some class to have such behavior.
 * !#zh 透明度影响颜色配置已经被废弃
 * 设置更改透明度时是否修改RGB值，
 * @method setOpacityModifyRGB
 * @deprecated since v2.0
 * @param {Boolean} opacityValue
 */

/**
 * !#en Opacity modify RGB have been removed since v2.0
 * Get whether color should be changed with the opacity value.
 * !#zh 透明度影响颜色配置已经被废弃
 * 获取更改透明度时是否修改RGB值。
 * @method isOpacityModifyRGB
 * @deprecated since v2.0
 * @return {Boolean}
 */


let _p = Node.prototype;
js.getset(_p, 'position', _p.getPosition, _p.setPosition, false, true);

cc.Node = module.exports = Node;
