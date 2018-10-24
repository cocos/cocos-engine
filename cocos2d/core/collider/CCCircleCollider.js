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
 * !#en Defines a Circle Collider .
 * !#zh 用来定义圆形碰撞体
 * @class Collider.Circle
 */
cc.Collider.Circle = cc.Class({
    properties: {
        _offset: cc.v2(0, 0),
        _radius: 50,

        /**
         * !#en Position offset
         * !#zh 位置偏移量
         * @property offset
         * @type {Vec2}
         */
        offset: {
            get: function () {
                return this._offset;
            },
            set: function (value) {
                this._offset = value;
            },
            type: cc.Vec2
        },

        /**
         * !#en Circle radius
         * !#zh 圆形半径
         * @property radius
         * @type {Number}
         */
        radius: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.radius',
            get: function () {
                return this._radius;
            },
            set: function (value) {
                this._radius = value < 0 ? 0 : value;
            }
        }
    },

    resetInEditor: CC_EDITOR && function () {
        var size = this.node.getContentSize();
        var radius = Math.max(size.width, size.height);
        if (radius !== 0) {
            this.radius = radius;
        }
    }
});

/**
 * !#en Circle Collider.
 * !#zh 圆形碰撞组件
 * @class CircleCollider
 * @extends Collider
 * @uses Collider.Circle
 */
var CircleCollider = cc.Class({
    name: 'cc.CircleCollider',
    extends: cc.Collider,
    mixins: [cc.Collider.Circle],

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.collider/Circle Collider'
    },
});

cc.CircleCollider = module.exports = CircleCollider;
