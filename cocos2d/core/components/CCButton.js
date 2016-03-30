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
/**
 * !#en Enum for transition type.
 * !#zh 过渡类型
 * @enum Button.Transition
 */
var Transition = cc.Enum({
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
    SPRITE: 2
});

/**
 * !#en
 * Button has 3 Transition types
 * When Button state changed:
 *  If Transition type is Button.Transition.NONE, Button will do nothing
 *  If Transition type is Button.Transition.COLOR, Button will change target's color
 *  If Transition type is Button.Transition.SPRITE, Button will change target Sprite's sprite
 *
 * Button will trigger 5 events:
 *  Button.EVENT_TOUCH_DOWN
 *  Button.EVENT_TOUCH_UP
 *  Button.EVENT_HOVER_IN
 *  Button.EVENT_HOVER_MOVE
 *  Button.EVENT_HOVER_OUT
 *
 * !#zh
 * 按钮组件。可以被按下,或者点击。</br>
 *
 * 按钮可以通过修改 Transition 来设置按钮状态过渡的方式：</br>
 *   -Button.Transition.NONE   // 不做任何过渡</br>
 *   -Button.Transition.COLOR  // 进行颜色之间过渡</br>
 *   -Button.Transition.SPRITE // 进行精灵之间过渡</br>
 *
 * 按钮可以绑定事件（但是必须要在按钮的 Node 上才能绑定事件）：</br>
 *   // 以下事件可以在全平台上都触发</br>
 *   -cc.Node.EventType.TOUCH_START  // 按下时事件</br>
 *   -cc.Node.EventType.TOUCH_Move   // 按住移动后事件</br>
 *   -cc.Node.EventType.TOUCH_END    // 按下后松开后事件</br>
 *   -cc.Node.EventType.TOUCH_CANCEL // 按下取消事件</br>
 *   // 以下事件只在 PC 平台上触发</br>
 *   -cc.Node.EventType.MOUSE_DOWN  // 鼠标按下时事件</br>
 *   -cc.Node.EventType.MOUSE_MOVE  // 鼠标按住移动后事件</br>
 *   -cc.Node.EventType.MOUSE_ENTER // 鼠标进入目标事件</br>
 *   -cc.Node.EventType.MOUSE_LEAVE // 鼠标离开目标事件</br>
 *   -cc.Node.EventType.MOUSE_UP    // 鼠标松开事件</br>
 *   -cc.Node.EventType.MOUSE_WHEEL // 鼠标滚轮事件</br>
 *
 * @class Button
 * @extends Component
 * @example
 *
 * // Add an event to the button.
 * button.node.on(cc.Node.EventType.TOUCH_START, function (event) {
 *      cc.log("This is a callback after the trigger event");
 * });
 *
 */
