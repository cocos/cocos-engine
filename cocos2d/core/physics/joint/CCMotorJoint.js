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
 * A motor joint is used to control the relative motion
 * between two bodies. A typical usage is to control the movement
 * of a dynamic body with respect to the ground.
 * !#zh
 * 马达关节被用来控制两个刚体间的相对运动。
 * 一个典型的例子是用来控制一个动态刚体相对于地面的运动。
 * @class MotorJoint
 * @extends Joint
 */
var MotorJoint = cc.Class({
    name: 'cc.MotorJoint',
    extends: cc.Joint,
    
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.physics/Joint/Motor',
        inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
    },

    properties: {
        _linearOffset: cc.v2(0, 0),
        _angularOffset: 0,
        _maxForce: 1,
        _maxTorque: 1,
        _correctionFactor: 0.3,

        /**
         * !#en
         * The anchor of the rigidbody.
         * !#zh
         * 刚体的锚点。
         * @property {Vec2} anchor
         * @default cc.v2(0, 0)
         */
        anchor: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.anchor',            
            default: cc.v2(0, 0),
            override: true,
            visible: false
        },
        /**
         * !#en
         * The anchor of the connected rigidbody.
         * !#zh
         * 关节另一端刚体的锚点。
         * @property {Vec2} connectedAnchor
         * @default cc.v2(0, 0)
         */
        connectedAnchor: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.connectedAnchor',
            default: cc.v2(0, 0),
            override: true,
            visible: false
        },


        /**
         * !#en
         * The linear offset from connected rigidbody to rigidbody.
         * !#zh
         * 关节另一端的刚体相对于起始端刚体的位置偏移量
         * @property {Vec2} linearOffset
         * @default cc.v2(0,0)
         */
        linearOffset: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.linearOffset',
            get: function () {
                return this._linearOffset;
            },
            set: function (value) {
                this._linearOffset = value;
                if (this._joint) {
                    this._joint.SetLinearOffset( new b2.Vec2(value.x/PTM_RATIO, value.y/PTM_RATIO) );
                }
            }
        },

        /**
         * !#en
         * The angular offset from connected rigidbody to rigidbody.
         * !#zh
         * 关节另一端的刚体相对于起始端刚体的角度偏移量
         * @property {Number} angularOffset
         * @default 0
         */
        angularOffset: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.angularOffset',            
            get: function () {
                return this._angularOffset;
            },
            set: function (value) {
                this._angularOffset = value;
                if (this._joint) {
                    this._joint.SetAngularOffset(value);
                }
            }
        },

        /**
         * !#en
         * The maximum force can be applied to rigidbody.
         * !#zh
         * 可以应用于刚体的最大的力值
         * @property {Number} maxForce
         * @default 1
         */
        maxForce: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.maxForce',
            get: function () {
                return this._maxForce;
            },
            set: function (value) {
                this._maxForce = value;
                if (this._joint) {
                    this._joint.SetMaxForce(value);
                }
            }
        },

        /**
         * !#en
         * The maximum torque can be applied to rigidbody.
         * !#zh
         * 可以应用于刚体的最大扭矩值
         * @property {Number} maxTorque
         * @default 1
         */
        maxTorque: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.maxTorque',            
            get: function () {
                return this._maxTorque;
            },
            set: function (value) {
                this._maxTorque = value;
                if (this._joint) {
                    this._joint.SetMaxTorque(value);
                }
            }
        },

        /**
         * !#en
         * The position correction factor in the range [0,1].
         * !#zh
         * 位置矫正系数，范围为 [0, 1]
         * @property {Number} correctionFactor
         * @default 0.3
         */
        correctionFactor: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.correctionFactor',
            get: function () {
                return this._correctionFactor;
            },
            set: function (value) {
                this._correctionFactor = value;
                if (this._joint) {
                    this._joint.SetCorrectionFactor(value);
                }
            }
        },
    },

    _createJointDef: function () {
        var def = new b2.MotorJointDef();
        def.linearOffset = new b2.Vec2(this.linearOffset.x/PTM_RATIO, this.linearOffset.y/PTM_RATIO);
        def.angularOffset = this.angularOffset * ANGLE_TO_PHYSICS_ANGLE;
        def.maxForce = this.maxForce;
        def.maxTorque = this.maxTorque;
        def.correctionFactor = this.correctionFactor;

        return def;
    }
});

cc.MotorJoint = module.exports = MotorJoint;
