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
require('../label/CCSGLabel');
require('../label/CCSGLabelCanvasRenderCmd');
require('../label/CCSGLabelWebGLRenderCmd');
/**
 * !#en Enum for text alignment.
 * !#zh 文本横向对齐类型
 * @enum Label.HorizontalAlign
 */
/**
 * !#en Alignment left for text.
 * !#zh 文本内容左对齐。
 * @property {Number} LEFT
 */
/**
 * !#en Alignment center for text.
 * !#zh 文本内容居中对齐。
 * @property {Number} CENTER
 */
/**
 * !#en Alignment right for text.
 * !#zh 文本内容右边对齐。
 * @property {Number} RIGHT
 */
var HorizontalAlign = cc.TextAlignment;

/**
 * !#en Enum for vertical text alignment.
 * !#zh 文本垂直对齐类型
 * @enum Label.VerticalAlign
 */
/**
 * !#en Vertical alignment top for text.
 * !#zh 文本顶部对齐。
 * @property {Number} TOP
 */
/**
 * !#en Vertical alignment center for text.
 * !#zh 文本居中对齐。
 * @property {Number} CENTER
 */
/**
 * !#en Vertical alignment bottom for text.
 * !#zh 文本底部对齐。
 * @property {Number} BOTTOM
 */
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


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce (func, wait, immediate) {
    var timeout;
    return CC_JSB ? function (...args) {
        var context = this;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    } : function () {
        var context = this;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, arguments);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, arguments);
    };
}


/**
 * !#en The Label Component.
 * !#zh 文字标签组件
 * @class Label
 * @extends _RendererUnderSG
 */
