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
         * @default 0
         */
        category: {
            default: 0,
            visible: false,
            serializable: false
        },

        /**
         * !#en The collider mask can collide with this collider.
         * !#zh 可以与碰撞组件相碰撞的组件掩码
         * @property mask
         * @type {Integer}
         * @default 0
         */
        mask: {
            default: 0,
            visible: false,
            serializable: false
        }
    },

    onLoad: function () {
        var groupIndex = this.node.groupIndex;
        this.category = 1 << groupIndex;

        var collideMap = cc.game.collideMap[groupIndex];
        if (!collideMap) {
          this.mask = 0;
          cc.warn('Cant\'t find collider map for group index : ' + groupIndex);
          return;
        }

        var mask = 0;
        for (var i = 0, l = collideMap.length; i < l; i++) {
          if (collideMap[i]) {
            mask += 1 << i;
          }
        }
        this.mask = mask;
    },

    onDisable: function () {
        if (CC_EDITOR) {
            return;
        }
        cc.director.getCollisionManager().removeCollider(this);
    },

    onEnable: function () {
        if (CC_EDITOR) {
            return;
        }
        cc.director.getCollisionManager().addCollider(this);
    }
});

cc.Collider = module.exports = Collider;
