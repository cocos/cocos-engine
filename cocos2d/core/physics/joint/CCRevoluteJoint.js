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

var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;
var CC_TO_PHYSICS_ANGLE = require('../CCPhysicsTypes').CC_TO_PHYSICS_ANGLE;
var PHYSICS_TO_CC_ANGLE = require('../CCPhysicsTypes').PHYSICS_TO_CC_ANGLE;

var RevoluteJoint = cc.Class({
    name: 'cc.RevoluteJoint',
    extends: cc.Joint,
    
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.physics/Joint/Revolute',
        inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
    },

    properties: {
        anchor: cc.v2(0, 0),
        connectedAnchor: cc.v2(0, 0),

        referenceAngle: 0,
        lowerAngle: 0,
        upperAngle: 0,

        _maxMotorTorque: 0,
        _motorSpeed: 0,
        _enableLimit: false,
        _enableMotor: false,

        maxMotorTorque: {
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

        motorSpeed: {
            get: function () {
                return this._motorSpeed;
            },
            set: function (value) {
                this._motorSpeed = value;
                if (this._joint) {
                    this._joint.SetMotorSpeed(value * CC_TO_PHYSICS_ANGLE);
                }
            }
        },

        enableLimit: {
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

        enableMotor: {
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

        jointAngle: {
            visible: false,
            get: function () {
                if (this._joint) {
                    return this._joint.GetJointAngle() * PHYSICS_TO_CC_ANGLE;
                }
                return 0;
            }
        }
    },

    _createJointDef: function () {
        var def = new b2.RevoluteJointDef();
        def.localAnchorA = new b2.Vec2(this.anchor.x/PTM_RATIO, this.anchor.y/PTM_RATIO);
        def.localAnchorB = new b2.Vec2(this.connectedAnchor.x/PTM_RATIO, this.connectedAnchor.y/PTM_RATIO);

        // cocos degree 0 is to right, and box2d degree 0 is to up.
        def.lowerAngle = (this.upperAngle + 90) * CC_TO_PHYSICS_ANGLE;
        def.upperAngle = (this.lowerAngle + 90) * CC_TO_PHYSICS_ANGLE;
        
        def.maxMotorTorque = this.maxMotorTorque;
        def.motorSpeed = this.motorSpeed * CC_TO_PHYSICS_ANGLE;
        def.enableLimit = this.enableLimit;
        def.enableMotor = this.enableMotor;

        def.referenceAngle = this.referenceAngle * CC_TO_PHYSICS_ANGLE;

        return def;
    }
});

cc.RevoluteJoint = module.exports = RevoluteJoint;