var Button = cc.Class({
    name: 'cc.Button',
    extends: require('./CCComponent'),

    ctor: function () {
        this._pressed = false;
        this._hovered = false;

        this._sprite = null;

        this._fromColor = null;
        this._toColor = null;
        this._time = 0;
        this._transitionFinished = true;
    },

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/Button',
        help: 'app://docs/html/components/button.html',
        inspector: 'app://editor/page/inspector/button/button.html',
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
            tooltip: 'i18n:COMPONENT.button.interactable',
            notify: function () {
                this._updateState();
            },
            animatable: false
        },

        /**
         * !#en Transition type
         * !#zh 按钮状态改变时过渡方式。
         * @property {Button.Transition} transition
         * @default Button.Transition.Node
         */
        transition: {
            default: Transition.NONE,
            tooltip: 'i18n:COMPONENT.button.transition',
            type: Transition,
            animatable: false
        },

        // color transition

        /**
         * !#en Normal state color.
         * !#zh 普通状态下按钮所显示的颜色。
         * @property {Color} normalColor
         */
        normalColor: {
            default: cc.color(214, 214, 214),
            displayName: 'Normal',
            tooltip: 'i18n:COMPONENT.button.normal_color',
            notify: function () {
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
            tooltip: 'i18n:COMPONENT.button.pressed_color',
        },

        /**
         * !#en Hover state color
         * !#zh 悬停状态下按钮所显示的颜色。
         * @property {Color} hoverColor
         */
        hoverColor: {
            default: cc.Color.WHITE,
            displayName: 'Hover',
            tooltip: 'i18n:COMPONENT.button.hover_color',
        },

        /**
         * !#en Disabled state color
         * !#zh 禁用状态下按钮所显示的颜色。
         * @property {Color} disabledColor
         */
        disabledColor: {
            default: cc.color(124, 124, 124),
            displayName: 'Disabled',
            tooltip: 'i18n:COMPONENT.button.diabled_color',
            notify: function () {
                this._updateState();
            }
        },

        /**
         * !#en Color transition duration
         * !#zh 颜色过渡时所需时间
         * @property {Number} duration
         */
        duration: {
            default: 0.1,
            range: [0, 10],
            tooltip: 'i18n:COMPONENT.button.duration',
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
            tooltip: 'i18n:COMPONENT.button.normal_sprite',
            notify: function () {
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
            tooltip: 'i18n:COMPONENT.button.pressed_sprite',
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
            tooltip: 'i18n:COMPONENT.button.hover_sprite',
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
            tooltip: 'i18n:COMPONENT.button.disabled_sprite',
            notify: function () {
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
         * 当前按钮状态改变有：
         * -如果 Transition type 选择 Button.Transition.NONE，按钮不做任何过渡。
         * -如果 Transition type 选择 Button.Transition.COLOR，按钮会对目标颜色进行颜色之间的过渡。
         * -如果 Transition type 选择 Button.Transition.NONE，按钮会对目标 Sprite 进行 Sprite 之间的过渡。
         * @property {Node} target
         */
        target: {
            default: null,
            type: cc.Node,
            tooltip: "i18n:COMPONENT.button.target",
            notify: function () {
                this._applyTarget();
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
            tooltip: 'i18n:COMPONENT.button.click_events',
        }
    },

    statics: {
        Transition: Transition,
    },

    onLoad: function () {
        if (!this.target) {
            this.target = this.node;
        }

        if (!CC_EDITOR) {
            this._registerEvent();
        }
    },

    start: function () {
        this._applyTarget();
        this._updateState();
    },

    update: function (dt) {
        var target = this.target;
        if (!this.transition === Transition.COLOR || !target || this._transitionFinished) return;

        this.time += dt;
        var ratio = this.time / this.duration;
        if (ratio > 1) {
            ratio = 1;
            this._transitionFinished = true;
        }

        target.color = this._fromColor.lerp(this._toColor, ratio);
    },

    _registerEvent: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);

        this.node.on(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
    },

    _cancelButtonClick: function(){
        this._pressed = false;
    },

    _applyTarget: function () {
        var target = this.target;
        if (target) {
            this._sprite = target.getComponent(cc.Sprite);
        }
        else {
            this._sprite = null;
        }
    },

    // touch event handler
    _onTouchBegan: function (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;

        this._pressed = true;
        this._updateState();
    },

    _onTouchMove: function (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;
        // mobile phone will not emit _onMouseMoveOut,
        // so we have to do hit test when touch moving
        var touch = event.touch;
        var hit = this.node._hitTest(touch.getLocation());
        var state;
        if (hit) {
            state = 'pressed';
        } else {
            state = 'normal';
        }
        var color  = this[state + 'Color'];
        var sprite = this[state + 'Sprite'];

        this._applyTransition(color, sprite);
    },

    _onTouchEnded: function (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;

        if (this._pressed) {
            cc.Component.EventHandler.emitEvents(this.clickEvents, event);
        }
        this._pressed = false;
        this._updateState();
    },

    _onTouchCancel: function () {
        if (!this.interactable || !this.enabledInHierarchy) return;

        this._pressed = false;
        this._updateState();
    },

    _onMouseMoveIn: function (event) {
        if (this._pressed || !this.interactable || !this.enabledInHierarchy) return;

        if (!this._hovered) {
            this._hovered = true;
            this._updateState();
        }
    },

    _onMouseMoveOut: function(){
        if (this._hovered) {
            this._hovered = false;
            this._updateState();
        }
    },

    // state handler
    _updateState: function () {
        var state;
        if (!this.interactable) {
            state = 'disabled';
        }
        else if (this._pressed) {
            state = 'pressed';
        }
        else if (this._hovered) {
            state = 'hover';
        }
        else {
            state = 'normal';
        }
        var color  = this[state + 'Color'];
        var sprite = this[state + 'Sprite'];

        this._applyTransition(color, sprite);
    },

    onDisable: function() {
        this._hovered = false;
        this._pressed = false;
    },

    _applyTransition: function (color, sprite) {
        var transition = this.transition;

        if (transition === Transition.COLOR) {
            var target = this.target;

            if (CC_EDITOR) {
                target.color = color;
            }
            else {
                this._fromColor = target.color.clone();
                this._toColor = color;
                this.time = 0;
                this._transitionFinished = false;
            }
        }
        else if (transition === Transition.SPRITE && this._sprite && sprite) {
            this._sprite.spriteFrame = sprite;
        }
    },

});

cc.Button = module.exports = Button;
