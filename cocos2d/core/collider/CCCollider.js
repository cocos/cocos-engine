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
 * !#en Collider component base class.
 * !#zh 碰撞组件基类
 * @class Collider
 * @extends Component
 */
var Collider = cc.Class({
    name: 'cc.Collider',
    extends: cc.Component,

    properties: {
        _category: {
            default: 1,
            type: 'Integer',
            range: [0, 65535]
        },

        _mask: {
            default: 65535,
            type: 'Integer',
            range: [0, 65535]
        },

        editing: {
            default: false,
            serializable: false,
            tooltip: 'i18n:COMPONENT.collider.editing'
        },

        /**
         * !#en Collider component category.
         * !#zh 碰撞组件所属类别
         * @property category
         * @type {Integer}
         * @default 1
         */
        category: {
            get: function () {
                return this._category;
            },
            set: function (value) {
                if (!CC_EDITOR) {
                    cc.director.getColliderManager().removeCollider(this);   
                }

                this._category = value;

                if (!CC_EDITOR) {
                    cc.director.getColliderManager().addCollider(this);   
                }
            },
            type: 'Integer',
            tooltip: 'i18n:COMPONENT.collider.category'
        },

        /**
         * !#en The collider mask can collide with this collider.
         * !#zh 可以与碰撞组件相碰撞的组件掩码
         * @property mask
         * @type {Integer}
         * @default 65535
         */
        mask: {
            get: function () {
                return this._mask;
            },
            set: function (value) {
                if (!CC_EDITOR) {
                    cc.director.getColliderManager().removeCollider(this);   
                }

                this._mask = value;

                if (!CC_EDITOR) {
                    cc.director.getColliderManager().addCollider(this);   
                }
            },
            type: 'Integer',
            tooltip: 'i18n:COMPONENT.collider.mask'
        }
    },

    onDisable: function () {
        cc.director.getColliderManager().removeCollider(this);
    },

    onEnable: function () {
        cc.director.getColliderManager().addCollider(this);
    }
});

cc.Collider = module.exports = Collider;
