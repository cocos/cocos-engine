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
 * !#en
 */
var ToggleGroup = cc.Class({
    name: 'cc.ToggleGroup',
    extends: cc.Component,
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/ToggleGroup',
        help: 'i18n:COMPONENT.help_url.toggle_group',
        executeInEditMode: true
    },

    properties: {
        _toggleItem: {
            default: [],
            type: cc.Toggle,
            serializable: false
        },

        /**
         * !#en
         */
        allowSwitchOff: {
            default: false
        }
    },

    updateToggles: function (toggle) {
        if(!this.enabledInHierarchy) return;

        this._toggleItem.forEach(function (item){
            if(toggle.isChecked) {
                if (item !== toggle && item.isChecked && item.enabled) {
                    item.isChecked = false;
                }
            }
        });
    },

    addToggle: function (toggle) {
        var index = this._toggleItem.indexOf(toggle);
        if (index > -1) {
            cc.warn('Toggle alreay in ToggleGroup.'
                    + 'Sometine bad happened,' +
                    ' please report this issue to the Creator developer, thanks.');
        } else {
            this._toggleItem.push(toggle);
        }
        this._allowOnlyOneToggleChecked();
    },

    removeToggle: function (toggle) {
        var index = this._toggleItem.indexOf(toggle);
        if(index > -1) {
            this._toggleItem.splice(index, 1);
        } else {
            cc.warn('Toggle alreay in ToggleGroup.'
                    + 'Sometine bad happened,' +
                    ' please report this issue to the Creator developer, thanks.');
        }
        this._allowOnlyOneToggleChecked();
    },

    _allowOnlyOneToggleChecked: function () {
        var isChecked = false;
        this._toggleItem.forEach(function (item) {
            if(isChecked && item.enabled) {
                item.isChecked = false;
            }

            if (item.isChecked && item.enabled) {
                isChecked = true;
            }
        });

        if(!isChecked && !this.allowSwitchOff) {
            if(this._toggleItem.length > 0) {
                this._toggleItem[0].isChecked = true;
            }
        }

    },

});

cc.ToggleGroup = module.exports = ToggleGroup;
