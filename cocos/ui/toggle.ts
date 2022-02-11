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

import { ccclass, help, requireComponent, executionOrder, menu, tooltip, displayOrder, type, serializable } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { EventHandler as ComponentEventHandler } from '../core/components/component-event-handler';
import { UITransform } from '../2d/framework';
import { Sprite } from '../2d/components/sprite';
import { ToggleContainer } from './toggle-container';
import { extendsEnum } from '../core/data/utils/extends-enum';
import { EventType as ButtonEventType, Button } from './button';
import { legacyCC } from '../core/global-exports';
import { js } from '../core/utils/js';

enum EventType {
    TOGGLE = 'toggle',
}

/**
 * @en
 * The toggle component is a CheckBox, when it used together with a ToggleGroup,
 * it could be treated as a RadioButton.
 *
 * @zh
 * Toggle 是一个 CheckBox，当它和 ToggleGroup 一起使用的时候，可以变成 RadioButton。
 */
@ccclass('cc.Toggle')
@help('i18n:cc.Toggle')
@executionOrder(110)
@menu('UI/Toggle')
@requireComponent(UITransform)
export class Toggle extends Button {
    /**
     * @en
     * When this value is true, the check mark component will be enabled,
     * otherwise the check mark component will be disabled.
     *
     * @zh
     * 如果这个设置为 true，则 check mark 组件会处于 enabled 状态，否则处于 disabled 状态。
     */
    @displayOrder(2)
    @tooltip('i18n:toggle.isChecked')
    get isChecked () {
        return this._isChecked;
    }

    set isChecked (value) {
        this._set(value);
    }

    /**
     * @en
     * The image used for the checkmark.
     *
     * @zh
     * Toggle 处于选中状态时显示的图片。
     */
    @type(Sprite)
    @displayOrder(3)
    @tooltip('i18n:toggle.checkMark')
    get checkMark () {
        return this._checkMark;
    }

    set checkMark (value) {
        if (this._checkMark === value) {
            return;
        }

        this._checkMark = value;
    }

    set _resizeToTarget (value: boolean) {
        if (value) {
            this._resizeNodeToTargetNode();
        }
    }

    get _toggleContainer () {
        const parent = this.node.parent!;
        if (legacyCC.Node.isNode(parent)) {
            return parent.getComponent('cc.ToggleContainer') as ToggleContainer;
        }
        return null;
    }

    public static EventType = extendsEnum(EventType, ButtonEventType);

    /**
     * @en
     * If Toggle is clicked, it will trigger event's handler.
     *
     * @zh
     * Toggle 按钮的点击事件列表。
     */
    @type([ComponentEventHandler])
    @serializable
    @tooltip('i18n:toggle.check_events')
    public checkEvents: ComponentEventHandler[] = [];
    @serializable
    protected _isChecked = true;
    @serializable
    protected _checkMark: Sprite | null = null;

    protected _internalToggle () {
        this.isChecked = !this.isChecked;
    }

    protected _set (value: boolean, emitEvent = true) {
        if (this._isChecked == value) return;

        this._isChecked = value;

        const group = this._toggleContainer;
        if (group && group.enabled && this.enabled) {
            if (value || (!group.anyTogglesChecked() && !group.allowSwitchOff)) {
                this._isChecked = true;
                group.notifyToggleCheck(this, emitEvent);
            }
        }

        this.playEffect();
        if (emitEvent) {
            this._emitToggleEvents();
        }
    }

    //
    public playEffect () {
        if (this._checkMark) {
            this._checkMark.node.active = this._isChecked;
        }
    }

    /**
     * @en
     * Set isChecked without invoking checkEvents.
     *
     * @zh
     * 设置 isChecked 而不调用 checkEvents 回调。
     *
     * @param value - 是否被按下
     */
    public setIsCheckedWithoutNotify (value: boolean) {
        this._set(value, false);
    }

    public onEnable () {
        super.onEnable();
        this.playEffect();
        if (!EDITOR || legacyCC.GAME_VIEW) {
            this.node.on(Toggle.EventType.CLICK, this._internalToggle, this);
        }
    }

    public onDisable () {
        super.onDisable();
        if (!EDITOR || legacyCC.GAME_VIEW) {
            this.node.off(Toggle.EventType.CLICK, this._internalToggle, this);
        }
    }

    public OnDestroy () {
        const group = this._toggleContainer;
        if (group) {
            group.ensureValidState();
        }
    }

    protected _emitToggleEvents () {
        this.node.emit(Toggle.EventType.TOGGLE, this);
        if (this.checkEvents) {
            ComponentEventHandler.emitEvents(this.checkEvents, this);
        }
    }
}

/**
 * @en
 * Note: This event is emitted from the node to which the component belongs.
 *
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event toggle
 * @param {Event.EventCustom} event
 * @param {Toggle} toggle - The Toggle component.
 */

export { Toggle as ToggleComponent };
legacyCC.Toggle = Toggle;
js.setClassAlias(Toggle, 'cc.ToggleComponent');