var Label = cc.Class({
    name: 'cc.Label',
    extends: cc._RendererUnderSG,

    ctor: function() {
        if(CC_EDITOR) {
            this._userDefinedFontSize = 40;
            this._userDefinedFont = null;
            this._debouncedUpdateSgNodeString = debounce(this._updateSgNodeString, 200);
            this._debouncedUpdateFontSize = debounce(this._updateSgNodeFontSize, 200);
        }
    },

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Label',
        help: 'i18n:COMPONENT.help_url.label',
        inspector: 'packages://inspector/inspectors/comps/label.js',
    },

    _updateSgNodeString: function() {
        this._sgNode.setString(this.string);
        this._updateNodeSize();
    },

    _updateSgNodeFontSize: function() {
        if (this._sgNode) {
            this._sgNode.setFontSize(this._fontSize);
            this._updateNodeSize();
        }
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
            tooltip: CC_DEV && 'i18n:COMPONENT.label.string',
            notify: function () {
                if (this._sgNode) {
                    if (CC_EDITOR) {
                        if(this.overflow === cc.Label.Overflow.SHRINK) {
                            this.fontSize = this._userDefinedFontSize;
                        }
                        this._debouncedUpdateSgNodeString();
                    } else {
                        this._updateSgNodeString();
                    }
                }
            }
        },

        /**
         * !#en Horizontal Alignment of label.
         * !#zh 文本内容的水平对齐方式。
         * @property {Label.HorizontalAlign} horizontalAlign
         */
        horizontalAlign: {
            default: HorizontalAlign.LEFT,
            type: HorizontalAlign,
            tooltip: CC_DEV && 'i18n:COMPONENT.label.horizontal_align',
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
         * @property {Label.VerticalAlign} verticalAlign
         */
        verticalAlign: {
            default: VerticalAlign.TOP,
            type: VerticalAlign,
            tooltip: CC_DEV && 'i18n:COMPONENT.label.vertical_align',
            notify: function () {
                if (this._sgNode) {
                    this._sgNode.setVerticalAlign( this.verticalAlign );
                }
            },
            animatable: false
        },

        _actualFontSize: {
            default: 40,
        },

        /**
         * !#en The actual rendering font size in shrink mode
         * !#zh SHRINK 模式下面文本实际渲染的字体大小
         * @property {Number} actualFontSize
         */
        actualFontSize: {
            displayName: 'Actual Font Size',
            animatable: false,
            readonly: true,
            get: function () {
                if (this._sgNode) {
                    this._actualFontSize = this._sgNode.getFontSize();
                }
                return this._actualFontSize;
            }
        },

        _fontSize: 40,
        /**
         * !#en Font size of label.
         * !#zh 文本字体大小。
         * @property {Number} fontSize
         */
        fontSize: {
            get: function(){
                return this._fontSize;
            },
            set: function(value){
                this._fontSize = value;
                if(CC_EDITOR) {
                    this._userDefinedFontSize = value;
                    this._debouncedUpdateFontSize();
                } else {
                    this._updateSgNodeFontSize();
                }
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.label.font_size',
        },

        /**
         * !#en Font family of label, only take effect when useSystemFont property is true.
         * !#zh 文本字体名称, 只在 useSystemFont 属性为 true 的时候生效。
         * @property {String} fontFamily
         */
        fontFamily: {
            default: "Arial",
            tooltip: CC_DEV && 'i18n:COMPONENT.label.font_family',
            notify: function () {
                if (this._sgNode) {
                    this._sgNode.setFontFamily(this.fontFamily);
                }
            },
            animatable: false
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
            tooltip: CC_DEV && 'i18n:COMPONENT.label.line_height',
        },
        /**
         * !#en Overflow of label.
         * !#zh 文字显示超出范围时的处理方式。
         * @property {Label.Overflow} overflow
         */
        overflow: {
            default: Overflow.NONE,
            type: Overflow,
            tooltip: CC_DEV && 'i18n:COMPONENT.label.overflow',
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
            tooltip: CC_DEV && 'i18n:COMPONENT.label.wrap',
        },

        // 这个保存了旧项目的 file 数据
        _N$file: null,

        /**
         * !#en The font of label.
         * !#zh 文本字体。
         * @property {Font} font
         */
        font: {
            get: function () {
                return this._N$file;
            },
            set: function (value) {
                //if delete the font, we should change isSystemFontUsed to true
                if(!value) {
                    this._isSystemFontUsed = true;
                }

                if(CC_EDITOR && value) {
                    this._userDefinedFont = value;
                }

                this._N$file = value;
                this._bmFontOriginalSize = -1;
                if (value && this._isSystemFontUsed)
                    this._isSystemFontUsed = false;

                if (this._sgNode) {

                    if ( typeof value === 'string' ) {
                        cc.warnID(4000);
                    }

                    var font = this.font;
                    if (font instanceof cc.BitmapFont) {
                        if (font.spriteFrame) {
                            if (!CC_JSB) {
                                this._sgNode.setFontAsset(font);
                            } else {
                                if (font.spriteFrame.textureLoaded()) {
                                    this._sgNode.setFontAsset(font);
                                }
                                else {
                                    cc.warnID(4012, font.name);
                                    this._sgNode.setFontFamily('');
                                }
                            }
                        } else {
                            cc.warnID(4011, font.name);
                            this._sgNode.setFontFamily('');
                        }
                    } else {
                        this._sgNode.setFontAsset(font);
                    }
                }

                if (value instanceof cc.BitmapFont) {
                    this._bmFontOriginalSize = value.fontSize;
                }
            },
            type: cc.Font,
            tooltip: CC_DEV && 'i18n:COMPONENT.label.font',
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
                return this._isSystemFontUsed;
            },
            set: function(value){
                if(CC_EDITOR) {
                    if(!value && this._isSystemFontUsed && this._userDefinedFont) {
                        this.font = this._userDefinedFont;
                        this.spacingX = this._spacingX;
                        return;
                    }
                }

                this._isSystemFontUsed = !!value;
                if (value) {
                    this.font = null;
                    if (this._sgNode) {
                        this._sgNode.setFontFamily(this.fontFamily);
                    }
                }

            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.label.system_font',
        },

        _bmFontOriginalSize: {
            displayName: 'BMFont Original Size',
            default: -1,
            serializable: false,
            readonly: true,
            visible: true,
            animatable: false
        },

        _spacingX: 0,
        spacingX: {
            get: function() {
                return this._spacingX;
            },
            set: function(value) {
                this._spacingX = value;
                if (this._sgNode) {
                    this._sgNode.setSpacingX(this.spacingX);
                    this._updateNodeSize();
                }
            }
        }

    },

    statics: {
        HorizontalAlign: HorizontalAlign,
        VerticalAlign: VerticalAlign,
        Overflow: Overflow,
    },

    __preload: function () {
        this._super();

        var sgSizeInitialized = this._sgNode._isUseSystemFont;
        if (sgSizeInitialized) {
            this._updateNodeSize();
        }

        // node should be resize whenever font changed, needed only on web
        if (!CC_JSB) {
            this._sgNode.on('load', this._updateNodeSize, this);
        }

    },

    _createSgNode: function () {
        return null;
    },

    _initSgNode: function () {
        var font = this.font;
        if (typeof font === 'string' ) {
            cc.warnID(4000);
        }

        var sgNode;
        if (font instanceof cc.BitmapFont) {
            if (font.spriteFrame) {
                if (CC_JSB) {
                    if (font.spriteFrame.textureLoaded()) {
                        sgNode = this._sgNode = new _ccsg.Label(this.string, JSON.stringify(font._fntConfig), font.spriteFrame);
                    } else {
                        cc.warnID(4012, font.name);
                        sgNode = this._sgNode = new _ccsg.Label(this.string);
                    }
                } else {
                    sgNode = this._sgNode = _ccsg.Label.pool.get(this.string, font);
                }
            } else {
                cc.warnID(4011, font.name);
                sgNode = this._sgNode = new _ccsg.Label(this.string);
            }
        } else {
            sgNode = this._sgNode = _ccsg.Label.pool.get(this.string, font);
        }

        if (CC_JSB) {
            sgNode.retain();
        }

        if (font instanceof cc.BitmapFont) {
            this._bmFontOriginalSize = font.fontSize;
        }

        sgNode.setVisible(false);
        sgNode.setHorizontalAlign( this.horizontalAlign );
        sgNode.setVerticalAlign( this.verticalAlign );
        sgNode.setFontSize( this._fontSize );
        if (this.useSystemFont) {
            sgNode.setFontFamily(this.fontFamily);
        }
        sgNode.setOverflow( this.overflow );
        sgNode.enableWrapText( this._enableWrapText );
        sgNode.setLineHeight(this._lineHeight);
        sgNode.setString(this.string);
        if (font instanceof cc.BitmapFont) {
            sgNode.setSpacingX(this.spacingX);
        }
        if (CC_EDITOR) {
            this._userDefinedFontSize = this.fontSize;
            this._userDefinedFont = font;
        }
        if (CC_EDITOR && this._useOriginalSize) {
            this.node.setContentSize(sgNode.getContentSize());
            if (font instanceof cc.BitmapFont) {
                this.lineHeight = sgNode.getBMFontLineHeight();
            }
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
            if (this.overflow === Overflow.NONE || this.overflow === Overflow.RESIZE_HEIGHT) {
                this.node.setContentSize(this._sgNode.getContentSize());
            }
        }
    },

    onDestroy: function () {
        var sgNodeBeforeDestroy = this._sgNode;
        this._super();
        if (sgNodeBeforeDestroy) {
            sgNodeBeforeDestroy.removeFromParent(true);
            _ccsg.Label.pool.put(sgNodeBeforeDestroy);
        }
    }
 });

 cc.Label = module.exports = Label;
