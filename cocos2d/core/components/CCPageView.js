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

/**
 * !#en The Page View Size Mode
 * !#zh 页面视图每个页面统一的大小类型
 * @enum PageView.SizeMode
 */
var SizeMode = cc.Enum({
    /**
     * !#en Each page is unified in size
     * !#zh 每个页面统一大小
     * @property {Number} Unified
     */
    Unified: 0,
    /**
     * !#en Each page is in free size
     * !#zh 每个页面大小随意
     * @property {Number} Free
     */
    Free: 1
});

/**
 * !#en The Page View Direction
 * !#zh 页面视图滚动类型
 * @enum PageView.Direction
 */
var Direction = cc.Enum({
    /**
     * !#en Horizontal scroll.
     * !#zh 水平滚动
     * @property {Number} Horizontal
     */
    Horizontal: 0,
    /**
     * !#en Vertical scroll.
     * !#zh 垂直滚动
     * @property {Number} Vertical
     */
    Vertical: 1
});

/**
 * !#en Enum for ScrollView event type.
 * !#zh 滚动视图事件类型
 * @enum PageView.EventType
 */
var EventType = cc.Enum({
    /**
     * !#en The page turning event
     * !#zh 翻页事件
     * @property {Number} PAGE_TURNING
     */
    PAGE_TURNING: 0

});

/**
 * !#en The PageView control
 * !#zh 页面视图组件
 * @class PageView
 * @extends ScrollView
 */
