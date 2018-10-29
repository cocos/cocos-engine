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
 * A prismatic joint. This joint provides one degree of freedom: translation
 * along an axis fixed in rigidbody. Relative rotation is prevented. You can
 * use a joint limit to restrict the range of motion and a joint motor to
 * drive the motion or to model joint friction.
 * !#zh
 * 移动关节指定了只能在一个方向上移动刚体。
 * 你可以开启关节限制来设置刚体运行移动的间距，也可以开启马达来使用关节马达驱动刚体的运行。
 * @class PrismaticJoint
 * @extends Joint
 */
var PrismaticJoint = cc.Class({
    name: 'cc.PrismaticJoint',
    extends: cc.Joint,
    
    editor: CC_EDITOR && {
        inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
        menu: 'i18n:MAIN_MENU.component.physics/Joint/PrismaticJoint',
    },

    properties: {
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
         * The reference angle.
         * !#zh
         * 相对角度
         * @property {Number} referenceAngle
         * @default 0
         */
        referenceAngle: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.referenceAngle'            
        },

        /**
         * !#en
         * Enable joint distance limit?
         * !#zh
         * 是否开启关节的距离限制？
         * @property {Boolean} enableLimit
         * @default false
         */
        enableLimit: {
            default: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.enableLimit'
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
            default: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.enableMotor'            
        },

        /**
         * !#en
         * The lower joint limit.
         * !#zh
         * 刚体能够移动的最小值
         * @property {Number} lowerLimit
         * @default 0
         */
        lowerLimit: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.lowerLimit'
        },
        /**
         * !#en
         * The upper joint limit.
         * !#zh
         * 刚体能够移动的最大值
         * @property {Number} upperLimit
         * @default 0
         */
        upperLimit: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.upperLimit'            
        },

        _maxMotorForce: 0,
        _motorSpeed: 0,

        /**
         * !#en
         * The maxium force can be applied to rigidbody to rearch the target motor speed.
         * !#zh
         * 可以施加到刚体的最大力。
         * @property {Number} maxMotorForce
         * @default 0
         */
        maxMotorForce: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.maxMotorForce',
            get: function () {
                return this._maxMotorForce;
            },
            set: function (value) {
                this._maxMotorForce = value;
                if (this._joint) {
                    this._joint.SetMaxMotorForce(value);
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
                    this._joint.SetMotorSpeed(value);
                }
            }
        },
    },

    _createJointDef: function () {
        var def = new b2.PrismaticJointDef();
        def.localAnchorA = new b2.Vec2(this.anchor.x/PTM_RATIO, this.anchor.y/PTM_RATIO);
        def.localAnchorB = new b2.Vec2(this.connectedAnchor.x/PTM_RATIO, this.connectedAnchor.y/PTM_RATIO);
        def.localAxisA = new b2.Vec2(this.localAxisA.x, this.localAxisA.y);
        def.referenceAngle = this.referenceAngle * ANGLE_TO_PHYSICS_ANGLE;
        def.enableLimit = this.enableLimit;
        def.lowerTranslation = this.lowerLimit/PTM_RATIO;
        def.upperTranslation = this.upperLimit/PTM_RATIO;
        def.enableMotor = this.enableMotor;
        def.maxMotorForce = this.maxMotorForce;
        def.motorSpeed = this.motorSpeed;
        
        return def;
    }
});

cc.PrismaticJoint = module.exports = PrismaticJoint;
