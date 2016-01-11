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
 *
 * @class Mask
 * @extends Component
 */
var Mask = cc.Class({
    name: 'cc.Mask',
    extends: cc.Component,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Mask',
        executeInEditMode: true
    },

    properties: {
        _clippingNode: {
            default: null,
            serializable: false,
        },
        _clippingStencil: {
            default: null,
            serializable: false,
        },
    },

    onLoad: function () {
        this._clippingStencil = new cc.DrawNode();
        this._clippingNode = new cc.ClippingNode(this._clippingStencil);
    },

    _refreshStencil: function () {
        var contentSize = this.node._contentSize;
        var anchorPoint = this.node._anchorPoint;
        var x = contentSize.width * anchorPoint.x;
        var y = contentSize.height * anchorPoint.y;
        this._clippingStencil.clear();
        var rectangle = [cc.v2(-x, -y), cc.v2(contentSize.width - x, -y),
            cc.v2(contentSize.width - x, contentSize.height - y),
            cc.v2(-x, contentSize.height - y)];
        this._clippingStencil.drawPoly(rectangle, cc.color(255, 255, 255, 0), 0, cc.color(255, 255, 255, 0));
    },

    onEnable: function () {
        var oldNode = this.node._sgNode;
        this._refreshStencil();
        this.node._replaceSgNode(this._clippingNode);
        this.node.on('size-changed', this._onContentSizeChanged, this);
        this.node.on('anchor-changed', this._onAnchorChanged, this);
    },

    onDisable: function () {
        var oldNode = this.node._sgNode;
        var newNode = new _ccsg.Node();
        this.node._replaceSgNode(newNode);
        this.node.off('size-changed', this._onContentSizeChanged, this);
        this.node.off('anchor-changed', this._onAnchorChanged, this);
    },

    _onContentSizeChanged: function () {
        if (this._clippingStencil) {
            this._refreshStencil();
        }
    },

    _onAnchorChanged: function () {
        if (this._clippingStencil) {
            this._refreshStencil();
        }
    }

});

cc.Mask = module.exports = Mask;
