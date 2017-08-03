/*global _ccsg */

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
require('../editbox/CCSGEditBox');
/**
 * !#en Enum for keyboard return types
 * !#zh 键盘的返回键类型
 * @readonly
 * @enum EditBox.KeyboardReturnType
 */
/**
 * !#en TODO
 * !#zh 默认
 * @property {Number} DEFAULT
 */
/**
 * !#en TODO
 * !#zh 完成类型
 * @property {Number} DONE
 */
/**
 * !#en TODO
 * !#zh 发送类型
 * @property {Number} SEND
 */
/**
 * !#en TODO
 * !#zh 搜索类型
 * @property {Number} SEARCH
 */
/**
 * !#en TODO
 * !#zh 跳转类型
 * @property {Number} GO
 */
var KeyboardReturnType = _ccsg.EditBox.KeyboardReturnType;

/**
 * !#en The EditBox's InputMode defines the type of text that the user is allowed to enter.
 * !#zh 输入模式
 * @readonly
 * @enum EditBox.InputMode
 */
/**
 * !#en TODO
 * !#zh 用户可以输入任何文本，包括换行符。
 * @property {Number} ANY
 */
/**
 * !#en The user is allowed to enter an e-mail address.
 * !#zh 允许用户输入一个电子邮件地址。
 * @property {Number} EMAIL_ADDR
 */
/**
 * !#en The user is allowed to enter an integer value.
 * !#zh 允许用户输入一个整数值。
 * @property {Number} NUMERIC
 */
/**
 * !#en The user is allowed to enter a phone number.
 * !#zh 允许用户输入一个电话号码。
 * @property {Number} PHONE_NUMBER
 */
/**
 * !#en The user is allowed to enter a URL.
 * !#zh 允许用户输入一个 URL。
 * @property {Number} URL
 */
/**
 * !#en
 * The user is allowed to enter a real number value.
 * This extends kEditBoxInputModeNumeric by allowing a decimal point.
 * !#zh
 * 允许用户输入一个实数。
 * @property {Number} DECIMAL
 */
/**
 * !#en The user is allowed to enter any text, except for line breaks.
 * !#zh 除了换行符以外，用户可以输入任何文本。
 * @property {Number} SINGLE_LINE
 */
var InputMode = _ccsg.EditBox.InputMode;

/**
 * !#en Enum for the EditBox's input flags
 * !#zh 定义了一些用于设置文本显示和文本格式化的标志位。
 * @readonly
 * @enum EditBox.InputFlag
 */
/**
 * !#en
 * Indicates that the text entered is confidential data that should be
 * obscured whenever possible. This implies EDIT_BOX_INPUT_FLAG_SENSITIVE.
 * !#zh
 * 表明输入的文本是保密的数据，任何时候都应该隐藏起来，它隐含了 EDIT_BOX_INPUT_FLAG_SENSITIVE。
 * @property {Number} PASSWORD
 */
/**
 * !#en
 * Indicates that the text entered is sensitive data that the
 * implementation must never store into a dictionary or table for use
 * in predictive, auto-completing, or other accelerated input schemes.
 * A credit card number is an example of sensitive data.
 * !#zh
 * 表明输入的文本是敏感数据，它禁止存储到字典或表里面，也不能用来自动补全和提示用户输入。
 * 一个信用卡号码就是一个敏感数据的例子。
 * @property {Number} SENSITIVE
 */
/**
 * !#en
 * This flag is a hint to the implementation that during text editing,
 * the initial letter of each word should be capitalized.
 * !#zh
 *  这个标志用来指定在文本编辑的时候，是否把每一个单词的首字母大写。
 * @property {Number} INITIAL_CAPS_WORD
 */
/**
 * !#en
 * This flag is a hint to the implementation that during text editing,
 * the initial letter of each sentence should be capitalized.
 * !#zh
 * 这个标志用来指定在文本编辑是否每个句子的首字母大写。
 * @property {Number} INITIAL_CAPS_SENTENCE
 */
/**
 * !#en Capitalize all characters automatically.
 * !#zh 自动把输入的所有字符大写。
 * @property {Number} INITIAL_CAPS_ALL_CHARACTERS
 */
var InputFlag = _ccsg.EditBox.InputFlag;

