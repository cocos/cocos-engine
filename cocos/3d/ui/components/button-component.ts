/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/
// @ts-check
import SpriteFrame from '../../../assets/CCSpriteFrame';
import ComponentEventHandler from '../../../components/CCComponentEventHandler';
import { Component} from '../../../components/component';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../../core/data/class-decorator';
import Event from '../../../core/event/event';
import { lerp } from '../../../core/utils/misc';
import { Color, Vec3 } from '../../../core/value-types/index';
import * as math from '../../../core/vmath/index';
import { Node } from '../../../scene-graph';
import SpriteComponent from './sprite-component';

/**
 * !#en Enum for transition type.
 * !#zh 过渡类型
 * @enum Button.Transition
 */
const Transition = cc.Enum({
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
    SCALE: 3,
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
 *
 * !#zh
 * 按钮组件。可以被按下,或者点击。<br/>
 *
 * 按钮可以通过修改 Transition 来设置按钮状态过渡的方式：<br/>
 *   -Button.Transition.NONE   // 不做任何过渡<br/>
 *   -Button.Transition.COLOR  // 进行颜色之间过渡<br/>
 *   -Button.Transition.SPRITE // 进行精灵之间过渡<br/>
 *   -Button.Transition.SCALE // 进行缩放过渡<br/>
 *
 * 按钮可以绑定事件（但是必须要在按钮的 Node 上才能绑定事件）：<br/>
 *   // 以下事件可以在全平台上都触发<br/>
 *   -cc.NodeUI.EventType.TOUCH_START  // 按下时事件<br/>
 *   -cc.NodeUI.EventType.TOUCH_Move   // 按住移动后事件<br/>
 *   -cc.NodeUI.EventType.TOUCH_END    // 按下后松开后事件<br/>
 *   -cc.NodeUI.EventType.TOUCH_CANCEL // 按下取消事件<br/>
 *   // 以下事件只在 PC 平台上触发<br/>
 *   -cc.NodeUI.EventType.MOUSE_DOWN  // 鼠标按下时事件<br/>
 *   -cc.NodeUI.EventType.MOUSE_MOVE  // 鼠标按住移动后事件<br/>
 *   -cc.NodeUI.EventType.MOUSE_ENTER // 鼠标进入目标事件<br/>
 *   -cc.NodeUI.EventType.MOUSE_LEAVE // 鼠标离开目标事件<br/>
 *   -cc.NodeUI.EventType.MOUSE_UP    // 鼠标松开事件<br/>
 *   -cc.NodeUI.EventType.MOUSE_WHEEL // 鼠标滚轮事件<br/>
 *
 * @class Button
 * @extends Component
 * @example
 *
 * // Add an event to the button.
 * button.node.on(cc.NodeUI.EventType.TOUCH_START, function (event) {
 *     cc.log("This is a callback after the trigger event");
 * });
 * // You could also add a click event
 * //Note: In this way, you can't get the touch event info, so use it wisely.
 * button.node.on('click', function (button) {
 *    //The event is a custom event, you could get the Button component via first argument
 * })
 *
 */

@ccclass('cc.ButtonComponent')
@executionOrder(100)
@menu('UI/Button')
@executeInEditMode
export default class ButtonComponent extends Component {

    /**
     * !#en
     * Whether the Button is disabled.
     * If true, the Button will trigger event and do transition.
     * !#zh
     * 按钮事件是否被响应，如果为 false，则按钮将被禁用。
     * @property {Boolean} interactable
     * @default true
     */
    @property
    get interactable () {
        return this._interactable;
    }

    set interactable (value: boolean) {
        if (CC_EDITOR) {
            if (value) {
                this._previousNormalSprite = this.normalSprite;
            } else {
                this.normalSprite = this._previousNormalSprite;
            }
        }
        this._interactable = !this._interactable;
        this._updateState();

        if (!this._interactable) {
            this._resetState();
        }
    }

    set _resizeToTarget (value: boolean) {
        if (value) {
            this._resizeNodeToTargetNode();
        }
    }

    /**
     * !#en When this flag is true, Button target sprite will turn gray when interactable is false.
     * !#zh 如果这个标记为 true，当 button 的 interactable 属性为 false 的时候，会使用内置 shader 让 button 的 target 节点的 sprite 组件变灰
     * @property {Boolean} enableAutoGrayEffect
     */
    // enableAutoGrayEffect: {
    //             default: false,
    //         tooltip: CC_DEV && 'i18n:COMPONENT.button.auto_gray_effect',
    //             notify() {
    //         this._updateDisabledState();
    //     }
    // },

    /**
     * !#en Transition type
     * !#zh 按钮状态改变时过渡方式。
     * @property {Button.Transition} transition
     * @default Button.Transition.Node
     */
    @property({
        type: Transition,
    })
    get transition () {
        return this._transition;
    }

    set transition (value: number) {
        if (this._transition === value) {
            return;
        }

        this._transition = value;
    }

    // color transition

    /**
     * !#en Normal state color.
     * !#zh 普通状态下按钮所显示的颜色。
     * @property {Color} normalColor
     */
    @property
    get normalColor () {
        return this._normalColor;
    }

    set normalColor (value: Color) {
        if (this._normalColor === value) {
            return;
        }

        this._normalColor = value;
        this._updateState();
    }

    /**
     * !#en Pressed state color
     * !#zh 按下状态时按钮所显示的颜色。
     * @property {Color} pressedColor
     */
    @property
    get pressedColor () {
        return this._pressColor;
    }

    set pressedColor (value: Color) {
        if (this._pressColor === value) {
            return;
        }

        this._pressColor = value;
    }

    /**
     * !#en Hover state color
     * !#zh 悬停状态下按钮所显示的颜色。
     * @property {Color} hoverColor
     */
    @property
    get hoverColor () {
        return this._hoverColor;
    }

    set hoverColor (value: Color) {
        if (this._hoverColor === value) {
            return;
        }

        this._hoverColor = value;
    }
    /**
     * !#en Disabled state color
     * !#zh 禁用状态下按钮所显示的颜色。
     * @property {Color} disabledColor
     */
    @property
    get disabledColor () {
        return this._disabledColor;
    }

    set disabledColor (value: Color) {
        if (this._disabledColor === value) {
            return;
        }

        this._disabledColor = value;
        this._updateState();
    }

    /**
     * !#en Color and Scale transition duration
     * !#zh 颜色过渡和缩放过渡时所需时间
     * @property {Number} duration
     */
    @property({
        min: 0,
        max: 10,
    })
    get duration () {
        return this._duration;
    }

    set duration (value: number) {
        if (this._duration === value) {
            return;
        }

        this._duration = 0.1;
    }

    /**
     * !#en  When user press the button, the button will zoom to a scale.
     * The final scale of the button  equals (button original scale * zoomScale)
     * !#zh 当用户点击按钮后，按钮会缩放到一个值，这个值等于 Button 原始 scale * zoomScale
     * @property {Number} zoomScale
     */
    @property
    get zoomScale () {
        return this._zoomScale;
    }

    set zoomScale (value: number) {
        if (this._zoomScale === value) {
            return;
        }

        this._zoomScale = value;
    }

    // sprite transition
    /**
     * !#en Normal state sprite
     * !#zh 普通状态下按钮所显示的 Sprite 。
     * @property {SpriteFrame} normalSprite
     */
    @property({
        type: SpriteFrame,
    })
    get normalSprite () {
        return this._normalSprite;
    }

    set normalSprite (value: SpriteFrame) {
        if (this._normalSprite === value) {
            return;
        }

        this._normalSprite = value;
        this._updateState();
    }

    /**
     * !#en Pressed state sprite
     * !#zh 按下状态时按钮所显示的 Sprite 。
     * @property {SpriteFrame} pressedSprite
     */
    @property({
        type: SpriteFrame,
    })
    get pressedSprite () {
        return this._pressedSprite;
    }

    set pressedSprite (value: SpriteFrame) {
        if (this._pressedSprite === value) {
            return;
        }

        this._pressedSprite = value;
        this._updateState();
    }

    /**
     * !#en Hover state sprite
     * !#zh 悬停状态下按钮所显示的 Sprite 。
     * @property {SpriteFrame} hoverSprite
     */
    @property({
        type: SpriteFrame,
    })
    get hoverSprite () {
        return this._hoverSprite;
    }

    set hoverSprite (value: SpriteFrame) {
        if (this._hoverSprite === value) {
            return;
        }

        this._hoverSprite = value;
        this._updateState();
    }

    /**
     * !#en Disabled state sprite
     * !#zh 禁用状态下按钮所显示的 Sprite 。
     * @return {SpriteFrame}
     */
    @property({
        type: SpriteFrame,
    })
    get disabledSprite () {
        return this._disabledSprite;
    }

    set disabledSprite (value: SpriteFrame) {
        if (this._disabledSprite === value) {
            return;
        }

        this._disabledSprite = value;
        this._updateState();
    }

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
    @property
    get target () {
        return this._target;
    }

    set target (value: Node) {
        if (this._target === value) {
            return;
        }

        this._target = value;
        this._applyTarget();
    }

    /**
     * !#en If Button is clicked, it will trigger event's handler
     * !#zh 按钮的点击事件列表。
     * @property {ComponentEventHandler[]} clickEvents
     */
    @property({
        type: ComponentEventHandler,
    })
    get clickEvents () {
        return this._clickEvents;
    }

    set clickEvents (value: ComponentEventHandler[]) {
        this._clickEvents = value;
    }

    public static Transition = Transition;
    @property
    public _interactable: boolean = true;
    @property
    public _transition: number = Transition.NONE;
    @property
    public _normalColor: Color = cc.color(214, 214, 214);
    @property
    public _hoverColor: Color = cc.color(211, 211, 211);
    @property
    public _pressColor: Color = cc.Color.WHITE;
    @property
    public _disabledColor: Color = cc.color(124, 124, 124);
    @property
    public _normalSprite: SpriteFrame | null = null;
    @property
    public _hoverSprite: SpriteFrame | null = null;
    @property
    public _pressedSprite: SpriteFrame | null = null;
    @property
    public _disabledSprite = null;
    @property
    public _duration: number = 0.1;
    @property
    public _zoomScale: number = 1.2;
    @property
    public _target: Node = null;
    @property
    public _clickEvents: ComponentEventHandler[] = [];

    public _pressed: boolean = false;
    public _hovered: boolean = false;
    public _fromColor: Color = cc.color();
    public _toColor: Color = cc.color();
    public _time: number = 0;
    public _transitionFinished: boolean = true;
    public _fromScale: Vec3 = cc.v3();
    public _toScale: Vec3 = cc.v3();
    public _originalScale: Vec3 = cc.v3();
    public _sprite: SpriteComponent | null = null;
    public _previousNormalSprite: SpriteFrame | null = null;

    constructor () {
        super();
        if (CC_EDITOR) {
            this._previousNormalSprite = null;
        }
    }

    public __preload () {
        if (!this.target) {
            this.target = this.node;
        }
        this._applyTarget();
        this._updateState();
    }

    public _resetState () {
        this._pressed = false;
        this._hovered = false;
        // // Restore button status
        const target = this.target;
        const renderComp = this.target.getComponent(cc.RenderComponent);
        const transition = this.transition;
        if (transition === Transition.COLOR && this.interactable) {
            renderComp.color = this.normalColor;
        } else if (transition === Transition.SCALE) {
            target.scale = this._originalScale;
        }
        this._transitionFinished = true;
    }

    public onEnable () {
        // check sprite frames
        if (this._normalSprite) {
            this._normalSprite.ensureLoadTexture();
        }
        if (this._hoverSprite) {
            this._hoverSprite.ensureLoadTexture();
        }
        if (this._pressedSprite) {
            this._pressedSprite.ensureLoadTexture();
        }
        if (this._disabledSprite) {
            this._disabledSprite.ensureLoadTexture();
        }
        //
        if (!CC_EDITOR) {
            this._registerEvent();
        } else {
            this.node.on('spriteframe-changed', function (comp) {
                if (this._transition === Transition.SPRITE) {
                    this._normalSprite = comp.spriteFrame;
                }
            }.bind(this));
        }
    }

    public onDisable () {
        this._resetState();

        if (!CC_EDITOR) {
            this.node.off(cc.NodeUI.EventType.TOUCH_START, this._onTouchBegan, this);
            this.node.off(cc.NodeUI.EventType.TOUCH_MOVE, this._onTouchMove, this);
            this.node.off(cc.NodeUI.EventType.TOUCH_END, this._onTouchEnded, this);
            this.node.off(cc.NodeUI.EventType.TOUCH_CANCEL, this._onTouchCancel, this);

            this.node.off(cc.NodeUI.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
            this.node.off(cc.NodeUI.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
        } else {
            this.node.off('spriteframe-changed');
        }
    }

    public update (dt) {
        const target = this._target;
        if (this._transitionFinished) {
            return;
        }

        if (this._transition !== Transition.COLOR && this._transition !== Transition.SCALE) {
            return;
        }

        this._time += dt;
        let ratio = 1.0;
        if (this._duration > 0) {
            ratio = this._time / this._duration;
        }

        if (ratio >= 1) {
            ratio = 1;
            this._transitionFinished = true;
        }

        const renderComp = target.getComponent(cc.RenderComponent);
        if (this._transition === Transition.COLOR) {
            renderComp.color = this._fromColor.lerp(this._toColor, ratio);
        } else if (this.transition === Transition.SCALE) {
            // target.scale = lerp(this._fromScale, this._toScale, ratio);
            target.scaleX = lerp(this._fromScale.x, this._toScale.x, ratio);
            target.scaleY = lerp(this._fromScale.y, this._toScale.y, ratio);
        }
    }

    public _registerEvent () {
        this.node.on(cc.NodeUI.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(cc.NodeUI.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.NodeUI.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(cc.NodeUI.EventType.TOUCH_CANCEL, this._onTouchCancel, this);

        this.node.on(cc.NodeUI.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
        this.node.on(cc.NodeUI.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
    }

    public _getTargetSprite (target: Node | null) {
        let sprite = null;
        if (target) {
            sprite = target.getComponent(cc.SpriteComponent);
        }
        return sprite;
    }

    public _applyTarget () {
        this._sprite = this._getTargetSprite(this._target);
        if (this._target) {
            math.vec3.copy(this._originalScale, this.target._lscale);
        }
    }

    // touch event handler
    public _onTouchBegan (event: Event | null) {
        if (!this._interactable || !this.enabledInHierarchy) { return; }

        this._pressed = true;
        this._updateState();
        event.stopPropagation();
    }

    public _onTouchMove (event: Event | null) {
        if (!this._interactable || !this.enabledInHierarchy || !this._pressed) { return; }
        // mobile phone will not emit _onMouseMoveOut,
        // so we have to do hit test when touch moving
        const touch = event.touch;
        const hit = this.node._hitTest(touch.getLocation());

        if (this._transition === Transition.SCALE && this._target) {
            if (hit) {
                this._fromScale = this._originalScale;
                math.vec3.scale(this._toScale, this._originalScale, this._zoomScale);
                this._transitionFinished = false;
            } else {
                this._time = 0;
                this._transitionFinished = true;
                this._target.scaleX = this._originalScale.x;
                this._target.scaleY = this._originalScale.y;
            }
        } else {
            let state;
            if (hit) {
                state = 'pressed';
            } else {
                state = 'normal';
            }
            this._applyTransition(state);
        }
        event.stopPropagation();
    }

    public _onTouchEnded (event: Event | null) {
        if (!this._interactable || !this.enabledInHierarchy) { return; }

        if (this._pressed) {
            ComponentEventHandler.emitEvents(this._clickEvents, event);
            this.node.emit('click', this);
        }
        this._pressed = false;
        this._updateState();
        event.stopPropagation();
    }

    public _onTouchCancel () {
        if (!this._interactable || !this.enabledInHierarchy) { return; }

        this._pressed = false;
        this._updateState();
    }

    public _onMouseMoveIn () {
        if (this._pressed || !this.interactable || !this.enabledInHierarchy) { return; }
        if (this._transition === Transition.SPRITE && !this._hoverSprite) { return; }

        if (!this._hovered) {
            this._hovered = true;
            this._updateState();
        }
    }

    public _onMouseMoveOut () {
        if (this._hovered) {
            this._hovered = false;
            this._updateState();
        }
    }

    // state handler
    public _updateState () {
        const state = this._getButtonState();
        this._applyTransition(state);
        // this._updateDisabledState();
    }

    public _getButtonState () {
        let state;
        if (!this._interactable) {
            state = 'disabled';
        } else if (this._pressed) {
            state = 'pressed';
        } else if (this._hovered) {
            state = 'hover';
        } else {
            state = 'normal';
        }
        return state;
    }

    public _updateColorTransition (state: string) {
        const color = this[state + 'Color'];
        const target = this._target;

        const renderComp = target.getComponent(cc.RenderComponent);
        if (!renderComp) {
            return;
        }

        if (CC_EDITOR) {
            renderComp.color = color;
        } else {
            this._fromColor = renderComp.color.clone();
            this._toColor = color;
            this._time = 0;
            this._transitionFinished = false;
        }
    }

    public _updateSpriteTransition (state: string) {
        const sprite = this[state + 'Sprite'];
        if (this._sprite && sprite) {
            this._sprite.spriteFrame = sprite;
        }
    }

    public _updateScaleTransition (state: string) {
        if (state === 'pressed') {
            this._zoomUp();
        } else {
            this._zoomBack();
        }
    }

    public _zoomUp () {
        math.vec3.copy(this._fromScale, this._originalScale);
        math.vec3.scale(this._toScale, this._originalScale, this._zoomScale);
        this._time = 0;
        this._transitionFinished = false;
    }

    public _zoomBack () {
        math.vec3.copy(this._fromScale, this.target._lscale);
        math.vec3.copy(this._toScale, this._originalScale);
        this._time = 0;
        this._transitionFinished = false;
    }

    public _applyTransition (state: string) {
        const transition = this._transition;
        if (transition === Transition.COLOR) {
            this._updateColorTransition(state);
        } else if (transition === Transition.SPRITE) {
            this._updateSpriteTransition(state);
        } else if (transition === Transition.SCALE) {
            this._updateScaleTransition(state);
        }
    }

    public _resizeNodeToTargetNode () {
        if (CC_EDITOR && this._target) {
            this.node.setContentSize(this.target.getContentSize());
        }
    }

    // _updateDisabledState() {
    //     if (this._sprite) {
    //         if (this.enableAutoGrayEffect) {
    //             if (!(this._transition === Transition.SPRITE && this._disabledSprite)) {
    //                 if (!this._interactable) {
    //                     this._sprite.setState(cc.SpriteComponent.State.GRAY);
    //                     return;
    //                 }
    //             }
    //         }
    //         this._sprite.setState(cc.SpriteComponent.State.NORMAL);
    //     }
    // }
}

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event click
 * @param {Event.EventCustom} event
 * @param {Button} button - The Button component.
 */
