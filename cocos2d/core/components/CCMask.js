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
        menu: 'UI/Mask',
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
        this._clippingStencil = new cc.LayerColor(cc.Color.WHITE, 200,200);
        this._clippingStencil.ignoreAnchorPointForPosition(false);
        this._clippingNode = new cc.ClippingNode(this._clippingStencil);
    },
    
    onEnable: function () {
        var oldNode = this.node._sgNode;
        this._clippingStencil.setContentSize(this.node._contentSize);
        this._clippingStencil.setAnchorPoint(this.node._anchorPoint);
        this.node._replaceSgNode(this._clippingNode);
        this.node.on('size-changed',this._onContentSizeChanged, this);
        this.node.on('anchor-changed',this._onAnchorChanged,this);
    },

    onDisable: function () {
        var oldNode = this.node._sgNode;
        var newNode = new _ccsg.Node();
        this.node._replaceSgNode(newNode);
        this.node.off('size-changed', this._onContentSizeChanged, this);
        this.node.off('anchor-changed',this._onAnchorChanged,this);
    },
    
    onDestroy: function () {

    },
    
    _onContentSizeChanged: function() {
        if(this._clippingStencil) {
            this._clippingStencil.setContentSize(this.node._contentSize);
            this._dirtySgNodeTransform();
        }
    },

    _onAnchorChanged: function() {
        if(this._clippingStencil) {
            this._clippingStencil.setAnchorPoint(this.node._anchorPoint);
            this._dirtySgNodeTransform();
        }
    },

    //when the content size of stencil is changed, the rendering will be wrong, because of the transform is called
    //by no parent render command, in fact the parent rendercommand should be the render command of clippingNode
    _dirtySgNodeTransform: function() {
        if(!cc.sys.isNative) {
            this.node._sgNode._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.transformDirty);
        }
    },

 });

 cc.Mask = module.exports = Mask;
