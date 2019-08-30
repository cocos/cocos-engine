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

const NodeEvent = require('../CCNode').EventType;

const NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED = 5;
const OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;
const EPSILON = 1e-4;
const MOVEMENT_FACTOR = 0.7;

let quintEaseOut = function(time) {
    time -= 1;
    return (time * time * time * time * time + 1);
};

let getTimeInMilliseconds = function() {
    let currentTime = new Date();
    return currentTime.getMilliseconds();
};

/**
 * !#en Enum for ScrollView event type.
 * !#zh 滚动视图事件类型
 * @enum ScrollView.EventType
 */
const EventType = cc.Enum({
    /**
     * !#en The event emmitted when ScrollView scroll to the top boundary of inner container
     * !#zh 滚动视图滚动到顶部边界事件
     * @property {Number} SCROLL_TO_TOP
     */
    SCROLL_TO_TOP : 0,
    /**
     * !#en The event emmitted when ScrollView scroll to the bottom boundary of inner container
     * !#zh 滚动视图滚动到底部边界事件
     * @property {Number} SCROLL_TO_BOTTOM
     */
    SCROLL_TO_BOTTOM : 1,
    /**
     * !#en The event emmitted when ScrollView scroll to the left boundary of inner container
     * !#zh 滚动视图滚动到左边界事件
     * @property {Number} SCROLL_TO_LEFT
     */
    SCROLL_TO_LEFT : 2,
    /**
     * !#en The event emmitted when ScrollView scroll to the right boundary of inner container
     * !#zh 滚动视图滚动到右边界事件
     * @property {Number} SCROLL_TO_RIGHT
     */
    SCROLL_TO_RIGHT : 3,
    /**
     * !#en The event emmitted when ScrollView is scrolling
     * !#zh 滚动视图正在滚动时发出的事件
     * @property {Number} SCROLLING
     */
    SCROLLING : 4,
    /**
     * !#en The event emmitted when ScrollView scroll to the top boundary of inner container and start bounce
     * !#zh 滚动视图滚动到顶部边界并且开始回弹时发出的事件
     * @property {Number} BOUNCE_TOP
     */
    BOUNCE_TOP : 5,
    /**
     * !#en The event emmitted when ScrollView scroll to the bottom boundary of inner container and start bounce
     * !#zh 滚动视图滚动到底部边界并且开始回弹时发出的事件
     * @property {Number} BOUNCE_BOTTOM
     */
    BOUNCE_BOTTOM : 6,
    /**
     * !#en The event emmitted when ScrollView scroll to the left boundary of inner container and start bounce
     * !#zh 滚动视图滚动到左边界并且开始回弹时发出的事件
     * @property {Number} BOUNCE_LEFT
     */
    BOUNCE_LEFT : 7,
    /**
     * !#en The event emmitted when ScrollView scroll to the right boundary of inner container and start bounce
     * !#zh 滚动视图滚动到右边界并且开始回弹时发出的事件
     * @property {Number} BOUNCE_RIGHT
     */
    BOUNCE_RIGHT : 8,
    /**
     * !#en The event emmitted when ScrollView auto scroll ended
     * !#zh 滚动视图滚动结束的时候发出的事件
     * @property {Number} SCROLL_ENDED
     */
    SCROLL_ENDED : 9,
    /**
     * !#en The event emmitted when user release the touch
     * !#zh 当用户松手的时候会发出一个事件
     * @property {Number} TOUCH_UP
     */
    TOUCH_UP : 10,
    /**
     * !#en The event emmitted when ScrollView auto scroll ended with a threshold
     * !#zh 滚动视图自动滚动快要结束的时候发出的事件
     * @property {Number} AUTOSCROLL_ENDED_WITH_THRESHOLD
     */
    AUTOSCROLL_ENDED_WITH_THRESHOLD: 11,
    /**
     * !#en The event emmitted when ScrollView scroll began
     * !#zh 滚动视图滚动开始时发出的事件
     * @property {Number} SCROLL_BEGAN
     */
    SCROLL_BEGAN: 12
});

const eventMap = {
    'scroll-to-top' : EventType.SCROLL_TO_TOP,
    'scroll-to-bottom': EventType.SCROLL_TO_BOTTOM,
    'scroll-to-left' : EventType.SCROLL_TO_LEFT,
    'scroll-to-right' : EventType.SCROLL_TO_RIGHT,
    'scrolling' : EventType.SCROLLING,
    'bounce-bottom' : EventType.BOUNCE_BOTTOM,
    'bounce-left' : EventType.BOUNCE_LEFT,
    'bounce-right' : EventType.BOUNCE_RIGHT,
    'bounce-top' : EventType.BOUNCE_TOP,
    'scroll-ended': EventType.SCROLL_ENDED,
    'touch-up' : EventType.TOUCH_UP,
    'scroll-ended-with-threshold' : EventType.AUTOSCROLL_ENDED_WITH_THRESHOLD,
    'scroll-began': EventType.SCROLL_BEGAN
};

/**
 * !#en
 * Layout container for a view hierarchy that can be scrolled by the user,
 * allowing it to be larger than the physical display.
 *
 * !#zh
 * 滚动视图组件
 * @class ScrollView
 * @extends Component
 */
