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

var Joint = cc.Class({
    name: 'cc.Joint',
    extends: cc.Component,

    properties: {
        connectedBody: {
            default: null,
            type: cc.RigidBody
        },

        collideConnected: false,

        worldAnchor: {
            get: function () {
                if (this._joint) {
                    return this._joint.GetAnchorA();
                }
                return cc.Vec2.ZERO;
            },
            visible: false
        },

        worldConnectedAnchor: {
            get: function () {
                if (this._joint) {
                    return this._joint.GetAnchorB();
                }
                return cc.Vec2.ZERO;
            },
            visible: false
        },

        bodyA: {
            get: function () {
                if (this._joint) {
                    return this._joint.GetBodyA();
                }
                return null;
            },
            visible: false
        },

        bodyB: {
            get: function () {
                if (this._joint) {
                    return this._joint.GetBodyB();
                }
                return null;
            },
            visible: false
        }
    },

    onDisable: function () {
        this._destroy();
    },

    onEnable: function () {
        this._init();
    },

    start: function () {
        this._init();
    },

    apply: function () {
        this._destroy();
        this._init();
    },

    getReactionForce: function (inv_dt) {
        if (this._joint) {
            return this._joint.GetReactionForce(inv_dt);
        }
        return cc.Vec2.ZERO;
    },

    getReactionTorque: function (inv_dt) {
        if (this._joint) {
            return this._joint.GetReactionForce(inv_dt);
        }
        return 0;
    },

    _init: function () {
        cc.director.getPhysicsManager().pushDelayEvent(this, '__init', []);  
    },
    _destroy: function () {
        cc.director.getPhysicsManager().pushDelayEvent(this, '__destroy', []);
    },

    __init: function () {
        if (this._inited) return;

        this.body = this.getComponent(cc.RigidBody);
        
        if (this.body && this.body._getBody() &&
            this.connectedBody && this.connectedBody._getBody()) {

            var world = cc.director.getPhysicsManager()._getWorld();
            
            var def = this._createJointDef();
            if (!def) return;

            def.bodyA = this.body._getBody();
            def.bodyB = this.connectedBody._getBody();
            def.collideConnected = this.collideConnected;

            this._joint = world.CreateJoint(def);
            this._inited = true;
        }
    },
    __destroy: function () {
        if (!this._inited) return;

        if (this.body && this.body._getBody()) {
            cc.director.getPhysicsManager()._getWorld().DestroyJoint(this._joint);
        }
        
        this._joint = null;
        this._inited = false;
    },

    _createJointDef: function () {
        return null;
    }
});

cc.Joint = module.exports = Joint;
