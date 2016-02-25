/*global _ccsg */

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

var KeyboardReturnType = _ccsg.EditBox.KeyboardReturnType;
var InputMode = _ccsg.EditBox.InputMode;
var InputFlag = _ccsg.EditBox.InputFlag;

/**
 * cc.EditBox is a component for inputing text, you can use it to gather small amounts of text from users.
 * @class EditBox
 * @extends _RendererBelowSG
 */
var EditBox = cc.Class({
    name: 'cc.EditBox',
    extends: cc._RendererBelowSG,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/EditBox',
        inspector: 'app://editor/page/inspector/cceditbox.html',
        executeInEditMode: true,
    },

    properties: {
        _useOriginalSize: true,
        _string: '',
        /**
         * Input string of EditBox.
         * @property {String} string
         */
        string: {
            tooltip: 'i18n:COMPONENT.editbox.string',
            get: function () {
                return this._sgNode.string;
            },
            set: function(value) {
                this._sgNode.string = this._string = value;
            }
        },

        /**
         * The background image of EditBox.
         * @property {cc.SpriteFrame} backGroundImage
         */
        backgroundImage: {
            tooltip: 'i18n:COMPONENT.editbox.backgroundImage',
            default: null,
            type: cc.SpriteFrame,
            notify: function() {
                var sgNode = this._sgNode;
                var backgroundSprite = sgNode.getBackgroundSprite();
                if(this.backgroundImage) {
                    var sprite = this._createBackgroundSprite();
                    sprite.setSpriteFrame(this.backgroundImage);
                    sprite.setContentSize(sgNode.getContentSize());
                }
                else {
                    backgroundSprite.removeFromParent();
                }
            }
        },

        /**
         * The return key type of EditBox.
         * Note: it is meaningless for web platforms and desktop platforms.
         * @property {EditBox.KeyboardReturnType} returnType
         * @default KeyboardReturnType.DEFAULT
         */
        returnType: {
            default: KeyboardReturnType.DEFAULT,
            tooltip: 'i18n:COMPONENT.editbox.returnType',
            displayName: 'KeyboardReturnType',
            type: KeyboardReturnType,
            notify: function() {
                this._sgNode.returnType = this.returnType;
            }
        },

        /**
         * Set the input flags that are to be applied to the EditBox.
         * @property {EditBox.InputFlag} inputFlag
         * @default InputFlag.INITIAL_CAPS_ALL_CHARACTERS
         */
        inputFlag: {
            tooltip: 'i18n:COMPONENT.editbox.input_flag',
            default: InputFlag.INITIAL_CAPS_ALL_CHARACTERS,
            type: InputFlag,
            notify: function() {
                this._sgNode.inputFlag = this.inputFlag;
            }
        },
        /**
         * Set the input mode of the edit box.
         * If you pass ANY, it will create a multiline EditBox.
         * @property {EditBox.InputMode} inputMode
         * @default InputMode.ANY
         */
        inputMode: {
            tooltip: 'i18n:COMPONENT.editbox.input_mode',
            default: InputMode.ANY,
            type: InputMode,
            notify: function() {
                this._sgNode.inputMode = this.inputMode;
            }
        },

        /**
         * Font size of the input text.
         * @property {Number} fontSize
         */
        fontSize: {
            tooltip: 'i18n:COMPONENT.editbox.font_size',
            default: 20,
            notify: function() {
                this._sgNode.fontSize = this.fontSize;
            }
        },

        /**
         * Change the lineHeight of displayed text.
         * @property {Number} lineHeight
         */
        lineHeight: {
            tooltip: 'i18n:COMPONENT.editbox.line_height',
            default: 40,
            notify: function() {
                this._sgNode.setLineHeight(this.lineHeight);
            }
        },

        /**
         * Font color of the input text.
         * @property {cc.Color} fontColor
         */
        fontColor: {
            tooltip: 'i18n:COMPONENT.editbox.font_color',
            default: cc.Color.WHITE,
            notify: function() {
                this._sgNode.fontColor = this.fontColor;
            }
        },

        /**
         * The display text of placeholder.
         * @property {String} placeholder
         */
        placeholder: {
            tooltip: 'i18n:COMPONENT.editbox.placeholder',
            default: 'Enter text here...',
            notify: function() {
                this._sgNode.placeholder = this.placeholder;
            }
        },

        /**
         * The font size of placeholder.
         * @property {Number} placeholderFontSize
         */
        placeholderFontSize: {
            tooltip: 'i18n:COMPONENT.editbox.placeholder_font_size',
            default: 20,
            notify: function() {
                this._sgNode.placeholderFontSize = this.placeholderFontSize;
            }
        },

        /**
         * The font color of placeholder.
         * @property {cc.Color} placeholderFontColor
         */
        placeholderFontColor: {
            tooltip: 'i18n:COMPONENT.editbox.placeholder_font_color',
            default: cc.Color.GRAY,
            notify: function() {
                this._sgNode.placeholderFontColor = this.placeholderFontColor;
            }
        },

        /**
         * The maximize input length of EditBox.
         * @property {Number} maxLength
         */
        maxLength: {
            tooltip: 'i18n:COMPONENT.editbox.max_length',
            default: 20,
            notify: function() {
                this._sgNode.maxLength = this.maxLength;
            }
        },

        /**
         * The event handler to be called when EditBox began to edit text.
         * @property {cc.Component.EventHandler} editingDidBegin
         */
        editingDidBegan: {
            default: [],
            type: cc.Component.EventHandler,
        },

        /**
         * The event handler to be called when EditBox text changes.
         * @property {cc.Component.EventHandler} textChanged
         */
        textChanged: {
            default: [],
            type: cc.Component.EventHandler,
        },

        /**
         * The event handler to be called when EditBox edit ends.
         * @property {cc.Component.EventHandler} editingDidEnded
         */
        editingDidEnded: {
            default: [],
            type: cc.Component.EventHandler,
        }

    },

    statics: {
        KeyboardReturnType: KeyboardReturnType,
        InputFlag: InputFlag,
        InputMode: InputMode
    },

    _createSgNode: function() {
        return new _ccsg.EditBox(cc.size(160, 40));
    },

    _createBackgroundSprite: function() {
        var sgNode = this._sgNode;
        var bgSprite = new cc.Scale9Sprite(this.backgroundImage);
        sgNode.initWithSizeAndBackgroundSprite(cc.size(160, 40), bgSprite);
        return bgSprite;
    },

    _initSgNode: function() {
        var sgNode = this._sgNode;

        this._createBackgroundSprite();


        sgNode.inputMode = this.inputMode;
        sgNode.maxLength = this.maxLength;

        sgNode.string = this._string;
        sgNode.fontSize = this.fontSize;
        sgNode.fontColor = this.fontColor;
        sgNode.placeholder = this.placeholder;
        sgNode.placeholderFontSize = this.placeholderFontSize;
        sgNode.placeholderFontColor = this.placeholderFontColor;
        sgNode.inputFlag = this.inputFlag;
        sgNode.returnType = this.returnType;
        sgNode.setLineHeight(this.lineHeight);

        if (!this._useOriginalSize) {
            sgNode.setContentSize(this.node.getContentSize());
        }

        sgNode.setDelegate(this);
    },

    _resized: function () {
        this._useOriginalSize = false;
    },

    onLoad: function () {
        this._super();

        this.node.on('size-changed', this._resized, this);
    },

    editBoxEditingDidBegan: function() {
        cc.Component.EventHandler.emitEvents(this.editingDidBegan);
    },

    editBoxEditingDidEnded: function() {
        cc.Component.EventHandler.emitEvents(this.editingDidEnded);
    },

    editBoxTextChanged: function(editBox, text) {
        cc.Component.EventHandler.emitEvents(this.textChanged, text);
    },
});

cc.EditBox = module.exports = EditBox;
