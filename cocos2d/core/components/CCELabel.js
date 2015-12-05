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

/**
 *
 * @class ELabel
 * @extends _ComponentInSG
 */
var Label = cc.Class({
    name: 'cc.Label',
    extends: cc._ComponentInSG,

    editor: CC_EDITOR && {
        menu: 'UI/Label'
    },

    properties: {

        /**
         * Content string of label
         * @property {String} string
         */
        string: {
            default: '',
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

        /**
         * Font size of label
         * @property {Number} fontSize
         */
        fontSize: {
            default: 18,
            notify: function () {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.setFontSize( this.fontSize );
                }
            }
        },

        /**
         * Overflow of label
         * @property {Overflow} overflow
         */
        overflow: {
            default: Overflow.CLAMP,
            type: Overflow,
            notify: function () {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.setOverflow( this.overFlow );
                }
            }
        },

        /**
         * Whether auto wrap label when string width is large than label width
         * @property {Boolean} enableWrapText
         */
        enableWrapText: {
            default: false,
            notify: function () {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.enableWrapText( this.enableWrapText );
                }
            }
        },

        // TODO
        // file: {
        //     default: null,
        //     type: cc.TTFFont,
        //     notify: function () {
        //         var sgNode = this._sgNode;
        //         if (sgNode) {
        //             sgNode.file = this.file;
        //         }
        //     }
        // },

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

    _createSgNode: function () {
        var sgNode = new cc.Label();

        // TODO
        // sgNode.file = this.file;
        // sgNode.enableRichText = this.enableRichText;

        sgNode.setString( this.string );
        sgNode.setHorizontalAlign( this.horizontalAlign );
        sgNode.setVerticalAlign( this.verticalAlign );
        sgNode.setFontSize( this.fontSize );
        sgNode.setOverflow( this.overflow );
        sgNode.enableWrapText( this.enableWrapText );
        sgNode.setContentSize( this.node.getContentSize() );

        return sgNode;
    },
 });

 cc.ELabel = module.exports = Label;
