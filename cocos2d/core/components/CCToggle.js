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

    properties: {
        isChecked: {
            default: true,
            notify: function() {
                this._updateSprites();
            }
        },

        _toggleGroup: null,

        inActiveNormalSprite: {
            default: null,
            type: cc.SpriteFrame,
            displayName: 'Inactive Normal Sprite',
            notify: function() {
                this._updateSprites();
            }
        },

        activeNormalSprite: {
            default: null,
            type: cc.SpriteFrame,
            notify: function () {
                this._updateSprites();
            }
        },

        activePressedSprite: {
            default: null,
            type: cc.SpriteFrame,
            notify: function () {
                this._updateSprites();
            }
        },

        inActivePressedSprite: {
            default: null,
            type: cc.SpriteFrame,
            displayName: 'Inactive Pressed Sprite',
            notify: function () {
                this._updateSprites();
            }
        },

        activeDisabledSprite: {
            default: null,
            type: cc.SpriteFrame,
            notify: function () {
                this._updateSprites();
            }
        },

        inActiveDisabledSprite: {
            default: null,
            type: cc.SpriteFrame,
            displayName: 'Inactive Disabled Sprite',
            notify: function () {
                this._updateSprites();
            }
        },

        checkEvents: {
            default: [],
            type: cc.Component.EventHandler
        }
    },

    _updateSprites: function () {
        if(this.isChecked) {
            this.normalSprite = this.activeNormalSprite;
            this.pressedSprite = this.activePressedSprite;
            this.disabledSprite = this.activeDisabledSprite;
        } else {
            this.normalSprite = this.inActiveNormalSprite;
            this.pressedSprite = this.inActivePressedSprite;
            this.disabledSprite = this.inActiveDisabledSprite;
        }
    },

    onLoad: function () {
        this._super();

        this.transition = cc.Button.Transition.SPRITE;

        this._updateSprites();

        this._registerToggleEvent();
    },

    _registerToggleEvent: function () {
        //register checkbox specific event
        var event = new cc.Component.EventHandler();
        event.target = this.node;
        event.component = 'Toggle';
        event.handler = 'toggleToggleStatus';
        this.clickEvents = [event];

    },

    toggleToggleStatus: function () {
        if(this._toggleGroup && this.isChecked) {
            return;
        }
        this.isChecked = !this.isChecked;


        this.node.emit('check-event', this);
        if(this.checkEvents) {
            cc.Component.EventHandler.emitEvents(this.checkEvents, this);
        }

        if(this._toggleGroup) {
            this._toggleGroup.updateToggles(this);
        }
    },

    check: function () {
        if(this._toggleGroup && this.isChecked) {
            return;
        }

        this.isChecked = true;
        if(this._toggleGroup) {
            this._toggleGroup.updateToggles(this);
        }
    },

    uncheck: function () {
        if(this._toggleGroup && this.isChecked) {
            return;
        }

        this.isChecked = false;
    }


});

cc.Toggle = module.exports = Toggle;
