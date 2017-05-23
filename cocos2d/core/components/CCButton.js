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
    SPRITE: 2,
    /**
     * !#en The scale type
     * !#zh 缩放过渡
     * @property {Number} SCALE
     */
    SCALE: 3
});

/**
 * !#en
 * Button has 4 Transition types
 * When Button state changed:
 *  If Transition type is Button.Transition.NONE, Button will do nothing
 *  If Transition type is Button.Transition.COLOR, Button will change target's color
 *  If Transition type is Button.Transition.SPRITE, Button will change target Sprite's sprite
 *  If Transition type is Button.Transition.SCALE, Button will change target node's scale
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
 *   -Button.Transition.SCALE // 进行缩放过渡</br>
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

 * // You could also add a click event
 * //Note: In this way, you can't get the touch event info, so use it wisely.
 * button.node.on('click', function (event) {
 *    //The event is a custom event, you could get the Button component via event.detail
 * })
 *
 */
var Button = cc.Class({
    name: 'cc.Button',
    extends: require('./CCComponent'),

    ctor: function () {
        this._resetState();

        this._fromColor = null;
        this._toColor = null;
        this._time = 0;
        this._transitionFinished = true;
        this._fromScale = 1.0;
        this._toScale = 1.0;
        this._originalScale = 1.0;

        this._sprite = null;

        if(CC_EDITOR) {
            this._previousNormalSprite = null;
        }
    },

    _resetState: function () {
        this._pressed = false;
        this._hovered = false;

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
            notify: function (oldValue) {
                if(CC_EDITOR) {
                    if(oldValue) {
                        this._previousNormalSprite = this.normalSprite;
                    } else {
                        this.normalSprite = this._previousNormalSprite;
                    }
                }
                this._updateState();

                if(!this.interactable) {
                    this._resetState();
                }
            },
            animatable: false
        },

        _resizeToTarget: {
            animatable: false,
            set: function (value) {
                if(value) {
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
            notify: function () {
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
            tooltip: CC_DEV && 'i18n:COMPONENT.button.normal_color',
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
            tooltip: CC_DEV && 'i18n:COMPONENT.button.pressed_color',
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
            notify: function () {
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
            tooltip: CC_DEV && 'i18n:COMPONENT.button.pressed_sprite',
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
            tooltip: CC_DEV && 'i18n:COMPONENT.button.click_events',
        }
    },

    statics: {
        Transition: Transition,
    },

    __preload: function () {
        if (!this.target) {
            this.target = this.node;
        }
        this._applyTarget();
        this._updateState();
    },

    onEnable: function () {
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
        //
        if (!CC_EDITOR) {
            this._registerEvent();
        } else {
            this.node.on('spriteframe-changed', function(event) {
                if (this.transition === Transition.SPRITE) {
                    this.normalSprite = event.detail.spriteFrame;
                }
            }.bind(this));
        }
    },

    update: function (dt) {
        var target = this.target;
        if(this._transitionFinished) return;
        if (this.transition !== Transition.COLOR && this.transition !== Transition.SCALE) return;

        this.time += dt;
        var ratio = 1.0;
        if(this.duration > 0) {
            ratio = this.time / this.duration;
        }

        if (ratio >= 1) {
            ratio = 1;
            this._transitionFinished = true;
        }

        if(this.transition === Transition.COLOR) {
            target.color = this._fromColor.lerp(this._toColor, ratio);
        } else if (this.transition === Transition.SCALE) {
            target.scale = cc.lerp(this._fromScale, this._toScale, ratio);
        }

    },

    _registerEvent: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);

        this.node.on(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
    },

    _getTargetSprite: function (target) {
        var sprite = null;
        if (target) {
            sprite = target.getComponent(cc.Sprite);
        }
        return sprite;
    },

    _applyTarget: function () {
        this._sprite = this._getTargetSprite(this.target);
        if(this.target) {
            this._originalScale = this.target.scale;
        }
    },

    // touch event handler
    _onTouchBegan: function (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;

        this._pressed = true;
        this._updateState();
        event.stopPropagation();
    },

    _onTouchMove: function (event) {
        if (!this.interactable || !this.enabledInHierarchy || !this._pressed) return;
        // mobile phone will not emit _onMouseMoveOut,
        // so we have to do hit test when touch moving
        var touch = event.touch;
        var hit = this.node._hitTest(touch.getLocation());

        if(this.transition === Transition.SCALE && this.target) {
            if(hit) {
                this._fromScale = this._originalScale;
                this._toScale = this._originalScale * this.zoomScale;
                this._transitionFinished = false;
            } else {
                this.time = 0;
                this._transitionFinished = true;
                this.target.scale = this._originalScale;
            }
        } else {
            var state;
            if (hit) {
                state = 'pressed';
            } else {
                state = 'normal';
            }
            this._applyTransition(state);
        }
        event.stopPropagation();
    },

    _onTouchEnded: function (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;

        if (this._pressed) {
            cc.Component.EventHandler.emitEvents(this.clickEvents, event);
            this.node.emit('click', this);
        }
        this._pressed = false;
        this._updateState();
        event.stopPropagation();
    },

    _zoomUp: function () {
        this._fromScale = this._originalScale;
        this._toScale = this._originalScale * this.zoomScale;
        this.time = 0;
        this._transitionFinished = false;
    },

    _zoomBack: function () {
        this._fromScale = this.target.scale;
        this._toScale = this._originalScale;
        this.time = 0;
        this._transitionFinished = false;
    },

    _onTouchCancel: function () {
        if (!this.interactable || !this.enabledInHierarchy) return;

        this._pressed = false;
        this._updateState();
    },

    _onMouseMoveIn: function () {
        if (this._pressed || !this.interactable || !this.enabledInHierarchy) return;
        if (this.transition === Transition.SPRITE && !this.hoverSprite) return;

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
        var state = this._getButtonState();
        this._applyTransition(state);
        this._updateDisabledState();
    },

    onDisable: function() {
        this._hovered = false;
        this._pressed = false;

        if (!CC_EDITOR) {
            this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);

            this.node.off(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
            this.node.off(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
        } else {
            this.node.off('spriteframe-changed');
        }
    },

    _getButtonState: function () {
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
        return state;
    },

    _updateColorTransition: function (state) {
        var color  = this[state + 'Color'];
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
    },

    _updateSpriteTransition: function (state) {
        var sprite = this[state + 'Sprite'];
        if(this._sprite && sprite) {
            this._sprite.spriteFrame = sprite;
        }
    },

    _updateScaleTransition: function (state) {
        if(state === 'pressed') {
            this._zoomUp();
        } else {
            this._zoomBack();
        }
    },

    _applyTransition: function (state) {

        var transition = this.transition;

        if (transition === Transition.COLOR) {
            this._updateColorTransition(state);
        } else if (transition === Transition.SPRITE) {
            this._updateSpriteTransition(state);
        } else if(transition === Transition.SCALE) {
            this._updateScaleTransition(state);
        }
    },

    _resizeNodeToTargetNode: CC_EDITOR && function () {
        if(this.target) {
            this.node.setContentSize(this.target.getContentSize());
        }
    },

    _updateDisabledState: function () {
        if(this._sprite) {
            this._sprite._sgNode.setState(0);
        }
        if(this.enableAutoGrayEffect && this.transition !== Transition.COLOR) {
            if(!(this.transition === Transition.SPRITE && this.disabledSprite)) {
                if(this._sprite && !this.interactable) {
                    this._sprite._sgNode.setState(1);
                }
            }
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
 * @param {Button} event.detail - The Button component.
 */
