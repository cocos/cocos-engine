/*
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
*/

/**
 * 用户界面组件
 * @category ui
 */

import { SpriteFrame } from '../../../assets';
import { Component, EventHandler as ComponentEventHandler } from '../../../components';
import { ccclass, executionOrder, menu, property } from '../../../core/data/class-decorator';
import { EventMouse, EventTouch, SystemEventType } from '../../../core/platform';
import { INode } from '../../../core/utils/interfaces';
import { Color, Vec3 } from '../../../core/math';
import { ccenum } from '../../../core/value-types/enum';
import { lerp } from '../../../core/math/utils';
import { Node } from '../../../scene-graph/node';
import { SpriteComponent } from './sprite-component';
import { UIRenderComponent } from './ui-render-component';

/**
 * @zh
 * 过渡类型。
 */
enum Transition {
    /**
     * @zh
     * 不做任何过渡。
     */
    NONE = 0,

    /**
     * @zh
     * 颜色过渡。
     */
    COLOR = 1,

    /**
     * @zh
     * 精灵过渡。
     */
    SPRITE = 2,
    /**
     * @zh
     * 缩放过渡。
     */
    SCALE = 3,
}

ccenum(Transition);

enum State {
    NORMAL = 'normal',
    HOVER = 'hover',
    PRESSED = 'pressed',
    DISABLED = 'disabled',
}

/**
 * @zh
 * 按钮组件。可以被按下,或者点击。<br/>
 * 可通过 cc.ButtonComponent 获得此组件
 *
 * 按钮可以通过修改 Transition 来设置按钮状态过渡的方式：<br/>
 *   -Button.Transition.NONE   // 不做任何过渡<br/>
 *   -Button.Transition.COLOR  // 进行颜色之间过渡<br/>
 *   -Button.Transition.SPRITE // 进行精灵之间过渡<br/>
 *   -Button.Transition.SCALE // 进行缩放过渡<br/>
 *
 * 按钮可以绑定事件（但是必须要在按钮的 Node 上才能绑定事件）：<br/>
 *   // 以下事件可以在全平台上都触发<br/>
 *   -cc.Node.EventType.TOUCH_START  // 按下时事件<br/>
 *   -cc.Node.EventType.TOUCH_Move   // 按住移动后事件<br/>
 *   -cc.Node.EventType.TOUCH_END    // 按下后松开后事件<br/>
 *   -cc.Node.EventType.TOUCH_CANCEL // 按下取消事件<br/>
 *   // 以下事件只在 PC 平台上触发<br/>
 *   -cc.Node.EventType.MOUSE_DOWN  // 鼠标按下时事件<br/>
 *   -cc.Node.EventType.MOUSE_MOVE  // 鼠标按住移动后事件<br/>
 *   -cc.Node.EventType.MOUSE_ENTER // 鼠标进入目标事件<br/>
 *   -cc.Node.EventType.MOUSE_LEAVE // 鼠标离开目标事件<br/>
 *   -cc.Node.EventType.MOUSE_UP    // 鼠标松开事件<br/>
 *   -cc.Node.EventType.MOUSE_WHEEL // 鼠标滚轮事件<br/>
 *
 * @example
 * ```typescript
 * // Add an event to the button.
 * button.node.on(cc.Node.EventType.TOUCH_START, (event) => {
 *     cc.log("This is a callback after the trigger event");
 * });
 * // You could also add a click event
 * //Note: In this way, you can't get the touch event info, so use it wisely.
 * button.node.on('click', (button) => {
 *    //The event is a custom event, you could get the Button component via first argument
 * })
 * ```
 */
@ccclass('cc.ButtonComponent')
@executionOrder(110)
@menu('UI/Button')
export class ButtonComponent extends Component {

    /**
     * @zh
     * 按钮事件是否被响应，如果为 false，则按钮将被禁用。
     */
    @property({
        displayOrder: 1,
    })
    get interactable () {
        return this._interactable;
    }

