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
var ANGLE_TO_PHYSICS_ANGLE = require('../CCPhysicsTypes').ANGLE_TO_PHYSICS_ANGLE;

/**
 * !#en
 * A weld joint essentially glues two bodies together. A weld joint may
 * distort somewhat because the island constraint solver is approximate.
 * !#zh
 * 熔接关节相当于将两个刚体粘在了一起。
 * 熔接关节可能会使某些东西失真，因为约束求解器算出的都是近似值。
 * @class WeldJoint
 * @extends Joint
 */
var WeldJoint = cc.Class({
    name: 'cc.WeldJoint',
    extends: cc.Joint,
    
    editor: CC_EDITOR && {
        inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
        menu: 'i18n:MAIN_MENU.component.physics/Joint/Weld',
    },

    properties: {
        /**
         * !#en
         * The reference angle.
         * !#zh
         * 相对角度。
         * @property {Number} referenceAngle
         * @default 0
         */
        referenceAngle: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.referenceAngle'            
        },

        _frequency: 0,
        _dampingRatio: 0,

        /**
         * !#en
         * The frequency.
         * !#zh
         * 弹性系数。
         * @property {Number} frequency
         * @default 0
         */
        frequency: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.frequency',
            get: function () {
                return this._frequency;
            },
            set: function (value) {
                this._frequency = value;
                if (this._joint) {
                    this._joint.SetFrequency(value);
                }
            }
        },

        /**
         * !#en
         * The damping ratio.
         * !#zh
         * 阻尼，表示关节变形后，恢复到初始状态受到的阻力。
         * @property {Number} dampingRatio
         * @property 0
         */
        dampingRatio: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.dampingRatio',            
            get: function () {
                return this._dampingRatio;
            },
            set: function (value) {
                this._dampingRatio = value;
                if (this._joint) {
                    this._joint.SetDampingRatio(value);
                }
            }
        }
    },

    _createJointDef: function () {
        var def = new b2.WeldJointDef();
        def.localAnchorA = new b2.Vec2(this.anchor.x/PTM_RATIO, this.anchor.y/PTM_RATIO);
        def.localAnchorB = new b2.Vec2(this.connectedAnchor.x/PTM_RATIO, this.connectedAnchor.y/PTM_RATIO);
        def.referenceAngle = this.referenceAngle * ANGLE_TO_PHYSICS_ANGLE;

        def.frequencyHz = this.frequency;
        def.dampingRatio = this.dampingRatio;

        return def;
    }
});

cc.WeldJoint = module.exports = WeldJoint;
