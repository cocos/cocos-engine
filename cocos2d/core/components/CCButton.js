/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * Enum for transition type
 * @enum Button.Transition
 */
var Transition = cc.Enum({
    /**
     * @property {Number} NONE
     */
    NONE: 0,

    /**
     * @property {Number} COLOR
     */
    COLOR: 1,

    /**
     * @property {Number} SPRITE
     */
    SPRITE: 2
});

/**
 * Click event will register a event to target component's handler.
 * And will trigger when a click event emit
 *
 * @class Button.ClickEvent
 */
var ClickEvent = cc.Class({
    name: 'cc.ClickEvent',
    properties: {
        /**
         * Event target
         * @property target
         * @type cc.Node
         * @default null
         */
        target: {
            default: null,
            type: cc.Node,
            tooltip: 'i18n:COMPONENT.button.click_event.target'
        },
        /**
         * Component name
         * @property component
         * @type {String}
         * @default ''
         */
        component: {
            default: '',
            tooltip: 'i18n:COMPONENT.button.click_event.component'
        },
        /**
         * Event handler
         * @property handler
         * @type {String}
         * @default ''
         */
        handler: {
            default: '',
            tooltip: 'i18n:COMPONENT.button.click_event.handler'
        }
    }
});

var WHITE = cc.Color.WHITE;

var ButtonState = {
    Normal: 'normal',
    Pressed: 'pressed',
    Hover: 'hover',
    Disabled: 'disabled'
};

/**
 * Button has 3 Transition types
 * When Button state changed:
 *  If Transition type is Button.Transition.NONE, Button will do nothing
 *  If Transition type is Button.Transition.COLOR, Button will change target's color
 *  If Transition type is Button.Transition.SPRITE, Button will change target Sprite's sprite
 *
 * Button will trigger 5 events:
 *  Button.EVENT_TOUCH_DOWN
 *  Button.EVENT_TOUCH_UP
 *  Button.EVENT_HOVER_IN
 *  Button.EVENT_HOVER_MOVE
 *  Button.EVENT_HOVER_OUT
 *
 * @class Button
 * @extends Component
 */
