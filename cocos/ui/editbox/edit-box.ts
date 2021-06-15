/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/

/**
 * @packageDocumentation
 * @module ui
 */

import { ccclass, help, executeInEditMode, executionOrder, menu, requireComponent, tooltip, displayOrder, type, serializable } from 'cc.decorator';
import { EDITOR, JSB, MINIGAME, RUNTIME_BASED } from 'internal:constants';
import { UITransform } from '../../2d/framework';
import { SpriteFrame } from '../../2d/assets/sprite-frame';
import { Component } from '../../core/components/component';
import { EventHandler as ComponentEventHandler } from '../../core/components/component-event-handler';
import { Color, Size, Vec3 } from '../../core/math';
import { EventTouch } from '../../core/platform';
import { Node } from '../../core/scene-graph/node';
import { Label, VerticalTextAlignment } from '../../2d/components/label';
import { Sprite } from '../../2d/components/sprite';
import { EditBoxImpl } from './edit-box-impl';
import { EditBoxImplBase } from './edit-box-impl-base';
import { InputFlag, InputMode, KeyboardReturnType } from './types';
import { sys } from '../../core/platform/sys';
import { legacyCC } from '../../core/global-exports';
import { NodeEventType } from '../../core/scene-graph/node-event';

const LEFT_PADDING = 2;

function capitalize (str: string) {
    return str.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
}

