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
 * A wheel joint. This joint provides two degrees of freedom: translation
 * along an axis fixed in bodyA and rotation in the plane. You can use a joint motor to drive
 * the rotation or to model rotational friction.
 * This joint is designed for vehicle suspensions.
 * !#zh
 * 轮子关节提供两个维度的自由度：旋转和沿着指定方向上位置的移动。
 * 你可以通过开启关节马达来使用马达驱动刚体的旋转。
 * 轮组关节是专门为机动车类型设计的。
 * @class WheelJoint
 * @extends Joint
 */
var WheelJoint = cc.Class({
    name: 'cc.WheelJoint',
    extends: cc.Joint,
    
    editor: CC_EDITOR && {
        inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
        menu: 'i18n:MAIN_MENU.component.physics/Joint/Wheel',
    },

    properties: {
        _maxMotorTorque: 0,
        _motorSpeed: 0,
        _enableMotor: false,
        
        _frequency: 2,
        _dampingRatio: 0.7,

        /**
         * !#en
         * The local joint axis relative to rigidbody.
         * !#zh
         * 指定刚体可以移动的方向。
         * @property {Vec2} localAxisA
         * @default cc.v2(1, 0)
         */
        localAxisA: {
            default: cc.v2(1, 0),
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.localAxisA'
        },

        /**
         * !#en
         * The maxium torque can be applied to rigidbody to rearch the target motor speed.
         * !#zh
         * 可以施加到刚体的最大扭矩。
         * @property {Number} maxMotorTorque
         * @default 0
         */
        maxMotorTorque: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.maxMotorTorque',            
            get: function () {
                return this._maxMotorTorque;
            },
            set: function (value) {
                this._maxMotorTorque = value;
                if (this._joint) {
                    this._joint.SetMaxMotorTorque(value);
                }
            }
        },

        /**
         * !#en
         * The expected motor speed.
         * !#zh
         * 期望的马达速度。
         * @property {Number} motorSpeed
         * @default 0
         */
        motorSpeed: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.motorSpeed',
            get: function () {
                return this._motorSpeed;
            },
            set: function (value) {
                this._motorSpeed = value;
                if (this._joint) {
                    this._joint.SetMotorSpeed(value * ANGLE_TO_PHYSICS_ANGLE);
                }
            }
        },

        /**
         * !#en
         * Enable joint motor?
         * !#zh
         * 是否开启关节马达？
         * @property {Boolean} enableMotor
         * @default false
         */
        enableMotor: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.enableMotor',            
            get: function () {
                return this._enableMotor;
            },
            set: function (value) {
                this._enableMotor = value;
                if (this._joint) {
                    this._joint.EnableMotor(value);
                }
            }
        },

        /**
         * !#en
         * The spring frequency.
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
         * @default 0
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
        var def = new b2.WheelJointDef();
        def.localAnchorA = new b2.Vec2(this.anchor.x/PTM_RATIO, this.anchor.y/PTM_RATIO);
        def.localAnchorB = new b2.Vec2(this.connectedAnchor.x/PTM_RATIO, this.connectedAnchor.y/PTM_RATIO);
        
        def.localAxisA = new b2.Vec2(this.localAxisA.x, this.localAxisA.y);
        
        def.maxMotorTorque = this.maxMotorTorque;
        def.motorSpeed = this.motorSpeed * ANGLE_TO_PHYSICS_ANGLE;
        def.enableMotor = this.enableMotor;

        def.dampingRatio = this.dampingRatio;
        def.frequencyHz = this.frequency;

        return def;
    }
});

cc.WheelJoint = module.exports = WheelJoint;
