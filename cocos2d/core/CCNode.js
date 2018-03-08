/****************************************************************************
 Copyright (c) 2013-2017 Chukong Technologies Inc.

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

const PrefabHelper = require('./utils/prefab-helper');
const mathPools = require('./utils/math-pools');
const renderEngine = require('engine-next');
const affineTrans = require('./value-types/CCAffineTransform');
const math = renderEngine.math;
const eventManager = require('./event-manager');

const Flags = cc.Object.Flags;
const Destroying = Flags.Destroying;

const POSITION_CHANGED = 'position-changed';
const SIZE_CHANGED = 'size-changed';
const ANCHOR_CHANGED = 'anchor-changed';
const ROTATION_CHANGED = 'rotation-changed';
const SCALE_CHANGED = 'scale-changed';
const CHILD_REORDER = 'child-reorder';

const ERR_INVALID_NUMBER = CC_EDITOR && 'The %s is invalid';
const ONE_DEGREE = Math.PI / 180;

const macro = require('./platform/CCMacro');
const Misc = require('./utils/misc');
const Event = require('./event/event');
//var RegisteredInEditor = Flags.RegisteredInEditor;

var ActionManagerExist = !!cc.ActionManager;
var emptyFunc = function () {};
var _mat4_temp = math.mat4.create();
var _vec3_temp = math.vec3.create();
var _quat_temp = math.quat.create();
var _globalOrderOfArrival = 1;

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
     * !#zh 当手指在屏幕上目标节点区域内移动时。
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
        if (CC_JSB) {
            event = Event.EventTouch.pool.get(event);
        }
        event.type = EventType.TOUCH_START;
        event.touch = touch;
        event.bubbles = true;
        node.dispatchEvent(event);
        if (CC_JSB) {
            event.touch = null;
            event._touches = null;
            Event.EventTouch.pool.put(event);
        }
        return true;
    }
    return false;
};
var _touchMoveHandler = function (touch, event) {
    if (CC_JSB) {
        event = Event.EventTouch.pool.get(event);
    }
    var node = this.owner;
    event.type = EventType.TOUCH_MOVE;
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
    if (CC_JSB) {
        event.touch = null;
        event._touches = null;
        Event.EventTouch.pool.put(event);
    }
};
var _touchEndHandler = function (touch, event) {
    if (CC_JSB) {
        event = Event.EventTouch.pool.get(event);
    }
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
    if (CC_JSB) {
        event.touch = null;
        event._touches = null;
        Event.EventTouch.pool.put(event);
    }
};

var _mouseDownHandler = function (event) {
    var pos = event.getLocation();
    var node = this.owner;

    if (node._hitTest(pos, this)) {
        if (CC_JSB) {
            // jsb event will be replaced so can be stopped immediately
            event.stopPropagation();
            event = Event.EventMouse.pool.get(event);
        }
        event.type = EventType.MOUSE_DOWN;
        event.bubbles = true;
        node.dispatchEvent(event);
        if (CC_JSB) {
            Event.EventMouse.pool.put(event);
        }
        else {
            event.stopPropagation();
        }
    }
};
var _mouseMoveHandler = function (event) {
    var pos = event.getLocation();
    var node = this.owner;
    var hit = node._hitTest(pos, this);
    if (CC_JSB && (hit || this._previousIn)) {
        // jsb event will be replaced so can be stopped immediately
        event.stopPropagation();
        event = Event.EventMouse.pool.get(event);
    }
    if (hit) {
        if (!this._previousIn) {
            // Fix issue when hover node switched, previous hovered node won't get MOUSE_LEAVE notification
            if (_currentHovered) {
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
    if (CC_JSB) {
        Event.EventMouse.pool.put(event);
    }
    else {
        event.stopPropagation();
    }
};
var _mouseUpHandler = function (event) {
    var pos = event.getLocation();
    var node = this.owner;

    if (node._hitTest(pos, this)) {
        if (CC_JSB) {
            // jsb event will be replaced so can be stopped immediately
            event.stopPropagation();
            event = Event.EventMouse.pool.get(event);
        }
        event.type = EventType.MOUSE_UP;
        event.bubbles = true;
        node.dispatchEvent(event);
        if (CC_JSB) {
            Event.EventMouse.pool.put(event);
        }
        else {
            event.stopPropagation();
        }
    }
};
var _mouseWheelHandler = function (event) {
    var pos = event.getLocation();
    var node = this.owner;

    if (node._hitTest(pos, this)) {
        //FIXME: separate wheel event and other mouse event.
        if (CC_JSB) {
            // jsb event will be replaced so can be stopped immediately
            event.stopPropagation();
            event = Event.EventMouse.pool.get(event);
        }
        event.type = EventType.MOUSE_WHEEL;
        event.bubbles = true;
        node.dispatchEvent(event);
        if (CC_JSB) {
            Event.EventMouse.pool.put(event);
        }
        else {
            event.stopPropagation();
        }
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

// function updateOrder (node) {
//     node._parent._delaySort();
    //eventManager._setDirtyForNode(node);
// }

/**
 * !#en
 * Class of all entities in Cocos Creator scenes.<br/>
 * Node also inherits from {{#crossLink "EventTarget"}}Event Target{{/crossLink}}, it permits Node to dispatch events.
 * For events supported by Node, please refer to {{#crossLink "Node.EventType"}}{{/crossLink}}
 * !#zh
 * Cocos Creator 场景中的所有节点类。节点也继承了 {{#crossLink "EventTarget"}}EventTarget{{/crossLink}}，它允许节点发送事件。<br/>
 * 支持的节点事件，请参阅 {{#crossLink "Node.EventType"}}{{/crossLink}}。
 * @class Node
 * @constructor
 * @param {String} name
 * @extends _BaseNode
 */
