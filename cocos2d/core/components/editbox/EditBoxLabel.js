/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

const Label = require('../CCLabel');

const EditBoxLabel = cc.Class({
   name: 'EditBoxLabel',
   extends: Label,

   editor: CC_EDITOR && {
       menu: 'i18n:MAIN_MENU.component.renderers/Label',
       help: 'i18n:COMPONENT.help_url.label',
       inspector: 'packages://inspector/inspectors/comps/label.js',
   },

   properties: {       
       /**
        * !#en Content string of label.
        * !#zh 标签显示的文本内容。
        * @property {String} string
        */
       string: {
           get () {
               return this._string;
           },
           set (value) {
               let oldValue = this._string;
               this._string = value.toString();

               if (this.string !== oldValue) {
                   this._updateRenderData();
                   this.node.emit('string-changed');
               }

               this._checkStringEmpty();
           },
           override: true,
           multiline: true,
           tooltip: CC_DEV && 'i18n:COMPONENT.label.string'
       },

        /**
         * !#en Horizontal Alignment of label.
         * !#zh 文本内容的水平对齐方式。
         * @property {Label.HorizontalAlign} horizontalAlign
         */
        horizontalAlign: {
            default: Label.HorizontalAlign.LEFT,
            type: Label.HorizontalAlign,
            tooltip: CC_DEV && 'i18n:COMPONENT.label.horizontal_align',
            notify  (oldValue) {
                if (this.horizontalAlign === oldValue) return;
                this._updateRenderData();
                this.node.emit('horizontalAlign-changed');
            },
            override: true,
            animatable: false,
        },

       /**
        * !#en Font size of label.
        * !#zh 文本字体大小。
        * @property {Number} fontSize
        */
       fontSize: {
           get () {
               return this._fontSize;
           },
           set (value) {
               if (this._fontSize === value) return;

               this._fontSize = value;
               this._updateRenderData();
               this.node.emit('fontSize-changed');
           },
           override: true,
           tooltip: CC_DEV && 'i18n:COMPONENT.label.font_size',
       },

       /**
        * !#en Line Height of label.
        * !#zh 文本行高。
        * @property {Number} lineHeight
        */
       lineHeight: {
           get () {
               return this._lineHeight;
           },
           set (value) {
               if (this._lineHeight === value) return;
               this._lineHeight = value;
               this._updateRenderData();
               this.node.emit('lineHeight-changed');
           },
           override: true,
           tooltip: CC_DEV && 'i18n:COMPONENT.label.line_height',
       },

        /**
         * !#en The font of label.
         * !#zh 文本字体。
         * @property {Font} font
         */
        font: {
            get () {
                return this._N$file;
            },
            set (value) {
                if (this.font === value) return;
                
                //if delete the font, we should change isSystemFontUsed to true
                if (!value) {
                    this._isSystemFontUsed = true;
                }

                if (CC_EDITOR && value) {
                    this._userDefinedFont = value;
                }

                this._N$file = value;
                if (value && this._isSystemFontUsed)
                    this._isSystemFontUsed = false;

                if ( typeof value === 'string' ) {
                    cc.warnID(4000);
                }

                if (this._renderData) {
                    this.destroyRenderData(this._renderData);
                    this._renderData = null;    
                }
                this._fontAtlas = null;
                this._updateAssembler();
                this._applyFontTexture(true);
                this._updateRenderData();
                this.node.emit('font-changed');
            },
            override: true,
            type: cc.Font,
            tooltip: CC_DEV && 'i18n:COMPONENT.label.font',
            animatable: false
        },
   },
});

module.exports = EditBoxLabel;