var Button = cc.Class({
    name: 'cc.Button',
    extends: require('./CCComponent'),

    ctor: function () {
        this._pressed = false;
        this._hovered = false;

        this._sprite = null;

        this._fromColor = null;
        this._toColor = null;
        this._time = 0;
        this._transitionFinished = true;
    },

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/Button',
        inspector: 'app://editor/page/inspector/button/button.html',
        executeInEditMode: true
    },

    properties: {
        /**
         * Whether the Button is disabled.
         * If true, the Button will trigger event and do transition.
         * @property {Boolean} interactable
         * @default true
         */
        interactable: {
            default: true,
            tooltip: 'i18n:COMPONENT.button.interactable',
            notify: function () {
                this._initState();
            }
        },

        /**
         * Transition type
         * @property {Button.Transition} transition
         * @default Button.Transition.Node
         */
        transition: {
            default: Transition.NONE,
            tooltip: 'i18n:COMPONENT.button.transition',
            type: Transition
        },

        // color transition

        /**
         * Normal state color
         * @property {cc.Color} normalColor
         */
        normalColor: {
            default: WHITE,
            displayName: 'Normal',
            tooltip: 'i18n:COMPONENT.button.normal_color',
            notify: function () {
                this._initState();
            }
        },

        /**
         * Pressed state color
         * @property {cc.Color} pressedColor
         */
        pressedColor: {
            default: WHITE,
            displayName: 'Pressed',
            tooltip: 'i18n:COMPONENT.button.pressed_color',
        },

        /**
         * Hover state color
         * @property {cc.Color} hoverColor
         */
        hoverColor: {
            default: WHITE,
            displayName: 'Hover',
            tooltip: 'i18n:COMPONENT.button.hover_color',
        },

        /**
         * Disabled state color
         * @property {cc.Color} disabledColor
         */
        disabledColor: {
            default: WHITE,
            displayName: 'Disabled',
            tooltip: 'i18n:COMPONENT.button.diabled_color',
            notify: function () {
                this._initState();
            }
        },

        /**
         * Color transition duration
         * @property {float} duration
         */
        duration: {
            default: 0.1,
            range: [0, Number.MAX_VALUE],
            tooltip: 'i18n:COMPONENT.button.duration',
        },

        // sprite transition
        /**
         * Normal state sprite
         * @property {cc.SpriteFrame} normalSprite
         */
        normalSprite: {
            default: null,
            type: cc.SpriteFrame,
            displayName: 'Normal',
            tooltip: 'i18n:COMPONENT.button.normal_sprite',
            notify: function () {
                this._initState();
            }
        },

        /**
         * Pressed state sprite
         * @property {cc.SpriteFrame} pressedSprite
         */
        pressedSprite: {
            default: null,
            type: cc.SpriteFrame,
            displayName: 'Pressed',
            tooltip: 'i18n:COMPONENT.button.pressed_sprite',
        },

        /**
         * Hover state sprite
         * @property {cc.SpriteFrame} hoverSprite
         */
        hoverSprite: {
            default: null,
            type: cc.SpriteFrame,
            displayName: 'Hover',
            tooltip: 'i18n:COMPONENT.button.hover_sprite',
        },

        /**
         * Disabled state sprite
         * @property {cc.SpriteFrame} disabledSprite
         */
        disabledSprite: {
            default: null,
            type: cc.SpriteFrame,
            displayName: 'Disabled',
            tooltip: 'i18n:COMPONENT.button.disabled_sprite',
            notify: function () {
                this._initState();
            }
        },

        /**
         * Transition target.
         * When Button state changed:
         *  If Transition type is Button.Transition.NONE, Button will do nothing
         *  If Transition type is Button.Transition.COLOR, Button will change target's color
         *  If Transition type is Button.Transition.SPRITE, Button will change target Sprite's sprite
         * @property {cc.Node} target
         */
        target: {
            default: null,
            type: cc.Node,
            tooltip: "i18n:COMPONENT.button.target",
            notify: function () {
                this._applyTarget();
            }
        },

        /**
         * If Button is clicked, it will trigger event's handler
         * @property {[Button.ClickEvent]} clickEvents
         */
        clickEvents: {
            default: [],
            type: ClickEvent,
            tooltip: 'i18n:COMPONENT.button.click_events',
        }
    },

    statics: {
        Transition: Transition,
        ClickEvent: ClickEvent
    },

    onLoad: function () {
        if (!this.target) {
            this.target = this.node;
        }

        if (!CC_EDITOR) {
            this._registerEvent();
        }
    },

    start: function () {
        this._applyTarget();
        this._initState();
    },

    update: function (dt) {
        var target = this.target;
        if (!this.transition === Transition.COLOR || !target || this._transitionFinished) return;

        this.time += dt;
        var ratio = this.time / this.duration;
        if (ratio > 1) {
            ratio = 1;
            this._transitionFinished = true;
        }

        target.color = this._fromColor.lerp(this._toColor, ratio);
    },

    _registerEvent: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);

        this.node.on(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
    },

    _handleClickEvent: function () {
        var events = this.clickEvents;
        for (var i = 0, l = events.length; i < l; i++) {
            var event = events[i];
            var target = event.target;
            if (!target) continue;

            var comp = target.getComponent(event.component);
            if (!comp) continue;

            var handler = comp[event.handler];
            if (!handler) continue;
            handler.call(comp)
        }
    },

    _cancelButtonClick: function(){
        this._pressed = false;
    },

    _applyTarget: function () {
        var target = this.target;
        if (target) {
            this._sprite = target.getComponent(cc.Sprite);
        }
        else {
            this._sprite = null;
        }
    },

    _initState: function () {
        var state = this.interactable ? ButtonState.Normal : ButtonState.Disabled;
        this._applyState(state);
    },

    // touch event handler
    _onTouchBegan: function (event) {
        var touch = event.touch;
        if (!this.interactable || !this.enabledInHierarchy) return false;

        var hit = this._hitTest(touch.getLocation());
        if (hit) {
            this._pressed = true;
            this._applyState(ButtonState.Pressed);
        }

        return hit;
    },

    _onTouchMove: function (event) {
        var touch = event.touch;

        var hit = this._hitTest(touch.getLocation());
        if (hit && this._pressed) {
            this._applyState(ButtonState.Pressed);
        }else{
            this._applyState(ButtonState.Normal);
        }
    },

    _onTouchEnded: function () {
        if (this._hovered)
        {
            this._applyState(ButtonState.Hover);
        }

        if(this._pressed){
            this._applyState(ButtonState.Normal);
            this._handleClickEvent();
        }

        this._pressed = false;
    },

    _onTouchCancel: function () {
        this._pressed = false;
    },

    _onMouseMoveIn: function (event) {
        if (this._pressed || !this.interactable || !this.enabledInHierarchy) return;

        if (!this._hovered) {
            this._hovered = true;
            this._applyState(ButtonState.Hover);
        }
    },

    _onMouseMoveOut: function(){
        if (!this.interactable || !this.enabledInHierarchy) return;

        if (this._hovered) {
            this._hovered = false;
            this._applyState(ButtonState.Normal);
        }
    },

    // state handler
    _applyState: function (state) {
        var color  = this[state + 'Color'];
        var sprite = this[state + 'Sprite'];

        this._applyTransition(color, sprite);
    },
    _applyTransition: function (color, sprite) {
        var transition = this.transition;

        if (transition === Transition.COLOR) {
            var target = this.target;

            if (CC_EDITOR) {
                target.color = color;
            }
            else {
                this._fromColor = target.color.clone();
                this._toColor = color;
                this.time = 0;
                this._transitionFinished = false;
            }
        }
        else if (transition === Transition.SPRITE && this._sprite && sprite) {
            this._sprite.spriteFrame = sprite;
        }
    },

    // hit test
    _hitTest: function (pos) {
        var target = this.target;
        if (!target) return false;

        var w = target.width;
        var h = target.height;

        var rect = cc.rect(0, 0, w, h);
        return cc.rectContainsPoint(rect, target.convertToNodeSpace(pos));
    }

});

cc.Button = module.exports = Button;
