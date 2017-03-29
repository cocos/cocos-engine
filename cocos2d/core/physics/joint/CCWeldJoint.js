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

var WeldJoint = cc.Class({
    name: 'cc.WeldJoint',
    extends: cc.Joint,
    
    editor: CC_EDITOR && {
        inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
        menu: 'i18n:MAIN_MENU.component.physics/Joint/Weld',
    },

    properties: {
        anchor: cc.v2(0, 0),
        connectedAnchor: cc.v2(0, 0),
        referenceAngle: 0,

        _frequency: 0,
        _dampingRatio: 0,

        frequency: {
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

        dampingRatio: {
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
        def.localAnchorA = new b2.Vec2(this.anchor.x/CC_PTM_RATIO, this.anchor.y/CC_PTM_RATIO);
        def.localAnchorB = new b2.Vec2(this.connectedAnchor.x/CC_PTM_RATIO, this.connectedAnchor.y/CC_PTM_RATIO);
        def.referenceAngle = this.referenceAngle * CC_TO_PHYSICS_ANGLE;

        def.frequencyHz = this.frequency;
        def.dampingRatio = this.dampingRatio;

        return def;
    }
});

cc.WeldJoint = module.exports = WeldJoint;
