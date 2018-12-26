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
const EditBoxImpl = require('../editbox/CCEditBoxImpl');
const Label = require('../CCLabel');
const EditBoxLabel = require('./EditBoxLabel');
const Types = require('./types');
const InputMode = Types.InputMode;
const InputFlag = Types.InputFlag;
const KeyboardReturnType = Types.KeyboardReturnType;

const LEFT_PADDING = 2;

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
                if (this.maxLength >= 0 && value.length >= this.maxLength) {
                    value = value.slice(0, this.maxLength);
                }

                this._string = value;
                if (this._impl) {
                    this._updateString(value);
                }
            }
        },

        _backgroundImage: {
            type: cc.SpriteFrame,
            default: undefined,
            formerlySerializedAs: '_N$backgroundImage',
        },

        /**
         * !#en The background image of EditBox.
         * !#zh 输入框的背景图片
         * @property {SpriteFrame} background
         */
        background: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.background',
            default: null,
            type: cc.Sprite,
        },

        /**
         * !#en The text label of EditBox.
         * !#zh 输入框输入文本的标签
         * @property {Label} textLabel
         */
        textLabel: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.textLabel',
            default: null,
            type: EditBoxLabel,
            notify () {
                if (this.textLabel) {
                    this.textLabel.string = this.string;
                }
                this._updateStayOnTop();
            },
        },

        /**
         * !en The placeholder label of EditBox.
         * !zh 输入框占位符的标签
         * @property {Label} placeholderLabel
         */
        placeholderLabel: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.placeholderLabel',
            default: null,
            type: EditBoxLabel,
            notify () {
                if (this.placeholderLabel) {
                    this.placeholderLabel.string = this.placeholder;
                }
                this._updateStayOnTop();
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
            notify () {
                if (this._impl) {
                    this._impl.returnType = this.returnType;
                }
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
            notify () {
                if (this._impl) {
                    this._impl.setInputFlag(this.inputFlag);
                    this._updateString(this._string);
                }
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
            notify () {
                if (this._impl) {
                    this._impl.setInputMode(this.inputMode);
                }
                if (this.inputMode === InputMode.ANY) {
                    this.textLabel && (this.textLabel.verticalAlign = Label.VerticalAlign.TOP);
                    this.placeholderLabel && (this.placeholderLabel.verticalAlign = Label.VerticalAlign.TOP);
                }
                else {
                    this.textLabel && (this.textLabel.verticalAlign = Label.VerticalAlign.CENTER);
                    this.placeholderLabel && (this.placeholderLabel.verticalAlign = Label.VerticalAlign.CENTER);
                }
            }
        },

        _fontSize: {
            type: cc.Float,
            default: undefined,
            formerlySerializedAs: '_N$fontSize',
        },

        _lineHeight: {
            type: cc.Float,
            default: undefined,
            formerlySerializedAs: '_N$lineHeight',
        },

        _fontColor: {
            default: undefined,
            formerlySerializedAs: '_N$fontColor',
        },

        /**
         * !#en The display text of placeholder.
         * !#zh 输入框占位符的文本内容。
         * @property {String} placeholder
         */
        placeholder: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.placeholder',
            default: 'Enter text here...',
            notify () {
                if (this.placeholderLabel) {
                    this.placeholderLabel.string = this.placeholder;
                }
                if (this._impl) {
                    this._impl.setPlaceholderText(this.placeholder);
                }
            }
        },

        _placeholderFontSize: {
            type: cc.Float,
            default: undefined,
            formerlySerializedAs: '_N$placeholderFontSize',
        },

        _placeholderFontColor: {
            default: undefined,
            formerlySerializedAs: '_N$placeholderFontColor',
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
            notify () {
                if (this._impl) {
                    this._impl.setMaxLength(this.maxLength);
                }
            }
        },

        /**
         * !#en The input is always visible and be on top of the game view (only useful on Web).
         * !zh 输入框总是可见，并且永远在游戏视图的上面（这个属性只有在 Web 上面修改有意义）
         * Note: only available on Web at the moment.
         * @property {Boolean} stayOnTop
         */
        stayOnTop: {
            tooltip: CC_DEV && 'i18n:COMPONENT.editbox.stay_on_top',
            default: false,
            notify () {
                if (this._impl) {
                    this._updateStayOnTop();
                }
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
                this._tabIndex = value;
                if (this._impl) {
                    this._impl.setTabIndex(value);
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
        _EditBoxImpl: EditBoxImpl,
        KeyboardReturnType: KeyboardReturnType,
        InputFlag: InputFlag,
        InputMode: InputMode
    },

    // to be deprecated in the future
    _upgradeComponent () {
        // whether need to create background
        if (this._backgroundImage) {
            this._createBackgroundSprite();
            this.background.spriteFrame = this._backgroundImage;
            this._backgroundImage = undefined;
        }

        // whether need to create textLabel
        if (this._fontSize || this._fontColor || this._lineHeight) {
            this._createTextLabel();
            if (this._fontSize) {
                this.textLabel.fontSize = this._fontSize;
                this._fontSize = undefined;
            }
            if (this._fontColor) {
                this.textLabel.node.color = this._fontColor;
                this._fontColor = undefined;
            }
            if (this._lineHeight) {
                this.textLabel.lineHeight = this._lineHeight;
                this._lineHeight = undefined;
            }
        }

        // whether need to create placeholderLabel
        if (this._placeholderFontSize || this._placeholderFontColor) {
            this._createPlaceholderLabel();
            if (this._placeholderFontSize) {
                this.placeholderLabel.fontSize = this._placeholderFontSize;
                this._placeholderFontSize = undefined;
            }
            if (this._placeholderFontColor) {
                this.placeholderLabel.node.color = this._placeholderFontColor;
                this._placeholderFontColor = undefined;
            }
        }
    },

    _init () {
        if (CC_EDITOR) {
            this._upgradeComponent();
        }
        let impl = this._impl = new EditBoxImpl();
        let size = this.node.getContentSize();

        impl.setDelegate(this);
        impl.setNode(this.node);
        impl.setInputMode(this.inputMode);
        impl.setMaxLength(this.maxLength);
        impl.setInputFlag(this.inputFlag);
        impl.setReturnType(this.returnType);
        impl.setTabIndex(this.tabIndex);
        impl.setPlaceholderText(this.placeholder);
        impl.setSize(size.width, size.height);
        impl.updateDomTextLabel(this.textLabel);
        impl.updateDomPlaceholderLabel(this.placeholderLabel);

        this._updateStayOnTop();
        this._updateString(this.string);
        
        this._syncSize();
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._syncSize, this);
        this._initLabelEvent();
    },

    _initLabelEvent () {
        let textLabel = this.textLabel, placeholderLabel = this.placeholderLabel;
        let self = this;
        if (textLabel && this._impl) {
            textLabel.node.on('string-changed', function () {
                self.string = textLabel.string;
            });
            textLabel.node.on('font-changed', function () {
                self._impl.setTextLabelFont(textLabel.font);
            });
            textLabel.node.on('color-changed', function () {
                self._impl.setTextLabelFontColor(textLabel.node.color);
            });
            textLabel.node.on('fontSize-changed', function () {
                self._impl.setTextLabelFontSize(textLabel.fontSize);
            });
            textLabel.node.on('lineHeight-changed', function () {
                self._impl.setTextLabelLineHeight(textLabel.lineHeight);
            });
            textLabel.node.on('horizontalAlign-changed', function () {
                self._impl.setTextLabelHorizontalAlign(textLabel.horizontalAlign);
            });
        }
        if (placeholderLabel) {
            placeholderLabel.node.on('string-changed', function () {
                self.placeholder = placeholderLabel.string;
                self._impl.setPlaceholderText(placeholderLabel.string);
            });
            placeholderLabel.node.on('font-changed', function () {
                self._impl.updateDomPlaceholderLabel(placeholderLabel);
            });
            placeholderLabel.node.on('color-changed', function () {
                self._impl.updateDomPlaceholderLabel(placeholderLabel);
            });
            placeholderLabel.node.on('fontSize-changed', function () {
                self._impl.updateDomPlaceholderLabel(placeholderLabel);
            });
            placeholderLabel.node.on('lineHeight-changed', function () {
                self._impl.updateDomPlaceholderLabel(placeholderLabel);
            });
            placeholderLabel.node.on('horizontalAlign-changed', function () {
                self._impl.updateDomPlaceholderLabel(placeholderLabel);
            });
        }
    },

    _updateStayOnTop () {
        if (this.stayOnTop) {
            this._hideLabels();
        }
        else {
            this._showLabels();
        }
        this._impl && this._impl.stayOnTop(this.stayOnTop);
    },

    _syncSize () {
        let size = this.node.getContentSize();
        
        if (this.background) {
            this.background.node.setAnchorPoint(this.node.getAnchorPoint());
            this.background.node.setContentSize(size);
        }

        this._updateLabelPosition(size);
        this._impl && this._impl.setSize(size.width, size.height);
    },

    _updateLabelPosition (size) {
        let node = this.node;
        let offx = -node.anchorX * node.width;
        let offy = -node.anchorY * node.height;

        let placeholderLabel = this.placeholderLabel;
        let textLabel = this.textLabel;

        if (textLabel) {
            textLabel.node.setContentSize(size.width - LEFT_PADDING, size.height);
            textLabel.node.setPosition(offx + LEFT_PADDING, offy + size.height);
        }

        if (placeholderLabel) {
            placeholderLabel.node.setContentSize(size.width - LEFT_PADDING, size.height);
            placeholderLabel.node.setPosition(offx + LEFT_PADDING, offy + size.height);
        }
    },

    // to be deprecated in the future
    _createBackgroundSprite () {
        let background = this.background;
        if (!background) {
            let node = this.node.getChildByName('BACKGROUND_SPRITE');
            if (!node) {
                node = new cc.Node('BACKGROUND_SPRITE');
            }
            
            background = node.getComponent(cc.Sprite);
            if (!background) {
                background = node.addComponent(cc.Sprite);
            }
            background.type = cc.Sprite.Type.SLICED;

            node.parent = this.node;
            this.background = background;
        }
    },

    _createLabelNode (name) {
        let node = this.node.getChildByName(name);
        if (!node) {
            node = new cc.Node(name);
        }

        let labelComp = node.getComponent(Label);
        if (!labelComp) {
            labelComp = node.addComponent(EditBoxLabel);
        }
        // convert Label to EditBoxLabel
        else if (!(labelComp instanceof EditBoxLabel)) {
            if (CC_EDITOR) {
                node.removeFromParent();
                node = new cc.Node(name);
            }
            else {
                node.removeComponent(Label);
            }
            labelComp = node.addComponent(EditBoxLabel);
        }

        node.color = cc.Color.WHITE;  // default font color
        node.parent = this.node;
        node.setAnchorPoint(0, 1);
        return node;
    },

    // to be deprecated in the future
    _createTextLabel () {
        if (!this.textLabel) {
            let node = this._createLabelNode('TEXT_LABEL');
            textLabel = node.getComponent(EditBoxLabel);
            // set default value
            textLabel.overflow = Label.Overflow.CLAMP;
            textLabel.fontSize = 20;
            textLabel.lineHeight = 40;
            textLabel.string = this.string;
            if (this.inputMode === InputMode.ANY) {
                textLabel.verticalAlign = Label.VerticalAlign.TOP;
            }
            else {
                textLabel.verticalAlign = Label.VerticalAlign.CENTER;
            }
            this.textLabel = textLabel;
        }
    },
    
    // to be deprecated in the future
    _createPlaceholderLabel () {
        if (!this.placeholderLabel) {
            let node = this._createLabelNode('PLACEHOLDER_LABEL');
            let placeholderLabel = node.getComponent(EditBoxLabel);
            // set default value
            placeholderLabel.overflow = Label.Overflow.CLAMP;
            placeholderLabel.fontSize = 20;
            placeholderLabel.lineHeight = 40;
            placeholderLabel.string = this.placeholder;
            if (this.inputMode === InputMode.ANY) {
                placeholderLabel.verticalAlign = Label.VerticalAlign.TOP;
            }
            else {
                placeholderLabel.verticalAlign = Label.VerticalAlign.CENTER;
            }
            this.placeholderLabel = placeholderLabel;
        }
    },

    _showLabels () {
        let displayText = this.string;
        if (this.textLabel) {
            this.textLabel.node.active = displayText !== '';
        }
        if (this.placeholderLabel) {
            this.placeholderLabel.node.active = displayText === '';
        }
    },

    _hideLabels () {
        if (this.textLabel) {
            this.textLabel.node.active = false;
        }
        if (this.placeholderLabel) {
            this.placeholderLabel.node.active = false;
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
        this._impl && this._impl.setString(text);
        if (!this._impl._editing && !this.stayOnTop) {
            this._showLabels();
        }
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
        this._hideLabels();
        cc.Component.EventHandler.emitEvents(this.editingDidBegan, this);
        this.node.emit('editing-did-began', this);
    },

    editBoxEditingDidEnded () {
        if (!this.stayOnTop) {
            this._showLabels();
        }
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

    onDestroy () {
        this._impl.clear();

        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._syncSize, this);
        
        let textLabel = this.textLabel, placeholderLabel = this.placeholderLabel;
        if (textLabel) {
            textLabel.node.off('string-changed');
            textLabel.node.off('font-changed');
            textLabel.node.off('color-changed');
            textLabel.node.off('fontSize-changed');
            textLabel.node.off('lineHeight-changed');
            textLabel.node.off('horizontalAlign-changed');
        }
        if (placeholderLabel) {
            placeholderLabel.node.off('string-changed');
            placeholderLabel.node.off('font-changed');
            placeholderLabel.node.off('color-changed');
            placeholderLabel.node.off('fontSize-changed');
            placeholderLabel.node.off('lineHeight-changed');
            placeholderLabel.node.off('horizontalAlign-changed');
        }
    },

    onEnable () {
        this._impl && this._impl.onEnable();
    },

    onDisable () {
        this._impl && this._impl.onDisable();
    },

    __preload () {
        if (!CC_EDITOR) {
            this._registerEvent();
        }
        this._init();
    },

    _registerEvent () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    },

    _onTouchBegan (event) {
        if (this._impl) {
            this._impl._onTouchBegan(event.touch);
        }
        event.stopPropagation();
    },

    _onTouchCancel (event) {
        if (this._impl) {
            this._impl._onTouchCancel();
        }
        event.stopPropagation();
    },

    _onTouchEnded (event) {
        if (this._impl) {
            this._impl._onTouchEnded();
        }
        event.stopPropagation();
    },

    /**
     * !#en Let the EditBox get focus
     * !#zh 让当前 EditBox 获得焦点
     * @method setFocus
     */
    setFocus () {
        if(this._impl) {
            this._impl.setFocus();
        }
    },

    /**
     * !#en Determine whether EditBox is getting focus or not.
     * !#zh 判断 EditBox 是否获得了焦点
     * Note: only available on Web at the moment.
     * @method isFocused
     */
    isFocused () {
        let isFocused = false;
        if (this._impl) {
            isFocused = this._impl.isFocused();
        }
        return isFocused;
    },

    update () {
        if (this._impl) {
            this._impl.update();
        }
    }

});

