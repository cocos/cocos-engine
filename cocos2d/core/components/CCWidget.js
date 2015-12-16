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

// Mask for AlignFlags
var TOP     = 1 << 0;
var MID     = 1 << 1;   // vertical center
var BOT     = 1 << 2;
var LEFT    = 1 << 3;
var CENTER  = 1 << 4;   // horizontal center
var RIGHT   = 1 << 5;
var TOP_BOT = TOP | BOT;
var LEFT_RIGHT = LEFT | RIGHT;

/**
 * Stores and manipulate the anchoring based on its parent.
 * Widget are used for GUI but can also be used for other things.
 *
 * @class Widget
 * @extends Component
 */
var Widget = cc.Class({
    name: 'cc.Widget', extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/Widget',
        executeInEditMode: true,
        disallowMultiple: true,
        inspector: 'app://editor/page/inspector/widget/index.html'
    },

    properties: {

        // ENABLE ALIGN ?

        /**
         * !#zh: 是否对齐上边
         *
         * @property isAlignTop
         * @type {Boolean}
         * @default false
         */
        isAlignTop: {
            get: function () {
                return (this._alignFlags & TOP) > 0;
            },
            set: function (value) {
                this._setAlign(TOP, value);
            }
        },

        /**
         * !#zh: 是否垂直方向对齐中点，开启此项会将垂直方向其他对齐选项取消
         *
         * @property isAlignVerticalCenter
         * @type {Boolean}
         * @default false
         */
        isAlignVerticalCenter: {
            get: function () {
                return (this._alignFlags & MID) > 0;
            },
            set: function (value) {
                if (value) {
                    this.isAlignTop = false;
                    this.isAlignBottom = false;
                    this._alignFlags |= MID;
                }
                else {
                    this._alignFlags &= ~MID;
                }
            }
        },

        /**
         * !#zh: 是否对齐下边
         *
         * @property isAlignBottom
         * @type {Boolean}
         * @default false
         */
        isAlignBottom: {
            get: function () {
                return (this._alignFlags & BOT) > 0;
            },
            set: function (value) {
                this._setAlign(BOT, value);
            }
        },

        /**
         * !#zh: 是否对齐左边
         *
         * @property isAlignLeft
         * @type {Boolean}
         * @default false
         */
        isAlignLeft: {
            get: function () {
                return (this._alignFlags & LEFT) > 0;
            },
            set: function (value) {
                this._setAlign(LEFT, value);
            }
        },

        /**
         * !#zh: 是否水平方向对齐中点，开启此选项会将水平方向其他对齐选项取消
         *
         * @property isAlignHorizontalCenter
         * @type {Boolean}
         * @default false
         */
        isAlignHorizontalCenter: {
            get: function () {
                return (this._alignFlags & CENTER) > 0;
            },
            set: function (value) {
                if (value) {
                    this.isAlignLeft = false;
                    this.isAlignRight = false;
                    this._alignFlags |= CENTER;
                }
                else {
                    this._alignFlags &= ~CENTER;
                }
            }
        },

        /**
         * !#zh: 是否对齐右边
         *
         * @property isAlignRight
         * @type {Boolean}
         * @default false
         */
        isAlignRight: {
            get: function () {
                return (this._alignFlags & RIGHT) > 0;
            },
            set: function (value) {
                this._setAlign(RIGHT, value);
            }
        },

        /**
         * !#zh: 是否水平拉伸，当同时启用左右对齐时，将会水平拉伸，此时宽度设置无效（只读）
         *
         * @property isStretchHeight
         * @type {Boolean}
         * @default false
         * @readOnly
         */
        isStretchWidth: {
            get: function () {
                return (this._alignFlags & LEFT_RIGHT) === LEFT_RIGHT;
            },
            visible: false
        },
        /**
         * !#zh: 是否垂直拉伸，当同时启用上下对齐时，将会垂直拉伸，此时高度设置无效（只读）
         *
         * @property isStretchHeight
         * @type {Boolean}
         * @default false
         * @readOnly
         */
        isStretchHeight: {
            get: function () {
                return (this._alignFlags & TOP_BOT) === TOP_BOT;
            },
            visible: false
        },

        // ALIGN MARGINS

        /**
         * !#zh: 本节点顶边和父节点顶边的距离，可填写负值，只有在 isAlignTop 开启时才有作用
         *
         * @property top
         * @type {Number}
         * @default 0
         */
        top: {
            get: function () {
                return this._top;
            },
            set: function (value) {
                this._top = value;
            }
        },

        /**
         * !#zh: 本节点底边和父节点底边的距离，可填写负值，只有在 isAlignBottom 开启时才有作用
         *
         * @property bottom
         * @type {Number}
         * @default 0
         */
        bottom: {
            get: function () {
                return this._bottom;
            },
            set: function (value) {
                this._bottom = value;
            }
        },

        /**
         * !#zh: 本节点左边和父节点左边的距离，可填写负值，只有在 isAlignLeft 开启时才有作用
         *
         * @property left
         * @type {Number}
         * @default 0
         */
        left: {
            get: function () {
                return this._left;
            },
            set: function (value) {
                this._left = value;
            }
        },

        /**
         * !#zh: 本节点右边和父节点右边的距离，可填写负值，只有在 isAlignRight 开启时才有作用
         *
         * @property right
         * @type {Number}
         * @default 0
         */
        right: {
            get: function () {
                return this._right;
            },
            set: function (value) {
                this._right = value;
            }
        },

        // PARCENTAGE OR ABSOLUTE

        /**
         * If true, top is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height
         *
         * @property isAbsoluteTop
         * @type {Boolean}
         * @default true
         */
        isAbsoluteTop: {
            get: function () {
                return this._isAbsTop;
            },
            set: function (value) {
                this._isAbsTop = value;
            }
        },

        /**
         * If true, bottom is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height
         *
         * @property isAbsoluteBottom
         * @type {Boolean}
         * @default true
         */
        isAbsoluteBottom: {
            get: function () {
                return this._isAbsBottom;
            },
            set: function (value) {
                this._isAbsBottom = value;
            }
        },

        /**
         * If true, left is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width
         *
         * @property isAbsoluteLeft
         * @type {Boolean}
         * @default true
         */
        isAbsoluteLeft: {
            get: function () {
                return this._isAbsLeft;
            },
            set: function (value) {
                this._isAbsLeft = value;
            }
        },

        /**
         * If true, right is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width
         *
         * @property isAbsoluteRight
         * @type {Boolean}
         * @default true
         */
        isAbsoluteRight: {
            get: function () {
                return this._isAbsRight;
            },
            set: function (value) {
                this._isAbsRight = value;
            }
        },

        //

        /**
         * !#zh: 对齐开关，由 AlignFlags 组成
         *
         * @property _alignFlags
         * @type {Number}
         * @default 0
         * @private
         */
        _alignFlags: 0,

        _left: 0,
        _right: 0,
        _top: 0,
        _bottom: 0,
        _isAbsLeft: true,
        _isAbsRight: true,
        _isAbsTop: true,
        _isAbsBottom: true,

        // original size before align
        _originalWidth: 0,
        _originalHeight: 0
    },

    onLoad: function () {
        cc._widgetManager.add(this);
    },

    onDestroy: function () {
        cc._widgetManager.remove(this);
    },

    _setAlign: function (flag, isAlign) {
        var current = (this._alignFlags & flag) > 0;
        if (isAlign == current) {
            return;
        }
        var isHorizontal = (flag & LEFT_RIGHT) > 0;
        if (isAlign) {
            this._alignFlags |= flag;

            if (isHorizontal) {
                this.isAlignHorizontalCenter = false;
                if (this.isStretchWidth) {
                    // become stretch
                    this._originalWidth = this.node.width;
                }
            }
            else {
                this.isAlignVerticalCenter = false;
                if (this.isStretchHeight) {
                    // become stretch
                    this._originalHeight = this.node.height;
                }
            }

            if (CC_EDITOR && !cc.engine._isPlaying) {
                // adjust the offsets to keep the size and position unchanged after alignment chagned
                var type;
                if (flag & TOP) {
                    type = 'top';
                }
                else if (flag & LEFT) {
                    type = 'left';
                }
                else if (flag & RIGHT) {
                    type = 'right';
                }
                else if (flag & BOT) {
                    type = 'bottom';
                }
                cc._widgetManager.updateOffsetsToStayPut(this, type);
            }
        }
        else {
            if (isHorizontal) {
                if (this.isStretchWidth) {
                    // will cancel stretch
                    this.node.width = this._originalWidth;
                }
            }
            else {
                if (this.isStretchHeight) {
                    // will cancel stretch
                    this.node.height = this._originalHeight;
                }
            }

            this._alignFlags &= ~flag;
        }
    }
});


cc.Widget = module.exports = Widget;
