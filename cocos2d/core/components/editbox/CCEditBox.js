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

const macro = require('../../platform/CCMacro');
const EditBoxImplBase = require('../editbox/EditBoxImplBase');
const Label = require('../CCLabel');
const Types = require('./types');
const InputMode = Types.InputMode;
const InputFlag = Types.InputFlag;
const KeyboardReturnType = Types.KeyboardReturnType;

function capitalize (string) {
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


/**
 * !#en cc.EditBox is a component for inputing text, you can use it to gather small amounts of text from users.
 * !#zh EditBox 组件，用于获取用户的输入文本。
 * @class EditBox
 * @extends Component
 */
let EditBox = cc.Class({
    name: 'cc.EditBox',
    extends: cc.Component,

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
            get () {
                return this._string;
            },
            set(value) {
                value = '' + value;
                if (this.maxLength >= 0 && value.length >= this.maxLength) {
                    value = value.slice(0, this.maxLength);
                }

                this._string = value;
                this._updateString(value);
            }
        },

        /**
         * !#en The Label component attached to the node for EditBox's input text label
         * !#zh 输入框输入文本节点上挂载的 Label 组件对象
         * @property {Label} textLabel
         */
        textLabel: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.textLabel',
            default: null,
            type: Label,
            notify (oldValue) {
                if (this.textLabel && this.textLabel !== oldValue) {
                    this._updateTextLabel();
                    this._updateLabels();
                }
            },
        },

         /**
         * !en The Label component attached to the node for EditBox's placeholder text label
         * !zh 输入框占位符节点上挂载的 Label 组件对象
         * @property {Label} placeholderLabel
         */
        placeholderLabel: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.placeholderLabel',
            default: null,
            type: Label,
            notify (oldValue) {
                if (this.placeholderLabel && this.placeholderLabel !== oldValue) {
                    this._updatePlaceholderLabel();
                    this._updateLabels();
                }
            },
        },

        /**
         * !#en The Sprite component attached to the node for EditBox's background
         * !#zh 输入框背景节点上挂载的 Sprite 组件对象
         * @property {Sprite} background
         */
        background: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.background',
            default: null,
            type: cc.Sprite,
            notify (oldValue) {
                if (this.background && this.background !== oldValue) {
                    this._updateBackgroundSprite();
                }
            },
        },

        // To be removed in the future
        _N$backgroundImage: {
            default: undefined,
            type: cc.SpriteFrame,
        },

        /**
         * !#en The background image of EditBox. This property will be removed in the future, use editBox.background instead please.
         * !#zh 输入框的背景图片。 该属性会在将来的版本中移除，请用 editBox.background
         * @property {SpriteFrame} backgroundImage
         * @deprecated since v2.1
         */
        backgroundImage: {
            get () {
                // if (!CC_EDITOR) cc.warnID(5400, 'editBox.backgroundImage', 'editBox.background');
                if (!this.background) {
                    return null;
                }
                return this.background.spriteFrame;
            },
            set (value) {
                // if (!CC_EDITOR) cc.warnID(5400, 'editBox.backgroundImage', 'editBox.background');
                if (this.background) {
                    this.background.spriteFrame = value;
                }
            },
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
        },

        // To be removed in the future
        _N$returnType: {
            default: undefined,
            type: cc.Float,
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
            notify () {
                this._updateString(this._string);
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
            notify (oldValue) {
                if (this.inputMode !== oldValue) {
                    this._updateTextLabel();
                    this._updatePlaceholderLabel();
                }
            }
        },

        /**
         * !#en Font size of the input text. This property will be removed in the future, use editBox.textLabel.fontSize instead please.
         * !#zh 输入框文本的字体大小。 该属性会在将来的版本中移除，请使用 editBox.textLabel.fontSize。
         * @property {Number} fontSize
         * @deprecated since v2.1
         */
        fontSize: {
            get () {
                // if (!CC_EDITOR) cc.warnID(5400, 'editBox.fontSize', 'editBox.textLabel.fontSize');
                if (!this.textLabel) {
                    return null;
                }
                return this.textLabel.fontSize;
            },
            set (value) {
                // if (!CC_EDITOR) cc.warnID(5400, 'editBox.fontSize', 'editBox.textLabel.fontSize');
                if (this.textLabel) {
                    this.textLabel.fontSize = value;
                }
            },
        },

        // To be removed in the future
        _N$fontSize: {
            default: undefined,
            type: cc.Float,
        },

        /**
         * !#en Change the lineHeight of displayed text. This property will be removed in the future, use editBox.textLabel.lineHeight instead.
         * !#zh 输入框文本的行高。该属性会在将来的版本中移除，请使用 editBox.textLabel.lineHeight
         * @property {Number} lineHeight
         * @deprecated since v2.1
         */
        lineHeight: {
            get () {
                // if (!CC_EDITOR) cc.warnID(5400, 'editBox.lineHeight', 'editBox.textLabel.lineHeight');
                if (!this.textLabel) {
                    return null;
                }
                return this.textLabel.lineHeight;
            },
            set (value) {
                // if (!CC_EDITOR) cc.warnID(5400, 'editBox.lineHeight', 'editBox.textLabel.lineHeight');
                if (this.textLabel) {
                    this.textLabel.lineHeight = value;
                }
            },
        },

        // To be removed in the future
        _N$lineHeight: {
            default: undefined,
            type: cc.Float,
        },

        /**
         * !#en Font color of the input text. This property will be removed in the future, use editBox.textLabel.node.color instead.
         * !#zh 输入框文本的颜色。该属性会在将来的版本中移除，请使用 editBox.textLabel.node.color
         * @property {Color} fontColor
         * @deprecated since v2.1
         */
        fontColor: {
            get () {
                // if (!CC_EDITOR) cc.warnID(5400, 'editBox.fontColor', 'editBox.textLabel.node.color');
                if (!this.textLabel) {
                    return null;
                }
                return this.textLabel.node.color;
            },
            set (value) {
                // if (!CC_EDITOR) cc.warnID(5400, 'editBox.fontColor', 'editBox.textLabel.node.color');
                if (this.textLabel) {
                    this.textLabel.node.color = value;
                    this.textLabel.node.opacity = value.a;
                }
            },
        },

        // To be removed in the future
        _N$fontColor: undefined,

        /**
         * !#en The display text of placeholder.
         * !#zh 输入框占位符的文本内容。
         * @property {String} placeholder
         */
        placeholder: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.placeholder',
            get () {
                if (!this.placeholderLabel) {
                    return '';
                }
                return this.placeholderLabel.string;
            },
            set (value) {
                if (this.placeholderLabel) {
                    this.placeholderLabel.string = value;
                }
            }
        },

        // To be removed in the future
        _N$placeholder: {
            default: undefined,
            type: cc.String,
        },

        /**
         * !#en The font size of placeholder. This property will be removed in the future, use editBox.placeholderLabel.fontSize instead.
         * !#zh 输入框占位符的字体大小。该属性会在将来的版本中移除，请使用 editBox.placeholderLabel.fontSize
         * @property {Number} placeholderFontSize
         * @deprecated since v2.1
         */
        placeholderFontSize: {
            get () {
                // if (!CC_EDITOR) cc.warnID(5400, 'editBox.placeholderFontSize', 'editBox.placeholderLabel.fontSize');
                if (!this.placeholderLabel) {
                    return null;
                }
                return this.placeholderLabel.fontSize;
            },
            set (value) {
                // if (!CC_EDITOR) cc.warnID(5400, 'editBox.placeholderFontSize', 'editBox.placeholderLabel.fontSize');
                if (this.placeholderLabel) {
                    this.placeholderLabel.fontSize = value;
                }
            },
        },

        // To be removed in the future
        _N$placeholderFontSize: {
            default: undefined,
            type: cc.Float,
        },

        /**
         * !#en The font color of placeholder. This property will be removed in the future, use editBox.placeholderLabel.node.color instead.
         * !#zh 输入框占位符的字体颜色。该属性会在将来的版本中移除，请使用 editBox.placeholderLabel.node.color
         * @property {Color} placeholderFontColor
         * @deprecated since v2.1
         */
        placeholderFontColor: {
            get () {
                // if (!CC_EDITOR) cc.warnID(5400, 'editBox.placeholderFontColor', 'editBox.placeholderLabel.node.color');
                if (!this.placeholderLabel) {
                    return null;
                }
                return this.placeholderLabel.node.color;
            },
            set (value) {
                // if (!CC_EDITOR) cc.warnID(5400, 'editBox.placeholderFontColor', 'editBox.placeholderLabel.node.color');
                if (this.placeholderLabel) {
                    this.placeholderLabel.node.color = value;
                    this.placeholderLabel.node.opacity = value.a;
                }
            },
        },

        // To be removed in the future
        _N$placeholderFontColor: undefined,

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
        },

        // To be removed in the future
        _N$maxLength: {
            default: undefined,
            type: cc.Float,
        },

        /**
         * !#en The input is always visible and be on top of the game view (only useful on Web), this property will be removed on v2.1
         * !zh 输入框总是可见，并且永远在游戏视图的上面（这个属性只有在 Web 上面修改有意义），该属性会在 v2.1 中移除
         * Note: only available on Web at the moment.
         * @property {Boolean} stayOnTop
         * @deprecated since 2.0.8
         */
        stayOnTop: {
            default: false,
            notify () {
                cc.warn('editBox.stayOnTop is removed since v2.1.');
            }
        },

        _tabIndex: 0,

        /**
         * !#en Set the tabIndex of the DOM input element (only useful on Web).
         * !#zh 修改 DOM 输入元素的 tabIndex（这个属性只有在 Web 上面修改有意义）。
         * @property {Number} tabIndex
         */
        tabIndex: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.tab_index',
            get () {
                return this._tabIndex;
            },
            set (value) {
                if (this._tabIndex !== value) {
                    this._tabIndex = value;
                    if (this._impl) {
                        this._impl.setTabIndex(value);
                    }
                }
            }
        },

        /**
         * !#en The event handler to be called when EditBox began to edit text.
         * !#zh 开始编辑文本输入框触发的事件回调。
         * @property {Component.EventHandler[]} editingDidBegan
         */
        editingDidBegan: {
            default: [],
            type: cc.Component.EventHandler,
        },

        /**
         * !#en The event handler to be called when EditBox text changes.
         * !#zh 编辑文本输入框时触发的事件回调。
         * @property {Component.EventHandler[]} textChanged
         */
        textChanged: {
            default: [],
            type: cc.Component.EventHandler,
        },

        /**
         * !#en The event handler to be called when EditBox edit ends.
         * !#zh 结束编辑文本输入框时触发的事件回调。
         * @property {Component.EventHandler[]} editingDidEnded
         */
        editingDidEnded: {
            default: [],
            type: cc.Component.EventHandler,
        },

        /**
         * !#en The event handler to be called when return key is pressed. Windows is not supported.
         * !#zh 当用户按下回车按键时的事件回调，目前不支持 windows 平台
         * @property {Component.EventHandler[]} editingReturn
         */
        editingReturn: {
            default: [],
            type: cc.Component.EventHandler
        }

    },

    statics: {
        _ImplClass: EditBoxImplBase,  // implemented on different platform adapter
        KeyboardReturnType: KeyboardReturnType,
        InputFlag: InputFlag,
        InputMode: InputMode
    },

    _init () {
        this._upgradeComp();

        this._isLabelVisible = true;
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._syncSize, this);

        let impl = this._impl = new EditBox._ImplClass();
        impl.init(this);

        this._updateString(this._string);
        this._syncSize();
    },

    _updateBackgroundSprite () {
        let background = this.background;

        // If background doesn't exist, create one.
        if (!background) {
            let node = this.node.getChildByName('BACKGROUND_SPRITE');
            if (!node) {
                node = new cc.Node('BACKGROUND_SPRITE');
            }
            
            background = node.getComponent(cc.Sprite);
            if (!background) {
                background = node.addComponent(cc.Sprite);
            }
            node.parent = this.node;
            this.background = background;
        }

        // update
        background.type = cc.Sprite.Type.SLICED;
        
        // handle old data
        if (this._N$backgroundImage !== undefined) {
            background.spriteFrame = this._N$backgroundImage;
            this._N$backgroundImage = undefined;
        }
    },

    _updateTextLabel () {
        let textLabel = this.textLabel;

        // If textLabel doesn't exist, create one.
        if (!textLabel) {
            let node = this.node.getChildByName('TEXT_LABEL');
            if (!node) {
                node = new cc.Node('TEXT_LABEL');
            }
            textLabel = node.getComponent(Label);
            if (!textLabel) {
                textLabel = node.addComponent(Label);
            }
            node.parent = this.node;
            this.textLabel = textLabel;
        }

        // update
        textLabel.node.setAnchorPoint(0, 1);
        textLabel.overflow = Label.Overflow.CLAMP;
        if (this.inputMode === InputMode.ANY) {
            textLabel.verticalAlign = macro.VerticalTextAlignment.TOP;
            textLabel.enableWrapText = true;
        }
        else {
            textLabel.verticalAlign = macro.VerticalTextAlignment.CENTER;
            textLabel.enableWrapText = false;
        }
        textLabel.string = this._updateLabelStringStyle(this._string);

        // handle old data
        if (this._N$fontColor !== undefined) {
            textLabel.node.color = this._N$fontColor;
            textLabel.node.opacity = this._N$fontColor.a;
            this._N$fontColor = undefined;
        }
        if (this._N$fontSize !== undefined) {
            textLabel.fontSize = this._N$fontSize;
            this._N$fontSize = undefined;
        }
        if (this._N$lineHeight !== undefined) {
            textLabel.lineHeight = this._N$lineHeight;
            this._N$lineHeight = undefined;
        }
    },

    _updatePlaceholderLabel () {
        let placeholderLabel = this.placeholderLabel;

        // If placeholderLabel doesn't exist, create one.
        if (!placeholderLabel) {
            let node = this.node.getChildByName('PLACEHOLDER_LABEL');
            if (!node) {
                node = new cc.Node('PLACEHOLDER_LABEL');
            }
            placeholderLabel = node.getComponent(Label);
            if (!placeholderLabel) {
                placeholderLabel = node.addComponent(Label);
            }
            node.parent = this.node;
            this.placeholderLabel = placeholderLabel;
        }

        // update
        placeholderLabel.node.setAnchorPoint(0, 1);
        placeholderLabel.overflow = Label.Overflow.CLAMP;
        if (this.inputMode === InputMode.ANY) {
            placeholderLabel.verticalAlign = macro.VerticalTextAlignment.TOP;
            placeholderLabel.enableWrapText = true;
        }
        else {
            placeholderLabel.verticalAlign = macro.VerticalTextAlignment.CENTER;
            placeholderLabel.enableWrapText = false;
        }
        placeholderLabel.string = this.placeholder;

        // handle old data
        if (this._N$placeholderFontColor !== undefined) {
            placeholderLabel.node.color = this._N$placeholderFontColor;
            placeholderLabel.node.opacity = this._N$placeholderFontColor.a;
            this._N$placeholderFontColor = undefined;
        }
        if (this._N$placeholderFontSize !== undefined) {
            placeholderLabel.fontSize = this._N$placeholderFontSize;
            this._N$placeholderFontSize = undefined;
        }
    },

    _upgradeComp () {
        if (this._N$returnType !== undefined) {
            this.returnType = this._N$returnType;
            this._N$returnType = undefined;
        }
        if (this._N$maxLength !== undefined) {
            this.maxLength = this._N$maxLength;
            this._N$maxLength = undefined;
        }
        if (this._N$backgroundImage !== undefined) {
            this._updateBackgroundSprite();
        }
        if (this._N$fontColor !== undefined || this._N$fontSize !== undefined || this._N$lineHeight !== undefined) {
            this._updateTextLabel();
        }
        if (this._N$placeholderFontColor !== undefined || this._N$placeholderFontSize !== undefined) {
            this._updatePlaceholderLabel();
        }
        if (this._N$placeholder !== undefined) {
            this.placeholder = this._N$placeholder;
            this._N$placeholder = undefined;
        }
    },

    _syncSize () {
        if (this._impl) {
            let size = this.node.getContentSize();
            this._impl.setSize(size.width, size.height);
        }
    },

    _showLabels () {
        this._isLabelVisible = true;
        this._updateLabels();
    },

    _hideLabels () {
        this._isLabelVisible = false;
        if (this.textLabel) {
            this.textLabel.node.active = false;
        }
        if (this.placeholderLabel) {
            this.placeholderLabel.node.active = false;
        }
    },

    _updateLabels () {
        if (this._isLabelVisible) {
            let content = this._string;
            if (this.textLabel) {
                this.textLabel.node.active = (content !== '');
            }
            if (this.placeholderLabel) {
                this.placeholderLabel.node.active = (content === '');
            }
        }
    },

    _updateString (text) {
        let textLabel = this.textLabel;
        // Not inited yet
        if (!textLabel) {
            return;
        }

        let displayText = text;
        if (displayText) {
            displayText = this._updateLabelStringStyle(displayText);
        }

        textLabel.string = displayText;

        this._updateLabels();
    },

    _updateLabelStringStyle (text, ignorePassword) {
        let inputFlag = this.inputFlag;
        if (!ignorePassword && inputFlag === InputFlag.PASSWORD) {
            let passwordString = '';
            let len = text.length;
            for (let i = 0; i < len; ++i) {
                passwordString += '\u25CF';
            }
            text = passwordString;
        } 
        else if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
            text = text.toUpperCase();
        }
        else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
            text = capitalize(text);
        }
        else if (inputFlag === InputFlag.INITIAL_CAPS_SENTENCE) {
            text = capitalizeFirstLetter(text);
        }

        return text;
    },

    editBoxEditingDidBegan () {
        cc.Component.EventHandler.emitEvents(this.editingDidBegan, this);
        this.node.emit('editing-did-began', this);
    },

    editBoxEditingDidEnded () {
        cc.Component.EventHandler.emitEvents(this.editingDidEnded, this);
        this.node.emit('editing-did-ended', this);
    },

    editBoxTextChanged (text) {
        text = this._updateLabelStringStyle(text, true);
        this.string = text;
        cc.Component.EventHandler.emitEvents(this.textChanged, text, this);
        this.node.emit('text-changed', this);
    },

    editBoxEditingReturn() {
        cc.Component.EventHandler.emitEvents(this.editingReturn, this);
        this.node.emit('editing-return', this);
    },

    onEnable () {
        if (!CC_EDITOR) {
            this._registerEvent();
        }
        if (this._impl) {
            this._impl.enable();
        }
    },

    onDisable () {
        if (!CC_EDITOR) {
            this._unregisterEvent();
        }
        if (this._impl) {
            this._impl.disable();
        }
    },

    onDestroy () {
        if (this._impl) {
            this._impl.clear();
        }
    },

    __preload () {
        this._init();
    },

    _registerEvent () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    },

    _unregisterEvent () {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    },

    _onTouchBegan (event) {
        event.stopPropagation();
    },

    _onTouchCancel (event) {
        event.stopPropagation();
    },

    _onTouchEnded (event) {
        if (this._impl) {
            this._impl.beginEditing();
        }
        event.stopPropagation();
    },

    /**
     * !#en Let the EditBox get focus, this method will be removed on v2.1
     * !#zh 让当前 EditBox 获得焦点, 这个方法会在 v2.1 中移除
     * @method setFocus
     * @deprecated since 2.0.8
     */
    setFocus () {
        cc.warnID(1400, 'setFocus()', 'focus()');
        if (this._impl) {
            this._impl.setFocus(true);
        }
    },

    /**
     * !#en Let the EditBox get focus
     * !#zh 让当前 EditBox 获得焦点
     * @method focus
     */
    focus () {
        if (this._impl) {
            this._impl.setFocus(true);
        }
    },

    /**
     * !#en Let the EditBox lose focus
     * !#zh 让当前 EditBox 失去焦点
     * @method blur
     */
    blur () {
        if (this._impl) {
            this._impl.setFocus(false);
        }
    },

    /**
     * !#en Determine whether EditBox is getting focus or not.
     * !#zh 判断 EditBox 是否获得了焦点
     * @method isFocused
     */
    isFocused () {
        if (this._impl) {
            return this._impl.isFocused();
        }
        else {
            return false;
        }
    },

    update () {
        if (this._impl) {
            this._impl.update();
        }
    }

});

cc.EditBox = module.exports = EditBox;

if (cc.sys.isBrowser) {
    require('./WebEditBoxImpl');
}

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-did-began
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-did-ended
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event text-changed
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-return
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
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
 * @return {Boolean} whether it is the first time the destroy being called
 */