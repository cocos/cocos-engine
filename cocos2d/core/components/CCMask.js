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

function MonitorSize(target) {
    this._target = target;
}
MonitorSize.prototype = {
    getContentSize: function () {
        return this._target._sgNode.getContentSize();
    },
    setContentSize: function (size) {
        this._target._useOriginalSize = false;
        this._target._sgNode.setContentSize(size);
    },
    _getWidth: function () {
        return this.getContentSize().width;
    },
    _getHeight: function () {
        return this.getContentSize().height;
    }
};
var HorizontalAlign = cc.TextAlignment;
var VerticalAlign = cc.VerticalTextAlignment;
var Overflow = cc.Label.Overflow;
var LabelType = cc.Label.Type;
/**
 *
 * @class ELabel
 * @extends _ComponentInSG
 */
var Mask = cc.Class({
    name: 'cc.Mask',
    extends: cc._ComponentInSG,

    editor: CC_EDITOR && {
        menu: 'UI/Mask'
    },

    _clippingNode: null,
    _clippingStencil: null,
    _sizeProvider: null,
    properties: {

        // _aheheValue: 30,
        // ahehe: {
        //     get: function() {
        //         return this._aheheValue;
        //     },
        //     set: function(value) {
        //         this._aheheValue = value;
        //     },
        // },

        // _fontSize: 40,
        // /**
        //  * Font size of label
        //  * @property {Number} fontSize
        //  */
        // fontSize: {
        //     get: function(){
        //         var sgNode = this._sgNode;
        //         if(sgNode){
        //             this._fontSize = sgNode.getFontSize();
        //         }
        //         return this._fontSize;
        //     },
        //     set: function(value){
        //         this._fontSize = value;

        //         var sgNode = this._sgNode;
        //         if(sgNode){
        //             sgNode.setFontSize(value);
        //         }
        //     }
        // },


    },

    onLoad: function () {
        // var sgNode = this._createSgNode();
        // this._appendSgNode(sgNode);
        // if ( !this.node._sizeProvider ) {
        //     this.node._sizeProvider = sgNode;
        // }
        this._super();
        this._clippingNode = new cc.ClippingNode(this._sgNode);
        //this._sizeProvider = new MonitorSize(this);
    },
    onEnable: function () {
        // if (this._sgNode) {
        //     this._sgNode.visible = true;
        // }
        this._super();
        //this.node._sizeProvider = this._sizeProvider;
        var oldNode = this.node._sgNode;
        this.node._sgNode = this._clippingNode;
        this._rebuildSceneGraph(this._clippingNode,oldNode);
        //this.node._sizeProvider = this._sizeProvider;
        //this.node.width = this.node.height = 100;

    },
    onDisable: function () {
        // if (this._sgNode) {
        //     this._sgNode.visible = false;
        // }
        this._super();
        //this.node._sizeProvider = null;
        var oldNode = this.node._sgNode;
        this.node._sgNode = new cc.Node();
        this._rebuildSceneGraph(this.node._sgNode, oldNode);

    },
    
    onDestroy: function () {
        this._super();
        //this._sizeProvider = null;
    },
    
    _createSgNode: function () {
        return new cc.LayerColor(new cc.Color(255,255,255,255),100,100);
    },
    
    _rebuildSceneGraph: function (newNode, oldNode) {

        var children = [];
        children = children.concat(oldNode.getChildren());
    
        for(var index = 0; index < children.length; ++index) {
            children[index].removeFromParent();
            newNode.addChild(children[index]);
        }
        var parentNode = oldNode.getParent();
        oldNode.removeFromParent();
        parentNode.addChild(newNode);

        this.node.position = this.node._position;
        this.node.rotationX = this.node._rotationX;
        this.node.rotationY = this.node._rotationY;
        this.node.scaleX = this.node._scaleX;
        this.node.scaleY = this.node._scaleY;
        this.node.anchorX = this.node._anchorPoint.x;
        this.node.anchorY = this.node._anchorPoint.y;
        this.node.width = this.node._contentSize.width;
        this.node.height = this.node._contentSize.height;
        this.node.opacity = this.node._opacity;
        this.node.color = this.node._color;
    },

 });

 cc.Mask = module.exports = Mask;
