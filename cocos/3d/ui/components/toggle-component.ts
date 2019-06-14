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
import { EventHandler as ComponentEventHandler } from '../../../components';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../../core/data/class-decorator';
import { ButtonComponent } from './button-component';
import { SpriteComponent } from './sprite-component';
import { ToggleContainerComponent } from './toggle-container-component';

/**
 * @zh
 * Toggle 是一个 CheckBox，当它和 ToggleGroup 一起使用的时候，可以变成 RadioButton。
 */
@ccclass('cc.ToggleComponent')
@executionOrder(110)
@menu('UI/Toggle')
@executeInEditMode
export class ToggleComponent extends ButtonComponent {

    /**
     * @zh
     * 如果这个设置为 true，则 check mark 组件会处于 enabled 状态，否则处于 disabled 状态。
     */
    @property
    get isChecked () {
        return this._isChecked;
    }

    set isChecked (value) {
        if (this._isChecked === value) {
            return;
        }

        this._isChecked = value;
        this._updateCheckMark();
    }

    /**
     * @zh
     * Toggle 所属的 ToggleGroup，这个属性是可选的。如果这个属性为 null，则 Toggle 是一个 CheckBox，否则，Toggle 是一个 RadioButton。
     */
    @property({
        type: ToggleContainerComponent,
    })
    get toggleGroup () {
        return this._toggleGroup;
    }

    set toggleGroup (value) {
        if (this._toggleGroup === value) {
            return;
        }

        if (this._toggleGroup) {
            this._toggleGroup.removeToggle(this);
        }
        this._toggleGroup = value;
        if (this._toggleGroup && this._toggleGroup.enabled) {
            this._toggleGroup.addToggle(this);
        }
    }

    /**
     * @zh
     * Toggle 处于选中状态时显示的图片。
     */
    @property({
        type: SpriteComponent,
    })
    get checkMark () {
        return this._checkMark;
    }

    set checkMark (value: SpriteComponent | null) {
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
        const parent = this.node.parent;
        // TODO:
        // if (cc.Node.isNode(parent)) {
        //     return parent.getComponent(cc.ToggleContainer);
        // }
        return null;
    }
    /**
     * @zh
     * Toggle 按钮的点击事件列表。
     */
    @property({
        type: ComponentEventHandler,
    })
    public checkEvents: ComponentEventHandler[] = [];
    @property
    private _isChecked: boolean = true;
    @property
    private _toggleGroup: ToggleContainerComponent | null = null;
    @property
    private _checkMark: SpriteComponent | null = null;

    public onEnable () {
        super.onEnable();
        if (!CC_EDITOR) {
            this._registerToggleEvent();
        }

        if (this._toggleGroup && this._toggleGroup.enabled) {
            this._toggleGroup.addToggle(this);
        }
    }

    public onDisable () {
        super.onDisable();
        if (!CC_EDITOR) {
            this._unregisterToggleEvent();
        }
        if (this._toggleGroup && this._toggleGroup.enabled) {
            this._toggleGroup.removeToggle(this);
        }
    }

    /**
     * @zh
     * toggle 按钮切换。
     */
    public toggle () {
        const group = this.toggleGroup || this._toggleContainer;

        if (group && group.enabled && this.isChecked) {
            if (!group.allowSwitchOff) {
                return;
            }
        }

        this.isChecked = !this.isChecked;
        if (group && group.enabled) {
            group.updateToggles(this);
        }

        this._emitToggleEvents();
    }

    /**
     * @zh
     * 使 toggle 按钮处于选中状态。
     */
    public check () {
        const group = this.toggleGroup || this._toggleContainer;

        if (group && group.enabled && this.isChecked) {
            if (!group.allowSwitchOff) {
                return;
            }
        }

        this.isChecked = true;

        if (group && group.enabled) {
            group.updateToggles(this);
        }

        this._emitToggleEvents();
    }

    /**
     * @zh
     * 取消 toggle 按钮选中状态。
     */
    public uncheck () {
        const group = this.toggleGroup || this._toggleContainer;

        if (group && group.enabled && this.isChecked) {
            if (!group.allowSwitchOff) {
                return;
            }
        }

        this.isChecked = false;

        this._emitToggleEvents();
    }

    private _updateCheckMark () {
        if (this._checkMark){
            this._checkMark.node.active = !!this.isChecked;
        }
    }

    // _updateDisabledState() {
    //     this._super();

    //     if (this._checkMark) {
    //         this._checkMark.setState(0);
    //     }
    //     if (this.enableAutoGrayEffect) {
    //         if (this._checkMark && !this.interactable) {
    //             this._checkMark.setState(1);
    //         }
    //     }
    // }

    private _registerToggleEvent () {
        this.node.on('click', this.toggle, this);
    }

    private _unregisterToggleEvent () {
        this.node.off('click', this.toggle, this);
    }

    private _emitToggleEvents () {
        this.node.emit('toggle', this);
        if (this.checkEvents) {
            ComponentEventHandler.emitEvents(this.checkEvents, this);
        }
    }
}

cc.ToggleComponent = ToggleComponent;

// var js = require('../platform/js');

// js.get(Toggle.prototype, '_toggleContainer',
//     function () {
//         var parent = this.node.parent;
//         if (cc.Node.isNode(parent)) {
//             return parent.getComponent(cc.ToggleContainer);
//         }
//         return null;
//     }
// );

/**
 * @zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event toggle
 * @param {Event.EventCustom} event
 * @param {Toggle} toggle - The Toggle component.
 */