/**
 * !#en cc.EditBox is a component for inputing text, you can use it to gather small amounts of text from users.
 * !#zh EditBox 组件，用于获取用户的输入文本。
 * @class EditBox
 * @extends _RendererUnderSG
 */
var EditBox = cc.Class({
    name: 'cc.EditBox',
    extends: cc._RendererUnderSG,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/EditBox',
        inspector: 'packages://inspector/inspectors/comps/cceditbox.js',
        help: 'i18n:COMPONENT.help_url.editbox',
        executeInEditMode: true,
    },

    properties: {
        _useOriginalSize: true,
        _string: '',
        /**
         * !#en Input string of EditBox.
         * !#zh 输入框的初始输入内容，如果为空则会显示占位符的文本。
         * @property {String} string
         */
        string: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.string',
            get: function () {
                return this._sgNode.string;
            },
            set: function(value) {
                this._sgNode.string = this._string = value;
            }
        },

        /**
         * !#en The background image of EditBox.
         * !#zh 输入框的背景图片
         * @property {SpriteFrame} backgroundImage
         */
        backgroundImage: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.backgroundImage',
            default: null,
            type: cc.SpriteFrame,
            notify: function() {
                var sgNode = this._sgNode;
                var backgroundSprite = sgNode.getBackgroundSprite();
                if(this.backgroundImage) {
                    var sprite = this._createBackgroundSprite();
                    sprite.setContentSize(sgNode.getContentSize());
                }
                else {
                    backgroundSprite.removeFromParent();
                }
            }
        },

        /**
         * !#en
         * The return key type of EditBox.
         * Note: it is meaningless for web platforms and desktop platforms.
         * !#zh
         * 指定移动设备上面回车按钮的样式。
         * 注意：这个选项对 web 平台与 desktop 平台无效。
         * @property {EditBox.KeyboardReturnType} returnType
         * @default KeyboardReturnType.DEFAULT
         */
        returnType: {
            default: KeyboardReturnType.DEFAULT,
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.returnType',
            displayName: 'KeyboardReturnType',
            type: KeyboardReturnType,
            notify: function() {
                this._sgNode.returnType = this.returnType;
            }
        },

        /**
         * !#en Set the input flags that are to be applied to the EditBox.
         * !#zh 指定输入标志位，可以指定输入方式为密码或者单词首字母大写。
         * @property {EditBox.InputFlag} inputFlag
         * @default InputFlag.DEFAULT
         */
        inputFlag: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.input_flag',
            default: InputFlag.DEFAULT,
            type: InputFlag,
            notify: function() {
                this._sgNode.inputFlag = this.inputFlag;
            }
        },
        /**
         * !#en
         * Set the input mode of the edit box.
         * If you pass ANY, it will create a multiline EditBox.
         * !#zh
         * 指定输入模式: ANY表示多行输入，其它都是单行输入，移动平台上还可以指定键盘样式。
         * @property {EditBox.InputMode} inputMode
         * @default InputMode.ANY
         */
        inputMode: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.input_mode',
            default: InputMode.ANY,
            type: InputMode,
            notify: function() {
                this._sgNode.inputMode = this.inputMode;
            }
        },

        /**
         * !#en Font size of the input text.
         * !#zh 输入框文本的字体大小
         * @property {Number} fontSize
         */
        fontSize: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.font_size',
            default: 20,
            notify: function() {
                this._sgNode.fontSize = this.fontSize;
            }
        },

        /**
         * !#en Change the lineHeight of displayed text.
         * !#zh 输入框文本的行高。
         * @property {Number} lineHeight
         */
        lineHeight: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.line_height',
            default: 40,
            notify: function() {
                this._sgNode.setLineHeight(this.lineHeight);
            }
        },

        /**
         * !#en Font color of the input text.
         * !#zh 输入框文本的颜色。
         * @property {Color} fontColor
         */
        fontColor: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.font_color',
            default: cc.Color.WHITE,
            notify: function() {
                this._sgNode.fontColor = this.fontColor;
            }
        },

        /**
         * !#en The display text of placeholder.
         * !#zh 输入框占位符的文本内容。
         * @property {String} placeholder
         */
        placeholder: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.placeholder',
            default: 'Enter text here...',
            notify: function() {
                this._sgNode.placeholder = this.placeholder;
            }
        },

        /**
         * !#en The font size of placeholder.
         * !#zh 输入框占位符的字体大小。
         * @property {Number} placeholderFontSize
         */
        placeholderFontSize: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.placeholder_font_size',
            default: 20,
            notify: function() {
                this._sgNode.placeholderFontSize = this.placeholderFontSize;
            }
        },

        /**
         * !#en The font color of placeholder.
         * !#zh 输入框最大允许输入的字符个数。
         * @property {Color} placeholderFontColor
         */
        placeholderFontColor: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.placeholder_font_color',
            default: cc.Color.GRAY,
            notify: function() {
                this._sgNode.placeholderFontColor = this.placeholderFontColor;
            }
        },

        /**
         * !#en The maximize input length of EditBox.
         * - If pass a value less than 0, it won't limit the input number of characters.
         * - If pass 0, it doesn't allow input any characters.
         * !#zh 输入框最大允许输入的字符个数。
         * - 如果值为小于 0 的值，则不会限制输入字符个数。
         * - 如果值为 0，则不允许用户进行任何输入。
         * @property {Number} maxLength
         */
        maxLength: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.max_length',
            default: 20,
            notify: function() {
                this._sgNode.maxLength = this.maxLength;
            }
        },

        /**
         * !#en The input is always visible and be on top of the game view.
         * !zh 输入框总是可见，并且永远在游戏视图的上面
         * Note: only available on Web at the moment.
         * @property {Boolean} stayOnTop
         */
        stayOnTop: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.stay_on_top',
            default: false,
            notify: function () {
                if(!CC_JSB) {
                    this._sgNode.stayOnTop(this.stayOnTop);
                    this._sgNode.fontSize = this.fontSize;
                    this._sgNode.fontColor = this.fontColor;
                }
            }
        },

        _tabIndex: 0,

        /**
         * !#en Set the tabIndex of the DOM input element, only useful on Web.
         * !#zh 修改 DOM 输入元素的 tabIndex，这个属性只有在 Web 上面修改有意义。
         * @property {Number} tabIndex
         */
        tabIndex: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.tab_index',
            get: function () {
                return this._tabIndex;
            },
            set: function (value) {
                this._tabIndex = value;
                this._sgNode.setTabIndex(value);
            }
        },

        /**
         * !#en The event handler to be called when EditBox began to edit text.
         * !#zh 开始编辑文本输入框触发的事件回调。
         * @property {Component.EventHandler} editingDidBegan
         */
        editingDidBegan: {
            default: [],
            type: cc.Component.EventHandler,
        },

        /**
         * !#en The event handler to be called when EditBox text changes.
         * !#zh 编辑文本输入框时触发的事件回调。
         * @property {Component.EventHandler} textChanged
         */
        textChanged: {
            default: [],
            type: cc.Component.EventHandler,
        },

        /**
         * !#en The event handler to be called when EditBox edit ends.
         * !#zh 结束编辑文本输入框时触发的事件回调。
         * @property {Component.EventHandler} editingDidEnded
         */
        editingDidEnded: {
            default: [],
            type: cc.Component.EventHandler,
        },

        /**
         * !#en The event handler to be called when return key is pressed. Windows is not supported.
         * !#zh 当用户按下回车按键时的事件回调，目前不支持 windows 平台
         * @property {Component.EventHandler} editingReturn
         */
        editingReturn: {
            default: [],
            type: cc.Component.EventHandler
        }

    },

    statics: {
        KeyboardReturnType: KeyboardReturnType,
        InputFlag: InputFlag,
        InputMode: InputMode
    },

    _applyCapInset: function (sprite) {
        var backgroundImage = this.backgroundImage;
        sprite.setInsetTop(backgroundImage.insetTop);
        sprite.setInsetBottom(backgroundImage.insetBottom);
        sprite.setInsetRight(backgroundImage.insetRight);
        sprite.setInsetLeft(backgroundImage.insetLeft);
    },

    _createSgNode: function() {
        return new _ccsg.EditBox(cc.size(160, 40));
    },

    _createBackgroundSprite: function() {
        var sgNode = this._sgNode;
        var bgSprite = new cc.Scale9Sprite();
        bgSprite.setRenderingType(cc.Scale9Sprite.RenderingType.SLICED);
        if (this.backgroundImage) {
            this.backgroundImage.ensureLoadTexture();
            bgSprite.setSpriteFrame(this.backgroundImage);
            this._applyCapInset(bgSprite);
        }
        sgNode.initWithSizeAndBackgroundSprite(cc.size(160, 40), bgSprite);
        return bgSprite;
    },

    _initSgNode: function() {
        var sgNode = this._sgNode;
        if(!CC_JSB) {
            sgNode.createDomElementIfNeeded();
        }

        this._createBackgroundSprite();

        if (CC_EDITOR && this._useOriginalSize) {
            this.node.setContentSize(sgNode.getContentSize());
            this._useOriginalSize = false;
        } else {
            sgNode.setContentSize(this.node.getContentSize());
        }

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
        sgNode.stayOnTop(this.stayOnTop);
        sgNode.setTabIndex(this.tabIndex);

        sgNode.setDelegate(this);
    },

    editBoxEditingDidBegan: function() {
        cc.Component.EventHandler.emitEvents(this.editingDidBegan, this);
        this.node.emit('editing-did-began', this);
    },

    editBoxEditingDidEnded: function() {
        cc.Component.EventHandler.emitEvents(this.editingDidEnded, this);
        this.node.emit('editing-did-ended', this);
    },

    editBoxTextChanged: function(editBox, text) {
        cc.Component.EventHandler.emitEvents(this.textChanged, text, this);
        this.node.emit('text-changed', this);
    },

    editBoxEditingReturn: function() {
        cc.Component.EventHandler.emitEvents(this.editingReturn, this);
        this.node.emit('editing-return', this);
    },

    __preload: function() {
        this._super();

        if (!CC_EDITOR) {
            this._registerEvent();
        }
    },

    _registerEvent: function () {
        if(!CC_JSB) {
            this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        }
    },

    _onTouchBegan: function(event) {
        if (this._sgNode) {
            this._sgNode._onTouchBegan(event.touch);
        }
        event.stopPropagation();
    },

    _onTouchEnded: function(event) {
        if (this._sgNode) {
            this._sgNode._onTouchEnded();
        }
        event.stopPropagation();
    },

    /**
     * !#en Let the EditBox get focus, only valid when stayOnTop is true.
     * !#zh 让当前 EditBox 获得焦点，只有在 stayOnTop 为 true 的时候设置有效
     * Note: only available on Web at the moment.
     * @method setFocus
     */
    setFocus: function() {
        if(this._sgNode) {
            this._sgNode.setFocus();
        }
    },

    /**
     * !#en Determine whether EditBox is getting focus or not.
     * !#zh 判断 EditBox 是否获得了焦点
     * Note: only available on Web at the moment.
     * @method isFocused
     */
    isFocused: function () {
        var isFocused = false;
        if (this._sgNode) {
            isFocused = this._sgNode.isFocused();
        }
        return isFocused;
    }

});

