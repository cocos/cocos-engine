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

/**
 * !#en ToggleContainer is not a visiable UI component but a way to modify the behavior of a set of Toggles. <br/>
 * Toggles that belong to the same group could only have one of them to be switched on at a time.<br/>
 * Note: All the first layer child node containing the toggle component will auto be added to the container
 * !#zh ToggleContainer 不是一个可见的 UI 组件，它可以用来修改一组 Toggle 组件的行为。<br/>
 * 当一组 Toggle 属于同一个 ToggleContainer 的时候，任何时候只能有一个 Toggle 处于选中状态。<br/>
 * 注意：所有包含 Toggle 组件的一级子节点都会自动被添加到该容器中
 * @class ToggleContainer
 * @extends Component
 */
var ToggleContainer = cc.Class({
    name: 'cc.ToggleContainer',
    extends: cc.Component,
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/ToggleContainer',
        help: 'i18n:COMPONENT.help_url.toggleContainer',
        executeInEditMode: true
    },

    properties: {
        /**
         * !#en If this setting is true, a toggle could be switched off and on when pressed.
         * If it is false, it will make sure there is always only one toggle could be switched on
         * and the already switched on toggle can't be switched off.
         * !#zh 如果这个设置为 true， 那么 toggle 按钮在被点击的时候可以反复地被选中和未选中。
         * @property {Boolean} allowSwitchOff
         */
        allowSwitchOff: {
            tooltip: CC_DEV && 'i18n:COMPONENT.toggle_group.allowSwitchOff',
            default: false
        },

        /**
         * !#en If Toggle is clicked, it will trigger event's handler
         * !#zh Toggle 按钮的点击事件列表。
         * @property {Component.EventHandler[]} checkEvents
         */
        checkEvents: {
            default: [],
            type: cc.Component.EventHandler
        },
    },

    updateToggles: function (toggle) {
        if(!this.enabledInHierarchy) return;

        if (toggle.isChecked) {
            this.toggleItems.forEach(function (item) {
                if (item !== toggle && item.isChecked && item.enabled) {
                    item._hideCheckMark();
                }
            });

            if (this.checkEvents) {
                cc.Component.EventHandler.emitEvents(this.checkEvents, toggle);
            }
        }
    },

    _allowOnlyOneToggleChecked: function () {
        var isChecked = false;
        this.toggleItems.forEach(function (item) {
            if (isChecked) {
                item._hideCheckMark();
            }
            else if (item.isChecked) {
                isChecked = true;
            }
        });

        return isChecked;
    },

    _makeAtLeastOneToggleChecked: function () {
        var isChecked = this._allowOnlyOneToggleChecked();

        if (!isChecked && !this.allowSwitchOff) {
            var toggleItems = this.toggleItems;
            if (toggleItems.length > 0) {
                toggleItems[0].check();
            }
        }
    },

    onEnable: function () {
        this.node.on('child-added', this._allowOnlyOneToggleChecked, this);
        this.node.on('child-removed', this._makeAtLeastOneToggleChecked, this);
    },

    onDisable: function () {
        this.node.off('child-added', this._allowOnlyOneToggleChecked, this);
        this.node.off('child-removed', this._makeAtLeastOneToggleChecked, this);
    },

    start: function () {
        this._makeAtLeastOneToggleChecked();
    }
});

/**
 * !#en Read only property, return the toggle items array reference managed by ToggleContainer.
 * !#zh 只读属性，返回 ToggleContainer 管理的 toggle 数组引用
 * @property {Toggle[]} toggleItems
 */
var js = require('../platform/js');
js.get(ToggleContainer.prototype, 'toggleItems',
    function () {
        return this.node.getComponentsInChildren(cc.Toggle);
    }
);

cc.ToggleContainer = module.exports = ToggleContainer;
