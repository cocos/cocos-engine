/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
*/

/**
 * @category ui
 */

import { EventHandler as ComponentEventHandler } from '../../core/components';
import { ccclass, help, executionOrder, menu, property } from '../../core/data/class-decorator';
import { Event } from '../../core/event';
import { EventMouse, EventTouch, Touch } from '../../core/platform';
import { Size, Vec2, Vec3 } from '../../core/math';
import { LayoutComponent } from './layout-component';
import { ScrollBarComponent } from './scroll-bar-component';
import { ViewGroupComponent } from './view-group-component';
import { Node } from '../../core/scene-graph/node';
import { director, Director } from '../../core/director';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { EDITOR } from 'internal:constants';
import { legacyCC } from '../../core/global-exports';

const NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED = 5;
const OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;
const EPSILON = 1e-4;
const TOLERANCE = 1e4;
const MOVEMENT_FACTOR = 0.7;
const ZERO = new Vec3();
const _tempVec3 = new Vec3();
const _tempVec3_1 = new Vec3();
const _tempVec2 = new Vec2();
const _tempVec2_1 = new Vec2();

const quintEaseOut = (time: number) => {
    time -= 1;
    return (time * time * time * time * time + 1);
};

const getTimeInMilliseconds = () => {
    const currentTime = new Date();
    return currentTime.getMilliseconds();
};

const eventMap = {
    'scroll-to-top': 0,
    'scroll-to-bottom': 1,
    'scroll-to-left': 2,
    'scroll-to-right': 3,
    'scrolling': 4,
    'bounce-bottom': 6,
    'bounce-left': 7,
    'bounce-right': 8,
    'bounce-top': 5,
    'scroll-ended': 9,
    'touch-up': 10,
    'scroll-ended-with-threshold': 11,
    'scroll-began': 12,
};

/**
 * @en
 * Enum for ScrollView event type.
 *
 * @zh
 * 滚动视图事件类型
 */
export enum EventType {
    /**
     * @en
     * The event emitted when ScrollView scroll to the top boundary of inner container.
     *
     * @zh
     * 滚动视图滚动到顶部边界事件。
     */
    SCROLL_TO_TOP = 'scroll-to-top',
    /**
     * @en
     * The event emitted when ScrollView scroll to the bottom boundary of inner container.
     *
     * @zh
     * 滚动视图滚动到底部边界事件。
     */
    SCROLL_TO_BOTTOM = 'scroll-to-bottom',
    /**
     * @en
     * The event emitted when ScrollView scroll to the left boundary of inner container.
     *
     * @zh
     * 滚动视图滚动到左边界事件。
     */
    SCROLL_TO_LEFT = 'scroll-to-left',
    /**
     * @en
     * The event emitted when ScrollView scroll to the right boundary of inner container.
     *
     * @zh
     * 滚动视图滚动到右边界事件。
     */
    SCROLL_TO_RIGHT = 'scroll-to-right',
    /**
     * @en
     * The event emitted when ScrollView scroll began.
     *
     * @zh
     * 滚动视图滚动开始时发出的事件。
     */
    SCROLL_BEGAN = 'scroll-began',
    /**
     * @en
     * The event emitted when ScrollView auto scroll ended.
     *
     * @zh
     * 滚动视图滚动结束的时候发出的事件。
     */
    SCROLL_ENDED = 'scroll-ended',
    /**
     * @en
     * The event emitted when ScrollView scroll to the top boundary of inner container and start bounce.
     *
     * @zh
     * 滚动视图滚动到顶部边界并且开始回弹时发出的事件。
     */
    BOUNCE_TOP = 'bounce-top',
    /**
     * @en
     * The event emitted when ScrollView scroll to the bottom boundary of inner container and start bounce.
     *
     * @zh
     * 滚动视图滚动到底部边界并且开始回弹时发出的事件。
     */
    BOUNCE_BOTTOM = 'bounce-bottom',
    /**
     * @en
     * The event emitted when ScrollView scroll to the left boundary of inner container and start bounce.
     *
     * @zh
     * 滚动视图滚动到左边界并且开始回弹时发出的事件。
     */
    BOUNCE_LEFT = 'bounce-left',
    /**
     * @en
     * The event emitted when ScrollView scroll to the right boundary of inner container and start bounce.
     *
     * @zh
     * 滚动视图滚动到右边界并且开始回弹时发出的事件。
     */
    BOUNCE_RIGHT = 'bounce-right',
    /**
     * @en
     * The event emitted when ScrollView is scrolling.
     *
     * @zh
     * 滚动视图正在滚动时发出的事件。
     */
    SCROLLING = 'scrolling',
    /**
     * @en
     * The event emitted when ScrollView auto scroll ended with a threshold.
     *
     * @zh
     * 滚动视图自动滚动快要结束的时候发出的事件。
     */
    SCROLL_ENG_WITH_THRESHOLD = 'scroll-ended-with-threshold',
    /**
     * @en
     * The event emitted when user release the touch.
     *
     * @zh
     * 当用户松手的时候会发出一个事件。
     */
    TOUCH_UP = 'touch-up',
}

/**
 * @en
 * Layout container for a view hierarchy that can be scrolled by the user,
 * allowing it to be larger than the physical display.
 *
 * @zh
 * 滚动视图组件。
 */

@ccclass('cc.ScrollViewComponent')
@help('i18n:cc.ScrollViewComponent')
@executionOrder(110)
@menu('UI/ScrollView')
export class ScrollViewComponent extends ViewGroupComponent {

    /**
     * @en
     * This is a reference to the UI element to be scrolled.
     *
     * @zh
     * 可滚动展示内容的节点。
     */
    @property({
        type: Node,
        tooltip: '可滚动展示内容的节点',
    })
    get content () {
        return this._content;
    }
    set content (value) {
        if (this._content === value){
            return;
        }

        this._content = value;
        this._calculateBoundary();
    }

    /**
     * @en
     * The horizontal scrollbar reference.
     * @zh
     * 水平滚动的 ScrollBar。
     */
    @property({
        type: ScrollBarComponent,
        tooltip: '水平滚动的 ScrollBar',
    })
    get horizontalScrollBar () {
        return this._horizontalScrollBar;
    }

    set horizontalScrollBar (value: ScrollBarComponent | null) {
        if (this._horizontalScrollBar === value){
            return;
        }

        this._horizontalScrollBar = value;

        if (this._horizontalScrollBar) {
            this._horizontalScrollBar.setScrollView(this);
            this._updateScrollBar(ZERO);
        }
    }

