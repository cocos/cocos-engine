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

// 快速滑动的临界值
var _CUSTOMSCROLLTHRESHOLD = 200;

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
    },

    properties: {
        /**
         * !#en The page view direction
         * !#zh 页面视图滚动类型
         * @property {PageView.Direction} direction
         */
        direction: {
            default: Direction.Horizontal,
            type: Direction,
            tooltip: 'i18n:COMPONENT.pageview.direction',
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
            tooltip: 'i18n:COMPONENT.pageview.scrollThreshold'
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
            tooltip: 'i18n:COMPONENT.pageview.pageTurningEventTiming'
        },

        /**
         * !#en The Page View Indicator
         * !#zh 页面视图指示器组件
         * @property {PageViewIndicator} indicator
         */
        indicator: {
            default: null,
            type: cc.PageViewIndicator,
            tooltip: 'i18n:COMPONENT.pageview.indicator',
            notify:  function() {
                if (this.indicator) {
                    this.indicator.setPageView(this);
                }
            }
        },

        /**
         * !#en PageView events callback
         * !#zh 滚动视图的事件回调函数
         * @property {Component.EventHandler[]} pageEvents
         */
        pageEvents: {
            default: [],
            type: cc.Component.EventHandler,
            tooltip: 'i18n:COMPONENT.pageview.pageEvents'
        }
    },

    statics: {
        Direction: Direction,
        EventType: EventType
    },

    __preload: function () {
        this._super();
        this.node.on('size-changed', this._updateAllPagesSize, this);
        this._syncScrollDirection();
    },

    _syncScrollDirection: function () {
        this.horizontal = this.direction === Direction.Horizontal;
        this.vertical = this.direction === Direction.Vertical;
    },

    onEnable: function () {
        this._super();
        if(!CC_EDITOR) {
            this.node.on('scroll-ended', this._dispatchPageTurningEvent, this);
        }
    },

    onDisable: function () {
        this._super();
        if(!CC_EDITOR) {
            this.node.off('scroll-ended', this._dispatchPageTurningEvent, this);
        }
    },

    onLoad: function () {
        this._initPages();
        if (this.indicator) {
            this.indicator.setPageView(this);
        }
    },

    onDestroy: function() {
        this._super();
        this.node.off('size-changed', this._updateAllPagesSize, this);
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
            cc.warn('can not found the %s page.', page.name);
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
        if (idx < 0 || idx > this._pages.length)
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

    // 刷新页面视图
    _updatePageView: function () {
        var pageCount = this._pages.length;

        // 当页面数组变化时修改 content 大小
        var layout = this.content.getComponent(cc.Layout);
        if(layout && layout.enabledInHierarchy) {
            layout._updateLayout();
        }
        if (this._curPageIdx >= pageCount) {
            this._curPageIdx = pageCount === 0 ? 0 : pageCount - 1;
            this._lastPageIdx = this._curPageIdx;
        }
        // 进行排序
        for (var i = 0; i < pageCount; ++i) {
            this._pages[i].setSiblingIndex(i);
        }
        // 刷新 indicator 信息与状态
        if (this.indicator) {
            this.indicator._refresh();
        }
    },

    // 刷新所有页面的大小
    _updateAllPagesSize: function () {
        var locPages = CC_EDITOR ? this.content.children : this._pages;
        var selfSize = this.node.getContentSize();
        for (var i = 0, len = locPages.length; i < len; i++) {
            locPages[i].setContentSize(selfSize);
        }
    },

    // 初始化页面
    _initPages: function () {
        if (!this.content) { return; }
        var children = this.content.children;
        for (var i = 0; i < children.length; ++i) {
            var page = children[i];
            if (this._pages.indexOf(page) >= 0) { continue; }
            this._pages.push(page);
        }
    },

    _dispatchPageTurningEvent: function () {
        if (this._lastPageIdx === this._curPageIdx) return;
        this._lastPageIdx = this._curPageIdx;
        cc.Component.EventHandler.emitEvents(this.pageEvents, this, EventType.PAGE_TURNING);
        this.node.emit('page-turning', this);
    },

    // 是否超过自动滚动临界值
    _isScrollable: function (offset) {
        if (this.direction === Direction.Horizontal) {
            return Math.abs(offset.x) >= this.node.width * this.scrollThreshold;
        }
        else if (this.direction === Direction.Vertical) {
            return Math.abs(offset.y) >= this.node.height * this.scrollThreshold;
        }
    },

    // 通过 idx 获取偏移值数值
    _moveOffsetValue: function (idx) {
        var offset = cc.p(0, 0);
        if (this.direction === Direction.Horizontal) {
            offset.x = idx * this.node.width;
        }
        else if (this.direction === Direction.Vertical) {
            offset.y = idx * this.node.height;
        }
        return offset;
    },

    _updatePageIndex: function (moveOffset) {
        var idx = 0;
        if (this.direction === Direction.Horizontal) {
            idx += (moveOffset.x > 0 ? 1 : -1);
        }
        else if (this.direction === Direction.Vertical) {
            // 由于滚动 Y 轴的原点在在右上角所以应该是小于 0
            idx += (moveOffset.y < 0 ? 1 : -1);
        }
        return this._curPageIdx + idx;
    },

    _handleReleaseLogic: function(touch) {
        var bounceBackStarted = this._startBounceBackIfNeeded();
        if (!bounceBackStarted) {
            var idx = this._curPageIdx;
            if (idx === 0 && this._pages.length === 1) {
                return;
            }
            var moveOffset = cc.pSub(this._touchBeganPosition, this._touchEndPosition);
            if (this._isScrollable(moveOffset)) {
                idx = this._updatePageIndex(moveOffset);
            }
            else {
                var touchMoveVelocity = this._calculateTouchMoveVelocity();
                if (Math.abs(touchMoveVelocity.x) > _CUSTOMSCROLLTHRESHOLD) {
                    idx = this._updatePageIndex(moveOffset);
                }
            }
            this.scrollToPage(idx);
        }
    },

    _onTouchBegan: function (event) {
        this._touchBeganPosition = event.touch.getLocation();
        this._super(event);
    },

    _onTouchMoved: function (event) {
        this._super(event);
    },

    _onTouchEnded: function (event) {
        this._touchEndPosition = event.touch.getLocation();
        this._super(event);
    },

    _onTouchCancelled: function (event) {
        this._touchEndPosition = event.touch.getLocation();
        this._super(event);
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
 * @param {Event} event
 * @param {PageView} event.detail - The PageView component.
 */
