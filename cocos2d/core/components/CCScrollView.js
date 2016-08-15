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

var NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED = 5;
var OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;
var EPSILON = 1e-7;
var MOVEMENT_FACTOR = 0.7;

var quintEaseOut = function(time) {
    time -= 1;
    return (time * time * time * time * time + 1);
};

var getTimeInMilliseconds = function() {
    var currentTime = new Date();
    return currentTime.getMilliseconds();
};

/**
 * !#en Enum for ScrollView event type.
 * !#zh 滚动视图事件类型
 * @enum ScrollView.EventType
 */
var EventType = cc.Enum({
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
     * !#en The event emmitted when ScrollView scroll ended
     * !#zh 滚动视图滚动滚动结束的时候发出的事件
     * @property {Number} AUTOSCROLL_ENDED
     */
    AUTOSCROLL_ENDED : 9
});

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
var ScrollView = cc.Class({
    name: 'cc.ScrollView',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/ScrollView',
        help: 'i18n:COMPONENT.help_url.scrollview',
        executeInEditMode: true,
    },

    ctor: function() {
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
        this._autoScrollStartPosition = cc.p(0, 0);
        this._autoScrollTargetDelta = cc.p(0, 0);
        this._autoScrollTotalTime = 0;
        this._autoScrollAccumulatedTime = 0;
        this._autoScrollCurrentlyOutOfBoundary = false;
        this._autoScrollBraking = false;
        this._autoScrollBrakingStartPosition = cc.p(0, 0);

        this._outOfBoundaryAmount = cc.p(0, 0);
        this._outOfBoundaryAmountDirty = true;
        this._stopMouseWheel = false;
        this._mouseWheelEventElapsedTime = 0.0;
    },

    properties: {
        /**
         * !#en This is a reference to the UI element to be scrolled.
         * !#zh 可滚动展示内容的节点。
         * @property {Node} content
         */
        content: {
            default: null,
            type: cc.Node,
            tooltip: 'i18n:COMPONENT.scrollview.content',
        },

        /**
         * !#en Enable horizontal scroll.
         * !#zh 是否开启水平滚动。
         * @property {Boolean} horizontal
         */
        horizontal: {
            default: true,
            animatable: false,
            tooltip: 'i18n:COMPONENT.scrollview.horizontal',
        },

        /**
         * !#en Enable vertical scroll.
         * !#zh 是否开启垂直滚动。
         * @property {Boolean} vertical
         */
        vertical: {
            default: true,
            animatable: false,
            tooltip: 'i18n:COMPONENT.scrollview.vertical',
        },

        /**
         * !#en When inertia is set, the content will continue to move when touch ended.
         * !#zh 是否开启滚动惯性。
         * @property {Boolean} inertia
         */
        inertia: {
            default: true,
            animatable: false,
            tooltip: 'i18n:COMPONENT.scrollview.inertia',
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
            type: 'Float',
            range: [0, 1, 0.1],
            animatable: false
        },

        /**
         * !#en When elastic is set, the content will be bounce back when move out of boundary.
         * !#zh 是否允许滚动内容超过边界，并在停止触摸后回弹。
         * @property {Boolean} elastic
         */
        elastic: {
            default: true,
            animatable: false
        },

        /**
         * !#en The elapse time of bouncing back. A value of 0 will bounce back immediately.
         * !#zh 回弹持续的时间，0 表示将立即反弹。
         * @property {Number} bounceDuration
         */
        bounceDuration: {
            default: 1,
            range: [0, 10],
            animatable: false
        },

        /**
         * !#en The horizontal scrollbar reference.
         * !#zh 水平滚动的 ScrollBar。
         * @property {Scrollbar} horizontalScrollBar
         */
        horizontalScrollBar: {
            default: null,
            type: cc.Scrollbar,
            tooltip: 'i18n:COMPONENT.scrollview.horizontal_bar',
            notify: function() {
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
            default: null,
            type: cc.Scrollbar,
            tooltip: 'i18n:COMPONENT.scrollview.vertical_bar',
            notify: function() {
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
            type: cc.Component.EventHandler
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
    scrollToBottom: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(0, 0),
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
    scrollToTop: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(0, 1),
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
    scrollToLeft: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(0, 0),
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
    scrollToRight: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(1, 0),
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
    scrollToTopLeft: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(0, 1),
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
    scrollToTopRight: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(1, 1),
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
    scrollToBottomLeft: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(0, 0),
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
    scrollToBottomRight: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(1, 0),
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
     * var maxScrollOffset = this.getMaxScrollOffset();
     * scrollView.scrollToOffset(cc.p(maxScrollOffset.x / 2, 0), 0.1);
     */
    scrollToOffset: function(offset, timeInSecond, attenuated) {
        var maxScrollOffset = this.getMaxScrollOffset();

        var anchor = cc.p(0, 0);
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
    getScrollOffset: function() {
        var topDelta =  this._topBoundary -  this._getContentTopBoundary();
        var leftDeta = this._getContentLeftBoundary() - this._leftBoundary;

        return cc.p(leftDeta, topDelta);
    },

    /**
     * !#en Get the maximize available  scroll offset
     * !#zh 获取滚动视图最大可以滚动的偏移量
     * @method getMaxScrollOffset
     * @return {Vec2} - A Vec2 value indicate the maximize scroll offset in x and y axis.
     */
    getMaxScrollOffset: function() {
        var scrollSize = this.node.getContentSize();
        var contentSize = this.content.getContentSize();
        var horizontalMaximizeOffset =  contentSize.width - scrollSize.width;
        var verticalMaximizeOffset = contentSize.height - scrollSize.height;
        horizontalMaximizeOffset = horizontalMaximizeOffset >= 0 ? horizontalMaximizeOffset : 0;
        verticalMaximizeOffset = verticalMaximizeOffset >=0 ? verticalMaximizeOffset : 0;


        return cc.p(horizontalMaximizeOffset, verticalMaximizeOffset);
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
    scrollToPercentHorizontal: function(percent, timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(percent, 0),
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
     * @param {Vec2} anchor - A point which will be clamp between cc.p(0,0) and cc.p(1,1).
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the percent position of ScrollView immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Vertical scroll to the bottom of the view.
     * scrollView.scrollTo(cc.p(0, 1), 0.1);
     *
     * // Horizontal scroll to view right.
     * scrollView.scrollTo(cc.p(1, 0), 0.1);
     */
    scrollTo: function(anchor, timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: anchor,
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
    scrollToPercentVertical: function(percent, timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(0, percent),
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
    stopAutoScroll: function() {
        this._autoScrolling = false;
        this._autoScrollAccumulatedTime = this._autoScrollTotalTime;
    },

    /**
     * !#en Modify the content position.
     * !#zh 设置当前视图内容的坐标点。
     * @method setContentPosition
     * @param {Vec2} position - The position in content's parent space.
     */
    setContentPosition: function(position) {
        if (cc.pFuzzyEqual(position, this.getContentPosition(), EPSILON)) {
            return;
        }

        this.content.setPosition(position);

        this._outOfBoundaryAmountDirty = true;

        if(this.elastic)
        {
            var outOfBoundary = this._getHowMuchOutOfBoundary();
            if (outOfBoundary.y > 0) this._dispatchEvent(EventType.BOUNCE_TOP);
            if (outOfBoundary.y < 0) this._dispatchEvent(EventType.BOUNCE_BOTTOM);
            if (outOfBoundary.x > 0) this._dispatchEvent(EventType.BOUNCE_RIGHT);
            if (outOfBoundary.x < 0) this._dispatchEvent(EventType.BOUNCE_LEFT);
        }
    },

    /**
     * !#en Query the content's position in its parent space.
     * !#zh 获取当前视图内容的坐标点。
     * @method getContentPosition
     * @returns {Position} - The content's position in its parent space.
     */
    getContentPosition: function() {
        return this.content.getPosition();
    },

    //private methods
    _registerEvent: function() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
    },

    _onMouseWheel: function(event) {
        var deltaMove = cc.p(0, 0);
        var wheelPrecision = 1.0 / 40;
        if(CC_JSB) {
            wheelPrecision = 7;
        }
        if(this.vertical) {
            deltaMove = cc.p(0, event.getScrollY() * wheelPrecision);
        }
        else if(this.horizontal) {
            deltaMove = cc.p(event.getScrollY() * wheelPrecision, 0);
        }

        this._mouseWheelEventElapsedTime = 0;
        this._processDeltaMove(deltaMove);

        if(!this._stopMouseWheel) {
            this._handlePressLogic();
            this.schedule(this._checkMouseWheel, 1.0 / 60);
            this._stopMouseWheel = true;
        }
        event.stopPropagation();
    },

    _checkMouseWheel: function(dt) {
        var currentOutOfBoundary = this._getHowMuchOutOfBoundary();
        var maxElapsedTime = 0.1;

        if (!cc.pFuzzyEqual(currentOutOfBoundary, cc.p(0, 0), EPSILON)) {
            this._processInertiaScroll();
            this.unschedule(this._checkMouseWheel);
            this._stopMouseWheel = false;
            return;
        }

        this._mouseWheelEventElapsedTime += dt;

        //mouse wheel event is ended
        if (this._mouseWheelEventElapsedTime > maxElapsedTime) {
            this._onScrollBarTouchEnded();
            this.unschedule(this._checkMouseWheel);
            this._stopMouseWheel = false;
        }

    },

    _calculateMovePercentDelta: function(options) {
        var anchor = options.anchor;
        var applyToHorizontal = options.applyToHorizontal;
        var applyToVertical = options.applyToVertical;
        this._calculateBoundary();

        anchor = cc.pClamp(anchor, cc.p(0, 0), cc.p(1, 1));

        var scrollSize = this.node.getContentSize();
        var contentSize = this.content.getContentSize();
        var bottomDeta = this._getContentBottomBoundary() - this._bottomBoundary;
        bottomDeta = -bottomDeta;

        var leftDeta = this._getContentLeftBoundary() - this._leftBoundary;
        leftDeta = -leftDeta;

        var moveDelta = cc.p(0, 0);
        var totalScrollDelta = 0;
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

    _moveContentToTopLeft: function (scrollViewSize) {
        var contentSize = this.content.getContentSize();

        var bottomDeta = this._getContentBottomBoundary() - this._bottomBoundary;
        bottomDeta = -bottomDeta;
        var moveDelta = cc.p(0, 0);
        var totalScrollDelta = 0;

        var leftDeta = this._getContentLeftBoundary() - this._leftBoundary;
        leftDeta = -leftDeta;

        if (contentSize.height < scrollViewSize.height) {
            totalScrollDelta = contentSize.height - scrollViewSize.height;
            moveDelta.y = bottomDeta - totalScrollDelta;

            if (this.verticalScrollBar) {
                this.verticalScrollBar.hide();
            }
        } else {
            if (this.verticalScrollBar) {
                this.verticalScrollBar.show();
            }
        }

        if (contentSize.width < scrollViewSize.width) {
            totalScrollDelta = contentSize.width - scrollViewSize.width;
            moveDelta.x = leftDeta;

            if (this.horizontalScrollBar) {
                this.horizontalScrollBar.hide();
            }

        } else {
            if (this.horizontalScrollBar) {
                this.horizontalScrollBar.show();
            }
        }

        this._moveContent(moveDelta);
    },

    _calculateBoundary: function() {
        if (this.content) {
            //refresh content size
            var layout = this.content.getComponent(cc.Layout);
            if(layout && layout.enabledInHierarchy) {
                layout._updateLayout();
            }
            var scrollViewSize = this.node.getContentSize();

            var leftBottomPosition = this._convertToContentParentSpace(cc.p(0, 0));
            this._leftBoundary = leftBottomPosition.x;
            this._bottomBoundary = leftBottomPosition.y;

            var topRightPosition = this._convertToContentParentSpace(cc.p(scrollViewSize.width, scrollViewSize.height));
            this._rightBoundary = topRightPosition.x;
            this._topBoundary = topRightPosition.y;

            if(!CC_EDITOR) {
                this._moveContentToTopLeft(scrollViewSize);
            }
        }
    },

    _convertToContentParentSpace: function(position) {
        var scrollViewPositionInWorldSpace = this.node.convertToWorldSpace(position);
        var contentParent = this.content.parent;
        return contentParent.convertToNodeSpaceAR(scrollViewPositionInWorldSpace);
    },

    // touch event handler
    _onTouchBegan: function(event) {
        var touch = event.touch;
        if (this.content) {
            this._handlePressLogic(touch);
        }
        this._touchMoved = false;
    },

    _onTouchMoved: function(event) {
        var touch = event.touch;
        if (this.content) {
            this._handleMoveLogic(touch);
        }
        var deltaMove = cc.pSub(touch.getLocation(), touch.getStartLocation());
        //FIXME: touch move delta should be calculated by DPI.
        if (cc.pLength(deltaMove) > 7) {
            this._touchMoved = true;
            if (event.target !== this.node) {
                // Simulate touch cancel for target node
                var cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
                cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
                cancelEvent.touch = event.touch;
                cancelEvent.simulate = true;
                event.target.dispatchEvent(cancelEvent);
            }
            event.stopPropagation();
        }
    },

    _onTouchEnded: function(event) {
        var touch = event.touch;
        if (this.content) {
            this._handleReleaseLogic(touch);
        }
        if (this._touchMoved) {
            event.stopPropagation();
        }
    },
    _onTouchCancelled: function(event) {
        // Filte touch cancel event send from self
        if (!event.simulate) {
            var touch = event.touch;
            if(this.content){
                this._handleReleaseLogic(touch);
            }
        }
    },

    _processDeltaMove: function(deltaMove) {
        this._scrollChildren(deltaMove);
        this._gatherTouchMove(deltaMove);
    },

    _handleMoveLogic: function(touch) {
        var deltaMove = touch.getDelta();
        this._processDeltaMove(deltaMove);
    },

    _scrollChildren: function(deltaMove) {
        deltaMove = this._clampDelta(deltaMove);

        var realMove = deltaMove;
        var outOfBoundary;
        if (this.elastic) {
            outOfBoundary = this._getHowMuchOutOfBoundary();
            realMove.x *= (outOfBoundary.x === 0 ? 1 : 0.5);
            realMove.y *= (outOfBoundary.y === 0 ? 1 : 0.5);
        }

        if (!this.elastic) {
            outOfBoundary = this._getHowMuchOutOfBoundary(realMove);
            realMove = cc.pAdd(realMove, outOfBoundary);
        }

        var scrollEventType = -1;

        if (realMove.y > 0) { //up
            var icBottomPos = this.content.y - this.content.anchorY * this.content.height;

            if (icBottomPos + realMove.y > this._bottomBoundary) {
                scrollEventType = EventType.SCROLL_TO_BOTTOM;
            }
        }
        else if (realMove.y < 0) { //down
            var icTopPos = this.content.y - this.content.anchorY * this.content.height + this.content.height;

            if(icTopPos + realMove.y <= this._topBoundary) {
                scrollEventType = EventType.SCROLL_TO_TOP;
            }
        }
        else if (realMove.x < 0) { //left
            var icRightPos = this.content.x - this.content.anchorX * this.content.width + this.content.width;
            if (icRightPos + realMove.x <= this._rightBoundary) {
                scrollEventType = EventType.SCROLL_TO_RIGHT;
            }
        }
        else if (realMove.x > 0) { //right
            var icLeftPos = this.content.x - this.content.anchorX * this.content.width;
            if (icLeftPos + realMove.x >= this._leftBoundary) {
                scrollEventType = EventType.SCROLL_TO_LEFT;
            }
        }

        this._moveContent(realMove, false);

        if(realMove.x !== 0 || realMove.y !== 0)
        {
            this._dispatchEvent(EventType.SCROLLING);
        }

        if (scrollEventType !== -1) {
            this._dispatchEvent(scrollEventType);
        }

    },

    _handlePressLogic: function() {
        this._autoScrolling = false;

        this._touchMovePreviousTimestamp = getTimeInMilliseconds();
        this._touchMoveDisplacements = [];
        this._touchMoveTimeDeltas = [];

        this._onScrollBarTouchBegan();
    },

    _clampDelta: function(delta) {
        var contentSize = this.content.getContentSize();
        var scrollViewSize = this.node.getContentSize();
        if (contentSize.width <= scrollViewSize.width) {
            delta.x = 0;
        }
        if (contentSize.height <= scrollViewSize.height) {
            delta.y = 0;
        }

        return delta;
    },

    _gatherTouchMove: function(delta) {
        delta = this._clampDelta(delta);

        while (this._touchMoveDisplacements.length >= NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED) {
            this._touchMoveDisplacements.shift();
            this._touchMoveTimeDeltas.shift();
        }

        this._touchMoveDisplacements.push(delta);

        var timeStamp = getTimeInMilliseconds();
        this._touchMoveTimeDeltas.push((timeStamp - this._touchMovePreviousTimestamp) / 1000);
        this._touchMovePreviousTimestamp = timeStamp;
    },

    _startBounceBackIfNeeded: function() {
        if (!this.elastic) {
            return false;
        }

        var bounceBackAmount = this._getHowMuchOutOfBoundary();
        bounceBackAmount = this._clampDelta(bounceBackAmount);

        if (cc.pFuzzyEqual(bounceBackAmount, cc.p(0, 0), EPSILON)) {
            return false;
        }

        var bounceBackTime = Math.max(this.bounceDuration, 0);
        this._startAutoScroll(bounceBackAmount, bounceBackTime, true);

        return true;
    },

    _processInertiaScroll: function () {
        var bounceBackStarted = this._startBounceBackIfNeeded();
        if (!bounceBackStarted && this.inertia) {
            var touchMoveVelocity = this._calculateTouchMoveVelocity();
            if (!cc.pFuzzyEqual(touchMoveVelocity, cc.p(0, 0), EPSILON) && this.brake < 1) {
                this._startInertiaScroll(touchMoveVelocity);
            }
        }

        this._onScrollBarTouchEnded();
    },

    _handleReleaseLogic: function(touch) {
        var delta = touch.getDelta();
        this._gatherTouchMove(delta);

       this._processInertiaScroll();
    },

    _isOutOfBoundary: function() {
        var outOfBoundary = this._getHowMuchOutOfBoundary();
        return !cc.pFuzzyEqual(outOfBoundary, cc.p(0, 0), EPSILON);
    },

    _isNecessaryAutoScrollBrake: function() {
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


    _processAutoScrolling: function(dt) {
        var isAutoScrollBrake = this._isNecessaryAutoScrollBrake();
        var brakingFactor = isAutoScrollBrake ? OUT_OF_BOUNDARY_BREAKING_FACTOR : 1;
        this._autoScrollAccumulatedTime += dt * (1 / brakingFactor);

        var percentage = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);
        if (this._autoScrollAttenuate) {
            percentage = quintEaseOut(percentage);
        }

        var newPosition = cc.pAdd(this._autoScrollStartPosition, cc.pMult(this._autoScrollTargetDelta, percentage));
        var reachedEnd = (percentage === 1);

        if (this.elastic) {
            var brakeOffsetPosition = cc.pSub(newPosition, this._autoScrollBrakingStartPosition);
            if (isAutoScrollBrake) {
                brakeOffsetPosition = cc.pMult(brakeOffsetPosition, brakingFactor);
            }
            newPosition = cc.pAdd(this._autoScrollBrakingStartPosition, brakeOffsetPosition);
        } else {
            var moveDelta = cc.pSub(newPosition, this.getContentPosition());
            var outOfBoundary = this._getHowMuchOutOfBoundary(moveDelta);
            if (!cc.pFuzzyEqual(outOfBoundary, cc.p(0, 0), EPSILON)) {
                newPosition = cc.pAdd(newPosition, outOfBoundary);
                reachedEnd = true;
            }
        }

        if (reachedEnd) {
            this._autoScrolling = false;
            this._dispatchEvent(EventType.AUTOSCROLL_ENDED);
        }

        var contentPos = cc.pSub(newPosition, this.getContentPosition());
        this._moveContent(contentPos, reachedEnd);
    },

    _startInertiaScroll: function(touchMoveVelocity) {
        var inertiaTotalMovement = cc.pMult(touchMoveVelocity, MOVEMENT_FACTOR);
        this._startAttenuatingAutoScroll(inertiaTotalMovement, touchMoveVelocity);
    },

    _calculateAttenuatedFactor: function (distance) {
        if(this.brake <= 0){
            return (1 - this.brake);
        }

        //attenuate formula from: http://learnopengl.com/#!Lighting/Light-casters
        var attenuatedFactor = (1 - this.brake) * (1 / (1 + distance * 0.000014 + distance * distance * 0.000000008) );
        return attenuatedFactor;
    },

    _startAttenuatingAutoScroll: function(deltaMove, initialVelocity) {
        var time = this._calculateAutoScrollTimeByInitalSpeed(cc.pLength(initialVelocity));


        var targetDelta = cc.pNormalize(deltaMove);
        var contentSize = this.content.getContentSize();
        var scrollviewSize = this.node.getContentSize();

        var totalMoveWidth = (contentSize.width - scrollviewSize.width);
        var totalMoveHeight = (contentSize.height - scrollviewSize.height);

        var attenuatedFactorX = this._calculateAttenuatedFactor(totalMoveWidth);
        var attenuatedFactorY = this._calculateAttenuatedFactor(totalMoveHeight);

        targetDelta = cc.p(targetDelta.x * totalMoveWidth * (1 - this.brake) * attenuatedFactorX, targetDelta.y * totalMoveHeight * attenuatedFactorY * (1 - this.brake));

        var originalMoveLength = cc.pLength(deltaMove);
        var factor = cc.pLength(targetDelta) / originalMoveLength;
        targetDelta = cc.pAdd(targetDelta, deltaMove);

        if(this.brake > 0 && factor > 7) {
            factor = Math.sqrt(factor);
            targetDelta = cc.pAdd(cc.pMult(deltaMove, factor), deltaMove);
        }

        if(this.brake > 0 && factor > 3) {
            factor = 3;
            time = time * factor;
        }

        if(this.brake === 0 && factor > 1) {
            time = time * factor;
        }

        this._startAutoScroll(targetDelta, time, true);
    },

    _calculateAutoScrollTimeByInitalSpeed: function(initalSpeed) {
        var time = Math.sqrt(Math.sqrt(initalSpeed / 5));
        return time;
    },

    _startAutoScroll: function(deltaMove, timeInSecond, attenuated) {
        var adjustedDeltaMove = this._flattenVectorByDirection(deltaMove);

        this._autoScrolling = true;
        this._autoScrollTargetDelta = adjustedDeltaMove;
        this._autoScrollAttenuate = attenuated;
        this._autoScrollStartPosition = this.getContentPosition();
        this._autoScrollTotalTime = timeInSecond;
        this._autoScrollAccumulatedTime = 0;
        this._autoScrollBraking = false;
        this._autoScrollBrakingStartPosition = cc.p(0, 0);

        var currentOutOfBoundary = this._getHowMuchOutOfBoundary();
        if (!cc.pFuzzyEqual(currentOutOfBoundary, cc.p(0, 0), EPSILON)) {
            this._autoScrollCurrentlyOutOfBoundary = true;
            var afterOutOfBoundary = this._getHowMuchOutOfBoundary(adjustedDeltaMove);
            if (currentOutOfBoundary.x * afterOutOfBoundary.x > 0 ||
                currentOutOfBoundary.y * afterOutOfBoundary.y > 0) {
                this._autoScrollBraking = true;
            }
        }

    },

    _calculateTouchMoveVelocity: function() {
        var totalTime = 0;
        totalTime = this._touchMoveTimeDeltas.reduce(function(a, b) {
            return a + b;
        }, totalTime);

        if (totalTime <= 0 || totalTime >= 0.5) {
            return cc.p(0, 0);
        }

        var totalMovement = cc.p(0, 0);
        totalMovement = this._touchMoveDisplacements.reduce(function(a, b) {
            return cc.pAdd(a, b);
        }, totalMovement);

        return cc.p(totalMovement.x * (1 - this.brake) / totalTime,
                    totalMovement.y * (1 - this.brake) / totalTime);
    },

    _flattenVectorByDirection: function(vector) {
        var result = vector;
        result.x = this.horizontal ? result.x : 0;
        result.y = this.vertical ? result.y : 0;
        return result;
    },

    _moveContent: function(deltaMove, canStartBounceBack) {
        var adjustedMove = this._flattenVectorByDirection(deltaMove);

        var newPosition = cc.pAdd(this.getContentPosition(), adjustedMove);

        this.setContentPosition(newPosition);

        var outOfBoundary = this._getHowMuchOutOfBoundary();
        this._updateScrollBar(outOfBoundary);

        if (this.elastic && canStartBounceBack) {
            this._startBounceBackIfNeeded();
        }

    },


    _getContentLeftBoundary: function() {
        var contentPos = this.getContentPosition();
        var leftBoundary = contentPos.x - this.content.getAnchorPoint().x * this.content.getContentSize().width;
        return leftBoundary;
    },

    _getContentRightBoundary: function() {
        var contentSize = this.content.getContentSize();
        return this._getContentLeftBoundary() + contentSize.width;
    },

    _getContentTopBoundary: function() {
        var contentSize = this.content.getContentSize();
        return this._getContentBottomBoundary() + contentSize.height;
    },

    _getContentBottomBoundary: function() {
        var contentPos = this.getContentPosition();
        var bottomBoundary = contentPos.y - this.content.getAnchorPoint().y * this.content.getContentSize().height;
        return bottomBoundary;
    },

    _getHowMuchOutOfBoundary: function(addition) {
        addition = addition || cc.p(0, 0);
        if (cc.pFuzzyEqual(addition, cc.p(0, 0), EPSILON) && !this._outOfBoundaryAmountDirty) {
            return this._outOfBoundaryAmount;
        }

        var outOfBoundaryAmount = cc.p(0, 0);
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

        if (cc.pFuzzyEqual(addition, cc.p(0, 0), EPSILON)) {
            this._outOfBoundaryAmount = outOfBoundaryAmount;
            this._outOfBoundaryAmountDirty = false;
        }

        outOfBoundaryAmount = this._clampDelta(outOfBoundaryAmount);

        return outOfBoundaryAmount;
    },

    _updateScrollBar: function(outOfBoundary) {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar._onScroll(outOfBoundary);
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar._onScroll(outOfBoundary);
        }
    },

    _onScrollBarTouchBegan: function() {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar._onTouchBegan();
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar._onTouchBegan();
        }
    },

    _onScrollBarTouchEnded: function() {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar._onTouchEnded();
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar._onTouchEnded();
        }
    },

    _dispatchEvent: function(event) {
        cc.Component.EventHandler.emitEvents(this.scrollEvents, this, event);
    },

    //component life cycle methods
    __preload: function () {
        if (!CC_EDITOR) {
            this._registerEvent();
            this.node.on('size-changed', this._calculateBoundary, this);
            if(this.content) {
                this.content.on('size-changed', this._calculateBoundary, this);
            }
        }
    },

    _adjustContentOutOfBoundary: function () {
        this._outOfBoundaryAmountDirty = true;
        if(this._isOutOfBoundary()) {
            var outOfBoundary = this._getHowMuchOutOfBoundary(cc.p(0, 0));
            var newPosition = cc.pAdd(this.getContentPosition(), outOfBoundary);
            if(this.content) {
                this.content.setPosition(newPosition);
            }
        }
    },

    start: function() {
        this._calculateBoundary();
        //Because widget component will adjust content position and scrollview position is correct after visit
        //So this event could make sure the content is on the correct position after loading.
        cc.director.once(cc.Director.EVENT_AFTER_VISIT, this._adjustContentOutOfBoundary, this);
    },

    onDestroy: function() {
        this.node.off('size-changed', this._calculateBoundary, this);
        if(this.content) {
            this.content.off('size-changed', this._calculateBoundary, this);
        }
    },

    _hideScrollbar: function () {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar.hide();
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar.hide();
        }
    },

    _showScrollbar: function () {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar.show();
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar.show();
        }
    },

    onDisable: function () {
        this._hideScrollbar();
        this.stopAutoScroll();
    },

    onEnable: function () {
        this._showScrollbar();
    },

    update: function(dt) {
        if (this._autoScrolling) {
            this._processAutoScrolling(dt);
        }
    }
});

cc.ScrollView = module.exports = ScrollView;
