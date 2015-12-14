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

    _clippingNode: null,
    _clippingStencil: null,
    // properties: {

    // },

    onLoad: function () {
        this._clippingStencil = new cc.LayerColor(cc.Color.WHITE, 200,200);
        this._clippingStencil.ignoreAnchorPointForPosition(false);
        this._clippingNode = new cc.ClippingNode(this._clippingStencil);
        this.node.on('size-changed',this._onContentResize, this);
    },
    
    onEnable: function () {
        var oldNode = this.node._sgNode;
        this._clippingStencil.setContentSize(this.node._contentSize);
        this._clippingStencil.setAnchorPoint(this.node._anchorPoint);
        this._rebuildSceneGraph(this._clippingNode,oldNode);
        this.node._sgNode = this._clippingNode;
    },

    onDisable: function () {
        var oldNode = this.node._sgNode;
        var newNode = new _ccsg.Node();
        //this.node._sgNode.setContentSize(this.node._contentSize);
        this._rebuildSceneGraph(newNode, oldNode);
        this.node._sgNode = newNode;
    },
    
    onDestroy: function () {
        // this.node._sgNode.removeChild(this._clippingStencil);
        this.node.off('size-changed', this._onContentResize, this);
    },
    
    _onContentResize: function() {
        if(this._clippingNode) {
            this._clippingNode.setContentSize(this.node._contentSize);
        }
        if(this._clippingStencil) {
            this._clippingStencil.setContentSize(this.node._contentSize);
            this._clippingStencil.setAnchorPoint(this.node._anchorPoint);
        }
    },

    _rebuildSceneGraph: function (newNode, oldNode) {

        newNode.setPosition(this.node._position);
        newNode.setRotationX(this.node._rotationX);
        newNode.setRotationY(this.node._rotationY);
        newNode.setScaleX(this.node._scaleX);
        newNode.setScaleY(this.node._scaleY);
        newNode.setAnchorPoint(this.node._anchorPoint);
        newNode.setContentSize(this.node._contentSize);
        newNode.setOpacity(this.node._opacity);
        newNode.setColor(this.node._color);

        var children = [];
        children = children.concat(oldNode.getChildren());
    
        for(var index = 0; index < children.length; ++index) {
            oldNode.removeChild(children[index])
            newNode.addChild(children[index]);
        }
        
        var parentNode = oldNode.getParent();
        parentNode.addChild(newNode);
        parentNode.removeChild(oldNode);

    //     this.node.position = ;
    //     this.node.rotationX = this.node._rotationX;
    //     this.node.rotationY = this.node._rotationY;
    //     this.node.scaleX = ;
    //     this.node.scaleY = this.node._scaleY;
    //     this.node.anchorX = this.node._anchorPoint.x;
    //     this.node.anchorY = this.node._anchorPoint.y;
    //     this.node.width = this.node._contentSize.width;
    //     this.node.height = this.node._contentSize.height;
    //     this.node.opacity = this.node._opacity;
    //     this.node.color = this.node._color;
    },

 });

 cc.Mask = module.exports = Mask;
