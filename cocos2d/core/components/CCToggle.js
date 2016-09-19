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

var Toggle = cc.Class({
    name: 'cc.Toggle',
    extends: cc.Button,
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/Toggle',
        help: 'i18n:COMPONENT.help_url.toggle',
        inspector: 'packages://inspector/inspectors/comps/toggle.js',
        executeInEditMode: true
    },

    ctor: function () {
        this._checkmarkSprite = null;
    },

    properties: {
        isChecked: {
            default: true,
            notify: function() {
                this._updateCheckMark();
            }
        },

        toggleGroup: {
            default: null,
            type: cc.ToggleGroup
        },

        checkMark: {
            default: null,
            type: cc.Node,
            notify: function () {
                this._applyCheckmarkTarget();
            }
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
                if(value) {
                    this._resizeNodeToTargetNode();
                }
            }
        },

    },

    __preload: function () {
        this._super();
        this._applyCheckmarkTarget();
    },

    onEnable: function () {
        this._super();
        if(this.toggleGroup) {
            this.toggleGroup.addToggle(this);
        }
    },

    onDisable: function () {
        this._super();
        if(this.toggleGroup) {
            this.toggleGroup.removeToggle(this);
        }
    },

    onLoad: function () {
        this._super();
        this._registerToggleEvent();
    },

    _applyCheckmarkTarget: function () {
        this._checkmarkSprite = this._getTargetSprite(this.checkMark);
    },

    _updateCheckMark: function () {
        if(this.checkMark && this.enabledInHierarchy) {
            if(this.isChecked) {
                this.checkMark.active = true;
            } else {
                this.checkMark.active = false;
            }
        }
    },

    _updateDisabledState: function () {
        this._super();

        if(this._checkmarkSprite) {
            this._checkmarkSprite._sgNode.setState(0);
        }
        if(this.enableAutoGrayEffect) {
            if(this._checkmarkSprite && !this.interactable) {
                this._checkmarkSprite._sgNode.setState(1);
            }
        }
    },

    _registerToggleEvent: function () {
        var event = new cc.Component.EventHandler();
        event.target = this.node;
        event.component = 'cc.Toggle';
        event.handler = 'toggleToggleStatus';
        this.clickEvents = [event];

    },

    toggleToggleStatus: function (event) {
        if(this.toggleGroup && this.isChecked) {
            if(!this.toggleGroup.allowSwitchOff) {
                return;
            }
        }
        this.isChecked = !this.isChecked;
        this._updateCheckMark();

        this.node.emit('toggle-event', this);
        if(this.checkEvents) {
            cc.Component.EventHandler.emitEvents(this.checkEvents, event, this);
        }

        if(this.toggleGroup) {
            this.toggleGroup.updateToggles(this);
        }
    },

    /**
     * !#en Make the toggle button checked.
     * !#zh 使 toggle 按钮处于选中状态
     */
    check: function () {
        if(this.toggleGroup && this.isChecked) {
            if(!this.toggleGroup.allowSwitchOff) {
                return;
            }
        }

        this.isChecked = true;
        if(this.toggleGroup) {
            this.toggleGroup.updateToggles(this);
        }
    },

    /**
     * !#en Make the toggle button unchecked.
     * !#zh 使 toggle 按钮处于未选中状态
     */
    uncheck: function () {
        if(this.toggleGroup && this.isChecked) {
            if(!this.toggleGroup.allowSwitchOff) {
                return;
            }
        }

        this.isChecked = false;
    }


});

cc.Toggle = module.exports = Toggle;
