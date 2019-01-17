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

import { Component} from '../../../components/component';
import { clamp01 } from '../../../core/utils/misc';
import { ccclass, menu, executionOrder, executeInEditMode, property } from '../../../core/data/class-decorator';
import SpriteComponent from './sprite-component';
import { Vec2 } from '../../../core/value-types/index';
import ComponentEventHandler from '../../../components/CCComponentEventHandler';
import Event from '../../../core/event/event';
import { EventTouch } from '../../../core/platform/event-manager/CCEvent';
/**
 * !#en The Slider Direction
 * !#zh 滑动器方向
 * @enum Slider.Direction
 */
var Direction = cc.Enum({
    /**
     * !#en The horizontal direction.
     * !#zh 水平方向
     * @property {Number} Horizontal
     */
    Horizontal: 0,
    /**
     * !#en The vertical direction.
     * !#zh 垂直方向
     * @property {Number} Vertical
     */
    Vertical: 1
});

/**
 * !#en The Slider Control
 * !#zh 滑动器组件
 * @class Slider
 * @extends Component
 */
@ccclass('cc.SliderComponent')
@executionOrder(100)
@menu('UI/Slider')
// @executeInEditMode
export default class SliderComponent extends Component {
    @property
    _handle: SpriteComponent | null = null;
    @property
    _direction: number = Direction.Horizontal;
    @property
    _progress: number = 0.1;
    @property
    _slideEvents: ComponentEventHandler[] = [];

    _offset: Vec2 = cc.v2();
    _dragging = false;
    _touchHandle = false;

    /**
     * !#en The "handle" part of the slider
     * !#zh 滑动器滑块按钮部件
     * @property {Button} handle
     */
    @property({
        type: SpriteComponent
    })
    get handle() {
        return this._handle;
    }

    set handle(value: SpriteComponent) {
        if (this._handle === value) {
            return;
        }

        this._handle = value;
        if (CC_EDITOR && this._handle) {
            this._updateHandlePosition();
        }
    }

    /**
     * !#en The slider direction
     * !#zh 滑动器方向
     * @property {Slider.Direction} direction
     */
    @property({
        type: Direction
    })
    get direction() {
        return this._direction;
    }

    set direction(value: number) {
        if (this._direction === value) {
            return;
        }

        this._direction = value;
    }
    /**
     * !#en The current progress of the slider. The valid value is between 0-1
     * !#zh 当前进度值，该数值的区间是 0-1 之间
     * @property {Number} progress
     */
    @property
    get progress() {
        return this._progress;
    }

    set progress(value: number) {
        if (this._progress === value) {
            return;
        }

        this._progress = value;
        this._updateHandlePosition();
    }

    /**
     * !#en The slider events callback
     * !#zh 滑动器组件事件回调函数
     * @property {ComponentEventHandler[]} slideEvents
     */
    @property({
        type: ComponentEventHandler
    })
    get slideEvents() {
        return this._slideEvents;
    }

    set slideEvents(value: ComponentEventHandler[]) {
        this._slideEvents = value;
    }

    static Direction = Direction;

    __preload() {
        this._updateHandlePosition();
    }

    // 注册事件
    onEnable() {
        this._updateHandlePosition();

        this.node.on(cc.NodeUI.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(cc.NodeUI.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.on(cc.NodeUI.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(cc.NodeUI.EventType.TOUCH_CANCEL, this._onTouchCancelled, this);
        if (this._handle && this._handle.isValid) {
            this._handle.node.on(cc.NodeUI.EventType.TOUCH_START, this._onHandleDragStart, this);
            this._handle.node.on(cc.NodeUI.EventType.TOUCH_MOVE, this._onTouchMoved, this);
            this._handle.node.on(cc.NodeUI.EventType.TOUCH_END, this._onTouchEnded, this);
        }
    }

    onDisable() {
        this.node.off(cc.NodeUI.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(cc.NodeUI.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.off(cc.NodeUI.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.off(cc.NodeUI.EventType.TOUCH_CANCEL, this._onTouchCancelled, this);
        if (this._handle && this._handle.isValid) {
            this._handle.node.off(cc.NodeUI.EventType.TOUCH_START, this._onHandleDragStart, this);
            this._handle.node.off(cc.NodeUI.EventType.TOUCH_MOVE, this._onTouchMoved, this);
            this._handle.node.off(cc.NodeUI.EventType.TOUCH_END, this._onTouchEnded, this);
        }
    }

    _onHandleDragStart(event: Event | null) {
        this._dragging = true;
        this._touchHandle = true;
        this._offset = this._handle.node.convertToNodeSpaceAR(event.touch.getLocation());

        event.stopPropagation();
    }

    _onTouchBegan(event: Event | null) {
        if (!this._handle) { return; }
        this._dragging = true;
        if (!this._touchHandle) {
            this._handleSliderLogic(event.touch);
        }

        event.stopPropagation();
    }

    _onTouchMoved(event: Event | null) {
        if (!this._dragging) { return; }
        this._handleSliderLogic(event.touch);
        event.stopPropagation();
    }

    _onTouchEnded(event: Event | null) {
        this._dragging = false;
        this._touchHandle = false;
        this._offset = cc.v2();
        event.stopPropagation();
    }

    _onTouchCancelled(event: Event | null) {
        this._dragging = false;
        event.stopPropagation();
    }

    _handleSliderLogic(touch) {
        this._updateProgress(touch);
        this._emitSlideEvent();
    }

    _emitSlideEvent() {
        cc.Component.EventHandler.emitEvents(this.slideEvents, this);
        this.node.emit('slide', this);
    }

    _updateProgress(touch: EventTouch | null) {
        if (!this._handle) { return; }
        var localTouchPos = this.node.convertToNodeSpaceAR(touch.getLocation());
        if (this.direction === Direction.Horizontal) {
            this.progress = clamp01(0.5 + (localTouchPos.x - this._offset.x) / this.node.width);
        }
        else {
            this.progress = clamp01(0.5 + (localTouchPos.y - this._offset.y) / this.node.height);
        }
    }

    _updateHandlePosition() {
        if (!this._handle) { return; }
        var handlelocalPos;
        if (this._direction === Direction.Horizontal) {
            handlelocalPos = cc.v2(-this.node.width * this.node.anchorX + this.progress * this.node.width, 0);
        }
        else {
            handlelocalPos = cc.v2(0, -this.node.height * this.node.anchorY + this.progress * this.node.height);
        }
        var worldSpacePos = this.node.convertToWorldSpaceAR(handlelocalPos);
        this._handle.node.setPosition(this._handle.node.parent.convertToNodeSpaceAR(worldSpacePos));
    }
}

// cc.Slider = module.exports = Slider;

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event slide
 * @param {Event.EventCustom} event
 * @param {Slider} slider - The slider component.
 */
