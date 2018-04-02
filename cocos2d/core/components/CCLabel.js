/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const macro = require('../platform/CCMacro');
const RenderComponent = require('./CCRenderComponent');
const renderer = require('../renderer');
const renderEngine = require('../renderer/render-engine');
const SpriteMaterial = renderEngine.SpriteMaterial;

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
var HorizontalAlign = macro.TextAlignment;

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
var VerticalAlign = macro.VerticalTextAlignment;

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
var Overflow = cc.Enum({
    NONE: 0,
    CLAMP: 1,
    SHRINK: 2,
    RESIZE_HEIGHT: 3
});;

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
    return function () {
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
 * @extends Component
 */
var Label = cc.Class({
    name: 'cc.Label',
    extends: RenderComponent,

    ctor: function() {
        if (CC_EDITOR) {
            this._userDefinedFont = null;
        }

        this._actualFontSize = 0;
        this._assemblerData = null;
    },

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Label',
        help: 'i18n:COMPONENT.help_url.label',
        inspector: 'packages://inspector/inspectors/comps/label.js',
    },

    properties: {
        _useOriginalSize: true,
        /**
         * !#en Content string of label.
         * !#zh 标签显示的文本内容。
         * @property {String} string
         */
        string: {
            default: '',
            multiline: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.label.string',
            notify: function () {
                this._updateRenderData();
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
                this._updateRenderData();
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
                this._updateRenderData();
            },
            animatable: false
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
                this._updateRenderData();
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
                this._updateRenderData();
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
                return this._lineHeight;
            },
            set: function(value){
                this._lineHeight = value;
                this._updateRenderData();
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
                this._updateRenderData();
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
                return this._enableWrapText;
            },
            set: function(value){
                this._enableWrapText = value;
                this._updateRenderData();
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
                if (this.font === value) return;
                
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

                if ( typeof value === 'string' ) {
                    cc.warnID(4000);
                }

                if (value instanceof cc.BitmapFont) {
                    this._bmFontOriginalSize = value.fontSize;
                }

                if (this._renderData) {
                    this.destroyRenderData(this._renderData);
                    this._renderData = null;    
                }
                this._fontAtlas = null;
                this._material = null;
                this._updateAssembler();
                this._activateMaterial();
                this._updateRenderData();
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
            get: function() {
                return this._isSystemFontUsed;
            },
            set: function(value) {
                if (this._isSystemFontUsed === value) return;
                
                this.destroyRenderData(this._renderData);
                this._renderData = null;

                if (CC_EDITOR) {
                    if (!value && this._isSystemFontUsed && this._userDefinedFont) {
                        this.font = this._userDefinedFont;
                        this.spacingX = this._spacingX;
                        return;
                    }
                }

                this._isSystemFontUsed = !!value;
                if (value) {
                    this.font = null;
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
                this._updateRenderData();
            }
        },

        _isBold: {
            default: false,
            serializable: false,
        },
        _isItalic: {
            default: false,
            serializable: false,
        },
        _isUnderline: {
            default: false,
            serializable: false,
        },
    },

    statics: {
        HorizontalAlign: HorizontalAlign,
        VerticalAlign: VerticalAlign,
        Overflow: Overflow,
    },

    onEnable: function () {
        this._super();

        this._updateAssembler();
        this._activateMaterial();
    },

    _updateAssembler () {
        let assembler = Label._assembler.getAssembler(this);
        
        if (this._assembler !== assembler) {
            this._assembler = assembler;
            this._renderData = null;
        }

        if (!this._renderData) {
            this._renderData = this._assembler.createData(this);
            this._renderData.worldMatDirty = true;
        }
    },

    _activateMaterial: function () {
        if (this._material) return;

        this._assemblerData = null;

        let material;
        let font = this.font;
        if (font instanceof cc.BitmapFont) {
            let spriteFrame = this.font.spriteFrame;
            // cannot be activated if texture not loaded yet
            if (!spriteFrame.textureLoaded()) {
                return;
            }
            
            material = new SpriteMaterial();
            // TODO: old texture in material have been released by loader
            material.texture = this._texture = spriteFrame._texture;
        }
        else {
            let assemblerData = this._assemblerData = {};

            assemblerData._canvas = document.createElement("canvas");
            // create canvas with size so that the default texture impl can be created and don't need activate material again
            assemblerData._canvas.width = assemblerData._canvas.height = 1;
            assemblerData._context = assemblerData._canvas.getContext("2d");

            this._texture = new cc.Texture2D();
            this._texture.initWithElement(assemblerData._canvas);
            this._texture.handleLoadedTexture();

            material = new SpriteMaterial();
            material.texture = this._texture;
        }

        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            this._texture.url = this.uuid + '_texture';
        }

        this.setMaterial(material);
    },

    _updateRenderData: function (force) {
        let renderData = this._renderData;
        if (renderData) {
            renderData.vertDirty = true;
            renderData.uvDirty = true;
        }

        if (CC_EDITOR || force) {
            this._activateMaterial();
            Label._assembler.updateRenderData(this);
        }
    },

    _enableBold: function (enabled) {
        this._isBold = !!enabled;
    },

    _enableItalics: function (enabled) {
        this._isItalic = !!enabled;
    },

    _enableUnderline: function (enabled) {
        this._isUnderline = !!enabled;
    },
 });

 cc.Label = module.exports = Label;
