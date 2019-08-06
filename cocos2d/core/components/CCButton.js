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

const Component = require('./CCComponent');
const GraySpriteState = require('../utils/gray-sprite-state');

/**
 * !#en Enum for transition type.
 * !#zh 过渡类型
 * @enum Button.Transition
 */
let Transition = cc.Enum({
    /**
     * !#en The none type.
     * !#zh 不做任何过渡
     * @property {Number} NONE
     */
    NONE: 0,

    /**
     * !#en The color type.
     * !#zh 颜色过渡
     * @property {Number} COLOR
     */
    COLOR: 1,

    /**
     * !#en The sprite type.
     * !#zh 精灵过渡
     * @property {Number} SPRITE
     */
    SPRITE: 2,
    /**
     * !#en The scale type
     * !#zh 缩放过渡
     * @property {Number} SCALE
     */
    SCALE: 3
});

const State = cc.Enum({
    NORMAL: 0,
    HOVER: 1,
    PRESSED: 2,
    DISABLED: 3,
});

/**
 * !#en
 * Button has 4 Transition types<br/>
 * When Button state changed:<br/>
 *  If Transition type is Button.Transition.NONE, Button will do nothing<br/>
 *  If Transition type is Button.Transition.COLOR, Button will change target's color<br/>
 *  If Transition type is Button.Transition.SPRITE, Button will change target Sprite's sprite<br/>
 *  If Transition type is Button.Transition.SCALE, Button will change target node's scale<br/>
 *
 * Button will trigger 5 events:<br/>
 *  Button.EVENT_TOUCH_DOWN<br/>
 *  Button.EVENT_TOUCH_UP<br/>
 *  Button.EVENT_HOVER_IN<br/>
 *  Button.EVENT_HOVER_MOVE<br/>
 *  Button.EVENT_HOVER_OUT<br/>
 *  User can get the current clicked node with 'event.target' from event object which is passed as parameter in the callback function of click event.
 *
 * !#zh
 * 按钮组件。可以被按下，或者点击。
 *
 * 按钮可以通过修改 Transition 来设置按钮状态过渡的方式：
 * 
 *   - Button.Transition.NONE   // 不做任何过渡
 *   - Button.Transition.COLOR  // 进行颜色之间过渡
 *   - Button.Transition.SPRITE // 进行精灵之间过渡
 *   - Button.Transition.SCALE // 进行缩放过渡
 *
 * 按钮可以绑定事件（但是必须要在按钮的 Node 上才能绑定事件）：<br/>
 * 以下事件可以在全平台上都触发：
 * 
 *   - cc.Node.EventType.TOUCH_START  // 按下时事件
 *   - cc.Node.EventType.TOUCH_Move   // 按住移动后事件
 *   - cc.Node.EventType.TOUCH_END    // 按下后松开后事件
 *   - cc.Node.EventType.TOUCH_CANCEL // 按下取消事件
 * 
 * 以下事件只在 PC 平台上触发：
 * 
 *   - cc.Node.EventType.MOUSE_DOWN  // 鼠标按下时事件
 *   - cc.Node.EventType.MOUSE_MOVE  // 鼠标按住移动后事件
 *   - cc.Node.EventType.MOUSE_ENTER // 鼠标进入目标事件
 *   - cc.Node.EventType.MOUSE_LEAVE // 鼠标离开目标事件
 *   - cc.Node.EventType.MOUSE_UP    // 鼠标松开事件
 *   - cc.Node.EventType.MOUSE_WHEEL // 鼠标滚轮事件
 * 
 * 用户可以通过获取 __点击事件__ 回调函数的参数 event 的 target 属性获取当前点击对象。
 * @class Button
 * @extends Component
 * @example
 *
 * // Add an event to the button.
 * button.node.on(cc.Node.EventType.TOUCH_START, function (event) {
 *     cc.log("This is a callback after the trigger event");
 * });

 * // You could also add a click event
 * //Note: In this way, you can't get the touch event info, so use it wisely.
 * button.node.on('click', function (button) {
 *    //The event is a custom event, you could get the Button component via first argument
 * })
 *
 */
