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
 * !#en Defines a Box Collider .
 * !#zh 用来定义包围盒碰撞体
 * @class Collider.Box
 */
cc.Collider.Box = cc.Class({
    properties: {
        _offset: cc.v2(0, 0),
        _size: cc.size(100, 100),

        /**
         * !#en Position offset
         * !#zh 位置偏移量
         * @property offset
         * @type {Vec2}
         */
        offset: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.offset',
            get: function () {
                return this._offset;
            },
            set: function (value) {
                this._offset = value;
            },
            type: cc.Vec2
        },

        /**
         * !#en Box size
         * !#zh 包围盒大小
         * @property size
         * @type {Size}
         */
        size: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.size',            
            get: function () {
                return this._size;
            },
            set: function (value) {
                this._size.width = value.width < 0 ? 0 : value.width;
                this._size.height = value.height < 0 ? 0 : value.height;
            },
            type: cc.Size
        }
    },

    resetInEditor: CC_EDITOR && function () {
        var size = this.node.getContentSize();
        if (size.width !== 0 && size.height !== 0) {
            this.size = cc.size( size );
            this.offset.x = (0.5 - this.node.anchorX) * size.width;
            this.offset.y = (0.5 - this.node.anchorY) * size.height;
        }
    }
});

/**
 * !#en Box Collider.
 * !#zh 包围盒碰撞组件
 * @class BoxCollider
 * @extends Collider
 * @uses Collider.Box
 */
var BoxCollider = cc.Class({
    name: 'cc.BoxCollider',
    extends: cc.Collider,
    mixins: [cc.Collider.Box],

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.collider/Box Collider',
    }
});

cc.BoxCollider = module.exports = BoxCollider;
