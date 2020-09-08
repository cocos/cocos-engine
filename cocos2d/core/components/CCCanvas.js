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

var Camera = require('../camera/CCCamera');
var Component = require('./CCComponent');

// Screen adaptation strategy for Canvas + Widget
function resetWidgetComponent (canvas) {
    let widget = canvas.node.getComponent(cc.Widget);
    if (!widget) {
        widget = canvas.node.addComponent(cc.Widget);
    }
    widget.isAlignTop = true;
    widget.isAlignBottom = true;
    widget.isAlignLeft = true;
    widget.isAlignRight = true;
    widget.top = 0;
    widget.bottom = 0;
    widget.left = 0;
    widget.right = 0;
}

/**
 * !#zh 作为 UI 根节点，为所有子节点提供视窗四边的位置信息以供对齐，另外提供屏幕适配策略接口，方便从编辑器设置。<br>
 * 注：由于本节点的尺寸会跟随屏幕拉伸，所以 anchorPoint 只支持 (0.5, 0.5)，否则适配不同屏幕时坐标会有偏差。
 *
 * @class Canvas
 * @extends Component
 */
var Canvas = cc.Class({
    name: 'cc.Canvas',
    extends: Component,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/Canvas',
        help: 'i18n:COMPONENT.help_url.canvas',
        executeInEditMode: true,
        disallowMultiple: true,
    },

    resetInEditor: CC_EDITOR && function () {
        _Scene._applyCanvasPreferences(this);
        resetWidgetComponent(this);
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

    // fit canvas node to design resolution
    _fitDesignResolution: CC_EDITOR && function () {
        // TODO: support paddings of locked widget
        var designSize = cc.engine.getDesignResolutionSize();
        this.node.setPosition(designSize.width * 0.5, designSize.height * 0.5);
        this.node.setContentSize(designSize);
    },

    __preload: function () {
        if (CC_DEV) {
            var Flags = cc.Object.Flags;
            this._objFlags |= (Flags.IsPositionLocked | Flags.IsAnchorLocked | Flags.IsSizeLocked);
        }

        if (Canvas.instance) {
            return cc.warnID(6700,
                this.node.name, Canvas.instance.node.name);
        }
        Canvas.instance = this;

        // Align node to fit the screen
        this.applySettings();

        // Stretch to matched size during the scene initialization
        let widget = this.getComponent(cc.Widget);
        if (widget) {
            widget.updateAlignment();
        }
        else if (CC_EDITOR) {
            this._fitDesignResolution();
        }

        // Constantly align canvas node in edit mode
        if (CC_EDITOR) {
            cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this._fitDesignResolution, this);
            cc.engine.on('design-resolution-changed', this._fitDesignResolution, this);
        }
    },

    start () {
        if (!Camera.main && cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS) {
            // Create default Main Camera
            let cameraNode = new cc.Node('Main Camera');
            cameraNode.parent = this.node;
            cameraNode.setSiblingIndex(0);

            let camera = cameraNode.addComponent(Camera);
            let ClearFlags = Camera.ClearFlags;
            camera.clearFlags = ClearFlags.COLOR | ClearFlags.DEPTH | ClearFlags.STENCIL;
            camera.depth = -1;
        }
    },

    onDestroy: function () {
        if (CC_EDITOR) {
            cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this._fitDesignResolution, this);
            cc.engine.off('design-resolution-changed', this._fitDesignResolution, this);
        }

        if (Canvas.instance === this) {
            Canvas.instance = null;
        }
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
