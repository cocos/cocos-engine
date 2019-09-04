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

const misc = require('../utils/misc');
const Component = require('./CCComponent');

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
var Slider = cc.Class({
    name: 'cc.Slider',
    extends: Component,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/Slider',
        help: 'i18n:COMPONENT.help_url.slider'
    },

    ctor: function () {
        this._offset = cc.v2();
        this._touchHandle = false;
        this._dragging = false;
    },

    properties: {
        /**
         * !#en The "handle" part of the slider
         * !#zh 滑动器滑块按钮部件
         * @property {Button} handle
         */
        handle: {
            default: null,
            type: cc.Button,
            tooltip: CC_DEV && 'i18n:COMPONENT.slider.handle',
            notify: function() {
                if (CC_EDITOR && this.handle) {
                    this._updateHandlePosition();
                }
            }
        },

        /**
         * !#en The slider direction
         * !#zh 滑动器方向
         * @property {Slider.Direction} direction
         */
        direction: {
            default: Direction.Horizontal,
            type: Direction,
            tooltip: CC_DEV && 'i18n:COMPONENT.slider.direction'
        },

        /**
         * !#en The current progress of the slider. The valid value is between 0-1
         * !#zh 当前进度值，该数值的区间是 0-1 之间
         * @property {Number} progress
         */
        progress: {
            default: 0.5,
            type: cc.Float,
            range: [0, 1, 0.1],
            slide: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.slider.progress',
            notify: function() {
                this._updateHandlePosition();
            }
        },

        /**
         * !#en The slider slide events' callback array
         * !#zh 滑动器组件滑动事件回调函数数组
         * @property {Component.EventHandler[]} slideEvents
         */
        slideEvents: {
            default: [],
            type: cc.Component.EventHandler,
            tooltip: CC_DEV && 'i18n:COMPONENT.slider.slideEvents'
        }
    },

    statics: {
        Direction: Direction
    },

    __preload: function () {
        this._updateHandlePosition();
    },

    // 注册事件
    onEnable: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this);
        if (this.handle && this.handle.isValid) {
            this.handle.node.on(cc.Node.EventType.TOUCH_START, this._onHandleDragStart, this);
            this.handle.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
            this.handle.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        }
    },

    onDisable: function() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this);
        if (this.handle && this.handle.isValid) {
            this.handle.node.off(cc.Node.EventType.TOUCH_START, this._onHandleDragStart, this);
            this.handle.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
            this.handle.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        }
    },

    _onHandleDragStart: function (event) {
        this._dragging = true;
        this._touchHandle = true;
        this._offset = this.handle.node.convertToNodeSpaceAR(event.touch.getLocation());
        event.stopPropagation();
    },

    _onTouchBegan: function (event) {
        if (!this.handle) { return; }
        this._dragging = true;
        if (!this._touchHandle) {
            this._handleSliderLogic(event.touch);
        }
        event.stopPropagation();
    },

    _onTouchMoved: function (event) {
        if (!this._dragging) { return; }
        this._handleSliderLogic(event.touch);
        event.stopPropagation();
    },

    _onTouchEnded: function (event) {
        this._dragging = false;
        this._touchHandle = false;
        this._offset = cc.v2();
        event.stopPropagation();
    },

    _onTouchCancelled: function (event) {
        this._dragging = false;
        event.stopPropagation();
    },

    _handleSliderLogic: function (touch) {
        this._updateProgress(touch);
        this._emitSlideEvent();
    },

    _emitSlideEvent: function () {
        cc.Component.EventHandler.emitEvents(this.slideEvents, this);
        this.node.emit('slide', this);
    },

    _updateProgress: function (touch) {
        if (!this.handle) { return; }
        let node = this.node;
        var localTouchPos = node.convertToNodeSpaceAR(touch.getLocation());
        if (this.direction === Direction.Horizontal) {
            this.progress = misc.clamp01((localTouchPos.x - this._offset.x + node.anchorX * node.width) / node.width);
        }
        else {
            this.progress = misc.clamp01((localTouchPos.y - this._offset.y + node.anchorY * node.height) / node.height);
        }
    },

    _updateHandlePosition: function () {
        if (!this.handle) { return; }
        var handlelocalPos;
        if (this.direction === Direction.Horizontal) {
            handlelocalPos = cc.v2(-this.node.width * this.node.anchorX + this.progress * this.node.width, 0);
        }
        else {
            handlelocalPos = cc.v2(0, -this.node.height * this.node.anchorY + this.progress * this.node.height);
        }
        var worldSpacePos = this.node.convertToWorldSpaceAR(handlelocalPos);
        this.handle.node.position = this.handle.node.parent.convertToNodeSpaceAR(worldSpacePos);
    }

});

cc.Slider = module.exports = Slider;

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event slide
 * @param {Event.EventCustom} event
 * @param {Slider} slider - The slider component.
 */