function capitalizeFirstLetter (str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

enum EventType {
    EDITING_DID_BEGAN = 'editing-did-began',
    EDITING_DID_ENDED = 'editing-did-ended',
    TEXT_CHANGED = 'text-changed',
    EDITING_RETURN = 'editing-return',
}
/**
 * @en
 * `EditBox` is a component for inputing text, you can use it to gather small amounts of text from users.
 *
 * @zh
 * `EditBox` 组件，用于获取用户的输入文本。
 */

@ccclass('cc.EditBox')
@help('i18n:cc.EditBox')
@executionOrder(110)
@menu('UI/EditBox')
@requireComponent(UITransform)
@executeInEditMode
export class EditBox extends Component {
    /**
     * @en
     * Input string of EditBox.
     *
     * @zh
     * 输入框的初始输入内容，如果为空则会显示占位符的文本。
     */
    @displayOrder(1)
    @tooltip('i18n:editbox.string')
    get string () {
        return this._string;
    }

    set string (value) {
        if (this._maxLength >= 0 && value.length >= this._maxLength) {
            value = value.slice(0, this._maxLength);
        }

        this._string = value;
        this._updateString(value);
    }

    /**
     * @en
     * The display text of placeholder.
     *
     * @zh
     * 输入框占位符的文本内容。
     */
    @displayOrder(2)
    @tooltip('i18n:editbox.placeholder')
    get placeholder () {
        if (!this._placeholderLabel) {
            return '';
        }
        return this._placeholderLabel.string;
    }

    set placeholder (value) {
        if (this._placeholderLabel) {
            this._placeholderLabel.string = value;
        }
    }

    /**
     * @en
     * The Label component attached to the node for EditBox's input text label
     *
     * @zh
     * 输入框输入文本节点上挂载的 Label 组件对象
     */
    @type(Label)
    @displayOrder(3)
    @tooltip('i18n:editbox.text_lable')
    get textLabel () {
        return this._textLabel;
    }

    set textLabel (oldValue) {
        if (this._textLabel !== oldValue) {
            this._textLabel = oldValue;
            if (this._textLabel) {
                this._updateTextLabel();
                this._updateLabels();
            }
        }
    }

    /**
     * @en
     * The Label component attached to the node for EditBox's placeholder text label.
     *
     * @zh
     * 输入框占位符节点上挂载的 Label 组件对象。
     */
    @type(Label)
    @displayOrder(4)
    @tooltip('i18n:editbox.placeholder_label')
    get placeholderLabel () {
        return this._placeholderLabel;
    }

    set placeholderLabel (oldValue) {
        if (this._placeholderLabel !== oldValue) {
            this._placeholderLabel = oldValue;
            if (this._placeholderLabel) {
                this._updatePlaceholderLabel();
                this._updateLabels();
            }
        }
    }

    /**
     * @en
     * The background image of EditBox.
     *
     * @zh
     * 输入框的背景图片。
     */
    @type(SpriteFrame)
    @displayOrder(5)
    @tooltip('i18n:editbox.backgroundImage')
    get backgroundImage () {
        return this._backgroundImage;
    }

    set backgroundImage (value: SpriteFrame | null) {
        if (this._backgroundImage === value) {
            return;
        }

        this._backgroundImage = value;
        this._createBackgroundSprite();
    }

    /**
     * @en
     * Set the input flags that are to be applied to the EditBox.
     *
     * @zh
     * 指定输入标志位，可以指定输入方式为密码或者单词首字母大写。
     */
    @type(InputFlag)
    @displayOrder(6)
    @tooltip('i18n:editbox.input_flag')
    get inputFlag () {
        return this._inputFlag;
    }

    set inputFlag (value) {
        this._inputFlag = value;
        this._updateString(this._string);
    }

    /**
     * @en
     * Set the input mode of the edit box.
     * If you pass ANY, it will create a multiline EditBox.
     *
     * @zh
     * 指定输入模式: ANY表示多行输入，其它都是单行输入，移动平台上还可以指定键盘样式。
     */
    @type(InputMode)
    @displayOrder(7)
    @tooltip('i18n:editbox.input_mode')
    get inputMode () {
        return this._inputMode;
    }

    set inputMode (oldValue) {
        if (this._inputMode !== oldValue) {
            this._inputMode = oldValue;
            this._updateTextLabel();
            this._updatePlaceholderLabel();
        }
    }

    /**
     * @en
     * The return key type of EditBox.
     * Note: it is meaningless for web platforms and desktop platforms.
     *
     * @zh
     * 指定移动设备上面回车按钮的样式。
     * 注意：这个选项对 web 平台与 desktop 平台无效。
     */
    @type(KeyboardReturnType)
    @displayOrder(8)
    @tooltip('i18n:editbox.returnType')
    get returnType () {
        return this._returnType;
    }

    set returnType (value: KeyboardReturnType) {
        this._returnType = value;
    }

    /**
     * @en
     * The maximize input length of EditBox.
     * - If pass a value less than 0, it won't limit the input number of characters.
     * - If pass 0, it doesn't allow input any characters.
     *
     * @zh
     * 输入框最大允许输入的字符个数。
     * - 如果值为小于 0 的值，则不会限制输入字符个数。
     * - 如果值为 0，则不允许用户进行任何输入。
     */
    @displayOrder(9)
    @tooltip('i18n:editbox.max_length')
    get maxLength () {
        return this._maxLength;
    }
    set maxLength (value: number) {
        this._maxLength = value;
    }

    /**
     * @en
     * Set the tabIndex of the DOM input element (only useful on Web).
     *
     * @zh
     * 修改 DOM 输入元素的 tabIndex（这个属性只有在 Web 上面修改有意义）。
     */
    @displayOrder(10)
    @tooltip('i18n:editbox.tab_index')
    get tabIndex () {
        return this._tabIndex;
    }

    set tabIndex (value) {
        if (this._tabIndex !== value) {
            this._tabIndex = value;
            if (this._impl) {
                this._impl.setTabIndex(value);
            }
        }
    }

    public static _EditBoxImpl = EditBoxImplBase;
    public static KeyboardReturnType = KeyboardReturnType;
    public static InputFlag = InputFlag;
    public static InputMode = InputMode;
    public static EventType = EventType;
    /**
     * @en
     * The event handler to be called when EditBox began to edit text.
     *
     * @zh
     * 开始编辑文本输入框触发的事件回调。
     */
    @type([ComponentEventHandler])
    @serializable
    @displayOrder(11)
    @tooltip('i18n:editbox.editing_began')
    public editingDidBegan: ComponentEventHandler[] = [];

    /**
     * @en
     * The event handler to be called when EditBox text changes.
     *
     * @zh
     * 编辑文本输入框时触发的事件回调。
     */
    @type([ComponentEventHandler])
    @serializable
    @displayOrder(12)
    @tooltip('i18n:editbox.text_changed')
    public textChanged: ComponentEventHandler[] = [];

    /**
     * @en
     * The event handler to be called when EditBox edit ends.
     *
     * @zh
     * 结束编辑文本输入框时触发的事件回调。
     */
    @type([ComponentEventHandler])
    @serializable
    @displayOrder(13)
    @tooltip('i18n:editbox.editing_ended')
    public editingDidEnded: ComponentEventHandler[] = [];

    /**
     * @en
     * The event handler to be called when return key is pressed. Windows is not supported.
     *
     * @zh
     * 当用户按下回车按键时的事件回调，目前不支持 windows 平台
     */
    @type([ComponentEventHandler])
    @serializable
    @displayOrder(14)
    @tooltip('i18n:editbox.editing_return')
    public editingReturn: ComponentEventHandler[] = [];

    public _impl: EditBoxImplBase | null = null;
    public _background: Sprite | null = null;

    @serializable
    protected _textLabel: Label | null = null;
    @serializable
    protected _placeholderLabel: Label | null = null;
    @serializable
    protected  _returnType = KeyboardReturnType.DEFAULT;
    @serializable
    protected  _string = '';
    @serializable
    protected  _tabIndex = 0;
    @serializable
    protected  _backgroundImage: SpriteFrame | null = null;
    @serializable
    protected  _inputFlag = InputFlag.DEFAULT;
    @serializable
    protected  _inputMode = InputMode.ANY;
    @serializable
    protected  _maxLength = 20;

    private _isLabelVisible = false;

    public __preload () {
        this._init();
    }

    public onEnable () {
        if (!EDITOR || legacyCC.GAME_VIEW) {
            this._registerEvent();
        }
        if (this._impl) {
            this._impl.onEnable();
        }
    }

    public update () {
        if (this._impl) {
            this._impl.update();
        }
    }

    public onDisable () {
        if (!EDITOR || legacyCC.GAME_VIEW) {
            this._unregisterEvent();
        }
        if (this._impl) {
            this._impl.onDisable();
        }
    }

    public onDestroy () {
        if (this._impl) {
            this._impl.clear();
        }
    }

    /**
     * @en Let the EditBox get focus
     * @zh 让当前 EditBox 获得焦点。
     */
    public setFocus () {
        if (this._impl) {
            this._impl.setFocus(true);
        }
    }

    /**
     * @en Let the EditBox get focus
     * @zh 让当前 EditBox 获得焦点
     */
    public focus () {
        if (this._impl) {
            this._impl.setFocus(true);
        }
    }

    /**
     * @en Let the EditBox lose focus
     * @zh 让当前 EditBox 失去焦点
     */
    public blur () {
        if (this._impl) {
            this._impl.setFocus(false);
        }
    }

    /**
     * @en Determine whether EditBox is getting focus or not.
     * @zh 判断 EditBox 是否获得了焦点。
     * Note: only available on Web at the moment.
     */
    public isFocused () {
        if (this._impl) {
            return this._impl.isFocused();
        }
        return false;
    }

    public _editBoxEditingDidBegan () {
        ComponentEventHandler.emitEvents(this.editingDidBegan, this);
        this.node.emit(EventType.EDITING_DID_BEGAN, this);
    }

    public _editBoxEditingDidEnded () {
        ComponentEventHandler.emitEvents(this.editingDidEnded, this);
        this.node.emit(EventType.EDITING_DID_ENDED, this);
    }

    public _editBoxTextChanged (text: string) {
        text = this._updateLabelStringStyle(text, true);
        this.string = text;
        ComponentEventHandler.emitEvents(this.textChanged, text, this);
        this.node.emit(EventType.TEXT_CHANGED, this);
    }

    public _editBoxEditingReturn () {
        ComponentEventHandler.emitEvents(this.editingReturn, this);
        this.node.emit(EventType.EDITING_RETURN, this);
    }

    public _showLabels () {
        this._isLabelVisible = true;
        this._updateLabels();
    }

    public _hideLabels () {
        this._isLabelVisible = false;
        if (this._textLabel) {
            this._textLabel.node.active = false;
        }
        if (this._placeholderLabel) {
            this._placeholderLabel.node.active = false;
        }
    }

    protected _onTouchBegan (event: EventTouch) {
        event.propagationStopped = true;
    }

    protected _onTouchCancel (event: EventTouch) {
        event.propagationStopped = true;
    }

    protected _onTouchEnded (event: EventTouch) {
        if (this._impl) {
            this._impl.beginEditing();
        }
        event.propagationStopped = true;
    }

    protected _init () {
        this._createBackgroundSprite();
        this._updatePlaceholderLabel();
        this._updateTextLabel();
        this._isLabelVisible = true;
        this.node.on(NodeEventType.SIZE_CHANGED, this._resizeChildNodes, this);

        const impl = this._impl = new EditBox._EditBoxImpl();
        impl.init(this);
        this._updateString(this._string);
        this._syncSize();
    }

    protected _createBackgroundSprite () {
        if (!this._background) {
            this._background = this.node.getComponent(Sprite);
            if (!this._background) {
                this._background = this.node.addComponent(Sprite);
            }
        }

        this._background.type = Sprite.Type.SLICED;
        this._background.spriteFrame = this._backgroundImage;
    }

    protected _updateTextLabel () {
        let textLabel = this._textLabel;

        // If textLabel doesn't exist, create one.
        if (!textLabel) {
            let node = this.node.getChildByName('TEXT_LABEL');
            if (!node) {
                node = new Node('TEXT_LABEL');
            }
            textLabel = node.getComponent(Label);
            if (!textLabel) {
                textLabel = node.addComponent(Label);
            }
            node.parent = this.node;
            this._textLabel = textLabel;
        }

        // update
        const transformComp = this._textLabel!.node._uiProps.uiTransformComp;
        transformComp!.setAnchorPoint(0, 1);
        textLabel.overflow = Label.Overflow.CLAMP;
        if (this._inputMode === InputMode.ANY) {
            textLabel.verticalAlign = VerticalTextAlignment.TOP;
            textLabel.enableWrapText = true;
        } else {
            textLabel.enableWrapText = false;
        }
        textLabel.string = this._updateLabelStringStyle(this._string);
    }

    protected _updatePlaceholderLabel () {
        let placeholderLabel = this._placeholderLabel;

        // If placeholderLabel doesn't exist, create one.
        if (!placeholderLabel) {
            let node = this.node.getChildByName('PLACEHOLDER_LABEL');
            if (!node) {
                node = new Node('PLACEHOLDER_LABEL');
            }
            placeholderLabel = node.getComponent(Label);
            if (!placeholderLabel) {
                placeholderLabel = node.addComponent(Label);
            }
            node.parent = this.node;
            this._placeholderLabel = placeholderLabel;
        }

        // update
        const transform = this._placeholderLabel!.node._uiProps.uiTransformComp;
        transform!.setAnchorPoint(0, 1);
        placeholderLabel.overflow = Label.Overflow.CLAMP;
        if (this._inputMode === InputMode.ANY) {
            placeholderLabel.verticalAlign = VerticalTextAlignment.TOP;
            placeholderLabel.enableWrapText = true;
        } else {
            placeholderLabel.enableWrapText = false;
        }
        placeholderLabel.string = this.placeholder;
    }

    protected _syncSize () {
        const trans = this.node._uiProps.uiTransformComp!;
        const size = trans.contentSize;

        if (this._background) {
            const bgTrans = this._background.node._uiProps.uiTransformComp!;
            bgTrans.anchorPoint = trans.anchorPoint;
            bgTrans.setContentSize(size);
        }

        this._updateLabelPosition(size);
        if (this._impl) {
            this._impl.setSize(size.width, size.height);
        }
    }

    protected _updateLabels () {
        if (this._isLabelVisible) {
            const content = this._string;
            if (this._textLabel) {
                this._textLabel.node.active = (content !== '');
            }
            if (this._placeholderLabel) {
                this._placeholderLabel.node.active = (content === '');
            }
        }
    }

    protected _updateString (text: string) {
        const textLabel = this._textLabel;
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
    }

    protected _updateLabelStringStyle (text: string, ignorePassword = false) {
        const inputFlag = this._inputFlag;
        if (!ignorePassword && inputFlag === InputFlag.PASSWORD) {
            let passwordString = '';
            const len = text.length;
            for (let i = 0; i < len; ++i) {
                passwordString += '\u25CF';
            }
            text = passwordString;
        } else if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
            text = text.toUpperCase();
        } else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
            text = capitalize(text);
        } else if (inputFlag === InputFlag.INITIAL_CAPS_SENTENCE) {
            text = capitalizeFirstLetter(text);
        }

        return text;
    }

    protected _registerEvent () {
        this.node.on(NodeEventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(NodeEventType.TOUCH_END, this._onTouchEnded, this);
    }

    protected _unregisterEvent () {
        this.node.off(NodeEventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(NodeEventType.TOUCH_END, this._onTouchEnded, this);
    }

    protected _updateLabelPosition (size: Size) {
        const trans = this.node._uiProps.uiTransformComp!;
        const offX = -trans.anchorX * trans.width;
        const offY = -trans.anchorY * trans.height;

        const placeholderLabel = this._placeholderLabel;
        const textLabel = this._textLabel;
        if (textLabel) {
            textLabel.node._uiProps.uiTransformComp!.setContentSize(size.width - LEFT_PADDING, size.height);
            textLabel.node.setPosition(offX + LEFT_PADDING, offY + size.height, textLabel.node.position.z);
            if (this._inputMode === InputMode.ANY) {
                textLabel.verticalAlign = VerticalTextAlignment.TOP;
            }
            textLabel.enableWrapText = this._inputMode === InputMode.ANY;
        }

        if (placeholderLabel) {
            placeholderLabel.node._uiProps.uiTransformComp!.setContentSize(size.width - LEFT_PADDING, size.height);
            placeholderLabel.lineHeight = size.height;
            placeholderLabel.node.setPosition(offX + LEFT_PADDING, offY + size.height, placeholderLabel.node.position.z);
            if (this._inputMode === InputMode.ANY) {
                placeholderLabel.verticalAlign = VerticalTextAlignment.TOP;
            }
            placeholderLabel.enableWrapText = this._inputMode === InputMode.ANY;
        }
    }

    protected _resizeChildNodes () {
        const trans = this.node._uiProps.uiTransformComp!;
        const textLabelNode = this._textLabel && this._textLabel.node;
        if (textLabelNode) {
            textLabelNode.setPosition(-trans.width / 2, trans.height / 2, textLabelNode.position.z);
            textLabelNode._uiProps.uiTransformComp!.setContentSize(trans.contentSize);
        }
        const placeholderLabelNode = this._placeholderLabel && this._placeholderLabel.node;
        if (placeholderLabelNode) {
            placeholderLabelNode.setPosition(-trans.width / 2, trans.height / 2, placeholderLabelNode.position.z);
            placeholderLabelNode._uiProps.uiTransformComp!.setContentSize(trans.contentSize);
        }
        const backgroundNode = this._background && this._background.node;
        if (backgroundNode) {
            backgroundNode._uiProps.uiTransformComp!.setContentSize(trans.contentSize);
        }
    }
}

// this equals to sys.isBrowser
// now we have no web-adapter yet
if (typeof window === 'object' && typeof document === 'object' && !MINIGAME && !JSB && !RUNTIME_BASED) {
    EditBox._EditBoxImpl = EditBoxImpl;
}

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-did-began
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-did-ended
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event text-changed
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-return
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * @en if you don't need the EditBox and it isn't in any running Scene, you should
 * call the destroy method on this component or the associated node explicitly.
 * Otherwise, the created DOM element won't be removed from web page.
 * @zh
 * 如果你不再使用 EditBox，并且组件未添加到场景中，那么你必须手动对组件或所在节点调用 destroy。
 * 这样才能移除网页上的 DOM 节点，避免 Web 平台内存泄露。
 * @example
 * ```
 * editbox.node.parent = null;  // or  editbox.node.removeFromParent(false);
 * // when you don't need editbox anymore
 * editbox.node.destroy();
 * ```
 * @return {Boolean} whether it is the first time the destroy being called
 */
