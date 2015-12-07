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

var designResolutionWrapper = {
    getContentSize: function () {
        return CC_EDITOR ? cc.engine.getDesignResolutionSize() : cc.size(cc.visibleRect);
    },
    setContentSize: function (size) {
        // NYI
    },

    _getWidth: function () {
        return this.getContentSize().width;
    },

    _getHeight: function () {
        return this.getContentSize().height;
    },
};

/**
 * !#zh: 作为 UI 根节点，从项目配置或运行时 design resolution 设置中获取自身节点尺寸，
 * 为所有子节点提供视窗四边的位置信息以供对齐，另外提供屏幕适配策略接口，方便从编辑器设置。
 *
 * @class Canvas
 * @extends Component
 */
var Canvas = cc.Class({
    name: 'cc.Canvas', extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'UI/Canvas',
        executeInEditMode: true,
        disallowMultiple: true
    },

    properties: {

        _fitWidth: false,
        _fitHeight: false,

        /**
         * !#zh: 是否优先将设计分辨率高度撑满视图高度
         *
         * @property {Boolean} fitWidth
         * @default false
         */
        fitHeight: {
            get: function () {
                return this._fitHeight;
            },
            set: function (value) {
                if (this._fitHeight !== value) {
                    this._fitHeight = value;
                    this.applyPolicy();
                }
            }
        },

        /**
         * !#zh: 是否优先将设计分辨率宽度撑满视图宽度
         *
         * @property {Boolean} fitWidth
         * @default false
         */
        fitWidth: {
            get: function () {
                return this._fitWidth;
            },
            set: function (value) {
                if (this._fitWidth !== value) {
                    this._fitWidth = value;
                    this.applyPolicy();
                }
            }
        }
    },

    ctor: function () {
        this._thisOnResized = this.onResized.bind(this);
    },

    onLoad: function () {
        if ( !this.node._sizeProvider ) {
            this.node._sizeProvider = designResolutionWrapper;
        }
        else {
            cc.error('CCCanvas: Node can only have one size.');
        }

        this.node.position = cc.Vec2.ZERO;
        this.node.setAnchorPoint(0, 0);

        if (CC_EDITOR) {
            cc.engine.on('design-resolution-changed', this._thisOnResized);
        }
        else {
            if (cc.sys.isMobile) {
                window.addEventListener('resize', this._thisOnResized);
            }
            else {
                cc.eventManager.addCustomListener('canvas-resize', this._thisOnResized);
            }
        }

        this.onResized();
        this.applyPolicy();
    },

    onDestroy: function () {
        if (this.node._sizeProvider === designResolutionWrapper) {
            this.node._sizeProvider = null;
        }

        if (CC_EDITOR) {
            cc.engine.off('design-resolution-changed', this._thisOnResized);
        }
        else {
            if (cc.sys.isMobile) {
                window.removeEventListener('resize', this._thisOnResized);
            }
            else {
                cc.eventManager.removeCustomListeners('canvas-resize', this._thisOnResized);
            }
        }
    },

    //

    onResized: function () {
        // TODO - size dirty
    },

    applyPolicy: function () {
        var ResolutionPolicy = cc.ResolutionPolicy;
        var policy;

        if (this.fitHeight && this.fitWidth) {
            policy = ResolutionPolicy.SHOW_ALL;
        }
        else if (!this.fitHeight && !this.fitWidth) {
            policy = ResolutionPolicy.NO_BORDER;
        }
        else if (this.fitWidth) {
            policy = ResolutionPolicy.FIXED_WIDTH;
        }
        else {      // fitHeight
            policy = ResolutionPolicy.FIXED_HEIGHT;
        }

        var size = cc.view.getDesignResolutionSize();
        cc.view.setDesignResolutionSize(size.width, size.height, policy);
    }
});


cc.Canvas = module.exports = Canvas;
