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
 * @category ui
 */

import { Component, EventHandler as ComponentEventHandler } from '../../core/components';
import { ccclass, help, executeInEditMode, executionOrder, menu, property } from '../../core/data/class-decorator';
import { ToggleComponent} from './toggle-component';
import { legacyCC } from '../../core/global-exports';

/**
 * @en
 * ToggleContainer is not a visible UI component but a way to modify the behavior of a set of Toggles. <br/>
 * Toggles that belong to the same group could only have one of them to be switched on at a time.<br/>
 * Note: All the first layer child node containing the toggle component will auto be added to the container.
 *
 * @zh
 * ToggleGroup 不是一个可见的 UI 组件，它可以用来修改一组 Toggle  组件的行为。当一组 Toggle 属于同一个 ToggleGroup 的时候，<br/>
 * 任何时候只能有一个 Toggle 处于选中状态。
 */

@ccclass('cc.ToggleContainerComponent')
@help('i18n:cc.ToggleContainerComponent')
@executionOrder(110)
@menu('UI/ToggleContainer')
@executeInEditMode
export class ToggleContainerComponent extends Component {
    /**
     * @en
     * If Toggle is clicked, it will trigger event's handler.
     *
     * @zh
     * Toggle 按钮的点击事件列表。
     */
    @property({
        type: [ComponentEventHandler],
        tooltip:'选中事件。列表类型，默认为空，用户添加的每一个事件由节点引用，组件名称和一个响应函数组成。',
    })
    public checkEvents: ComponentEventHandler[] = [];
    @property
    protected _allowSwitchOff: boolean = false;
    private _toggleItems: ToggleComponent[] = [];

    /**
     * @en
     * If this setting is true, a toggle could be switched off and on when pressed.
     * If it is false, it will make sure there is always only one toggle could be switched on
     * and the already switched on toggle can't be switched off.
     *
     * @zh
     * 如果这个设置为 true，那么 toggle 按钮在被点击的时候可以反复地被选中和未选中。
     */
    @property({
        tooltip:'如果这个设置为 true， 那么 toggle 按钮在被点击的时候可以反复地被选中和未选中。',
    })
    get allowSwitchOff () {
        return this._allowSwitchOff;
    }

    set allowSwitchOff (value) {
        this._allowSwitchOff = value;
    }

    /**
     * @zh
     * 只读属性，返回 toggleGroup 管理的 toggle 数组引用。
     */
    get toggleItems () {
        return this._toggleItems;
    }

    public start () {
        this._makeAtLeastOneToggleChecked();
    }

    /**
     * @en
     * Refresh the state of the managed toggles.
     *
     * @zh
     * 刷新管理的 toggle 状态。
     *
     * @param toggle - 需要被更新的 toggle。
     */
    public updateToggles (toggle: ToggleComponent) {
        if (!this.enabledInHierarchy) { return; }

        if (toggle.isChecked) {
            this.toggleItems.forEach((item) => {
                if (item !== toggle && item.isChecked && item.enabled) {
                    item.isChecked = false;
                }
            });

            if (this.checkEvents) {
                ComponentEventHandler.emitEvents(this.checkEvents, toggle);
            }
        }
    }

    /**
     * @en
     * Add toggle that needs to be managed.
     *
     * @zh
     * 添加需要被控制的 toggle。
     *
     * @param toggle - 被控制的 toggle。
     */
    public addToggle (toggle: ToggleComponent) {
        const index = this._toggleItems.indexOf(toggle);
        if (index === -1) {
            this._toggleItems.push(toggle);
        }
        this._allowOnlyOneToggleChecked();
    }

    /**
     * @en
     * Remove toggle that needs to be managed.
     *
     * @zh
     * 移除 toggle。
     *
     * @param toggle - 被移除控制的 toggle。
     */
    public removeToggle (toggle: ToggleComponent) {
        const index = this._toggleItems.indexOf(toggle);
        if (index > -1) {
            this._toggleItems.splice(index, 1);
        }
        this._makeAtLeastOneToggleChecked();
    }

    private _allowOnlyOneToggleChecked () {
        let isChecked = false;
        this._toggleItems.forEach((item) => {
            if (isChecked && item.enabled) {
                item.isChecked = false;
            }

            if (item.isChecked && item.enabled) {
                isChecked = true;
            }
        });

        return isChecked;
    }

    private _makeAtLeastOneToggleChecked () {
        const isChecked = this._allowOnlyOneToggleChecked();

        if (!isChecked && !this._allowSwitchOff) {
            if (this._toggleItems.length > 0) {
                this._toggleItems[0].isChecked = true;
            }
        }
    }
}

legacyCC.ToggleContainerComponent = ToggleContainerComponent;
