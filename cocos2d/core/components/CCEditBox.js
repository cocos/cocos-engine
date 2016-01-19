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

var KeyboardReturnType = cc.KeyboardReturnType;
var InputMode = _ccsg.EditBox.InputMode;
var InputFlag = _ccsg.EditBox.InputFlag;

/**
 * cc.EditBox is a component for inputing text, you can use it to gather small amounts of text from users.
 * @class EditBox
 * @extends ComponentInSG
 */
var EditBox = cc.Class({
    name: 'cc.EditBox',
    extends: cc._ComponentInSG,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/EditBox',
        inspector: 'app://editor/page/inspector/cceditbox.html',
        executeInEditMode: true,
    },

    properties: {
        _editboxSize: cc.size(300, 200),

        _backgroundSprite: {
            default: null,
            serializable: false,
        },

        _string: '',

        /**
         * Input string of EditBox.
         * @property {String} string
         */
        string: {
            get: function() {
                var sgNode = this._sgNode;
                if (sgNode) {
                    this._string = sgNode.string;
                }
                return this._string;
            },

            set: function (value) {
                this._string = value;

                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.setString(value);
                }
            }
        },

        /**
         * The background image of EditBox.
         * @property {cc.SpriteFrame} backGroundImage
         */
        backgroundImage: {
            default: null,
            type: cc.SpriteFrame,
            notify: function() {
                var sgNode = this._sgNode;
                if (sgNode) {
                    var backgroundSprite = sgNode.getBackgroundSprite();
                    backgroundSprite.setSpriteFrame(this.backgroundImage);
                    backgroundSprite.setContentSize(sgNode.getContentSize());
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
            type: KeyboardReturnType,
            notify: function() {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.returnType = this.returnType;
                }
            }
        },

        /**
         * Set the input flags that are to be applied to the EditBox.
         * @property {EditBox.InputFlag} inputFlag
         * @default InputFlag.INITIAL_CAPS_ALL_CHARACTERS
         */
        inputFlag: {
            default: InputFlag.INITIAL_CAPS_ALL_CHARACTERS,
            type: InputFlag,
            notify: function() {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.inputFlag = this.inputFlag;
                }
            }
        },

        /**
         * Set the input mode of the edit box.
         * If you pass ANY, it will create a multiline EditBox.
         * @property {EditBox.InputMode} inputMode
         * @default InputMode.ANY
         */
        inputMode: {
            default: InputMode.ANY,
            type: InputMode,
            notify: function() {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.inputMode = this.inputMode;
                }
            }
        },

        /**
         * Font size of the input text.
         * @property {Number} fontSize
         */
        fontSize: {
            default: 20,
            notify: function() {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.fontSize = this.fontSize;
                }
            }
        },

        /**
         * Font color of the input text.
         * @property {cc.Color} fontColor
         */
        fontColor: {
            default: cc.Color.WHITE,
            notify: function() {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.fontColor = this.fontColor;
                }
            }
        },

        /**
         * The display text of placeHolder.
         * @property {String} placeHolder
         */
        placeHolder: {
            default: "Enter text here...",
            notify: function() {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.placeHolder = this.placeHolder;
                }
            }
        },

        /**
         * The font size of placeHolder.
         * @property {Number} placeHolderFontSize
         */
        placeHolderFontSize: {
            default: 20,
            notify: function() {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.placeHolderFontSize = this.placeHolderFontSize;
                }
            }
        },

        /**
         * The font color of placeHolder.
         * @property {cc.Color} placeHolderFontColor
         */
        placeHolderFontColor: {
            default: cc.Color.GRAY,
            notify: function() {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.placeHolderFontColor = this.placeHolderFontColor;
                }
            }
        },

        /**
         * The maximize input length of EditBox.
         * @property {Number} maxLength
         */
        maxLength: {
            default: 20,
            notify: function() {
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.maxLength = this.maxLength;
                }
            }
        },

        /**
         * The event handler to be called when EditBox began to edit text.
         * @property {cc.Component.EventHandler} editingDidBegin
         */
        editingDidBegin: {
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
         * @property {cc.Component.EventHandler} editingDidEnd
         */
        editingDidEnd: {
            default: [],
            type: cc.Component.EventHandler,
        }

    },

    statics: {
        KeyboardReturnType: KeyboardReturnType,
        InputFlag, InputFlag,
        InputMode, InputMode
    },

    _createBackgroundSprite: function() {
        if (!this._backgroundSprite) {
            this._backgroundSprite = new cc.Scale9Sprite(this.backgroundImage);
        }
    },

    onLoad: function () {
        this._super();
        this.node.on('size-changed', this._resized, this);


        this.node.setContentSize(this._editboxSize);
    },

    onDestroy: function () {
        this._super();
        this.node.off('size-changed', this._resized, this);
    },
    _createSgNode: function () {
        return new _ccsg.EditBox(cc.size(300,100));
    },

    _initSgNode: function () {
        var sgNode = this._sgNode;

        if (sgNode) {
            this._createBackgroundSprite();
            sgNode.initWithSizeAndBackgroundSprite(this.node.getContentSize(), this._backgroundSprite);
            sgNode.setSize(this.node.getContentSize());

            sgNode.inputMode = this.inputMode;
            sgNode.maxLength = this.maxLength;

            sgNode.string = this._string;
            sgNode.fontSize = this.fontSize;
            sgNode.fontColor = this.fontColor;
            sgNode.placeHolder = this.placeHolder;
            sgNode.placeHolderFontSize = this.placeHolderFontSize;
            sgNode.placeHolderFontColor = this.placeHolderFontColor;
            sgNode.inputFlag = this.inputFlag;
            sgNode.returnType = this.returnType;

            sgNode.setDelegate(this);
        }
    },

    _handleComponentEvent: function (events, text) {
        for (var i = 0, l = events.length; i < l; i++) {
            var event = events[i];
            var target = event.target;
            if (!target) continue;

            var comp = target.getComponent(event.component);
            if (!comp) continue;

            var handler = comp[event.handler];
            if (!handler) continue;
            handler.call(comp, text)
        }
    },

    editBoxEditingDidBegin: function(editbox) {
        var events = this.editingDidBegin;
        this._handleComponentEvent(events);
    },

    editBoxEditingDidEnd: function (editBox) {
        var events = this.editingDidEnd;
        this._handleComponentEvent(events);
    },

    editBoxTextChanged: function (editBox, text) {
        var events = this.textChanged;
        this._handleComponentEvent(events, text);
    },

    _resized: function () {
        var sgNode = this._sgNode;

        if (sgNode) {
            sgNode.setSize(this.node.getContentSize());
        }

        this._editboxSize = this.node.getContentSize();
    }
});

cc.EditBox = module.exports = EditBox;
