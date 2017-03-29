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

var CC_PTM_RATIO = require('../CCPhysicsTypes').CC_PTM_RATIO;
var CC_TO_PHYSICS_ANGLE = require('../CCPhysicsTypes').CC_TO_PHYSICS_ANGLE;

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

        linearOffset: {
            get: function () {
                return this._linearOffset;
            },
            set: function (value) {
                this._linearOffset = value;
                if (this._joint) {
                    this._joint.SetLinearOffset( new b2.Vec2(value.x/CC_PTM_RATIO, value.y/CC_PTM_RATIO) );
                }
            }
        },

        angularOffset: {
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

        maxForce: {
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

        maxTorque: {
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

        correctionFactor: {
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
        def.linearOffset = new b2.Vec2(this.linearOffset.x/CC_PTM_RATIO, this.linearOffset.y/CC_PTM_RATIO);
        def.angularOffset = this.angularOffset * CC_TO_PHYSICS_ANGLE;
        def.maxForce = this.maxForce;
        def.maxTorque = this.maxTorque;
        def.correctionFactor = this.correctionFactor;

        return def;
    }
});

cc.MotorJoint = module.exports = MotorJoint;