/**
 * !#en The background image of EditBox.
 * !#zh 输入框的背景图片
 * @property {SpriteFrame} backgroundImage
 * @deprecated since v2.1, please use editbox.background.spriteFrame instead.
 */
Object.defineProperty(EditBox.prototype, 'backgroundImage', {
    get () {
        if (this.background) {
            let spriteComp = this.background.getComponent(cc.Sprite);
            return spriteComp && spriteComp.spriteFrame;
        }
        return null;
    },
    set (value) {
        if (this.background) {
            let spriteComp = this.background.getComponent(cc.Sprite);
            spriteComp && (spriteComp.spriteFrame = value);
        }
    }
});

/**
 * !#en Font size of the input text.
 * !#zh 输入框文本的字体大小
 * @property {Number} fontSize
 * @deprecated since v2.1, please use editbox.textLabel.fontSize instead.
 */
Object.defineProperty(EditBox.prototype, 'fontSize', {
    get () {
        return this.textLabel && this.textLabel.fontSize;
    },
    set (value) {
        this.textLabel && (this.textLabel.fontSize = value);
    }
});

/**
 * !#en Change the lineHeight of displayed text.
 * !#zh 输入框文本的行高。
 * @property {Number} lineHeight
 * @deprecated since v2.1, please use editbox.textLabel.lineHeight instead.
 */
