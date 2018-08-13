/****************************************************************************
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
 ****************************************************************************/

const Component = require('./CCComponent');

/**
 * !#en
 * !#zh
 * @class WXSubContextView
 * @extends Component
 */
let WXSubContextView = cc.Class({
    name: 'cc.WXSubContextView',
    extends: Component,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.others/WXSubContextView',
        help: 'i18n:COMPONENT.help_url.wxSubContextView'
    },

    properties: {

    },

    ctor () {
        this._sprite = null;
        this._tex = new cc.Texture2D();
        this._context = null;
    },

    onLoad () {
        // Setup subcontext canvas size
        if (wx.getOpenDataContext) {
            this._context = wx.getOpenDataContext();
            let sharedCanvas = this._context.canvas;
            if (sharedCanvas) {
                sharedCanvas.width = this.node.width;
                sharedCanvas.height = this.node.height;
            }
            this._tex.initWithElement(sharedCanvas);

            this._sprite = this.node.getComponent(cc.Sprite);
            if (!this._sprite) {
                this._sprite = this.node.addComponent(cc.Sprite);
            }
            this._sprite.spriteFrame = new cc.SpriteFrame(this._tex);
        }
        else {
            this.enabled = false;
        }
    },

    onEnable () {
        this.sendSubContextViewport();
    },

    sendSubContextViewport () {
        if (this._context) {
            let box = this.node.getBoundingBoxToWorld();
            let sx = cc.view._scaleX;
            let sy = cc.view._scaleY;
            this._context.postMessage({
                fromEngine: true,
                event: 'viewport',
                x: box.x * sx + cc.view._viewportRect.x,
                y: box.y * sy + cc.view._viewportRect.y,
                width: box.width * sx,
                height: box.height * sy
            });
        }
    },

    update () {
        if (!this._tex || !this._context) {
            return;
        }
        this._tex.initWithElement(this._context.canvas);
        this._sprite._activateMaterial();
    }
});

cc.WXSubContextView = module.exports = WXSubContextView;