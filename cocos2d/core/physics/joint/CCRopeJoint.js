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

var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;

/**
 * !#en
 * A rope joint enforces a maximum distance between two points
 * on two bodies. It has no other effect.
 * Warning: if you attempt to change the maximum length during
 * the simulation you will get some non-physical behavior.
 * !#zh
 * 绳子关节只指定两个刚体间的最大距离，没有其他的效果。
 * 注意：如果你试图动态修改关节的长度，这有可能会得到一些意外的效果。
 * @class RopeJoint
 * @extends Joint
 */
var RopeJoint = cc.Class({
    name: 'cc.RopeJoint',
    extends: cc.Joint,
    
    editor: CC_EDITOR && {
        inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
        menu: 'i18n:MAIN_MENU.component.physics/Joint/Rope',
    },

    properties: {
        _maxLength: 1,

        /**
         * !#en
         * The max length.
         * !#zh
         * 最大长度。
         * @property {Number} maxLength
         * @default 1
         */
        maxLength: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.maxLength',
            get: function () {
                return this._maxLength;
            },
            set: function (value) {
                this._maxLength = value;
                if (this._joint) {
                    this._joint.SetMaxLength(value);
                }
            }
        },

    },

    _createJointDef: function () {
        var def = new b2.RopeJointDef();
        def.localAnchorA = new b2.Vec2(this.anchor.x/PTM_RATIO, this.anchor.y/PTM_RATIO);
        def.localAnchorB = new b2.Vec2(this.connectedAnchor.x/PTM_RATIO, this.connectedAnchor.y/PTM_RATIO);
        def.maxLength = this.maxLength/PTM_RATIO;

        return def;
    }
});

cc.RopeJoint = module.exports = RopeJoint;