var PageView = cc.Class({
    name: 'cc.PageView',
    extends: cc.ScrollView,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/PageView',
        help: 'i18n:COMPONENT.help_url.pageview',
        inspector: 'packages://inspector/inspectors/comps/ccpageview.js',
        executeInEditMode: false
    },

    ctor: function () {
        this._curPageIdx = 0;
        this._lastPageIdx = 0;
        this._pages = [];
        this._initContentPos = cc.v2();
        this._scrollCenterOffsetX = []; // 每一个页面居中时需要的偏移量（X）
        this._scrollCenterOffsetY = []; // 每一个页面居中时需要的偏移量（Y）
    },

    properties: {

        /**
         * !#en Specify the size type of each page in PageView.
         * !#zh 页面视图中每个页面大小类型
         * @property {PageView.SizeMode} sizeMode
         */
        sizeMode: {
            default: SizeMode.Unified,
            type: SizeMode,
            tooltip: CC_DEV && 'i18n:COMPONENT.pageview.sizeMode',
            notify: function() {
                this._syncSizeMode();
            }
        },

        /**
         * !#en The page view direction
         * !#zh 页面视图滚动类型
         * @property {PageView.Direction} direction
         */
        direction: {
            default: Direction.Horizontal,
            type: Direction,
            tooltip: CC_DEV && 'i18n:COMPONENT.pageview.direction',
            notify: function() {
                this._syncScrollDirection();
            }
        },

        /**
         * !#en
         * The scroll threshold value, when drag exceeds this value,
         * release the next page will automatically scroll, less than the restore
         * !#zh 滚动临界值，默认单位百分比，当拖拽超出该数值时，松开会自动滚动下一页，小于时则还原。
         * @property {Number} scrollThreshold
         */
        scrollThreshold: {
            default: 0.5,
            type: cc.Float,
            slide: true,
            range: [0, 1, 0.01],
            tooltip: CC_DEV && 'i18n:COMPONENT.pageview.scrollThreshold'
        },

        /**
         * !#en
         * Auto page turning velocity threshold. When users swipe the PageView quickly,
         * it will calculate a velocity based on the scroll distance and time,
         * if the calculated velocity is larger than the threshold, then it will trigger page turning.
         * !#zh
         * 快速滑动翻页临界值。
         * 当用户快速滑动时，会根据滑动开始和结束的距离与时间计算出一个速度值，
         * 该值与此临界值相比较，如果大于临界值，则进行自动翻页。
         * @property {Number} autoPageTurningThreshold
         */
        autoPageTurningThreshold: {
            default: 100,
            type: cc.Float,
            tooltip: CC_DEV && 'i18n:COMPONENT.pageview.autoPageTurningThreshold'
        },

        /**
         * !#en Change the PageTurning event timing of PageView.
         * !#zh 设置 PageView PageTurning 事件的发送时机。
         * @property {Number} pageTurningEventTiming
         */
        pageTurningEventTiming: {
            default: 0.1,
            type: cc.Float,
            range: [0, 1, 0.01],
            tooltip: CC_DEV && 'i18n:COMPONENT.pageview.pageTurningEventTiming'
        },

        /**
         * !#en The Page View Indicator
         * !#zh 页面视图指示器组件
         * @property {PageViewIndicator} indicator
         */
        indicator: {
            default: null,
            type: cc.PageViewIndicator,
            tooltip: CC_DEV && 'i18n:COMPONENT.pageview.indicator',
            notify:  function() {
                if (this.indicator) {
                    this.indicator.setPageView(this);
                }
            }
        },

        /**
         * !#en The time required to turn over a page. unit: second
         * !#zh 每个页面翻页时所需时间。单位：秒
         * @property {Number} pageTurningSpeed
         */
        pageTurningSpeed: {
            default: 0.3,
            type: cc.Float,
            tooltip: CC_DEV && 'i18n:COMPONENT.pageview.pageTurningSpeed'
        },

        /**
         * !#en PageView events callback
         * !#zh 滚动视图的事件回调函数
         * @property {Component.EventHandler[]} pageEvents
         */
        pageEvents: {
            default: [],
            type: cc.Component.EventHandler,
            tooltip: CC_DEV && 'i18n:COMPONENT.pageview.pageEvents'
        }
    },

    statics: {
        SizeMode: SizeMode,
        Direction: Direction,
        EventType: EventType
    },

    __preload: function () {
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateAllPagesSize, this);
    },

    onEnable: function () {
        this._super();
        if(!CC_EDITOR) {
            this.node.on('scroll-ended-with-threshold', this._dispatchPageTurningEvent, this);
        }
    },

    onDisable: function () {
        this._super();
        if(!CC_EDITOR) {
            this.node.off('scroll-ended-with-threshold', this._dispatchPageTurningEvent, this);
        }
    },

    onLoad: function () {
        this._initPages();
        if (this.indicator) {
            this.indicator.setPageView(this);
        }
    },

    onDestroy: function() {
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateAllPagesSize, this);
    },

    /**
     * !#en Returns current page index
     * !#zh 返回当前页面索引
     * @method getCurrentPageIndex
     * @returns {Number}
     */
    getCurrentPageIndex: function () {
        return this._curPageIdx;
    },

    /**
     * !#en Set current page index
     * !#zh 设置当前页面索引
     * @method setCurrentPageIndex
     * @param {Number} index
     */
    setCurrentPageIndex: function (index) {
        this.scrollToPage(index, true);
    },

    /**
     * !#en Returns all pages of pageview
     * !#zh 返回视图中的所有页面
     * @method getPages
     * @returns {Node[]}
     */
    getPages: function () {
        return this._pages;
    },

    /**
     * !#en At the end of the current page view to insert a new view
     * !#zh 在当前页面视图的尾部插入一个新视图
     * @method addPage
     * @param {Node} page
     */
    addPage: function (page) {
        if (!page || this._pages.indexOf(page) !== -1 || !this.content)
            return;
        this.content.addChild(page);
        this._pages.push(page);
        this._updatePageView();
    },

    /**
     * !#en Inserts a page in the specified location
     * !#zh 将页面插入指定位置中
     * @method insertPage
     * @param {Node} page
     * @param {Number} index
     */
    insertPage: function (page, index) {
        if (index < 0 || !page || this._pages.indexOf(page) !== -1 || !this.content)
            return;
        var pageCount = this._pages.length;
        if (index >= pageCount)
            this.addPage(page);
        else {
            this._pages.splice(index, 0, page);
            this.content.addChild(page);
            this._updatePageView();
        }
    },

    /**
     * !#en Removes a page from PageView.
     * !#zh 移除指定页面
     * @method removePage
     * @param {Node} page
     */
    removePage: function (page) {
        if (!page || !this.content) return;
        var index = this._pages.indexOf(page);
        if (index === -1) {
            cc.warnID(4300, page.name);
            return;
        }
        this.removePageAtIndex(index);
    },

    /**
     * !#en Removes a page at index of PageView.
     * !#zh 移除指定下标的页面
     * @method removePageAtIndex
     * @param {Number} index
     */
    removePageAtIndex: function (index) {
        var pageList = this._pages;
        if (index < 0 || index >= pageList.length) return;
        var page = pageList[index];
        if (!page) return;
        this.content.removeChild(page);
        pageList.splice(index, 1);
        this._updatePageView();
    },

    /**
     * !#en Removes all pages from PageView
     * !#zh 移除所有页面
     * @method removeAllPages
     */
    removeAllPages: function () {
        if (!this.content) { return; }
        var locPages = this._pages;
        for (var i = 0, len = locPages.length; i < len; i++)
            this.content.removeChild(locPages[i]);
        this._pages.length = 0;
        this._updatePageView();
    },

    /**
     * !#en Scroll PageView to index.
     * !#zh 滚动到指定页面
     * @method scrollToPage
     * @param {Number} idx index of page.
     * @param {Number} timeInSecond scrolling time
     */
    scrollToPage: function (idx, timeInSecond) {
        if (idx < 0 || idx >= this._pages.length)
            return;
        timeInSecond = timeInSecond !== undefined ? timeInSecond : 0.3;
        this._curPageIdx = idx;
        this.scrollToOffset(this._moveOffsetValue(idx), timeInSecond, true);
        if (this.indicator) {
            this.indicator._changedState();
        }
    },

    //override the method of ScrollView
    getScrollEndedEventTiming: function () {
        return this.pageTurningEventTiming;
    },

    _syncScrollDirection: function () {
        this.horizontal = this.direction === Direction.Horizontal;
        this.vertical = this.direction === Direction.Vertical;
    },

    _syncSizeMode: function () {
        if (!this.content) { return; }
        var layout = this.content.getComponent(cc.Layout);
        if (layout) {
            if (this.sizeMode === SizeMode.Free && this._pages.length > 0) {
                var lastPage = this._pages[this._pages.length - 1];
                if (this.direction === Direction.Horizontal) {
                    layout.paddingLeft = (this._view.width - this._pages[0].width) / 2;
                    layout.paddingRight = (this._view.width - lastPage.width) / 2;
                }
                else if (this.direction === Direction.Vertical) {
                    layout.paddingTop = (this._view.height - this._pages[0].height) / 2;
                    layout.paddingBottom = (this._view.height - lastPage.height) / 2;
                }
            }
            layout.updateLayout();
        }
    },

    // 刷新页面视图
    _updatePageView: function () {
        // 当页面数组变化时修改 content 大小
        var layout = this.content.getComponent(cc.Layout);
        if (layout && layout.enabled) {
            layout.updateLayout();
        }

        var pageCount = this._pages.length;

        if (this._curPageIdx >= pageCount) {
            this._curPageIdx = pageCount === 0 ? 0 : pageCount - 1;
            this._lastPageIdx = this._curPageIdx;
        }
        // 进行排序
        var contentPos = this._initContentPos;
        for (var i = 0; i < pageCount; ++i) {
            var page = this._pages[i];
            page.setSiblingIndex(i);
            if (this.direction === Direction.Horizontal) {
                this._scrollCenterOffsetX[i] = Math.abs(contentPos.x + page.x);
            }
            else {
                this._scrollCenterOffsetY[i] = Math.abs(contentPos.y + page.y);
            }
        }

        // 刷新 indicator 信息与状态
        if (this.indicator) {
            this.indicator._refresh();
        }
    },

    // 刷新所有页面的大小
    _updateAllPagesSize: function () {
        if (this.sizeMode !== SizeMode.Unified) {
            return;
        }
        var locPages = CC_EDITOR ? this.content.children : this._pages;
        var selfSize = this._view.getContentSize();
        for (var i = 0, len = locPages.length; i < len; i++) {
            locPages[i].setContentSize(selfSize);
        }
    },

    // 初始化页面
    _initPages: function () {
        if (!this.content) { return; }
        this._initContentPos = this.content.position;
        var children = this.content.children;
        for (var i = 0; i < children.length; ++i) {
            var page = children[i];
            if (this._pages.indexOf(page) >= 0) { continue; }
            this._pages.push(page);
        }
        this._syncScrollDirection();
        this._syncSizeMode();
        this._updatePageView();
    },

    _dispatchPageTurningEvent: function () {
        if (this._lastPageIdx === this._curPageIdx) return;
        this._lastPageIdx = this._curPageIdx;
        cc.Component.EventHandler.emitEvents(this.pageEvents, this, EventType.PAGE_TURNING);
        this.node.emit('page-turning', this);
    },

    // 是否超过自动滚动临界值
    _isScrollable: function (offset, index, nextIndex) {
        if (this.sizeMode === SizeMode.Free) {
            var curPageCenter, nextPageCenter;
            if (this.direction === Direction.Horizontal) {
                curPageCenter = this._scrollCenterOffsetX[index];
                nextPageCenter = this._scrollCenterOffsetX[nextIndex];
                return Math.abs(offset.x) >= Math.abs(curPageCenter - nextPageCenter) * this.scrollThreshold;
            }
            else if (this.direction === Direction.Vertical) {
                curPageCenter = this._scrollCenterOffsetY[index];
                nextPageCenter = this._scrollCenterOffsetY[nextIndex];
                return Math.abs(offset.y) >= Math.abs(curPageCenter - nextPageCenter) * this.scrollThreshold;
            }
        }
        else {
            if (this.direction === Direction.Horizontal) {
                return Math.abs(offset.x) >= this._view.width * this.scrollThreshold;
            }
            else if (this.direction === Direction.Vertical) {
                return Math.abs(offset.y) >= this._view.height * this.scrollThreshold;
            }
        }
    },

    // 快速滑动
    _isQuicklyScrollable: function (touchMoveVelocity) {
        if (this.direction === Direction.Horizontal) {
            if (Math.abs(touchMoveVelocity.x) > this.autoPageTurningThreshold) {
                return true;
            }
        }
        else if (this.direction === Direction.Vertical) {
            if (Math.abs(touchMoveVelocity.y) > this.autoPageTurningThreshold) {
                return true;
            }
        }
        return false;
    },

    // 通过 idx 获取偏移值数值
    _moveOffsetValue: function (idx) {
        var offset = cc.v2(0, 0);
        if (this.sizeMode === SizeMode.Free) {
            if (this.direction === Direction.Horizontal) {
                offset.x = this._scrollCenterOffsetX[idx];
            }
            else if (this.direction === Direction.Vertical) {
                offset.y = this._scrollCenterOffsetY[idx];
            }
        }
        else {
            if (this.direction === Direction.Horizontal) {
                offset.x = idx * this._view.width;
            }
            else if (this.direction === Direction.Vertical) {
                offset.y = idx * this._view.height;
            }
        }
        return offset;
    },

    _getDragDirection: function (moveOffset) {
        if (this.direction === Direction.Horizontal) {
            if (moveOffset.x === 0) { return 0; }
            return (moveOffset.x > 0 ? 1 : -1);
        }
        else if (this.direction === Direction.Vertical) {
            // 由于滚动 Y 轴的原点在在右上角所以应该是小于 0
            if (moveOffset.y === 0) { return 0; }
            return (moveOffset.y < 0 ? 1 : -1);
        }
    },

    _handleReleaseLogic: function(touch) {
        this._autoScrollToPage();
        if (this._scrolling) {
            this._scrolling = false;
            if (!this._autoScrolling) {
                this._dispatchEvent('scroll-ended');
            }
        }
    },

    _autoScrollToPage: function () {
        var bounceBackStarted = this._startBounceBackIfNeeded();
        var moveOffset = this._touchBeganPosition.sub(this._touchEndPosition);
        if (bounceBackStarted) {
            var dragDirection = this._getDragDirection(moveOffset);
            if (dragDirection === 0) {
                return;
            }
            if (dragDirection > 0) {
                this._curPageIdx = this._pages.length - 1;
            }
            else {
                this._curPageIdx = 0;
            }
            if (this.indicator) {
                this.indicator._changedState();
            }
        }
        else {
            var index = this._curPageIdx, nextIndex = index + this._getDragDirection(moveOffset);
            var timeInSecond = this.pageTurningSpeed * Math.abs(index - nextIndex);
            if (nextIndex < this._pages.length) {
                if (this._isScrollable(moveOffset, index, nextIndex)) {
                    this.scrollToPage(nextIndex, timeInSecond);
                    return;
                }
                else {
                    var touchMoveVelocity = this._calculateTouchMoveVelocity();
                    if (this._isQuicklyScrollable(touchMoveVelocity)) {
                        this.scrollToPage(nextIndex, timeInSecond);
                        return;
                    }
                }
            }
            this.scrollToPage(index, timeInSecond);
        }
    },

    _onTouchBegan: function (event, captureListeners) {
        this._touchBeganPosition = event.touch.getLocation();
        this._super(event, captureListeners);
    },

    _onTouchMoved: function (event, captureListeners) {
        this._super(event, captureListeners);
    },

    _onTouchEnded: function (event, captureListeners) {
        this._touchEndPosition = event.touch.getLocation();
        this._super(event, captureListeners);
    },

    _onTouchCancelled: function (event, captureListeners) {
        this._touchEndPosition = event.touch.getLocation();
        this._super(event, captureListeners);
    },

    _onMouseWheel: function () { }
});

cc.PageView = module.exports = PageView;

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event page-turning
 * @param {Event.EventCustom} event
 * @param {PageView} pageView - The PageView component.
 */