if(CC_JSB) {
    EditBox.prototype.editBoxEditingDidBegin = function (sender) {
        this.editBoxEditingDidBegan(sender);
    };

    EditBox.prototype.editBoxEditingDidEnd = function (sender) {
        this.editBoxEditingDidEnded(sender);
    };
}

cc.EditBox = module.exports = EditBox;

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-did-began
 * @param {Event.EventCustom} event
 * @param {EditBox} event.detail - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-did-ended
 * @param {Event.EventCustom} event
 * @param {EditBox} event.detail - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event text-changed
 * @param {Event.EventCustom} event
 * @param {EditBox} event.detail - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-return
 * @param {Event.EventCustom} event
 * @param {EditBox} event.detail - The EditBox component.
 */

/**
 * !#en if you don't need the EditBox and it isn't in any running Scene, you should
 * call the destroy method on this component or the associated node explicitly.
 * Otherwise, the created DOM element won't be removed from web page.
 * !#zh
 * 如果你不再使用 EditBox，并且组件未添加到场景中，那么你必须手动对组件或所在节点调用 destroy。
 * 这样才能移除网页上的 DOM 节点，避免 Web 平台内存泄露。
 * @example
 * editbox.node.parent = null;  // or  editbox.node.removeFromParent(false);
 * // when you don't need editbox anymore
 * editbox.node.destroy();
 * @method destroy
 */