    set interactable (value) {
        // if (CC_EDITOR) {
        //     if (value) {
        //         this._previousNormalSprite = this.normalSprite;
        //     } else {
        //         this.normalSprite = this._previousNormalSprite;
        //     }
        // }
        this._interactable = value;
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
     * @zh
     * 如果这个标记为 true，当 button 的 interactable 属性为 false 的时候，会使用内置 shader 让 button 的 target 节点的 sprite 组件变灰。
     */
    // TODO:
    // enableAutoGrayEffect: {
    //             default: false,
    //         tooltip: CC_DEV && 'i18n:COMPONENT.button.auto_gray_effect',
    //             notify() {
    //         this._updateDisabledState();
    //     }
    // },

    /**
     * @zh
     * 按钮状态改变时过渡方式。
     */
    @property({
        type: Transition,
        displayOrder: 2,
    })
    get transition () {
        return this._transition;
    }

    set transition (value: Transition) {
        if (this._transition === value) {
            return;
        }

        this._transition = value;
    }

    // color transition

    /**
     * @zh
     * 普通状态下按钮所显示的颜色。
     */
    @property
    // @constget
    get normalColor (): Readonly<Color> {
        return this._normalColor;
    }

    set normalColor (value) {
        if (this._normalColor === value) {
            return;
        }

        this._normalColor.set(value);
        this._updateState();
    }

    /**
     * @zh
     * 按下状态时按钮所显示的颜色。
     */
    @property
    // @constget
    get pressedColor (): Readonly<Color> {
        return this._pressColor;
    }

    set pressedColor (value) {
        if (this._pressColor === value) {
            return;
        }

        this._pressColor.set(value);
    }

    /**
     * @zh
     * 悬停状态下按钮所显示的颜色。
     */
    @property
    // @constget
    get hoverColor (): Readonly<Color> {
        return this._hoverColor;
    }

    set hoverColor (value) {
        if (this._hoverColor === value) {
            return;
        }

        this._hoverColor.set(value);
    }
    /**
     * @zh
     * 禁用状态下按钮所显示的颜色。
     */
    @property
    // @constget
    get disabledColor (): Readonly<Color> {
        return this._disabledColor;
    }

    set disabledColor (value) {
        if (this._disabledColor === value) {
            return;
        }

        this._disabledColor.set(value);
        this._updateState();
    }

    /**
     * @zh
     * 颜色过渡和缩放过渡时所需时间。
     */
    @property({
        min: 0,
        max: 10,
    })
    get duration () {
        return this._duration;
    }

    set duration (value) {
        if (this._duration === value) {
            return;
        }

        this._duration = value;
    }

    /**
     * @zh
     * 当用户点击按钮后，按钮会缩放到一个值，这个值等于 Button 原始 scale * zoomScale。
     */
    @property
    get zoomScale () {
        return this._zoomScale;
    }

    set zoomScale (value) {
        if (this._zoomScale === value) {
            return;
        }

        this._zoomScale = value;
    }

    // sprite transition
    /**
     * @zh
     * 普通状态下按钮所显示的 Sprite。
     */
    @property({
        type: SpriteFrame,
    })
    get normalSprite () {
        return this._normalSprite;
    }

    set normalSprite (value: SpriteFrame | null) {
        if (this._normalSprite === value) {
            return;
        }

        this._normalSprite = value;
        const sprite = this.node.getComponent(SpriteComponent);
        if (sprite) {
            sprite.spriteFrame = value;
        }

        this._updateState();
    }

    /**
     * @zh
     * 按下状态时按钮所显示的 Sprite。
     */
    @property({
        type: SpriteFrame,
    })
    get pressedSprite () {
        return this._pressedSprite;
    }

    set pressedSprite (value: SpriteFrame | null) {
        if (this._pressedSprite === value) {
            return;
        }

        this._pressedSprite = value;
        this._updateState();
    }

    /**
     * @zh
     * 悬停状态下按钮所显示的 Sprite。
     */
    @property({
        type: SpriteFrame,
    })
    get hoverSprite () {
        return this._hoverSprite;
    }

    set hoverSprite (value: SpriteFrame | null) {
        if (this._hoverSprite === value) {
            return;
        }

        this._hoverSprite = value;
        this._updateState();
    }

    /**
     * @zh
     * 禁用状态下按钮所显示的 Sprite。
     */
    @property({
        type: SpriteFrame,
    })
    get disabledSprite () {
        return this._disabledSprite;
    }

    set disabledSprite (value: SpriteFrame | null) {
        if (this._disabledSprite === value) {
            return;
        }

        this._disabledSprite = value;
        this._updateState();
    }

    /**
     * @zh
     * 需要过渡的目标。<br/>
     * 当前按钮状态改变规则：<br/>
     * -如果 Transition type 选择 Button.Transition.NONE，按钮不做任何过渡。<br/>
     * -如果 Transition type 选择 Button.Transition.COLOR，按钮会对目标颜色进行颜色之间的过渡。<br/>
     * -如果 Transition type 选择 Button.Transition.Sprite，按钮会对目标 Sprite 进行 Sprite 之间的过渡。<br/>
     */
    @property({
        type: Node,
        displayOrder: 0,
    })
    get target () {
        return this._target;
    }

    set target (value: INode | null) {
        if (this._target === value) {
            return;
        }

        this._target = value;
        this._applyTarget();
    }

    public static Transition = Transition;
    /**
     * @zh
     * 按钮的点击事件列表。
     */
    @property({
        type: ComponentEventHandler,
        displayOrder: 3,
    })
    public clickEvents: ComponentEventHandler[] = [];
    @property
    private _interactable = true;
    @property
    private _transition = Transition.NONE;
    @property
    private _normalColor: Color = new Color(214, 214, 214, 255);
    @property
    private _hoverColor: Color = new Color(211, 211, 211, 255);
    @property
    private _pressColor: Color = Color.WHITE;
    @property
    private _disabledColor: Color = new Color(124, 124, 124, 255);
    @property
    private _normalSprite: SpriteFrame | null = null;
    @property
    private _hoverSprite: SpriteFrame | null = null;
    @property
    private _pressedSprite: SpriteFrame | null = null;
    @property
    private _disabledSprite: SpriteFrame | null = null;
    @property
    private _duration = 0.1;
    @property
    private _zoomScale = 1.2;
    @property
    private _target: INode | null = null;
    private _pressed = false;
    private _hovered = false;
    private _fromColor: Color = new Color();
    private _toColor: Color = new Color();
    private _time = 0;
    private _transitionFinished = true;
    private _fromScale: Vec3 = new Vec3();
    private _toScale: Vec3 = new Vec3();
    private _originalScale: Vec3 = new Vec3();
    private _sprite: SpriteComponent | null = null;
    private _targetScale: Vec3 = new Vec3();

    public __preload () {
        if (!this.target) {
            this.target = this.node;
        }

        const sprite = this.node.getComponent(SpriteComponent);
        if (sprite) {
            this._normalSprite = sprite.spriteFrame;
        }

        this._applyTarget();
        this._updateState();
    }

    public onEnable () {
        // check sprite frames
        //
        if (!CC_EDITOR) {
            this._registerEvent();
        } else {
            this.node.on('spriteframe-changed', (comp: SpriteComponent) => {
                if (this._transition === Transition.SPRITE) {
                    this._normalSprite = comp.spriteFrame;
                } else {
                    // avoid serialization data loss when in no-sprite mode
                    this._normalSprite = null;
                    this._hoverSprite = null;
                    this._pressedSprite = null;
                    this._disabledSprite = null;
                }
            }, this);
        }
    }

    public onDisable () {
        this._resetState();

        if (!CC_EDITOR) {
            this.node.off(SystemEventType.TOUCH_START, this._onTouchBegan, this);
            this.node.off(SystemEventType.TOUCH_MOVE, this._onTouchMove, this);
            this.node.off(SystemEventType.TOUCH_END, this._onTouchEnded, this);
            this.node.off(SystemEventType.TOUCH_CANCEL, this._onTouchCancel, this);

            this.node.off(SystemEventType.MOUSE_ENTER, this._onMouseMoveIn, this);
            this.node.off(SystemEventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
        } else {
            this.node.off('spriteframe-changed');
        }
    }

    public update (dt: number) {
        const target = this._target ? this._target : this.node;
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

        const renderComp = target.getComponent(UIRenderComponent);
        if (!renderComp) {
            return;
        }

        if (this._transition === Transition.COLOR) {
            Color.lerp(renderComp.color, this._fromColor, this._toColor, ratio);
        } else if (this.transition === Transition.SCALE) {
            target.getScale(this._targetScale);
            this._targetScale.x = lerp(this._fromScale.x, this._toScale.x, ratio);
            this._targetScale.y = lerp(this._fromScale.y, this._toScale.y, ratio);
            target.setScale(this._targetScale);
        }
    }

    protected _resizeNodeToTargetNode () {
        if (CC_EDITOR && this._target) {
            this.node.setContentSize(this._target.getContentSize());
        }
    }

    private _resetState () {
        this._pressed = false;
        this._hovered = false;
        // Restore button status
        const target = this._target;
        if (!target) {
            return;
        }
        const renderComp = target.getComponent(UIRenderComponent);
        if (!renderComp) {
            return;
        }

        const transition = this._transition;
        if (transition === Transition.COLOR && this._interactable) {
            renderComp.color = this._normalColor;
        } else if (transition === Transition.SCALE) {
            target.setScale(this._originalScale);
        }
        this._transitionFinished = true;
    }

    private _registerEvent () {
        this.node.on(SystemEventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(SystemEventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(SystemEventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(SystemEventType.TOUCH_CANCEL, this._onTouchCancel, this);

        this.node.on(SystemEventType.MOUSE_ENTER, this._onMouseMoveIn, this);
        this.node.on(SystemEventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
    }

    private _getTargetSprite (target: INode | null) {
        let sprite: SpriteComponent | null = null;
        if (target) {
            sprite = target.getComponent(SpriteComponent);
        }
        return sprite;
    }

    private _applyTarget () {
        this._sprite = this._getTargetSprite(this._target);
        if (this._target) {
            Vec3.copy(this._originalScale, this._target.getScale());
        }
    }

    // touch event handler
    private _onTouchBegan (event?: EventTouch) {
        if (!this._interactable || !this.enabledInHierarchy) { return; }

        this._pressed = true;
        this._updateState();
        if (event) {
            event.propagationStopped = true;
        }
    }

    private _onTouchMove (event?: EventTouch) {
        if (!this._interactable || !this.enabledInHierarchy || !this._pressed) { return; }
        // mobile phone will not emit _onMouseMoveOut,
        // so we have to do hit test when touch moving
        if (!event) {
            return false;
        }

        const touch = (event as EventTouch).touch;
        if (!touch) {
            return false;
        }

        const hit = this.node.uiTransfromComp!.isHit(touch.getUILocation());

        if (this._transition === Transition.SCALE && this._target) {
            if (hit) {
                Vec3.copy(this._fromScale, this._originalScale);
                Vec3.multiplyScalar(this._toScale, this._originalScale, this._zoomScale);
                this._transitionFinished = false;
            } else {
                this._time = 0;
                this._transitionFinished = true;
                if (this._target) {
                    this._target!.setScale(this._originalScale);
                }
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

        if (event) {
            event.propagationStopped = true;
        }
    }

    private _onTouchEnded (event?: EventTouch) {
        if (!this._interactable || !this.enabledInHierarchy) {
            return;
        }

        if (this._pressed) {
            ComponentEventHandler.emitEvents(this.clickEvents, event);
            this.node.emit('click', this);
        }
        this._pressed = false;
        this._updateState();

        if (event) {
            event.propagationStopped = true;
        }
    }

    private _onTouchCancel (event?: EventTouch) {
        if (!this._interactable || !this.enabledInHierarchy) { return; }

        this._pressed = false;
        this._updateState();
    }

    private _onMouseMoveIn (event?: EventMouse) {
        if (this._pressed || !this.interactable || !this.enabledInHierarchy) { return; }
        if (this._transition === Transition.SPRITE && !this._hoverSprite) { return; }

        if (!this._hovered) {
            this._hovered = true;
            this._updateState();
        }
    }

    private _onMouseMoveOut (event?: EventMouse) {
        if (this._hovered) {
            this._hovered = false;
            this._updateState();
        }
    }

    // state handler
    private _updateState () {
        const state = this._getButtonState();
        this._applyTransition(state);
        // this._updateDisabledState();
    }

    private _getButtonState () {
        let state = State.NORMAL;
        if (!this._interactable) {
            state = State.DISABLED;
        } else if (this._pressed) {
            state = State.PRESSED;
        } else if (this._hovered) {
            state = State.HOVER;
        }
        return state.toString();
    }

    private _updateColorTransition (state: string) {
        const color = this[state + 'Color'];
        const target = this._target;
        if (!target) {
            return;
        }

        const renderComp = target.getComponent(UIRenderComponent);
        if (!renderComp) {
            return;
        }

        if (CC_EDITOR || state === State.DISABLED) {
            renderComp.color = color;
        } else {
            this._fromColor = renderComp.color.clone();
            this._toColor = color;
            this._time = 0;
            this._transitionFinished = false;
        }
    }

    private _updateSpriteTransition (state: string) {
        const sprite = this[state + 'Sprite'];
        if (this._sprite && sprite) {
            this._sprite.spriteFrame = sprite;
        }
    }

    private _updateScaleTransition (state: string) {
        if (!this._interactable) {
            return;
        }

        if (state === State.PRESSED) {
            this._zoomUp();
        } else {
            this._zoomBack();
        }
    }

    private _zoomUp () {
        Vec3.copy(this._fromScale, this._originalScale);
        Vec3.multiplyScalar(this._toScale, this._originalScale, this._zoomScale);
        this._time = 0;
        this._transitionFinished = false;
    }

    private _zoomBack () {
        if (!this._target) {
            return;
        }

        Vec3.copy(this._fromScale, this._target.getScale());
        Vec3.copy(this._toScale, this._originalScale);
        this._time = 0;
        this._transitionFinished = false;
    }

    private _applyTransition (state: string) {
        const transition = this._transition;
        if (transition === Transition.COLOR) {
            this._updateColorTransition(state);
        } else if (transition === Transition.SPRITE) {
            this._updateSpriteTransition(state);
        } else if (transition === Transition.SCALE) {
            this._updateScaleTransition(state);
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

cc.ButtonComponent = ButtonComponent;

/**
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event click
 * @param {Event.EventCustom} event
 * @param {Button} button - The Button component.
 */
