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

var HorizontalAlign = cc.TextAlignment;
var VerticalAlign = cc.VerticalTextAlignment;
var Overflow = cc.Label.Overflow;
var LabelType = cc.Label.Type;
/**
 *
 * @class ELabel
 * @extends _ComponentInSG
 */
var Label = cc.Class({
    name: 'cc.Label',
    extends: cc._ComponentInSG,

    editor: CC_EDITOR && {
        menu: 'Graphics/Label'
    },

    properties: {
        _useOriginalSize: true,
        /**
         * Content string of label
         * @property {String} string
         */
        string: {
            default: 'Label',
            multiline: true,
            notify: function () {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.setString(this.string);
                }
            }
        },

        /**
         * Horizontal Alignment of label
         * @property {TextAlignment} horizontalAlign
         */
        horizontalAlign: {
            default: HorizontalAlign.LEFT,
            type: HorizontalAlign,
            notify: function () {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.setHorizontalAlign( this.horizontalAlign );
                }
            },
        },

        /**
         * Vertical Alignment of label
         * @property {VerticalTextAlignment} verticalAlign
         */
        verticalAlign: {
            default: VerticalAlign.TOP,
            type: VerticalAlign,
            notify: function () {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.setVerticalAlign( this.verticalAlign );
                }
            },
        },

        _fontSize: 40,
        /**
         * Font size of label
         * @property {Number} fontSize
         */
        fontSize: {
            get: function(){
                var sgNode = this._sgNode;
                if(sgNode){
                    this._fontSize = sgNode.getFontSize();
                }
                return this._fontSize;
            },
            set: function(value){
                this._fontSize = value;

                var sgNode = this._sgNode;
                if(sgNode){
                    sgNode.setFontSize(value);
                }
            }
        },

        _lineHeight: 20,

        lineHeight: {
            get: function(){
                var sgNode = this._sgNode;
                if(sgNode){
                    this._lineHeight = sgNode.getLineHeight();
                }
                return this._lineHeight;
            },
            set: function(value){
                this._lineHeight = value;

                var sgNode = this._sgNode;
                if(sgNode){
                    sgNode.setLineHeight(value);
                }
            }
        },
        /**
         * Overflow of label
         * @property {Overflow} overFlow
         */
        overflow: {
            default: Overflow.CLAMP,
            type: Overflow,
            notify: function () {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.setOverflow( this.overflow );
                }
            }
        },

        _enableWrapText: true,
        /**
         * Whether auto wrap label when string width is large than label width
         * @property {Boolean} enableWrapText
         */
        enableWrapText: {
            get: function(){
                var sgNode = this._sgNode;
                if(sgNode){
                    this._enableWrapText = sgNode.isWrapTextEnabled();
                }
                return this._enableWrapText;
            },
            set: function(value){
                this._enableWrapText = value;

                var sgNode = this._sgNode;
                if(sgNode){
                    sgNode.enableWrapText(value);
                }
            }
        },

        /**
         * The font URL of label.
         * @property {URL} file
         */
        file: {
            default: "Arial",
            url: cc.Font,
            notify: function () {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.setFontFileOrFamily(this.file);
                }
            }
        },

        _isSystemFontUsed: true,

        /**
         * Whether use system font name or not.
         * @property {Boolean} isSystemFontUsed
         */
        useSystemFont: {
            get: function(){
                var sgNode = this._sgNode;
                if(sgNode){
                    this._isSystemFontUsed = sgNode.isSystemFontUsed();
                }
                return this._isSystemFontUsed;
            },
            set: function(value){
                var sgNode = this._sgNode;
                this._isSystemFontUsed = value;
                if(value){
                    if(sgNode){
                        this.file = "";
                        sgNode.setSystemFontUsed(value);
                    }
                }

            }
        }

        // TODO
        // enableRichText: {
        //     default: false,
        //     notify: function () {
        //         var sgNode = this._sgNode;
        //         if (sgNode) {
        //             sgNode.enableRichText = this.enableRichText;
        //         }
        //     }
        // }

    },

    onLoad: function () {
        this._super();
        this.node.on('size-changed', this._resized, this);
    },

    onDestroy: function () {
        this._super();
        this.node.off('size-changed', this._resized, this);
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
        sgNode.setLineHeight(this.lineHeight);
        if(!this._useOriginalSize){
            sgNode.setContentSize(this.node.getContentSize());
        }
        sgNode.setColor(this.node.color);

        return sgNode;
    },

    _resized: function () {
        this._useOriginalSize = false;
    }
 });

 cc.ELabel = module.exports = Label;
