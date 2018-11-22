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
 * !#en Enum for PageView Indicator direction
 * !#zh 页面视图指示器的摆放方向
 * @enum PageViewIndicator.Direction
 */
var Direction = cc.Enum({
    /**
     * !#en The horizontal direction.
     * !#zh 水平方向
     * @property {Number} HORIZONTAL
     */
    HORIZONTAL: 0,

    /**
     * !#en The vertical direction.
     * !#zh 垂直方向
     * @property {Number} VERTICAL
     */
    VERTICAL: 1
});


/**
 * !#en The Page View Indicator Component
 * !#zh 页面视图每页标记组件
 * @class PageViewIndicator
 * @extends Component
 */
var PageViewIndicator = cc.Class({
    name: 'cc.PageViewIndicator',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/PageViewIndicator',
        help: 'i18n:COMPONENT.help_url.pageviewIndicator'
    },

    properties: {
        _layout: null,
        _pageView: null,
        _indicators: [],

        /**
         * !#en The spriteFrame for each element.
         * !#zh 每个页面标记显示的图片
         * @property {SpriteFrame} spriteFrame
         */
        spriteFrame: {
            default: null,
            type: cc.SpriteFrame,
            tooltip: CC_DEV && 'i18n:COMPONENT.pageview_indicator.spriteFrame'
        },

        /**
         * !#en The location direction of PageViewIndicator.
         * !#zh 页面标记摆放方向
         *@property {PageViewIndicator.Direction} direction
         */
        direction: {
            default: Direction.HORIZONTAL,
            type: Direction,
            tooltip: CC_DEV && 'i18n:COMPONENT.pageview_indicator.direction'
        },

        /**
         * !#en The cellSize for each element.
         * !#zh 每个页面标记的大小
         * @property {Size} cellSize
         */
        cellSize: {
            default: cc.size(20, 20),
            tooltip: CC_DEV && 'i18n:COMPONENT.pageview_indicator.cell_size'
        },

        /**
         * !#en The distance between each element.
         * !#zh 每个页面标记之间的边距
         * @property {Number} spacing
         */
        spacing: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.pageview_indicator.spacing'
        }
    },

    statics: {
        Direction: Direction
    },

    onLoad: function () {
        this._updateLayout();
    },

    /**
     * !#en Set Page View
     * !#zh 设置页面视图
     * @method setPageView
     * @param {PageView} target
     */
    setPageView: function (target) {
        this._pageView = target;
        this._refresh();
    },

    _updateLayout: function () {
        this._layout = this.getComponent(cc.Layout);
        if (!this._layout) {
            this._layout = this.addComponent(cc.Layout);
        }
        if (this.direction === Direction.HORIZONTAL) {
            this._layout.type = cc.Layout.Type.HORIZONTAL;
            this._layout.spacingX = this.spacing;
        }
        else if (this.direction === Direction.VERTICAL) {
            this._layout.type = cc.Layout.Type.VERTICAL;
            this._layout.spacingY = this.spacing;
        }
        this._layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
    },

    _createIndicator: function () {
        var node = new cc.Node();
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.spriteFrame;
        node.parent = this.node;
        node.width = this.cellSize.width;
        node.height = this.cellSize.height;
        return node;
    },

    _changedState: function () {
        var indicators = this._indicators;
        if (indicators.length === 0) return;
        var idx = this._pageView._curPageIdx;
        if (idx >= indicators.length) return;
        for (var i = 0; i < indicators.length; ++i) {
            var node = indicators[i];
            node.opacity = 255 / 2;
        }
        indicators[idx].opacity = 255;
    },

    _refresh: function () {
        if (!this._pageView) { return; }
        var indicators = this._indicators;
        var pages = this._pageView.getPages();
        if (pages.length === indicators.length) {
            return;
        }
        var i = 0;
        if (pages.length > indicators.length) {
            for (i = 0; i < pages.length; ++i) {
                if (!indicators[i]) {
                    indicators[i] = this._createIndicator();
                }
            }
        }
        else {
            var count = indicators.length - pages.length;
            for (i = count; i > 0; --i) {
                var node = indicators[i - 1];
                this.node.removeChild(node);
                indicators.splice(i - 1, 1);
            }
        }
        if(this._layout && this._layout.enabledInHierarchy) {
            this._layout.updateLayout();
        }
        this._changedState();
    }
});


cc.PageViewIndicator = module.exports = PageViewIndicator;
