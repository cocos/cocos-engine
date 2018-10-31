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
var PHYSICS_ANGLE_TO_ANGLE = require('../CCPhysicsTypes').PHYSICS_ANGLE_TO_ANGLE;

/**
 * !#en
 * A revolute joint constrains two bodies to share a common point while they
 * are free to rotate about the point. The relative rotation about the shared
 * point is the joint angle. You can limit the relative rotation with
 * a joint limit that specifies a lower and upper angle. You can use a motor
 * to drive the relative rotation about the shared point. A maximum motor torque
 * is provided so that infinite forces are not generated.
 * !#zh
 * 旋转关节可以约束两个刚体围绕一个点来进行旋转。
 * 你可以通过开启关节限制来限制旋转的最大角度和最小角度。
 * 你可以通过开启马达来施加一个扭矩力来驱动这两个刚体在这一点上的相对速度。
 * @class RevoluteJoint
 * @extends Joint
 */
var RevoluteJoint = cc.Class({
    name: 'cc.RevoluteJoint',
    extends: cc.Joint,
    
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.physics/Joint/Revolute',
        inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
    },

    properties: {
        _maxMotorTorque: 0,
        _motorSpeed: 0,
        _enableLimit: false,
        _enableMotor: false,
        
        /**
         * !#en
         * The reference angle.
         * An angle between bodies considered to be zero for the joint angle.
         * !#zh
         * 相对角度。
         * 两个物体之间角度为零时可以看作相等于关节角度
         * @property {Number} referenceAngle
         * @default 0
         */
        referenceAngle: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.referenceAngle',
        },

        /**
         * !#en
         * The lower angle.
         * !#zh
         * 角度的最低限制。
         * @property {Number} lowerAngle
         * @default 0
         */
        lowerAngle: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.lowerAngle'            
        },
        /**
         * !#en
         * The upper angle.
         * !#zh
         * 角度的最高限制。
         * @property {Number} upperAngle
         * @default 0
         */
        upperAngle: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.upperAngle'
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
         * Enable joint limit?
         * !#zh
         * 是否开启关节的限制？
         * @property {Boolean} enableLimit
         * @default false
         */
        enableLimit: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.enableLimit',            
            get: function () {
                return this._enableLimit;
            },
            set: function (value) {
                this._enableLimit = value;
                if (this._joint) {
                    this._joint.EnableLimit(value);
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
        }
    },

    /**
     * !#en
     * Get the joint angle.
     * !#zh
     * 获取关节角度。
     * @method getJointAngle
     * @return {Number}
     */
    getJointAngle: function () {
        if (this._joint) {
            return this._joint.GetJointAngle() * PHYSICS_ANGLE_TO_ANGLE;
        }
        return 0;
    },

    /**
     * #!en
     * Set the max and min limit angle.
     * #!zh
     * 设置关节的角度最大和最小角度。
     * @param {Number} lower 
     * @param {Number} upper 
     */
    setLimits (lower, upper) {
        if (this._joint) {
            return this._joint.SetLimits(lower * ANGLE_TO_PHYSICS_ANGLE, upper * ANGLE_TO_PHYSICS_ANGLE);
        }
    },

    _createJointDef: function () {
        var def = new b2.RevoluteJointDef();
        def.localAnchorA = new b2.Vec2(this.anchor.x/PTM_RATIO, this.anchor.y/PTM_RATIO);
        def.localAnchorB = new b2.Vec2(this.connectedAnchor.x/PTM_RATIO, this.connectedAnchor.y/PTM_RATIO);

        // cocos degree 0 is to right, and box2d degree 0 is to up.
        def.lowerAngle = this.upperAngle* ANGLE_TO_PHYSICS_ANGLE;
        def.upperAngle = this.lowerAngle* ANGLE_TO_PHYSICS_ANGLE;
        
        def.maxMotorTorque = this.maxMotorTorque;
        def.motorSpeed = this.motorSpeed * ANGLE_TO_PHYSICS_ANGLE;
        def.enableLimit = this.enableLimit;
        def.enableMotor = this.enableMotor;

        def.referenceAngle = this.referenceAngle * ANGLE_TO_PHYSICS_ANGLE;

        return def;
    }
});

cc.RevoluteJoint = module.exports = RevoluteJoint;
