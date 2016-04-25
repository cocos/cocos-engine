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

var HorizontalAlign = cc.TextAlignment;
var VerticalAlign = cc.VerticalTextAlignment;

/**
 * !#en Enum for Overflow.
 * !#zh Overflow 类型
 * @enum Label.Overflow
 */
/**
 * !#en NONE.
 * !#zh 不做任何限制。
 * @property {Number} NONE
 */
/**
 * !#en In CLAMP mode, when label content goes out of the bounding box, it will be clipped.
 * !#zh CLAMP 模式中，当文本内容超出边界框时，多余的会被截断。
 * @property {Number} CLAMP
 */
/**
 * !#en In SHRINK mode, the font size will change dynamically to adapt the content size.
 * !#zh SHRINK 模式，字体大小会动态变化，以适应内容大小。
 * @property {Number} SHRINK
 */
/**
 * !#en In RESIZE_HEIGHT mode, you can only change the width of label and the height is changed automatically.
 * !#zh 在 RESIZE_HEIGHT 模式下，只能更改文本的宽度，高度是自动改变的。
 * @property {Number} RESIZE_HEIGHT
 */
var Overflow = _ccsg.Label.Overflow;

/**
 * !#en Enum for font type.
 * !#zh Type 类型
 * @enum Label.Type
 */
/**
 * !#en The TTF font type.
 * !#zh TTF字体
 * @property {Number} TTF
 */
/**
 * !#en The bitmap font type.
 * !#zh 位图字体
 * @property {Number} BMFont
 */
/**
 * !#en The system font type.
 * !#zh 系统字体
 * @property {Number} SystemFont
 */
var LabelType = _ccsg.Label.Type;
/**
 * !#en The Label Component.
 * !#zh 文字标签组件
 * @class Label
 * @extends _RendererUnderSG
 */
var Label = cc.Class({
    name: 'cc.Label',
    extends: cc._RendererUnderSG,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Label',
        help: 'i18n:COMPONENT.help_url.label',
    },

    properties: {
        _useOriginalSize: true,
        /**
         * !#en Content string of label.
         * !#zh 标签显示的文本内容。
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
         * !#en Horizontal Alignment of label.
         * !#zh 文本内容的水平对齐方式。
         * @property {Label.TextAlignment} horizontalAlign
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
         * !#en Vertical Alignment of label.
         * !#zh 文本内容的垂直对齐方式。
         * @property {Label.VerticalTextAlignment} verticalAlign
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
         * !#en Font size of label.
         * !#zh 文本字体大小。
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

        _lineHeight: 40,
        /**
         * !#en Line Height of label.
         * !#zh 文本行高。
         * @property {Number} lineHeight
         */
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
         * !#en Overflow of label.
         * !#zh 文字显示超出范围时的处理方式。
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
         * !#en Whether auto wrap label when string width is large than label width.
         * !#zh 是否自动换行。
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
         * !#en The font URL of label.
         * !#zh 文本字体的 url。
         * @property {String} file
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
         * !#en Whether use system font name or not.
         * !#zh 是否使用系统字体。
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
        HorizontalAlign: HorizontalAlign,
        VerticalAlign: VerticalAlign,
        Overflow: Overflow,
    },

    onLoad: function () {
        this._super();

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
        if (CC_EDITOR && this._useOriginalSize) {
            this.node.setContentSize(sgNode.getContentSize());
            this._useOriginalSize = false;
        } else {
            sgNode.setContentSize(this.node.getContentSize());
        }
        sgNode.setColor(this.node.color);
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
