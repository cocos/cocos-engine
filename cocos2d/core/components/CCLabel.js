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
var Overflow = _ccsg.Label.Overflow;
var LabelType = _ccsg.Label.Type;
/**
 *
 * @class Label
 * @extends _RendererBelowSG
 */
var Label = cc.Class({
    name: 'cc.Label',
    extends: cc._RendererBelowSG,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Label'
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
            tooltip: 'i18n:COMPONENT.label.string',
            notify: function () {
                if (this._sgNode) {
                    this._sgNode.setString(this.string);
                    this._updateNodeSize();
                }
            }
        },

        /**
         * Horizontal Alignment of label
         * @property {cc.TextAlignment} horizontalAlign
         */
        horizontalAlign: {
            default: HorizontalAlign.LEFT,
            type: HorizontalAlign,
            tooltip: 'i18n:COMPONENT.label.horizontal_align',
            notify: function () {
                if (this._sgNode) {
                    this._sgNode.setHorizontalAlign( this.horizontalAlign );
                }
            },
            animatable: false
        },

        /**
         * Vertical Alignment of label
         * @property {cc.VerticalTextAlignment} verticalAlign
         */
        verticalAlign: {
            default: VerticalAlign.TOP,
            type: VerticalAlign,
            tooltip: 'i18n:COMPONENT.label.vertical_align',
            notify: function () {
                if (this._sgNode) {
                    this._sgNode.setVerticalAlign( this.verticalAlign );
                }
            },
            animatable: false
        },

        _fontSize: 40,
        /**
         * Font size of label
         * @property {Number} fontSize
         */
        fontSize: {
            get: function(){
                if (this._sgNode) {
                    this._fontSize = this._sgNode.getFontSize();
                }
                return this._fontSize;
            },
            set: function(value){
                this._fontSize = value;
                if (this._sgNode) {
                    this._sgNode.setFontSize(value);
                    this._updateNodeSize();
                }
            },
            tooltip: 'i18n:COMPONENT.label.font_size',
        },

        _lineHeight: 20,

        lineHeight: {
            get: function(){
                if (this._sgNode) {
                    this._lineHeight = this._sgNode.getLineHeight();
                }
                return this._lineHeight;
            },
            set: function(value){
                this._lineHeight = value;

                if (this._sgNode) {
                    this._sgNode.setLineHeight(value);
                    this._updateNodeSize();
                }
            },
            tooltip: 'i18n:COMPONENT.label.line_height',
        },
        /**
         * Overflow of label
         * @property {Label.Overflow} overFlow
         */
        overflow: {
            default: Overflow.NONE,
            type: Overflow,
            tooltip: 'i18n:COMPONENT.label.overflow',
            notify: function () {
                if (this._sgNode) {
                    this._sgNode.setOverflow(this.overflow);
                    this._updateNodeSize();
                }
            },
            animatable: false
        },

        _enableWrapText: true,
        /**
         * Whether auto wrap label when string width is large than label width
         * @property {Boolean} enableWrapText
         */
        enableWrapText: {
            get: function(){
                if (this._sgNode) {
                    this._enableWrapText = this._sgNode.isWrapTextEnabled();
                }
                return this._enableWrapText;
            },
            set: function(value){
                this._enableWrapText = value;
                if (this._sgNode) {
                    this._sgNode.enableWrapText(value);
                }
            },
            animatable: false,
            tooltip: 'i18n:COMPONENT.label.wrap',
        },

        /**
         * The font URL of label.
         * @property {URL} file
         */
        file: {
            default: "Arial",
            url: cc.Font,
            tooltip: 'i18n:COMPONENT.label.file',
            notify: function () {
                if (this._sgNode) {
                    this._sgNode.setFontFileOrFamily(this.file);
                }
            },
            animatable: false
        },

        _isSystemFontUsed: true,

        /**
         * Whether use system font name or not.
         * @property {Boolean} isSystemFontUsed
         */
        useSystemFont: {
            get: function(){
                if (this._sgNode) {
                    this._isSystemFontUsed = this._sgNode.isSystemFontUsed();
                }
                return this._isSystemFontUsed;
            },
            set: function(value){
                this._isSystemFontUsed = value;
                if (value) {
                    this.file = "";
                    if (this._sgNode) {
                        this._sgNode.setSystemFontUsed(value);
                    }
                }

            },
            animatable: false,
            tooltip: 'i18n:COMPONENT.label.system_font',
        }

        // TODO
        // enableRichText: {
        //     default: false,
        //     notify: function () {
        //         this._sgNode.enableRichText = this.enableRichText;
        //     }
        // }

    },

    statics: {
        /**
         * The horizontal alignment of label.
         * @property {cc.TextAlignment} HorizontalAlign
         */
        HorizontalAlign: HorizontalAlign,

        /**
         * The vertical alignment of label.
         * @property {cc.VerticalTextAlignment} VerticalAlign
         */
        VerticalAlign: VerticalAlign,

        /**
         * Label overflow type, currently three types are supported: Clamp, Shrink and ResizeHeight.
         * @property {Overflow} Overflow
         */
        Overflow: Overflow,
    },

    onLoad: function () {
        this._super();

        this.node.on('size-changed', this._resized, this);

        var sgSizeInitialized = this._sgNode._isUseSystemFont;
        if (sgSizeInitialized) {
            this._updateNodeSize();
        }
        else if (this.node._sizeProvider === this._sgNode) {
            // should not provide size for node if size not ready (#853)
            this.node._sizeProvider = null;
        }

        // node should be resize whenever font changed, needed only on web
        if (!cc.sys.isNative) {
            this._sgNode.on('load', this._updateNodeSize, this);
        }
    },

    onDestroy: function () {
        this._super();
        this.node.off('size-changed', this._resized, this);
    },

    _createSgNode: function () {
        return null;
    },

    _initSgNode: function () {
        this._sgNode = new _ccsg.Label(this.string, this.file);
        this._sgNode.retain();
        var sgNode = this._sgNode;

        // TODO
        // sgNode.enableRichText = this.enableRichText;

        sgNode.setHorizontalAlign( this.horizontalAlign );
        sgNode.setVerticalAlign( this.verticalAlign );
        sgNode.setFontSize( this._fontSize );
        sgNode.setOverflow( this.overflow );
        sgNode.enableWrapText( this._enableWrapText );
        sgNode.setLineHeight(this._lineHeight);
        sgNode.setString(this.string);
        sgNode.setFontFileOrFamily(this.file);
        if(!this._useOriginalSize){
            if(this.overflow !== Overflow.NONE) {
                sgNode.setContentSize(this.node.getContentSize());
            }
        }
        sgNode.setColor(this.node.color);
    },

    _resized: function () {
        this._useOriginalSize = false;
    },

    // update node size (this will also invoke the size-changed event)
    _updateNodeSize: function () {
        var initialized = this._sgNode && this._sgNode.parent;
        if (initialized) {
            if (this.overflow === Overflow.NONE) {
                this.node.setContentSize(this._sgNode.getContentSize());
            }
            if ( !this.node._sizeProvider ) {
                this.node._sizeProvider = this._sgNode;
            }
        }
    }
 });

 cc.Label = module.exports = Label;