var Node = cc.Class({
    name: 'cc.Node',
    extends: require('./utils/base-node'),

    properties: {
        // SERIALIZABLE
        _opacity: 255,
        _color: cc.Color.WHITE,
        _cascadeOpacityEnabled: true,
        _contentSize: cc.Size,
        _anchorPoint: cc.v2(0.5, 0.5),
        _position: cc.Vec3,
        _scaleX: {
            default: undefined,
            type: cc.Float
        },
        _scaleY: {
            default: undefined,
            type: cc.Float
        },
        _scale: cc.Vec3,
        _rotationX: 0.0,
        _rotationY: 0.0,
        _skewX: 0.0,
        _skewY: 0.0,
        _localZOrder: 0,
        // _globalZOrder: 0,
        _opacityModifyRGB: false,

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
                this.emit('group-changed');
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
                        this._localMatDirty = true;
                        
                        // fast check event
                        var cache = this._hasListenerCache;
                        if (cache && cache[POSITION_CHANGED]) {
                            // send event
                            if (CC_EDITOR) {
                                this.emit(POSITION_CHANGED, new cc.Vec2(oldValue, localPosition.y));
                            }
                            else {
                                this.emit(POSITION_CHANGED);
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
                        this._localMatDirty = true;

                        // fast check event
                        var cache = this._hasListenerCache;
                        if (cache && cache[POSITION_CHANGED]) {
                            // send event
                            if (CC_EDITOR) {
                                this.emit(POSITION_CHANGED, new cc.Vec2(localPosition.x, oldValue));
                            }
                            else {
                                this.emit(POSITION_CHANGED);
                            }
                        }
                    }
                    else {
                        cc.error(ERR_INVALID_NUMBER, 'new y');
                    }
                }
            },
        },
        
        z: {
            get () {
                return this._position.z;
            },
            set (value) {
                var localPosition = this._position;
                if (value !== localPosition.z) {
                    if (!CC_EDITOR || isFinite(value)) {
                        localPosition.z = value;
                        this._localMatDirty = true;
                    }
                    else {
                        cc.error(ERR_INVALID_NUMBER, 'new z');
                    }
                }
            },
        },

        /**
         * !#en Rotation of node.
         * !#zh 该节点旋转角度。
         * @property rotation
         * @type {Number}
         * @example
         * node.rotation = 90;
         * cc.log("Node Rotation: " + node.rotation);
         */
        rotation: {
            get () {
                if (this._rotationX !== this._rotationY) 
                    cc.logID(1602);
                return this._rotationX;
            },
            set (value) {
                if (this._rotationX !== value || this._rotationY !== value) {
                    this._rotationX = this._rotationY = value;
                    // Update quaternion from rotation
                    math.quat.fromEuler(this._quat, 0, 0, -this._rotationX);
                    this._localMatDirty = true;

                    var cache = this._hasListenerCache;
                    if (cache && cache[ROTATION_CHANGED]) {
                        this.emit(ROTATION_CHANGED);
                    }
                }
            }
        },

        /**
         * !#en Rotation on x axis.
         * !#zh 该节点 X 轴旋转角度。
         * @property rotationX
         * @type {Number}
         * @example
         * node.rotationX = 45;
         * cc.log("Node Rotation X: " + node.rotationX);
         */
        rotationX: {
            get () {
                return this._rotationX;
            },
            set (value) {
                if (this._rotationX !== value) {
                    this._rotationX = value;
                    // Update quaternion from rotation
                    if (this._rotationX === this._rotationY) {
                        math.quat.fromEuler(this._quat, 0, 0, -this._rotationX);
                    }
                    else {
                        math.quat.fromEuler(this._quat, this._rotationX, this._rotationY, 0);
                    }
                    this._localMatDirty = true;

                    var cache = this._hasListenerCache;
                    if (cache && cache[ROTATION_CHANGED]) {
                        this.emit(ROTATION_CHANGED);
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
         * node.rotationY = 45;
         * cc.log("Node Rotation Y: " + node.rotationY);
         */
        rotationY: {
            get () {
                return this._rotationY;
            },
            set (value) {
                if (this._rotationY !== value) {
                    this._rotationY = value;
                    // Update quaternion from rotation
                    if (this._rotationX === this._rotationY) {
                        math.quat.fromEuler(this._quat, 0, 0, -this._rotationX);
                    }
                    else {
                        math.quat.fromEuler(this._quat, this._rotationX, this._rotationY, 0);
                    }
                    this._localMatDirty = true;

                    var cache = this._hasListenerCache;
                    if (cache && cache[ROTATION_CHANGED]) {
                        this.emit(ROTATION_CHANGED);
                    }
                }
            },
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
                    this._localMatDirty = true;

                    var cache = this._hasListenerCache;
                    if (cache && cache[SCALE_CHANGED]) {
                        this.emit(SCALE_CHANGED);
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
                    this._localMatDirty = true;

                    var cache = this._hasListenerCache;
                    if (cache && cache[SCALE_CHANGED]) {
                        this.emit(SCALE_CHANGED);
                    }
                }
            },
        },

        /**
         * !#en Skew x
         * !#zh 该节点 Y 轴倾斜角度。
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
                this._localMatDirty = true;
            }
        },

        /**
         * !#en Skew y
         * !#zh 该节点 X 轴倾斜角度。
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
                this._localMatDirty = true;
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
                    this._color.a = value;
                }
            },
            range: [0, 255]
        },

        /**
         * !#en Indicate whether node's opacity value affect its child nodes, default value is true.
         * !#zh 节点的不透明度值是否影响其子节点，默认值为 true。
         * @property cascadeOpacity
         * @type {Boolean}
         * @example
         * cc.log("CascadeOpacity: " + node.cascadeOpacity);
         */
        cascadeOpacity: {
            get () {
                return this._cascadeOpacityEnabled;
            },
            set (value) {
                if (this._cascadeOpacityEnabled !== value) {
                    this._cascadeOpacityEnabled = value;
                }
            },
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
                    this._color.fromColor(value);
                    if (CC_DEV && value.a !== 255) {
                        cc.warnID(1626);
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
                    this.emit(ANCHOR_CHANGED);
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
                    this.emit(ANCHOR_CHANGED);
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
                    if (CC_EDITOR) {
                        this.emit(SIZE_CHANGED, clone);
                    }
                    else {
                        this.emit(SIZE_CHANGED);
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
                    if (CC_EDITOR) {
                        this.emit(SIZE_CHANGED, clone);
                    }
                    else {
                        this.emit(SIZE_CHANGED);
                    }
                }
            },
        },

        /**
         * !#en Z order in depth which stands for the drawing order.
         * !#zh 该节点渲染排序的 Z 轴深度。
         * @property zIndex
         * @type {Number}
         * @example
         * node.zIndex = 1;
         * cc.log("Node zIndex: " + node.zIndex);
         */
        zIndex: {
            get () {
                // high bits for zIndex, lower bits for arrival order
                return (this._localZOrder & 0xffff0000) >> 16;
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

                var zIndex = (this._localZOrder & 0xffff0000) >> 16;
                if (zIndex !== value) {
                    this._localZOrder = (this._localZOrder & 0x0000ffff) | (value << 16);

                    if (this._parent) {
                        this._parent._delaySort();
                    }
                }
            }
        },

        //properties moved from base node end
    },

    /**
     * @method constructor
     * @param {String} [name]
     */
    ctor (name) {
        this._reorderChildDirty = false;
        
        // cache component
        this._widget = null;
        this._renderComponent = null;
        // Touch event listener
        this._touchListener = null;
        // Mouse event listener
        this._mouseListener = null;

        // default scale
        this._scale.x = 1;
        this._scale.y = 1;
        this._scale.z = 1;
        // Quaternion for rotation
        this._quat = mathPools.quat.get();

        this._matrix = mathPools.mat4.get();
        this._worldMatrix = mathPools.mat4.get();
        this._localMatDirty = true;
        this._worldMatDirty = true;

        this._cullingMask = 1;
        this._inheritMask = 1;
    },

    statics: {
        // is node but not scene
        isNode (obj) {
            return obj instanceof Node && (obj.constructor === Node || !(obj instanceof cc.Scene));
        }
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

        // Recycle math objects
        mathPools.quat.put(this._quat);
        mathPools.mat4.put(this._matrix);
        mathPools.mat4.put(this._worldMatrix);

        if (this._reorderChildDirty) {
            cc.director.__fastOff(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
        }

        eventManager.removeListeners(this);

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
            // activate
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
        this._onHierarchyChangedBase(oldParent);
        cc._widgetManager._nodesOrderDirty = true;
    },

    // INTERNAL

    /*
     * The initializer for Node which will be called before all components onLoad
     */
    _onBatchCreated () {
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
        // TODO: remove _rotationX & _rotationY in future version, 3.0 ?
        // Update quaternion from rotation
        if (this._rotationX === this._rotationY) {
            math.quat.fromEuler(this._quat, 0, 0, -this._rotationX);
        }
        else {
            math.quat.fromEuler(this._quat, this._rotationX, this._rotationY, 0);
        }

        var prefabInfo = this._prefab;
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

        var children = this._children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i]._onBatchCreated();
        }
    },

    // the same as _onBatchCreated but untouch prefab
    _onBatchRestored () {
        if (!this._activeInHierarchy) {
            // deactivate ActionManager and EventManager by default
            if (ActionManagerExist) {
                cc.director.getActionManager().pauseTarget(this);
            }
            eventManager.pauseTarget(this);
        }

        var children = this._children;
        for (var i = 0, len = children.length; i < len; i++) {
            children[i]._onBatchRestored();
        }
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
     * 在节点上注册指定类型的回调函数，也可以设置 target 用于绑定响应函数的 this 对象。<br/>
     * 同时您可以将事件派发到父节点或者通过调用 stopPropagation 拦截它。<br/>
     * 推荐使用这种方式来监听节点上的触摸或鼠标事件，请不要在节点上直接使用 cc.eventManager。
     * @method on
     * @param {String} type - A string representing the event type to listen for.<br>
     *                        See {{#crossLink "Node/position-changed:event"}}Node Events{{/crossLink}} for all builtin events.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {Event} callback.event event
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null
     * @param {Boolean} [useCapture=false] - When set to true, the capture argument prevents callback
     *                              from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE.
     *                              When false, callback will NOT be invoked when event's eventPhase attribute value is CAPTURING_PHASE.
     *                              Either way, callback will be invoked when event's eventPhase attribute value is AT_TARGET.
     * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
     * @typescript
     * on(type: string, callback: (event: Event.EventCustom) => void, target?: any, useCapture?: boolean): (event: Event.EventCustom) => void
     * on<T>(type: string, callback: (event: T) => void, target?: any, useCapture?: boolean): (event: T) => void
     * @example
     * this.node.on(cc.Node.EventType.TOUCH_START, this.memberFunction, this);  // if "this" is component and the "memberFunction" declared in CCClass.
     * node.on(cc.Node.EventType.TOUCH_START, callback, this.node);
     * node.on(cc.Node.EventType.TOUCH_MOVE, callback, this.node);
     * node.on(cc.Node.EventType.TOUCH_END, callback, this.node);
     * node.on(cc.Node.EventType.TOUCH_CANCEL, callback, this.node);
     * node.on("anchor-changed", callback, this);
     */
    on (type, callback, target, useCapture) {
        var newAdded = false;
        if (_touchEvents.indexOf(type) !== -1) {
            if (!this._touchListener) {
                this._touchListener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    owner: this,
                    mask: _searchMaskInParent(this),
                    onTouchBegan: _touchStartHandler,
                    onTouchMoved: _touchMoveHandler,
                    onTouchEnded: _touchEndHandler
                });
                eventManager.addListener(this._touchListener, this);
                newAdded = true;
            }
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
        }
        if (newAdded && !this._activeInHierarchy) {
            cc.director.getScheduler().schedule(function () {
                if (!this._activeInHierarchy) {
                    eventManager.pauseTarget(this);
                }
            }, this, 0, 0, 0, false);
        }

        return this._EventTargetOn(type, callback, target, useCapture);
    },

    /**
     * !#en
     * Removes the callback previously registered with the same type, callback, target and or useCapture.
     * This method is merely an alias to removeEventListener.
     * !#zh 删除之前与同类型，回调，目标或 useCapture 注册的回调。
     * @method off
     * @param {String} type - A string representing the event type being removed.
     * @param {Function} callback - The callback to remove.
     * @param {Object} [target] - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
     * @param {Boolean} [useCapture=false] - Specifies whether the callback being removed was registered as a capturing callback or not.
     *                              If not specified, useCapture defaults to false. If a callback was registered twice,
     *                              one with capture and one without, each must be removed separately. Removal of a capturing callback
     *                              does not affect a non-capturing version of the same listener, and vice versa.
     * @example
     * this.node.off(cc.Node.EventType.TOUCH_START, this.memberFunction, this);
     * node.off(cc.Node.EventType.TOUCH_START, callback, this.node);
     * node.off("anchor-changed", callback, this);
     */
    off (type, callback, target, useCapture) {
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
    targetOff (target) {
        this._EventTargetTargetOff(target);

        this._checkTouchListeners();
        this._checkMouseListeners();
    },

    /**
     * !#en Pause node related system events registered with the current Node. Node system events includes touch and mouse events.
     * If recursive is set to true, then this API will pause the node system events for the node and all nodes in its sub node tree.
     * Reference: http://cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/internal-events/
     * !#zh 暂停当前节点上注册的所有节点系统事件，节点系统事件包含触摸和鼠标事件。
     * 如果传递 recursive 为 true，那么这个 API 将暂停本节点和它的子树上所有节点的节点系统事件。
     * 参考：http://cocos.com/docs/creator/scripting/internal-events.html
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
     * Reference: http://cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/internal-events/
     * !#zh 恢复当前节点上注册的所有节点系统事件，节点系统事件包含触摸和鼠标事件。
     * 如果传递 recursive 为 true，那么这个 API 将恢复本节点和它的子树上所有节点的节点系统事件。
     * 参考：http://cocos.com/docs/creator/scripting/internal-events.html
     * @method resumeSystemEvents
     * @param {Boolean} recursive - Whether to resume node system events on the sub node tree.
     * @example
     * node.resumeSystemEvents(true);
     */
    resumeSystemEvents (recursive) {
        eventManager.resumeTarget(this, recursive);
    },

    _checkTouchListeners () {
        if (!(this._objFlags & Destroying) && this._touchListener) {
            var i = 0;
            if (this._bubblingListeners) {
                for (; i < _touchEvents.length; ++i) {
                    if (this._bubblingListeners.has(_touchEvents[i])) {
                        return;
                    }
                }
            }
            if (this._capturingListeners) {
                for (; i < _touchEvents.length; ++i) {
                    if (this._capturingListeners.has(_touchEvents[i])) {
                        return;
                    }
                }
            }

            eventManager.removeListener(this._touchListener);
            this._touchListener = null;
        }
    },
    _checkMouseListeners () {
        if (!(this._objFlags & Destroying) && this._mouseListener) {
            var i = 0;
            if (this._bubblingListeners) {
                for (; i < _mouseEvents.length; ++i) {
                    if (this._bubblingListeners.has(_mouseEvents[i])) {
                        return;
                    }
                }
            }
            if (this._capturingListeners) {
                for (; i < _mouseEvents.length; ++i) {
                    if (this._capturingListeners.has(_mouseEvents[i])) {
                        return;
                    }
                }
            }

            if (_currentHovered === this) {
                _currentHovered = null;
            }

            eventManager.removeListener(this._mouseListener);
            this._mouseListener = null;
        }
    },

    _hitTest (point, listener) {
        var w = this.width,
            h = this.height;
        var testPt;
        
        let camera = cc.Camera.findCamera(this);
        if (camera) {
            testPt = camera.getCameraToWorldPoint(point);
        }
        else {
            testPt = cc.v2(point);
        }

        this._updateWorldMatrix();
        math.mat4.invert(_mat4_temp, this._worldMatrix);
        math.vec2.transformMat4(testPt, testPt, _mat4_temp);
        testPt.x += this._anchorPoint.x * this._contentSize.width;
        testPt.y += this._anchorPoint.y * this._contentSize.height;

        if (testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h) {
            if (listener && listener.mask) {
                var mask = listener.mask;
                var parent = this;
                for (var i = 0; parent && i < mask.index; ++i, parent = parent.parent) {
                }
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
    _getCapturingTargets (type, array) {
        var parent = this.parent;
        while (parent) {
            if (parent.hasEventListener(type, true)) {
                array.push(parent);
            }
            parent = parent.parent;
        }
    },

    // Store all bubbling parents that are listening to the same event in the array
    _getBubblingTargets (type, array) {
        var parent = this.parent;
        while (parent) {
            if (parent.hasEventListener(type)) {
                array.push(parent);
            }
            parent = parent.parent;
        }
    },

    // for event manager
    isRunning () {
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

    /**
     * !#en Returns a copy of the position (x, y) of the node in its parent's coordinates.
     * !#zh 获取节点在父节点坐标系中的位置（x, y）。
     * @method getPosition
     * @return {Vec2} The position (x, y) of the node in its parent's coordinates
     * @example
     * cc.log("Node Position: " + node.getPosition());
     */
    getPosition () {
        return new cc.Vec2(this._position);
    },

    /**
     * !#en
     * Sets the position (x, y) of the node in its parent's coordinates.<br/>
     * Usually we use cc.v2(x, y) to compose cc.Vec2 object.<br/>
     * and Passing two numbers (x, y) is more efficient than passing cc.Vec2 object.
     * !#zh
     * 设置节点在父节点坐标系中的位置。<br/>
     * 可以通过两种方式设置坐标点：<br/>
     * 1. 传入 2 个数值 x 和 y。<br/>
     * 2. 传入 cc.v2(x, y) 类型为 cc.Vec2 的对象。
     * @method setPosition
     * @param {Vec2|Number} newPosOrX - X coordinate for position or the position (x, y) of the node in coordinates
     * @param {Number} [y] - Y coordinate for position
     * @example {@link utils/api/engine/docs/cocos2d/core/utils/base-node/setPosition.js}
     */
    setPosition (newPosOrX, y) {
        var x;
        if (typeof y === 'undefined') {
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
            var oldPosition = new cc.Vec2(locPosition);
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
        this._localMatDirty = true;

        // fast check event
        var cache = this._hasListenerCache;
        if (cache && cache[POSITION_CHANGED]) {
            // send event
            if (CC_EDITOR) {
                this.emit(POSITION_CHANGED, oldPosition);
            }
            else {
                this.emit(POSITION_CHANGED);
            }
        }
    },

    /**
     * !#en
     * Returns the scale factor of the node.
     * Assertion will fail when scale x != scale y.
     * !#zh 获取节点的缩放。当 X 轴和 Y 轴有相同的缩放数值时。
     * @method getScale
     * @return {Number} The scale factor
     * @example
     * cc.log("Node Scale: " + node.getScale());
     */
    getScale () {
        if (this._scale.x !== this._scale.y)
            cc.logID(1603);
        return this._scale.x;
    },

    /**
     * !#en Sets the scale factor of the node. 1.0 is the default scale factor. This function can modify the X and Y scale at the same time.
     * !#zh 设置节点的缩放比例，默认值为 1.0。这个函数可以在同一时间修改 X 和 Y 缩放。
     * @method setScale
     * @param {Number|Vec2} scaleX - scaleX or scale
     * @param {Number} [scaleY]
     * @example
     * node.setScale(cc.v2(1, 1));
     * node.setScale(1, 1);
     */
    setScale (scaleX, scaleY) {
        if (typeof scaleX === 'object') {
            scaleY = scaleX.y;
            scaleX = scaleX.x;
        }
        else {
            scaleY = (scaleY || scaleY === 0) ? scaleY : scaleX;
        }
        if (this._scale.x !== scaleX || this._scale.y !== scaleY) {
            this._scale.x = scaleX;
            this._scale.y = scaleY;
            this._localMatDirty = true;

            var cache = this._hasListenerCache;
            if (cache && cache[SCALE_CHANGED]) {
                this.emit(SCALE_CHANGED);
            }
        }
    },
    
    getWorldPos (out) {
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

    getWorldRot (out) {
        math.quat.copy(out, this._quat);
        let curr = this._parent;
        while (curr) {
            math.quat.mul(out, curr._quat, out);
            curr = curr._parent;
        }
        return out;
    },

    setWorldRot (quat) {
        if (this._parent) {
            this._parent.getWorldRot(this._quat);
            math.quat.conjugate(this._quat, this._quat);
            math.quat.mul(this._quat, this._quat, quat);
            return;
        }
        math.quat.copy(this._quat, quat);
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
     * @param {vec3} pos
     * @param {vec3} [up] - default is (0,1,0)
     */
    lookAt (pos, up) {
        this.getWorldPos(_vec3_temp);
        math.vec3.sub(_vec3_temp, _vec3_temp, pos); // NOTE: we use -z for view-dir
        math.vec3.normalize(_vec3_temp, _vec3_temp);
        math.quat.fromViewUp(_quat_temp, _vec3_temp, up);
    
        this.setWorldRot(_quat_temp);
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
        if (CC_EDITOR) {
            this.emit(SIZE_CHANGED, clone);
        }
        else {
            this.emit(SIZE_CHANGED);
        }
    },

    /**
     * !#en
     * Set whether color should be changed with the opacity value,
     * useless in ccsg.Node, but this function is override in some class to have such behavior.
     * !#zh 设置更改透明度时是否修改RGB值，
     * @method setOpacityModifyRGB
     * @param {Boolean} opacityValue
     * @example
     * node.setOpacityModifyRGB(true);
     */
    setOpacityModifyRGB (opacityValue) {
        if (this._opacityModifyRGB !== opacityValue) {
            this._opacityModifyRGB = opacityValue;
        }
    },

    /**
     * !#en Get whether color should be changed with the opacity value.
     * !#zh 更改透明度时是否修改RGB值。
     * @method isOpacityModifyRGB
     * @return {Boolean}
     * @example
     * var hasChange = node.isOpacityModifyRGB();
     */
    isOpacityModifyRGB () {
        return this._opacityModifyRGB;
    },

    /*
     * !#en
     * Defines the oder in which the nodes are renderer.
     * Nodes that have a Global Z Order lower, are renderer first.
     * <br/>
     * In case two or more nodes have the same Global Z Order, the oder is not guaranteed.
     * The only exception if the Nodes have a Global Z Order == 0. In that case, the Scene Graph order is used.
     * <br/>
     * By default, all nodes have a Global Z Order = 0. That means that by default, the Scene Graph order is used to render the nodes.
     * <br/>
     * Global Z Order is useful when you need to render nodes in an order different than the Scene Graph order.
     * <br/>
     * Limitations: Global Z Order can't be used used by Nodes that have SpriteBatchNode as one of their ancestors.
     * And if ClippingNode is one of the ancestors, then "global Z order" will be relative to the ClippingNode.
     * !#zh
     * 定义节点的渲染顺序。
     * 节点具有全局 Z 顺序，顺序越小的节点，最先渲染。
     * </br>
     * 假设两个或者更多的节点拥有相同的全局 Z 顺序，那么渲染顺序无法保证。
     * 唯一的例外是如果节点的全局 Z 顺序为零，那么场景中的顺序是可以使用默认的。
     * </br>
     * 所有的节点全局 Z 顺序都是零。这就是说，默认使用场景中的顺序来渲染节点。
     * </br>
     * 全局 Z 顺序是非常有用的当你需要渲染节点按照不同的顺序而不是场景顺序。
     * </br>
     * 局限性: 全局 Z 顺序不能够被拥有继承 “SpriteBatchNode” 的节点使用。
     * 并且如果 “ClippingNode” 是其中之一的上代，那么 “global Z order” 将会和 “ClippingNode” 有关。
     * @method setGlobalZOrder
     * @param {Number} globalZOrder
     * @example
     * node.setGlobalZOrder(0);
     */
    // setGlobalZOrder (globalZOrder) {
    //     this._globalZOrder = globalZOrder;
    // },

    /*
     * !#en Return the Node's Global Z Order.
     * !#zh 获取节点的全局 Z 顺序。
     * @method getGlobalZOrder
     * @returns {number} The node's global Z order
     * @example
     * cc.log("Global Z Order: " + node.getGlobalZOrder());
     */
    // getGlobalZOrder () {
    //     return this._globalZOrder;
    // },

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
        return cc.p(this._anchorPoint);
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
        this.emit(ANCHOR_CHANGED);
    },

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
     * @deprecated please use opacity property, cascade opacity is removed
     * @example
     * var displayOpacity = node.getDisplayedOpacity();
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
     * @deprecated please use color property, cascade color is not supported
     * @example
     * var displayColor = node.getDisplayedColor();
     */

    _updateLocalMatrix () {
        if (this._localMatDirty) {
            // Update transform
            let t = this._matrix;
            math.mat4.fromRTS(t, this._quat, this._position, this._scale);

            // skew
            if (this._skewX || this._skewY) {
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
            this._localMatDirty = false;
            // Register dirty status of world matrix so that it can be recalculated
            this._worldMatDirty = true;
        }
    },

    _calculWorldMatrix () {
        // Avoid as much function call as possible
        if (this._localMatDirty) {
            this._updateLocalMatrix();
        }
        // Assume parent world matrix is correct
        if (this._parent) {
            let parentMat = this._parent._worldMatrix;
            math.mat4.mul(this._worldMatrix, parentMat, this._matrix);
        }
        else {
            math.mat4.copy(this._worldMatrix, this._matrix);
        }
        this._worldMatDirty = false;

        for (let i = 0, len = this._children.length; i < len; ++i) {
            let child = this._children[i];
            child._calculWorldMatrix();
        }
    },

    _updateWorldMatrix () {
        let curr = this;
        let changedRoot = null;
        while (curr) {
            if (curr._localMatDirty || curr._worldMatDirty) {
                changedRoot = curr;
            }
            curr = curr._parent;
        }
        if (changedRoot) {
            changedRoot._calculWorldMatrix();
        }
    },

    /**
     * !#en
     * Get the local transform matrix (4x4), based on parent node coordinates
     * !#zh 返回局部空间坐标系的矩阵，基于父节点坐标系。
     * @method getLocalMatrix
     * @param {vmath.mat4} out The matrix object to be filled with data
     * @return {vmath.mat4} Same as the out matrix object
     * @example
     * let mat4 = vmath.mat4.create();
     * node.getLocalMatrix(mat4);
     */
    getLocalMatrix (out) {
        this._updateLocalMatrix();
        math.mat4.copy(out, this._matrix);
    },
    
    /**
     * !#en
     * Get the local transform matrix (4x4), based on parent node coordinates
     * !#zh 返回局部空间坐标系的矩阵，基于父节点坐标系。
     * @method getLocalMatrix
     * @param {vmath.mat4} out The matrix object to be filled with data
     * @return {vmath.mat4} Same as the out matrix object
     * @example
     * let mat4 = vmath.mat4.create();
     * node.getLocalMatrix(mat4);
     */
    getWorldMatrix (out) {
        this._updateWorldMatrix();
        math.mat4.copy(out, this._worldMatrix);
    },
    
    /**
     * !#en
     * Returns the matrix that transform the node's (local) space coordinates into the parent's space coordinates.<br/>
     * The matrix is in Pixels.
     * !#zh 返回这个将节点（局部）的空间坐标系转换成父节点的空间坐标系的矩阵。这个矩阵以像素为单位。
     * @method getNodeToParentTransform
     * @param {AffineTransform} out The affine transform object to be filled with data
     * @return {AffineTransform} Same as the out affine transform object
     * @example
     * let affineTransform = cc.affineTransformMake();
     * node.getNodeToParentTransform(affineTransform);
     */
    getNodeToParentTransform (out) {
        if (!out) {
            out = affineTrans.makeIdentity();
        }
        this._updateLocalMatrix();
               
        var contentSize = this._contentSize;
        _vec3_temp.x = -this._anchorPoint.x * contentSize.width;
        _vec3_temp.y = -this._anchorPoint.y * contentSize.height;

        math.mat4.copy(_mat4_temp, this._matrix);
        math.mat4.translate(_mat4_temp, _mat4_temp, _vec3_temp);
        return affineTrans.fromMatrix(_mat4_temp, out);
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
     * @param {AffineTransform} out The affine transform object to be filled with data
     * @return {AffineTransform} Same as the out affine transform object
     * @example
     * let affineTransform = cc.affineTransformMake();
     * node.getNodeToParentTransformAR(affineTransform);
     */
    getNodeToParentTransformAR (out) {
        if (!out) {
            out = affineTrans.makeIdentity();
        }
        this._updateLocalMatrix();
        return affineTrans.fromMatrix(this._matrix, out);
    },

    /**
     * !#en Returns the world affine transform matrix. The matrix is in Pixels.
     * !#zh 返回节点到世界坐标系的仿射变换矩阵。矩阵单位是像素。
     * @method getNodeToWorldTransform
     * @param {AffineTransform} out The affine transform object to be filled with data
     * @return {AffineTransform} Same as the out affine transform object
     * @example
     * let affineTransform = cc.affineTransformMake();
     * node.getNodeToWorldTransform(affineTransform);
     */
    getNodeToWorldTransform (out) {
        if (!out) {
            out = affineTrans.makeIdentity();
        }
        this._updateWorldMatrix();
        
        var contentSize = this._contentSize;
        _vec3_temp.x = -this._anchorPoint.x * contentSize.width;
        _vec3_temp.y = -this._anchorPoint.y * contentSize.height;

        math.mat4.copy(_mat4_temp, this._worldMatrix);
        math.mat4.translate(_mat4_temp, _mat4_temp, _vec3_temp);

        return affineTrans.fromMatrix(_mat4_temp, out);
    },

    /**
     * !#en
     * Returns the world affine transform matrix. The matrix is in Pixels.<br/>
     * This method is AR (Anchor Relative).
     * !#zh
     * 返回节点到世界坐标仿射变换矩阵。矩阵单位是像素。<br/>
     * 该方法基于节点坐标。
     * @method getNodeToWorldTransformAR
     * @param {AffineTransform} out The affine transform object to be filled with data
     * @return {AffineTransform} Same as the out affine transform object
     * @example
     * let affineTransform = cc.affineTransformMake();
     * node.getNodeToWorldTransformAR(affineTransform);
     */
    getNodeToWorldTransformAR (out) {
        if (!out) {
            out = affineTrans.makeIdentity();
        }
        this._updateWorldMatrix();
        return affineTrans.fromMatrix(this._matrix, out);
    },

    /**
     * !#en
     * Returns the matrix that transform parent's space coordinates to the node's (local) space coordinates.<br/>
     * The matrix is in Pixels. The returned transform is readonly and cannot be changed.
     * !#zh
     * 返回将父节点的坐标系转换成节点（局部）的空间坐标系的矩阵。<br/>
     * 该矩阵以像素为单位。返回的矩阵是只读的，不能更改。
     * @method getParentToNodeTransform
     * @param {AffineTransform} out The affine transform object to be filled with data
     * @return {AffineTransform} Same as the out affine transform object
     * @example
     * let affineTransform = cc.affineTransformMake();
     * node.getParentToNodeTransform(affineTransform);
     */
    getParentToNodeTransform (out) {
        if (!out) {
            out = affineTrans.makeIdentity();
        }
        this._updateLocalMatrix();
        math.mat4.invert(_mat4_temp, this._matrix);
        return affineTrans.fromMatrix(_mat4_temp, out);
    },

    /**
     * !#en Returns the inverse world affine transform matrix. The matrix is in Pixels.
     * !#en 返回世界坐标系到节点坐标系的逆矩阵。
     * @method getWorldToNodeTransform
     * @param {AffineTransform} out The affine transform object to be filled with data
     * @return {AffineTransform} Same as the out affine transform object
     * @example
     * let affineTransform = cc.affineTransformMake();
     * node.getWorldToNodeTransform(affineTransform);
     */
    getWorldToNodeTransform (out) {
        if (!out) {
            out = affineTrans.makeIdentity();
        }
        this._updateWorldMatrix();
        math.mat4.invert(_mat4_temp, this._worldMatrix);
        return affineTrans.fromMatrix(_mat4_temp, out);
    },

    /**
     * !#en Converts a Point to node (local) space coordinates. The result is in Vec2.
     * !#zh 将一个点转换到节点 (局部) 坐标系。结果以 Vec2 为单位。
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
     * !#en Converts a Point to world space coordinates. The result is in Points.
     * !#zh 将一个点转换到世界空间坐标系。结果以 Vec2 为单位。
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
     * Converts a Point to node (local) space coordinates. The result is in Points.<br/>
     * treating the returned/received node point as anchor relative.
     * !#zh
     * 将一个点转换到节点 (局部) 空间坐标系。结果以 Vec2 为单位。<br/>
     * 返回值将基于节点坐标。
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
     * Converts a local Point to world space coordinates.The result is in Points.<br/>
     * treating the returned/received node point as anchor relative.
     * !#zh
     * 将一个点转换到世界空间坐标系。结果以 Vec2 为单位。<br/>
     * 返回值将基于世界坐标。
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

    /**
     * !#en convenience methods which take a cc.Touch instead of cc.Vec2.
     * !#zh 将触摸点转换成本地坐标系中位置。
     * @method convertTouchToNodeSpace
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
        return affineTrans.rectApplyMat4(rect, this._matrix, rect);
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
        affineTrans.rectApplyMat4(rect, parentMat, rect);

        //query child's BoundingBox
        if (!this._children)
            return rect;

        var locChildren = this._children;
        for (var i = 0; i < locChildren.length; i++) {
            var child = locChildren[i];
            if (child && child.active) {
                var childRect = child._getBoundingBoxTo(parentMat);
                if (childRect)
                    rect = cc.rectUnion(rect, childRect);
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

        child._updateOrderOfArrival();
        if (zIndex !== undefined) {
            child.zIndex = zIndex;
        }
        if (name !== undefined) {
            child.name = name;
        }
        this._delaySort();
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
                this.emit(CHILD_REORDER);
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

    onRestore: CC_EDITOR && function () {
        this._localMatDirty = true;
        this._worldMatDirty = true;

        this._onRestoreBase();

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

    //functions moved from base node end

});

/**
 * @event position-changed
 * @param {Event.EventCustom} event
 * @param {Vec2} event.detail - The old position, but this parameter is only available in editor!
 */
/**
 * @event size-changed
 * @param {Event.EventCustom} event
 * @param {Size} event.detail - The old size, but this parameter is only available in editor!
 */
/**
 * @event anchor-changed
 * @param {Event.EventCustom} event
 */
/**
 * @event child-added
 * @param {Event.EventCustom} event
 * @param {Node} event.detail - child
 */
/**
 * @event child-removed
 * @param {Event.EventCustom} event
 * @param {Node} event.detail - child
 */
/**
 * @event child-reorder
 * @param {Event.EventCustom} event
 */
/**
 * @event group-changed
 * @param {Event.EventCustom} event
 */

/**
 *
 * @event touchstart
 *
 */

/**
 * !#en The local scale relative to the parent.
 * !#zh 节点相对父节点的缩放。
 * @property scale
 * @type {Number}
 * @example
 * node.scale = 1;
 */

/**
 * !#en Returns the x axis position of the node in cocos2d coordinates.
 * !#zh 获取节点 X 轴坐标。
 * @method getPositionX
 * @return {Number} x - The new position in x axis
 * @example
 * var posX = node.getPositionX();
 */

/**
 * !#en Sets the x axis position of the node in cocos2d coordinates.
 * !#zh 设置节点 X 轴坐标。
 * @method setPositionX
 * @param {Number} x
 * @example
 * node.setPositionX(1);
 */

/**
 * !#en Returns the y axis position of the node in cocos2d coordinates.
 * !#zh 获取节点 Y 轴坐标。
 * @method getPositionY
 * @return {Number}
 * @example
 * var posY = node.getPositionY();
 */

/**
 * !#en Sets the y axis position of the node in cocos2d coordinates.
 * !#zh 设置节点 Y 轴坐标。
 * @method setPositionY
 * @param {Number} y - The new position in y axis
 * @example
 * node.setPositionY(100);
 */

/**
 * !#en Returns the local Z order of this node.
 * !#zh 获取节点局部 Z 轴顺序。
 * @method getLocalZOrder
 * @returns {Number} The local (relative to its siblings) Z order.
 * @example
 * var localZorder = node.getLocalZOrder();
 */

/**
 * !#en
 * LocalZOrder is the 'key' used to sort the node relative to its siblings.                                        <br/>
 *                                                                                                                 <br/>
 * The Node's parent will sort all its children based ont the LocalZOrder value.                                   <br/>
 * If two nodes have the same LocalZOrder, then the node that was added first to the children's array              <br/>
 * will be in front of the other node in the array.                                                                <br/>
 * Also, the Scene Graph is traversed using the "In-Order" tree traversal algorithm ( http://en.wikipedia.org/wiki/Tree_traversal#In-order ) <br/>
 * And Nodes that have LocalZOder values smaller than 0 are the "left" subtree <br/>
 * While Nodes with LocalZOder greater than 0 are the "right" subtree.
 * !#zh
 * LocalZOrder 是 “key” (关键)来分辨节点和它兄弟节点的相关性。
 * 父节点将会通过 LocalZOrder 的值来分辨所有的子节点。
 * 如果两个节点有同样的 LocalZOrder，那么先加入子节点数组的节点将会显示在后加入的节点的前面。
 * 同样的，场景图使用 “In-Order（按顺序）” 遍历数算法来遍历
 * ( http://en.wikipedia.org/wiki/Tree_traversal#In-order ) 并且拥有小于 0 的 LocalZOrder 的值的节点是 “ left ” 子树（左子树）
 * 所以拥有大于 0 的 LocalZOrder 的值得节点是 “ right ”子树（右子树）。
 * @method setLocalZOrder
 * @param {Number} localZOrder
 * @example
 * node.setLocalZOrder(1);
 */

/**
 * !#en Returns whether node's opacity value affect its child nodes.
 * !#zh 返回节点的不透明度值是否影响其子节点。
 * @method isCascadeOpacityEnabled
 * @returns {Boolean}
 * @example
 * cc.log(node.isCascadeOpacityEnabled());
 */

/**
 * !#en Enable or disable cascade opacity, if cascade enabled, child nodes' opacity will be the multiplication of parent opacity and its own opacity.
 * !#zh 启用或禁用级连不透明度，如果级连启用，子节点的不透明度将是父不透明度乘上它自己的不透明度。
 * @method setCascadeOpacityEnabled
 * @param {Boolean} cascadeOpacityEnabled
 * @example
 * node.setCascadeOpacityEnabled(true);
 */

var SameNameGetSets = ['parent', 'tag', 'skewX', 'skewY', 'position', 'rotation', 'rotationX', 'rotationY',
    'scale', 'scaleX', 'scaleY', 'opacity', 'color',];

var DiffNameGetSets = {
    x: ['getPositionX', 'setPositionX'],
    y: ['getPositionY', 'setPositionY'],
    zIndex: ['getLocalZOrder', 'setLocalZOrder'],
    opacityModifyRGB: ['isOpacityModifyRGB', 'setOpacityModifyRGB'],
    cascadeOpacity: ['isCascadeOpacityEnabled', 'setCascadeOpacityEnabled'],
};

Misc.propertyDefine(Node, SameNameGetSets, DiffNameGetSets);

Node.EventType = EventType;

cc.Node = module.exports = Node;
