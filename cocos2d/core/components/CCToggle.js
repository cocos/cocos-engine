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

const GraySpriteState = require('../utils/gray-sprite-state');

/**
 * !#en The toggle component is a CheckBox, when it used together with a ToggleGroup, it
 * could be treated as a RadioButton.
 * !#zh Toggle 是一个 CheckBox，当它和 ToggleGroup 一起使用的时候，可以变成 RadioButton。
 * @class Toggle
 * @extends Button
 */
let Toggle = cc.Class({
    name: 'cc.Toggle',
    extends: require('./CCButton'),
    mixins: [GraySpriteState],
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/Toggle',
        help: 'i18n:COMPONENT.help_url.toggle',
        inspector: 'packages://inspector/inspectors/comps/toggle.js',
    },

    properties: {
        /**
         * !#en When this value is true, the check mark component will be enabled, otherwise
         * the check mark component will be disabled.
         * !#zh 如果这个设置为 true，则 check mark 组件会处于 enabled 状态，否则处于 disabled 状态。
         * @property {Boolean} isChecked
         */
        _N$isChecked: true,
        isChecked: {
            get: function () {
                return this._N$isChecked;
            },
            set: function (value) {
                if (value === this._N$isChecked) {
                    return;
                }

                var group = this.toggleGroup || this._toggleContainer;
                if (group && group.enabled && this._N$isChecked) {
                    if (!group.allowSwitchOff) {
                        return;
                    }

                }

                this._N$isChecked = value;
                this._updateCheckMark();

                if (group && group.enabled) {
                    group.updateToggles(this);
                }

                this._emitToggleEvents();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.toggle.isChecked',
        },

        /**
         * !#en The toggle group which the toggle belongs to, when it is null, the toggle is a CheckBox.
         * Otherwise, the toggle is a RadioButton.
         * !#zh Toggle 所属的 ToggleGroup，这个属性是可选的。如果这个属性为 null，则 Toggle 是一个 CheckBox，
         * 否则，Toggle 是一个 RadioButton。
         * @property {ToggleGroup} toggleGroup
         */
        toggleGroup: {
            default: null,
            tooltip: CC_DEV && 'i18n:COMPONENT.toggle.toggleGroup',
            type: require('./CCToggleGroup')
        },

        /**
         * !#en The image used for the checkmark.
         * !#zh Toggle 处于选中状态时显示的图片
         * @property {Sprite} checkMark
         */
        checkMark: {
            default: null,
            type: cc.Sprite,
            tooltip: CC_DEV && 'i18n:COMPONENT.toggle.checkMark'
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

        _resizeToTarget: {
            animatable: false,
            set: function (value) {
                if (value) {
                    this._resizeNodeToTargetNode();
                }
            }
        },

    },

    onEnable: function () {
        this._super();
        if (!CC_EDITOR) {
            this._registerToggleEvent();
        }
        if (this.toggleGroup && this.toggleGroup.enabledInHierarchy) {
            this.toggleGroup.addToggle(this);
        }
    },

    onDisable: function () {
        this._super();
        if (!CC_EDITOR) {
            this._unregisterToggleEvent();
        }
        if (this.toggleGroup && this.toggleGroup.enabledInHierarchy) {
            this.toggleGroup.removeToggle(this);
        }
    },

    _hideCheckMark () {
        this._N$isChecked = false;
        this._updateCheckMark();
    },

    toggle: function (event) {
        this.isChecked = !this.isChecked;
    },

    /**
     * !#en Make the toggle button checked.
     * !#zh 使 toggle 按钮处于选中状态
     * @method check
     */
    check: function () {
        this.isChecked = true;
    },

    /**
     * !#en Make the toggle button unchecked.
     * !#zh 使 toggle 按钮处于未选中状态
     * @method uncheck
     */
    uncheck: function () {
        this.isChecked = false;
    },

    _updateCheckMark: function () {
        if (this.checkMark) {
            this.checkMark.node.active = !!this.isChecked;
        }
    },

    _updateDisabledState: function () {
        this._super();

        if (this.enableAutoGrayEffect && this.checkMark) {
            let useGrayMaterial = !this.interactable;
            this._switchGrayMaterial(useGrayMaterial, this.checkMark);
        }
    },

    _registerToggleEvent: function () {
        this.node.on('click', this.toggle, this);
    },

    _unregisterToggleEvent: function () {
        this.node.off('click', this.toggle, this);
    },

    _emitToggleEvents: function () {
        this.node.emit('toggle', this);
        if (this.checkEvents) {
            cc.Component.EventHandler.emitEvents(this.checkEvents, this);
        }
    }

});

cc.Toggle = module.exports = Toggle;

const js = require('../platform/js');

js.get(Toggle.prototype, '_toggleContainer',
    function () {
        let parent = this.node.parent;
        if (cc.Node.isNode(parent)) {
            return parent.getComponent(cc.ToggleContainer);
        }
        return null;
    }
);

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event toggle
 * @param {Event.EventCustom} event
 * @param {Toggle} toggle - The Toggle component.
 */