Object.defineProperty(EditBox.prototype, 'lineHeight', {
    get () {
        return this.textLabel && this.textLabel.lineHeight;
    },
    set (value) {
        this.textLabel && (this.textLabel.lineHeight = value);
    }
});

/**
 * !#en Font color of the input text.
 * !#zh 输入框文本的颜色。
 * @property {Color} fontColor
 * @deprecated since v2.1, please use editbox.textLabel.node.color instead.
 */
Object.defineProperty(EditBox.prototype, 'fontColor', {
    get () {
        return this.textLabel && this.textLabel.node.color;
    },
    set (value) {
        this.textLabel && (this.textLabel.node.color = value);
    }
});

/**
 * !#en The font size of placeholder.
 * !#zh 输入框占位符的字体大小。
 * @property {Number} placeholderFontSize
 * @deprecated since v2.1, please use editbox.placeholderLabel.fontSize instead.
 */
Object.defineProperty(EditBox.prototype, 'placeholderFontSize', {
    get () {
        return this.placeholderLabel && this.placeholderLabel.fontSize;
    },
    set (value) {
        this.placeholderLabel && (this.placeholderLabel.fontSize = value);
    }
});

/**
 * !#en The font color of placeholder.
 * !#zh 输入框占位符的字体颜色。
 * @property {Color} placeholderFontColor
 * @deprecated since v2.1, please use editbox.placeholderLabel.fontColor instead.
 */
Object.defineProperty(EditBox.prototype, 'placeholderFontColor', {
    get () {
        return this.placeholderLabel && this.placeholderLabel.node.color;
    },
    set (value) {
        this.placeholderLabel && (this.placeholderLabel.node.color = value);
    }
});

cc.EditBox = module.exports = EditBox;

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