let Button = cc.Class({
    name: 'cc.Button',
    extends: Component,
    mixins: [GraySpriteState],

    ctor () {
        this._pressed = false;
        this._hovered = false;
        this._fromColor = null;
        this._toColor = null;
        this._time = 0;
        this._transitionFinished = true;
        // init _originalScale in __preload()
        this._fromScale = cc.Vec2.ZERO;
        this._toScale = cc.Vec2.ZERO;
        this._originalScale = null;

        this._graySpriteMaterial = null;
        this._spriteMaterial = null;

        this._sprite = null;
    },

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/Button',
        help: 'i18n:COMPONENT.help_url.button',
        inspector: 'packages://inspector/inspectors/comps/button.js',
        executeInEditMode: true
    },

    properties: {
        /**
         * !#en
         * Whether the Button is disabled.
         * If true, the Button will trigger event and do transition.
         * !#zh
         * 按钮事件是否被响应，如果为 false，则按钮将被禁用。
         * @property {Boolean} interactable
         * @default true
         */
        interactable: {
            default: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.button.interactable',
            notify () {
                this._updateState();

                if (!this.interactable) {
                    this._resetState();
                }
            },
            animatable: false
        },

        _resizeToTarget: {
            animatable: false,
            set (value) {
                if (value) {
                    this._resizeNodeToTargetNode();
                }
            }
        },

        /**
         * !#en When this flag is true, Button target sprite will turn gray when interactable is false.
         * !#zh 如果这个标记为 true，当 button 的 interactable 属性为 false 的时候，会使用内置 shader 让 button 的 target 节点的 sprite 组件变灰
         * @property {Boolean} enableAutoGrayEffect
         */
        enableAutoGrayEffect: {
            default: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.button.auto_gray_effect',
            notify () {
                this._updateDisabledState();
            }
        },

        /**
         * !#en Transition type
         * !#zh 按钮状态改变时过渡方式。
         * @property {Button.Transition} transition
         * @default Button.Transition.Node
         */
        transition: {
            default: Transition.NONE,
            tooltip: CC_DEV && 'i18n:COMPONENT.button.transition',
            type: Transition,
            animatable: false,
            notify (oldValue) {
                this._updateTransition(oldValue);
            },
            formerlySerializedAs: 'transition'
        },

        // color transition

        /**
         * !#en Normal state color.
         * !#zh 普通状态下按钮所显示的颜色。
         * @property {Color} normalColor
         */
        normalColor: {
            default: cc.Color.WHITE,
            displayName: 'Normal',
            tooltip: CC_DEV && 'i18n:COMPONENT.button.normal_color',
            notify () {
                if (this.transition === Transition.Color && this._getButtonState() === State.NORMAL) {
                    this._getTarget().opacity = this.normalColor.a;
                }
                this._updateState();
            }
        },

        /**
         * !#en Pressed state color
         * !#zh 按下状态时按钮所显示的颜色。
         * @property {Color} pressedColor
         */
        pressedColor: {
            default: cc.color(211, 211, 211),
            displayName: 'Pressed',
            tooltip: CC_DEV && 'i18n:COMPONENT.button.pressed_color',
            notify () {
                if (this.transition === Transition.Color && this._getButtonState() === State.PRESSED) {
                    this._getTarget().opacity = this.pressedColor.a;
                }
                this._updateState();
            },
            formerlySerializedAs: 'pressedColor'
        },

        /**
         * !#en Hover state color
         * !#zh 悬停状态下按钮所显示的颜色。
         * @property {Color} hoverColor
         */
        hoverColor: {
            default: cc.Color.WHITE,
            displayName: 'Hover',
            tooltip: CC_DEV && 'i18n:COMPONENT.button.hover_color',
            notify () {
                if (this.transition === Transition.Color && this._getButtonState() === State.HOVER) {
                    this._getTarget().opacity = this.hoverColor.a;
                }
                this._updateState();
            },
            formerlySerializedAs: 'hoverColor'
        },

        /**
         * !#en Disabled state color
         * !#zh 禁用状态下按钮所显示的颜色。
         * @property {Color} disabledColor
         */
        disabledColor: {
            default: cc.color(124, 124, 124),
            displayName: 'Disabled',
            tooltip: CC_DEV && 'i18n:COMPONENT.button.disabled_color',
            notify () {
                if (this.transition === Transition.Color && this._getButtonState() === State.DISABLED) {
                    this._getTarget().opacity = this.disabledColor.a;
                }
                this._updateState();
            }
        },

        /**
         * !#en Color and Scale transition duration
         * !#zh 颜色过渡和缩放过渡时所需时间
         * @property {Number} duration
         */
        duration: {
            default: 0.1,
            range: [0, 10],
            tooltip: CC_DEV && 'i18n:COMPONENT.button.duration',
        },

        /**
         * !#en  When user press the button, the button will zoom to a scale.
         * The final scale of the button  equals (button original scale * zoomScale)
         * !#zh 当用户点击按钮后，按钮会缩放到一个值，这个值等于 Button 原始 scale * zoomScale
         * @property {Number} zoomScale
         */
        zoomScale: {
            default: 1.2,
            tooltip: CC_DEV && 'i18n:COMPONENT.button.zoom_scale'
        },

        // sprite transition
        /**
         * !#en Normal state sprite
         * !#zh 普通状态下按钮所显示的 Sprite 。
         * @property {SpriteFrame} normalSprite
         */
        normalSprite: {
            default: null,
            type: cc.SpriteFrame,
            displayName: 'Normal',
            tooltip: CC_DEV && 'i18n:COMPONENT.button.normal_sprite',
            notify () {
                this._updateState();
            }
        },

        /**
         * !#en Pressed state sprite
         * !#zh 按下状态时按钮所显示的 Sprite 。
         * @property {SpriteFrame} pressedSprite
         */
        pressedSprite: {
            default: null,
            type: cc.SpriteFrame,
            displayName: 'Pressed',
            tooltip: CC_DEV && 'i18n:COMPONENT.button.pressed_sprite',
            formerlySerializedAs: 'pressedSprite',
            notify () {
                this._updateState();
            }
        },

        /**
         * !#en Hover state sprite
         * !#zh 悬停状态下按钮所显示的 Sprite 。
         * @property {SpriteFrame} hoverSprite
         */
        hoverSprite: {
            default: null,
            type: cc.SpriteFrame,
            displayName: 'Hover',
            tooltip: CC_DEV && 'i18n:COMPONENT.button.hover_sprite',
            formerlySerializedAs: 'hoverSprite',
            notify () {
                this._updateState();
            }
        },

        /**
         * !#en Disabled state sprite
         * !#zh 禁用状态下按钮所显示的 Sprite 。
         * @property {SpriteFrame} disabledSprite
         */
        disabledSprite: {
            default: null,
            type: cc.SpriteFrame,
            displayName: 'Disabled',
            tooltip: CC_DEV && 'i18n:COMPONENT.button.disabled_sprite',
            notify () {
                this._updateState();
            }
        },

        /**
         * !#en
         * Transition target.
         * When Button state changed:
         *  If Transition type is Button.Transition.NONE, Button will do nothing
         *  If Transition type is Button.Transition.COLOR, Button will change target's color
         *  If Transition type is Button.Transition.SPRITE, Button will change target Sprite's sprite
         * !#zh
         * 需要过渡的目标。
         * 当前按钮状态改变规则：
         * -如果 Transition type 选择 Button.Transition.NONE，按钮不做任何过渡。
         * -如果 Transition type 选择 Button.Transition.COLOR，按钮会对目标颜色进行颜色之间的过渡。
         * -如果 Transition type 选择 Button.Transition.Sprite，按钮会对目标 Sprite 进行 Sprite 之间的过渡。
         * @property {Node} target
         */
        target: {
            default: null,
            type: cc.Node,
            tooltip: CC_DEV && "i18n:COMPONENT.button.target",
            notify (oldValue) {
                this._applyTarget();
                if (oldValue && this.target !== oldValue) {
                    this._unregisterTargetEvent(oldValue);
                }
            }
        },

        /**
         * !#en If Button is clicked, it will trigger event's handler
         * !#zh 按钮的点击事件列表。
         * @property {Component.EventHandler[]} clickEvents
         */
        clickEvents: {
            default: [],
            type: cc.Component.EventHandler,
            tooltip: CC_DEV && 'i18n:COMPONENT.button.click_events',
        }
    },

    statics: {
        Transition: Transition,
    },

    __preload () {
        this._applyTarget();
        this._updateState();
    },

    _resetState () {
        this._pressed = false;
        this._hovered = false;
        // // Restore button status
        let target = this._getTarget();
        let transition = this.transition;
        let originalScale = this._originalScale;

        if (transition === Transition.COLOR && this.interactable) {
            this._setTargetColor(this.normalColor);
        }
        else if (transition === Transition.SCALE && originalScale) {
            target.setScale(originalScale.x, originalScale.y);
        }
        this._transitionFinished = true;
    },

    onEnable () {
        // check sprite frames
        if (this.normalSprite) {
            this.normalSprite.ensureLoadTexture();
        }
        if (this.hoverSprite) {
            this.hoverSprite.ensureLoadTexture();
        }
        if (this.pressedSprite) {
            this.pressedSprite.ensureLoadTexture();
        }
        if (this.disabledSprite) {
            this.disabledSprite.ensureLoadTexture();
        }
        
        if (!CC_EDITOR) {
            this._registerNodeEvent();
        }
    },

    onDisable () {
        this._resetState();

        if (!CC_EDITOR) {
            this._unregisterNodeEvent();
        }
    },

    _getTarget () {
        return this.target ? this.target : this.node;
    },

    _onTargetSpriteFrameChanged (comp) {
        if (this.transition === Transition.SPRITE) {
            this._setCurrentStateSprite(comp.spriteFrame);
        }
    },

    _onTargetColorChanged (color) {
        if (this.transition === Transition.COLOR) {
            this._setCurrentStateColor(color);
        }
    },

    _onTargetScaleChanged () {
        let target = this._getTarget();
        // update _originalScale if target scale changed
        if (this._originalScale) {
            if (this.transition !== Transition.SCALE || this._transitionFinished) {
                this._originalScale.x = target.scaleX;
                this._originalScale.y = target.scaleY;
            }
        }
    },

    _setTargetColor (color) {
        let target = this._getTarget();
        target.color = color;
        target.opacity = color.a;
    },

    _getStateColor (state) {
        switch (state) {
            case State.NORMAL:
                return this.normalColor;
            case State.HOVER:
                return this.hoverColor;
            case State.PRESSED:
                return this.pressedColor;
            case State.DISABLED:
                return this.disabledColor;
        }
    },

    _getStateSprite (state) {
        switch (state) {
            case State.NORMAL:
                return this.normalSprite;
            case State.HOVER:
                return this.hoverSprite;
            case State.PRESSED:
                return this.pressedSprite;
            case State.DISABLED:
                return this.disabledSprite;
        }
    },

    _setCurrentStateColor (color) {
        switch ( this._getButtonState() ) {
            case State.NORMAL:
                this.normalColor = color;
                break;
            case State.HOVER:
                this.hoverColor = color;
                break;
            case State.PRESSED:
                this.pressedColor = color;
                break;
            case State.DISABLED:
                this.disabledColor = color;
                break;
        }
    },

    _setCurrentStateSprite (spriteFrame) {
        switch ( this._getButtonState() ) {
            case State.NORMAL:
                this.normalSprite = spriteFrame;
                break;
            case State.HOVER:
                this.hoverSprite = spriteFrame;
                break;
            case State.PRESSED:
                this.pressedSprite = spriteFrame;
                break;
            case State.DISABLED:
                this.disabledSprite = spriteFrame;
                break;
        }
    },

    update (dt) {
        let target = this._getTarget();
        if (this._transitionFinished) return;
        if (this.transition !== Transition.COLOR && this.transition !== Transition.SCALE) return;

        this.time += dt;
        let ratio = 1.0;
        if (this.duration > 0) {
            ratio = this.time / this.duration;
        }

        // clamp ratio
        if (ratio >= 1) {
            ratio = 1;
        }

        if (this.transition === Transition.COLOR) {
            let color = this._fromColor.lerp(this._toColor, ratio);
            this._setTargetColor(color);
        }
        // Skip if _originalScale is invalid
        else if (this.transition === Transition.SCALE && this._originalScale) {
            target.scale = this._fromScale.lerp(this._toScale, ratio);
        }

        if (ratio === 1) {
            this._transitionFinished = true;
        }

    },

    _registerNodeEvent () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);

        this.node.on(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
    },

    _unregisterNodeEvent () {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);

        this.node.off(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
    },

    _registerTargetEvent (target) {
        if (CC_EDITOR) {
            target.on('spriteframe-changed', this._onTargetSpriteFrameChanged, this);
            target.on(cc.Node.EventType.COLOR_CHANGED, this._onTargetColorChanged, this);
        }
        target.on(cc.Node.EventType.SCALE_CHANGED, this._onTargetScaleChanged, this);
    },

    _unregisterTargetEvent (target) {
        if (CC_EDITOR) {
            target.off('spriteframe-changed', this._onTargetSpriteFrameChanged, this);
            target.off(cc.Node.EventType.COLOR_CHANGED, this._onTargetColorChanged, this);
        }
        target.off(cc.Node.EventType.SCALE_CHANGED, this._onTargetScaleChanged, this);
    },

    _getTargetSprite (target) {
        let sprite = null;
        if (target) {
            sprite = target.getComponent(cc.Sprite);
        }
        return sprite;
    },

    _applyTarget () {
        let target = this._getTarget();
        this._sprite = this._getTargetSprite(target);
        if (!this._originalScale) {
            this._originalScale = cc.Vec2.ZERO;
        }
        this._originalScale.x = target.scaleX;
        this._originalScale.y = target.scaleY;

        this._registerTargetEvent(target);
    },

    // touch event handler
    _onTouchBegan (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;

        this._pressed = true;
        this._updateState();
        event.stopPropagation();
    },

    _onTouchMove (event) {
        if (!this.interactable || !this.enabledInHierarchy || !this._pressed) return;
        // mobile phone will not emit _onMouseMoveOut,
        // so we have to do hit test when touch moving
        let touch = event.touch;
        let hit = this.node._hitTest(touch.getLocation());
        let target = this._getTarget();
        let originalScale = this._originalScale;

        if (this.transition === Transition.SCALE && originalScale) {
            if (hit) {
                this._fromScale.x = originalScale.x;
                this._fromScale.y = originalScale.y;
                this._toScale.x = originalScale.x * this.zoomScale;
                this._toScale.y = originalScale.y * this.zoomScale;
                this._transitionFinished = false;
            } else {
                this.time = 0;
                this._transitionFinished = true;
                target.setScale(originalScale.x, originalScale.y);
            }
        } else {
            let state;
            if (hit) {
                state = State.PRESSED;
            } else {
                state = State.NORMAL;
            }
            this._applyTransition(state);
        }
        event.stopPropagation();
    },

    _onTouchEnded (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;

        if (this._pressed) {
            cc.Component.EventHandler.emitEvents(this.clickEvents, event);
            this.node.emit('click', this);
        }
        this._pressed = false;
        this._updateState();
        event.stopPropagation();
    },

    _onTouchCancel () {
        if (!this.interactable || !this.enabledInHierarchy) return;

        this._pressed = false;
        this._updateState();
    },

    _onMouseMoveIn () {
        if (this._pressed || !this.interactable || !this.enabledInHierarchy) return;
        if (this.transition === Transition.SPRITE && !this.hoverSprite) return;

        if (!this._hovered) {
            this._hovered = true;
            this._updateState();
        }
    },

    _onMouseMoveOut () {
        if (this._hovered) {
            this._hovered = false;
            this._updateState();
        }
    },

    // state handler
    _updateState () {
        let state = this._getButtonState();
        this._applyTransition(state);
        this._updateDisabledState();
    },

    _getButtonState () {
        let state;
        if (!this.interactable) {
            state = State.DISABLED;
        }
        else if (this._pressed) {
            state = State.PRESSED;
        }
        else if (this._hovered) {
            state = State.HOVER;
        }
        else {
            state = State.NORMAL;
        }
        return state;
    },

    _updateColorTransitionImmediately (state) {
        let color = this._getStateColor(state);
        this._setTargetColor(color);
    },

    _updateColorTransition (state) {
        if (CC_EDITOR || state === State.DISABLED) {
            this._updateColorTransitionImmediately(state);
        }
        else {
            let target = this._getTarget();
            let color = this._getStateColor(state);
            this._fromColor = target.color.clone();
            this._toColor = color;
            this.time = 0;
            this._transitionFinished = false;
        }
    },

    _updateSpriteTransition (state) {
        let sprite = this._getStateSprite(state);
        if (this._sprite && sprite) {
            this._sprite.spriteFrame = sprite;
        }
    },

    _updateScaleTransition (state) {
        if (state === State.PRESSED) {
            this._zoomUp();
        } else {
            this._zoomBack();
        }
    },

    _zoomUp () {
        // skip before __preload()
        if (!this._originalScale) {
            return;
        }

        this._fromScale.x = this._originalScale.x;
        this._fromScale.y = this._originalScale.y;
        this._toScale.x = this._originalScale.x * this.zoomScale;
        this._toScale.y = this._originalScale.y * this.zoomScale;
        this.time = 0;
        this._transitionFinished = false;
    },

    _zoomBack () {
        // skip before __preload()
        if (!this._originalScale) {
            return;
        }

        let target = this._getTarget();
        this._fromScale.x = target.scaleX;
        this._fromScale.y = target.scaleY;
        this._toScale.x = this._originalScale.x;
        this._toScale.y = this._originalScale.y;
        this.time = 0;
        this._transitionFinished = false;
    },

    _updateTransition (oldTransition) {
        // Reset to normal data when change transition.
        if (oldTransition === Transition.COLOR) {
            this._updateColorTransitionImmediately(State.NORMAL);
        }
        else if (oldTransition === Transition.SPRITE) {
            this._updateSpriteTransition(State.NORMAL);
        }
        this._updateState();
    },

    _applyTransition (state) {
        let transition = this.transition;
        if (transition === Transition.COLOR) {
            this._updateColorTransition(state);
        } else if (transition === Transition.SPRITE) {
            this._updateSpriteTransition(state);
        } else if (transition === Transition.SCALE) {
            this._updateScaleTransition(state);
        }
    },

    _resizeNodeToTargetNode: CC_EDITOR && function () {
        this.node.setContentSize(this._getTarget().getContentSize());
    },

    _updateDisabledState () {
        if (this._sprite) {
            let useGrayMaterial = false;

            if (this.enableAutoGrayEffect) {
                if (!(this.transition === Transition.SPRITE && this.disabledSprite)) {
                    if (!this.interactable) {
                        useGrayMaterial = true;
                    }
                }
            }

            this._switchGrayMaterial(useGrayMaterial, this._sprite);
        }
    }
});

cc.Button = module.exports = Button;

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event click
 * @param {Event.EventCustom} event
 * @param {Button} button - The Button component.
 */
