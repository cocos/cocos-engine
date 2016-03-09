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

/**
 * @class Mask
 * @extends _RendererInSG
 */
var Mask = cc.Class({
    name: 'cc.Mask',
    extends: cc._RendererInSG,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Mask',
        help: 'app://docs/html/components/mask.html',
    },

    properties: {
        _clippingStencil: {
            default: null,
            serializable: false,
        },
    },

    _createSgNode: function () {
        this._clippingStencil = new cc.DrawNode();
        this._clippingStencil.retain();
        return new cc.ClippingNode(this._clippingStencil);
    },

    _initSgNode: function () {
        var clippingNode = this._sgNode;
        clippingNode.setContentSize(this.node.getContentSize(true));
    },
    
    //onLoad: function () {
    //    this._super();
    //    // ignore node size
    //    if (this.node._sizeProvider === this._sgNode) {
    //        this.node._sizeProvider = null;
    //    }
    //},
    
    onEnable: function () {
        this._refreshStencil();
        this._super();
        this.node.on('size-changed', this._refreshStencil, this);
        this.node.on('anchor-changed', this._refreshStencil, this);
    },

    onDisable: function () {
        this._super();
        this.node.off('size-changed', this._refreshStencil, this);
        this.node.off('anchor-changed', this._refreshStencil, this);
    },
    
    onDestroy: function () {
        this._super();
        this._clippingStencil.release();
    },

    _refreshStencil: function () {
        var contentSize = this.node.getContentSize();
        var anchorPoint = this.node.getAnchorPoint();
        var width = contentSize.width;
        var height = contentSize.height;
        var x = - width * anchorPoint.x;
        var y = - height * anchorPoint.y;
        var rectangle = [ cc.v2(x, y),
                          cc.v2(x + width, y),
                          cc.v2(x + width, y + height),
                          cc.v2(x, y + height) ];
        var color = cc.color(255, 255, 255, 0);
        this._clippingStencil.clear();
        this._clippingStencil.drawPoly(rectangle, color, 0, color);
    }
});

cc.Mask = module.exports = Mask;