    /**
     * @en
     * The vertical scrollbar reference.
     *
     * @zh
     * 垂直滚动的 ScrollBar。
     */
    @property({
        type: ScrollBarComponent,
        tooltip: '垂直滚动的 ScrollBar',
    })
    get verticalScrollBar () {
        return this._verticalScrollBar;
    }

    set verticalScrollBar (value: ScrollBarComponent | null) {
        if (this._verticalScrollBar === value) {
            return;
        }

        this._verticalScrollBar = value;

        if (this._verticalScrollBar) {
            this._verticalScrollBar.setScrollView(this);
            this._updateScrollBar(ZERO);
        }
    }

    get view () {
        if (!this._content) {
            return null;
        }

        return this._content.parent;
    }

    public static EventType = EventType;
    /**
     * @en
     * Enable horizontal scroll.
     *
     * @zh
     * 是否开启水平滚动。
     */
    @property({
        tooltip: '是否开启水平滚动',
    })
    public horizontal = true;

    /**
     * @en
     * Enable vertical scroll.
     *
     * @zh
     * 是否开启垂直滚动。
     */
    @property({
        tooltip: '是否开启垂直滚动',
    })
    public vertical = true;

    /**
     * @en
     * When inertia is set, the content will continue to move when touch ended.
     *
     * @zh
     * 是否开启滚动惯性。
     */
    @property({
        tooltip: '是否开启滚动惯性',
    })
    public inertia = true;

    /**
     * @en
     * It determines how quickly the content stop moving. A value of 1 will stop the movement immediately.
     * A value of 0 will never stop the movement until it reaches to the boundary of scrollview.
     *
     * @zh
     * 开启惯性后，在用户停止触摸后滚动多快停止，0表示永不停止，1表示立刻停止。
     */
    @property({
        range: [0, 1, 0.1],
        tooltip: '开启惯性后，在用户停止触摸后滚动多快停止，0 表示永不停止，1 表示立刻停止',
    })
    public brake = 0.5;

    /**
     * @en
     * When elastic is set, the content will be bounce back when move out of boundary.
     *
     * @zh
     * 是否允许滚动内容超过边界，并在停止触摸后回弹。
     */
    @property({
        tooltip: '是否允许滚动内容超过边界，并在停止触摸后回弹',
    })
    public elastic = true;

    /**
     * @en
     * The elapse time of bouncing back. A value of 0 will bounce back immediately.
     *
     * @zh
     * 回弹持续的时间，0 表示将立即反弹。
     */
    @property({
        range: [0, 10],
        tooltip: '回弹持续的时间，0 表示将立即反弹',
    })
    public bounceDuration = 1;

    /**
     * @en
     * Scrollview events callback.
     *
     * @zh
     * 滚动视图的事件回调函数。
     */
    @property({
        type: [ComponentEventHandler],
        tooltip: '滚动视图的事件回调函数',
    })
    public scrollEvents: ComponentEventHandler[] = [];

    /**
     * @en
     * If cancelInnerEvents is set to true, the scroll behavior will cancel touch events on inner content nodes
     * It's set to true by default.
     *
     * @zh
     * 如果这个属性被设置为 true，那么滚动行为会取消子节点上注册的触摸事件，默认被设置为 true。<br/>
     * 注意，子节点上的 touchstart 事件仍然会触发，触点移动距离非常短的情况下 touchmove 和 touchend 也不会受影响。
     */
    @property({
        tooltip: '滚动行为是否会取消子节点上注册的触摸事件',
    })
    public cancelInnerEvents = true;

    protected _autoScrolling = false;
    protected _scrolling = false;
    @property
    protected _content: Node | null = null;
    @property
    protected _horizontalScrollBar: ScrollBarComponent | null = null;
    @property
    protected _verticalScrollBar: ScrollBarComponent | null = null;

    protected _topBoundary = 0;
    protected _bottomBoundary = 0;
    protected _leftBoundary = 0;
    protected _rightBoundary = 0;

    protected _touchMoveDisplacements: Vec3[] = [];
    protected _touchMoveTimeDeltas: number[] = [];
    protected _touchMovePreviousTimestamp = 0;
    protected _touchMoved = false;
    protected _autoScrollAttenuate = false;
    protected _autoScrollStartPosition = new Vec3();
    protected _autoScrollTargetDelta = new Vec3();
    protected _autoScrollTotalTime = 0;
    protected _autoScrollAccumulatedTime = 0;
    protected _autoScrollCurrentlyOutOfBoundary = false;
    protected _autoScrollBraking = false;
    protected _autoScrollBrakingStartPosition = new Vec3();

    protected _outOfBoundaryAmount = new Vec3();
    protected _outOfBoundaryAmountDirty = true;
    protected _stopMouseWheel = false;
    protected _mouseWheelEventElapsedTime = 0.0;
    protected _isScrollEndedWithThresholdEventFired = false;
    // use bit wise operations to indicate the direction
    protected _scrollEventEmitMask = 0;
    protected _isBouncing = false;
    protected _contentPos = new Vec3();
    protected _deltaPos = new Vec3();

    /**
     * @en
     * Scroll the content to the bottom boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图底部。
     *
     * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到底部边界。
     * @param attenuated - 滚动加速是否衰减，默认为 true。
     * @example
     * ```typescript
     * // Scroll to the bottom of the view.
     * scrollView.scrollToBottom(0.1);
     * ```
     */
    public scrollToBottom (timeInSecond?: number, attenuated = true) {
        const moveDelta = this._calculateMovePercentDelta({
            anchor: new Vec2(0, 0),
            applyToHorizontal: false,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta, true);
        }
    }

