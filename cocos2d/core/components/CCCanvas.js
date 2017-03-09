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

var designResolutionWrapper = {
    getContentSize: function () {
        // The canvas size will always the same with the screen,
        // so its anchor should be (0.5, 0.5), otherwise its children will appear biased.
        return CC_EDITOR ? cc.engine.getDesignResolutionSize() : cc.visibleRect;
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
 * !#zh: 作为 UI 根节点，为所有子节点提供视窗四边的位置信息以供对齐，另外提供屏幕适配策略接口，方便从编辑器设置。
 * 注：由于本节点的尺寸会跟随屏幕拉伸，所以 anchorPoint 只支持 (0.5, 0.5)，否则适配不同屏幕时坐标会有偏差。
 *
 * @class Canvas
 * @extends Component
 */
var Canvas = cc.Class({
    name: 'cc.Canvas', extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/Canvas',
        help: 'i18n:COMPONENT.help_url.canvas',
        executeInEditMode: true,
        disallowMultiple: true,
    },

    resetInEditor: CC_EDITOR && function () {
        _Scene._applyCanvasPreferences(this);
    },

    statics: {
        /**
         * !#en Current active canvas, the scene should only have one active canvas at the same time.
         * !#zh 当前激活的画布组件，场景同一时间只能有一个激活的画布。
         * @property {Canvas} instance
         * @static
         */
        instance: null
    },

    properties: {

        /**
         * !#en The desigin resolution for current scene.
         * !#zh 当前场景设计分辨率。
         * @property {Size} designResolution
         * @default new cc.Size(960, 640)
         */
        _designResolution: cc.size(960, 640),
        designResolution: {
            get: function () {
                return cc.size(this._designResolution);
            },
            set: function (value) {
                this._designResolution.width = value.width;
                this._designResolution.height = value.height;
                this.applySettings();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.canvas.design_resolution'
        },

        _fitWidth: false,
        _fitHeight: true,

        /**
         * !#en TODO
         * !#zh: 是否优先将设计分辨率高度撑满视图高度。
         * @property {Boolean} fitHeight
         * @default false
         */
        fitHeight: {
            get: function () {
                return this._fitHeight;
            },
            set: function (value) {
                if (this._fitHeight !== value) {
                    this._fitHeight = value;
                    this.applySettings();
                }
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.canvas.fit_height'
        },

        /**
         * !#en TODO
         * !#zh: 是否优先将设计分辨率宽度撑满视图宽度。
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
                    this.applySettings();
                }
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.canvas.fit_width'
        }
    },

    ctor: function () {
        if (CC_JSB) {
            this._thisOnResized = cc.EventListener.create({
                event: cc.EventListener.CUSTOM,
                eventName: "window-resize",
                callback: this.onResized.bind(this)
            });

            this._thisOnResized.retain();
        }
        else {
            this._thisOnResized = this.onResized.bind(this);
        }
    },

    __preload: function () {
        if (CC_DEV) {
            var Flags = cc.Object.Flags;
            this._objFlags |= (Flags.IsPositionLocked | Flags.IsAnchorLocked | Flags.IsSizeLocked);
        }

        if (Canvas.instance) {
            return cc.errorID(6700,
                this.node.name, Canvas.instance.node.name);
        }
        Canvas.instance = this;

        if ( !this.node._sizeProvider ) {
            this.node._sizeProvider = designResolutionWrapper;
        }
        else if (CC_DEV) {
            var renderer = this.node.getComponent(cc._RendererUnderSG);
            if (renderer) {
                cc.errorID(6701, cc.js.getClassName(renderer));
            }
            else {
                cc.errorID(6702);
            }
        }

        cc.director.on(cc.Director.EVENT_BEFORE_VISIT, this.alignWithScreen, this);

        if (CC_EDITOR) {
            cc.engine.on('design-resolution-changed', this._thisOnResized);
        }
        else if (!CC_JSB) {
            if (cc.sys.isMobile) {
                window.addEventListener('resize', this._thisOnResized);
            }
            else {
                cc.eventManager.addCustomListener('canvas-resize', this._thisOnResized);
            }
        }
        else {
            cc.eventManager.addListener(this._thisOnResized, 1);
        }

        this.applySettings();
        this.onResized();
    },

    onDestroy: function () {
        if (this.node._sizeProvider === designResolutionWrapper) {
            this.node._sizeProvider = null;
        }

        cc.director.off(cc.Director.EVENT_BEFORE_VISIT, this.alignWithScreen, this);

        if (CC_EDITOR) {
            cc.engine.off('design-resolution-changed', this._thisOnResized);
        }
        else if (!CC_JSB) {
            if (cc.sys.isMobile) {
                window.removeEventListener('resize', this._thisOnResized);
            }
            else {
                cc.eventManager.removeCustomListeners('canvas-resize', this._thisOnResized);
            }
        }
        else {
            cc.eventManager.removeListener(this._thisOnResized);
            this._thisOnResized.release();
        }

        if (Canvas.instance === this) {
            Canvas.instance = null;
        }
    },

    //

    alignWithScreen: function () {
        var designSize;
        if (CC_EDITOR) {
            designSize = cc.engine.getDesignResolutionSize();
            this.node.setPosition(designSize.width * 0.5, designSize.height * 0.5);
        }
        else {
            var canvasSize = cc.visibleRect;
            var clipTopRight = !this.fitHeight && !this.fitWidth;
            var offsetX = 0;
            var offsetY = 0;
            if (clipTopRight) {
                designSize = cc.view.getDesignResolutionSize();
                // offset the canvas to make it in the center of screen
                offsetX = (designSize.width - canvasSize.width) * 0.5;
                offsetY = (designSize.height - canvasSize.height) * 0.5;
            }
            this.node.setPosition(canvasSize.width * 0.5 + offsetX, canvasSize.height * 0.5 + offsetY);
        }
    },

    onResized: function () {
        // TODO - size dirty
        this.alignWithScreen();
    },

    applySettings: function () {
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

        var designRes = this._designResolution;
        if (CC_EDITOR) {
            cc.engine.setDesignResolutionSize(designRes.width, designRes.height);
        }
        else {
            cc.view.setDesignResolutionSize(designRes.width, designRes.height, policy);
        }
    }
});


cc.Canvas = module.exports = Canvas;
