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

var MouseJoint = cc.Class({
    name: 'cc.MouseJoint',
    extends: cc.Joint,
    
    editor: CC_EDITOR && {
        inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
        menu: 'i18n:MAIN_MENU.component.physics/Joint/Mouse',
    },

    properties: {
        _target: 1,
        _frequency: 5,
        _dampingRatio: 0.7,
        _maxForce: 0,

        connectedBody: {
            default: null,
            type: cc.RigidBody,
            visible: false,
            override: true
        },

        collideConnected: {
            default: true,
            visible: false,
            override: true
        },

        anchor: {
            default: cc.v2(0, 0),
            visible: false
        },
        connectedAnchor: {
            default: cc.v2(0, 0),
            visible: false
        },

        mouseRegion: {
            default: null,
            type: cc.Node
        },

        target: {
            visible: false,
            get: function () {
                return this._target;
            },
            set: function (value) {
                this._target = value;
                if (this._joint) {
                    this._joint.SetTarget(new b2.Vec2(value.x/CC_PTM_RATIO, value.y/CC_PTM_RATIO));
                }
            }
        },

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
        },

        maxForce: {
            visible: false,
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
    },

    onLoad: function () {
        var mouseRegion = this.mouseRegion || this.node;
        mouseRegion.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        mouseRegion.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        mouseRegion.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    onEnable: function () {
    },

    start: function () {
    },

    onTouchBegan: function (event) {
        var manager = cc.director.getPhysicsManager();
        var target = event.touch.getLocation();
        var collider = manager.testPoint( target );
        if (!collider) return;

        var body = this.connectedBody = collider.body;
        body.awake = true;

        this.maxForce = 1000 * this.connectedBody.mass;
        this.target = target;

        this._init();
    },

    onTouchMove: function (event) {
        this.target = event.touch.getLocation();
    },

    onTouchEnd: function (event) {
        this._destroy();
    },

    _createJointDef: function () {
        var def = new b2.MouseJointDef();
        def.target = new b2.Vec2(this.target.x/CC_PTM_RATIO, this.target.y/CC_PTM_RATIO);
        def.maxForce = this.maxForce;
        def.dampingRatio = this.dampingRatio;
        def.frequencyHz = this.frequency;
        return def;
    }
});

cc.MouseJoint = module.exports = MouseJoint;
