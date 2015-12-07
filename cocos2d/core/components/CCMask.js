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

    properties: {
        _useOriginalSize: true,

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
        this._super();
        this.node._sizeProvider = new MonitorSize(this);
    },

    onDestroy: function () {
        this._super();
        this.node._sizeProvider = null;
    },
    _createSgNode: function () {
        var sgNode = new cc.Label(this.string, this.file, cc.Label.Type.TTF);

        // TODO
        // sgNode.enableRichText = this.enableRichText;

        sgNode.setHorizontalAlign( this.horizontalAlign );
        sgNode.setVerticalAlign( this.verticalAlign );
        sgNode.setFontSize( this.fontSize );
        sgNode.setOverflow( this.overflow );
        sgNode.enableWrapText( this.enableWrapText );
        if(!this._useOriginalSize){
            sgNode.setContentSize(this.node.getContentSize());
        }
        sgNode.setColor(this.node.color);

        return sgNode;
    }
 });

 cc.Mask = module.exports = Mask;