let ScrollView = cc.Class({
    name: 'cc.ScrollView',
    extends: require('./CCViewGroup'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/ScrollView',
        help: 'i18n:COMPONENT.help_url.scrollview',
        inspector: 'packages://inspector/inspectors/comps/scrollview.js',
        executeInEditMode: false,
    },

    ctor () {
        this._topBoundary = 0;
        this._bottomBoundary = 0;
        this._leftBoundary = 0;
        this._rightBoundary = 0;

        this._touchMoveDisplacements = [];
        this._touchMoveTimeDeltas = [];
        this._touchMovePreviousTimestamp = 0;
        this._touchMoved = false;

        this._autoScrolling = false;
        this._autoScrollAttenuate = false;
        this._autoScrollStartPosition = cc.v2(0, 0);
        this._autoScrollTargetDelta = cc.v2(0, 0);
        this._autoScrollTotalTime = 0;
        this._autoScrollAccumulatedTime = 0;
        this._autoScrollCurrentlyOutOfBoundary = false;
        this._autoScrollBraking = false;
        this._autoScrollBrakingStartPosition = cc.v2(0, 0);

        this._outOfBoundaryAmount = cc.v2(0, 0);
        this._outOfBoundaryAmountDirty = true;
        this._stopMouseWheel = false;
        this._mouseWheelEventElapsedTime = 0.0;
        this._isScrollEndedWithThresholdEventFired = false;
        //use bit wise operations to indicate the direction
        this._scrollEventEmitMask = 0;
        this._isBouncing = false;
        this._scrolling = false;
    },

    properties: {
        /**
         * !#en This is a reference to the UI element to be scrolled.
         * !#zh 可滚动展示内容的节点。
         * @property {Node} content
         */
        content: {
            default: undefined,
            type: cc.Node,
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.content',
            formerlySerializedAs: 'content',
            notify (oldValue) {
                this._calculateBoundary();
            }
        },

        /**
         * !#en Enable horizontal scroll.
         * !#zh 是否开启水平滚动。
         * @property {Boolean} horizontal
         */
        horizontal: {
            default: true,
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.horizontal',
        },

        /**
         * !#en Enable vertical scroll.
         * !#zh 是否开启垂直滚动。
         * @property {Boolean} vertical
         */
        vertical: {
            default: true,
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.vertical',
        },

        /**
         * !#en When inertia is set, the content will continue to move when touch ended.
         * !#zh 是否开启滚动惯性。
         * @property {Boolean} inertia
         */
        inertia: {
            default: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.inertia',
        },

        /**
         * !#en
         * It determines how quickly the content stop moving. A value of 1 will stop the movement immediately.
         * A value of 0 will never stop the movement until it reaches to the boundary of scrollview.
         * !#zh
         * 开启惯性后，在用户停止触摸后滚动多快停止，0表示永不停止，1表示立刻停止。
         * @property {Number} brake
         */
        brake: {
            default: 0.5,
            type: cc.Float,
            range: [0, 1, 0.1],
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.brake',
        },

        /**
         * !#en When elastic is set, the content will be bounce back when move out of boundary.
         * !#zh 是否允许滚动内容超过边界，并在停止触摸后回弹。
         * @property {Boolean} elastic
         */
        elastic: {
            default: true,
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.elastic',
        },

        /**
         * !#en The elapse time of bouncing back. A value of 0 will bounce back immediately.
         * !#zh 回弹持续的时间，0 表示将立即反弹。
         * @property {Number} bounceDuration
         */
        bounceDuration: {
            default: 1,
            range: [0, 10],
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.bounceDuration',
        },

        /**
         * !#en The horizontal scrollbar reference.
         * !#zh 水平滚动的 ScrollBar。
         * @property {Scrollbar} horizontalScrollBar
         */
        horizontalScrollBar: {
            default: undefined,
            type: cc.Scrollbar,
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.horizontal_bar',
            notify () {
                if (this.horizontalScrollBar) {
                    this.horizontalScrollBar.setTargetScrollView(this);
                    this._updateScrollBar(0);
                }
            },
            animatable: false
        },

        /**
         * !#en The vertical scrollbar reference.
         * !#zh 垂直滚动的 ScrollBar。
         * @property {Scrollbar} verticalScrollBar
         */
        verticalScrollBar: {
            default: undefined,
            type: cc.Scrollbar,
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.vertical_bar',
            notify () {
                if (this.verticalScrollBar) {
                    this.verticalScrollBar.setTargetScrollView(this);
                    this._updateScrollBar(0);
                }
            },
            animatable: false
        },

        /**
         * !#en Scrollview events callback
         * !#zh 滚动视图的事件回调函数
         * @property {Component.EventHandler[]} scrollEvents
         */
        scrollEvents: {
            default: [],
            type: cc.Component.EventHandler,
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.scrollEvents'
        },

        /**
         * !#en If cancelInnerEvents is set to true, the scroll behavior will cancel touch events on inner content nodes
         * It's set to true by default.
         * !#zh 如果这个属性被设置为 true，那么滚动行为会取消子节点上注册的触摸事件，默认被设置为 true。
         * 注意，子节点上的 touchstart 事件仍然会触发，触点移动距离非常短的情况下 touchmove 和 touchend 也不会受影响。
         * @property {Boolean} cancelInnerEvents
         */
        cancelInnerEvents: {
            default: true,
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.cancelInnerEvents'
        },

        // private object
        _view: {
            get: function () {
                if (this.content) {
                    return this.content.parent;
                }
            }
        }
    },

    statics: {
        EventType: EventType,
    },

    /**
     * !#en Scroll the content to the bottom boundary of ScrollView.
     * !#zh 视图内容将在规定时间内滚动到视图底部。
     * @method scrollToBottom
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the bottom boundary immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Scroll to the bottom of the view.
     * scrollView.scrollToBottom(0.1);
     */
    scrollToBottom (timeInSecond, attenuated) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(0, 0),
            applyToHorizontal: false,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta, true);
        }
    },

    /**
     * !#en Scroll the content to the top boundary of ScrollView.
     * !#zh 视图内容将在规定时间内滚动到视图顶部。
     * @method scrollToTop
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the top boundary immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Scroll to the top of the view.
     * scrollView.scrollToTop(0.1);
     */
    scrollToTop (timeInSecond, attenuated) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(0, 1),
            applyToHorizontal: false,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * !#en Scroll the content to the left boundary of ScrollView.
     * !#zh 视图内容将在规定时间内滚动到视图左边。
     * @method scrollToLeft
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the left boundary immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Scroll to the left of the view.
     * scrollView.scrollToLeft(0.1);
     */
    scrollToLeft (timeInSecond, attenuated) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(0, 0),
            applyToHorizontal: true,
            applyToVertical: false,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * !#en Scroll the content to the right boundary of ScrollView.
     * !#zh 视图内容将在规定时间内滚动到视图右边。
     * @method scrollToRight
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the right boundary immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Scroll to the right of the view.
     * scrollView.scrollToRight(0.1);
     */
    scrollToRight (timeInSecond, attenuated) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(1, 0),
            applyToHorizontal: true,
            applyToVertical: false,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * !#en Scroll the content to the top left boundary of ScrollView.
     * !#zh 视图内容将在规定时间内滚动到视图左上角。
     * @method scrollToTopLeft
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the top left boundary immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Scroll to the upper left corner of the view.
     * scrollView.scrollToTopLeft(0.1);
     */
    scrollToTopLeft (timeInSecond, attenuated) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(0, 1),
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * !#en Scroll the content to the top right boundary of ScrollView.
     * !#zh 视图内容将在规定时间内滚动到视图右上角。
     * @method scrollToTopRight
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the top right boundary immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Scroll to the top right corner of the view.
     * scrollView.scrollToTopRight(0.1);
     */
    scrollToTopRight (timeInSecond, attenuated) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(1, 1),
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * !#en Scroll the content to the bottom left boundary of ScrollView.
     * !#zh 视图内容将在规定时间内滚动到视图左下角。
     * @method scrollToBottomLeft
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the bottom left boundary immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Scroll to the lower left corner of the view.
     * scrollView.scrollToBottomLeft(0.1);
     */
    scrollToBottomLeft (timeInSecond, attenuated) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(0, 0),
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * !#en Scroll the content to the bottom right boundary of ScrollView.
     * !#zh 视图内容将在规定时间内滚动到视图右下角。
     * @method scrollToBottomRight
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the bottom right boundary immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Scroll to the lower right corner of the view.
     * scrollView.scrollToBottomRight(0.1);
     */
    scrollToBottomRight (timeInSecond, attenuated) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(1, 0),
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    },


    /**
     * !#en Scroll with an offset related to the ScrollView's top left origin, if timeInSecond is omitted, then it will jump to the
     *       specific offset immediately.
     * !#zh 视图内容在规定时间内将滚动到 ScrollView 相对左上角原点的偏移位置, 如果 timeInSecond参数不传，则立即滚动到指定偏移位置。
     * @method scrollToOffset
     * @param {Vec2} offset - A Vec2, the value of which each axis between 0 and maxScrollOffset
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the specific offset of ScrollView immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Scroll to middle position in 0.1 second in x-axis
     * let maxScrollOffset = this.getMaxScrollOffset();
     * scrollView.scrollToOffset(cc.v2(maxScrollOffset.x / 2, 0), 0.1);
     */
    scrollToOffset (offset, timeInSecond, attenuated) {
        let maxScrollOffset = this.getMaxScrollOffset();

        let anchor = cc.v2(0, 0);
        //if maxScrollOffset is 0, then always align the content's top left origin to the top left corner of its parent
        if (maxScrollOffset.x === 0) {
            anchor.x = 0;
        } else {
            anchor.x = offset.x / maxScrollOffset.x;
        }

        if (maxScrollOffset.y === 0) {
            anchor.y = 1;
        } else {
            anchor.y = (maxScrollOffset.y - offset.y ) / maxScrollOffset.y;
        }

        this.scrollTo(anchor, timeInSecond, attenuated);
    },

    /**
     * !#en  Get the positive offset value corresponds to the content's top left boundary.
     * !#zh  获取滚动视图相对于左上角原点的当前滚动偏移
     * @method getScrollOffset
     * @return {Vec2}  - A Vec2 value indicate the current scroll offset.
     */
    getScrollOffset () {
        let topDelta =  this._getContentTopBoundary() - this._topBoundary;
        let leftDeta = this._getContentLeftBoundary() - this._leftBoundary;

        return cc.v2(leftDeta, topDelta);
    },

    /**
     * !#en Get the maximize available  scroll offset
     * !#zh 获取滚动视图最大可以滚动的偏移量
     * @method getMaxScrollOffset
     * @return {Vec2} - A Vec2 value indicate the maximize scroll offset in x and y axis.
     */
    getMaxScrollOffset () {
        let viewSize = this._view.getContentSize();
        let contentSize = this.content.getContentSize();
        let horizontalMaximizeOffset =  contentSize.width - viewSize.width;
        let verticalMaximizeOffset = contentSize.height - viewSize.height;
        horizontalMaximizeOffset = horizontalMaximizeOffset >= 0 ? horizontalMaximizeOffset : 0;
        verticalMaximizeOffset = verticalMaximizeOffset >=0 ? verticalMaximizeOffset : 0;

        return cc.v2(horizontalMaximizeOffset, verticalMaximizeOffset);
    },

    /**
     * !#en Scroll the content to the horizontal percent position of ScrollView.
     * !#zh 视图内容在规定时间内将滚动到 ScrollView 水平方向的百分比位置上。
     * @method scrollToPercentHorizontal
     * @param {Number} percent - A value between 0 and 1.
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the horizontal percent position of ScrollView immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Scroll to middle position.
     * scrollView.scrollToBottomRight(0.5, 0.1);
     */
    scrollToPercentHorizontal (percent, timeInSecond, attenuated) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(percent, 0),
            applyToHorizontal: true,
            applyToVertical: false,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * !#en Scroll the content to the percent position of ScrollView in any direction.
     * !#zh 视图内容在规定时间内进行垂直方向和水平方向的滚动，并且滚动到指定百分比位置上。
     * @method scrollTo
     * @param {Vec2} anchor - A point which will be clamp between cc.v2(0,0) and cc.v2(1,1).
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the percent position of ScrollView immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Vertical scroll to the bottom of the view.
     * scrollView.scrollTo(cc.v2(0, 1), 0.1);
     *
     * // Horizontal scroll to view right.
     * scrollView.scrollTo(cc.v2(1, 0), 0.1);
     */
    scrollTo (anchor, timeInSecond, attenuated) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(anchor),
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * !#en Scroll the content to the vertical percent position of ScrollView.
     * !#zh 视图内容在规定时间内滚动到 ScrollView 垂直方向的百分比位置上。
     * @method scrollToPercentVertical
     * @param {Number} percent - A value between 0 and 1.
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the vertical percent position of ScrollView immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * // Scroll to middle position.
     * scrollView.scrollToPercentVertical(0.5, 0.1);
     */
    scrollToPercentVertical (percent, timeInSecond, attenuated) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(0, percent),
            applyToHorizontal: false,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * !#en  Stop auto scroll immediately
     * !#zh  停止自动滚动, 调用此 API 可以让 Scrollview 立即停止滚动
     * @method stopAutoScroll
     */
    stopAutoScroll () {
        this._autoScrolling = false;
        this._autoScrollAccumulatedTime = this._autoScrollTotalTime;
    },

    /**
     * !#en Modify the content position.
     * !#zh 设置当前视图内容的坐标点。
     * @method setContentPosition
     * @param {Vec2} position - The position in content's parent space.
     */
    setContentPosition (position) {
        if (position.fuzzyEquals(this.getContentPosition(), EPSILON)) {
            return;
        }

        this.content.setPosition(position);
        this._outOfBoundaryAmountDirty = true;
    },

    /**
     * !#en Query the content's position in its parent space.
     * !#zh 获取当前视图内容的坐标点。
     * @method getContentPosition
     * @returns {Vec2} - The content's position in its parent space.
     */
    getContentPosition () {
        return this.content.getPosition();
    },
    
    /**
     * !#en Query whether the user is currently dragging the ScrollView to scroll it
     * !#zh 用户是否在拖拽当前滚动视图
     * @method isScrolling
     * @returns {Boolean} - Whether the user is currently dragging the ScrollView to scroll it
     */
    isScrolling () {
        return this._scrolling;
    },

    /**
     * !#en Query whether the ScrollView is currently scrolling because of a bounceback or inertia slowdown.
     * !#zh 当前滚动视图是否在惯性滚动
     * @method isAutoScrolling
     * @returns {Boolean} - Whether the ScrollView is currently scrolling because of a bounceback or inertia slowdown.
     */
    isAutoScrolling () {
        return this._autoScrolling;
    },
    
    //private methods
    _registerEvent () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
    },

    _unregisterEvent () {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
    },

    _onMouseWheel (event, captureListeners) {
        if (!this.enabledInHierarchy) return;
        if (this._hasNestedViewGroup(event, captureListeners)) return;

        let deltaMove = cc.v2(0, 0);
        let wheelPrecision = -0.1;
        if(CC_JSB || CC_RUNTIME) {
            wheelPrecision = -7;
        }
        if(this.vertical) {
            deltaMove = cc.v2(0, event.getScrollY() * wheelPrecision);
        }
        else if(this.horizontal) {
            deltaMove = cc.v2(event.getScrollY() * wheelPrecision, 0);
        }

        this._mouseWheelEventElapsedTime = 0;
        this._processDeltaMove(deltaMove);

        if(!this._stopMouseWheel) {
            this._handlePressLogic();
            this.schedule(this._checkMouseWheel, 1.0 / 60);
            this._stopMouseWheel = true;
        }

        this._stopPropagationIfTargetIsMe(event);
    },

    _checkMouseWheel (dt) {
        let currentOutOfBoundary = this._getHowMuchOutOfBoundary();
        let maxElapsedTime = 0.1;

        if (!currentOutOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
            this._processInertiaScroll();
            this.unschedule(this._checkMouseWheel);
            this._stopMouseWheel = false;
            return;
        }

        this._mouseWheelEventElapsedTime += dt;

        // mouse wheel event is ended
        if (this._mouseWheelEventElapsedTime > maxElapsedTime) {
            this._onScrollBarTouchEnded();
            this.unschedule(this._checkMouseWheel);
            this._stopMouseWheel = false;
        }
    },

    _calculateMovePercentDelta (options) {
        let anchor = options.anchor;
        let applyToHorizontal = options.applyToHorizontal;
        let applyToVertical = options.applyToVertical;
        this._calculateBoundary();

        anchor = anchor.clampf(cc.v2(0, 0), cc.v2(1, 1));

        let scrollSize = this._view.getContentSize();
        let contentSize = this.content.getContentSize();
        let bottomDeta = this._getContentBottomBoundary() - this._bottomBoundary;
        bottomDeta = -bottomDeta;

        let leftDeta = this._getContentLeftBoundary() - this._leftBoundary;
        leftDeta = -leftDeta;

        let moveDelta = cc.v2(0, 0);
        let totalScrollDelta = 0;
        if (applyToHorizontal) {
            totalScrollDelta = contentSize.width - scrollSize.width;
            moveDelta.x = leftDeta - totalScrollDelta * anchor.x;
        }

        if (applyToVertical) {
            totalScrollDelta = contentSize.height - scrollSize.height;
            moveDelta.y = bottomDeta - totalScrollDelta * anchor.y;
        }

        return moveDelta;
    },

    _moveContentToTopLeft (scrollViewSize) {
        let contentSize = this.content.getContentSize();

        let bottomDeta = this._getContentBottomBoundary() - this._bottomBoundary;
        bottomDeta = -bottomDeta;
        let moveDelta = cc.v2(0, 0);
        let totalScrollDelta = 0;

        let leftDeta = this._getContentLeftBoundary() - this._leftBoundary;
        leftDeta = -leftDeta;

        if (contentSize.height < scrollViewSize.height) {
            totalScrollDelta = contentSize.height - scrollViewSize.height;
            moveDelta.y = bottomDeta - totalScrollDelta;
        }

        if (contentSize.width < scrollViewSize.width) {
            totalScrollDelta = contentSize.width - scrollViewSize.width;
            moveDelta.x = leftDeta;
        }

        this._updateScrollBarState();
        this._moveContent(moveDelta);
        this._adjustContentOutOfBoundary();
    },

    _calculateBoundary () {
        if (this.content) {
            //refresh content size
            let layout = this.content.getComponent(cc.Layout);
            if(layout && layout.enabledInHierarchy) {
                layout.updateLayout();
            }
            let viewSize = this._view.getContentSize();

            let anchorX = viewSize.width * this._view.anchorX;
            let anchorY = viewSize.height * this._view.anchorY;

            this._leftBoundary = -anchorX;
            this._bottomBoundary = -anchorY;

            this._rightBoundary = this._leftBoundary + viewSize.width;
            this._topBoundary = this._bottomBoundary + viewSize.height;

            this._moveContentToTopLeft(viewSize);
        }
    },

    //this is for nested scrollview
    _hasNestedViewGroup (event, captureListeners) {
        if (event.eventPhase !== cc.Event.CAPTURING_PHASE) return;

        if (captureListeners) {
            //captureListeners are arranged from child to parent
            for (let i = 0; i < captureListeners.length; ++i){
                let item = captureListeners[i];

                if (this.node === item) {
                    if (event.target.getComponent(cc.ViewGroup)) {
                        return true;
                    }
                    return false;
                }

                if(item.getComponent(cc.ViewGroup)) {
                    return true;
                }
            }
        }
        return false;
    },

    //This is for Scrollview as children of a Button
    _stopPropagationIfTargetIsMe (event) {
        if (event.eventPhase === cc.Event.AT_TARGET && event.target === this.node) {
            event.stopPropagation();
        }
    },

    // touch event handler
    _onTouchBegan (event, captureListeners) {
        if (!this.enabledInHierarchy) return;
        if (this._hasNestedViewGroup(event, captureListeners)) return;

        let touch = event.touch;
        if (this.content) {
            this._handlePressLogic(touch);
        }
        this._touchMoved = false;
        this._stopPropagationIfTargetIsMe(event);
    },

    _onTouchMoved (event, captureListeners) {
        if (!this.enabledInHierarchy) return;
        if (this._hasNestedViewGroup(event, captureListeners)) return;

        let touch = event.touch;
        if (this.content) {
            this._handleMoveLogic(touch);
        }
        // Do not prevent touch events in inner nodes
        if (!this.cancelInnerEvents) {
            return;
        }

        let deltaMove = touch.getLocation().sub(touch.getStartLocation());
        //FIXME: touch move delta should be calculated by DPI.
        if (deltaMove.mag() > 7) {
            if (!this._touchMoved && event.target !== this.node) {
                // Simulate touch cancel for target node
                let cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
                cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
                cancelEvent.touch = event.touch;
                cancelEvent.simulate = true;
                event.target.dispatchEvent(cancelEvent);
                this._touchMoved = true;
            }
        }
        this._stopPropagationIfTargetIsMe(event);
    },

    _onTouchEnded (event, captureListeners) {
        if (!this.enabledInHierarchy) return;
        if (this._hasNestedViewGroup(event, captureListeners)) return;

        this._dispatchEvent('touch-up');

        let touch = event.touch;
        if (this.content) {
            this._handleReleaseLogic(touch);
        }
        if (this._touchMoved) {
            event.stopPropagation();
        } else {
            this._stopPropagationIfTargetIsMe(event);
        }
    },

    _onTouchCancelled (event, captureListeners) {
        if (!this.enabledInHierarchy) return;
        if (this._hasNestedViewGroup(event, captureListeners)) return;

        // Filte touch cancel event send from self
        if (!event.simulate) {
            let touch = event.touch;
            if(this.content){
                this._handleReleaseLogic(touch);
            }
        }
        this._stopPropagationIfTargetIsMe(event);
    },

    _processDeltaMove (deltaMove) {
        this._scrollChildren(deltaMove);
        this._gatherTouchMove(deltaMove);
    },

    _handleMoveLogic (touch) {
        let deltaMove = touch.getDelta();
        this._processDeltaMove(deltaMove);
    },

    _scrollChildren (deltaMove) {
        deltaMove = this._clampDelta(deltaMove);

        let realMove = deltaMove;
        let outOfBoundary;
        if (this.elastic) {
            outOfBoundary = this._getHowMuchOutOfBoundary();
            realMove.x *= (outOfBoundary.x === 0 ? 1 : 0.5);
            realMove.y *= (outOfBoundary.y === 0 ? 1 : 0.5);
        }

        if (!this.elastic) {
            outOfBoundary = this._getHowMuchOutOfBoundary(realMove);
            realMove = realMove.add(outOfBoundary);
        }

        let scrollEventType = -1;

        if (realMove.y > 0) { //up
            let icBottomPos = this.content.y - this.content.anchorY * this.content.height;

            if (icBottomPos + realMove.y > this._bottomBoundary) {
                scrollEventType = 'scroll-to-bottom';
            }
        }
        else if (realMove.y < 0) { //down
            let icTopPos = this.content.y - this.content.anchorY * this.content.height + this.content.height;

            if (icTopPos + realMove.y <= this._topBoundary) {
                scrollEventType = 'scroll-to-top';
            }
        }
        if (realMove.x < 0) { //left
            let icRightPos = this.content.x - this.content.anchorX * this.content.width + this.content.width;
            if (icRightPos + realMove.x <= this._rightBoundary) {
                scrollEventType = 'scroll-to-right';
            }
        }
        else if (realMove.x > 0) { //right
            let icLeftPos = this.content.x - this.content.anchorX * this.content.width;
            if (icLeftPos + realMove.x >= this._leftBoundary) {
                scrollEventType = 'scroll-to-left';
            }
        }

        this._moveContent(realMove, false);

        if (realMove.x !== 0 || realMove.y !== 0) {
            if (!this._scrolling) {
                this._scrolling = true;
                this._dispatchEvent('scroll-began');
            }
            this._dispatchEvent('scrolling');
        }

        if (scrollEventType !== -1) {
            this._dispatchEvent(scrollEventType);
        }

    },

    _handlePressLogic () {
        if (this._autoScrolling) {
            this._dispatchEvent('scroll-ended');
        }
        this._autoScrolling = false;
        this._isBouncing = false;

        this._touchMovePreviousTimestamp = getTimeInMilliseconds();
        this._touchMoveDisplacements.length = 0;
        this._touchMoveTimeDeltas.length = 0;

        this._onScrollBarTouchBegan();
    },

    _clampDelta (delta) {
        let contentSize = this.content.getContentSize();
        let scrollViewSize = this._view.getContentSize();
        if (contentSize.width < scrollViewSize.width) {
            delta.x = 0;
        }
        if (contentSize.height < scrollViewSize.height) {
            delta.y = 0;
        }

        return delta;
    },

    _gatherTouchMove (delta) {
        delta = this._clampDelta(delta);

        while (this._touchMoveDisplacements.length >= NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED) {
            this._touchMoveDisplacements.shift();
            this._touchMoveTimeDeltas.shift();
        }

        this._touchMoveDisplacements.push(delta);

        let timeStamp = getTimeInMilliseconds();
        this._touchMoveTimeDeltas.push((timeStamp - this._touchMovePreviousTimestamp) / 1000);
        this._touchMovePreviousTimestamp = timeStamp;
    },

    _startBounceBackIfNeeded () {
        if (!this.elastic) {
            return false;
        }

        let bounceBackAmount = this._getHowMuchOutOfBoundary();
        bounceBackAmount = this._clampDelta(bounceBackAmount);

        if (bounceBackAmount.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
            return false;
        }

        let bounceBackTime = Math.max(this.bounceDuration, 0);
        this._startAutoScroll(bounceBackAmount, bounceBackTime, true);

        if (!this._isBouncing) {
            if (bounceBackAmount.y > 0) this._dispatchEvent('bounce-top');
            if (bounceBackAmount.y < 0) this._dispatchEvent('bounce-bottom');
            if (bounceBackAmount.x > 0) this._dispatchEvent('bounce-right');
            if (bounceBackAmount.x < 0) this._dispatchEvent('bounce-left');
            this._isBouncing = true;
        }

        return true;
    },

    _processInertiaScroll () {
        let bounceBackStarted = this._startBounceBackIfNeeded();
        if (!bounceBackStarted && this.inertia) {
            let touchMoveVelocity = this._calculateTouchMoveVelocity();
            if (!touchMoveVelocity.fuzzyEquals(cc.v2(0, 0), EPSILON) && this.brake < 1) {
                this._startInertiaScroll(touchMoveVelocity);
            }
        }

        this._onScrollBarTouchEnded();
    },

    _handleReleaseLogic (touch) {
        let delta = touch.getDelta();
        this._gatherTouchMove(delta);
        this._processInertiaScroll();
        if (this._scrolling) {
            this._scrolling = false;
            if (!this._autoScrolling) {
                this._dispatchEvent('scroll-ended');
            }
        }
    },

    _isOutOfBoundary () {
        let outOfBoundary = this._getHowMuchOutOfBoundary();
        return !outOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON);
    },

    _isNecessaryAutoScrollBrake () {
        if (this._autoScrollBraking) {
            return true;
        }

        if (this._isOutOfBoundary()) {
            if (!this._autoScrollCurrentlyOutOfBoundary) {
                this._autoScrollCurrentlyOutOfBoundary = true;
                this._autoScrollBraking = true;
                this._autoScrollBrakingStartPosition = this.getContentPosition();
                return true;
            }

        } else {
            this._autoScrollCurrentlyOutOfBoundary = false;
        }

        return false;
    },

    getScrollEndedEventTiming () {
        return EPSILON;
    },

    _processAutoScrolling (dt) {
        let isAutoScrollBrake = this._isNecessaryAutoScrollBrake();
        let brakingFactor = isAutoScrollBrake ? OUT_OF_BOUNDARY_BREAKING_FACTOR : 1;
        this._autoScrollAccumulatedTime += dt * (1 / brakingFactor);

        let percentage = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);
        if (this._autoScrollAttenuate) {
            percentage = quintEaseOut(percentage);
        }

        let newPosition = this._autoScrollStartPosition.add(this._autoScrollTargetDelta.mul(percentage));
        let reachedEnd = Math.abs(percentage - 1) <= EPSILON;

        let fireEvent = Math.abs(percentage - 1) <= this.getScrollEndedEventTiming();
        if (fireEvent && !this._isScrollEndedWithThresholdEventFired) {
            this._dispatchEvent('scroll-ended-with-threshold');
            this._isScrollEndedWithThresholdEventFired = true;
        }

        if (this.elastic && !reachedEnd) {
            let brakeOffsetPosition = newPosition.sub(this._autoScrollBrakingStartPosition);
            if (isAutoScrollBrake) {
                brakeOffsetPosition = brakeOffsetPosition.mul(brakingFactor);
            }
            newPosition = this._autoScrollBrakingStartPosition.add(brakeOffsetPosition);
        } else {
            let moveDelta = newPosition.sub(this.getContentPosition());
            let outOfBoundary = this._getHowMuchOutOfBoundary(moveDelta);
            if (!outOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
                newPosition = newPosition.add(outOfBoundary);
                reachedEnd = true;
            }
        }

        if (reachedEnd) {
            this._autoScrolling = false;
        }

        let deltaMove = newPosition.sub(this.getContentPosition());
        this._moveContent(this._clampDelta(deltaMove), reachedEnd);
        this._dispatchEvent('scrolling');

        // scollTo API controll move
        if (!this._autoScrolling) {
            this._isBouncing = false;
            this._scrolling = false;
            this._dispatchEvent('scroll-ended');
        }
    },

    _startInertiaScroll (touchMoveVelocity) {
        let inertiaTotalMovement = touchMoveVelocity.mul(MOVEMENT_FACTOR);
        this._startAttenuatingAutoScroll(inertiaTotalMovement, touchMoveVelocity);
    },

    _calculateAttenuatedFactor (distance) {
        if (this.brake <= 0){
            return (1 - this.brake);
        }

        //attenuate formula from: http://learnopengl.com/#!Lighting/Light-casters
        return (1 - this.brake) * (1 / (1 + distance * 0.000014 + distance * distance * 0.000000008));
    },

    _startAttenuatingAutoScroll (deltaMove, initialVelocity) {
        let time = this._calculateAutoScrollTimeByInitalSpeed(initialVelocity.mag());


        let targetDelta = deltaMove.normalize();
        let contentSize = this.content.getContentSize();
        let scrollviewSize = this._view.getContentSize();

        let totalMoveWidth = (contentSize.width - scrollviewSize.width);
        let totalMoveHeight = (contentSize.height - scrollviewSize.height);

        let attenuatedFactorX = this._calculateAttenuatedFactor(totalMoveWidth);
        let attenuatedFactorY = this._calculateAttenuatedFactor(totalMoveHeight);

        targetDelta = cc.v2(targetDelta.x * totalMoveWidth * (1 - this.brake) * attenuatedFactorX, targetDelta.y * totalMoveHeight * attenuatedFactorY * (1 - this.brake));

        let originalMoveLength = deltaMove.mag();
        let factor = targetDelta.mag() / originalMoveLength;
        targetDelta = targetDelta.add(deltaMove);

        if (this.brake > 0 && factor > 7) {
            factor = Math.sqrt(factor);
            targetDelta = deltaMove.mul(factor).add(deltaMove);
        }

        if (this.brake > 0 && factor > 3) {
            factor = 3;
            time = time * factor;
        }

        if (this.brake === 0 && factor > 1) {
            time = time * factor;
        }

        this._startAutoScroll(targetDelta, time, true);
    },

    _calculateAutoScrollTimeByInitalSpeed (initalSpeed) {
        return Math.sqrt(Math.sqrt(initalSpeed / 5));
    },

    _startAutoScroll (deltaMove, timeInSecond, attenuated) {
        let adjustedDeltaMove = this._flattenVectorByDirection(deltaMove);

        this._autoScrolling = true;
        this._autoScrollTargetDelta = adjustedDeltaMove;
        this._autoScrollAttenuate = attenuated;
        this._autoScrollStartPosition = this.getContentPosition();
        this._autoScrollTotalTime = timeInSecond;
        this._autoScrollAccumulatedTime = 0;
        this._autoScrollBraking = false;
        this._isScrollEndedWithThresholdEventFired = false;
        this._autoScrollBrakingStartPosition = cc.v2(0, 0);

        let currentOutOfBoundary = this._getHowMuchOutOfBoundary();
        if (!currentOutOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
            this._autoScrollCurrentlyOutOfBoundary = true;
        }
    },

    _calculateTouchMoveVelocity () {
        let totalTime = 0;
        totalTime = this._touchMoveTimeDeltas.reduce(function(a, b) {
            return a + b;
        }, totalTime);

        if (totalTime <= 0 || totalTime >= 0.5) {
            return cc.v2(0, 0);
        }

        let totalMovement = cc.v2(0, 0);
        totalMovement = this._touchMoveDisplacements.reduce(function(a, b) {
            return a.add(b);
        }, totalMovement);

        return cc.v2(totalMovement.x * (1 - this.brake) / totalTime,
                    totalMovement.y * (1 - this.brake) / totalTime);
    },

    _flattenVectorByDirection (vector) {
        let result = vector;
        result.x = this.horizontal ? result.x : 0;
        result.y = this.vertical ? result.y : 0;
        return result;
    },

    _moveContent (deltaMove, canStartBounceBack) {
        let adjustedMove = this._flattenVectorByDirection(deltaMove);
        let newPosition = this.getContentPosition().add(adjustedMove);

        this.setContentPosition(newPosition);

        let outOfBoundary = this._getHowMuchOutOfBoundary();
        this._updateScrollBar(outOfBoundary);

        if (this.elastic && canStartBounceBack) {
            this._startBounceBackIfNeeded();
        }
    },

    _getContentLeftBoundary () {
        let contentPos = this.getContentPosition();
        return contentPos.x - this.content.getAnchorPoint().x * this.content.getContentSize().width;
    },

    _getContentRightBoundary () {
        let contentSize = this.content.getContentSize();
        return this._getContentLeftBoundary() + contentSize.width;
    },

    _getContentTopBoundary () {
        let contentSize = this.content.getContentSize();
        return this._getContentBottomBoundary() + contentSize.height;
    },

    _getContentBottomBoundary () {
        let contentPos = this.getContentPosition();
        return contentPos.y - this.content.getAnchorPoint().y * this.content.getContentSize().height;
    },

    _getHowMuchOutOfBoundary (addition) {
        addition = addition || cc.v2(0, 0);
        if (addition.fuzzyEquals(cc.v2(0, 0), EPSILON) && !this._outOfBoundaryAmountDirty) {
            return this._outOfBoundaryAmount;
        }

        let outOfBoundaryAmount = cc.v2(0, 0);
        if (this._getContentLeftBoundary() + addition.x > this._leftBoundary) {
            outOfBoundaryAmount.x = this._leftBoundary - (this._getContentLeftBoundary() + addition.x);
        } else if (this._getContentRightBoundary() + addition.x < this._rightBoundary) {
            outOfBoundaryAmount.x = this._rightBoundary - (this._getContentRightBoundary() + addition.x);
        }

        if (this._getContentTopBoundary() + addition.y < this._topBoundary) {
            outOfBoundaryAmount.y = this._topBoundary - (this._getContentTopBoundary() + addition.y);
        } else if (this._getContentBottomBoundary() + addition.y > this._bottomBoundary) {
            outOfBoundaryAmount.y = this._bottomBoundary - (this._getContentBottomBoundary() + addition.y);
        }

        if (addition.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
            this._outOfBoundaryAmount = outOfBoundaryAmount;
            this._outOfBoundaryAmountDirty = false;
        }

        outOfBoundaryAmount = this._clampDelta(outOfBoundaryAmount);

        return outOfBoundaryAmount;
    },

    _updateScrollBarState () {
        if (!this.content) {
            return;
        }
        let contentSize = this.content.getContentSize();
        let scrollViewSize = this._view.getContentSize();
        if (this.verticalScrollBar) {
            if (contentSize.height < scrollViewSize.height) {
                this.verticalScrollBar.hide();
            } else {
                this.verticalScrollBar.show();
            }
        }

        if (this.horizontalScrollBar) {
            if (contentSize.width < scrollViewSize.width) {
                this.horizontalScrollBar.hide();
            } else {
                this.horizontalScrollBar.show();
            }
        }
    },

    _updateScrollBar (outOfBoundary) {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar._onScroll(outOfBoundary);
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar._onScroll(outOfBoundary);
        }
    },

    _onScrollBarTouchBegan () {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar._onTouchBegan();
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar._onTouchBegan();
        }
    },

    _onScrollBarTouchEnded () {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar._onTouchEnded();
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar._onTouchEnded();
        }
    },

    _dispatchEvent (event) {
        if (event === 'scroll-ended') {
            this._scrollEventEmitMask = 0;

        } else if (event === 'scroll-to-top'
                   || event === 'scroll-to-bottom'
                   || event === 'scroll-to-left'
                   || event === 'scroll-to-right') {

            let flag = (1 << eventMap[event]);
            if (this._scrollEventEmitMask & flag) {
                return;
            } else {
                this._scrollEventEmitMask |= flag;
            }
        }

        cc.Component.EventHandler.emitEvents(this.scrollEvents, this, eventMap[event]);
        this.node.emit(event, this);
    },

    _adjustContentOutOfBoundary () {
        this._outOfBoundaryAmountDirty = true;
        if (this._isOutOfBoundary()) {
            let outOfBoundary = this._getHowMuchOutOfBoundary(cc.v2(0, 0));
            let newPosition = this.getContentPosition().add(outOfBoundary);
            if (this.content) {
                this.content.setPosition(newPosition);
                this._updateScrollBar(0);
            }
        }
    },

    start () {
        this._calculateBoundary();
        //Because widget component will adjust content position and scrollview position is correct after visit
        //So this event could make sure the content is on the correct position after loading.
        if (this.content) {
            cc.director.once(cc.Director.EVENT_BEFORE_DRAW, this._adjustContentOutOfBoundary, this);
        }
    },

    _hideScrollbar () {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar.hide();
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar.hide();
        }
    },

    onDisable () {
        if (!CC_EDITOR) {
            this._unregisterEvent();
            if (this.content) {
                this.content.off(NodeEvent.SIZE_CHANGED, this._calculateBoundary, this);
                this.content.off(NodeEvent.SCALE_CHANGED, this._calculateBoundary, this);
                if (this._view) {
                    this._view.off(NodeEvent.POSITION_CHANGED, this._calculateBoundary, this);
                    this._view.off(NodeEvent.SCALE_CHANGED, this._calculateBoundary, this);
                    this._view.off(NodeEvent.SIZE_CHANGED, this._calculateBoundary, this);
                }
            }
        }
        this._hideScrollbar();
        this.stopAutoScroll();
    },

    onEnable () {
        if (!CC_EDITOR) {
            this._registerEvent();
            if (this.content) {
                this.content.on(NodeEvent.SIZE_CHANGED, this._calculateBoundary, this);
                this.content.on(NodeEvent.SCALE_CHANGED, this._calculateBoundary, this);
                if (this._view) {
                    this._view.on(NodeEvent.POSITION_CHANGED, this._calculateBoundary, this);
                    this._view.on(NodeEvent.SCALE_CHANGED, this._calculateBoundary, this);
                    this._view.on(NodeEvent.SIZE_CHANGED, this._calculateBoundary, this);
                }
            }
        }
        this._updateScrollBarState();
    },

    update (dt) {
        if (this._autoScrolling) {
            this._processAutoScrolling(dt);
        }
    }
});

cc.ScrollView = module.exports = ScrollView;

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-top
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-bottom
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-left
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-right
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scrolling
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-bottom
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-top
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-left
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-right
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-ended
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event touch-up
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

 /**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-began
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */
