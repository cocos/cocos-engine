/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

const Component = require('./CCComponent');

let WXSubContextView;

if (!CC_EDITOR && !CC_WECHATGAME) {
    WXSubContextView = cc.Class({
        name: 'cc.WXSubContextView',
        extends: Component,
    })
}
else {
    /**
     * !#en WXSubContextView is a view component which controls open data context viewport in Wechat game platform.<br/>
     * The component's node size decide the viewport of the sub context content in main context, 
     * the entire sub context texture will be scaled to the node's bounding box area.<br/>
     * This component provides multiple important features:<br/>
     * 1. Sub context could use its own resolution size and policy.<br/>
     * 2. Sub context could be minized to smallest size it needed.<br/>
     * 3. Resolution of sub context content could be increased.<br/>
     * 4. User touch input is transformed to the correct viewport.<br/>
     * 5. Texture update is handled by this component. User don't need to worry.<br/>
     * One important thing to be noted, whenever the node's bounding box change, 
     * you need to manually reset the viewport of sub context using updateSubContextViewport.
     * !#zh WXSubContextView 可以用来控制微信小游戏平台开放数据域在主域中的视窗的位置。<br/>
     * 这个组件的节点尺寸决定了开放数据域内容在主域中的尺寸，整个开放数据域会被缩放到节点的包围盒范围内。<br/>
     * 在这个组件的控制下，用户可以更自由得控制开放数据域：<br/>
     * 1. 子域中可以使用独立的设计分辨率和适配模式<br/>
     * 2. 子域区域尺寸可以缩小到只容纳内容即可<br/>
     * 3. 子域的分辨率也可以被放大，以便获得更清晰的显示效果<br/>
     * 4. 用户输入坐标会被自动转换到正确的子域视窗中<br/>
     * 5. 子域内容贴图的更新由组件负责，用户不需要处理<br/>
     * 唯一需要注意的是，当子域节点的包围盒发生改变时，开发者需要使用 `updateSubContextViewport` 来手动更新子域视窗。
     * @class WXSubContextView
     * @extends Component
     */
    WXSubContextView = cc.Class({
        name: 'cc.WXSubContextView',
        extends: Component,

        editor: CC_EDITOR && {
            menu: 'i18n:MAIN_MENU.component.others/WXSubContextView',
            help: 'i18n:COMPONENT.help_url.wx_subcontext_view'
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
                this._tex.setPremultiplyAlpha(true);
                this._tex.initWithElement(sharedCanvas);

                this._sprite = this.node.getComponent(cc.Sprite);
                if (!this._sprite) {
                    this._sprite = this.node.addComponent(cc.Sprite);
                    this._sprite.srcBlendFactor = cc.macro.BlendFactor.ONE;
                }
                this._sprite.spriteFrame = new cc.SpriteFrame(this._tex);
            }
            else {
                this.enabled = false;
            }
        },

        onEnable () {
            this.updateSubContextViewport();
        },

        update () {
            if (!this._tex || !this._context) {
                return;
            }
            this._tex.initWithElement(this._context.canvas);
            this._sprite._activateMaterial();
        },

        /**
         * !#en Update the sub context viewport manually, it should be called whenever the node's bounding box changes.
         * !#zh 更新开放数据域相对于主域的 viewport，这个函数应该在节点包围盒改变时手动调用。
         * @method updateSubContextViewport
         */
        updateSubContextViewport () {
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
        }
    });

}

cc.WXSubContextView = module.exports = WXSubContextView;