/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

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


/**
 * Enum for Layout type
 * @enum Layout.LayoutType
 */
var LayoutType = cc.Enum({
    /**
     *@property {Number} BASIC
     */
    BASIC: 0,
    /**
     * @property {Number} HORIZONTAL
     */
    HORIZONTAL: 1,

    /**
     * @property {Number} VERTICAL
     */
    VERTICAL: 2,
});

var VerticalDirection = cc.Enum({
    BOTTOM_TO_TOP: 0,
    TOP_TO_BOTTOM: 1,
});

var HorizontalDirection = cc.Enum({
    LEFT_TO_RIGHT: 0,
    RIGHT_TO_LEFT: 1,
});

/**
 * The Layout is a container component, it could arrange all its children conveniently.
 *
 * @class Layout
 * @extends Component
 */
var Layout = cc.Class({
    name: 'cc.Layout',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/Layout',
        inspector: 'app://editor/page/inspector/cclayout.html',
        executeInEditMode: true,
    },

    properties: {
        _layoutSize: cc.size(300, 200),

        layoutType: {
            default: LayoutType.BASIC,
            type: LayoutType
        },

        margin: {
            default: 0,
        },

        spacing: {
            default: 0,
        },

        verticalDirection: {
            default: VerticalDirection.TOP_TO_BOTTOM,
            type: VerticalDirection
        },

        horizontalDirection: {
            default: HorizontalDirection.LEFT_TO_RIGHT,
            type: HorizontalDirection
        },
    },

    onLoad: function () {
        this.node.setContentSize(this._layoutSize);
        this.node.on('size-changed', this._resized, this);
    },

    onDestroy: function () {
        this.node.off('size-changed', this._resized, this);
    },
    _resized: function(){
        this._layoutSize = this.node.getContentSize();
    }

});


cc.Layout = module.exports = Layout;