    /**
     * @en
     * Scroll the content to the top boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图顶部。
     *
     * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到顶部边界。
     * @param attenuated - 滚动加速是否衰减，默认为 true。
     * @example
     * ```typescript
     * // Scroll to the top of the view.
     * scrollView.scrollToTop(0.1);
     * ```
     */
    public scrollToTop (timeInSecond?: number, attenuated = true) {
        const moveDelta = this._calculateMovePercentDelta({
            anchor: new Vec2(0, 1),
            applyToHorizontal: false,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    }

    /**
     * @en
     * Scroll the content to the left boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图左边。
     *
     * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到左边边界。
     * @param attenuated - 滚动加速是否衰减，默认为 true。
     * @example
     * ```typescript
     * // Scroll to the left of the view.
     * scrollView.scrollToLeft(0.1);
     * ```
     */
    public scrollToLeft (timeInSecond?: number, attenuated = true) {
        const moveDelta = this._calculateMovePercentDelta({
            anchor: new Vec2(0, 0),
            applyToHorizontal: true,
            applyToVertical: false,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    }

    /**
     * @en
     * Scroll the content to the right boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图右边。
     *
     * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到右边边界。
     * @param attenuated - 滚动加速是否衰减，默认为 true。
     * @example
     * ```typescript
     * // Scroll to the right of the view.
     * scrollView.scrollToRight(0.1);
     * ```
     */
    public scrollToRight (timeInSecond?: number, attenuated = true) {
        const moveDelta = this._calculateMovePercentDelta({
            anchor: new Vec2(1, 0),
            applyToHorizontal: true,
            applyToVertical: false,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    }

    /**
     * @en
     * Scroll the content to the top left boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图左上角。
     *
     * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到左上边边界。
     * @param attenuated - 滚动加速是否衰减，默认为 true。
     * @example
     * ```typescript
     * // Scroll to the upper left corner of the view.
     * scrollView.scrollToTopLeft(0.1);
     * ```
     */
    public scrollToTopLeft (timeInSecond?: number, attenuated = true) {
        const moveDelta = this._calculateMovePercentDelta({
            anchor: new Vec2(0, 1),
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    }

    /**
     * @en
     * Scroll the content to the top right boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图右上角。
     *
     * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到右上边界。
     * @param attenuated - 滚动加速是否衰减，默认为 true。
     * @example
     * ```typescript
     * // Scroll to the top right corner of the view.
     * scrollView.scrollToTopRight(0.1);
     * ```
     */
    public scrollToTopRight (timeInSecond?: number, attenuated = true) {
        const moveDelta = this._calculateMovePercentDelta({
            anchor: new Vec2(1, 1),
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    }

    /**
     * @en
     * Scroll the content to the bottom left boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图左下角。
     *
     * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到左下边界。
     * @param attenuated - 滚动加速是否衰减，默认为 true。
     * @example
     * ```typescript
     * // Scroll to the lower left corner of the view.
     * scrollView.scrollToBottomLeft(0.1);
     * ```
     */
    public scrollToBottomLeft (timeInSecond?: number, attenuated = true) {
        const moveDelta = this._calculateMovePercentDelta({
            anchor: new Vec2(0, 0),
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    }

    /**
     * @en
     * Scroll the content to the bottom right boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图右下角。
     *
     * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到右边下边界。
     * @param attenuated - 滚动加速是否衰减，默认为 true。
     * @example
     * ```typescript
     * // Scroll to the lower right corner of the view.
     * scrollView.scrollToBottomRight(0.1);
     * ```
     */
    public scrollToBottomRight (timeInSecond?: number, attenuated = true) {
        const moveDelta = this._calculateMovePercentDelta({
            anchor: new Vec2(1, 0),
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    }

    /**
     * @en
     * Scroll with an offset related to the ScrollView's top left origin, if timeInSecond is omitted, then it will jump to the specific offset immediately.
     *
     * @zh
     * 视图内容在规定时间内将滚动到 ScrollView 相对左上角原点的偏移位置, 如果 timeInSecond 参数不传，则立即滚动到指定偏移位置。
     *
     * @param offset - 指定移动偏移量。
     * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到指定偏移量处。
     * @param attenuated - 滚动加速是否衰减，默认为 true。
     * @example
     * ```typescript
     * // Scroll to middle position in 0.1 second in x-axis
     * let maxScrollOffset = this.getMaxScrollOffset();
     * scrollView.scrollToOffset(new Vec3(maxScrollOffset.x / 2, 0, 0), 0.1);
     * ```
     */
    public scrollToOffset (offset: Vec3, timeInSecond?: number, attenuated = true) {
        const maxScrollOffset = this.getMaxScrollOffset();

        const anchor = new Vec2(0, 0);
        // if maxScrollOffset is 0, then always align the content's top left origin to the top left corner of its parent
        if (maxScrollOffset.x === 0) {
            anchor.x = 0;
        } else {
            anchor.x = offset.x / maxScrollOffset.x;
        }

        if (maxScrollOffset.y === 0) {
            anchor.y = 1;
        } else {
            anchor.y = (maxScrollOffset.y - offset.y) / maxScrollOffset.y;
        }

        this.scrollTo(anchor, timeInSecond, attenuated);
    }

    /**
     * @en
     * Get the positive offset value corresponds to the content's top left boundary.
     *
     * @zh
     * 获取滚动视图相对于左上角原点的当前滚动偏移。
     *
     * @return - 当前滚动偏移量。
     */
    public getScrollOffset () {
        const topDelta = this._getContentTopBoundary() - this._topBoundary;
        const leftDelta = this._getContentLeftBoundary() - this._leftBoundary;

        return new Vec3(leftDelta, topDelta, 0);
    }

    /**
     * @en
     * Get the maximize available  scroll offset.
     *
     * @zh
     * 获取滚动视图最大可以滚动的偏移量。
     *
     * @return - 最大可滚动偏移量。
     */
    public getMaxScrollOffset () {
        const scrollSize = this.node._uiProps.uiTransformComp!.contentSize;
        const contentSize = this._content!._uiProps.uiTransformComp!.contentSize;
        let horizontalMaximizeOffset = contentSize.width - scrollSize.width;
        let verticalMaximizeOffset = contentSize.height - scrollSize.height;
        horizontalMaximizeOffset = horizontalMaximizeOffset >= 0 ? horizontalMaximizeOffset : 0;
        verticalMaximizeOffset = verticalMaximizeOffset >= 0 ? verticalMaximizeOffset : 0;

        return new Vec3(horizontalMaximizeOffset, verticalMaximizeOffset, 0);
    }

    /**
     * @en
     * Scroll the content to the horizontal percent position of ScrollView.
     *
     * @zh
     * 视图内容在规定时间内将滚动到 ScrollView 水平方向的百分比位置上。
     *
     * @param percent - 0 - 之间的百分比。
     * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到指定水平百分比位置。
     * @param attenuated - 滚动加速是否衰减，默认为 true。
     * @example
     * ```typescript
     * // Scroll to middle position.
     * scrollView.scrollToBottomRight(0.5, 0.1);
     * ```
     */
    public scrollToPercentHorizontal (percent: number, timeInSecond: number, attenuated: boolean) {
        const moveDelta = this._calculateMovePercentDelta({
            anchor: new Vec2(percent, 0),
            applyToHorizontal: true,
            applyToVertical: false,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    }

    /**
     * @en
     * Scroll the content to the percent position of ScrollView in any direction.
     *
     * @zh
     * 视图内容在规定时间内进行垂直方向和水平方向的滚动，并且滚动到指定百分比位置上。
     *
     * @param anchor - 在 new Vec2(0,0) and new Vec2(1,1) 上取差值的一个点。
     * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到指定水平或垂直百分比位置。
     * @param attenuated - 滚动加速是否衰减，默认为 true。
     * @example
     * ```typescript
     * // Vertical scroll to the bottom of the view.
     * scrollView.scrollTo(new Vec2(0, 1), 0.1);
     *
     * // Horizontal scroll to view right.
     * scrollView.scrollTo(new Vec2(1, 0), 0.1);
     * ```
     */
    public scrollTo (anchor: Vec2, timeInSecond?: number, attenuated?: boolean) {
        const moveDelta = this._calculateMovePercentDelta({
            anchor: new Vec2(anchor),
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated);
        } else {
            this._moveContent(moveDelta);
        }
    }

    /**
     * @en
     * Scroll the content to the vertical percent position of ScrollView.
     *
     * @zh
     * 视图内容在规定时间内滚动到 ScrollView 垂直方向的百分比位置上。
     *
     * @param percent - 0 - 1 之间的百分比。
     * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到指定垂直百分比位置。
     * @param attenuated - 滚动加速是否衰减，默认为 true。
     * @example
     * ```typescript
     * scrollView.scrollToPercentVertical(0.5, 0.1);
     * ```
     */
    public scrollToPercentVertical (percent: number, timeInSecond?: number, attenuated?: boolean) {
        const moveDelta = this._calculateMovePercentDelta({
            anchor: new Vec2(0, percent),
            applyToHorizontal: false,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated);
        } else {
            this._moveContent(moveDelta);
        }
    }

    /**
     * @en
     * Stop auto scroll immediately.
     *
     * @zh
     * 停止自动滚动, 调用此 API 可以让 ScrollView 立即停止滚动。
     */
    public stopAutoScroll () {
        this._autoScrolling = false;
        this._autoScrollAccumulatedTime = this._autoScrollTotalTime;
    }

    /**
     * @en
     * Modify the content position.
     *
     * @zh
     * 设置当前视图内容的坐标点。
     *
     * @param position - 当前视图坐标点.
     */
    public setContentPosition (position: Vec3) {
        const contentPos = this.getContentPosition();
        if (Math.abs(position.x - contentPos.x) < EPSILON && Math.abs(position.y - contentPos.y) < EPSILON) {
            return;
        }

        this._content!.setPosition(position);
        this._outOfBoundaryAmountDirty = true;
    }

    /**
     * @en
     * Query the content's position in its parent space.
     *
     * @zh
     * 获取当前视图内容的坐标点。
     *
     * @returns - 当前视图内容的坐标点.
     */
    public getContentPosition () {
        if (!this._content){
            return ZERO;
        }

        this._contentPos.set(this._content.position);
        return this._contentPos;
    }

    /**
     * @en
     * Query whether the user is currently dragging the ScrollView to scroll it.
     *
     * @zh
     * 用户是否在拖拽当前滚动视图。
     *
     * @returns - 是否在拖拽当前滚动视图。
     */
    public isScrolling () {
        return this._scrolling;
    }

    /**
     * @en
     * Query whether the ScrollView is currently scrolling because of a bounceback or inertia slowdown.
     *
     * @zh
     * 当前滚动视图是否在惯性滚动。
     *
     * @returns - 滚动视图是否在惯性滚动。
     */
    public isAutoScrolling () {
        return this._autoScrolling;
    }

    public getScrollEndedEventTiming () {
        return EPSILON;
    }

    public start () {
        this._calculateBoundary();
        // Because widget component will adjust content position and scrollView position is correct after visit
        // So this event could make sure the content is on the correct position after loading.
        if (this._content) {
            director.once(Director.EVENT_BEFORE_DRAW, this._adjustContentOutOfBoundary, this);
        }
    }

    public onEnable () {
        if (!EDITOR) {
            this._registerEvent();
            if (this.content) {
                this.content.on(Node.EventType.SIZE_CHANGED, this._calculateBoundary, this);
                this.content.on(Node.EventType.TRANSFORM_CHANGED, this._scaleChanged, this);
                if (this.view!) {
                    this.view!.on(Node.EventType.TRANSFORM_CHANGED, this._scaleChanged, this);
                    this.view!.on(Node.EventType.SIZE_CHANGED, this._calculateBoundary, this);
                }
            }

            this._calculateBoundary();
        }
        this._showScrollBar();
    }

    public update (dt: number) {
        if (this._autoScrolling) {
            this._processAutoScrolling(dt);
        }
    }

    public onDisable () {
        if (!EDITOR) {
            this._unregisterEvent();
            if (this.content) {
                this.content.off(Node.EventType.SIZE_CHANGED, this._calculateBoundary, this);
                this.content.off(Node.EventType.TRANSFORM_CHANGED, this._scaleChanged, this);
                if (this.view!) {
                    this.view!.off(Node.EventType.TRANSFORM_CHANGED, this._scaleChanged, this);
                    this.view!.off(Node.EventType.SIZE_CHANGED, this._calculateBoundary, this);
                }
            }
        }
        this._hideScrollBar();
        this.stopAutoScroll();
    }

    // private methods
    protected _registerEvent () {
        this.node.on(Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.on(Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.on(Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.on(Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.on(Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
    }

    protected _unregisterEvent () {
        this.node.off(Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.off(Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.off(Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.off(Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.off(Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
    }

    protected _onMouseWheel (event: EventMouse, captureListeners?: Node[]) {
        if (!this.enabledInHierarchy) {
            return;
        }

        if (this._hasNestedViewGroup(event, captureListeners)) {
            return;
        }

        const deltaMove = new Vec3();
        const wheelPrecision = -0.1;
        const scrollY = event.getScrollY();
        if (this.vertical) {
            deltaMove.set(0, scrollY * wheelPrecision, 0);
        } else if (this.horizontal) {
            deltaMove.set(scrollY * wheelPrecision, 0, 0);
        }

        this._mouseWheelEventElapsedTime = 0;
        this._processDeltaMove(deltaMove);

        if (!this._stopMouseWheel) {
            this._handlePressLogic();
            this.schedule(this._checkMouseWheel, 1.0 / 60, NaN, 0);
            this._stopMouseWheel = true;
        }

        this._stopPropagationIfTargetIsMe(event);
    }

    protected _onTouchBegan (event: EventTouch, captureListeners?: Node[]) {
        if (!this.enabledInHierarchy || !this._content) { return; }
        if (this._hasNestedViewGroup(event, captureListeners)) { return; }

        // let touch = event.touch;
        if (this._content) {
            this._handlePressLogic();
        }
        this._touchMoved = false;
        this._stopPropagationIfTargetIsMe(event);
    }

    protected _onTouchMoved (event: EventTouch, captureListeners?: Node[]) {
        if (!this.enabledInHierarchy || !this._content) { return; }
        if (this._hasNestedViewGroup(event, captureListeners)) { return; }

        const touch = event.touch!;
        if (this._content) {
            this._handleMoveLogic(touch);
        }
        // Do not prevent touch events in inner nodes
        if (!this.cancelInnerEvents) {
            return;
        }

        const deltaMove = touch.getUILocation(_tempVec2);
        deltaMove.subtract(touch.getUIStartLocation(_tempVec2_1));
        // FIXME: touch move delta should be calculated by DPI.
        if (deltaMove.length() > 7) {
            if (!this._touchMoved && event.target !== this.node) {
                // Simulate touch cancel for target node
                const cancelEvent = new EventTouch(event.getTouches(), event.bubbles);
                cancelEvent.type = Node.EventType.TOUCH_CANCEL;
                cancelEvent.touch = event.touch;
                cancelEvent.simulate = true;
                (event.target as Node).dispatchEvent(cancelEvent);
                this._touchMoved = true;
            }
        }
        this._stopPropagationIfTargetIsMe(event);
    }

    protected _onTouchEnded (event: EventTouch, captureListeners?: Node[]) {
        if (!this.enabledInHierarchy || !this._content || !event) { return; }
        if (this._hasNestedViewGroup(event, captureListeners)) { return; }

        this._dispatchEvent(EventType.TOUCH_UP);

        const touch = event.touch!;
        if (this._content) {
            this._handleReleaseLogic(touch);
        }
        if (this._touchMoved) {
            event.propagationStopped = true;
        } else {
            this._stopPropagationIfTargetIsMe(event);
        }
    }

    protected _onTouchCancelled (event: EventTouch, captureListeners?: Node[]) {
        if (!this.enabledInHierarchy || !this._content) { return; }
        if (this._hasNestedViewGroup(event, captureListeners)) { return; }

        // Filter touch cancel event send from self
        if (event && !event.simulate) {
            const touch = event.touch!;
            if (this._content) {
                this._handleReleaseLogic(touch);
            }
        }
        this._stopPropagationIfTargetIsMe(event);
    }

    protected _calculateBoundary () {
        if (this.content) {
            // refresh content size
            const layout = this.content.getComponent(LayoutComponent);
            if (layout && layout.enabledInHierarchy) {
                layout.updateLayout();
            }
            const viewSize = this.view!._uiProps.uiTransformComp!.contentSize;

            const anchorX = viewSize.width * this.view!.anchorX;
            const anchorY = viewSize.height * this.view!.anchorY;

            this._leftBoundary = -anchorX;
            this._bottomBoundary = -anchorY;

            this._rightBoundary = this._leftBoundary + viewSize.width;
            this._topBoundary = this._bottomBoundary + viewSize.height;

            this._moveContentToTopLeft(viewSize);
        }

    }

    protected _hasNestedViewGroup (event: Event, captureListeners?: Node[]) {
        if (!event || event.eventPhase !== Event.CAPTURING_PHASE) {
            return;
        }

        if (captureListeners) {
            // captureListeners are arranged from child to parent
            for (const listener of captureListeners) {
                const item = listener;

                if (this.node === item) {
                    if (event.target && (event.target as Node).getComponent(ViewGroupComponent)) {
                        return true;
                    }
                    return false;
                }

                if (item.getComponent(ViewGroupComponent)) {
                    return true;
                }
            }
        }
        return false;
    }

    protected _startInertiaScroll (touchMoveVelocity: Vec3) {
        const inertiaTotalMovement = new Vec3(touchMoveVelocity);
        inertiaTotalMovement.multiplyScalar(MOVEMENT_FACTOR);
        this._startAttenuatingAutoScroll(inertiaTotalMovement, touchMoveVelocity);
    }

    protected _calculateAttenuatedFactor (distance: number) {
        if (this.brake <= 0) {
            return (1 - this.brake);
        }

        // attenuate formula from: http://learnopengl.com/#!Lighting/Light-casters
        return (1 - this.brake) * (1 / (1 + distance * 0.000014 + distance * distance * 0.000000008));
    }

    protected _startAttenuatingAutoScroll (deltaMove: Vec3, initialVelocity: Vec3) {
        let time = this._calculateAutoScrollTimeByInitialSpeed(initialVelocity.length());

        const targetDelta = new Vec3(deltaMove);
        targetDelta.normalize();
        const contentSize = this._content!._uiProps.uiTransformComp!.contentSize;
        const scrollViewSize = this.node._uiProps.uiTransformComp!.contentSize;

        const totalMoveWidth = (contentSize.width - scrollViewSize.width);
        const totalMoveHeight = (contentSize.height - scrollViewSize.height);

        const attenuatedFactorX = this._calculateAttenuatedFactor(totalMoveWidth);
        const attenuatedFactorY = this._calculateAttenuatedFactor(totalMoveHeight);

        targetDelta.x = targetDelta.x * totalMoveWidth * (1 - this.brake) * attenuatedFactorX;
        targetDelta.y = targetDelta.y * totalMoveHeight * attenuatedFactorY * (1 - this.brake);
        targetDelta.z = 0;

        const originalMoveLength = deltaMove.length();
        let factor = targetDelta.length() / originalMoveLength;
        targetDelta.add(deltaMove);

        if (this.brake > 0 && factor > 7) {
            factor = Math.sqrt(factor);
            const a = new Vec3(deltaMove);
            a.multiplyScalar(factor);
            targetDelta.set(a);
            targetDelta.add(deltaMove);
        }

        if (this.brake > 0 && factor > 3) {
            factor = 3;
            time = time * factor;
        }

        if (this.brake === 0 && factor > 1) {
            time = time * factor;
        }

        this._startAutoScroll(targetDelta, time, true);
    }

    protected _calculateAutoScrollTimeByInitialSpeed (initialSpeed: number) {
        return Math.sqrt(Math.sqrt(initialSpeed / 5));
    }

    protected _startAutoScroll (deltaMove: Vec3, timeInSecond: number, attenuated: boolean = false) {
        const adjustedDeltaMove = this._flattenVectorByDirection(deltaMove);

        this._autoScrolling = true;
        this._autoScrollTargetDelta = adjustedDeltaMove;
        this._autoScrollAttenuate = attenuated;
        Vec3.copy(this._autoScrollStartPosition, this.getContentPosition());
        this._autoScrollTotalTime = timeInSecond;
        this._autoScrollAccumulatedTime = 0;
        this._autoScrollBraking = false;
        this._isScrollEndedWithThresholdEventFired = false;
        this._autoScrollBrakingStartPosition = new Vec3();

        const currentOutOfBoundary = this._getHowMuchOutOfBoundary();
        if (!currentOutOfBoundary.equals(ZERO, EPSILON)) {
            this._autoScrollCurrentlyOutOfBoundary = true;
        }
    }

    protected _calculateTouchMoveVelocity () {
        let totalTime = 0;
        totalTime = this._touchMoveTimeDeltas.reduce((a, b) => {
            return a + b;
        }, totalTime);

        if (totalTime <= 0 || totalTime >= 0.5) {
            return new Vec3();
        }

        let totalMovement = new Vec3();
        totalMovement = this._touchMoveDisplacements.reduce((a, b) => {
            a.add(b);
            return a;
        }, totalMovement);

        return new Vec3(totalMovement.x * (1 - this.brake) / totalTime,
            totalMovement.y * (1 - this.brake) / totalTime, 0);
    }

    protected _flattenVectorByDirection (vector: Vec3) {
        const result = vector;
        result.x = this.horizontal ? result.x : 0;
        result.y = this.vertical ? result.y : 0;
        return result;
    }

    protected _moveContent (deltaMove: Vec3, canStartBounceBack?: boolean) {
        const adjustedMove = this._flattenVectorByDirection(deltaMove);
        _tempVec3.set(this.getContentPosition());
        _tempVec3.add(adjustedMove);
        _tempVec3.set(Math.floor(_tempVec3.x * TOLERANCE) * EPSILON, Math.floor(_tempVec3.y * TOLERANCE) * EPSILON, _tempVec3.z);
        this.setContentPosition(_tempVec3);
        const outOfBoundary = this._getHowMuchOutOfBoundary();
        this._updateScrollBar(outOfBoundary);

        if (this.elastic && canStartBounceBack) {
            this._startBounceBackIfNeeded();
        }
    }

    protected _getContentLeftBoundary () {
        const contentPos = this.getContentPosition();
        return contentPos.x - this._content!.anchorX * this._content!.width;
    }

    protected _getContentRightBoundary () {
        return this._getContentLeftBoundary() + this._content!.width;
    }

    protected _getContentTopBoundary () {
        return this._getContentBottomBoundary() + this._content!.height;
    }

    protected _getContentBottomBoundary () {
        const contentPos = this.getContentPosition();
        return contentPos.y - this._content!.anchorY * this._content!.height;
    }

    protected _getHowMuchOutOfBoundary (addition?: Vec3) {
        addition = addition || new Vec3();
        if (addition.equals(ZERO, EPSILON) && !this._outOfBoundaryAmountDirty) {
            return this._outOfBoundaryAmount;
        }

        let outOfBoundaryAmount = new Vec3();
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

        if (addition.equals(ZERO, EPSILON)) {
            this._outOfBoundaryAmount = outOfBoundaryAmount;
            this._outOfBoundaryAmountDirty = false;
        }

        outOfBoundaryAmount = this._clampDelta(outOfBoundaryAmount);
        return outOfBoundaryAmount;
    }

    protected _updateScrollBar (outOfBoundary: Vec3) {
        if (this._horizontalScrollBar) {
            this._horizontalScrollBar.onScroll(outOfBoundary);
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar.onScroll(outOfBoundary);
        }
    }

    protected _onScrollBarTouchBegan () {
        if (this._horizontalScrollBar) {
            this._horizontalScrollBar.onTouchBegan();
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar.onTouchBegan();
        }
    }

    protected _onScrollBarTouchEnded () {
        if (this._horizontalScrollBar) {
            this._horizontalScrollBar.onTouchEnded();
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar.onTouchEnded();
        }
    }

    protected _dispatchEvent (event: string) {
        if (event === EventType.SCROLL_ENDED) {
            this._scrollEventEmitMask = 0;

        } else if (event === EventType.SCROLL_TO_TOP
            || event === EventType.SCROLL_TO_BOTTOM
            || event === EventType.SCROLL_TO_LEFT
            || event === EventType.SCROLL_TO_RIGHT) {

            const flag = (1 << eventMap[event]);
            if (this._scrollEventEmitMask & flag) {
                return;
            } else {
                this._scrollEventEmitMask |= flag;
            }
        }

        ComponentEventHandler.emitEvents(this.scrollEvents, this, eventMap[event]);
        this.node.emit(event, this);
    }

    protected _adjustContentOutOfBoundary () {
        if (!this._content){
            return;
        }

        this._outOfBoundaryAmountDirty = true;
        if (this._isOutOfBoundary()) {
            const outOfBoundary = this._getHowMuchOutOfBoundary();
            _tempVec3.set(this.getContentPosition());
            _tempVec3.add(outOfBoundary);
            if (this._content) {
                this._content.setPosition(_tempVec3);
                this._updateScrollBar(ZERO);
            }
        }
    }

    protected _hideScrollBar () {
        if (this._horizontalScrollBar) {
            this._horizontalScrollBar.hide();
        }

        if (this._verticalScrollBar) {
            this._verticalScrollBar.hide();
        }
    }

    protected _showScrollBar () {
        if (this._horizontalScrollBar) {
            this._horizontalScrollBar.show();
        }

        if (this._verticalScrollBar) {
            this._verticalScrollBar.show();
        }
    }

    // This is for ScrollView as children of a Button
    protected _stopPropagationIfTargetIsMe (event: Event) {
        if (event.eventPhase === Event.AT_TARGET && event.target === this.node) {
            event.propagationStopped = true;
        }
    }

    protected _processDeltaMove (deltaMove: Vec3) {
        this._scrollChildren(deltaMove);
        this._gatherTouchMove(deltaMove);
    }

    protected _handleMoveLogic (touch: Touch) {
        this._deltaPos.set(this._getLocalAxisAlignDelta(touch));
        this._processDeltaMove(this._deltaPos);
    }

    protected _handleReleaseLogic (touch: Touch) {
        this._deltaPos.set(this._getLocalAxisAlignDelta(touch));
        this._gatherTouchMove(this._deltaPos);
        this._processInertiaScroll();

        if (this._scrolling) {
            this._scrolling = false;
            if (!this._autoScrolling) {
                this._dispatchEvent(EventType.SCROLL_ENDED);
            }
        }
    }

    protected _getLocalAxisAlignDelta (touch: Touch){
        const uiTransformComp = this.node._uiProps.uiTransformComp;
        const vec = new Vec3();

        if (uiTransformComp) {
            touch.getUILocation(_tempVec2);
            touch.getUIPreviousLocation(_tempVec2_1);
            _tempVec3.set(_tempVec2.x, _tempVec2.y, 0);
            _tempVec3_1.set(_tempVec2_1.x, _tempVec2_1.y, 0);
            uiTransformComp.convertToNodeSpaceAR(_tempVec3, _tempVec3);
            uiTransformComp.convertToNodeSpaceAR(_tempVec3_1, _tempVec3_1);
            Vec3.subtract(vec, _tempVec3, _tempVec3_1);
        }

        return vec;
    }

    protected _scrollChildren (deltaMove: Vec3) {
        deltaMove = this._clampDelta(deltaMove);

        const realMove = deltaMove;
        let outOfBoundary: Vec3;
        if (this.elastic) {
            outOfBoundary = this._getHowMuchOutOfBoundary();
            realMove.x *= (outOfBoundary.x === 0 ? 1 : 0.5);
            realMove.y *= (outOfBoundary.y === 0 ? 1 : 0.5);
        }

        if (!this.elastic) {
            outOfBoundary = this._getHowMuchOutOfBoundary(realMove);
            realMove.add(outOfBoundary);
        }

        let scrollEventType;
        const pos = this._content!.position;

        if (realMove.y > 0) { // up
            const icBottomPos = pos.y - this._content!.anchorY * this._content!.height;

            if (icBottomPos + realMove.y >= this._bottomBoundary) {
                scrollEventType = EventType.SCROLL_TO_BOTTOM;
            }
        } else if (realMove.y < 0) { // down
            const icTopPos = pos.y - this._content!.anchorY * this._content!.height + this._content!.height;

            if (icTopPos + realMove.y <= this._topBoundary) {
                scrollEventType = EventType.SCROLL_TO_TOP;
            }
        } else if (realMove.x < 0) { // left
            const icRightPos = pos.x - this._content!.anchorX * this._content!.width + this._content!.width;
            if (icRightPos + realMove.x <= this._rightBoundary) {
                scrollEventType = EventType.SCROLL_TO_RIGHT;
            }
        } else if (realMove.x > 0) { // right
            const icLeftPos = pos.x - this._content!.anchorX * this._content!.width;
            if (icLeftPos + realMove.x >= this._leftBoundary) {
                scrollEventType = EventType.SCROLL_TO_LEFT;
            }
        }

        this._moveContent(realMove, false);

        if (realMove.x !== 0 || realMove.y !== 0) {
            if (!this._scrolling) {
                this._scrolling = true;
                this._dispatchEvent(EventType.SCROLL_BEGAN);
            }
            this._dispatchEvent(EventType.SCROLLING);
        }

        if (scrollEventType && scrollEventType.length > 0) {
            this._dispatchEvent(scrollEventType);
        }

    }

    protected _handlePressLogic () {
        if (this._autoScrolling) {
            this._dispatchEvent(EventType.SCROLL_ENDED);
        }

        this._autoScrolling = false;
        this._isBouncing = false;

        this._touchMovePreviousTimestamp = getTimeInMilliseconds();
        this._touchMoveDisplacements.length = 0;
        this._touchMoveTimeDeltas.length = 0;

        this._onScrollBarTouchBegan();
    }

    protected _clampDelta (delta: Vec3) {
        const contentSize = this._content!._uiProps.uiTransformComp!.contentSize;
        const scrollViewSize = this.node._uiProps.uiTransformComp!.contentSize;
        if (contentSize.width < scrollViewSize.width) {
            delta.x = 0;
        }
        if (contentSize.height < scrollViewSize.height) {
            delta.y = 0;
        }

        return delta;
    }

    protected _gatherTouchMove (delta: Vec3) {
        const clampDt = delta.clone();
        this._clampDelta(clampDt);

        while (this._touchMoveDisplacements.length >= NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED) {
            this._touchMoveDisplacements.shift();
            this._touchMoveTimeDeltas.shift();
        }

        this._touchMoveDisplacements.push(clampDt);

        const timeStamp = getTimeInMilliseconds();
        this._touchMoveTimeDeltas.push((timeStamp - this._touchMovePreviousTimestamp) / 1000);
        this._touchMovePreviousTimestamp = timeStamp;
    }

    protected _startBounceBackIfNeeded () {
        if (!this.elastic) {
            return false;
        }

        let bounceBackAmount = this._getHowMuchOutOfBoundary();
        bounceBackAmount = this._clampDelta(bounceBackAmount);

        if (bounceBackAmount.equals(ZERO, EPSILON)) {
            return false;
        }

        const bounceBackTime = Math.max(this.bounceDuration, 0);
        this._startAutoScroll(bounceBackAmount, bounceBackTime, true);

        if (!this._isBouncing) {
            if (bounceBackAmount.y > 0) { this._dispatchEvent(EventType.BOUNCE_TOP); }
            if (bounceBackAmount.y < 0) { this._dispatchEvent(EventType.BOUNCE_BOTTOM); }
            if (bounceBackAmount.x > 0) { this._dispatchEvent(EventType.BOUNCE_RIGHT); }
            if (bounceBackAmount.x < 0) { this._dispatchEvent(EventType.BOUNCE_LEFT); }
            this._isBouncing = true;
        }

        return true;
    }

    protected _processInertiaScroll () {
        const bounceBackStarted = this._startBounceBackIfNeeded();
        if (!bounceBackStarted && this.inertia) {
            const touchMoveVelocity = this._calculateTouchMoveVelocity();
            if (!touchMoveVelocity.equals(_tempVec3, EPSILON) && this.brake < 1) {
                this._startInertiaScroll(touchMoveVelocity);
            }
        }

        this._onScrollBarTouchEnded();
    }

    protected _isOutOfBoundary () {
        const outOfBoundary = this._getHowMuchOutOfBoundary();
        return !outOfBoundary.equals(ZERO, EPSILON);
    }

    protected _isNecessaryAutoScrollBrake () {
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
    }

    protected _processAutoScrolling (dt) {
        const isAutoScrollBrake = this._isNecessaryAutoScrollBrake();
        const brakingFactor = isAutoScrollBrake ? OUT_OF_BOUNDARY_BREAKING_FACTOR : 1;
        this._autoScrollAccumulatedTime += dt * (1 / brakingFactor);

        let percentage = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);
        if (this._autoScrollAttenuate) {
            percentage = quintEaseOut(percentage);
        }

        const a = new Vec3(this._autoScrollTargetDelta);
        a.multiplyScalar(percentage);
        const newPosition = new Vec3(this._autoScrollStartPosition);
        newPosition.add(a);
        let reachedEnd = Math.abs(percentage - 1) <= EPSILON;

        const fireEvent = Math.abs(percentage - 1) <= this.getScrollEndedEventTiming();
        if (fireEvent && !this._isScrollEndedWithThresholdEventFired) {
            this._dispatchEvent(EventType.SCROLL_ENG_WITH_THRESHOLD);
            this._isScrollEndedWithThresholdEventFired = true;
        }

        if (this.elastic) {
            const brakeOffsetPosition = new Vec3(newPosition);
            brakeOffsetPosition.subtract(this._autoScrollBrakingStartPosition);
            if (isAutoScrollBrake) {
                brakeOffsetPosition.multiplyScalar(brakingFactor);
            }
            newPosition.set(this._autoScrollBrakingStartPosition);
            newPosition.add(brakeOffsetPosition);
        } else {
            const moveDelta = new Vec3(newPosition);
            moveDelta.subtract(this.getContentPosition());
            const outOfBoundary = this._getHowMuchOutOfBoundary(moveDelta);
            if (!outOfBoundary.equals(ZERO, EPSILON)) {
                newPosition.add(outOfBoundary);
                reachedEnd = true;
            }
        }

        if (reachedEnd) {
            this._autoScrolling = false;
        }

        const deltaMove = new Vec3(newPosition);
        deltaMove.subtract(this.getContentPosition());
        this._moveContent(this._clampDelta(deltaMove), reachedEnd);
        this._dispatchEvent(EventType.SCROLLING);

        if (!this._autoScrolling) {
            this._isBouncing = false;
            this._scrolling = false;
            this._dispatchEvent(EventType.SCROLL_ENDED);
        }
    }

    protected _checkMouseWheel (dt: number) {
        const currentOutOfBoundary = this._getHowMuchOutOfBoundary();
        const maxElapsedTime = 0.1;

        if (!currentOutOfBoundary.equals(ZERO, EPSILON)) {
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
    }

    protected _calculateMovePercentDelta (options) {
        const anchor = options.anchor;
        const applyToHorizontal = options.applyToHorizontal;
        const applyToVertical = options.applyToVertical;
        this._calculateBoundary();

        anchor.clampf(new Vec2(0, 0), new Vec2(1, 1));

        const scrollSize = this.node._uiProps.uiTransformComp!.contentSize;
        const contentSize = this._content!._uiProps.uiTransformComp!.contentSize;
        let bottomDelta = this._getContentBottomBoundary() - this._bottomBoundary;
        bottomDelta = -bottomDelta;

        let leftDelta = this._getContentLeftBoundary() - this._leftBoundary;
        leftDelta = -leftDelta;

        const moveDelta = new Vec3();
        let totalScrollDelta = 0;
        if (applyToHorizontal) {
            totalScrollDelta = contentSize.width - scrollSize.width;
            moveDelta.x = leftDelta - totalScrollDelta * anchor.x;
        }

        if (applyToVertical) {
            totalScrollDelta = contentSize.height - scrollSize.height;
            moveDelta.y = bottomDelta - totalScrollDelta * anchor.y;
        }

        return moveDelta;
    }

    protected _moveContentToTopLeft (scrollViewSize: Size) {
        const contentSize = this._content!._uiProps.uiTransformComp!.contentSize;

        let bottomDelta = this._getContentBottomBoundary() - this._bottomBoundary;
        bottomDelta = -bottomDelta;
        const moveDelta = new Vec3();
        let totalScrollDelta = 0;

        let leftDelta = this._getContentLeftBoundary() - this._leftBoundary;
        leftDelta = -leftDelta;

        // 是否限制在上视区上边
        if (contentSize.height < scrollViewSize.height) {
            totalScrollDelta = contentSize.height - scrollViewSize.height;
            moveDelta.y = bottomDelta - totalScrollDelta;

            if (this.verticalScrollBar) {
                this.verticalScrollBar.hide();
            }
        } else {
            if (this.verticalScrollBar) {
                this.verticalScrollBar.show();
            }
        }

        // 是否限制在上视区左边
        if (contentSize.width < scrollViewSize.width) {
            totalScrollDelta = contentSize.width - scrollViewSize.width;
            moveDelta.x = leftDelta;

            if (this._horizontalScrollBar) {
                this._horizontalScrollBar.hide();
            }

        } else {
            if (this._horizontalScrollBar) {
                this._horizontalScrollBar.show();
            }
        }

        this._moveContent(moveDelta);
        this._adjustContentOutOfBoundary();
    }

    protected _scaleChanged (value: TransformBit){
        if (value === TransformBit.SCALE) {
            this._calculateBoundary();
        }
    }
}

legacyCC.ScrollViewComponent = ScrollViewComponent;

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-top
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-bottom
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-left
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-right
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scrolling
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-bottom
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-top
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-left
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-right
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-ended
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event touch-up
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-began
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */
