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
 * A distance joint constrains two points on two bodies
 * to remain at a fixed distance from each other. You can view
 * this as a massless, rigid rod.
 * !#zh
 * 距离关节通过一个固定的长度来约束关节链接的两个刚体。你可以将它想象成一个无质量，坚固的木棍。
 * @class DistanceJoint
 * @extends Joint
 */
var DistanceJoint = cc.Class({
    name: 'cc.DistanceJoint',
    extends: cc.Joint,
    
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.physics/Joint/Distance',
        inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
    },

    properties: {
        _distance: 1,
        _frequency: 0,
        _dampingRatio: 0,

        /**
         * !#en
         * The distance separating the two ends of the joint.
         * !#zh
         * 关节两端的距离
         * @property {Number} distance
         * @default 1
         */
        distance: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.distance',            
            get: function () {
                return this._distance;
            },
            set: function (value) {
                this._distance = value;
                if (this._joint) {
                    this._joint.SetLength(value);
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
        var def = new b2.DistanceJointDef();
        def.localAnchorA = new b2.Vec2(this.anchor.x/PTM_RATIO, this.anchor.y/PTM_RATIO);
        def.localAnchorB = new b2.Vec2(this.connectedAnchor.x/PTM_RATIO, this.connectedAnchor.y/PTM_RATIO);
        def.length = this.distance/PTM_RATIO;
        def.dampingRatio = this.dampingRatio;
        def.frequencyHz = this.frequency;

        return def;
    }
});

cc.DistanceJoint = module.exports = DistanceJoint;
